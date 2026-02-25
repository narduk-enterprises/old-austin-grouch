# AGENTS.md — AI Agent Instructions

This is a **Nuxt 4 + Nuxt UI 4** template deployed to **Cloudflare Workers** with **D1 SQLite** (Drizzle ORM).

## Project Structure

```
app/                  # All frontend code (Nuxt 4 convention)
  components/         # Vue components (thin — delegate logic to composables)
  composables/        # Business logic, state, data fetching
  pages/              # File-based routing
  layouts/            # Page layouts (default, blank, docs)
  middleware/         # Route guards
  types/              # Shared TypeScript interfaces
  assets/css/main.css # Tailwind CSS 4 @theme tokens
  app.config.ts       # Nuxt UI color tokens (primary/neutral)
server/
  api/                # Nitro endpoints — use [name].[method].ts naming
  database/           # Drizzle schema definitions
  middleware/         # CSRF, rate limiting, D1 injection
  utils/              # WebCrypto hashing, DB helpers
content/              # @nuxt/content markdown files
drizzle/              # SQL migration files
.agents/workflows/    # Antigravity audit workflows (run via /slash-commands)
```

## Hard Constraints (Cloudflare Workers)

- **NO Node.js modules** — no `fs`, `path`, `crypto`, `bcrypt`, `child_process`
- **Use Web Crypto API** — `crypto.subtle` for all hashing (PBKDF2)
- **Nitro preset** is `cloudflare-module` (ES Module format, V8 isolates)
- **Drizzle ORM only** — no Prisma or other Node-dependent ORMs
- All server code must be stateless across requests (edge isolate model)

## Nuxt UI 4 Rules

- `UDivider` → renamed to **`USeparator`** in v4
- Icons use `i-` prefix: `i-lucide-home`, not `name="heroicons-..."`
- Use design token colors (`primary`, `neutral`) not arbitrary color strings
- Tailwind CSS 4 — configure via `@theme` in `main.css`, not `tailwind.config`

## SEO (Required on Every Page)

Every page **must** call both:

```ts
useSeo({
  title: '...',
  description: '...',
  ogImage: { title: '...', description: '...', icon: '🎯' },
});
useWebPageSchema({ name: '...', description: '...' }); // or useArticleSchema, useProductSchema, etc.
```

Sitemap and robots.txt are automatic. OG image templates live in `app/components/OgImage/`.

## Architecture Patterns

- **Thin Components, Thick Composables** — components subscribe to composables, pass props down, emit events up. No inline fetch or complex logic in templates.
- **SSR-safe state** — use `useState()` or Pinia stores. Never use bare `ref()` at module scope (causes cross-request leaks).
- **Data fetching** — always use `useAsyncData` or `useFetch`, never raw `$fetch` in `<script setup>`.
- **Client-only code** — wrap `window`/`document` access in `onMounted` or `<ClientOnly>`.

## Starting a New Project from This Template

1. Install dependencies
2. Delete demo files: `app/pages/components.vue`, `app/pages/todos.vue`, `server/api/todos*`, `app/components/AuthDemo.vue`
3. Keep: `app/app.vue`, `server/utils/auth.ts`, `server/api/auth/*`, `server/database/schema.ts`
4. Update `nuxt.config.ts` `site` block with your domain and site name

## Quality Audit Workflows

Run these during development (Antigravity slash-commands, or manually follow the steps):

| Workflow                  | Purpose                                             |
| ------------------------- | --------------------------------------------------- |
| `/check-nuxt-ui-v4`       | Validates UI 4 component usage                      |
| `/check-nuxt-ssr`         | Validates SSR-safe data fetching and hydration      |
| `/check-store-separation` | Validates thin component / thick composable pattern |
| `/check-nitro-edge`       | Validates Cloudflare Workers compatibility          |
