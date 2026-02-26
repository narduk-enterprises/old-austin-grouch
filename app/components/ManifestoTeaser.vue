<template>
  <div class="relative overflow-hidden rounded-2xl bg-amber-950 text-amber-50 p-8 sm:p-10">
    <div class="grain-overlay absolute inset-0" />
    <div class="relative z-10">
      <h2 class="font-display text-2xl sm:text-3xl font-bold mb-4">
        The Grouch Manifesto
      </h2>
      <div class="space-y-3 text-amber-200/90 leading-relaxed max-w-2xl">
        <p>
          We don't hate Austin. We hate what happened to it while we were waiting in line
          for a $16 breakfast taco that used to cost two bucks and some pocket lint.
        </p>
        <p>
          This site is a love letter disguised as a complaint form. Every post is a tiny
          funeral for something that made this city weird, wonderful, and almost affordable.
        </p>
        <p class="font-semibold text-amber-100">
          We remember. And we're not shutting up about it.
        </p>
      </div>
      <div class="mt-6 flex flex-wrap gap-3">
        <UButton to="/about" label="Read the Full Manifesto" color="primary" variant="solid" size="md" />
        <UButton to="/posts" label="Browse the Archive" color="neutral" variant="outline" size="md" class="text-amber-100 border-amber-100/30 hover:bg-amber-100/10" />
      </div>
    </div>
  </div>
</template>
