// deploy-trigger: 2026-03-04T20:40:25Z
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@narduk-enterprises/narduk-nuxt-template-layer'],
  modules: ['nitro-cloudflare-dev', '@nuxt/content'],
  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4
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
    colorMode: true
  },

  colorMode: {
    preference: 'dark'
  },

  runtimeConfig: {
    // Server-only (admin API routes)
    googleServiceAccountKey: process.env.GSC_SERVICE_ACCOUNT_JSON || '',
    posthogApiKey: process.env.POSTHOG_PERSONAL_API_KEY || '',
    gaPropertyId: process.env.GA_PROPERTY_ID || '',
    posthogProjectId: process.env.POSTHOG_PROJECT_ID || '',
    public: {
      appUrl: process.env.SITE_URL || 'https://grouch.austin-texas.net',
      appName: process.env.APP_NAME || 'Old Austin Grouch',
      // Analytics
      posthogPublicKey: process.env.POSTHOG_PUBLIC_KEY || '',
      posthogHost: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
      gaMeasurementId: process.env.GA_MEASUREMENT_ID || '',
      posthogProjectId: process.env.POSTHOG_PROJECT_ID || '',
      // IndexNow
      indexNowKey: process.env.INDEXNOW_KEY || '',
    }
  },

  // ─── SEO Configuration (@nuxtjs/seo) ──────────────────────────
  // This single config block powers sitemap, robots, schema.org,
  // OG images, and site-wide SEO defaults. Individual pages override
  // these via the `useSeo()` composable.

  site: {
    url: process.env.SITE_URL || 'https://grouch.austin-texas.net',
    name: 'Old Austin Grouch',
    description: 'Comedic Austin nostalgia satire. Dry, sharp, hyper-specific cultural commentary from someone who remembers when this town was weird for free.',
    defaultLocale: 'en',
  },

  ogImage: {
    defaults: {
      component: 'OgImageDefault',
    },
  },

  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'Old Austin Grouch',
      url: process.env.SITE_URL || 'https://grouch.austin-texas.net',
      logo: '/img/logo.png',
    },
  },

  image: {
    provider: 'cloudflare',
    cloudflare: {
      baseURL: process.env.SITE_URL
    },
  },

  content: {
    // @nuxt/content v3 — edge-compatible, SQL-based storage
    build: {
      markdown: {
        toc: { depth: 3 },
        highlight: {
          langs: ['typescript', 'vue', 'bash', 'json', 'css', 'html'],
        },
      },
    },
  },

  sitemap: {},

  robots: {
    groups: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },

  // ─── Nitro (Cloudflare Workers) ────────────────────────────────

  nitro: {
    cloudflareDev: { configPath: resolve(__dirname, 'wrangler.json') },
    preset: 'cloudflare-module',
    esbuild: {
      options: {
        target: 'esnext'
      }
    },
    externals: {
      inline: ['drizzle-orm']
    },
    rollupConfig: {
      plugins: [
        {
          name: 'fix-og-image-mock',
          resolveId(id: string) {
            if (id.includes('nuxt-og-image') && id.includes('proxy-cjs')) {
              return { id: './node_modules/nuxt-og-image/dist/runtime/mock/proxy-cjs.js', external: false }
            }
          },
        },
      ],
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'theme-color', content: '#0a0f1a' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  }
})
