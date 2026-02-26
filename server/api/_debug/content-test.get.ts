/**
 * Temporary diagnostic endpoint to debug content query issues in production.
 * DELETE THIS FILE once the issue is resolved.
 */
export default defineEventHandler(async (event) => {
  const results: Record<string, any> = {}
  
  try {
    // Check if D1 binding exists
    const env = event.context.cloudflare?.env || {}
    results.hasDB = !!env.DB
    results.hasASSETS = !!env.ASSETS
    
    // Try querying D1 directly
    if (env.DB) {
      try {
        const tables = await env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()
        results.tables = tables.results?.map((t: any) => t.name)
      } catch (e: any) {
        results.tablesError = e.message
      }
      
      // Try querying _content_posts
      try {
        const count = await env.DB.prepare("SELECT COUNT(*) as cnt FROM _content_posts").first()
        results.postCount = count?.cnt
      } catch (e: any) {
        results.postCountError = e.message
      }
    }

    // Check runtime config
    const config = useRuntimeConfig()
    results.contentConfig = {
      databaseType: config.content?.database?.type,
      bindingName: config.content?.database?.bindingName,
      integrityCheck: config.content?.integrityCheck,
    }

    // Try internal content fetch
    try {
      const dumpUrl = '/__nuxt_content/posts/sql_dump.txt'
      const dump = await event.$fetch(dumpUrl, { responseType: 'text' })
      results.dumpLength = typeof dump === 'string' ? dump.length : 'not a string'
    } catch (e: any) {
      results.dumpError = e.message
    }

  } catch (e: any) {
    results.globalError = e.message
    results.stack = e.stack?.split('\n').slice(0, 5)
  }

  return results
})
