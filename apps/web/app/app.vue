<script setup lang="ts">
useSchemaOrg([
  defineWebSite({
    name: 'Old Austin Grouch',
    url: 'https://oldaustingrouch.com',
    description: 'Comedic Austin nostalgia satire. Dry, sharp, hyper-specific cultural commentary.',
  }),
  defineOrganization({
    name: 'Old Austin Grouch',
    url: 'https://oldaustingrouch.com',
    logo: '/img/logo.png',
  }),
])
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="repeating-linear-gradient(to right, #f59e0b 0%, #d97706 50%, #92400e 100%)" />
    <AppHeader />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <AppFooter />
  </UApp>
</template>
