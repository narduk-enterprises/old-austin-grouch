import type { H3Event } from 'h3'

export const GSC_SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly']
export const GA_SCOPES = ['https://www.googleapis.com/auth/analytics.readonly']

export async function requireAdmin(_event: H3Event) {
  // Stub implementation for now
  return true
}

export async function googleApiFetch(_url: string, _scopes: string[], _options: any = {}): Promise<any> {
  // Stub implementation
  return { rows: [], totals: [] }
}
