import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// "Publishable key" is Supabase's current name for what used to be the
// anon key — same client-safe, RLS-gated privileges, new naming only.
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabasePublishableKey) {
  // Fails loudly at startup instead of silently breaking every query later.
  console.error(
    'Missing Supabase env vars. Copy .env.local.example to .env.local and fill in your project URL + publishable key.'
  )
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
