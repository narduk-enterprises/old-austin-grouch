<script setup lang="ts">
usePageSeo({
  title: 'Subscribe — Old Austin Grouch',
  description: 'Get the latest gripes delivered to your inbox. Weekly complaints, no spam.',
})
</script>

<template>
  <div class="max-w-2xl mx-auto text-center">
    <UIcon name="i-lucide-mail" class="w-16 h-16 text-amber-600 dark:text-amber-400 mx-auto mb-6" />

    <h1 class="font-display text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
      Get Grouchy in Your Inbox
    </h1>

    <p class="text-lg text-stone-600 dark:text-stone-400 leading-relaxed mb-2">
      New complaints, delivered weekly. We'll tell you what closed, what costs too much,
      and which condo is the ugliest.
    </p>

    <p class="text-sm text-stone-500 dark:text-stone-500 mb-8">
      Unsubscribe anytime. We'll be hurt, but we'll manage. We're used to loss.
    </p>

    <div class="max-w-md mx-auto mb-10">
      <SubscribeForm />
    </div>

    <UDivider class="my-10" />

    <h2 class="font-display text-xl font-bold text-stone-900 dark:text-stone-100 mb-4">
      What You'll Get
    </h2>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
      <UCard variant="subtle">
        <div class="text-center">
          <UIcon name="i-lucide-newspaper" class="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
          <h3 class="font-semibold text-stone-900 dark:text-stone-100 mb-1">Weekly Posts</h3>
          <p class="text-sm text-stone-500">The latest gripes and commentary, fresh from the porch.</p>
        </div>
      </UCard>

      <UCard variant="subtle">
        <div class="text-center">
          <UIcon name="i-lucide-map-pin" class="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
          <h3 class="font-semibold text-stone-900 dark:text-stone-100 mb-1">Local Intel</h3>
          <p class="text-sm text-stone-500">Which beloved spot closed. Which condo replaced it.</p>
        </div>
      </UCard>

      <UCard variant="subtle">
        <div class="text-center">
          <UIcon name="i-lucide-laugh" class="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
          <h3 class="font-semibold text-stone-900 dark:text-stone-100 mb-1">Sharp Satire</h3>
          <p class="text-sm text-stone-500">Dry humor that hits different if you've been here a while.</p>
        </div>
      </UCard>
    </div>
  </div>
</template>
