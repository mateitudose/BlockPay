import React, { useState } from "react";
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import iphone from "@/public/iphone.svg"
import { useRouter } from 'next/router'
import toast, { Toaster } from 'react-hot-toast';

import { ArrowUpRight, ChevronRight, MoveUpRight } from 'lucide-react'

const FORMSPARK_ACTION_URL = "https://submit-form.com/Ca5nCOiR";

export default function Landing() {
    const router = useRouter()

    const [message, setMessage] = useState("");

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!message || !validateEmail(message)) {
            toast.error('Please enter a valid email address.');
            return;
        }

        if (validateEmail(message)) {
            await fetch(FORMSPARK_ACTION_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    message,
                }),
            });
            toast.success("Succesfuly joined the waitlist!");
        }
    };

    return (
        <div>
            <Toaster position="top-right"
                reverseOrder={false} />
            <div className="min-h-screen relative isolate overflow-hidden bg-gray-950">
                <svg
                    className="absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
                    aria-hidden="true"
                >
                    <defs>
                        <pattern
                            id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
                            width={200}
                            height={200}
                            x="50%"
                            y={-1}
                            patternUnits="userSpaceOnUse"
                        >
                            <path d="M.5 200V.5H200" fill="none" />
                        </pattern>
                    </defs>
                    <svg x="50%" y={-1} className="overflow-visible fill-gray-800/20">
                        <path
                            d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                            strokeWidth={0}
                        />
                    </svg>
                    <rect width="100%" height="100%" strokeWidth={0} fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)" />
                </svg>
                <div
                    className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
                    aria-hidden="true"
                >
                    <div
                        className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"
                        style={{
                            clipPath:
                                'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
                        }}
                    />
                </div>
                <div className="items-center justify-center mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
                    <div className="mx-auto max-w-6xl flex-shrink-0 lg:mx-0 lg:max-w-6xl lg:pt-8">
                        <h1 className="hidden lg:block text-center mt-4 pb-1 text-7xl font-bold tracking-tight bg-gradient-to-br from-white to-white/50     bg-clip-text text-transparent">
                            The only payment processor you need to
                            <span className="">
                                &nbsp;thrive&nbsp;
                            </span>
                            in the digital age
                        </h1>
                        <h1 className="block lg:hidden text-center mt-24 pb-1 text-4xl font-bold tracking-tight bg-gradient-to-br from-white to-white/50     bg-clip-text text-transparent">
                            The only payment processor you need to thrive in the digital age
                        </h1>
                        <p className="hidden lg:block text-center mt-5 text-lg leading-8 text-gray-300/75">
                            Empower your business with our seamless and secure crypto-payment solutions, designed to adapt, scale, and thrive in today's evolving digital economy.
                        </p>
                        <p className="block lg:hidden text-center mt-5 text-sm leading-6 text-gray-300/75">
                            Empower your business with our seamless and secure crypto-payment solutions, designed to adapt, scale, and thrive in today's evolving digital economy.
                        </p>
                        <div className='mt-12 flex flex-row justify-center items-center'>

                            <div className='inline-flex'>
                                <div className='relative group transform hover:scale-105 transition duration-200'>
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#EB3836] to-[#0062CD] rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                        <a
                                            className="relative px-6 py-3 bg-white rounded-full leading-none flex items-center"
                                            href="/signup"
                                        >
                                            <span className="flex items-center justify-center font-semibold text-base">
                                                Get Started <ArrowUpRight className='ml-1 w-5 h-5 inline-block' />
                                            </span>
                                        </a>
                                    </div>
                                </div>

                                <div className='ml-2'>
                                    <a
                                        className="relative px-5 py-3 text-white hover:bg-white/5 rounded-full leading-none flex items-center"
                                        href="/contact"
                                    >
                                        <span className="flex items-center justify-center font-semibold text-base">
                                            Contact us <ChevronRight className='ml-1 w-4 h-4 inline-block' />
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <h1 class="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
                    Accounting
                    <span class="relative whitespace-nowrap text-red-600">
                        <svg aria-hidden="true" viewBox="0 0 418 42" class="absolute left-0 top-2/3 h-[0.58em] w-full fill-blue-300/70" preserveAspectRatio="none"><path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path></svg>
                        <span class="relative">made simple</span>
                    </span>
                    for small businesses.
                </h1> */}
                    {/* <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
                    <Image
                        src={iphone}
                        alt="App screenshot"
                        className="mx-auto w-[22.875rem] max-w-full drop-shadow-xl"
                    />
                </div> */}
                </div>
            </div>
        </div>
    )
}
