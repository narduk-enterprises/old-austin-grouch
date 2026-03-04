<script setup lang="ts">
const { items } = useBreadcrumbs()
</script>

<template>
  <UBreadcrumb
    v-if="items.length > 0"
    :items="items"
    class="mb-6"
  />
</template>
