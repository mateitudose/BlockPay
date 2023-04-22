import React from 'react';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
import { useRouter } from 'next/router'


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
import logo from "@/public/logo.svg"

import Image from "next/image"
import toast, { Toaster } from 'react-hot-toast';


// Page component
const Checkout = ({ checkout }) => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [selectedCrypto, setSelectedCrypto] = useState(0);
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
        // Continue with payment
        let id = uuidv4();
        const { data, error } = await supabase
            .from('invoices')
            .insert({
                id: id,
                merchant_id: checkout.merchant_id,
                customer_email: email,
                created_at: new Date().getTime(),
                crypto_option: selectedCrypto,
                price_in_usd: checkout.price_in_usd,
                value_to_receive: (await fetchCryptoPrice(selectedCrypto, checkout.price_in_usd)).cryptoAmount,
                confirmed: false,
                address: '',
                status: 'Awaiting payment',
                exchange_rate: (await fetchCryptoPrice(selectedCrypto, checkout.price_in_usd)).cryptoPrice,
            });
        if (error) {
            toast.error(error.message);
        }
        else {
            router.push(`/invoice/${id}`);
        }
    }

    async function fetchCryptoPrice(cryptoId, usdAmount) {
        const cryptoIds = ['bitcoin', 'ethereum', 'binancecoin', 'litecoin', 'avalanche-2', 'arbitrum', 'matic-network', 'solana'];
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds[cryptoId - 1]}&vs_currencies=usd`;
        const response = await fetch(url);
        const data = await response.json();
        const cryptoPrice = data[cryptoIds[cryptoId - 1]].usd;
        const cryptoAmount = usdAmount / cryptoPrice;
        return { cryptoAmount, cryptoPrice };
    }



    return (
        <div className="bg-white">
            <title>Checkout</title>
            <Toaster position="top-right"
                reverseOrder={false} />
            {/* Background color split screen for large screens */}
            <div className="fixed left-0 top-0 hidden h-full w-1/2 bg-gray-50/10 lg:block" aria-hidden="true" />
            <div className="fixed right-0 top-0 hidden h-full w-1/2 bg-white lg:block shadow-md shadow-grey" aria-hidden="true" />

            <div className="mt-28 relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 lg:pt-16">
                <h1 className="sr-only">Checkout</h1>

                <section
                    aria-labelledby="summary-heading"
                    className="bg-indigo-900 py-12 text-grey-300 md:px-10 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0 relative"
                >
                    <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
                        <h2 id="summary-heading" className="sr-only">
                            Order summary
                        </h2>
                        <h1></h1>

                        <dl className='py-6 space-y-6 text-sm font-medium'>
                            <div className="flex items-center justify-between">
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
                            <div className="hidden lg:block absolute bottom-1/4 left-0 opacity-50">Powered by <Image className='w-36 inline-block pb-0.5 ml-1' src={logo}/></div>
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

                    <div className="ml-4">
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
                                            className="block w-full rounded-md border-0 py-1.5 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                                <div className='text-xs text-black/60'>Select your preferred cryptocurrency</div>

                                <div className="mt-6">
                                    <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                                        Crypto
                                    </label>
                                    <div className="grid gap-x-2 grid-cols-3 sm:col-span-3 mt-2">
                                        <button
                                            className="mt-2 inline-flex items-center justify-start bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                            onClick={() => setSelectedCrypto(1)}
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
                                            className="mt-2 inline-flex items-center justify-start bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py- shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                            onClick={() => setSelectedCrypto(2)}
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
                                            className="mt-2 inline-flex items-center justify-start bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py- shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                            onClick={() => setSelectedCrypto(3)}
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
                                            className="py-2 mt-2 inline-flex items-center justify-start bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py- shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                            onClick={() => setSelectedCrypto(4)}
                                        >
                                            <Image
                                                src={Litecoin}
                                                alt="Litecoin"
                                                width={24} // Set the image width
                                                height={24} // Set the image height
                                                className="mr-2"
                                            />
                                            <span>Litecoin</span>
                                        </button>
                                        <button
                                            className="py-2 mt-2 inline-flex items-center justify-start bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py- shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                            onClick={() => setSelectedCrypto(5)}
                                        >
                                            <Image
                                                src={Avax}
                                                alt="Avax"
                                                width={24} // Set the image width
                                                height={24} // Set the image height
                                                className="mr-2"
                                            />
                                            <span>Avax</span>
                                        </button>
                                        <button
                                            className="mt-2 inline-flex items-center justify-start bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py- shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                            onClick={() => setSelectedCrypto(6)}
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
                                            className="mt-2 inline-flex items-center justify-start bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py- shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                            onClick={() => setSelectedCrypto(7)}
                                        >
                                            <Image
                                                src={Polygon}
                                                alt="Matic"
                                                width={24} // Set the image width
                                                height={24} // Set the image height
                                                className="mr-2"
                                            />
                                            <span>Matic</span>
                                        </button>
                                        <button
                                            className="py-2 mt-2 inline-flex items-center justify-start bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py- shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                                            onClick={() => setSelectedCrypto(8)}
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
                                    </div>
                                    {/* <div className='mt-6'>
                                        <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                                            Tokens
                                        </label>
                                        <div className="grid gap-x-2 grid-cols-1 sm:col-span-3 mt-2">
                                            <CryptoCombobox />
                                        </div>
                                    </div> */}

                                    <div className="mt-10 flex justify-end border-t border-gray-200 pt-6">
                                        <button
                                            type="submit"
                                            className="rounded-md border border-transparent bg-indigo-600 w-full py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                                            onClick={handleSubmit}
                                        >
                                            Pay now
                                        </button>
                                    </div>
                                </div>
                            </div>
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
