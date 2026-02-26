import { defineNitroPlugin } from 'nitropack/runtime'

export default defineNitroPlugin((nitroApp) => {
  // @ts-ignore
  nitroApp.hooks.hook('cloudflare:scheduled', async ({ event, env }) => {
    try {
      console.log('Cron triggered. Starting weekly AI blog post generation...')
      
      const githubToken = env.GITHUB_TOKEN || process.env.GITHUB_TOKEN
      if (!githubToken) {
        console.error('Missing GITHUB_TOKEN environment variable. Aborting.')
        return
      }

      // Generate content using Cloudflare AI
      const ai = env.AI
      if (!ai) {
        console.error('Missing AI binding. Make sure it is configured in wrangler.json. Aborting.')
        return
      }

      const prompt = `
You are a jaded, satirical, long-time resident of Austin, Texas writing a blog post.
The blog is called "Old Austin Grouch". Your goal is to write a highly opinionated, nostalgic, and funny article about something that has changed (for the worse, in your opinion) in Austin.

Focus on topics like: gentrification, traffic, the tech bro invasion, expensive breakfast tacos, waiting in line for hours for BBQ, condos replacing historic music venues, the loss of "Keep Austin Weird", or how everything was better and cheaper in 2008.

Requirements:
1. The output MUST be in Markdown format.
2. It MUST start with a YAML frontmatter block containing 'title', 'date', 'series', 'tags', 'excerpt', and 'readingTime'.
3. The 'author' is always "The Grouch".
4. The 'series' should be something like "things-we-lost", "california-invasion", or "prices-are-too-damn-high".
5. Use a very dry, sarcastic, hyper-specific tone.
6. The length MUST be at least 600 words long. Do not write a short summary. Write a full, detailed, multi-paragraph rant.

Example Frontmatter:
---
title: "The $14 Breakfast Taco is an Affront to God"
date: "YYYY-MM-DD"
series: "prices-are-too-damn-high"
tags: ["breakfast-tacos", "california", "pricing"]
excerpt: "A short sarcastic summary here."
readingTime: "3 min read"
---
`

      console.log('Sending prompt to Cloudflare Workers AI (llama-3.1-8b-instruct)...')
      const response = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500
      })

      const markdownContent = response.response
      
      if (!markdownContent) {
         console.error('AI generated an empty response.')
         return
      }

      // Extract title to generate a filename slug
      const titleMatch = markdownContent.match(/title:\s*["']?(.*?)["']?\n/i)
      let filename = `generated-post-${Date.now()}.md`
      if (titleMatch && titleMatch[1]) {
         const slug = titleMatch[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
         filename = `${slug}.md`
      }

      console.log(`Generated post: ${filename}`)

      // Prepare GitHub API Commit
      const repo = 'loganrenz/old-austin-grouch'
      const path = `content/posts/${filename}`
      const url = `https://api.github.com/repos/${repo}/contents/${path}`

      // Update date in frontmatter to today
      const today = new Date().toISOString().split('T')[0]
      const finalContent = markdownContent.replace(/date:\s*["']?YYYY-MM-DD["']?/i, `date: "${today}"`)

      // Base64 encode the content correctly for unicode (btoa doesn't handle utf8)
      // Since this runs in Cloudflare Workers, we use built-in btoa but encodeURIComponent trick
      const base64Content = btoa(unescape(encodeURIComponent(finalContent)))

      const commitBody = {
        message: `feat(content): Weekly automated AI post: ${titleMatch ? titleMatch[1] : filename}`,
        content: base64Content,
        branch: 'main' // Change if your default branch is different
      }

      console.log(`Committing ${filename} to GitHub repository...`)
      
      const ghResponse = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Cloudflare-Worker-AI-Writer'
        },
        body: JSON.stringify(commitBody)
      })

      if (!ghResponse.ok) {
        const errorText = await ghResponse.text()
        console.error(`GitHub API Error (${ghResponse.status}): ${errorText}`)
        return
      }

      console.log(`Successfully committed new weekly post! Cron job complete.`)

    } catch (error) {
      console.error('Error during scheduled AI post generation:', error)
    }
  })
})
