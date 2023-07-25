import { useState } from 'react'
import Image from 'next/image'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import logo from "@/public/logo.svg"
import { supabase } from '@/lib/supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import Tooltip from '@/components/Tooltip';
import SecondaryButton from '@/components/SecondaryButton'
import ColoredButton from './ColoredButton'

import { ArrowUpRight } from 'lucide-react'


const navigation = [
    { name: 'Home', href: '/home' },
    { name: 'Why Blockpay?', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
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
                        <Image className="h-9 w-fit" src={logo} alt="" />
                    </a>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <a key={item.name} href={item.href} className="text-sm font-semibold text-[#EFF7FF] transition duration-200 ease-in-out hover:text-white hover:opacity-100 opacity-80">
                            {item.name}
                        </a>
                    ))}
                </div>
                <div className="flex flex-1 items-center justify-end gap-x-4">
                    <a className="hidden lg:block hover:bg-white/5 text-zinc-300 px-5 py-3 items-center rounded-full text-sm font-semibold " href="/login" >
                        Sign in
                    </a>
                    <div className='relative group transform hover:scale-105 transition duration-200'>
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#EB3836] to-[#0062CD] rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                            <a
                                className="relative px-3 py-2 lg:px-5 lg:py-3  bg-white rounded-full leading-none flex items-center"
                                href="/signup"
                            >
                                <span className="flex items-center justify-center font-semibold text-sm">
                                    Get Started <ArrowUpRight className='ml-1 w-5 h-5 inline-block' />
                                </span>
                            </a>
                        </div>
                    </div>
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
                                <a href="/" className="-m-1.5 p-1.5">
                                    <span className="sr-only">Blockpay</span>
                                    <Image
                                        className="h-9 w-fit"
                                        src={logo}
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
