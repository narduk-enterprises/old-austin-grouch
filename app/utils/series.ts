export interface SeriesInfo {
  title: string
  slug: string
  description: string
  icon: string
  color: string
  tagline: string
}

export const SERIES: Record<string, SeriesInfo> = {
  'condos-of-shame': {
    title: 'Condos of Shame',
    slug: 'condos-of-shame',
    description: 'Documenting the luxury boxes replacing everything you loved.',
    icon: 'i-lucide-building-2',
    color: 'red',
    tagline: 'Where your favorite taco truck used to be.',
  },
  'sxsw-ruin-counter': {
    title: 'SXSW Ruin Counter',
    slug: 'sxsw-ruin-counter',
    description: "Tracking the annual corporate colonization of Austin's weirdest week.",
    icon: 'i-lucide-badge-alert',
    color: 'purple',
    tagline: 'It used to be about the music. Now it\'s about the lanyard.',
  },
  'things-that-used-to-cost-three-dollars': {
    title: 'Things That Used to Cost $3',
    slug: 'things-that-used-to-cost-three-dollars',
    description: 'A eulogy for affordable Austin, one price tag at a time.',
    icon: 'i-lucide-dollar-sign',
    color: 'green',
    tagline: 'Adjusting for inflation and broken dreams.',
  },
  'tech-bro-of-the-week': {
    title: 'Tech Bro of the Week',
    slug: 'tech-bro-of-the-week',
    description: 'Satirical profiles of the disruptors disrupting your neighborhood.',
    icon: 'i-lucide-laptop',
    color: 'blue',
    tagline: 'Move fast and break rent prices.',
  },
  'lost-venues-and-dive-bars': {
    title: 'Lost Venues & Dive Bars',
    slug: 'lost-venues-and-dive-bars',
    description: 'Remembering the sticky-floored sanctuaries that defined a city.',
    icon: 'i-lucide-music',
    color: 'amber',
    tagline: 'Gone but not forgotten. Unlike your bar tab.',
  },
} as const

export const SERIES_LIST = Object.values(SERIES)

export function getSeriesBySlug(slug: string): SeriesInfo | undefined {
  return SERIES[slug]
}
