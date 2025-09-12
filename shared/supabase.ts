import { createClient } from '@supabase/supabase-js'

// Extract Supabase URL from database connection string
const databaseUrl = process.env.SUPABASE_DATABASE_URL!
// Extract project reference from: postgresql://postgres.pgbqbhqfsrzvjmanytcv:...@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
const projectRef = databaseUrl.match(/postgres\.([^:]+):/)?.[1] || ''
const supabaseUrl = projectRef ? `https://${projectRef}.supabase.co` : process.env.SUPABASE_URL!

// Clean the anon key to remove any potential whitespace or invisible characters
const rawAnonKey = process.env.SUPABASE_ANON_KEY
const supabaseAnonKey = rawAnonKey ? rawAnonKey.trim() : ''

// Supabase connection initialized successfully

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials:', { 
    supabaseUrl: !!supabaseUrl, 
    supabaseAnonKey: !!supabaseAnonKey,
    urlLength: supabaseUrl.length,
    keyLength: supabaseAnonKey.length
  })
  throw new Error('Supabase URL and anon key are required')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('✅ Supabase client created successfully!')

// For server-side operations requiring service role (optional)
export const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : supabase // Fallback to regular client if no service role key