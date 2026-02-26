<script setup lang="ts">
import { getSeriesBySlug } from '~/utils/series'

const route = useRoute()
const slug = route.params.slug as string
const seriesInfo = getSeriesBySlug(slug)

if (!seriesInfo) {
  throw createError({ statusCode: 404, statusMessage: 'Series not found' })
}

usePageSeo({
  title: `${seriesInfo.title} — Old Austin Grouch`,
  description: seriesInfo.description,
  image: `/img/series/${slug}.png`,
})

const { data: posts } = await useAsyncData(`series-${slug}`, () =>
  queryCollection('posts')
    .where('series', '=', slug)
    .select('title', 'excerpt', 'date', 'series', 'path', 'readingTime', 'heroImage', 'tags')
    .order('date', 'DESC')
    .all(),
)
</script>

<template>
  <div v-if="seriesInfo">
    <!-- Series header -->
    <div class="mb-10">
      <div class="flex items-center gap-4 mb-4">
        <div class="w-14 h-14 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <UIcon :name="seriesInfo.icon" class="w-7 h-7 text-amber-700 dark:text-amber-400" />
        </div>
        <div>
          <h1 class="font-display text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
            {{ seriesInfo.title }}
          </h1>
          <p class="text-sm text-stone-500 mt-1">{{ posts?.length ?? 0 }} posts in this series</p>
        </div>
      </div>
      <p class="text-lg text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl">
        {{ seriesInfo.description }}
      </p>
      <p class="text-sm italic text-stone-500 mt-2">"{{ seriesInfo.tagline }}"</p>
    </div>

    <!-- Posts -->
    <div v-if="posts?.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PostCard
        v-for="post in posts"
        :key="post.path"
        :title="post.title"
        :excerpt="post.excerpt"
        :date="post.date"
        :series="post.series"
        :path="post.path"
        :reading-time="post.readingTime"
        :hero-image="post.heroImage"
        :tags="post.tags"
      />
    </div>

    <div v-else class="text-center py-16">
      <UIcon name="i-lucide-file-text" class="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-4" />
      <p class="text-stone-500">No posts in this series yet. Even the Grouch needs time to compose.</p>
    </div>
  </div>
</template>
