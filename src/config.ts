/**
 * API base URLs — via Vite env, not hardcoded
 * Set in Cloudflare Pages → Settings → Environment variables:
 *   VITE_API_URL (production: https://api.openapi.day, preview: https://<branch>-openapi-api.joydove-ale160.workers.dev)
 *   VITE_API_URL_PREVIEW (optional override for Pages preview)
 */
export function getApiBase(): string {
  try {
    const env = (import.meta as unknown as { env?: Record<string, string> }).env
    // 1. Explicit env (highest priority)
    if (env?.VITE_API_URL) return env.VITE_API_URL.replace(/\/$/, '')
    // 2. Preview vs production via Pages env
    if (typeof window !== 'undefined') {
      const h = window.location.hostname
      if (h === 'localhost' || h === '127.0.0.1') return 'http://127.0.0.1:8787'
      if (h.includes('pages.dev') && env?.VITE_API_URL_PREVIEW) return env.VITE_API_URL_PREVIEW.replace(/\/$/, '')
      if (h.includes('pages.dev')) {
        const branch = h.split('.')[0]
        return `https://${branch}-openapi-api.joydove-ale160.workers.dev`
      }
    }
  } catch {
    /* ignore */
  }
  // 3. Fallback production
  return 'https://api.openapi.day'
}
