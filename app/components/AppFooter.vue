<script setup lang="ts">
const { seriesList } = useSiteData()
const year = new Date().getFullYear()
</script>

<template>
  <div class="border-t border-default bg-muted">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="sm:col-span-2 lg:col-span-1">
          <NuxtLink to="/" class="text-lg font-display font-bold text-primary">
            Old Austin Grouch
          </NuxtLink>
          <p class="mt-2 text-sm text-muted leading-relaxed">
            Comedic Austin nostalgia satire. We remember when this town was weird for free.
          </p>
        </div>

        <!-- Navigation -->
        <div>
          <h3 class="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Navigate</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/posts" class="text-sm text-muted hover:text-primary dark:hover:text-primary transition-colors">All Posts</NuxtLink></li>
            <li><NuxtLink to="/about" class="text-sm text-muted hover:text-primary dark:hover:text-primary transition-colors">About</NuxtLink></li>
            <li><NuxtLink to="/subscribe" class="text-sm text-muted hover:text-primary dark:hover:text-primary transition-colors">Subscribe</NuxtLink></li>
            <li><NuxtLink to="/search" class="text-sm text-muted hover:text-primary dark:hover:text-primary transition-colors">Search</NuxtLink></li>
          </ul>
        </div>

        <!-- Series -->
        <div>
          <h3 class="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Series</h3>
          <ul class="space-y-2">
            <li v-for="s in seriesList" :key="s.slug">
              <NuxtLink :to="`/series/${s.slug}`" class="text-sm text-muted hover:text-primary dark:hover:text-primary transition-colors">
                {{ s.title }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Disclaimer -->
        <div>
          <h3 class="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Disclaimer</h3>
          <p class="text-xs text-muted leading-relaxed">
            This is satire. We love Austin — even the parts we complain about. All characters are fictional composites. No tech bros were harmed in the making of this website.
          </p>
        </div>
      </div>

      <USeparator class="my-8" />

      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs text-muted">
          &copy; {{ year }} Old Austin Grouch. All rights reserved. Keep Austin Grouchy.
        </p>
        <RandomGrouchButton size="xs" variant="ghost" />
      </div>
    </div>
  </div>
</template>
