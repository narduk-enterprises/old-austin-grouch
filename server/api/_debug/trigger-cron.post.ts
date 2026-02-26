/**
 * Temporary endpoint to manually trigger the cron post+image generation.
 * Uses the same logic as the scheduled cron worker.
 * DELETE THIS FILE after testing.
 * 
 * Usage: POST /api/_debug/trigger-cron (requires X-Admin-Key header)
 */
export default defineEventHandler(async (event) => {
  // Basic protection
  const adminKey = getHeader(event, 'x-admin-key')
  if (adminKey !== 'grouch-test-2026') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const env = event.context.cloudflare?.env || {}
  const ai = env.AI
  const githubToken = env.GITHUB_TOKEN || process.env.GITHUB_TOKEN

  if (!ai) return { error: 'No AI binding' }
  if (!githubToken) return { error: 'No GITHUB_TOKEN' }

  const steps: string[] = []

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
5. The 'summary' MUST be a non-empty, witty 1-2 sentence summary of the article in the same sarcastic tone.
6. Use a very dry, sarcastic, hyper-specific tone.
7. The length MUST be at least 600 words long. Write a full, detailed, multi-paragraph rant.

Example Frontmatter:
---
title: "The $14 Breakfast Taco is an Affront to God"
date: "YYYY-MM-DD"
series: "prices-are-too-damn-high"
tags: ["breakfast-tacos", "california", "pricing"]
summary: "Austin's signature food used to be cheap fuel, not a lifestyle brand."
readingTime: "3 min read"
---
`

  steps.push('Generating post text...')
  const textResponse = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: [{ role: 'user', content: postPrompt }],
    max_tokens: 2500
  })

  const markdownContent = textResponse.response
  if (!markdownContent) return { error: 'Empty AI response', steps }
  steps.push('Post text generated')

  // Extract title and create slug
  const titleMatch = markdownContent.match(/title:\s*["']?(.*?)["']?\n/i)
  const title = titleMatch?.[1] || `Generated Post ${Date.now()}`
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  const filename = `${slug}.md`
  const imageFilename = `${slug}.png`
  steps.push(`Title: "${title}", slug: ${slug}`)

  // Fix date
  const today = new Date().toISOString().split('T')[0]
  let finalContent = markdownContent.replace(/date:\s*["']?[^\n"']*["']?/i, `date: "${today}"`)

  // Inject heroImage/ogImage into frontmatter
  const heroImagePath = `/img/og/${imageFilename}`
  finalContent = finalContent.replace(
    /---\n/,
    `---\nheroImage: "${heroImagePath}"\nogImage: "${heroImagePath}"\n`
  )
  // Dedup
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

  // ── Step 2: Generate hero image ──
  const imageStylePrompt = `Editorial cartoon illustration, warm amber and sepia tones, hand-drawn comic book style with bold outlines and crosshatching. Scene depicts: "${title}" set in Austin Texas. Include satirical details, Texas landscape elements, and a nostalgic vs modern contrast. Wide aspect ratio, 1200x630 banner composition. No text or words in the image.`

  steps.push('Generating hero image...')
  let imageBase64: string | null = null
  try {
    const imageResponse = await ai.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', {
      prompt: imageStylePrompt,
      num_steps: 20,
      guidance: 7.5,
    })

    if (imageResponse instanceof ReadableStream) {
      const reader = imageResponse.getReader()
      const chunks: Uint8Array[] = []
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
      }
      const totalLength = chunks.reduce((acc: number, chunk: Uint8Array) => acc + chunk.length, 0)
      const combined = new Uint8Array(totalLength)
      let offset = 0
      for (const chunk of chunks) {
        combined.set(chunk, offset)
        offset += chunk.length
      }
      let binary = ''
      for (let i = 0; i < combined.length; i++) {
        binary += String.fromCharCode(combined[i])
      }
      imageBase64 = btoa(binary)
    } else if (imageResponse instanceof ArrayBuffer || imageResponse instanceof Uint8Array) {
      const bytes = imageResponse instanceof ArrayBuffer ? new Uint8Array(imageResponse) : imageResponse
      let binary = ''
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      imageBase64 = btoa(binary)
    }

    if (imageBase64) {
      steps.push(`Image generated: ${Math.round(imageBase64.length / 1024)}KB`)
    } else {
      steps.push('Image response was not a recognized format')
    }
  } catch (imgError: any) {
    steps.push(`Image generation failed: ${imgError.message}`)
  }

  // ── Step 3: Upload to GitHub ──
  const repo = 'loganrenz/old-austin-grouch'
  const ghHeaders = {
    'Authorization': `Bearer ${githubToken}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Cloudflare-Worker-AI-Writer'
  }

  // Upload image
  if (imageBase64) {
    const imagePath = `public/img/og/${imageFilename}`
    const imageUrl = `https://api.github.com/repos/${repo}/contents/${imagePath}`
    steps.push(`Uploading image to ${imagePath}...`)
    
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
      steps.push(`Image upload failed (${imgResponse.status}): ${errorText.substring(0, 200)}`)
      finalContent = finalContent.replace(/heroImage:.*\n/, '')
      finalContent = finalContent.replace(/ogImage:.*\n/, '')
    } else {
      steps.push('Image uploaded to GitHub!')
    }
  } else {
    finalContent = finalContent.replace(/heroImage:.*\n/, '')
    finalContent = finalContent.replace(/ogImage:.*\n/, '')
  }

  // Upload markdown
  const postPath = `content/posts/${filename}`
  const postUrl = `https://api.github.com/repos/${repo}/contents/${postPath}`
  const base64Content = btoa(unescape(encodeURIComponent(finalContent)))

  steps.push(`Uploading post to ${postPath}...`)
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
    steps.push(`Post upload failed (${ghResponse.status}): ${errorText.substring(0, 200)}`)
    return { success: false, title, steps }
  }

  steps.push('Post uploaded to GitHub!')
  return { success: true, title, slug, filename, steps }
})
