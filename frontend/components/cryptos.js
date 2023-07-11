import Bitcoin from "@/public/Crypto/Bitcoin.svg"
import BitcoinCash from "@/public/Crypto/Bitcoin_Cash.svg"
import Ethereum from "@/public/Crypto/Ethereum.svg"
import Tether from "@/public/Crypto/Tether.svg"
import USDC from "@/public/Crypto/Circle_USDC.svg"
import BNB from "@/public/Crypto/BNB.svg"
import BUSD from "@/public/Crypto/BUSD.svg"
import Tron from "@/public/Crypto/Tron.svg"
import Arbitrum from "@/public/Crypto/Arbitrum.svg"
import Polygon from "@/public/Crypto/Polygon.svg"
import Solana from "@/public/Crypto/Solana.svg"
import Litecoin from "@/public/Crypto/Litecoin.svg"
import Avax from "@/public/Crypto/Avax.svg"
import WBTC from "@/public/Crypto/WBTC.svg"

const cryptos = [
    {
        id: "BTC",
        name: "Bitcoin",
        icon: Bitcoin,
        symbol: "BTC",
        chain: "Bitcoin Mainnet",
        background_color: "bg-[#f7931a]",
        sym: "BTC",
    },
    {
        id: "ETH",
        name: "Ethereum",
        icon: Ethereum,
        symbol: "ETH",
        chain: "Ethereum Mainnet",
        background_color: "bg-[#627EEA]",
        sym: "ETH",
    },
    {
        id: "BNB",
        name: "Binance Coin",
        icon: BNB,
        symbol: "BNB",
        chain: "Binance Smart Chain Mainnet",
        background_color: "bg-[#F0B90B]",
        sym: "BNB",
    },
    {
        id: "LTC",
        name: "Litecoin",
        icon: Litecoin,
        symbol: "LTC",
        chain: "Litecoin Mainnet",
        background_color: "bg-[#bebebe]",
        sym: "LTC",
    },
    {
        id: "AVAX",
        name: "Avax",
        icon: Avax,
        symbol: "AVAX",
        chain: "Avalanche Mainnet",
        background_color: "bg-[#E84142]",
        sym: "AVAX",
    },
    {
        id: "ARB",
        name: "Arbitrum",
        icon: Arbitrum,
        symbol: "ARB",
        chain: "Arbitrum Mainnet",
        background_color: "bg-[#213147]",
        sym: "ARB",
    },
    {
        id: "MATIC",
        name: "Polygon",
        icon: Polygon,
        symbol: "MATIC",
        chain: "Polygon Mainnet",
        background_color: "bg-[#7b3fe4]",
        sym: "MATIC",
    },
    {
        id: "SOL",
        name: "Solana",
        icon: Solana,
        symbol: "SOL",
        chain: "Solana Mainnet",
        background_color: "bg-[#000]",
        sym: "SOL",
    },
    {
        id: "USDT(ERC-20)",
        name: 'USDT (ERC-20)',
        icon: Tether,
        symbol: "USDT",
        chain: "Ethereum Mainnet (ERC-20)",
        background_color: "bg-[#53ae94]",
        sym: "USDT",
    },
    {
        id: 'USDT(BEP-20)',
        name: 'USDT (BEP-20)',
        icon: Tether,
        symbol: "USDT",
        chain: "Binance Smart Chain Mainnet (BEP-20)",
        background_color: "bg-[#53ae94]",
        sym: "USDT",
    },
    {
        id: 'BUSD(ERC-20)',
        name: 'BUSD (ERC-20)',
        icon: BUSD,
        symbol: "BUSD",
        chain: "Ethereum Mainnet (ERC-20)",
        background_color: "bg-[#F0B90B]",
        sym: "BUSD",
    },
    {
        id: 'BUSD(BEP-20)',
        name: 'BUSD (BEP-20)',
        icon: BUSD,
        symbol: "BUSD",
        chain: "Binance Smart Chain Mainnet (BEP-20)",
        background_color: "bg-[#F0B90B]",
        sym: "BUSD",
    },
    {
        id: 'USDC(ERC-20)',
        name: 'USDC (ERC-20)',
        icon: USDC,
        symbol: "USDC",
        chain: "Ethereum Mainnet (ERC-20)",
        background_color: "bg-[#2775ca]",
        sym: "USDC",
    },
    {
        id: 'USDC(BEP-20)',
        name: 'USDC (BEP-20)',
        icon: USDC,
        symbol: "USDC",
        chain: "Binance Smart Chain Mainnet (BEP-20)",
        background_color: "bg-[#2775ca]",
        sym: "USDC",
    },
    {
        id: 'WBTC',
        name: 'Wrapped Bitcoin',
        icon: WBTC,
        symbol: "WBTC",
        chain: "Ethereum Mainnet (ERC-20)",
        background_color: "bg-transparent",
        sym: "WBTC",
    },
]

export default cryptos