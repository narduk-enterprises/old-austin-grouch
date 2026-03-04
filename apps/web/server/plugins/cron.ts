import { defineNitroPlugin } from 'nitropack/runtime'

export default defineNitroPlugin((nitroApp) => {
  // @ts-expect-error - Cloudflare scheduled hook types are incomplete
  nitroApp.hooks.hook('cloudflare:scheduled', async ({ env }: { event: any, env: any }) => {
    try {
      console.log('Cron triggered. Starting weekly AI blog post generation...')
      
      const githubToken = env.GITHUB_TOKEN || process.env.GITHUB_TOKEN
      if (!githubToken) {
        console.error('Missing GITHUB_TOKEN environment variable. Aborting.')
        return
      }

      const ai = env.AI
      if (!ai) {
        console.error('Missing AI binding. Make sure it is configured in wrangler.json. Aborting.')
        return
      }

      // ── Step 1: Generate the blog post text ──
      const postPrompt = `
You are a jaded, satirical, long-time resident of Austin, Texas writing a blog post.
The blog is called "Old Austin Grouch". Your goal is to write a highly opinionated, nostalgic, and funny article about something that has changed (for the worse, in your opinion) in Austin.

Focus on topics like: gentrification, traffic, the tech bro invasion, expensive breakfast tacos, waiting in line for hours for BBQ, condos replacing historic music venues, the loss of "Keep Austin Weird", or how everything was better and cheaper in 2008.

Requirements:
1. The output MUST be in Markdown format.
2. It MUST start with a YAML frontmatter block containing 'title', 'date', 'series', 'tags', 'summary', and 'readingTime'.
3. The 'author' is always "The Grouch".
4. The 'series' should be something like "things-we-lost", "california-invasion", or "prices-are-too-damn-high".
5. The 'summary' MUST be a non-empty, witty 1-2 sentence summary of the article in the same sarcastic tone. This is critical — never leave it blank or set it to null.
6. Use a very dry, sarcastic, hyper-specific tone.
7. The length MUST be at least 600 words long. Do not write a short summary. Write a full, detailed, multi-paragraph rant.

Example Frontmatter:
---
title: "The $14 Breakfast Taco is an Affront to God"
date: "YYYY-MM-DD"
series: "prices-are-too-damn-high"
tags: ["breakfast-tacos", "california", "pricing"]
summary: "Austin's signature food used to be cheap fuel, not a lifestyle brand. The $14 taco is here and it has truffle oil."
readingTime: "3 min read"
---
`

      console.log('Generating blog post text...')
      const textResponse = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [{ role: 'user', content: postPrompt }],
        max_tokens: 2500
      })

      const markdownContent = textResponse.response
      if (!markdownContent) {
        console.error('AI generated an empty post response.')
        return
      }

      // Extract title for filename and image prompt
      // eslint-disable-next-line regexp/no-super-linear-backtracking -- bounded title extraction
      const titleMatch = markdownContent.match(/title:\s*["']?([^"'\n]*)["']?\n/i)
      const title = titleMatch?.[1] || `Generated Post ${Date.now()}`
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      const filename = `${slug}.md`
      const imageFilename = `${slug}.png`

      console.log(`Generated post: "${title}" → ${filename}`)

      // Replace whatever date the AI generated with today's actual date
      const today = new Date().toISOString().split('T')[0]
      let finalContent = markdownContent.replace(/date:\s*["']?[^\n"']*["']?/i, `date: "${today}"`)

      // Inject heroImage and ogImage into frontmatter
      const heroImagePath = `/img/og/${imageFilename}`
      finalContent = finalContent.replace(
        /---\n/,
        `---\nheroImage: "${heroImagePath}"\nogImage: "${heroImagePath}"\n`
      )
      // Only inject once — after the first ---
      // If the AI already added heroImage/ogImage, remove duplicates
      const lines = finalContent.split('\n')
      const seenKeys = new Set<string>()
      const dedupedLines: string[] = []
      for (const line of lines) {
        const keyMatch = line.match(/^(heroImage|ogImage):/)
        if (keyMatch) {
          if (seenKeys.has(keyMatch[1])) continue
          seenKeys.add(keyMatch[1])
        }
        dedupedLines.push(line)
      }
      finalContent = dedupedLines.join('\n')

      // ── Step 2: Generate the hero image ──
      const imageStylePrompt = `Editorial cartoon illustration, warm amber and sepia tones, hand-drawn comic book style with bold outlines and crosshatching. Scene depicts: "${title}" set in Austin Texas. Include satirical details, Texas landscape elements, and a nostalgic vs modern contrast. Wide aspect ratio, 1200x630 banner composition. No text or words in the image.`

      console.log('Generating hero image with SDXL Lightning...')
      let imageBase64: string | null = null
      try {
        const imageResponse = await ai.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', {
          prompt: imageStylePrompt,
          num_steps: 20,
          guidance: 7.5,
        })

        // imageResponse is a ReadableStream or ArrayBuffer of PNG data
        if (imageResponse instanceof ReadableStream) {
          const reader = imageResponse.getReader()
          const chunks: Uint8Array[] = []
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            chunks.push(value)
          }
          const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
          const combined = new Uint8Array(totalLength)
          let offset = 0
          for (const chunk of chunks) {
            combined.set(chunk, offset)
            offset += chunk.length
          }
          // Convert to base64 using btoa with binary string
          let binary = ''
          for (let i = 0; i < combined.length; i++) {
            binary += String.fromCharCode(combined[i]!)
          }
          imageBase64 = btoa(binary)
        } else if (imageResponse instanceof ArrayBuffer || imageResponse instanceof Uint8Array) {
          const bytes = imageResponse instanceof ArrayBuffer ? new Uint8Array(imageResponse) : imageResponse
          let binary = ''
          for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]!)
          }
          imageBase64 = btoa(binary)
        }

        if (imageBase64) {
          console.log(`Hero image generated: ${Math.round(imageBase64.length / 1024)}KB`)
        }
      } catch (imgError) {
        console.error('Image generation failed (continuing without image):', imgError)
      }

      // ── Step 3: Upload to GitHub ──
      const repo = 'narduk-enterprises/old-austin-grouch'
      const ghHeaders = {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Cloudflare-Worker-AI-Writer'
      }

      // Upload the image first (if generated)
      if (imageBase64) {
        const imagePath = `public/img/og/${imageFilename}`
        const imageUrl = `https://api.github.com/repos/${repo}/contents/${imagePath}`

        console.log(`Uploading hero image to ${imagePath}...`)
        const imgResponse = await fetch(imageUrl, {
          method: 'PUT',
          headers: ghHeaders,
          body: JSON.stringify({
            message: `feat(content): Add hero image for ${title}`,
            content: imageBase64,
            branch: 'main'
          })
        })

        if (!imgResponse.ok) {
          const errorText = await imgResponse.text()
          console.error(`GitHub image upload failed (${imgResponse.status}): ${errorText}`)
          // Remove heroImage/ogImage from frontmatter since upload failed
          finalContent = finalContent.replace(/heroImage:.*\n/, '')
          finalContent = finalContent.replace(/ogImage:.*\n/, '')
        } else {
          console.log('Hero image uploaded successfully!')
        }
      } else {
        // No image generated — remove heroImage/ogImage from frontmatter
        finalContent = finalContent.replace(/heroImage:.*\n/, '')
        finalContent = finalContent.replace(/ogImage:.*\n/, '')
      }

      // Upload the markdown post
      const postPath = `content/posts/${filename}`
      const postUrl = `https://api.github.com/repos/${repo}/contents/${postPath}`
      const base64Content = btoa(unescape(encodeURIComponent(finalContent)))

      console.log(`Committing ${filename} to GitHub repository...`)
      const ghResponse = await fetch(postUrl, {
        method: 'PUT',
        headers: ghHeaders,
        body: JSON.stringify({
          message: `feat(content): Weekly automated AI post: ${title}`,
          content: base64Content,
          branch: 'main'
        })
      })

      if (!ghResponse.ok) {
        const errorText = await ghResponse.text()
        console.error(`GitHub API Error (${ghResponse.status}): ${errorText}`)
        return
      }

      console.log(`Successfully committed new weekly post with hero image! Cron job complete.`)

    } catch (error) {
      console.error('Error during scheduled AI post generation:', error)
    }
  })
})
