import Image from 'next/image'
import Google from '@/public/google_logo.svg'
import Apple from '@/public/apple_logo.svg'
import logo from "@/public/logo.svg"

export default function Login() {
    return (
        <>
            <div class="h-screen bg-gray-50">
                <div className="flex min-h-full flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <Image
                            className="mx-auto h-12 w-auto"
                            src={logo}
                            alt="Blockpay"
                        />
                    </div>

                    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">

                        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
                            <p className="mt-2 text-center text-sm text-gray-600">
                                Or{' '}
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    start your 14-day free trial
                                </a>
                            </p>
                            <div className="mt-6">
                                <div className="mt-6 grid grid-rows-2 gap-3">
                                    <div>
                                        <a
                                            href="#"
                                            className="inline-flex w-full justify-center rounded-lg bg-white px-4 py-2 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                                        >
                                            <Image src={Google} alt="google" width={15} height={20} />
                                            <span className="ml-3 text-gray-500">Sign in with Google</span>

                                        </a>
                                    </div>

                                    <div>
                                        <a
                                            href="#"
                                            className="inline-flex w-full justify-center rounded-lg bg-white px-4 py-2 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                                        >
                                            <Image src={Apple} alt="apple" width={15} height={20} />
                                            <span className="ml-3 text-gray-500">Sign in with Apple</span>
                                        </a>
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
                            <form className="space-y-6" action="#" method="POST">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                        Email address
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            className="block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                        Password
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            className="block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
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
                                        <a href="#" className="font-medium text-black hover:text-neutral-800">
                                            Forgot your password?
                                        </a>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="flex w-full justify-center rounded-lg bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Sign in
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
