import { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/20/solid'
import {
    BellIcon,
    CreditCardIcon,
    CubeIcon,
    UserCircleIcon,
    UsersIcon,
    XMarkIcon,
    CheckIcon,
    CurrencyDollarIcon,
} from '@heroicons/react/24/outline'
import toast, { Toaster } from 'react-hot-toast';

import BitcoinIcon from '@/components/BitcoinIcon'
import Ethereum from "@/public/Crypto/Ethereum.svg"
import Solana from "@/public/Crypto/Solana.svg"

import logo from "@/public/logo.svg"
import Image from 'next/image'

import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.HttpProvider("https://rpc.ankr.com/polygon_mumbai"));


const navigation = [
    { name: 'Home', href: '#' },
    { name: 'Invoices', href: '#' },
    { name: 'Clients', href: '#' },
    { name: 'Expenses', href: '#' },
]
const secondaryNavigation = [
    { name: 'General', href: '/settings/general', icon: UserCircleIcon, current: false },
    { name: 'Crypto', href: '/settings/crypto', icon: BitcoinIcon, current: true },
    { name: 'Notifications', href: '#', icon: BellIcon, current: false },
    { name: 'Plan', href: '#', icon: CubeIcon, current: false },
    { name: 'Billing', href: '#', icon: CreditCardIcon, current: false },
    { name: 'Team members', href: '#', icon: UsersIcon, current: false },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Example() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isPasswordHidden, setPasswordHidden] = useState(true);
    const [open, setOpen] = useState(false)
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ethAddress, setEthAddress] = useState('');

    const handleEthAddressChange = (e) => {
        setEthAddress(e.target.value);
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSaveEthAddress = async (e) => {
        e.preventDefault();
        if (web3.utils.isAddress(ethAddress)) {
            if (!web3.utils.checkAddressChecksum(ethAddress)) {
                setEthAddress(web3.utils.toChecksumAddress(ethAddress));
            }
        } else {
            toast.error('Invalid Ethereum address.');
        }
    }

    if (web3.utils.isAddress(ethAddress)) {
        if (!web3.utils.checkAddressChecksum(ethAddress)) {
            setEthAddress(web3.utils.toChecksumAddress(ethAddress));
            setOpen(false);
            toast.success('Ethereum address saved.');
        }
    } else {
        toast.error('Invalid Ethereum address.');
    }

    const handleSave = async (e) => {
        e.preventDefault();
        const user = await supabase.auth.getUser();
        if (username !== '') {
            const { data, error } = await supabase
                .from('profiles')
                .update({
                    username: username,
                })
                .eq({ 'id': user.data.user.id });
            if (error) {
                toast.error(error.message);
            }
        } else if (email !== '') {
            const { data, error } = await supabase
                .from('profiles')
                .update({
                    email: email,
                })
                .eq({ 'id': user.data.user.id });
            if (error) {
                toast.error(error.message);
            }
        } else if (password !== '') {
            const { data, error } = await supabase
                .from('profiles')
                .update({
                    password: password,
                })
                .eq({ 'id': user.data.user.id });
            if (error) {
                toast.error(error.message);
            }
        }

    };

    return (
        <>
            <Toaster position="top-right"
                reverseOrder={false} />
            <title>Settings | Crypto</title>
            <header className="absolute inset-x-0 top-0 z-50 flex h-16 border-b border-gray-900/10">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-1 items-center gap-x-6">
                        <button type="button" className="-m-3 p-3 md:hidden" onClick={() => setMobileMenuOpen(true)}>
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon className="h-5 w-5 text-gray-900" aria-hidden="true" />
                        </button>
                        <img
                            className="h-8 w-auto"
                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                            alt="Your Company"
                        />
                    </div>
                    <nav className="hidden md:flex md:gap-x-11 md:text-sm md:font-semibold md:leading-6 md:text-gray-700">
                        {navigation.map((item, itemIdx) => (
                            <a key={itemIdx} href={item.href}>
                                {item.name}
                            </a>
                        ))}
                    </nav>
                    <div className="flex flex-1 items-center justify-end gap-x-8">
                        <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                            <span className="sr-only">View notifications</span>
                            <BellIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your profile</span>
                            <img
                                className="h-8 w-8 rounded-full bg-gray-800"
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                alt=""
                            />
                        </a>
                    </div>
                </div>
                <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                    <div className="fixed inset-0 z-50" />
                    <Dialog.Panel className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white px-4 pb-6 sm:max-w-sm sm:px-6 sm:ring-1 sm:ring-gray-900/10">
                        <div className="-ml-0.5 flex h-16 items-center gap-x-6">
                            <button type="button" className="-m-2.5 p-2.5 text-gray-700" onClick={() => setMobileMenuOpen(false)}>
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                            <div className="-ml-0.5">
                                <a href="#" className="-m-1.5 block p-1.5">
                                    <span className="sr-only">Your Company</span>
                                    <img
                                        className="h-8 w-auto"
                                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                                        alt=""
                                    />
                                </a>
                            </div>
                        </div>
                        <div className="mt-2 space-y-2">
                            {navigation.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>
                    </Dialog.Panel>
                </Dialog>
            </header>

            <div className="mx-auto max-w-7xl pt-16 lg:flex lg:gap-x-16 lg:px-8">
                <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
                    <nav className="flex-none px-4 sm:px-6 lg:px-0">
                        <ul role="list" className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
                            {secondaryNavigation.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        className={classNames(
                                            item.current
                                                ? 'bg-gray-50 text-indigo-600'
                                                : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                                            'group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold'
                                        )}
                                    >
                                        <item.icon
                                            className={classNames(
                                                item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                                                'h-6 w-6 shrink-0'
                                            )}
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>

                <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
                    <div className="space-y-12">
                        <div className="pb-12">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                This information will be displayed publicly so be careful what you share.
                            </p>
                            <div className="grid gap-x-3 grid-cols-3 lg:col-span-3 mt-2">
                                <button
                                    className="drop-shadow shadow-[#627EEA] mt-2 inline-flex items-center justify-start bg-white text-gray-700 font-semibold text-sm rounded-lg border border-[#627EEA] bg-white px-4 shadow-sm transform transition-transform duration-300 hover:scale-105"
                                    onClick={() => setOpen(true)}
                                >
                                    <Image
                                        src={Ethereum}
                                        alt="Ethereum"
                                        width={18} // Set the image width
                                        height={18} // Set the image height
                                        className="mr-2 lg:w-6 lg:h-6"
                                    />
                                    <span className='block lg:hidden'>ETH</span>
                                    <span className='hidden lg:block'>Ethereum</span>
                                </button>
                                <button
                                    className="drop-shadow shadow-[#14F195] py-2 mt-2 inline-flex items-center justify-start bg-white text-gray-700 font-semibold text-sm rounded-lg border border-[#14F195] bg-white px-4 shadow-sm focus:scale-110 transform transition-transform duration-300 hover:scale-105"
                                    onClick={() => setOpen(true)}
                                >
                                    <Image
                                        src={Solana}
                                        alt="Solana"
                                        width={18} // Set the image width
                                        height={18} // Set the image height
                                        className="mr-2 lg:w-6 lg:h-6"
                                    />

                                    <span className='block lg:hidden'>SOL</span>
                                    <span className='hidden lg:block'>Solana</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <Transition.Root show={open} as={Fragment}>
                        <Dialog as="div" className="relative z-10" initialFocus onClose={setOpen}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                            </Transition.Child>

                            <div className="fixed inset-0 z-10 overflow-y-auto">
                                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    >
                                        <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                            <div>
                                                <div className="sm:flex sm:items-start">
                                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                                                        <CurrencyDollarIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                                    </div>
                                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                            Ethereum Address
                                                        </Dialog.Title>
                                                        <div className="mt-2">
                                                            <p className="text-sm text-gray-500">
                                                                Enter your Ethereum address to receive payments.
                                                            </p>
                                                            <a href='https://ethereum.org/en/guides/how-to-register-an-ethereum-account/' target="_blank" className="mt-0.5 mb-1 underline text-sm text-gray-500 flex justify-end">
                                                                Don't have one?
                                                            </a>
                                                        </div>
                                                        <div className="pt-4">
                                                            <input
                                                                type="address"
                                                                name="address"
                                                                id="address"
                                                                className="pl-2.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                placeholder="0x000...0000"
                                                                value={ethAddress}
                                                                onChange={handleEthAddressChange}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-5 sm:flex sm:justify-center">
                                                    <button
                                                        type="button"
                                                        className="inline-flex justify-center items-center w-full rounded-md bg-green-500 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-400 sm:w-auto"
                                                        onClick={(e) => {
                                                            handleSaveEthAddress(e)
                                                        }}
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition.Root>
                </main>
            </div>
        </>
    )
}
