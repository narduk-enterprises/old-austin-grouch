export default defineEventHandler(async (event) => {
  // In Cloudflare Workers, bindings and environment variables are in event.context.cloudflare.env
  const cfEnv = event.context.cloudflare?.env || {}
  const githubToken = process.env.GITHUB_TOKEN || cfEnv.GITHUB_TOKEN
  
  if (!githubToken) {
    return { success: false, error: 'Missing GITHUB_TOKEN environment variable.' }
  }

  const ai = cfEnv.AI
  if (!ai) {
    return { success: false, error: 'Missing AI binding. Run with wrangler dev.' }
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
6. The length should be around 400-600 words.

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

  try {
    const response = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [{ role: 'user', content: prompt }]
    })

    const markdownContent = response.response
    if (!markdownContent) {
       return { success: false, error: 'AI generated an empty response.' }
    }

    const titleMatch = markdownContent.match(/title:\s*["']?(.*?)["']?\n/i)
    let filename = `generated-post-${Date.now()}.md`
    if (titleMatch && titleMatch[1]) {
       const slug = titleMatch[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
       filename = `${slug}.md`
    }

    // Prepare GitHub API Commit
    const repo = 'loganrenz/old-austin-grouch'
    const path = `content/posts/${filename}`
    const url = `https://api.github.com/repos/${repo}/contents/${path}`

    const today = new Date().toISOString().split('T')[0]
    const finalContent = markdownContent.replace(/date:\s*["']?YYYY-MM-DD["']?/i, `date: "${today}"`)
    const base64Content = btoa(unescape(encodeURIComponent(finalContent)))

    const commitBody = {
      message: `feat(content): Weekly automated AI post: ${titleMatch ? titleMatch[1] : filename}`,
      content: base64Content,
      branch: 'main'
    }

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
      return { success: false, error: `GitHub API Error (${ghResponse.status}): ${errorText}` }
    }

    return { success: true, message: `Successfully committed ${filename}`, filename }

  } catch (error: any) {
    return { success: false, error: error.message }
  }
})
