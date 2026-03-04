<script setup lang="ts">
const { seriesList } = useSiteData()

const navItems = computed(() => [
  { label: 'Posts', to: '/posts', icon: 'i-lucide-file-text' },
  { label: 'About', to: '/about', icon: 'i-lucide-user' },
  { label: 'Subscribe', to: '/subscribe', icon: 'i-lucide-mail' },
])

const mobileMenuOpen = ref(false)
</script>

<template>
  <div class="sticky top-0 z-50 bg-elevated/90 backdrop-blur-md border-b border-default">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <img src="/img/logo.png" alt="Old Austin Grouch" class="w-9 h-9 rounded-full" />
          <span class="text-xl sm:text-2xl font-display font-bold text-primary group-hover:text-primary dark:group-hover:text-primary transition-colors">
            Old Austin Grouch
          </span>
        </NuxtLink>

        <!-- Desktop nav -->
        <div class="hidden md:flex items-center gap-1">
          <UButton
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            :label="item.label"
            :icon="item.icon"
            variant="ghost"
            color="neutral"
            size="sm"
          />
          <UButton
            to="/search"
            icon="i-lucide-search"
            variant="ghost"
            color="neutral"
            size="sm"
            aria-label="Search"
          />
          <RandomGrouchButton size="sm" />
        </div>

        <!-- Mobile menu button -->
        <div class="flex md:hidden items-center gap-1">
          <UButton
            to="/search"
            icon="i-lucide-search"
            variant="ghost"
            color="neutral"
            size="sm"
            aria-label="Search"
          />
          <UButton
            :icon="mobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
            variant="ghost"
            color="neutral"
            size="sm"
            aria-label="Toggle menu"
            @click="mobileMenuOpen = !mobileMenuOpen"
          />
        </div>
      </div>

      <!-- Mobile menu -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        leave-active-class="transition-all duration-150 ease-in"
        enter-from-class="opacity-0 -translate-y-2"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="mobileMenuOpen" class="md:hidden pb-4 border-t border-default pt-3">
          <div class="flex flex-col gap-1">
            <UButton
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              :label="item.label"
              :icon="item.icon"
              variant="ghost"
              color="neutral"
              block
              class="justify-start"
              @click="mobileMenuOpen = false"
            />
            <USeparator class="my-2" />
            <p class="px-3 text-xs font-semibold text-muted uppercase tracking-wider mb-1">Series</p>
            <UButton
              v-for="s in seriesList"
              :key="s.slug"
              :to="`/series/${s.slug}`"
              :label="s.title"
              :icon="s.icon"
              variant="ghost"
              color="neutral"
              block
              size="sm"
              class="justify-start"
              @click="mobileMenuOpen = false"
            />
            <USeparator class="my-2" />
            <RandomGrouchButton block @click="mobileMenuOpen = false" />
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
