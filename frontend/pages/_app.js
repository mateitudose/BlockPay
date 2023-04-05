import '@/styles/index.css'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'
export default function App({ Component, pageProps }) {
  let options = {
    supabaseUrl: 'https://wirkfttgdyckcpccljwz.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpcmtmdHRnZHlja2NwY2Nsand6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk4NTAxMTgsImV4cCI6MTk5NTQyNjExOH0.vM9aBve5tfiEXLTcIaUSHSv0ssnYiJZ5C45gWpW08fI'
  }

  const [supabase] = useState(() => createBrowserSupabaseClient(options))

  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}
