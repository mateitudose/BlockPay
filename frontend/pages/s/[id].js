import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ABI from '@/lib/ABI.json';
import TOKEN_ABI from '@/lib/TOKEN_ABI.json';

import { useRouter } from 'next/router'
import { ConnectButton } from '@rainbow-me/rainbowkit';

import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.HttpProvider("https://rpc.ankr.com/polygon_mumbai"));

import { useContractWrite, useContractRead, useAccount, useNetwork, useSwitchNetwork } from 'wagmi'

import { ChevronLeftIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';

import Ethereum from "@/public/Crypto/Ethereum.svg"
import Tether from "@/public/Crypto/Tether.svg"
import USDC from "@/public/Crypto/Circle_USDC.svg"
import BNB from "@/public/Crypto/BNB.svg"
import BUSD from "@/public/Crypto/BUSD.svg"
import Dai from "@/public/Crypto/Dai.svg"
import Polygon from "@/public/Crypto/Polygon.svg"
import logo from "@/public/logo.svg"

import Image from "next/image"
import toast, { Toaster } from 'react-hot-toast';
import Badge from '@/components/Badge';

const Subscription = ({ subscription, referral, merchantEthAddress }) => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [selectedCrypto, setSelectedCrypto] = useState(0);
    const [showChains, setShowChains] = useState(false);
    const { address, isConnected, isConnecting } = useAccount();
    const { chain } = useNetwork();
    const { switchNetwork } = useSwitchNetwork();
    const [storeName, setStoreName] = useState('');

    let zeroAddress = "0x0000000000000000000000000000000000000000";

    let contractAddress = {
        1: "0x14710BDb76743e217C3F936aE3ecb4673F45369c",
        56: "0x14710BDb76743e217C3F936aE3ecb4673F45369c",
        80001: "0x14710BDb76743e217C3F936aE3ecb4673F45369c",
    };

    let tokenAddress = {
        // ETH
        1: {
            0: zeroAddress,
            1: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
            2: "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
            3: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        },

        // BSC
        56: {
            0: zeroAddress,
            1: "0x55d398326f99059fF775485246999027B3197955",
            2: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
            3: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
        },

        // MATIC (Mumbai Testnet) 
        80001: {
            0: zeroAddress,
            1: "0x2e84cC0cE546A50f0C0B6731f119D37ae2B6c7eE",
            2: "0x2e84cC0cE546A50f0C0B6731f119D37ae2B6c7eE",
            3: "0x2e84cC0cE546A50f0C0B6731f119D37ae2B6c7eE",
        },
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    let referralAddress = referral;
    if (web3.utils.isAddress(referral)) {
        if (!web3.utils.checkAddressChecksum(referral)) {
            referralAddress = web3.utils.toChecksumAddress(referral);
        }
    } else {
        referralAddress = zeroAddress;
    }

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
        if (!isConnected || isConnecting) {
            toast.error('Please connect your wallet.');
            return;
        }

        await handleSubscribeClick();
    }


    const { data: dataSubscribe, isLoading: isLoadingSubscribe, isSuccess: isSuccessSubscribe, write: subscribe } = useContractWrite({
        address: chain != undefined ? contractAddress[chain.id] : zeroAddress,
        abi: ABI,
        functionName: "subscribe",
        args: [subscription.planID, web3.utils.soliditySha3(email), referralAddress],
    });

    const { data: dataApprove, isLoading: isLoadingApprove, isSuccess: isSuccessApprove, writeAsync: approve } = useContractWrite({
        address: chain != undefined ? tokenAddress[chain.id][selectedCrypto] : zeroAddress,
        abi: TOKEN_ABI,
        functionName: "approve",
        args: [chain != undefined ? contractAddress[chain.id] : zeroAddress, web3.utils.toWei((subscription.price_in_usd).toString(), 'ether')],
    });

    const allowance = useContractRead({
        address: chain != undefined ? tokenAddress[chain.id][selectedCrypto] : zeroAddress,
        abi: TOKEN_ABI,
        functionName: 'allowance',
        watch: true,
        args: [address, chain != undefined ? contractAddress[chain.id] : zeroAddress,],
    })

    const handleSubscribeClick = async () => {
        if (isLoadingSubscribe || isLoadingApprove) return;
        if (allowance == undefined) return;
        if (!(allowance.data).gte(web3.utils.toWei((subscription.price_in_usd).toString(), 'ether'))) {
            try {
                const tx = await approve();
                const res = await tx?.wait().then(() => {
                    subscribe();
                });
            } catch (error) {
                console.error(error);
            }
        }
        else {
            subscribe();
        }
    }

    const plans = useContractRead({
        address: chain != undefined ? contractAddress[chain.id] : zeroAddress,
        abi: ABI,
        functionName: 'getManagerPlans',
        watch: true,
        args: [merchantEthAddress],
    });

    // function mapPlans() {
    //     if (plans.data == undefined) return;
    //     for (let i = 0; i < plans.data.length; i++) {
    //         if (plans.data[i][2] == chain != undefined ? tokenAddress[chain.id][selectedCrypto] : zeroAddress)
    //             planID[selectedCrypto] = parseInt(plans.data[i][0]);

    //         // frequency - plans.data[i][5]
    //     }
    // }
    // mapPlans();

    useEffect(() => {
        const set = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('store_name')
                .eq('id', subscription.merchant_id)
                .single();
            if (error) {
                toast.error(error.message);
            }
            else {
                document.title = `Subscription | ${data.store_name}`;
                setStoreName(data.store_name);
            }
        }
        set();
    }, []);

    return (
        <div className="bg-white">
            <title>Subscription | Blockpay</title>

            <Toaster position="top-right"
                reverseOrder={false} />

            <div className="fixed left-0 top-0 hidden h-full w-1/2 bg-gray-50/25 lg:block" aria-hidden="true" />
            <div className="fixed right-0 top-0 hidden h-full w-1/2 bg-white lg:block drop-shadow shadow-lg shadow-grey" aria-hidden="true" />

            <div className="sticky items-end flex flex-col mt-8 mr-6 lg:fixed lg:top-0 lg:right-0 lg:mt-8 lg:mr-16">
                <ConnectButton label='Connect Web3' />
            </div>

            <div className="lg:mt-28 relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 lg:pt-16">
                <h1 className="sr-only">Subscription</h1>
                <section
                    aria-labelledby="summary-heading"
                    className="px-4 pb-12 lg:py-12 text-grey-300 lg:px-10 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0 relative"
                >
                    <div className="lg:shadow-none lg:p-0 lg:pb-0 lg:rounded-none shadow-lg rounded-xl p-3 pb-6 mx-auto max-w-2xl px-6 lg:max-w-none lg:px-0">
                        <h2 id="summary-heading" className="sr-only">
                            Order summary
                        </h2>
                        <dl className='space-y-6 text-sm font-medium'>
                            <div className="flex items-center pb-6">
                                <BuildingStorefrontIcon
                                    className="drop-shadow inline-block h-8 w-8 py-1.5 rounded-full bg-gray-50"
                                    alt="Store logo"
                                />
                                <span className="text-base ml-2">{storeName}</span>
                            </div>

                        </dl>

                        <dl className="pt-6 text-sm font-medium">
                            <p className='opacity-50'>Subscribe to {subscription.store_name}</p>
                            <div className="flex items-start mt-2">
                                <p className="opacity-85 inline-block mr-2 text-4xl">
                                    ${subscription.price_in_usd}
                                </p>
                                <div className="rounded-md w-max">
                                    <p className="opacity-50 text-normal font-semibold mb-0">per</p>
                                    <p className="opacity-50 text-normal font-semibold mt-0">month</p>
                                </div>
                            </div>



                            <a href="http://localhost:3000" target='_blank'>
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
                                <div className={!isConnected || isConnecting ? `mb-8 text-sm` : `hidden`}>
                                    <Badge
                                        color="yellow"
                                        text="You must connect your Web3 wallet in order to subscribe."
                                    />
                                </div>


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
                                            <button
                                                className="drop-shadow shadow-[#53ae94] py-2 mt-2 inline-flex items-center justify-start bg-white text-gray-700 font-semibold text-sm rounded-lg border border-[#53ae94] bg-white px-4 shadow-sm focus:scale-110 transform transition-transform duration-300 hover:scale-105"
                                                onClick={() => {
                                                    setSelectedCrypto(1)
                                                    setShowChains(true)
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
                                                    setSelectedCrypto(2)
                                                    setShowChains(true)
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
                                                    setSelectedCrypto(3)
                                                    setShowChains(true)
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
                                            {/* <button
                                                className="drop-shadow shadow-[#F5AC37] py-2 mt-2 inline-flex items-center justify-start bg-white text-gray-700 font-semibold text-sm rounded-lg border border-[#F5AC37] bg-white px-4 shadow-sm focus:scale-110 transform transition-transform duration-300 hover:scale-105"
                                                onClick={() => {
                                                    setSelectedCrypto(), setShowChains(true)
                                                    document.activeElement.blur();
                                                }}
                                            >
                                                <Image
                                                    src={Dai}
                                                    alt="DAI"
                                                    width={18} 
                                                    height={18} 
                                                    className="mr-2 lg:w-6 lg:h-6"
                                                />
                                                <span>DAI</span>
                                            </button> */}
                                        </div>
                                    ) : (
                                        <div className="grid gap-x-4 grid-cols-2 lg:col-span-2 mt-2">
                                            <button
                                                className="drop-shadow shadow-[#627EEA] py-2 mt-2 inline-flex items-center justify-start bg-white text-gray-700 font-semibold text-sm rounded-lg border border-[#627EEA] bg-white px-4 py- shadow-sm focus:scale-110 transform transition-transform duration-300 hover:scale-105"
                                                onClick={() => {
                                                    if (chain != undefined) {
                                                        if (chain.id != 1) {
                                                            switchNetwork(1);
                                                        }
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
                                                    if (chain != undefined) {
                                                        if (chain.id != 56) {
                                                            switchNetwork(56);
                                                        }
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
                                            <button
                                                className="drop-shadow shadow-[#7b3fe4] py-2 mt-2 inline-flex items-center justify-start bg-white text-gray-700 font-semibold text-sm rounded-lg border border-[#7b3fe4] bg-white px-4 py- shadow-sm focus:scale-110 transform transition-transform duration-300 hover:scale-105"
                                                onClick={() => {
                                                    if (chain != undefined) {
                                                        if (chain.id != 80001) {
                                                            switchNetwork(80001);
                                                        }
                                                        setShowChains(true)
                                                    }
                                                }}
                                            >
                                                <Image
                                                    src={Polygon}
                                                    alt="Mumbai Testnet"
                                                    width={18}
                                                    height={18}
                                                    className="mr-2 lg:w-6 lg:h-6"
                                                />
                                                <span>Mumbai Testnet</span>
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
                                        className="rounded-md border border-transparent bg-indigo-600 shadow-indigo-600/50 shadow-lg w-full py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                                        onClick={(e) => {
                                            handleSubmit(e)
                                        }}
                                        disabled={isLoadingSubscribe || isLoadingApprove}
                                    >
                                        {isLoadingSubscribe || isLoadingApprove ? (
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
                                            'Subscribe now'
                                        )}
                                    </button>
                                    <a href="https://blockpay.app" target='_blank'>
                                        <div className="block lg:hidden opacity-80 mt-24 font-medium">
                                            Powered by
                                            <Image className='w-auto h-6 inline-block pb-0.5 ml-1.5' src={logo} />
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Subscription;

// Fetch data from Supabase database
export async function getServerSideProps({ params, query }) {
    const { id } = params;
    const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', id)
        .single();

    const referral = query.ref || '0x0000000000000000000000000000000000000000';

    if (subscriptionError) {
        console.log(subscriptionError);
        return {
            notFound: true,
        };
    }

    const { data: merchantData, error: merchantError } = await supabase
        .from('profiles')
        .select('eth_address')
        .eq('id', subscriptionData.merchant_id);

    let merchantEthAddress = "0x0000000000000000000000000000000000000000";
    if (merchantData && merchantData[0].eth_address) {
        merchantEthAddress = merchantData[0].eth_address;
    }

    return {
        props: {
            subscription: subscriptionData,
            referral: referral,
            merchantEthAddress: merchantEthAddress,
        },
    };
}

