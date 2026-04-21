import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://ekmkwskitcxhkmebyuih.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbWt3c2tpdGN4aGttZWJ5dWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMDM4OTMsImV4cCI6MjA4NDU3OTg5M30.HCtJenHxW_x-befEWc5ylKaWJFQzp1yEfscbnwMpnE0'
)

// Still keep Replit poster for mutations (approve outreach etc)
const REPLIT = 'https://global-sphere--BigMike88.replit.app'
export async function poster(path: string, body?: any) {
  const r = await fetch(`${REPLIT}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  return r.json()
}
