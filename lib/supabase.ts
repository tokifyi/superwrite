import { createClient } from '@supabase/supabase-js'

// Create a function to get the Supabase client
const getSupabaseClient = () => {
  // Check if we're in the browser
  if (typeof window === 'undefined') return null

  // Get environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Log for debugging (these are public keys, so it's safe)
  console.log('Supabase URL available:', !!supabaseUrl)
  console.log('Supabase Key available:', !!supabaseAnonKey)

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
    return null
  }

  try {
    return createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error('Error creating Supabase client:', error)
    return null
  }
}

// Export the function instead of the client
export { getSupabaseClient } 