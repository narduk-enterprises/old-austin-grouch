<script setup lang="ts">
definePageMeta({ layout: 'home' })

const { seriesList } = useSiteData()

usePageSeo({
  title: 'Old Austin Grouch — Comedic Austin Nostalgia Satire',
  description: 'Dry, sharp, hyper-specific cultural commentary from someone who remembers when this town was weird for free.',
})

const { data: latestPosts } = await useAsyncData('latest-posts', () =>
  queryCollection('posts')
    .select('title', 'summary', 'date', 'series', 'path', 'readingTime', 'heroImage', 'tags')
    .order('date', 'DESC')
    .limit(6)
    .all(),
)

const { data: allPosts } = await useAsyncData('all-posts-count', () =>
  queryCollection('posts').select('series').all(),
)

function getPostCount(slug: string): number {
  return allPosts.value?.filter(p => p.series === slug).length ?? 0
}
</script>

<template>
  <div class="paper-texture min-h-screen">
    <!-- Hero -->
    <section class="relative overflow-hidden bg-amber-950 text-amber-50">
      <div class="grain-overlay absolute inset-0" />
      <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div class="max-w-3xl">
          <p class="text-amber-400 font-semibold text-sm uppercase tracking-widest mb-4 animate-fade-up">
            Est. Whenever It Was Still Cheap
          </p>
          <h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-up-delay-1">
            We Remember When<br />
            <span class="text-amber-400">Austin Was Weird</span><br />
            For Free
          </h1>
          <p class="text-lg sm:text-xl text-amber-200/80 leading-relaxed max-w-2xl mb-8 animate-fade-up-delay-2">
            Comedic nostalgia satire from someone who's been here long enough to have opinions
            about what used to be where your condo is now.
          </p>
          <div class="flex flex-wrap gap-3 animate-fade-up-delay-3">
            <UButton to="/posts" label="Read the Archive" color="primary" size="lg" icon="i-lucide-book-open" />
            <RandomGrouchButton size="lg" variant="outline" block class="text-amber-100 border-amber-100/30 hover:bg-amber-100/10" />
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Posts -->
    <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div class="flex items-center justify-between mb-8">
        <h2 class="font-display text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
          Latest Gripes
        </h2>
        <UButton to="/posts" label="View All" variant="ghost" color="neutral" trailing-icon="i-lucide-arrow-right" />
      </div>

      <div v-if="latestPosts?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PostCard
          v-for="(post, i) in latestPosts"
          :key="post.path"
          :title="post.title"
          :summary="post.summary"
          :date="post.date"
          :series="post.series"
          :path="post.path"
          :reading-time="post.readingTime"
          :hero-image="post.heroImage"
          :tags="post.tags"
          class="animate-card-enter"
          :style="{ animationDelay: `${i * 100}ms` }"
        />
      </div>
    </section>

    <!-- Manifesto Teaser -->
    <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
      <ManifestoTeaser />
    </section>

    <!-- Series -->
    <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
      <h2 class="font-display text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mb-8">
        Featured Series
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <SeriesCard
          v-for="s in seriesList"
          :key="s.slug"
          v-bind="s"
          :post-count="getPostCount(s.slug)"
        />
      </div>
    </section>

    <!-- Subscribe CTA -->
    <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
      <UCard variant="subtle" class="text-center">
        <div class="py-4">
          <h2 class="font-display text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
            Get Grouchy in Your Inbox
          </h2>
          <p class="text-sm text-stone-600 dark:text-stone-400 mb-6 max-w-md mx-auto">
            New complaints delivered weekly. Unsubscribe when you finally move to Dripping Springs.
          </p>
          <div class="max-w-md mx-auto">
            <SubscribeForm />
          </div>
        </div>
      </UCard>
    </section>
  </div>
</template>
