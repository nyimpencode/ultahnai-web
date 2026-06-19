import { createClient } from '@supabase/supabase-js'

// Ganti dengan URL dan ANON KEY dari dashboard Supabase kamu
const supabaseUrl = 'https://ytdaqwdikxwpaoycrfjd.supabase.co'
const supabaseKey = 'sb_publishable_49iHZ2JLS-Gnk8RGWTOOZQ_JAny4chi'

export const supabase = createClient(supabaseUrl, supabaseKey)