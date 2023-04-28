import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
const fetch = require('node-fetch');
import { useRouter } from 'next/router'
import Badge from '@/components/Badge';
import Countdown from '@/components/Countdown';
import UTC from '@/components/UTC';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import logo from "@/public/logo.svg"

import { Square2StackIcon } from '@heroicons/react/24/outline';

import Image from "next/image"
import toast, { Toaster } from 'react-hot-toast';

import cryptos from '@/components/cryptos.js';

// rainbow kit
// import { ConnectButton } from '@rainbow-me/rainbowkit';

// Page component
const Invoice = ({ invoice }) => {
    let crypto = cryptos.find(crypto => crypto.id === invoice.crypto_option);

    const [address, setAddress] = useState(invoice.address);
    const [status, setStatus] = useState(invoice.status);
    const channel = supabase
        .channel('table-db-changes')
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'invoices',
            },
            (payload) => {
                if (payload.new.id === invoice.id) {
                    setAddress(payload.new.address);
                    setStatus(payload.new.status);
                }
            }
        )
        .subscribe()


    const [isCopied, setIsCopied] = useState(false);
    useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => {
                setIsCopied(false);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [isCopied]);
    const handleCopyClick = (textToCopy) => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(textToCopy).then(() => {
                setIsCopied(true);
            });
        }
    };
    return (
        <div className="bg-white">
            <title>Invoice</title>
            <Toaster position="top-right"
                reverseOrder={false} />
            {/* Background color split screen for large screens */}
            <div className="fixed left-0 top-0 hidden h-full w-1/2 bg-gray-50/10 lg:block" aria-hidden="true" />
            <div className="fixed right-0 top-0 hidden h-full w-1/2 bg-white lg:block shadow-md shadow-grey" aria-hidden="true" />

            <div className="mt-28 relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 lg:pt-16">
                <h1 className="sr-only">invoice</h1>

                <section
                    aria-labelledby="summary-heading"
                    className="bg-gray-50/10 py-12 text-grey-300 md:px-10 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0"
                >
                    <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
                        <h2 id="summary-heading" className="sr-only">
                            Order summary
                        </h2>

                        <dl className='py-6 space-y-6 text-sm font-medium'>
                            <div className="flex items-center justify-between">
                                <dt className="font-medium"><span className='text-black/50 mr-3'>1x</span>{invoice.product_name}</dt>
                                <dd>${invoice.price_in_usd}</dd>
                            </div>
                        </dl>

                        <dl className="space-y-6 border-t border-gray border-opacity-20 pt-6 text-sm font-medium">
                            <div className="flex items-center justify-between">
                                <dt className='opacity-50'>Subtotal</dt>
                                <dd>${invoice.price_in_usd}</dd>
                            </div>

                            <div className="flex items-center justify-between">
                                <dt className='opacity-50'>Tax</dt>
                                <dd>$0</dd>
                            </div>

                            <div className="flex items-center justify-between border-t border-gray border-opacity-20 pt-6 text-black text-sm">
                                <dt className="">Total</dt>
                                <dd className="">${invoice.price_in_usd}</dd>
                            </div>
                            <a href="https://blockpay.com" target='_blank'>
                                <div className="hidden lg:block absolute bottom-0 left-0 opacity-80 grayscale hover:grayscale-0">
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

                    <div className="ml-4">
                        <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
                            <div>
                                <h2 id="summary-heading" className="sr-only">
                                    Order summary
                                </h2>

                                <dl className='py-6 space-y-6 text-sm font-medium'>
                                    <div className="flex items-center justify-between">
                                        <dt className="font-medium">Status</dt>
                                        <dd><Badge color={status === 'Confirmed' ? 'green' : 'yellow'} text={status} /></dd>
                                    </div>
                                </dl>

                                <dl className="space-y-6 border-t border-gray border-opacity-20 pt-6 text-sm font-medium">
                                    <div className="flex items-center justify-between">
                                        <dt className='flex items-center'>
                                            <Image
                                                src={crypto.icon}
                                                alt={crypto.name}
                                                width={32}
                                                height={32}
                                                className={`inline-block rounded-md mr-2 ${crypto.background_color}`}
                                            />
                                            <div className='flex flex-col'>
                                                <span className='text-black'>{crypto.name}</span>
                                                <span className='text-black/50 text-xs'>{invoice.id}</span>
                                            </div>
                                        </dt>
                                        <dd><Countdown unixTimestamp={invoice.created_at} /></dd>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <dt className='opacity-50'>Total Price</dt>
                                        <dd>${invoice.price_in_usd}</dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt className='opacity-50'>Exchange Rate</dt>
                                        <dd>1 {crypto.symbol} = ${invoice.exchange_rate}</dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt className='opacity-50'>Amount</dt>
                                        <dd>
                                            {parseFloat(invoice.value_to_receive).toFixed(12)} {crypto.symbol}
                                        </dd>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <dt className='opacity-50'>Invoice Created</dt>
                                        <dd><UTC timestamp={invoice.created_at} /></dd>
                                    </div>
                                    <div className="flex items-center justify-center border-t border-gray border-opacity-20 pt-6 text-black text-md text-center">
                                        <button className='flex items-center align-center justify-center' onClick={() => handleCopyClick(parseFloat(invoice.value_to_receive).toFixed(12))}>
                                            <Badge
                                                color="gray"
                                                text={isCopied ? 'Copied!' : `Send ${parseFloat(invoice.value_to_receive).toFixed(8)} ${crypto.symbol}`}
                                                icon={<Square2StackIcon className="h-5 w-5" aria-hidden="true" />}
                                            />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-center text-black text-md text-center">

                                        <button className='flex items-center align-center justify-center text-center' onClick={() => handleCopyClick(address)}>
                                            <Badge
                                                color="gray"
                                                text={isCopied ? 'Copied!' : `Send to ${address}`}
                                                icon={<Square2StackIcon className="h-5 w-5" aria-hidden="true" />}
                                            />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <QRCodeGenerator className="flex items-center align-center justify-center" value={`${crypto.qr}:${address}?value=${parseFloat(invoice.value_to_receive) * 10 ** 18}`} />
                                        <Image src={crypto.icon} alt={crypto.name} width={62} height={62} className="absolute mr-2" />
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>

    );
};

export default Invoice;

// Fetch data from Supabase database
export async function getServerSideProps({ params }) {
    const { id } = params;
    const { data, error } = await supabase
        .from('invoices')
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
            invoice: data,
        },
    };
}
