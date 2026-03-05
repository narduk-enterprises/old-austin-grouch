<script setup lang="ts">
import { SERIES_LIST } from '~/utils/series'

usePageSeo({
  title: 'All Posts — Old Austin Grouch',
  description: 'Browse every gripe, complaint, and love letter to old Austin. Filter by series or tag.',
})

useWebPageSchema({
  name: 'All Posts — Old Austin Grouch',
  description: 'Browse every gripe, complaint, and love letter to old Austin. Filter by series or tag.',
  type: 'CollectionPage',
})

const { data: allPosts } = await useAsyncData('all-posts', () =>
  queryCollection('posts')
    .select('title', 'summary', 'date', 'series', 'path', 'readingTime', 'heroImage', 'tags')
    .order('date', 'DESC')
    .all(),
)

const selectedSeries = ref<string | null>(null)
const selectedTag = ref<string | null>(null)

const allTags = computed(() => {
  const tagSet = new Set<string>()
  for (const p of allPosts.value ?? []) {
    for (const t of p.tags ?? []) {
      tagSet.add(t)
    }
  }
  return Array.from(tagSet).sort()
})

const filteredPosts = computed(() => {
  let posts = allPosts.value ?? []
  if (selectedSeries.value) {
    posts = posts.filter(p => p.series === selectedSeries.value)
  }
  if (selectedTag.value) {
    posts = posts.filter(p => p.tags?.includes(selectedTag.value!))
  }
  return posts
})

function clearFilters() {
  selectedSeries.value = null
  selectedTag.value = null
}
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="font-display text-3xl sm:text-4xl font-bold text-primary mb-2">
        All Posts
      </h1>
      <p class="text-muted">
        Every gripe, ranked by recency. Filter by series or tag if you're picky about your complaints.
      </p>
    </div>

    <!-- Filters -->
    <div class="mb-8 space-y-4">
      <!-- Series filter -->
      <div class="flex flex-wrap gap-2">
        <UButton
          label="All Series"
          :variant="selectedSeries === null ? 'solid' : 'outline'"
          :color="selectedSeries === null ? 'primary' : 'neutral'"
          size="xs"
          @click="selectedSeries = null"
        />
        <UButton
          v-for="s in SERIES_LIST"
          :key="s.slug"
          :label="s.title"
          :icon="s.icon"
          :variant="selectedSeries === s.slug ? 'solid' : 'outline'"
          :color="selectedSeries === s.slug ? 'primary' : 'neutral'"
          size="xs"
          @click="selectedSeries = selectedSeries === s.slug ? null : s.slug"
        />
      </div>

      <!-- Tag filter -->
      <div v-if="allTags.length" class="flex flex-wrap gap-2">
        <UBadge
          v-for="tag in allTags"
          :key="tag"
          :label="tag"
          :color="selectedTag === tag ? 'primary' : 'neutral'"
          :variant="selectedTag === tag ? 'solid' : 'subtle'"
          size="sm"
          class="cursor-pointer"
          @click="selectedTag = selectedTag === tag ? null : tag"
        />
      </div>

      <!-- Active filters -->
      <div v-if="selectedSeries || selectedTag" class="flex items-center gap-2">
        <span class="text-xs text-muted">
          Showing {{ filteredPosts.length }} of {{ allPosts?.length ?? 0 }} posts
        </span>
        <UButton label="Clear filters" variant="link" color="primary" size="xs" @click="clearFilters" />
      </div>
    </div>

    <!-- Posts grid -->
    <div v-if="filteredPosts.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PostCard
        v-for="post in filteredPosts"
        :key="post.path"
        :title="post.title"
        :summary="post.summary"
        :date="post.date"
        :series="post.series"
        :path="post.path"
        :reading-time="post.readingTime"
        :hero-image="post.heroImage"
        :tags="post.tags"
      />
    </div>

    <div v-else class="text-center py-16">
      <UIcon name="i-lucide-search-x" class="w-12 h-12 text-dimmed dark:text-muted mx-auto mb-4" />
      <p class="text-muted">No posts match your filters. Even the Grouch has limits.</p>
    </div>
  </div>
</template>
