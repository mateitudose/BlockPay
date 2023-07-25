import Image from 'next/image'
import Google from '@/public/google_logo.svg'
import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import GitHub from '@/public/github_logo.svg'
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import logo from "@/public/favicon.ico"


export default function SignUp() {
    const router = useRouter()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [shouldRender, setShouldRender] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSignedIn() {
        const user = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from('profiles')
            .select("*")
            .eq('id', user.data.user.id)
        if (error)
            console.log(error)
        else if (data.length > 0) {
            if (data[0].store_name !== null && data[0].eth_address !== null && user.data.user !== null) {
                router.push('/dashboard');
            }
            else {
                router.push('/onboarding');
            }
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
        setEmail((e.target.value).toLowerCase());
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const signupGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'https://block-pay-sooty.vercel.app/dashboard'
            }
        })

        if (error) {
            toast.error(error.message);
        }
    };

    const signupGithub = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: 'https://block-pay-sooty.vercel.app/dashboard'
            }
        })

        if (error) {
            toast.error(error.message);
        }
    };

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    const signupEmail = async (e) => {
        e.preventDefault();

        if (password.length < 8) {
            toast.error('Password must be at least 8 characters long.');
            return;
        }

        if (password.length > 32) {
            toast.error('Password must be less than 32 characters long.');
            return;
        }

        if (!email || !validateEmail(email)) {
            toast.error('Please enter a valid email address.');
            return;
        }

        if (!password) {
            toast.error('Please enter a valid password.');
            return;
        }

        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: 'https://block-pay-sooty.vercel.app/dashboard'
            }
        });

        if (error) {
            toast.error(error.message);
            setLoading(false);
        }

        else {
            toast.success('Check your email for the confirmation link!');
            setLoading(false);
        }
    };

    if (!shouldRender) {
        return <div className="bg-[#0a0a0a] z-50 w-screen h-screen"></div>;
    }

    return (
        <>
            <Toaster position="top-right"
                reverseOrder={false} />
            <title>Sign Up | Blockpay</title>
            <div className='flex justify-center items-center h-screen bg-black'>
                <div className="absolute top-0 left-0 m-7">
                    <SecondaryButton
                        href="/"
                        content={
                            <div className="flex items-center hover:underline">
                                <ArrowLeftIcon className="w-4" aria-hidden="true" />
                                <span className="ml-1 font-medium">Home</span>
                            </div>
                        }
                        classNames="h-8 w-fit"
                    />
                </div>
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <Image
                            className="h-14 w-auto"
                            src={logo}
                            alt="Blockpay Logo"
                        />
                    </div>


                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <div className="space-y-6">
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
                                        className="pl-2.5 block w-full rounded-md border-0 bg-zinc-800/80 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6"
                                        placeholder='tony@stark.com'
                                        onChange={(e) => handleEmailChange(e)}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm leading-6 text-slate-300/75">
                                        Password
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="pl-2.5 block w-full rounded-md border-0  bg-zinc-800/80 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6"
                                        placeholder='••••••••'
                                        onChange={(e) => handlePasswordChange(e)}
                                    />
                                </div>
                            </div>

                            <div>
                                <PrimaryButton
                                    content={loading ? (
                                        <>
                                            <svg className="inline-flex items-center justify-center animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                                <circle
                                                    className="opacity-5"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="black"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="black"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>

                                            Signing up...
                                        </>
                                    ) : (
                                        'Sign up'
                                    )}
                                    onClick={(e) => {
                                        signupEmail(e)
                                    }}
                                    disabled={loading}
                                />
                            </div>
                        </div>
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
                            onClick={() => signupGoogle()}
                        >
                            <div className="flex items-center justify-center mr-2.5">
                                <Image
                                    className="h-4 w-4"
                                    src={Google}
                                    alt="Google Logo"
                                />
                            </div>
                            Sign up with Google

                        </button>
                        <button
                            type="button"
                            className="mt-3 flex items-center justify-center rounded-md border border-gray-500/20 bg-zinc-800/80 px-3 py-1.5 text-sm font-semibold leading-6 text-white/90 shadow-sm hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white w-full"
                            onClick={() => signupGithub()}
                        >
                            <div className="flex items-center justify-center mr-2.5">
                                <Image
                                    className="h-4 w-4"
                                    src={GitHub}
                                    alt="GitHub Logo"
                                />
                            </div>
                            Sign up with GitHub

                        </button>

                        <p className="mt-10 text-left text-xs text-gray-400">
                            By signing up, you agree to our <span className='hover:underline text-sky-500'>Terms of Service</span> and <span className="hover:underline text-sky-500">Privacy Policy</span>.
                        </p>
                    </div>
                </div>
            </div >
        </>
    )
}
