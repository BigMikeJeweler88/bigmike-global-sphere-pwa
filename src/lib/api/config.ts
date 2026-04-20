// The Replit app IS the API server — it has Supabase access
// All calls must go to the production Replit URL
const REPLIT_URL = 'https://global-sphere--BigMike88.replit.app'

export { REPLIT_URL }

export async function fetcher<T>(path: string): Promise<T> {
  const url = `${REPLIT_URL}${path}`
  const r = await fetch(url, {
    headers: { 'Accept': 'application/json' },
    cache: 'no-store',
  })
  if (!r.ok) {
    const text = await r.text().catch(() => '')
    throw new Error(`${r.status} ${url}: ${text.slice(0, 100)}`)
  }
  return r.json()
}

export async function poster(path: string, body?: any) {
  const url = `${REPLIT_URL}${path}`
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  })
  return r.json()
}
