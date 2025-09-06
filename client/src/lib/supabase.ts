import { createClient } from '@supabase/supabase-js'

// For development, we'll fetch these from the backend
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ywwrwnahupuxdrbrvjzw.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3d3J3bmFodXB1eGRyYnJ2anp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MDY4OTAsImV4cCI6MjA3MjQ4Mjg5MH0.kJwHU8nz6VvKT0k_YXOG2DfNj8C8nTBNgdwZRxOhJeU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)