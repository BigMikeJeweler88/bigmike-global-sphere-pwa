const REPLIT_URL = process.env.NEXT_PUBLIC_REPLIT_URL || 'https://global-sphere--BigMike88.replit.app'

export { REPLIT_URL }

export async function fetcher<T>(path: string): Promise<T> {
  const url = path.startsWith('http') ? path : `${REPLIT_URL}${path}`
  const r = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: 0 },
  })
  if (!r.ok) throw new Error(`Fetch failed: ${r.status} ${url}`)
  return r.json()
}

export async function poster(path: string, body?: any) {
  const url = path.startsWith('http') ? path : `${REPLIT_URL}${path}`
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  return r.json()
}
