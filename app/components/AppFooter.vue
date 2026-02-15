<script setup lang="ts">
const { seriesList } = useSiteData()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="sm:col-span-2 lg:col-span-1">
          <NuxtLink to="/" class="text-lg font-display font-bold text-amber-900 dark:text-amber-400">
            Old Austin Grouch
          </NuxtLink>
          <p class="mt-2 text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            Comedic Austin nostalgia satire. We remember when this town was weird for free.
          </p>
        </div>

        <!-- Navigation -->
        <div>
          <h3 class="text-sm font-semibold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-3">Navigate</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="/posts" class="text-sm text-stone-600 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-400 transition-colors">All Posts</NuxtLink></li>
            <li><NuxtLink to="/about" class="text-sm text-stone-600 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-400 transition-colors">About</NuxtLink></li>
            <li><NuxtLink to="/subscribe" class="text-sm text-stone-600 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-400 transition-colors">Subscribe</NuxtLink></li>
            <li><NuxtLink to="/search" class="text-sm text-stone-600 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-400 transition-colors">Search</NuxtLink></li>
          </ul>
        </div>

        <!-- Series -->
        <div>
          <h3 class="text-sm font-semibold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-3">Series</h3>
          <ul class="space-y-2">
            <li v-for="s in seriesList" :key="s.slug">
              <NuxtLink :to="`/series/${s.slug}`" class="text-sm text-stone-600 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
                {{ s.title }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Disclaimer -->
        <div>
          <h3 class="text-sm font-semibold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-3">Disclaimer</h3>
          <p class="text-xs text-stone-500 dark:text-stone-500 leading-relaxed">
            This is satire. We love Austin — even the parts we complain about. All characters are fictional composites. No tech bros were harmed in the making of this website.
          </p>
        </div>
      </div>

      <UDivider class="my-8" />

      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs text-stone-500">
          &copy; {{ year }} Old Austin Grouch. All rights reserved. Keep Austin Grouchy.
        </p>
        <RandomGrouchButton size="xs" variant="ghost" />
      </div>
    </div>
  </footer>
</template>
