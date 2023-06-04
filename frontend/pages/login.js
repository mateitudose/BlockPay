import Image from 'next/image'
import Google from '@/public/google_logo.svg'
import GitHub from '@/public/github_logo.svg'

import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient'
import {
    ArrowLeftIcon
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import logo_white from "@/public/favicon.ico"



export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [shouldRender, setShouldRender] = useState(false);

    async function handleSignedIn() {
        const user = await supabase.auth.getUser();
        if (user.data.user !== null) {
            router.push('/dashboard');
        }
        return user.data.user;
    }

    useEffect(() => {
        const runPrecheck = async () => {
            const result = await handleSignedIn();

            if (!result) {
                setShouldRender(true);
            } else {

            }
        };

        runPrecheck();
    }, []);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const loginGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'http://localhost:3000/dashboard'
            }
        })

        if (error) {
            toast.error(error.message);
        }
    };

    const loginGithub = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: 'http://localhost:3000/dashboard'
            }
        })

        if (error) {
            toast.error(error.message);
        }
    };

    const loginEmail = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        }).then(() => {
            router.push('/dashboard');
        })

        if (error) {
            toast.error(error.message);
        }
    };

    if (!shouldRender) {
        return <div></div>;
    }

    return (
        <>
            <Toaster position="top-right"
                reverseOrder={false} />
            <div className='flex justify-center items-center h-screen bg-black'>
                <a href="/" className="absolute m-7 top-0 left-0 opacity-80 inline-flex items-center justify-center h-8 px-3 text-sm font-medium bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-md hover:opacity-100 focus:ring-2 focus:ring-zinc-700 focus:outline-none disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-70 transition-all duration-200 ease-in-out">
                    <ArrowLeftIcon className="mr-1 w-4" aria-hidden="true" /> Home
                </a>
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <Image
                            className="h-14 w-auto"
                            src={logo_white}
                            alt="Blockpay Logo"
                        />
                    </div>


                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form className="space-y-6" action="#" method="POST">
                            <div>
                                <label htmlFor="email" className="block text-sm leading-6 text-slate-300/75">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="pl-2.5 block w-full rounded-md border-0 bg-zinc-800/80 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                        placeholder='tony@stark.com'
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm leading-6 text-slate-300/75">
                                        Password
                                    </label>
                                    <div className="text-sm">
                                        <a href="" className="font-normal text-white/60 hover:text-white/80 hover:underline">
                                            Forgot password?
                                        </a>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="pl-2.5 block w-full rounded-md border-0  bg-zinc-800/80 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                        placeholder='••••••••'
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center border border-red/50 rounded-md bg-white px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                >
                                    Sign in
                                </button>
                            </div>
                        </form>
                        <div class="mt-6 mb-6 flex items-center justify-center">
                            <div class="h-px w-full bg-gray-500/50" />
                            <span class="mx-4 text-xs text-gray-500 font-normal">
                                OR
                            </span>
                            <div class="h-px w-full bg-gray-500/50" />
                        </div>
                        <button
                            type="button"
                            className="flex items-center justify-center rounded-md border border-gray-500/20 bg-zinc-800/80 px-3 py-1.5 text-sm font-semibold leading-6 text-white/90 shadow-sm hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white w-full"
                            onClick={() => loginGoogle()}
                        >
                            <div className="flex items-center justify-center mr-2.5">
                                <Image
                                    className="h-4 w-4"
                                    src={Google}
                                    alt="Google Logo"
                                />
                            </div>
                            Sign in with Google

                        </button>
                        <button
                            type="button"
                            className="mt-3 flex items-center justify-center rounded-md border border-gray-500/20 bg-zinc-800/80 px-3 py-1.5 text-sm font-semibold leading-6 text-white/90 shadow-sm hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white w-full"
                            onClick={() => loginGithub()}
                        >
                            <div className="flex items-center justify-center mr-2.5">
                                <Image
                                    className="h-4 w-4"
                                    src={GitHub}
                                    alt="GitHub Logo"
                                />
                            </div>
                            Sign in with GitHub

                        </button>

                        <p className="mt-10 text-left text-xs text-gray-400">
                            By signing in, you agree to our <span className='hover:underline text-sky-500'>Terms of Service</span> and <span className="hover:underline text-sky-500">Privacy Policy</span>.
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
