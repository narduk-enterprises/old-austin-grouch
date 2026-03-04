<script setup lang="ts">
const { jsonLdItems } = useBreadcrumbs()

useSchemaOrg([
  {
    '@type': 'BreadcrumbList',
    itemListElement: jsonLdItems,
  },
])
</script>

<template>
  <div class="min-h-screen paper-texture">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <AppBreadcrumbs />
      <div>
        <slot />
      </div>
    </div>
  </div>
</template>
