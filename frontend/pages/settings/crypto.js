import { useState, Fragment, useEffect } from 'react'
import { Dialog, Transition, Menu } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/20/solid'
import {
    CreditCardIcon,
    CubeIcon,
    UserCircleIcon,
    UsersIcon,
    XMarkIcon,
    CurrencyDollarIcon,
    ChevronDownIcon,
    Cog8ToothIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'
import toast, { Toaster } from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';

import BitcoinIcon from '@/components/BitcoinIcon';
import Ethereum from "@/public/Crypto/Ethereum.svg";
import Solana from "@/public/Crypto/Solana.svg";

import { useRouter } from 'next/router';


import logo from "@/public/logo.svg";
import Image from 'next/image';

import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.HttpProvider("https://rpc.ankr.com/polygon_mumbai"));

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Products', href: '/products' },
    { name: 'Subscriptions', href: '/subscriptions' },
]

const secondaryNavigation = [
    { name: 'General', href: '/settings/general', icon: UserCircleIcon, current: false },
    { name: 'Crypto', href: '/settings/crypto', icon: BitcoinIcon, current: true },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Crypto() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const router = useRouter();
    const [open, setOpen] = useState(false)
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [ethAddress, setEthAddress] = useState('');

    const handleEthAddressChange = (e) => {
        setEthAddress(e.target.value);
    };

    async function handleNotSignedIn() {
        const user = await supabase.auth.getUser();
        if (!user.data.user) {
            router.push('/login');
        }
        return user.data.user;
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        // Redirect to login page or perform other actions after sign out
        router.push('/login');
    };

    useEffect(() => {
        const runPrecheck = async () => {
            const result = await handleNotSignedIn();

            if (result) {
                setShouldRender(true);
            } else {

            }
        };

        runPrecheck();
    }, []);

    useEffect(() => {
        const getUser = async () => {
            try {
                const user = await supabase.auth.getUser();
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.data.user.id);
                if (error) {
                    throw error;
                } else {
                    setEmail(data[0].email);
                    setUsername(data[0].username);
                }

            } catch (error) {
                console.error(error);
            }
        };
        getUser();
    }, []);

    const handleSaveEthAddress = async (e) => {
        e.preventDefault();
        if (web3.utils.isAddress(ethAddress)) {
            if (!web3.utils.checkAddressChecksum(ethAddress)) {
                setEthAddress(web3.utils.toChecksumAddress(ethAddress));
            }
            const user = await supabase.auth.getUser();
            const { data, error } = await supabase
                .from('profiles')
                .update({
                    eth_address: ethAddress,
                })
                .eq('id', user.data.user.id);
            if (error) {
                toast.error(error.message);
            }
            setOpen(false);
            toast.success('Ethereum address saved.');

        } else {
            toast.error('Invalid Ethereum address.');
        }
    };

    if (!shouldRender) {
        return <div className="bg-[#0a0a0a]"></div>;
    }

    return (
        <>
            <Toaster position="top-right"
                reverseOrder={false} />
            <title>Settings - Crypto | Blockpay</title>
            <header className="bg-white absolute inset-x-0 top-0 z-50 flex h-16 border-b border-gray-900/10">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-1 items-center gap-x-6">
                        <button type="button" className="-m-3 p-3 md:hidden" onClick={() => setMobileMenuOpen(true)}>
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon className="h-5 w-5 text-gray-900" aria-hidden="true" />
                        </button>
                        <Image
                            src={logo}
                            alt="Logo"
                            width={8} // Set the image width
                            height={8} // Set the image height
                            className="h-8 w-auto"
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

                        <Menu as="div" className="relative inline-block text-left lg:pr-4">
                            <div>
                                <Menu.Button className="inline-flex w-full justify-center gap-x-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                    <span className="inline-block h-5 w-5 overflow-hidden rounded-full bg-gray-100">
                                        <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </span>
                                    {username}
                                    <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                                </Menu.Button>
                            </div>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="px-4 py-3">
                                        <p className="text-sm">Signed in as</p>
                                        <p className="truncate text-sm font-medium text-gray-900">{email}</p>
                                    </div>
                                    <div className="py-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <a
                                                    href="/settings"
                                                    className={classNames(
                                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                        'inline-flex items-center gap-x-1.5 block px-4 py-2 text-sm'
                                                    )}
                                                >
                                                    <Cog8ToothIcon
                                                        className="-ml-0.5 h-5 w-5"
                                                        aria-hidden="true"
                                                    />Account settings
                                                </a>
                                            )}
                                        </Menu.Item>
                                    </div>
                                    <div className="py-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    type="submit"
                                                    className={classNames(
                                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                        'inline-flex items-center gap-x-1.5 block w-full px-4 py-2 text-left text-sm'
                                                    )}
                                                    onClick={handleSignOut}
                                                >
                                                    <ArrowRightOnRectangleIcon className="-ml-2 h-5 w-5" aria-hidden="true" />
                                                    Sign out
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
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
                                    <Image
                                        src={logo}
                                        alt="Logo"
                                        width={8} // Set the image width
                                        height={8} // Set the image height
                                        className="h-8 w-auto"
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
            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl pt-16 lg:flex lg:gap-x-16 lg:px-8">
                    <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
                        <nav className="flex-none px-4 sm:px-6 lg:px-0 ">
                            <ul role="list" className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
                                {secondaryNavigation.map((item) => (
                                    <li key={item.name}>
                                        <a
                                            href={item.href}
                                            className={classNames(
                                                item.current
                                                    ? 'bg-gray-100'
                                                    : 'text-gray-700 hover:bg-gray-50',
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
                        <div className="bg-white p-4 shadow-lg rounded-lg space-y-12">
                            <div className="pb-12">
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Crypto addresses</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">
                                    Be sure to save your crypto address to receive payments.
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
                                        className="opacity-50 drop-shadow shadow-[#14F195] py-2 mt-2 inline-flex items-center justify-start bg-white text-gray-700 font-semibold text-sm rounded-lg border border-[#14F195] bg-white px-4 shadow-sm focus:scale-110 transform transition-transform duration-300 hover:scale-105"
                                        // onClick={() => setOpen(true)}
                                        disabled
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
                            <Dialog as="div" className="relative z-50" initialFocus onClose={setOpen}>
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
                                                                    className="font-mono pl-2.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
            </div>
        </>
    )
}
