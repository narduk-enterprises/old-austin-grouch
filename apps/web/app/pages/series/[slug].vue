<script setup lang="ts">
import { getSeriesBySlug } from '~/utils/series'

const route = useRoute()
const slug = route.params.slug as string
const seriesInfo = getSeriesBySlug(slug)

if (!seriesInfo) {
  throw createError({ statusCode: 404, statusMessage: 'Series not found' })
}

useSeo({
  title: `${seriesInfo.title} — Old Austin Grouch`,
  description: seriesInfo.description,
  image: `/img/series/${slug}.png`,
})

useWebPageSchema({
  name: `${seriesInfo.title} — Old Austin Grouch`,
  description: seriesInfo.description,
  type: 'CollectionPage',
})

const { data: posts } = await useAsyncData(`series-${slug}`, () =>
  queryCollection('posts')
    .where('series', '=', slug)
    .select('title', 'summary', 'date', 'series', 'path', 'readingTime', 'heroImage', 'tags')
    .order('date', 'DESC')
    .all(),
)
</script>

<template>
  <div v-if="seriesInfo">
    <!-- Series header -->
    <div class="mb-10">
      <div class="flex items-center gap-4 mb-4">
        <div class="w-14 h-14 rounded-xl bg-muted0 dark:bg-muted0/30 flex items-center justify-center">
          <UIcon :name="seriesInfo.icon" class="w-7 h-7 text-primary" />
        </div>
        <div>
          <h1 class="font-display text-3xl sm:text-4xl font-bold text-primary">
            {{ seriesInfo.title }}
          </h1>
          <p class="text-sm text-muted mt-1">{{ posts?.length ?? 0 }} posts in this series</p>
        </div>
      </div>
      <p class="text-lg text-muted leading-relaxed max-w-2xl">
        {{ seriesInfo.description }}
      </p>
      <p class="text-sm italic text-muted mt-2">"{{ seriesInfo.tagline }}"</p>
    </div>

    <!-- Posts -->
    <div v-if="posts?.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PostCard
        v-for="post in posts"
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
      <UIcon name="i-lucide-file-text" class="w-12 h-12 text-dimmed dark:text-muted mx-auto mb-4" />
      <p class="text-muted">No posts in this series yet. Even the Grouch needs time to compose.</p>
    </div>
  </div>
</template>
