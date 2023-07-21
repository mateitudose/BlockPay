import React, { useEffect } from 'react';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
import { useRouter } from 'next/router'

import {
    ChevronLeftIcon,
    BuildingStorefrontIcon,
} from '@heroicons/react/24/outline';

import Ethereum from "@/public/Crypto/Ethereum.svg"
import Tether from "@/public/Crypto/Tether.svg"
import USDC from "@/public/Crypto/Circle_USDC.svg"
import BNB from "@/public/Crypto/BNB.svg"
import BUSD from "@/public/Crypto/BUSD.svg"
import Arbitrum from "@/public/Crypto/Arbitrum.svg"
import Polygon from "@/public/Crypto/Polygon.svg"
import WBTC from "@/public/Crypto/WBTC.svg"
import Avax from "@/public/Crypto/Avax.svg"
import logo from "@/public/logo_dark.svg"

import Image from "next/image"
import toast, { Toaster } from 'react-hot-toast';
import cryptos from '@/components/cryptos';


const Checkout = ({ checkout }) => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [selectedCrypto, setSelectedCrypto] = useState('');
    const [loading, setLoading] = useState(false);
    const [showChains, setShowChains] = useState(false);
    const [storeName, setStoreName] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!validateEmail(email)) {
            toast.error('Please enter a valid email address.');
            return;
        }
        if (!email) {
            toast.error('Please enter a valid email address.');
            return;
        }
        if (!selectedCrypto) {
            toast.error('Please select a cryptocurrency.');
            return;
        }
        setLoading(true);

        let id = uuidv4();
        const { data, error } = await supabase
            .from('invoices')
            .insert({
                id: id,
                merchant_id: checkout.merchant_id,
                product_id: checkout.id,
                customer_email: email,
                created_at: new Date().getTime(),
                crypto_option: selectedCrypto,
                price_in_usd: checkout.price_in_usd,
                value_to_receive: (await fetchCryptoPrice(selectedCrypto, checkout.price_in_usd)).cryptoAmount,
                address: '',
                status: 'Awaiting payment',
                exchange_rate: (await fetchCryptoPrice(selectedCrypto, checkout.price_in_usd)).cryptoPrice,
                product_name: checkout.product_name,
            });
        if (error) {
            toast.error(error.message);
        }
        else {
            router.push(`/i/${id}`);
        }
    }

    async function fetchCryptoPrice(cryptoId, usdAmount) {
        // for stablecoins
        if (["USDT(ERC-20)", "USDT(BEP-20)", "BUSD(ERC-20)", "BUSD(BEP-20)", "USDC(ERC-20)", "USDC(BEP-20)"].includes(cryptoId)) {
            return { cryptoAmount: usdAmount, cryptoPrice: "1.00" };
        }

        // mapping between your crypto symbol and coingecko id
        const coinGeckoIdMap = {
            'BTC': 'bitcoin',
            'ETH': 'ethereum',
            'BNB': 'binancecoin',
            'LTC': 'litecoin',
            'AVAX': 'avalanche-2',
            'ARB': 'arbitrum',
            'MATIC': 'matic-network',
            'WBTC': 'wrapped-bitcoin'
        };

        // get the main part of cryptoId (before any parentheses)
        const cryptoMainId = cryptoId.split('(')[0];

        const coinGeckoId = coinGeckoIdMap[cryptoMainId];
        if (!coinGeckoId) {
            throw new Error('Unsupported cryptocurrency for CoinGecko API');
        }

        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoId}&vs_currencies=usd`;
        const response = await fetch(url);
        const data = await response.json();
        const cryptoPrice = data[coinGeckoId].usd;
        const cryptoAmount = usdAmount / cryptoPrice;
        console.log(cryptoAmount, cryptoPrice, usdAmount, cryptoId);

        return { cryptoAmount, cryptoPrice };
    }



    useEffect(() => {
        const set = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('store_name')
                .eq('id', checkout.merchant_id)
                .single();
            if (error) {
                toast.error(error.message);
            }
            else {
                document.title = `Checkout | ${data.store_name}`;
                setStoreName(data.store_name);
            }
        }
        set();
    }, []);

    return (
        <div className="bg-white">
            <title>Checkout | Blockpay</title>
            <Toaster position="top-right"
                reverseOrder={false} />
            {/* Background color split screen for large screens */}
            <div className="fixed left-0 top-0 hidden h-full w-1/2 bg-gray-50/25 lg:block" aria-hidden="true" />
            <div className="fixed right-0 top-0 hidden h-full w-1/2 bg-white lg:block drop-shadow shadow-lg shadow-grey" aria-hidden="true" />

            <div className="lg:mt-28 relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 lg:pt-16">
                <h1 className="sr-only">Checkout</h1>

                <section
                    aria-labelledby="summary-heading"
                    className="px-4 pb-12 lg:py-12 text-grey-300 lg:px-10 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0 relative"
                >
                    <div className="lg:shadow-none lg:p-0 lg:pb-0 lg:rounded-none shadow-lg rounded-xl p-3 pb-6 mx-auto max-w-2xl px-6 lg:max-w-none lg:px-0">
                        <h2 id="summary-heading" className="sr-only">
                            Order summary
                        </h2>
                        <dl className='space-y-6 text-sm font-medium'>
                            <span className="text-base block">Order details</span>

                            <div className="pb-6 flex items-center justify-between">
                                <dt className="font-medium"><span className='text-black/50 mr-3'>1x</span>{checkout.product_name}</dt>
                                <dd>${checkout.price_in_usd}</dd>
                            </div>
                        </dl>

                        <dl className="space-y-6 border-t border-gray border-opacity-20 pt-6 text-sm font-medium">
                            <div className="flex items-center justify-between">
                                <dt className='opacity-50'>Subtotal</dt>
                                <dd>${checkout.price_in_usd}</dd>
                            </div>

                            <div className="flex items-center justify-between">
                                <dt className='opacity-50'>Tax</dt>
                                <dd>$0</dd>
                            </div>

                            <div className="flex items-center justify-between border-t border-gray border-opacity-20 pt-6 text-black text-sm">
                                <dt className="">Total</dt>
                                <dd className="">${checkout.price_in_usd}</dd>
                            </div>
                            <a href="https://blockpay.com" target='_blank'>
                                <div className="hidden lg:block fixed bottom-1/4 opacity-80 grayscale hover:grayscale-0">
                                    Powered by
                                    <Image className='w-auto h-6 inline-block pb-0.5 ml-1' src={logo} />
                                </div>
                            </a>
                        </dl>
                    </div>
                </section>

                <section
                    aria-labelledby="payment-and-shipping-heading"
                    className="lg:col-start-2 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:pb-24 lg:pt-0"
                >
                    <h2 id="payment-and-shipping-heading" className="sr-only">
                        Payment and shipping details
                    </h2>

                    <div className="px-4 lg:ml-4">
                        <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
                            <div>
                                <h3 id="contact-info-heading" className="text-lg font-medium text-gray-900">
                                    Contact information
                                </h3>
                                <div className='text-xs text-black/60'>Enter your email so we can send you an invoice</div>

                                <div>
                                    <label htmlFor="email" className="mt-6 block text-sm font-medium leading-6 text-black/60">
                                        Email<span className='text-red-500'>*</span>
                                    </label>
                                    <div className="mt-2 w-25">
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            className="placeholder:text-sm lg:border-0 lg:text-base block w-full rounded-md border py-1.5 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 lg:text-sm lg:leading-6"
                                            placeholder="you@example.com"
                                            required
                                            value={email}
                                            onChange={handleEmailChange}
                                            autoComplete='email'
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10">
                                <h3 className="text-lg font-medium text-gray-900">Payment method</h3>
                                <div className='text-xs text-black/60'>{!showChains ? "Select your preferred cryptocurrency" : "Select your preferred chain"}</div>

                                <div className="mt-6">
                                    <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                                        <button
                                            className="inline-flex items-center justify-start"
                                            onClick={() => setShowChains(false)}
                                        >
                                            <ChevronLeftIcon className={`inline-block h-4 w-4 text-gray-400 ${!showChains ? "hidden" : ""}`} aria-hidden="true" />
                                            {!showChains ? "Crypto" : "Chains"}
                                        </button>
                                    </label>
                                    {!showChains ? (
                                        <div className="grid gap-x-3 grid-cols-3 lg:col-span-3 mt-2">
                                            {
                                                /* <button
                                            className="mt-2 inline-flex items-center justify-start bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus:scale-110 transform transition-transform duration-300 hover:scale-105"
                                            onClick={() => setSelectedCrypto(1)}
                                        >
                                            <Image
                                                src={Bitcoin}
                                                alt="Bitcoin"
                                                width={18} 
                                                height={18} 
                                                className="mr-2 lg:w-6 lg:h-6"
                                            />
                                            <span className='block lg:hidden'>BTC</span>
                                            <span className='hidden lg:block'>Bitcoin</span>
                                             </button> */
                                            }
                                            <button
                                                className="drop-shadow shadow-[#53ae94] py-2 mt-2 inline-flex items-center justify-start bg-white text-gray-700 font-semibold text-sm rounded-lg border border-[#53ae94] bg-white px-4 shadow-sm focus:scale-110 transform transition-transform duration-300 hover:scale-105"
                                                onClick={() => {
                                                    setSelectedCrypto("USDT"), setShowChains(true)
                                                    document.activeElement.blur();
                                                }}
                                            >
                                                <Image
                                                    src={Tether}
                                                    alt="USDT"
                                                    width={18}
                                                    height={18}
                                                    className="mr-2 lg:w-6 lg:h-6"
                                                />
                                                <span>USDT</span>
                                            </button>
                                            <button
                                                className="drop-shadow shadow-[#F0B90B] py-2 mt-2 inline-flex items-center justify-start bg-white text-gray-700 font-semibold text-sm rounded-lg border border-[#F0B90B] bg-white px-4 shadow-sm focus:scale-110 transform transition-transform duration-300 hover:scale-105"
                                                onClick={() => {
                                                    setSelectedCrypto("BUSD"), setShowChains(true)
                                                    document.activeElement.blur();
                                                }}
                                            >
                                                <Image
                                                    src={BUSD}
                                                    alt="BUSD"
                                                    width={18}
                                                    height={18}
                                                    className="mr-2 lg:w-6 lg:h-6"
                                                />
                                                <span>BUSD</span>
                                            </button>
                                            <button
                                                className="drop-shadow shadow-[#2775ca] py-2 mt-2 inline-flex items-center justify-start bg-white text-gray-700 font-semibold text-sm rounded-lg border border-[#2775ca] bg-white px-4 shadow-sm focus:scale-110 transform transition-transform duration-300 hover:scale-105"
                                                onClick={() => {
                                                    setSelectedCrypto("USDC"), setShowChains(true)
                                                    document.activeElement.blur();
                                                }}
                                            >
                                                <Image
                                                    src={USDC}
                                                    alt="USDC"
                                                    width={18}
                                                    height={18}
                                                    className="mr-2 lg:w-6 lg:h-6"
                                                />
                                                <span>USDC</span>
                                            </button>
                                            <button
                                                className="drop-shadow shadow-[#627EEA] mt-2 inline-flex items-center justify-start bg-white text-gray-700 font-semibold text-sm rounded-lg border border-[#627EEA] bg-white px-4 shadow-sm focus:scale-110 transform transition-transform duration-300 hover:scale-105"
                                                onClick={() => setSelectedCrypto("ETH")}
                                            >
                                                <Image
                                                    src={Ethereum}
                                                    alt="Ethereum"
                                                    width={18}
                                                    height={18}
                                                    className="mr-2 lg:w-6 lg:h-6"
                                                />
                                                <span className='block lg:hidden'>ETH</span>
                                                <span className='hidden lg:block'>Ethereum</span>
                                            </button>
                                            <button
                                                className="drop-shadow shadow-[#F0B90B] mt-2 inline-flex items-center justify-start bg-white text-gray-700 font-semibold text-sm rounded-lg border border-[#F0B90B] bg-white px-4 shadow-sm focus:scale-110 transform transition-transform duration-300 hover:scale-105"
                                                onClick={() => setSelectedCrypto("BNB")}
                                            >
                                                <Image
                                                    src={BNB}
                                                    alt="BNB"
                                                    width={18}
                                                    height={18}
                                                    className="mr-2 lg:w-6 lg:h-6"
                                                />
                                                <span>BNB</span>
                                            </button>
                                            {
                                                /* <button
                                                    className="py-2 mt-2 inline-flex items-center justify-start bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py- shadow-sm focus:scale-110 transform transition-transform duration-300 hover:scale-105"
                                                    onClick={() => setSelectedCrypto(4)}
                                                >
                                                    <Image
                                                        src={Litecoin}
                                                        alt="Litecoin"
                                                        width={18} 
                                                        height={18} 
                                                        className="mr-2 lg:w-6 lg:h-6"
                                                    />
                                                    <span className='block lg:hidden'>LTC</span>
                                                    <span className='hidden lg:block'>Litecoin</span>
                                                </button> */
                                            }
                                            <button
                                                className="drop-shadow shadow-[#E84142] py-2 mt-2 inline-flex items-center justify-start bg-white text-gray-700 font-semibold text-sm rounded-lg border border-[#E84142] bg-white px-4 shadow-sm focus:scale-110 transform transition-transform duration-300 hover:scale-105"
                                                onClick={() => setSelectedCrypto("AVAX")}
                                            >
                                                <Image
                                                    src={Avax}
                                                    alt="Avax"
                                                    width={18}
                                                    height={18}
                                                    className="mr-2 lg:w-6 lg:h-6"
                                                />
                                                <span className='block lg:hidden'>AVAX</span>
                                                <span className='hidden lg:block'>Avalanche</span>
                                            </button>
                                            <button
                                                className="drop-shadow shadow-[#12AAFF] mt-2 inline-flex items-center justify-start bg-white text-gray-700 font-semibold text-sm rounded-lg border border-[#12AAFF] bg-white px-4 shadow-sm focus:scale-110 transform transition-transform duration-300 hover:scale-105"
                                                onClick={() => setSelectedCrypto("ARB")}
                                            >
                                                <Image
                                                    src={Arbitrum}
                                                    alt="Arbitrum"
                                                    width={18}
                                                    height={18}
                                                    className="mr-2 lg:w-6 lg:h-6"
                                                />
                                                <span className='block lg:hidden'>ARB</span>
                                                <span className='hidden lg:block'>Arbitrum</span>
                                            </button>
                                            <button
                                                className="drop-shadow shadow-[#7b3fe4] mt-2 inline-flex items-center justify-start bg-white text-gray-700 font-semibold text-sm rounded-lg border border-[#7b3fe4] bg-white px-4 shadow-sm focus:scale-110 transform transition-transform duration-300 hover:scale-105"
                                                onClick={() => setSelectedCrypto("MATIC")}
                                            >
                                                <Image
                                                    src={Polygon}
                                                    alt="Matic"
                                                    width={18}
                                                    height={18}
                                                    className="mr-2 lg:w-6 lg:h-6"
                                                />
                                                <span className='block lg:hidden'>MATIC</span>
                                                <span className='hidden lg:block'>Polygon</span>
                                            </button>
                                            <button
                                                className="drop-shadow shadow-[#f7931a] py-2 mt-2 inline-flex items-center justify-start bg-white text-gray-700 font-semibold text-sm rounded-lg border border-[#f7931a] bg-white px-4 shadow-sm focus:scale-110 transform transition-transform duration-300 hover:scale-105"
                                                onClick={() => setSelectedCrypto("WBTC")}
                                            >
                                                <Image
                                                    src={WBTC}
                                                    alt="WBTC"
                                                    width={18}
                                                    height={18}
                                                    className="mr-2 lg:w-6 lg:h-6"
                                                />
                                                WBTC
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="grid gap-x-4 grid-cols-2 lg:col-span-2 mt-2">
                                            <button
                                                className="drop-shadow shadow-[#627EEA] py-2 mt-2 inline-flex items-center justify-start bg-white text-gray-700 font-semibold text-sm rounded-lg border border-[#627EEA] bg-white px-4 py- shadow-sm focus:scale-110 transform transition-transform duration-300 hover:scale-105"
                                                onClick={() => {
                                                    if (selectedCrypto === "USDT" || selectedCrypto === "BUSD" || selectedCrypto === "USDC") {
                                                        setSelectedCrypto(selectedCrypto + "(ERC-20)")
                                                        setShowChains(true)
                                                    }
                                                }}
                                            >
                                                <Image
                                                    src={Ethereum}
                                                    alt="ERC-20"
                                                    width={18}
                                                    height={18}
                                                    className="mr-2 lg:w-6 lg:h-6"
                                                />
                                                <span>ERC-20</span>
                                            </button>
                                            <button
                                                className="drop-shadow shadow-[#F0B90B] py-2 mt-2 inline-flex items-center justify-start bg-white text-gray-700 font-semibold text-sm rounded-lg border border-[#F0B90B] bg-white px-4 py- shadow-sm focus:scale-110 transform transition-transform duration-300 hover:scale-105"
                                                onClick={() => {
                                                    if (selectedCrypto === "USDT" || selectedCrypto === "BUSD" || selectedCrypto === "USDC") { 
                                                        setSelectedCrypto(selectedCrypto + "(BEP-20)")
                                                        setShowChains(true)
                                                    }
                                                }}
                                            >
                                                <Image
                                                    src={BNB}
                                                    alt="BEP-20"
                                                    width={18}
                                                    height={18}
                                                    className="mr-2 lg:w-6 lg:h-6"
                                                />
                                                <span>BEP-20</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {/* <div className='mt-6'>
                                        <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                                            Tokens
                                        </label>
                                        <div className="grid gap-x-2 grid-cols-1 sm:col-span-3 mt-2">
                                            <CryptoCombobox />
                                        </div>
                                    </div> */}

                                <div className="mt-10 font-medium text-center border-t border-gray-200 pt-6 pb-6">
                                    <button
                                        type="submit"
                                        className="rounded-md border border-transparent bg-[#0a0a0a] shadow-[#0a0a0a]/50 shadow-lg w-full py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="inline-flex items-center justify-center animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                                    <circle
                                                        className="opacity-5"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Processing...
                                            </>
                                        ) : (
                                            'Pay now'
                                        )}
                                    </button>
                                    <a href="https://blockpay.app" target='_blank'>
                                        <div className="block lg:hidden opacity-80 mt-36 font-medium">
                                            Powered by
                                            <Image className='w-auto h-6 inline-block pb-0.5 ml-1.5' src={logo} />
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section >
            </div >
        </div >
    );
};

export default Checkout;

export async function getServerSideProps({ params }) {
    const { id } = params;
    const { data, error } = await supabase
        .from('checkout')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.log(error);
        return {
            notFound: true,
        };
    }

    return {
        props: {
            checkout: data,
        },
    };
}
