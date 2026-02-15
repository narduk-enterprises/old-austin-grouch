/**
 * usePageSeo — one-liner per page to set all SEO meta tags.
 */
export function usePageSeo(opts: {
  title: string
  description: string
  image?: string
  type?: 'website' | 'article' | 'profile'
}) {
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()
  const siteUrl = (runtimeConfig.public.siteUrl as string || 'https://oldaustingrouch.com').replace(/\/$/, '')
  const canonicalUrl = `${siteUrl}${route.path}`
  const ogImageUrl = opts.image
    ? (opts.image.startsWith('http') ? opts.image : `${siteUrl}${opts.image}`)
    : `${siteUrl}/img/og-default.png`

  useSeoMeta({
    title: opts.title,
    ogTitle: opts.title,
    description: opts.description,
    ogDescription: opts.description,
    ogUrl: canonicalUrl,
    ogType: opts.type || 'website',
    ogImage: ogImageUrl,
    twitterCard: 'summary_large_image',
    twitterTitle: opts.title,
    twitterDescription: opts.description,
    twitterImage: ogImageUrl,
  })

  useHead({
    link: [{ rel: 'canonical', href: canonicalUrl }],
  })
}
