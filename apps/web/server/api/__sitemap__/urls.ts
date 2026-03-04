export default defineEventHandler(() => {
  // Post slugs for sitemap
  const postSlugs = [
    'the-domain-was-a-parking-lot',
    'rainey-street-remembers',
    'riverside-luxury-lofts',
    'east-sixth-glass-tower',
    'south-congress-condopocalypse',
    'sxsw-badge-price-timeline',
    'sxsw-porta-potty-census',
    'sxsw-free-stuff-quality-index',
    'sxsw-corporate-takeover-tracker',
    'sxsw-local-survival-guide',
    'breakfast-tacos-three-dollars',
    'lone-star-at-the-bar',
    'parking-downtown',
    'barton-springs-admission',
    'thrift-store-t-shirts',
    'blockchain-breakfast-taco',
    'ai-powered-queso-startup',
    'disrupting-the-kolache',
    'vc-funded-trailer-park',
    'the-standing-desk-rancher',
    'liberty-lunch-ghost-story',
    'the-hole-in-the-wall-legacy',
    'emos-original-location',
    'las-manitas-avenue-cafe',
    'the-armadillo-world-headquarters',
  ]

  const seriesSlugs = [
    'condos-of-shame',
    'sxsw-ruin-counter',
    'things-that-used-to-cost-three-dollars',
    'tech-bro-of-the-week',
    'lost-venues-and-dive-bars',
  ]

  return [
    ...postSlugs.map(slug => ({ loc: `/posts/${slug}`, changefreq: 'monthly', priority: 0.8 })),
    ...seriesSlugs.map(slug => ({ loc: `/series/${slug}`, changefreq: 'weekly', priority: 0.8 })),
  ]
})
