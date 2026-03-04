<script setup lang="ts">
import { getSeriesBySlug } from '~/utils/series'

const route = useRoute()
const slug = route.params.slug as string

const { data: post } = await useAsyncData(`post-${slug}`, () =>
  queryCollection('posts').path(`/posts/${slug}`).first(),
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}

const seriesInfo = computed(() => post.value ? getSeriesBySlug(post.value.series) : null)

const formattedDate = computed(() => {
  if (!post.value) return ''
  const d = new Date(post.value.date)
  return d.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
})

usePageSeo({
  title: `${post.value.title} — Old Austin Grouch`,
  description: post.value.summary || '',
  image: post.value.ogImage || post.value.heroImage,
  type: 'article',
})

// BlogPosting JSON-LD
useSchemaOrg([
  {
    '@type': 'BlogPosting',
    headline: post.value.title,
    description: post.value.summary,
    datePublished: post.value.date,
    image: post.value.heroImage || '/img/og-default.png',
    author: {
      '@type': 'Person',
      name: 'The Old Austin Grouch',
      url: 'https://oldaustingrouch.com/about',
    },
  },
])

// Get related posts from the same series
const { data: relatedPosts } = await useAsyncData(`related-${slug}`, () =>
  queryCollection('posts')
    .where('series', '=', post.value!.series)
    .order('date', 'DESC')
    .limit(4)
    .all(),
)

const filteredRelated = computed(() =>
  relatedPosts.value?.filter(p => p.path !== `/posts/${slug}`).slice(0, 3) ?? [],
)
</script>

<template>
  <article v-if="post" class="max-w-3xl mx-auto">
    <!-- Hero image -->
    <div v-if="post.heroImage" class="mb-8 -mx-4 sm:mx-0">
      <img
        :src="post.heroImage"
        :alt="post.title"
        class="w-full aspect-[1200/630] object-cover rounded-none sm:rounded-xl shadow-lg"
        loading="eager"
      >
    </div>

    <!-- Post header -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-4 flex-wrap">
        <NuxtLink v-if="seriesInfo" :to="`/series/${seriesInfo.slug}`">
          <UBadge
            :label="seriesInfo.title"
            :color="(seriesInfo.color as any)"
            variant="subtle"
            size="sm"
          />
        </NuxtLink>
        <span class="text-sm text-muted">{{ formattedDate }}</span>
        <span v-if="post.readingTime" class="text-sm text-dimmed flex items-center gap-1">
          <UIcon name="i-lucide-clock" class="w-3.5 h-3.5" />
          {{ post.readingTime }}
        </span>
      </div>

      <h1 class="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-tight mb-4">
        {{ post.title }}
      </h1>

      <p class="text-lg text-muted leading-relaxed">
        {{ post.summary }}
      </p>

      <!-- Share line callout -->
      <div v-if="post.shareLine" class="mt-6 p-4 bg-muted0/20 border-l-4 border-default0 rounded-r-lg">
        <p class="text-sm font-semibold text-primary italic">
          "{{ post.shareLine }}"
        </p>
      </div>
    </div>

    <USeparator class="my-6" />

    <!-- Post content -->
    <div class="prose dark:prose-invert prose-stone prose-headings:font-display prose-a:text-primary dark:prose-a:text-primary">
      <ContentRenderer :value="post" />
    </div>

    <USeparator class="my-8" />

    <!-- Share + tags -->
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <ShareButtons :title="post.title" :share-line="post.shareLine" />
        <div v-if="post.tags?.length" class="flex flex-wrap gap-2">
          <UBadge
            v-for="tag in post.tags"
            :key="tag"
            :label="tag"
            color="neutral"
            variant="subtle"
            size="xs"
          />
        </div>
      </div>

      <!-- Related posts -->
      <div v-if="filteredRelated.length" class="mt-12">
        <h2 class="font-display text-xl font-bold text-primary mb-6">
          More from {{ seriesInfo?.title ?? 'this series' }}
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <PostCard
            v-for="related in filteredRelated"
            :key="related.path"
            :title="related.title"
            :summary="related.summary"
            :date="related.date"
            :series="related.series"
            :path="related.path"
            :reading-time="related.readingTime"
            :hero-image="related.heroImage"
          />
        </div>
      </div>
    </div>
  </article>
</template>
