import { createClient } from '@supabase/supabase-js'

// Extract Supabase URL from database connection string
const databaseUrl = process.env.SUPABASE_DATABASE_URL!
// Extract project reference from: postgresql://postgres.pgbqbhqfsrzvjmanytcv:...@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
const projectRef = databaseUrl.match(/postgres\.([^:]+):/)?.[1] || ''
const supabaseUrl = projectRef ? `https://${projectRef}.supabase.co` : process.env.SUPABASE_URL!

const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations requiring service role
export const supabaseAdmin = createClient(
  supabaseUrl, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)