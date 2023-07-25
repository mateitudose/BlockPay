import { Fragment, useState, useEffect } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
    Bars3Icon,
    Cog8ToothIcon,
    XMarkIcon,
    ArrowRightOnRectangleIcon,
    WindowIcon,
    Square3Stack3DIcon,
    CurrencyDollarIcon,
} from '@heroicons/react/24/outline'

import {
    ChevronDownIcon,
} from '@heroicons/react/20/solid'

import {
    UserCircle,
    LogOut,
    MoreHorizontal,
    Edit,
    Settings2,
    CalendarPlusIcon,
} from 'lucide-react'

import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient'
import logo from "@/public/logo.svg"
import Image from 'next/image'
const { v4: uuidv4 } = require('uuid');
import Badge from '@/components/LightBadge';
import toast, { Toaster } from 'react-hot-toast';

import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.HttpProvider("https://winter-green-moon.matic-testnet.quiknode.pro/a9195176acadcc1ef8b6e4492cca1342aabed9bc/"));

import ABI from '@/lib/ABI.json';
const contract = new web3.eth.Contract(ABI, "0x14710BDb76743e217C3F936aE3ecb4673F45369c");


import { useContractWrite, useAccount } from 'wagmi'

import { ConnectButton } from '@rainbow-me/rainbowkit';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: WindowIcon, current: false, shortcut: 'D' },
    { name: 'Products', href: '/products', icon: Square3Stack3DIcon, current: false, shortcut: 'P' },
    { name: 'Subscriptions', href: '/subscriptions', icon: CurrencyDollarIcon, current: true, shortcut: 'S' },
]

let subscriptions = [];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


