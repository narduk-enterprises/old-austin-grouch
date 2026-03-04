export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const key = (config.public.indexNowKey as string) || ''
  const path = event.path

  // IndexNow requires the API key to be accessible at `/{key}.txt`.
  if (key && path === `/${key}.txt`) {
    setResponseHeader(event, 'content-type', 'text/plain')
    return key
  }
})
