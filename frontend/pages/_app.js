import '@/styles/index.css'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'

import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  argentWallet,
  braveWallet,
  ledgerWallet,
  imTokenWallet,
  mewWallet,
  rabbyWallet,
  safeWallet,
  trustWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, bsc, polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import TawkTo from '@/components/Tawk';
import Hotjar from '@hotjar/browser';

const siteId = 3519991;
const hotjarVersion = 6;

Hotjar.init(siteId, hotjarVersion);

const { chains, provider } = configureChains(
  [mainnet, bsc, polygonMumbai],
  [
    publicProvider()
  ]
);

let projectId = '87888ec0893c8a00b74c61dadf385811'
const connectors = connectorsForWallets([
  {
    groupName: 'Popular',
    wallets: [
      injectedWallet({ chains }),
      metaMaskWallet({ projectId, chains }),
      rabbyWallet({ chains }),
      walletConnectWallet({ projectId, chains }),
    ],
  },
  {
    groupName: 'Other',
    wallets: [
      ledgerWallet({ projectId, chains, infuraId: "b423b299acdd4f03abd9357cddf16096" }),
      rainbowWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      coinbaseWallet({ appName: "Blockpay", chains }),
      argentWallet({ projectId, chains }),
      braveWallet({ chains }),
      imTokenWallet({ projectId, chains }),
      mewWallet({ chains }),
      safeWallet({ chains }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

export default function App({ Component, pageProps }) {
  let options = {
    supabaseUrl: 'https://wirkfttgdyckcpccljwz.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpcmtmdHRnZHlja2NwY2Nsand6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk4NTAxMTgsImV4cCI6MTk5NTQyNjExOH0.vM9aBve5tfiEXLTcIaUSHSv0ssnYiJZ5C45gWpW08fI'
  }

  const [supabase] = useState(() => createBrowserSupabaseClient(options))

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} >
        <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
          <TawkTo />
          <Component {...pageProps} />
        </SessionContextProvider>
      </RainbowKitProvider>
    </WagmiConfig>

  )
}
