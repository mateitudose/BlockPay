import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/router'
import Badge from '@/components/LightBadge';
import Countdown from '@/components/Countdown';
import UTC from '@/components/UTC';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import logo from "@/public/logo_dark.svg"

import {
    CheckCircleIcon,
    Square2StackIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

import Image from "next/image"
import toast, { Toaster } from 'react-hot-toast';

import cryptos from '@/components/cryptos.js';

const Invoice = ({ invoice }) => {
    let crypto = cryptos.find(crypto => crypto.id === invoice.crypto_option);
    const router = useRouter();
    const [address, setAddress] = useState(invoice.address);
    const [status, setStatus] = useState(invoice.status);
    const [shouldRender, setShouldRender] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds

    useEffect(() => {
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

        // Clean up on unmount
        return () => {
            channel.unsubscribe()
        }
    }, [invoice.id]);


    const [isCopied, setIsCopied] = useState(false);
    const [isCopied2, setIsCopied2] = useState(false);


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

    useEffect(() => {
        if (isCopied2) {
            const timer = setTimeout(() => {
                setIsCopied2(false);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [isCopied2]);

    const handleCopyClick2 = (textToCopy) => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(textToCopy).then(() => {
                setIsCopied2(true);
            });
        }
    };

    useEffect(() => {
        const runPrecheck = async () => {
            const { data: result } = await supabase
                .from('invoices')
                .select('*')
                .eq('id', invoice.id)
            if (result[0].status === 'Cancelled') {
                setShouldRender(true);
                setIsLoading(false);
            }
            else {
                setIsLoading(false);
            }
        };

        const updateStatus = async () => {
            console.log(timeLeft, status, invoice.id, invoice.status);
            if (timeLeft <= 0 && status === 'Awaiting payment') {
                const { data, error } = await supabase
                    .from('invoices')
                    .update({
                        status: 'Cancelled'
                    })
                    .eq('id', invoice.id)
                if (error) {
                    console.error(error);
                }
                else if (data) {
                    setStatus('Cancelled');
                    setShouldRender(true);
                }
            }
        }

        updateStatus();
        runPrecheck();
    }, []);

    useEffect(() => {
        const targetTime = new Date(invoice.created_at).getTime() + 30 * 60 * 1000;
        const updateTimeLeft = () => {
            const currentTime = new Date().getTime();
            const diff = targetTime - currentTime;
            setTimeLeft(Math.floor(diff / 1000));
        };

        updateTimeLeft();
        const interval = setInterval(updateTimeLeft, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [invoice.created_at]);



    if (isLoading) {
        return (
            <div />
        );
    }

    if (shouldRender) {
        return (
            <div className="bg-white">
                <title>Invoice</title>
                <Toaster position="top-right"
                    reverseOrder={false} />
                {/* Background color split screen for large screens */}
                <div className="fixed left-0 top-0 hidden h-full w-1/2 bg-gray-50/10 lg:block" aria-hidden="true" />
                <div className="fixed right-0 top-0 hidden h-full w-1/2 bg-white lg:block shadow-md shadow-grey" aria-hidden="true" />

                <div className="lg:mt-28 relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 lg:pt-16">
                    <h1 className="sr-only">invoice</h1>

                    <section
                        aria-labelledby="summary-heading"
                        className="px-4 pb-12 lg:py-12 text-grey-300 lg:px-10 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0 relative"
                    >
                        <div className="lg:shadow-none lg:p-0 lg:pb-0 lg:rounded-none shadow-lg rounded-xl p-3 pb-6 mx-auto max-w-2xl px-6 lg:max-w-none lg:px-0">
                            <h2 id="summary-heading" className="sr-only">
                                Order summary
                            </h2>

                            <dl className='py-6 space-y-6 text-sm font-medium'>
                                <span className='text-base'>Order details</span>
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

                                <a href="https://onblockpay.com" target='_blank'>
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
                        className="flex justify-center "
                    >
                        <div className="flex flex-col items-center justify-center">
                            <div className="mx-auto flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-32 sm:w-32">
                                <ExclamationTriangleIcon className="h-16 w-16 text-red-600" aria-hidden="true" />
                            </div>
                            <h1 className='text-lg font-medium pt-6'>
                                Invoice cancelled
                            </h1>
                            <span className='text-sm text-black/50 text-center w-5/6 pt-4'>
                                This invoice has been cancelled. This may be due to an unexpected change in payment processing or the expiration of the allocated time. Please review your transaction history and contact us if you require further assistance.
                            </span>
                        </div>
                    </section>
                </div>
            </div>
        );
    }

    else {
        return (
            <div className="bg-white">
                <title>Invoice</title>
                <Toaster position="top-right"
                    reverseOrder={false} />
                {/* Background color split screen for large screens */}
                <div className="fixed left-0 top-0 hidden h-full w-1/2 bg-gray-50/10 lg:block" aria-hidden="true" />
                <div className="fixed right-0 top-0 hidden h-full w-1/2 bg-white lg:block shadow-md shadow-grey" aria-hidden="true" />

                <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 lg:pt-16">
                    <h1 className="sr-only">invoice</h1>

                    <section
                        aria-labelledby="summary-heading"
                        className="px-4 pb-12 lg:py-12 text-grey-300 lg:px-10 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0 relative"
                    >
                        <div className="lg:shadow-none lg:p-0 lg:pb-0 lg:rounded-none shadow-lg rounded-xl p-3 pb-6 mx-auto max-w-2xl px-6 lg:max-w-none lg:px-0">
                            <h2 id="summary-heading" className="sr-only">
                                Order summary
                            </h2>

                            <dl className='py-6 space-y-6 text-sm font-medium'>
                                <span className='text-base'>Order details</span>
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
                                <a href="https://onblockpay.com" target='_blank'>
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
                                    <h2 id="summary-heading" className="sr-only">
                                        Order summary
                                    </h2>

                                    <dl className='py-6 space-y-6 text-sm font-medium'>
                                        <div className="flex items-center justify-between">
                                            <dt className="font-medium text-base">Status</dt>
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
                                            <dd><Countdown timeLeft={timeLeft} /></dd>
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
                                                {parseFloat(parseFloat(invoice.value_to_receive).toFixed(12))} {crypto.symbol}
                                            </dd>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <dt className='opacity-50'>Invoice Created</dt>
                                            <dd><UTC timestamp={invoice.created_at} /></dd>
                                        </div>
                                        <div className="flex flex-col items-center justify-center border-t border-gray border-opacity-20 pt-6 text-black text-md text-center">
                                            <div className="mb-4">
                                                <Badge color="red" text={`Sending the funds through a different chain other than the ${crypto.chain} will result in your funds being permanently lost.`} />
                                            </div>

                                            <div className="flex items-center align-center justify-center">
                                                <button onClick={() => handleCopyClick(parseFloat(parseFloat(invoice.value_to_receive).toFixed(8)))}>
                                                    <Badge
                                                        color="gray"
                                                        text={`Send ${parseFloat(parseFloat(invoice.value_to_receive).toFixed(8))} ${crypto.symbol}`}
                                                        icon={!isCopied ? (<Square2StackIcon className="h-5 w-5" aria-hidden="true" />) : (<CheckCircleIcon className="h-5 w-5" aria-hidden="true" />)}
                                                    />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center justify-center py-2 text-black text-opacity-50 text-xs font-normal">
                                            <span className='mb-4 text-center'>
                                                Scan the QR code or copy and paste the payment details into your wallet of choice.
                                            </span>
                                        </div>


                                        <div className="flex items-center justify-center text-black text-md text-center">

                                            <button className='flex items-center align-center justify-center text-center' onClick={() => handleCopyClick2(address)}>
                                                <Badge
                                                    color="gray"
                                                    text={address}
                                                    icon={!isCopied2 ? (<Square2StackIcon className="h-5 w-5" aria-hidden="true" />) : (<CheckCircleIcon className="h-5 w-5" aria-hidden="true" />)}
                                                />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <QRCodeGenerator className="flex items-center align-center justify-center" value={address} />
                                            <Image src={crypto.icon} alt={crypto.name} width={62} height={62} className="absolute mr-2" />
                                        </div>
                                        <a href="https://onblockpay.com" target='_blank'>
                                            <div className="text-center mb-6 block lg:hidden opacity-80 mt-36 font-medium">
                                                Powered by
                                                <Image className='w-auto h-6 inline-block pb-0.5 ml-1.5' src={logo} />
                                            </div>
                                        </a>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        );
    }
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
