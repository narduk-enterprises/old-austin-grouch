import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    posts: defineCollection({
      type: 'page',
      source: 'posts/*.md',
      schema: z.object({
        title: z.string(),
        date: z.string(),
        series: z.string(),
        tags: z.array(z.string()).default([]),
        summary: z.string().optional(),
        heroImage: z.string().optional(),
        ogImage: z.string().optional(),
        canonical: z.string().optional(),
        readingTime: z.string().default('3 min read'),
        shareLine: z.string().optional(),
      }),
    }),
  },
})
