import { useState } from 'react'
import Image from 'next/image'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import logo_white from "@/public/logo_white.svg"
import { supabase } from '@/lib/supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'


const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
]

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [signedIn, setSignedIn] = useState(false)

    async function handleSignedIn() {
        const user = await supabase.auth.getUser();
        if (user.data.user !== null) {
            setSignedIn(true);
        }
        else {
            setSignedIn(false);
        }
    }

    handleSignedIn();

    return (
        <header className="absolute inset-x-0 top-0 z-50">
            <nav className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        <Image className="h-9 w-fit" src={logo_white} alt="" />
                    </a>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <a key={item.name} href={item.href} className="text-sm font-semibold text-[#EFF7FF] transition duration-200 ease-in-out hover:text-white hover:opacity-100 opacity-80">
                            {item.name}
                        </a>
                    ))}
                </div>
                <div className="flex flex-1 items-center justify-end gap-x-6">
                    {signedIn ? (
                        <a href="/dashboard" className="opacity-80 inline-flex items-center justify-center h-10 px-4 text-sm font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-md hover:opacity-100 focus:ring-2 focus:ring-zinc-700 focus:outline-none disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-70 transition-all duration-200 ease-in-out">
                            Dashboard <ArrowRightIcon className="ml-1 w-5" aria-hidden="true" />
                        </a>
                    ) : (
                        <div className="flex flex-1 items-center justify-end gap-x-6">
                            <a href="/login" className="opacity-80 inline-flex items-center justify-center h-10 px-4 text-sm font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-md hover:opacity-100 focus:ring-2 focus:ring-zinc-700 focus:outline-none disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-70 transition-all duration-200 ease-in-out">
                                Login <ArrowRightIcon className="ml-1 w-5" aria-hidden="true" />
                            </a>

                            <a
                                className="text-sm h-10 pl-4 pr-4 rounded-md gap-1 font-semibold bg-white text-black hover:bg-white/90 focus:ring-2 focus:ring-white/20 focus:outline-none focus:bg-white/90 disabled:hover:bg-white inline-flex items-center border justify-center select-none disabled:cursor-not-allowed disabled:opacity-70 transition ease-in-out duration-200 hidden sm:inline-flex"
                                href="/signup"
                                style={{
                                    boxShadow: 'rgba(53,247,143,0.3) -8px 0px 20px, rgba(235,56,54,0.3) 8px 0px 20px',
                                }}
                            >
                                Sign up
                            </a>
                        </div>
                    )}
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
            </nav>

            <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                <div className="fixed inset-0 z-10" />
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ ease: 'easeInOut', duration: 0.2 }}
                        className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
                    >
                        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                            <div className="flex items-center gap-x-6">
                                <a href="#" className="-m-1.5 p-1.5">
                                    <span className="sr-only">Your Company</span>
                                    <Image
                                        className="h-9 w-fit"
                                        src={logo_white}
                                        alt=""
                                    />
                                </a>
                                <button
                                    type="button"
                                    className="-m-2.5 rounded-md p-2.5 text-gray-700"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="sr-only">Close menu</span>
                                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>
                            <div className="mt-6 flow-root">
                                <div className="-my-6 divide-y divide-gray-500/10">
                                    <div className="space-y-2 py-6">
                                        {navigation.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 opacity-80"
                                            >
                                                {item.name}
                                            </a>
                                        ))}
                                    </div>
                                    <div className="pt-8 grid grid-cols-2 gap-6">
                                        <a
                                            href="/login"
                                            className="bg-slate-100 rounded-xl shadow-sm font-semibold text-sm text-center px-3 py-2.5 leading-6 text-gray-800 hover:bg-gray-50"
                                        >
                                            Login
                                        </a>
                                        <a
                                            href="/signup"
                                            className="relative justify-center flex rounded-xl bg-black text-center py-2.5 text-sm leading-6 font-semibold text-white shadow-sm hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Get Started <ArrowRightIcon className="ml-2 w-4" aria-hidden="true" />

                                        </a>
                                    </div>

                                </div>
                            </div>
                        </Dialog.Panel>
                    </motion.div>
                </AnimatePresence>
            </Dialog>

        </header>
    )
}
