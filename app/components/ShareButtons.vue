<script setup lang="ts">
const props = defineProps<{
  title: string
  url?: string
  shareLine?: string
}>()

const runtimeConfig = useRuntimeConfig()
const route = useRoute()
const siteUrl = computed(() => (runtimeConfig.public.siteUrl as string || 'https://oldaustingrouch.com').replace(/\/$/, ''))
const fullUrl = computed(() => props.url || `${siteUrl.value}${route.path}`)
const shareText = computed(() => props.shareLine || props.title)

const twitterUrl = computed(() =>
  `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText.value)}&url=${encodeURIComponent(fullUrl.value)}`,
)
const facebookUrl = computed(() =>
  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl.value)}`,
)

const copied = ref(false)

async function copyLink() {
  try {
    await navigator.clipboard.writeText(fullUrl.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // Fallback: select and copy
  }
}
</script>

<template>
  <div class="flex items-center gap-2">
    <span class="text-xs text-stone-500 dark:text-stone-400 mr-1">Share:</span>
    <UButton
      :to="twitterUrl"
      target="_blank"
      rel="noopener noreferrer"
      icon="i-lucide-twitter"
      variant="ghost"
      color="neutral"
      size="xs"
      aria-label="Share on X / Twitter"
    />
    <UButton
      :to="facebookUrl"
      target="_blank"
      rel="noopener noreferrer"
      icon="i-lucide-facebook"
      variant="ghost"
      color="neutral"
      size="xs"
      aria-label="Share on Facebook"
    />
    <UButton
      :icon="copied ? 'i-lucide-check' : 'i-lucide-link'"
      variant="ghost"
      :color="copied ? 'green' : 'neutral'"
      size="xs"
      :aria-label="copied ? 'Copied!' : 'Copy link'"
      @click="copyLink"
    />
  </div>
</template>
