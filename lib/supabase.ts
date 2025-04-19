import { createClient } from '@supabase/supabase-js'

let supabase: any

if (typeof window !== 'undefined') {
  // Only initialize Supabase on the client side
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase } 