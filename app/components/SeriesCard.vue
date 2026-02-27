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
    <UCard variant="outline" class="h-full transition-all duration-200 group-hover:shadow-md group-hover:border-default0 dark:group-hover:border-default0">
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-muted0 dark:bg-muted0/30 flex items-center justify-center">
            <UIcon :name="icon" class="w-5 h-5 text-primary" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-display text-lg font-bold text-primary group-hover:text-primary dark:group-hover:text-primary transition-colors truncate">
              {{ title }}
            </h3>
            <p v-if="postCount !== undefined" class="text-xs text-muted">{{ postCount }} {{ postCount === 1 ? 'post' : 'posts' }}</p>
          </div>
        </div>

        <p class="text-sm text-muted leading-relaxed">
          {{ description }}
        </p>

        <p class="text-xs italic text-muted">
          "{{ tagline }}"
        </p>
      </div>
    </UCard>
  </NuxtLink>
</template>
