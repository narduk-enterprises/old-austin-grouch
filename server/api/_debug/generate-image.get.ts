/**
 * Temporary endpoint to generate a hero image for a specific post.
 * Usage: GET /api/_debug/generate-image?slug=the-end-of-the-free-bbq-era...
 * DELETE THIS FILE after use.
 */
export default defineEventHandler(async (event) => {
  const slug = getQuery(event).slug as string
  if (!slug) return { error: 'Missing ?slug= parameter' }

  const env = event.context.cloudflare?.env || {}
  const ai = env.AI
  if (!ai) return { error: 'No AI binding available' }

  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())

  const prompt = `Editorial cartoon illustration, warm amber and sepia tones, hand-drawn comic book style with bold outlines and crosshatching. Scene depicts: "${title}" set in Austin Texas. Show a nostalgic BBQ scene with long lines of hipsters outside a trendy BBQ joint contrasted with an old timer grilling peacefully in his backyard. Include satirical details, Texas landscape elements, and a nostalgic vs modern contrast. Wide aspect ratio, 1200x630 banner composition. No text or words in the image.`

  const imageResponse = await ai.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', {
    prompt,
    num_steps: 20,
    guidance: 7.5,
  })

  // Return as PNG
  return new Response(imageResponse as any, {
    headers: { 'Content-Type': 'image/png' }
  })
})
