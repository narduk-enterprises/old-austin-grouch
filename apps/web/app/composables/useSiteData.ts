import { SERIES, SERIES_LIST, getSeriesBySlug } from '~/utils/series'

export function useSiteData() {
  return {
    siteName: 'Old Austin Grouch',
    siteDescription: 'Comedic Austin nostalgia satire. Dry, sharp, hyper-specific cultural commentary.',
    series: SERIES,
    seriesList: SERIES_LIST,
    getSeriesBySlug,
  }
}
