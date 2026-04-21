import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ekmkwskitcxhkmebyuih.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrbWt3c2tpdGN4aGttZWJ5dWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMDM4OTMsImV4cCI6MjA4NDU3OTg5M30.HCtJenHxW_x-befEWc5ylKaWJFQzp1yEfscbnwMpnE0'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
