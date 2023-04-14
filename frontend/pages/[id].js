import React from 'react';
import { supabase } from '@/lib/supabaseClient';
import fetch from 'node-fetch';
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
import Image from "next/image"

const apiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd';


// Page component
const Checkout = ({ checkout }) => {
    function usdToBNB(usdAmount) {
        return fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const bnbPrice = data.binancecoin.usd;
                const bnbAmount = usdAmount / bnbPrice;
                return bnbAmount.toFixed(12);
            })
            .catch(error => console.error(error));
    }
    usdToBNB(checkout.price_in_usd)
        .then(bnbAmount => console.log(`$${checkout.price_in_usd} USD is equivalent to ` + bnbAmount + ' BNB'))
        .catch(error => console.error(error));
    return (
        <div className="bg-white">
            {/* Background color split screen for large screens */}
            <div className="fixed left-0 top-0 hidden h-full w-1/2 bg-gray-50/10 lg:block" aria-hidden="true" />
            <div className="fixed right-0 top-0 hidden h-full w-1/2 bg-white lg:block shadow-md shadow-grey" aria-hidden="true" />

            <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 lg:pt-16">
                <h1 className="sr-only">Checkout</h1>

                <section
                    aria-labelledby="summary-heading"
                    className="bg-indigo-900 py-12 text-grey-300 md:px-10 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0"
                >
                    <div className="p-16 mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
                        <h2 id="summary-heading" className="sr-only">
                            Order summary
                        </h2>

                        <dl>
                            <dt className="text-sm font-medium">Amount due</dt>
                            <dd className="mt-1 text-3xl font-bold tracking-tight text-black">${checkout.price_in_usd}</dd>
                        </dl>

                        <dl className="space-y-6 border-t border-white border-opacity-10 pt-6 text-sm font-medium">
                            <div className="flex items-center justify-between">
                                <dt>Subtotal</dt>
                                <dd>${checkout.price_in_usd}</dd>
                            </div>

                            <div className="flex items-center justify-between">
                                <dt>Taxes</dt>
                                <dd>$0</dd>
                            </div>

                            <div className="flex items-center justify-between border-t border-gray border-opacity-20 pt-6 text-black">
                                <dt className="text-base">Total</dt>
                                <dd className="text-base">${checkout.price_in_usd}</dd>
                            </div>
                        </dl>
                    </div>
                </section>

                <section
                    aria-labelledby="payment-and-shipping-heading"
                    className="py-16 mt-12  lg:col-start-2 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:pb-24 lg:pt-0"
                >
                    <h2 id="payment-and-shipping-heading" className="sr-only">
                        Payment and shipping details
                    </h2>

                    <div className="ml-4">
                        <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
                            <div>
                                <h3 id="contact-info-heading" className="text-lg font-medium text-gray-900">
                                    Contact information
                                </h3>

                                <div>
                                    <label htmlFor="email" className="mt-6 block text-sm font-medium leading-6 text-gray-900">
                                        Email
                                    </label>
                                    <div className="mt-2 w-25">
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            className="block w-full rounded-md border-0 py-1.5 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10">
                                <h3 className="text-lg font-medium text-gray-900">Payment method</h3>

                                <div className="mt-6 ">
                                    <div className="mt-6 col-span-3 sm:col-span-4">
                                        <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                                            Bitcoin
                                        </label>
                                        <div className="grid gap-x-2 grid-cols-3 sm:col-span-3">
                                            <button
                                                className="mt-2 inline-flex items-center justify-center bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                            >
                                                <Image
                                                    src={Bitcoin}
                                                    alt="Bitcoin"
                                                    width={24} // Set the image width
                                                    height={24} // Set the image height
                                                    className="mr-2"
                                                />
                                                <span>Bitcoin</span>
                                            </button>
                                            <button
                                                className="opacity-50 mt-2 inline-flex items-center justify-center bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                                disabled
                                            >
                                                <Image
                                                    src={BitcoinCash}
                                                    alt="BitcoinCash"
                                                    width={24} // Set the image width
                                                    height={24} // Set the image height
                                                    className="mr-2"
                                                />
                                                <span>Bitcoin Cash</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-6 grid-cols-2 sm:grid-cols-3">
                                        <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">
                                            Ethereum
                                        </label>
                                        <div className="grid gap-x-2 grid-cols-3 sm:col-span-3">
                                            <button
                                                className="mt-2 inline-flex items-center justify-center bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py- shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                            >
                                                <Image
                                                    src={Ethereum}
                                                    alt="Ethereum"
                                                    width={24} // Set the image width
                                                    height={24} // Set the image height
                                                    className="mr-2"
                                                />
                                                <span>Ethereum</span>
                                            </button>

                                            <button
                                                className="opacity-50 mt-2 inline-flex items-center justify-center bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                                disabled
                                            >
                                                <Image
                                                    src={Tether}
                                                    alt="Tether(ERC-20)"
                                                    width={24} // Set the image width
                                                    height={24} // Set the image height
                                                    className="mr-2"
                                                />
                                                <span>USDT</span>
                                            </button>
                                            <button
                                                className="opacity-50 mt-2 inline-flex items-center justify-center bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                                disabled
                                            >
                                                <Image
                                                    src={USDC}
                                                    alt="USDC(ERC-20)"
                                                    width={24} // Set the image width
                                                    height={24} // Set the image height
                                                    className="mr-2"
                                                />
                                                <span>USDC</span>
                                            </button>
                                            <button
                                                className="opacity-50 mt-2 inline-flex items-center justify-center bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                                disabled
                                            >
                                                <Image
                                                    src={BUSD}
                                                    alt="BUSD(ERC-20)"
                                                    width={24} // Set the image width
                                                    height={24} // Set the image height
                                                    className="mr-2"
                                                />
                                                <span>BUSD</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 grid-cols-2 sm:grid-cols-3">
                                    <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">
                                        Binance Smart Chain
                                    </label>
                                    <div className="grid gap-x-2 grid-cols-3 sm:col-span-3">
                                        <button
                                            className="mt-2 inline-flex items-center justify-center bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py- shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                        >
                                            <Image
                                                src={BNB}
                                                alt="bnb"
                                                width={24} // Set the image width
                                                height={24} // Set the image height
                                                className="mr-2"
                                            />
                                            <span>BNB</span>
                                        </button>
                                        <button
                                            className="opacity-50 mt-2 inline-flex items-center justify-center bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                            disabled
                                        >
                                            <Image
                                                src={Tether}
                                                alt="Tether(ERC-20)"
                                                width={24} // Set the image width
                                                height={24} // Set the image height
                                                className="mr-2"
                                            />
                                            <span>USDT</span>
                                        </button>
                                        <button
                                            className="opacity-50 mt-2 inline-flex items-center justify-center bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                            disabled
                                        >
                                            <Image
                                                src={USDC}
                                                alt="USDC(ERC-20)"
                                                width={24} // Set the image width
                                                height={24} // Set the image height
                                                className="mr-2"
                                            />
                                            <span>USDC</span>
                                        </button>
                                        <button
                                            className="opacity-50 mt-2 inline-flex items-center justify-center bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                            disabled
                                        >
                                            <Image
                                                src={BUSD}
                                                alt="BUSD(ERC-20)"
                                                width={24} // Set the image width
                                                height={24} // Set the image height
                                                className="mr-2"
                                            />
                                            <span>BUSD</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-6 grid-cols-2 sm:grid-cols-3">
                                    <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">
                                        Tron
                                    </label>
                                    <div className="grid gap-x-2 grid-cols-3 sm:col-span-3">
                                        <button
                                            className="mt-2 inline-flex items-center justify-center bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py- shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                        >
                                            <Image
                                                src={Tron}
                                                alt="tron"
                                                width={24} // Set the image width
                                                height={24} // Set the image height
                                                className="mr-2"
                                            />
                                            <span>Tron</span>
                                        </button>
                                        <button
                                            className="opacity-50 mt-2 inline-flex items-center justify-center bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                            disabled
                                        >
                                            <Image
                                                src={Tether}
                                                alt="Tether(ERC-20)"
                                                width={24} // Set the image width
                                                height={24} // Set the image height
                                                className="mr-2"
                                            />
                                            <span>USDT</span>
                                        </button>
                                        <button
                                            className="opacity-50 mt-2 inline-flex items-center justify-center bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                            disabled
                                        >
                                            <Image
                                                src={USDC}
                                                alt="USDC(ERC-20)"
                                                width={24} // Set the image width
                                                height={24} // Set the image height
                                                className="mr-2"
                                            />
                                            <span>USDC</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 grid-cols-2 sm:grid-cols-3">
                                <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">
                                    Arbitrum
                                </label>
                                <div className="grid gap-x-2 grid-cols-3 sm:col-span-3">
                                    <button
                                        className="mt-2 inline-flex items-center justify-center bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py- shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                    >
                                        <Image
                                            src={Arbitrum}
                                            alt="Arbitrum"
                                            width={24} // Set the image width
                                            height={24} // Set the image height
                                            className="mr-2"
                                        />
                                        <span>Arbitrum</span>
                                    </button>
                                    <button
                                        className="opacity-50 mt-2 inline-flex items-center justify-center bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                        disabled
                                    >
                                        <Image
                                            src={Tether}
                                            alt="Tether(ERC-20)"
                                            width={24} // Set the image width
                                            height={24} // Set the image height
                                            className="mr-2"
                                        />
                                        <span>USDT</span>
                                    </button>
                                    <button
                                        className="opacity-50 mt-2 inline-flex items-center justify-center bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                        disabled
                                    >
                                        <Image
                                            src={USDC}
                                            alt="USDC(ERC-20)"
                                            width={24} // Set the image width
                                            height={24} // Set the image height
                                            className="mr-2"
                                        />
                                        <span>USDC</span>
                                    </button>
                                </div>
                            </div>
                            <div className="mt-6 grid-cols-2 sm:grid-cols-3">
                                <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">
                                    Polygon
                                </label>
                                <div className="grid gap-x-2 grid-cols-3 sm:col-span-3">
                                    <button
                                        className="mt-2 inline-flex items-center justify-center bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py- shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                    >
                                        <Image
                                            src={Polygon}
                                            alt="Polygon"
                                            width={24} // Set the image width
                                            height={24} // Set the image height
                                            className="mr-2"
                                        />
                                        <span>Polygon</span>
                                    </button>
                                    <button
                                        className="opacity-50 mt-2 inline-flex items-center justify-center bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                        disabled
                                    >
                                        <Image
                                            src={Tether}
                                            alt="Tether(ERC-20)"
                                            width={24} // Set the image width
                                            height={24} // Set the image height
                                            className="mr-2"
                                        />
                                        <span>USDT</span>
                                    </button>
                                    <button
                                        className="opacity-50 mt-2 inline-flex items-center justify-center bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                        disabled
                                    >
                                        <Image
                                            src={USDC}
                                            alt="USDC(ERC-20)"
                                            width={24} // Set the image width
                                            height={24} // Set the image height
                                            className="mr-2"
                                        />
                                        <span>USDC</span>
                                    </button>
                                </div>
                            </div>
                            <div className="mt-6 grid-cols-2 sm:grid-cols-3">
                                <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">
                                    Solana
                                </label>
                                <div className="grid gap-x-2 grid-cols-3 sm:col-span-3">
                                    <button
                                        className="mt-2 inline-flex items-center justify-center bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py- shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                    >
                                        <Image
                                            src={Solana}
                                            alt="Solana"
                                            width={24} // Set the image width
                                            height={24} // Set the image height
                                            className="mr-2"
                                        />
                                        <span>Solana</span>
                                    </button>
                                    <button
                                        className="opacity-50 mt-2 inline-flex items-center justify-center bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                        disabled
                                    >
                                        <Image
                                            src={Tether}
                                            alt="Tether(ERC-20)"
                                            width={24} // Set the image width
                                            height={24} // Set the image height
                                            className="mr-2"
                                        />
                                        <span>USDT</span>
                                    </button>
                                    <button
                                        className="opacity-50 mt-2 inline-flex items-center justify-center bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                        disabled
                                    >
                                        <Image
                                            src={USDC}
                                            alt="USDC(ERC-20)"
                                            width={24} // Set the image width
                                            height={24} // Set the image height
                                            className="mr-2"
                                        />
                                        <span>USDC</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex justify-end border-t border-gray-200 pt-6">
                            <button
                                type="submit"
                                className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                            >
                                Pay now
                            </button>
                        </div>
                    </div>
                </section>
            </div >
        </div >
    );
};

export default Checkout;

// Fetch data from Supabase database
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
