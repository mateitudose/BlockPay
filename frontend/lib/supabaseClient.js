import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient(
    'https://wirkfttgdyckcpccljwz.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpcmtmdHRnZHlja2NwY2Nsand6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk4NTAxMTgsImV4cCI6MTk5NTQyNjExOH0.vM9aBve5tfiEXLTcIaUSHSv0ssnYiJZ5C45gWpW08fI'
)