<script setup lang="ts">
usePageSeo({
  title: 'About — Old Austin Grouch',
  description: 'The Grouch Manifesto. Who we are, why we complain, and our sincerest disclaimer.',
  type: 'profile',
})
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <h1 class="font-display text-3xl sm:text-4xl font-bold text-primary mb-6">
      About the Grouch
    </h1>

    <div class="prose dark:prose-invert prose-stone prose-headings:font-display prose-a:text-primary dark:prose-a:text-primary">
      <p class="text-lg leading-relaxed">
        <strong>Old Austin Grouch</strong> is a comedic satire project. Think of it as a love letter
        to Austin, Texas — written in the voice of someone who's watched the city transform from
        a cheap, weird, creatively vibrant town into something shinier, pricier, and occasionally
        unrecognizable.
      </p>

      <h2>The Persona</h2>
      <p>
        The Grouch is a composite character. Part longtime Austinite, part exaggerated curmudgeon,
        part cultural anthropologist with a beer. They remember Liberty Lunch. They remember
        $1.50 Lone Stars. They remember when South Congress was just a road, not a brand.
      </p>
      <p>
        The Grouch isn't stuck in the past — they're stuck on the specific feeling of watching
        your favorite taco truck get replaced by a WeWork. Again.
      </p>

      <h2>What This Site Is</h2>
      <ul>
        <li>Playful cultural commentary on Austin's rapid transformation</li>
        <li>Satire rooted in hyper-specific local knowledge</li>
        <li>A creative writing project with an editorial voice</li>
        <li>An archive of things that used to be here (and things that shouldn't be)</li>
      </ul>

      <h2>What This Site Is NOT</h2>
      <ul>
        <li>Hateful or mean-spirited toward any group of people</li>
        <li>A real news source (everything is satire or dramatized)</li>
        <li>Anti-growth or anti-progress (we just want to laugh about it)</li>
        <li>Written by a real person named "The Grouch" (it's a character)</li>
      </ul>

      <h2>The Manifesto</h2>
      <p>
        We don't hate Austin. We hate what happened to it while we were waiting in line
        for a $16 breakfast taco that used to cost two bucks and some pocket lint.
      </p>
      <p>
        Every post is a tiny funeral for something that made this city weird, wonderful,
        and almost affordable. We write because we remember, and because memory is the
        cheapest thing left in this town.
      </p>
      <p>
        Some cities change gracefully. Austin changed like someone put it in the microwave
        and walked away. We're here to document the splatter.
      </p>

      <h2>Disclaimer</h2>
      <p>
        All characters, including "Tech Bro of the Week" profiles, are entirely fictional
        composites. Any resemblance to actual persons, living or disrupting, is coincidental.
        No tech bros, condos, or overpriced breakfast tacos were harmed in the making of
        this website. The opinions expressed are satirical and belong to a fictional character.
      </p>
      <p>
        This project is not affiliated with any Austin business, organization, or municipal
        entity. It's just one pretend grouch with a keyboard and too many memories.
      </p>
    </div>

    <USeparator class="my-10" />

    <div class="text-center">
      <p class="text-sm text-muted mb-4">Got a gripe? Got a memory? Got a correction?</p>
      <UButton to="/subscribe" label="Subscribe to the Newsletter" color="primary" size="lg" icon="i-lucide-mail" />
    </div>
  </div>
</template>
