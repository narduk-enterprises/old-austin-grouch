<script setup lang="ts">
const email = ref('')
const submitted = ref(false)

function handleSubmit() {
  if (email.value.includes('@')) {
    submitted.value = true
  }
}
</script>

<template>
  <div>
    <Transition
      enter-active-class="transition-all duration-300"
      leave-active-class="transition-all duration-200"
      enter-from-class="opacity-0 scale-95"
      leave-to-class="opacity-0 scale-95"
      mode="out-in"
    >
      <div v-if="submitted" key="success" class="text-center py-4">
        <UIcon name="i-lucide-check-circle" class="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
        <p class="font-display text-lg font-bold text-stone-900 dark:text-stone-100">You're on the list.</p>
        <p class="text-sm text-stone-600 dark:text-stone-400 mt-1">Welcome to the grouchy side. We'll be in touch.</p>
      </div>

      <form v-else key="form" class="flex flex-col sm:flex-row gap-3" @submit.prevent="handleSubmit">
        <UInput
          v-model="email"
          type="email"
          placeholder="your@email.com"
          icon="i-lucide-mail"
          size="lg"
          required
          class="flex-1"
        />
        <UButton
          type="submit"
          label="Subscribe"
          icon="i-lucide-send"
          color="amber"
          size="lg"
        />
      </form>
    </Transition>
  </div>
</template>
