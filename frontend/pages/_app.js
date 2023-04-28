import '@/styles/index.css'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'

// import '@rainbow-me/rainbowkit/styles.css';
// import {
//   getDefaultWallets,
//   RainbowKitProvider,
// } from '@rainbow-me/rainbowkit';
// import { configureChains, createClient, WagmiConfig } from 'wagmi';
// import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
// import { publicProvider } from 'wagmi/providers/public';

// const { chains, provider } = configureChains(
//   [mainnet, polygon, optimism, arbitrum],
//   [
//     publicProvider()
//   ]
// );

// const { connectors } = getDefaultWallets({
//   appName: 'Blockpay',
//   projectId: '87888ec0893c8a00b74c61dadf385811',
//   chains
// });

// const wagmiClient = createClient({
//   autoConnect: true,
//   connectors,
//   provider
// })

export default function App({ Component, pageProps }) {
  let options = {
    supabaseUrl: 'https://wirkfttgdyckcpccljwz.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpcmtmdHRnZHlja2NwY2Nsand6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk4NTAxMTgsImV4cCI6MTk5NTQyNjExOH0.vM9aBve5tfiEXLTcIaUSHSv0ssnYiJZ5C45gWpW08fI'
  }

  const [supabase] = useState(() => createBrowserSupabaseClient(options))

  return (
    // <WagmiConfig client={wagmiClient}>
    //   <RainbowKitProvider chains={chains}>
    <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
      <Component {...pageProps} />
    </SessionContextProvider>
    //   </RainbowKitProvider>
    // </WagmiConfig>

  )
}
