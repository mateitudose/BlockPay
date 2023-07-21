import { Fragment, useState, useEffect } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
    Bars3Icon,
    Cog8ToothIcon,
    XMarkIcon,
    WindowIcon,
    BuildingStorefrontIcon,
    BanknotesIcon,
    Square3Stack3DIcon,
    CurrencyDollarIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'
import {
    ChevronRightIcon,
    ChevronDownIcon,
} from '@heroicons/react/20/solid'
import { ArrowUpRight, LogOut, MoreHorizontal, Settings2, UserCircle, ListChecks, CheckCircle2, Check } from 'lucide-react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient'
import logo from "@/public/logo.svg"
import Image from 'next/image'
import Badge from '@/components/Badge';
import toast, { Toaster } from 'react-hot-toast';

import cryptos from '@/components/cryptos.js';
import SecondaryButton from '@/components/SecondaryButton';
import Chart from '@/components/Chart';
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid'

import { Wallet } from 'ethers';
import web3 from 'web3';

const navigation = [
    { name: "Quickstart", href: "/quickstart", icon: ListChecks, current: true, shortcut: "Q" },
    { name: 'Dashboard', href: '/dashboard', icon: WindowIcon, current: false, shortcut: 'D' },
    { name: 'Products', href: '/products', icon: Square3Stack3DIcon, current: false, shortcut: 'P' },
    { name: 'Subscriptions', href: '/subscriptions', icon: CurrencyDollarIcon, current: false, shortcut: 'S' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [shouldRender, setShouldRender] = useState(false);
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [loaded, setLoaded] = useState(false);
    const [ethAddress, setEthAddress] = useState('0x0000000000000000000000000000000000000000');
    const [privateKey, setPrivateKey] = useState('');
    const [mnemonic, setMnemonic] = useState('');
    const [user, setUser] = useState('');
    const [storeName, setStoreName] = useState('');
    const [step, setStep] = useState(1);
    const [open, setOpen] = useState(false)


    const handleStoreNameChange = (e) => {
        setStoreName(e.target.value);
    }

    const handleEthAddressChange = (e) => {
        setEthAddress(e.target.value);
    }



    useEffect(() => {
        function handleKeyPress(event) {
            if (event && (event.key || event.metaKey)) {
                let key = (event.key).toLowerCase();

                if (event.metaKey && key === 'p') {
                    event.preventDefault();
                    router.push('/products')
                }

                if (event.metaKey && key === 's') {
                    event.preventDefault();
                    router.push('/subscriptions')
                }
            }
        }

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);



    useEffect(() => {
        const getUser = async () => {
            try {
                const user = await supabase.auth.getUser();
                setUser(user.data.user.id);
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.data.user.id);
                if (error) {
                    throw error;
                } else {
                    setEmail(data[0].email);
                    setUsername(data[0].username);
                    setEthAddress(data[0].eth_address);
                }

            } catch (error) {
                console.error(error);
            }
        };


        getUser();
        setLoaded(true);
    }, []);

    async function handleNotSignedIn() {
        const user = await supabase.auth.getUser();
        if (!user.data.user) {
            router.push('/login');
        }
        return user.data.user;
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const handleCreateStore = async () => {
        if (!storeName) {
            toast.error('Please enter a store name');
            return;
        }
        const { data, error } = await supabase
            .from('profiles')
            .update({ store_name: storeName })
            .eq('id', user);
        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Store name added successfully');
            setStep(2);
        }
    }

    const handleCreateAddress = async () => {
        if (!ethAddress) {
            toast.error('Please enter an Ethereum address');
            return;
        }
        if (web3.utils.isAddress(ethAddress)) {
            if (!web3.utils.checkAddressChecksum(ethAddress)) {
                setEthAddress(web3.utils.toChecksumAddress(ethAddress));
            }
            const { data, error } = await supabase
                .from('profiles')
                .update({
                    eth_address: ethAddress,
                })
                .eq('id', user);
            if (error) {
                toast.error(error.message);
                return;
            }
            else {
                toast.success('Ethereum address saved.');
                setStep(3);
            }
        } else {
            toast.error('Invalid Ethereum address.');
            return;
        }
    };

    const createEthAddress = async () => {
        const mnemonic = Wallet.createRandom().mnemonic;
        const wallet = Wallet.fromMnemonic(mnemonic.phrase);

        setMnemonic(mnemonic.phrase);
        setEthAddress(wallet.address);
        setPrivateKey(wallet.privateKey);

        console.log(wallet.address, wallet.privateKey);
        setOpen(true);
    }


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

    if (!shouldRender) {
        return <div className="bg-[#0a0a0a] z-50 w-screen h-screen"></div>;
    }

    return (
        <>
            <div>
                <Toaster position="top-right"
                    reverseOrder={false} />
                <title>Dashboard | Blockpay</title>
                <Transition.Root show={open} as={Fragment}>
                    <Dialog as="div" className="relative z-50" onClose={setOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-[#0a0a0a] bg-opacity-50 transition-opacity" />
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
                                        <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                                            <button
                                                type="button"
                                                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                onClick={() => setOpen(false)}
                                            >
                                                <span className="sr-only">Close</span>
                                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                            </button>
                                        </div>
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                            </div>
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                    Deactivate account
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        {mnemonic}
                                                        {ethAddress}
                                                        {privateKey}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                            <button
                                                type="button"
                                                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                                onClick={() => setOpen(false)}
                                            >
                                                Deactivate
                                            </button>
                                            <button
                                                type="button"
                                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                onClick={() => setOpen(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-900/80" />
                        </Transition.Child>

                        <div className="fixed inset-0 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-300"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                            <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                                                <span className="sr-only">Close sidebar</span>
                                                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    {/* Sidebar component, swap this element with another sidebar if you like */}
                                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                                        <a href="/" className="flex h-16 shrink-0 items-center">
                                            <Image
                                                className="h-8 w-auto"
                                                src={logo}
                                                alt="Blockpay"
                                            />
                                        </a>
                                        <nav className="flex flex-1 flex-col">
                                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                                <li>
                                                    <ul role="list" className="-mx-2 space-y-1">
                                                        {navigation.map((item) => (
                                                            <li key={item.name}>
                                                                <a
                                                                    href={item.href}
                                                                    className={classNames(
                                                                        item.current
                                                                            ? 'bg-gray-50 text-indigo-600'
                                                                            : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                                                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
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
                                                </li>

                                                <Menu as="div" className="relative inline-block text-left lg:pr-4 mt-auto">
                                                    <div>
                                                        <Menu.Button className="inline-flex w-full justify-center items-center gap-x-2 rounded-md bg-[#0a0a0a] px-3 py-2 text-sm font-semibold text-zinc-300/80 shadow-sm hover:bg-[#18191E]">
                                                            <UserCircle className="h-4 w-4 text-zinc-300/80" aria-hidden="true" />
                                                            {email}
                                                            <MoreHorizontal className="-mr-1 h-3 w-3 text-zinc-300/80" aria-hidden="true" />
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
                                                        <Menu.Items className="absolute bottom-full mb-2 z-10 w-56 origin-top-right rounded-md bg-[#0a0a0a] shadow-lg ring-1 ring-gray-500/30 ring-opacity-5 focus:outline-none">
                                                            <div className="py-1">
                                                                <Menu.Item>
                                                                    {({ active }) => (
                                                                        <a
                                                                            href="/settings/general"
                                                                            className={classNames(
                                                                                active ? 'bg-[#18191E] rounded-md inline-block' : '',
                                                                                'flex text-zinc-300/80 items-center gap-x-1.5 px-4 py-2 text-sm'
                                                                            )}
                                                                        >
                                                                            <Settings2
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
                                                                        <a
                                                                            className={classNames(
                                                                                active ? ' bg-[#18191E] px-4 rounded-md inline-block' : '',
                                                                                'flex text-zinc-300/80 items-center gap-x-1.5 px-4 py-2 text-sm'
                                                                            )}
                                                                            onClick={handleSignOut}
                                                                        >
                                                                            <LogOut
                                                                                className="-ml-0.5 h-5 w-5"
                                                                                aria-hidden="true"
                                                                            />Log out
                                                                        </a>
                                                                    )}
                                                                </Menu.Item>
                                                            </div>
                                                        </Menu.Items>
                                                    </Transition>
                                                </Menu>
                                            </ul>
                                        </nav>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                {/* Static sidebar for desktop */}
                <div className="shadow-lg hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-500/30 bg-[#0a0a0a] px-6 pb-4">
                        <a href="/" className="mt-4 flex h-16 shrink-0 items-center">
                            <Image
                                className="h-8 w-auto"
                                src={logo}
                                alt="Blockpay"
                            />
                        </a>
                        <nav className="flex flex-1 flex-col">
                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                        {navigation.map((item) => (
                                            <li key={item.name}>
                                                <a
                                                    href={item.href}
                                                    className={classNames(
                                                        item.current
                                                            ? 'bg-gray-700/40 text-white/90'
                                                            : 'text-white/50 hover:text-white/90 hover:bg-gray-700/50',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium'
                                                    )}
                                                >
                                                    <item.icon
                                                        className={classNames(
                                                            item.current ? 'text-white/90' : 'text-white/50 group-hover:text-white/80',
                                                            'h-6 w-6 shrink-0'
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                    {item.name}
                                                    <div className='ml-auto hidden group-hover:block opacity-80 items-center'>
                                                        <kbd className="font-sans inline-flex h-[18px] w-[18px] select-none items-center justify-center rounded text-[12px] text-white/90 border border-gray-500/30 transition duration-200 ease-in-out">
                                                            ⌘
                                                        </kbd>
                                                        <span>
                                                            &nbsp;
                                                        </span>
                                                        <kbd className="font-sans inline-flex h-[18px] w-[18px] select-none items-center justify-center rounded text-[12px] text-white/90 border border-gray-500/30 transition duration-200 ease-in-out">
                                                            {item.shortcut}
                                                        </kbd>
                                                    </div>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>

                                {/* aicia */}
                                <Menu as="div" className="relative inline-block text-left lg:pr-4 mt-auto">
                                    <div>
                                        <Menu.Button className="inline-flex w-full justify-center items-center gap-x-2 rounded-md bg-[#0a0a0a] px-3 py-2 text-sm font-semibold text-zinc-300/80 shadow-sm hover:bg-[#18191E]">
                                            <UserCircle className="h-4 w-4 text-zinc-300/80" aria-hidden="true" />
                                            {email}
                                            <MoreHorizontal className="-mr-1 h-3 w-3 text-zinc-300/80" aria-hidden="true" />
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
                                        <Menu.Items className="absolute bottom-full mb-2 z-10 w-56 origin-top-right rounded-md bg-[#0a0a0a] shadow-lg ring-1 ring-gray-500/30 ring-opacity-5 focus:outline-none">
                                            <div className="py-1">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <a
                                                            href="/settings/general"
                                                            className={classNames(
                                                                active ? 'bg-[#18191E] rounded-md inline-block' : '',
                                                                'flex text-zinc-300/80 items-center gap-x-1.5 px-4 py-2 text-sm'
                                                            )}
                                                        >
                                                            <Settings2
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
                                                        <a
                                                            className={classNames(
                                                                active ? ' bg-[#18191E] px-4 rounded-md inline-block' : '',
                                                                'flex text-zinc-300/80 items-center gap-x-1.5 px-4 py-2 text-sm'
                                                            )}
                                                            onClick={handleSignOut}
                                                        >
                                                            <LogOut
                                                                className="-ml-0.5 h-5 w-5"
                                                                aria-hidden="true"
                                                            />Log out
                                                        </a>
                                                    )}
                                                </Menu.Item>
                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className="lg:pl-72">
                    <div className="sticky top-0 z-40 lg:mx-auto">
                        <div className="flex h-16 items-center gap-x-4 border-b border-gray-500/30 bg-[#0a0a0a] px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
                            <button
                                type="button"
                                className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <span className="sr-only">Open sidebar</span>
                                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                            </button>

                            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 lg:pl-4">
                                <form className="relative flex flex-1" action="#" method="GET">
                                </form>
                                <Link
                                    className="mr-6 text-zinc-300 flex items-center hover:bg-white/5 p-5 rounded-full"
                                    href="/docs"
                                >
                                    Docs <ArrowUpRight className='ml-1 w-4 h-4 inline-block' />
                                </Link>
                            </div>
                        </div>
                    </div>

                    <main className="py-10 bg-[#0a0a0a] h-full min-h-screen relative">
                        <div className='ml-96 flex items-center justify-left'>
                            <ul role="list" className="space-y-6">
                                <div class="flex justify-center ml-3 double-gradient absolute top-0 h-[500px] w-px"></div>

                                <li className="relative flex gap-x-4">
                                    
                                    <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-[#0a0a0a]">
                                        <div className="relative flex h-3 w-3">
                                            {
                                                step === 1 ?
                                                    (
                                                        <div className='relative flex h-3 w-3'>
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-3 w-3 ring-2 ring-green-500 bg-[#0a0a0a]"></span>
                                                        </div>
                                                    )
                                                    :
                                                    (
                                                        <div className='relative flex h-3 w-3'>
                                                            <span className="relative inline-flex rounded-full h-3 w-3 ring-2 ring-green-500 bg-[#0a0a0a]"></span>
                                                        </div>
                                                    )
                                            }
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium leading-6 text-zinc-300">
                                            Choose a store name
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                name="name"
                                                id="Name"
                                                className="bg-[#18191E] font-medium pl-2.5 block w-full rounded-md border lg:border-0 py-1.5 text-zinc-300 shadow-sm ring-1 ring-inset ring-gray-500/30 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                required
                                                onChange={handleStoreNameChange}
                                                disabled={step !== 1}
                                            />
                                        </div>
                                        {step === 1 && (
                                            <button
                                                type="button"
                                                className="mt-2 flex-1 rounded-md bg-[#18191E] px-3 py-2 text-sm font-semibold text-zinc-300 shadow-sm hover:text-zinc-100 hover:ring-1 hover:ring-gray-500/30"
                                                onClick={async () => {
                                                    await handleCreateStore();
                                                }}
                                            >
                                                Save
                                            </button>
                                        )}

                                    </div>
                                </li>
                                <li className={`${step === 2 ? '' : 'opacity-75'} relative flex gap-x-4`}>
                                    
                                    <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-[#0a0a0a]">
                                        <div className="relative flex h-3 w-3">
                                            {
                                                step === 2 ?
                                                    (
                                                        <div className='relative flex h-3 w-3'>
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-3 w-3 ring-2 ring-green-500 bg-[#0a0a0a]"></span>
                                                        </div>
                                                    )
                                                    :
                                                    (
                                                        <div className='relative flex h-3 w-3'>
                                                            <span className="relative inline-flex rounded-full h-3 w-3 ring-2 ring-white bg-[#0a0a0a]"></span>
                                                        </div>
                                                    )
                                            }
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium leading-6 text-zinc-300">
                                            Enter your Ethereum address
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                name="name"
                                                id="Name"
                                                className="font-mono text-xs bg-[#18191E] px-2.5 block w-full rounded-md border lg:border-0 py-1.5 text-zinc-300 shadow-sm ring-1 ring-inset ring-gray-500/30 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                required
                                                value={ethAddress}
                                                onChange={handleEthAddressChange}
                                                placeholder='0x000000000000000000'
                                                disabled={step !== 2}
                                            />
                                        </div>
                                        {step === 2 && (
                                            <div className='space-x-3'>
                                                <button
                                                    type="button"
                                                    className="mt-2 flex-1 rounded-md bg-[#18191E] px-3 py-2 text-sm font-semibold text-zinc-300 shadow-sm hover:text-zinc-100 hover:ring-1 hover:ring-gray-500/30"
                                                    onClick={async () => {
                                                        await handleCreateAddress();
                                                    }}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    type="button"
                                                    className="mt-2 flex-1 rounded-md bg-white/95 px-3 py-2 text-sm font-semibold text-dark shadow-sm hover:bg-white/90"
                                                    onClick={async () => {
                                                        await createEthAddress();
                                                    }}
                                                >
                                                    Generate address
                                                </button>
                                            </div>
                                        )}

                                    </div>
                                </li>
                                <li className="relative flex gap-x-4">
                                    
                                    <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-[#0a0a0a]">
                                        <div className="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300"></div>
                                    </div>
                                    <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
                                        <span className="font-medium text-white">Chelsea Hagon</span> sent the
                                        invoice.
                                    </p>
                                    <time
                                        datetime="2023-01-23T11:24"
                                        className="flex-none py-0.5 text-xs leading-5 text-gray-500"
                                    >
                                        6d ago
                                    </time>
                                </li>
                                <li className="relative flex gap-x-4">
                                    
                                    <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-[#0a0a0a]">
                                        <div className="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300"></div>
                                    </div>
                                    <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
                                        <span className="font-medium text-white">Alex Curren</span> viewed the
                                        invoice.
                                    </p>
                                    <time
                                        datetime="2023-01-24T09:12"
                                        className="flex-none py-0.5 text-xs leading-5 text-gray-500"
                                    >
                                        2d ago
                                    </time>
                                </li>
                                <li className="relative flex gap-x-4">
                                    <div className="h-6 absolute left-0 top-0 flex w-6 justify-center">
                                        <div className="w-px bg-gray-200"></div>
                                    </div>
                                    <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-[#0a0a0a]">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            aria-hidden="true"
                                            className="h-6 w-6 text-indigo-600"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                                clip-rule="evenodd"
                                            ></path>
                                        </svg>
                                    </div>
                                    <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
                                        <span className="font-medium text-white">Alex Curren</span> paid the
                                        invoice.
                                    </p>
                                    <time
                                        datetime="2023-01-24T09:20"
                                        className="flex-none py-0.5 text-xs leading-5 text-gray-500"
                                    >
                                        1d ago
                                    </time>
                                </li>
                            </ul>
                        </div>
                    </main>
                </div >
            </div >
        </>
    )
}