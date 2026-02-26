<script setup lang="ts">
import { getSeriesBySlug } from '~/utils/series'

const props = defineProps<{
  title: string
  excerpt?: string
  date: string
  series: string
  path: string
  heroImage?: string
  readingTime?: string
  tags?: string[]
}>()

const seriesInfo = computed(() => getSeriesBySlug(props.series))
const formattedDate = computed(() => {
  const d = new Date(props.date)
  return d.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' })
})
</script>

<template>
  <NuxtLink :to="path" class="block group">
    <UCard variant="outline" class="h-full transition-all duration-200 group-hover:shadow-md group-hover:border-amber-300 dark:group-hover:border-amber-700 overflow-hidden">
      <img
        v-if="heroImage"
        :src="heroImage"
        :alt="title"
        class="w-full aspect-[1200/630] object-cover -mx-6 -mt-6 mb-4 max-w-[calc(100%+3rem)]"
        loading="lazy"
      >
      <div class="flex flex-col gap-3">
        <!-- Series badge + date -->
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <UBadge
            v-if="seriesInfo"
            :label="seriesInfo.title"
            :color="(seriesInfo.color as any)"
            variant="subtle"
            size="xs"
          />
          <span class="text-xs text-stone-500 dark:text-stone-400">{{ formattedDate }}</span>
        </div>

        <!-- Title -->
        <h3 class="font-display text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors leading-tight">
          {{ title }}
        </h3>

        <!-- Excerpt -->
        <p class="text-sm text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3">
          {{ excerpt }}
        </p>

        <!-- Meta -->
        <div class="flex items-center gap-3 pt-1">
          <span v-if="readingTime" class="text-xs text-stone-400 dark:text-stone-500 flex items-center gap-1">
            <UIcon name="i-lucide-clock" class="w-3 h-3" />
            {{ readingTime }}
          </span>
          <div v-if="tags?.length" class="flex gap-1 flex-wrap">
            <UBadge
              v-for="tag in tags.slice(0, 3)"
              :key="tag"
              :label="tag"
              color="neutral"
              variant="subtle"
              size="xs"
            />
          </div>
        </div>
      </div>
    </UCard>
  </NuxtLink>
</template>
