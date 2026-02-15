// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxt/fonts',
    '@nuxt/eslint',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    'nuxt-schema-org',
  ],
  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-02-15',

  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  fonts: {
    families: [
      {
        name: 'Inter',
        provider: 'google',
        weights: [300, 400, 500, 600, 700],
        display: 'swap',
        global: true,
      },
      {
        name: 'Playfair Display',
        provider: 'google',
        weights: [400, 500, 600, 700, 800, 900],
        display: 'swap',
        global: true,
      },
    ],
  },

  ui: {
    colorMode: true,
  },

  colorMode: {
    preference: 'light',
  },

  vite: {
    css: {
      devSourcemap: true,
    },
    build: {
      cssMinify: 'lightningcss',
    },
  },

  runtimeConfig: {
    public: {
      siteUrl: process.env.SITE_URL || 'https://grouch.austin-texas.net',
      siteName: 'Old Austin Grouch',
    },
  },

  site: {
    url: 'https://grouch.austin-texas.net',
    name: 'Old Austin Grouch',
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },

  robots: {
    groups: [
      {
        userAgent: ['*'],
        allow: ['/'],
      },
    ],
    blockNonSeoBots: true,
  },

  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'Old Austin Grouch',
      url: 'https://grouch.austin-texas.net',
      logo: '/img/logo.png',
      description:
        'Comedic Austin nostalgia satire. Dry, sharp, hyper-specific cultural commentary from someone who remembers when this town was weird for free.',
    },
  },

  nitro: {
    preset: 'cloudflare_module',
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    routeRules: {
      '/_nuxt/**': {
        headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
      },
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/about': { prerender: true },
    '/subscribe': { prerender: true },
    '/search': { prerender: true },
    '/posts': { prerender: true },
    '/posts/**': { prerender: true },
    '/series/**': { prerender: true },
  },

  app: {
    head: {
      title: 'Old Austin Grouch — Comedic Austin Nostalgia Satire',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        {
          name: 'description',
          content:
            'Comedic Austin nostalgia satire. Dry, sharp, hyper-specific cultural commentary from someone who remembers when this town was weird for free.',
        },
        { name: 'theme-color', content: '#78350f' },
        { name: 'geo.region', content: 'US-TX' },
        { name: 'geo.placename', content: 'Austin' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/img/logo.png' },
        { rel: 'apple-touch-icon', href: '/img/logo.png' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
})
