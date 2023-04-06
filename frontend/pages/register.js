import Image from 'next/image'
import Google from '@/public/google_logo.svg'
import Apple from '@/public/apple_logo.svg'
import logo from "@/public/logo.svg"
import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'



export default function Login() {
    const router = useRouter()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const register = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'http://localhost:3000/dashboard'
            }
        })

        if (error) {
            toast.error(error.message);
        }
    };

    const registerEmail = async () => {
        const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: 'http://localhost:3000/dashboard'
            }
        });
        if (error) {
            toast.error(error.message);
        }
    };

    const [showChild, setShowChild] = useState(false);
    const [isPasswordHidden, setPasswordHidden] = useState(true);


    useEffect(() => {
        setShowChild(true);
    }, []);

    if (!showChild) {
        return null;
    }

    if (typeof window === 'undefined') {
        return <></>;
    }
    else {
        return (
            <>
                <Toaster position="top-right"
                    reverseOrder={false} />
                <div className="h-screen bg-gray-50">
                    <div className="flex min-h-full flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
                        <div className="sm:mx-auto sm:w-full sm:max-w-md">
                            <Image
                                className="mx-auto h-12 w-auto"
                                src={logo}
                                alt="Blockpay"
                            />
                        </div>

                        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">

                            <div className="bg-white px-4 py-8 shadow rounded-xl sm:px-10">
                                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Register your account</h2>
                                <p className="mt-2 text-center text-sm text-gray-600">
                                    Or{' '}
                                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                        start your 14-day free trial
                                    </a>
                                </p>
                                <div className="mt-6">
                                    <div className="mt-6 grid grid-rows-2 gap-3">
                                        <div>
                                            <button
                                                href=""
                                                className="inline-flex w-full justify-center rounded-lg bg-white px-4 py-2 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                                                onClick={register}
                                            >
                                                <Image className='mt-1' src={Google} alt="google" width={15} height={20} />
                                                <span className="ml-2 text-gray-500">Register with Google</span>

                                            </button>
                                        </div>
                                        <div>
                                            <button
                                                href=""
                                                className="inline-flex w-full justify-center rounded-lg bg-white px-4 py-2 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                                            >
                                                <Image className='mt-0.5' src={Apple} alt="apple" width={14} height={20} />
                                                <span className="ml-2 text-gray-500">Register with Apple</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="relative my-6">
                                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                            <div className="w-full border-t border-gray-200" />
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="bg-white px-3 text-gray-400">or</span>
                                        </div>
                                    </div>
                                </div>
                                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                            Email
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                className="block w-full rounded-md border-0 pl-3.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                placeholder="you@example.com"
                                                required
                                                value={email}
                                                onChange={handleEmailChange}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div>
                                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                                Password
                                            </label>
                                            <div className="relative mt-2">
                                                <button type="button" className="text-gray-400 absolute right-3 inset-y-0 my-auto active:text-gray-600"
                                                    onClick={() => setPasswordHidden(!isPasswordHidden)}
                                                >
                                                    {
                                                        isPasswordHidden ? (
                                                            <EyeIcon className='w-6 h-6' />
                                                        ) : (
                                                            <EyeSlashIcon className='w-6 h-6' />
                                                        )
                                                    }
                                                </button>
                                                <input
                                                    type={isPasswordHidden ? "password" : "text"}
                                                    placeholder="Enter your password"
                                                    className="block w-full rounded-md border-0 pl-3.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                    required
                                                    id='password'
                                                    name='password'
                                                    autoComplete='current-password'
                                                    value={password}
                                                    onChange={handlePasswordChange}
                                                />
                                            </div>
                                        </div >
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                id="remember-me"
                                                name="remember-me"
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            />
                                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                                Remember me
                                            </label>
                                        </div>

                                        <div className="text-sm">
                                            <a href="/password/reset" className="font-medium text-black hover:text-neutral-800">
                                                Forgot your password?
                                            </a>
                                        </div>
                                    </div>

                                    <div>
                                        <button
                                            type="button"
                                            className="flex w-full justify-center rounded-lg bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            onClick={registerEmail}
                                        >
                                            Register
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div >
                </div >
            </>
        )
    }
}
