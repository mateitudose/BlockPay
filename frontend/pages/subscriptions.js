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

import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient'
import logo from "@/public/logo.svg"
import Image from 'next/image'
const { v4: uuidv4 } = require('uuid');
import Badge from '@/components/Badge';
import toast, { Toaster } from 'react-hot-toast';

import Web3 from 'web3';
const web3 = new Web3(new Web3.providers.HttpProvider("https://rpc.ankr.com/polygon_mumbai"));

import ABI from '@/lib/ABI.json';

import { useContractWrite, useContractRead, useAccount } from 'wagmi'

import { ConnectButton } from '@rainbow-me/rainbowkit';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: WindowIcon, current: false },
    { name: 'Products', href: '/products', icon: Square3Stack3DIcon, current: false },
    { name: 'Subscriptions', href: '/subscriptions', icon: CurrencyDollarIcon, current: true },
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
        return user.data.user;
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        // Redirect to login page or perform other actions after sign out
        router.push('/login');
    };

    const totalPlans = useContractRead({
        address: "0x14710BDb76743e217C3F936aE3ecb4673F45369c",
        abi: ABI,
        functionName: 'totalPlans',
    })

    const addSubscription = async () => {
        if (isLoadingCreatePlan) return;
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
                            planID: parseInt(totalPlans.data),
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
        const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('id', id);
        if (!error && data.length > 0 && data[0].planID) {
            setPlanID(data[0].planID);
            try {
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
            }
            catch (error) {
                toast.error(error);
            }
        } else {
            if (error) {
                toast.error(error.message);
            } else {
                toast.error('No data found with provided ID or Plan ID is missing');
            }
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
        return <div></div>;
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
        else if (status === "Voided")
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
                                            <div className="h-full overflow-y-auto bg-white p-8">
                                                <div className="space-y-6 pb-16">
                                                    <div>
                                                        <div className="mt-4">
                                                            <h2 className='my-4 font-medium'>Subscription Details</h2>
                                                            <div>
                                                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                                                    Subscription name
                                                                </label>
                                                                <div className="mt-2">
                                                                    <input
                                                                        type="text"
                                                                        name="name"
                                                                        id="Name"
                                                                        className="pl-2.5 block w-full rounded-md border lg:border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                        placeholder="Name"
                                                                        required
                                                                        value={subscriptionName}
                                                                        onChange={handleSubscriptionNameChange}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
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
                                                                    className="block w-full rounded-md border lg:border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                    placeholder="0.00"
                                                                    aria-describedby="price-currency"
                                                                    required
                                                                    value={price}
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
                                                            <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                                                                Referral Percentage
                                                            </label>
                                                            <div className="relative mt-2 rounded-md shadow-sm">
                                                                <input
                                                                    type="number"
                                                                    name="referral"
                                                                    id="referral"
                                                                    className="block w-full rounded-md border lg:border-0 py-1.5 pl-2.5 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                    placeholder="0"
                                                                    required
                                                                    value={referral}
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
                                                            className="flex-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
                                            <div className="h-full overflow-y-auto bg-white p-8">
                                                <div className="space-y-6 pb-16">
                                                    <div>
                                                        <div className="mt-4">
                                                            <h2 className='my-4 font-medium'>Subscription Details</h2>
                                                            <div>
                                                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                                                    Subscription name
                                                                </label>
                                                                <div className="mt-2">
                                                                    <input
                                                                        type="text"
                                                                        name="name"
                                                                        id="Name"
                                                                        className="pl-2.5 block w-full rounded-md border lg:border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                                                            className="flex-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                            onClick={async () => {
                                                                await updateSubscription(currentID, subscriptionName);
                                                                setOpenEdit(false);
                                                            }}
                                                        >
                                                            Update subscription
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                                            onClick={async () => {
                                                                await deleteSubscription(currentID);
                                                                setOpenEdit(false);
                                                            }}
                                                        >
                                                            Delete subscription
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
                                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
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

                                                <li className="mt-auto">
                                                    <a
                                                        href="/settings/general"
                                                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                                    >
                                                        <Cog8ToothIcon
                                                            className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                                                            aria-hidden="true"
                                                        />
                                                        Settings
                                                    </a>
                                                </li>
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
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
                        <div className="mt-4 flex h-16 shrink-0 items-center">
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

                                <li className="mt-auto">
                                    <a
                                        href="/settings/general"
                                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                                    >
                                        <Cog8ToothIcon
                                            className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                                            aria-hidden="true"
                                        />
                                        Settings
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className="lg:pl-72">
                    <div className="sticky top-0 z-40 lg:mx-auto lg:max-w-7xl">
                        <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
                            <button
                                type="button"
                                className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <span className="sr-only">Open sidebar</span>
                                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                            </button>

                            {/* Separator */}
                            <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

                            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 lg:pl-4">
                                <form className="relative flex flex-1" action="#" method="GET">
                                    {/* <label htmlFor="search-field" className="sr-only">
                                        Search
                                    </label>
                                    <MagnifyingGlassIcon
                                        className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                    <input
                                        id="search-field"
                                        className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                        placeholder="Search..."
                                        type="search"
                                        name="search"
                                    /> */}
                                </form>
                                <div className="flex items-center gap-x-4 lg:gap-x-6">
                                    {/* <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                                        <span className="sr-only">View notifications</span>
                                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                                    </button> */}

                                    {/* Separator */}
                                    <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

                                    {/* Profile dropdown */}
                                    <div className="hidden lg:block">
                                        <ConnectButton
                                            label='Connect Web3'
                                        />
                                    </div>
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
                                                                href="/settings/general"
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
                        </div>
                    </div>

                    <main className="py-10 bg-slate-50/80 h-screen relative">
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
                                    <h1 className="text-base font-semibold leading-6 text-gray-900">
                                        Subscriptions
                                    </h1>
                                    <p className="mt-2 text-sm text-gray-700">
                                        A list of all the subscriptions in your account including their name, id, price and link.
                                    </p>
                                </div>
                                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                                    <button
                                        type="button"
                                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        onClick={() => setOpen(true)}
                                    >
                                        Add subscription
                                    </button>
                                </div>
                            </div>
                            <div className="mt-8 flow-root">
                                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                            <table className="min-w-full divide-y divide-gray-300">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                            Subscription Name
                                                        </th>
                                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                            ID
                                                        </th>
                                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                            Price
                                                        </th>
                                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                            Link
                                                        </th>
                                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                            <span className="sr-only">Edit</span>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 bg-white">
                                                    {loaded && subscriptions.map((subscription) => (
                                                        <tr key={subscription.id}>
                                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                                {subscription.name}
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 font-mono">{subscription.id_hash}</td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-black font-medium">
                                                                <span className='text-gray-500'>
                                                                    $
                                                                </span>
                                                                {subscription.price}
                                                                <span className='text-gray-500'>
                                                                    USD
                                                                </span>
                                                            </td>
                                                            <button
                                                                className="font-mono whitespace-nowrap px-3 py-4 text-sm text-gray-500 hover:underline hover:cursor-pointer"
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(`http://localhost:3000/s/${subscription.id_hash}`);
                                                                    toast.success('Copied link to clipboard!');
                                                                }}
                                                            >
                                                                localhost:3000/s/{subscription.id_hash}
                                                            </button>
                                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                                <button
                                                                    className="text-indigo-600 hover:text-indigo-900"
                                                                    onClick={() => {
                                                                        setCurrentID(subscription.id_hash);
                                                                        setSubscriptionName(subscription.name);
                                                                        setPrice(subscription.price);
                                                                        setOpenEdit(true);
                                                                    }}
                                                                >
                                                                    Edit
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
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