<script setup lang="ts">
defineProps<{
  title: string
  slug: string
  description: string
  icon: string
  color: string
  tagline: string
  postCount?: number
}>()
</script>

<template>
  <NuxtLink :to="`/series/${slug}`" class="block group">
    <UCard variant="outline" class="h-full transition-all duration-200 group-hover:shadow-md group-hover:border-amber-300 dark:group-hover:border-amber-700">
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <UIcon :name="icon" class="w-5 h-5 text-amber-700 dark:text-amber-400" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-display text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors truncate">
              {{ title }}
            </h3>
            <p v-if="postCount !== undefined" class="text-xs text-stone-500">{{ postCount }} {{ postCount === 1 ? 'post' : 'posts' }}</p>
          </div>
        </div>

        <p class="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
          {{ description }}
        </p>

        <p class="text-xs italic text-stone-500 dark:text-stone-500">
          "{{ tagline }}"
        </p>
      </div>
    </UCard>
  </NuxtLink>
</template>
