<script setup lang="ts">
import { getSeriesBySlug } from '~/utils/series'

usePageSeo({
  title: 'Search — Old Austin Grouch',
  description: 'Search through all gripes, complaints, and love letters to old Austin.',
})

const query = ref('')
const { data: allPosts } = await useAsyncData('search-posts', () =>
  queryCollection('posts').order('date', 'DESC').all(),
)

const results = computed(() => {
  const q = query.value.toLowerCase().trim()
  if (!q || !allPosts.value) return []

  return allPosts.value.filter((post) => {
    const searchable = [
      post.title,
      post.excerpt,
      post.series,
      ...(post.tags ?? []),
    ].join(' ').toLowerCase()
    return searchable.includes(q)
  })
})

const hasSearched = computed(() => query.value.trim().length > 0)
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <h1 class="font-display text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-2">
      Search the Archive
    </h1>
    <p class="text-stone-600 dark:text-stone-400 mb-8">
      Find the specific gripe you're looking for. We've got a lot of them.
    </p>

    <!-- Search input -->
    <div class="mb-8">
      <UInput
        v-model="query"
        placeholder="Search posts, series, tags..."
        icon="i-lucide-search"
        size="xl"
        autofocus
        class="w-full"
      />
    </div>

    <!-- Results -->
    <div v-if="hasSearched">
      <p class="text-sm text-stone-500 mb-6">
        {{ results.length }} {{ results.length === 1 ? 'result' : 'results' }} for "{{ query }}"
      </p>

      <div v-if="results.length" class="space-y-4">
        <NuxtLink
          v-for="post in results"
          :key="post.path"
          :to="post.path"
          class="block group"
        >
          <div class="flex gap-4 p-4 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800/50 transition-colors">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <UBadge
                  v-if="getSeriesBySlug(post.series)"
                  :label="getSeriesBySlug(post.series)!.title"
                  :color="(getSeriesBySlug(post.series)!.color as any)"
                  variant="subtle"
                  size="xs"
                />
                <span class="text-xs text-stone-400">{{ post.readingTime }}</span>
              </div>
              <h3 class="font-display font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors truncate">
                {{ post.title }}
              </h3>
              <p class="text-sm text-stone-500 line-clamp-2 mt-1">{{ post.excerpt }}</p>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="text-center py-12">
        <UIcon name="i-lucide-search-x" class="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-4" />
        <p class="text-stone-500">Nothing found. Try another search, or just browse the <NuxtLink to="/posts" class="text-amber-700 dark:text-amber-400 underline">full archive</NuxtLink>.</p>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-12">
      <UIcon name="i-lucide-search" class="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-4" />
      <p class="text-stone-500">Start typing to search across all posts, series, and tags.</p>
    </div>
  </div>
</template>
