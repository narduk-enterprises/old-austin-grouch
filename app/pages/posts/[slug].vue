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
  description: post.value.excerpt,
  image: post.value.ogImage || post.value.heroImage,
  type: 'article',
})

// BlogPosting JSON-LD
useSchemaOrg([
  {
    '@type': 'BlogPosting',
    headline: post.value.title,
    description: post.value.excerpt,
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
    <header class="mb-8">
      <div class="flex items-center gap-3 mb-4 flex-wrap">
        <UBadge
          v-if="seriesInfo"
          :label="seriesInfo.title"
          :color="(seriesInfo.color as any)"
          variant="subtle"
          size="sm"
          :to="`/series/${seriesInfo.slug}`"
        />
        <span class="text-sm text-stone-500">{{ formattedDate }}</span>
        <span v-if="post.readingTime" class="text-sm text-stone-400 flex items-center gap-1">
          <UIcon name="i-lucide-clock" class="w-3.5 h-3.5" />
          {{ post.readingTime }}
        </span>
      </div>

      <h1 class="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 dark:text-stone-100 leading-tight mb-4">
        {{ post.title }}
      </h1>

      <p class="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
        {{ post.excerpt }}
      </p>

      <!-- Share line callout -->
      <div v-if="post.shareLine" class="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-r-lg">
        <p class="text-sm font-semibold text-amber-900 dark:text-amber-200 italic">
          "{{ post.shareLine }}"
        </p>
      </div>
    </header>

    <UDivider class="my-6" />

    <!-- Post content -->
    <div class="prose dark:prose-invert prose-stone prose-headings:font-display prose-a:text-amber-700 dark:prose-a:text-amber-400">
      <ContentRenderer :value="post" />
    </div>

    <UDivider class="my-8" />

    <!-- Share + tags -->
    <footer class="space-y-6">
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
        <h2 class="font-display text-xl font-bold text-stone-900 dark:text-stone-100 mb-6">
          More from {{ seriesInfo?.title ?? 'this series' }}
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <PostCard
            v-for="related in filteredRelated"
            :key="related.path"
            :title="related.title"
            :excerpt="related.excerpt"
            :date="related.date"
            :series="related.series"
            :path="related.path"
            :reading-time="related.readingTime"
            :hero-image="related.heroImage"
          />
        </div>
      </div>
    </footer>
  </article>
</template>
