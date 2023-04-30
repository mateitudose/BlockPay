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

const cryptos = [
    {
        id: 1,
        name: "Bitcoin",
        icon: Bitcoin,
        symbol: "BTC",
        chain: "Bitcoin Mainnet",
        background_color: "bg-[#f7931a]",
    },
    {
        id: 2,
        name: "Ethereum",
        icon: Ethereum,
        symbol: "ETH",
        chain: "Ethereum Mainnet",
        background_color: "bg-[#627EEA]",
    },
    {
        id: 3,
        name: "Binance Coin",
        icon: BNB,
        symbol: "BNB",
        chain: "Binance Smart Chain Mainnet",
        background_color: "bg-[#F0B90B]",
    },
    {
        id: 4,
        name: "Litecoin",
        icon: Litecoin,
        symbol: "LTC",
        chain: "Litecoin Mainnet",
        background_color: "bg-[#bebebe]",
    },
    {
        id: 5,
        name: "Avax",
        icon: Avax,
        symbol: "AVAX",
        chain: "Avalanche Mainnet",
        background_color: "bg-[#E84142]",
    },
    {
        id: 6,
        name: "Arbitrum",
        icon: Arbitrum,
        symbol: "ARB",
        chain: "Arbitrum Mainnet",
        background_color: "bg-[#213147]",
    },
    {
        id: 7,
        name: "Polygon",
        icon: Polygon,
        symbol: "MATIC",
        chain: "Polygon Mainnet",
        background_color: "bg-[#7b3fe4]",
    },
    {
        id: 8,
        name: "Solana",
        icon: Solana,
        symbol: "SOL",
        chain: "Solana Mainnet",
        background_color: "bg-[#000]",
    },
]

export default cryptos