export default function Subscriptions() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [shouldRender, setShouldRender] = useState(false);
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [loaded, setLoaded] = useState(false);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [subscriptionName, setSubscriptionName] = useState('');
    const [price, setPrice] = useState(0);
    const [referral, setReferral] = useState(0);
    const [currentID, setCurrentID] = useState('');
    const [planID, setPlanID] = useState('');
    const { isConnected, isConnecting } = useAccount();

    const handleReferralChange = (e) => {
        setReferral(e.target.value);
    };

    const handleSubscriptionNameChange = (e) => {
        setSubscriptionName(e.target.value);
    };

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
    }

    useEffect(() => {
        function handleKeyPress(event) {
            if (event && (event.key || event.metaKey)) {
                let key = (event.key).toLowerCase();

                if (event.metaKey && key === 'p') {
                    event.preventDefault();
                    router.push('/products')
                }

                if (event.metaKey && key === 'd') {
                    event.preventDefault();
                    router.push('/dashboard')
                }
            }
        }

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    const { data: dataCreatePlan, isLoading: isLoadingCreatePlan, isSuccess: isSuccessCreatePlan, writeAsync: createPlan } = useContractWrite({
        address: "0x14710BDb76743e217C3F936aE3ecb4673F45369c",
        abi: ABI,
        functionName: "createPlan",
        args: [web3.utils.toWei(price != '' ? price.toString() : "0", 'ether'), "2592000", referral.toString(), "0x2e84cC0cE546A50f0C0B6731f119D37ae2B6c7eE"],
    });

    const { data: dataDeletePlan, isLoading: isLoadingDeletePlan, isSuccess: isSuccessDeletePlan, writeAsync: deletePlan } = useContractWrite({
        address: "0x14710BDb76743e217C3F936aE3ecb4673F45369c",
        abi: ABI,
        functionName: "deletePlan",
        args: [planID != '' ? planID.toString() : "0"],
    });

    useEffect(() => {
        const getUser = async () => {
            try {
                const user = await supabase.auth.getUser();
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.data.user.id);
                if (error) {
                    toast.error(error.message);
                } else {
                    setEmail(data[0].email);
                    setUsername(data[0].username);
                }

            } catch (error) {
                console.error(error);
            }
        };

        const getInvoices = async () => {
            try {
                const user = await supabase.auth.getUser();
                const { data, error } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('merchant_id', user.data.user.id);
                if (error) {
                    throw error;
                } else {
                    if (data) {
                        subscriptions = [];
                        for (let i = 0; i < data.length; i++) {
                            subscriptions.push({
                                id: i,
                                id_hash: data[i].id,
                                price: data[i].price_in_usd,
                                name: data[i].product_name,
                            })
                        }
                        setLoaded(true);
                    }
                }

            } catch (error) {
                console.error(error);
            }
        };

        getUser();
        getInvoices();

    }, []);

    async function handleNotSignedIn() {
        const user = await supabase.auth.getUser();
        if (!user.data.user) {
            router.push('/login');
        }
        else if (user.data.user !== null) {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.data.user.id);
            if (error) {
                console.error(error);

            }
            else if (data[0].eth_address === null || data[0].store_name === null) {
                router.push('/onboarding');
            }

        }
        return user.data.user;
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        // Redirect to login page or perform other actions after sign out
        router.push('/login');
    };

    const addSubscription = async () => {
        if (isLoadingCreatePlan) return;
        if (!isConnected) {
            toast.error('Please connect your wallet');
            return;
        }
        const totalPlans = await contract.methods.totalPlans().call();
        if (referral >= 0 && referral <= 100) {
            try {
                const tx = await createPlan();
                const res = await tx?.wait().then(async () => {
                    const user = await supabase.auth.getUser();
                    const { data, error } = await supabase
                        .from('subscriptions')
                        .insert({
                            id: (uuidv4().split('-')).pop(),
                            merchant_id: user.data.user.id,
                            product_name: subscriptionName,
                            price_in_usd: price,
                            planID: parseInt(totalPlans),
                        });
                    if (error) {
                        toast.error(error.message);
                    } else {
                        toast.success(`Subscription ${subscriptionName} added`);
                        router.reload();
                    }

                });
            } catch (error) {
                console.error(error);
            }
        } else {
            toast.error('Referral percentage must be between 0 and 100');
        }

    };

    const updateSubscription = async (id, name) => {
        const { data, error } = await supabase
            .from('subscriptions')
            .update({
                product_name: name,
            })
            .eq('id', id);
        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Subscription updated');
            router.reload();
        }
    };

    const deleteSubscription = async (id) => {
        try {
            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('id', id);

            if (!isConnected) {
                toast.error('Please connect your wallet');
                return;
            }

            if (!error && data && data.length > 0 && data[0].planID) {
                const planID = data[0].planID;
                setPlanID(planID);

                const tx = await deletePlan();
                const res = await tx?.wait().then(async () => {
                    const { data, error } = await supabase
                        .from('subscriptions')
                        .delete()
                        .eq('planID', planID);

                    if (error) {
                        toast.error(error.message);
                    } else {
                        toast.success(`Subscription ${subscriptionName} deleted`);
                        router.reload();
                    }
                });
            } else {
                if (error) {
                    toast.error(error.message);
                } else {
                    toast.error('No data found with the provided ID or Plan ID is missing');
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
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

    if (!shouldRender) {
        return <div className="bg-[#0a0a0a] z-50 w-screen h-screen"></div>;
    }

    function changeColor(n) {
        if (n > 0)
            return "green";
        else if (n < 0)
            return "red";
        else
            return "yellow";
    }

    function changeStatus(status) {
        if (status === "Awaiting payment")
            return "yellow";
        else if (status === "Cancelled")
            return "red";
        else if (status === "Confirmed")
            return "green";
        else
            return "yellow";
    }

    return (
        <>
            <div>
                <Toaster position="top-right"
                    reverseOrder={false} />
                <title>Subscriptions | Blockpay</title>

                <Transition.Root show={open} as={Fragment}>
                    <Dialog as="div" className="relative z-50" onClose={setOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-in-out duration-500"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in-out duration-500"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-hidden">
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="transform transition ease-in-out duration-500 sm:duration-700"
                                        enterFrom="translate-x-full"
                                        enterTo="translate-x-0"
                                        leave="transform transition ease-in-out duration-500 sm:duration-700"
                                        leaveFrom="translate-x-0"
                                        leaveTo="translate-x-full"
                                    >
                                        <Dialog.Panel className="pointer-events-auto relative w-96">
                                            <Transition.Child
                                                as={Fragment}
                                                enter="ease-in-out duration-500"
                                                enterFrom="opacity-0"
                                                enterTo="opacity-100"
                                                leave="ease-in-out duration-500"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                                                    <button
                                                        type="button"
                                                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                                        onClick={() => setOpen(false)}
                                                    >
                                                        <span className="sr-only">Close panel</span>
                                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </Transition.Child>
                                            <div className="h-full overflow-y-auto bg-[#0a0a0a] p-8">
                                                <div className="space-y-6 pb-16">
                                                    <div>
                                                        <div className="mt-4">
                                                            <h2 className='my-4 font-medium text-white'>Subscription Details</h2>
                                                            <div>
                                                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-zinc-300">
                                                                    Subscription name
                                                                </label>
                                                                <div className="mt-2">
                                                                    <input
                                                                        type="text"
                                                                        name="name"
                                                                        id="Name"
                                                                        className="bg-[#18191E] pl-2.5 block w-full rounded-md border lg:border-0 py-1.5 text-zinc-300 shadow-sm ring-1 ring-inset ring-gray-500/30 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                                        placeholder="Name"
                                                                        required
                                                                        onChange={handleSubscriptionNameChange}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <label htmlFor="price" className="block text-sm font-medium leading-6 text-zinc-300">
                                                                Price
                                                            </label>
                                                            <div className="relative mt-2 rounded-md shadow-sm">
                                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                                    <span className="text-gray-500 sm:text-sm">$</span>
                                                                </div>
                                                                <input
                                                                    type="number"
                                                                    name="price"
                                                                    id="price"
                                                                    className="bg-[#18191E] block w-full rounded-md border lg:border-0 py-1.5 pl-7 pr-12 text-zinc-300 ring-1 ring-inset ring-gray-500/30 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                                    placeholder="0.00"
                                                                    aria-describedby="price-currency"
                                                                    required
                                                                    onChange={handlePriceChange}
                                                                />
                                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                                    <span className="text-gray-500 sm:text-sm" id="price-currency">
                                                                        USD
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='mt-6'>
                                                            <label htmlFor="price" className="block text-sm font-medium leading-6 text-zinc-300">
                                                                Referral Percentage
                                                            </label>
                                                            <div className="relative mt-2 rounded-md shadow-sm">
                                                                <input
                                                                    type="number"
                                                                    name="referral"
                                                                    id="referral"
                                                                    className="bg-[#18191E] pl-2.5 block w-full rounded-md border lg:border-0 py-1.5 text-zinc-300 shadow-sm ring-1 ring-inset ring-gray-500/30 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                                    placeholder="0"
                                                                    required
                                                                    onChange={handleReferralChange}
                                                                />
                                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                                    <span className="text-gray-500 sm:text-sm" id="price-currency">
                                                                        %
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex">
                                                        <button
                                                            type="button"
                                                            className="flex-1 rounded-md bg-[#18191E] px-3 py-2 text-sm font-semibold text-zinc-300 shadow-sm hover:ring-1 hover:ring-gray-500/30"
                                                            onClick={async () => {
                                                                await addSubscription();
                                                                setOpen(false);
                                                            }}
                                                        >
                                                            Add subscription
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>

                {/* Edit subscription*/}
                <Transition.Root show={openEdit} as={Fragment}>
                    <Dialog as="div" className="relative z-50" onClose={setOpenEdit}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-in-out duration-500"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in-out duration-500"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-hidden">
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="transform transition ease-in-out duration-500 sm:duration-700"
                                        enterFrom="translate-x-full"
                                        enterTo="translate-x-0"
                                        leave="transform transition ease-in-out duration-500 sm:duration-700"
                                        leaveFrom="translate-x-0"
                                        leaveTo="translate-x-full"
                                    >
                                        <Dialog.Panel className="pointer-events-auto relative w-96">
                                            <Transition.Child
                                                as={Fragment}
                                                enter="ease-in-out duration-500"
                                                enterFrom="opacity-0"
                                                enterTo="opacity-100"
                                                leave="ease-in-out duration-500"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                                                    <button
                                                        type="button"
                                                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                                        onClick={() => setOpenEdit(false)}
                                                    >
                                                        <span className="sr-only">Close panel</span>
                                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </Transition.Child>
                                            <div className="h-full overflow-y-auto bg-[#0a0a0a] p-8">
                                                <div className="space-y-6 pb-16">
                                                    <div>
                                                        <div className="mt-4">
                                                            <h2 className='my-4 font-medium text-white'>Subscription Details</h2>
                                                            <div>
                                                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-zinc-300">
                                                                    Subscription name
                                                                </label>
                                                                <div className="mt-2">
                                                                    <input
                                                                        type="text"
                                                                        name="name"
                                                                        id="Name"
                                                                        className="bg-[#18191E] pl-2.5 block w-full rounded-md border lg:border-0 py-1.5 text-zinc-300 shadow-sm ring-1 ring-inset ring-gray-500/30 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                                                        placeholder={subscriptionName}
                                                                        required
                                                                        value={subscriptionName}
                                                                        onChange={handleSubscriptionNameChange}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between space-x-2">
                                                        <button
                                                            type="button"
                                                            className="flex-1 rounded-md bg-[#18191E] px-3 py-2 text-sm font-semibold text-zinc-300 shadow-sm hover:text-zinc-100 hover:ring-1 hover:ring-gray-500/30"
                                                            onClick={async () => {
                                                                await updateSubscription(currentID, subscriptionName);
                                                                setOpenEdit(false);
                                                            }}
                                                        >
                                                            Update
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-zinc-300 shadow-sm hover:text-zinc-100 hover:ring-1 hover:ring-red-500"
                                                            onClick={async () => {
                                                                await deleteSubscription(currentID);
                                                                setOpenEdit(false);
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
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
                                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-[#0a0a0a] px-6 pb-4">
                                        <div className="flex h-16 shrink-0 items-center">
                                            <Image
                                                className="h-8 w-auto"
                                                src={logo}
                                                alt="Your Company"
                                            />
                                        </div>
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
                                                        <kbd className="font-sans inline-flex h-5 w-5 select-none items-center justify-center rounded text-sm text-white/90 border border-gray-500/30 transition duration-200 ease-in-out">
                                                            ⌘
                                                        </kbd>
                                                        <span>
                                                            &nbsp;
                                                        </span>
                                                        <kbd className="font-sans inline-flex h-5 w-5 select-none items-center justify-center rounded text-sm text-white/90 border border-gray-500/30 transition duration-200 ease-in-out">
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
                        <div className="flex justify-between h-16 items-center gap-x-4 border-b border-gray-500/30 bg-[#0a0a0a] px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
                            <button
                                type="button"
                                className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <span className="sr-only">Open sidebar</span>
                                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                            </button>

                            {/* Separator */}
                            <div className="h-6 w-px bg-gray-500/30 lg:hidden" aria-hidden="true" />

                            <div className="flex flex-1 gap-x-4 lg:gap-x-6 lg:pl-4">
                            </div>

                            {/* Separator */}
                            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-500/30" aria-hidden="true" />

                            {/* Profile dropdown */}
                            <div className="hidden lg:block mr-6">
                                <ConnectButton
                                    label='Connect Web3'
                                />
                            </div>
                        </div>
                    </div>



                    <main className="py-10 bg-[#0a0a0a] h-screen relative">
                        <div className="px-4 sm:px-6 lg:px-24">
                            <div className="sm:flex sm:items-center">
                                <div className="sm:flex-auto">
                                    <div className="block lg:hidden mb-6 -mr-1">
                                        <ConnectButton
                                            label='Connect Web3'
                                        />
                                    </div>
                                    <div className={!isConnected || isConnecting ? `mb-8 text-sm` : `hidden`}>
                                        <Badge
                                            color="yellow"
                                            text="You must connect your Web3 wallet in order to subscribe."
                                        />
                                    </div>
                                    <h1 className="text-base font-semibold leading-6 text-zinc-300">
                                        Subscriptions
                                    </h1>
                                    <p className="mt-2 text-sm text-zinc-300">
                                        A list of all the subscriptions in your account including their name, id, price and link.
                                    </p>
                                </div>
                                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                                    <button
                                        type="button"
                                        className="block rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-black shadow-sm hover:bg-white/90"
                                        onClick={() => setOpen(true)}
                                    >
                                        Add subscription
                                    </button>
                                </div>
                            </div>
                            <div className="mt-8 flow-root">
                                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                        {loaded && subscriptions.length > 0 &&
                                            <div className="rounded-t-md overflow-hidden shadow border border-gray-500/30 ring-opacity-5 sm:rounded-lg">

                                                <table className="min-w-full divide-y divide-gray-500/30">
                                                    <thead className="bg-[#18191E]">
                                                        <tr>
                                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-300 sm:pl-6">
                                                                Subscription Name
                                                            </th>
                                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-300">
                                                                ID
                                                            </th>
                                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-300">
                                                                Price
                                                            </th>
                                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-300">
                                                                Link
                                                            </th>
                                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                                <span className="sr-only">Edit</span>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-500/30 bg-[#0a0a0a]">
                                                        {loaded && subscriptions.map((subscription) => (
                                                            <tr key={subscription.id}>
                                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-zinc-300 sm:pl-6">
                                                                    {subscription.name}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-300 font-mono">{subscription.id_hash}</td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-300 font-medium">
                                                                    <span className='text-zinc-300'>
                                                                        $
                                                                    </span>
                                                                    {subscription.price}
                                                                </td>
                                                                <button
                                                                    className="font-mono whitespace-nowrap px-3 py-4 text-sm text-zinc-300 hover:underline hover:cursor-pointer"
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText(`https://onblockpay.com/s/${subscription.id_hash}`);
                                                                        toast.success('Copied link to clipboard!');
                                                                    }}
                                                                >
                                                                    onblockpay.com/s/{subscription.id_hash}
                                                                </button>
                                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                                    <button
                                                                        className="text-white/80 hover:text-white/90 flex items-center"
                                                                        onClick={() => {
                                                                            setCurrentID(subscription.id_hash);
                                                                            setSubscriptionName(subscription.name);
                                                                            setPrice(subscription.price);
                                                                            setOpenEdit(true);
                                                                        }}
                                                                    >
                                                                        Edit <Edit className='ml-1 w-3 h-3' aria-hidden="true" />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>

                                            </div>
                                        }
                                        {subscriptions && subscriptions.length === 0 &&

                                            <div
                                                className="mx-4 sm:mx-0 mt-3 relative block rounded-lg border-2 border-dashed border-gray-500/30 p-12 text-center"
                                            >
                                                <CalendarPlusIcon
                                                    className="mx-auto h-8 w-8 text-gray-500"
                                                    aria-hidden="true"
                                                />
                                                <span className="mt-2 block text-sm font-semibold text-gray-500">No subscriptions so far</span>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div >
            </div >
        </>
    )
}
