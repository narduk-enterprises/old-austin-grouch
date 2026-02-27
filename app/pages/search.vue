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
      post.summary,
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
    <h1 class="font-display text-3xl sm:text-4xl font-bold text-primary mb-2">
      Search the Archive
    </h1>
    <p class="text-muted mb-8">
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
      <p class="text-sm text-muted mb-6">
        {{ results.length }} {{ results.length === 1 ? 'result' : 'results' }} for "{{ query }}"
      </p>

      <div v-if="results.length" class="space-y-4">
        <NuxtLink
          v-for="post in results"
          :key="post.path"
          :to="post.path"
          class="block group"
        >
          <div class="flex gap-4 p-4 rounded-lg hover:bg-muted dark:hover:bg-muted/50 transition-colors">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <UBadge
                  v-if="getSeriesBySlug(post.series)"
                  :label="getSeriesBySlug(post.series)!.title"
                  :color="(getSeriesBySlug(post.series)!.color as any)"
                  variant="subtle"
                  size="xs"
                />
                <span class="text-xs text-dimmed">{{ post.readingTime }}</span>
              </div>
              <h3 class="font-display font-bold text-primary group-hover:text-primary dark:group-hover:text-primary transition-colors truncate">
                {{ post.title }}
              </h3>
              <p class="text-sm text-muted line-clamp-2 mt-1">{{ post.summary }}</p>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="text-center py-12">
        <UIcon name="i-lucide-search-x" class="w-12 h-12 text-dimmed dark:text-muted mx-auto mb-4" />
        <p class="text-muted">Nothing found. Try another search, or just browse the <NuxtLink to="/posts" class="text-primary underline">full archive</NuxtLink>.</p>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-12">
      <UIcon name="i-lucide-search" class="w-12 h-12 text-dimmed dark:text-muted mx-auto mb-4" />
      <p class="text-muted">Start typing to search across all posts, series, and tags.</p>
    </div>
  </div>
</template>
