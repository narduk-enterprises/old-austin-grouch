<script setup lang="ts">
defineProps<{
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'solid' | 'outline' | 'ghost' | 'soft' | 'subtle' | 'link'
  block?: boolean
}>()

const router = useRouter()
const loading = ref(false)

async function goToRandom() {
  loading.value = true
  try {
    const posts = await queryCollection('posts').select('path').all()
    if (posts.length > 0) {
      const random = posts[Math.floor(Math.random() * posts.length)]
      if (random?.path) {
        await router.push(random.path)
      }
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UButton
    icon="i-lucide-shuffle"
    :label="block ? 'Random Grouch' : undefined"
    :loading="loading"
    :size="size || 'sm'"
    :variant="variant || 'soft'"
    color="amber"
    :block="block"
    aria-label="Go to a random post"
    @click="goToRandom"
  />
</template>
