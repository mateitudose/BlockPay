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
}
    from '@heroicons/react/20/solid'

import { LogOut, MoreHorizontal, Settings2, UserCircle } from 'lucide-react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient'
import logo from "@/public/logo.svg"
import Image from 'next/image'
import Badge from '@/components/Badge';
import toast, { Toaster } from 'react-hot-toast';

import cryptos from '@/components/cryptos.js';
import SecondaryButton from '@/components/SecondaryButton';
import Chart from '@/components/Chart';


const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: WindowIcon, current: true },
    { name: 'Products', href: '/products', icon: Square3Stack3DIcon, current: false },
    { name: 'Subscriptions', href: '/subscriptions', icon: CurrencyDollarIcon, current: false },
]

let transactions = [];

const UTC = (timestamp) => {
    const date = new Date(timestamp);

    const timeFormatter = new Intl.DateTimeFormat('default', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    const dateFormatter = new Intl.DateTimeFormat('default', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const formattedTime = timeFormatter.format(date);
    const formattedDate = dateFormatter.format(date);

    return (`${formattedTime} - ${formattedDate}`);
};

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [shouldRender, setShouldRender] = useState(false);
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [loaded, setLoaded] = useState(false);
    const [ethAddress, setEthAddress] = useState('0x0000000000000000000000000000000000000000');

    const [page, setPage] = useState(0);


    const [cards, setCards] = useState([
        { name: 'Total Revenue', href: '#', amount: '$0', change: 0, hourlyData: [] },
        { name: 'Orders', href: '#', amount: '0', change: 0, hourlyData: [] },
        // { name: 'Subscription Revenue', href: '#', amount: '0', change: 0, hourlyData: [] },
    ]);

    const itemsPerPage = 10;

    const nextPage = () => {
        setPage(prevPage => prevPage + 1);
    };

    const prevPage = () => {
        setPage(prevPage => Math.max(prevPage - 1, 0));
    };

    async function getDataForPastDay() {
        const user = await supabase.auth.getUser();
        if (user) {
            const date = new Date();
            const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
            const endOfDate = startOfDate + 24 * 60 * 60 * 1000

            const { data: invoicesToday, error: errorToday } = await supabase
                .from('invoices')
                .select('*')
                .eq('merchant_id', user.data.user != null ? user.data.user.id : 0)
                .eq('status', 'Confirmed')
                .gte('confirm_date', startOfDate)
                .lt('confirm_date', endOfDate)

            if (errorToday) {
                console.log(errorToday.message);
            }

            let hourlyDataR = [];
            let hourlyDataI = [];

            if (invoicesToday != null) {
                for (let i = 0; i < 24; i++) {
                    const startOfHour = startOfDate + i * 60 * 60 * 1000;
                    const endOfHour = startOfHour + 60 * 60 * 1000;

                    const invoicesInHour = invoicesToday.filter(
                        (invoice) =>
                            invoice.confirm_date >= startOfHour && invoice.confirm_date < endOfHour
                    );

                    const revenue = invoicesInHour.reduce(
                        (total, invoice) => total + invoice.price_in_usd,
                        0
                    );

                    hourlyDataR.push({ value: parseFloat(revenue) });
                    hourlyDataI.push({ value: parseFloat(invoicesInHour.length) });
                }

                setCards((prevCards) => {
                    const newCards = [...prevCards];
                    newCards[0].hourlyData = hourlyDataR;
                    newCards[1].hourlyData = hourlyDataI;
                    return newCards;
                });
            }

        }
    }


    async function getCompletedInvoices() {
        const user = await supabase.auth.getUser();
        if (user) {
            const date = new Date();
            const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
            const endOfDate = startOfDate + 24 * 60 * 60 * 1000

            const startOfPrevDate = startOfDate - 24 * 60 * 60 * 1000
            const endOfPrevDate = startOfDate

            const { data: invoicesToday, error: errorToday } = await supabase
                .from('invoices')
                .select('*')
                .eq('merchant_id', user.data.user != null ? user.data.user.id : 0)
                .eq('status', 'Confirmed')
                .gte('confirm_date', startOfDate)
                .lt('confirm_date', endOfDate)

            if (errorToday) console.error(errorToday)

            const { data: invoicesYesterday, error: errorYesterday } = await supabase
                .from('invoices')
                .select('*')
                .eq('merchant_id', user.data.user != null ? user.data.user.id : 0)
                .eq('status', 'Confirmed')
                .gte('confirm_date', startOfPrevDate)
                .lt('confirm_date', endOfPrevDate)

            if (errorYesterday) console.error(errorYesterday)

            const { data: subscriptions, error: errorSubscriptions } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('merchant_id', user.data.user != null ? user.data.user.id : 0)

            if (errorSubscriptions) console.error(errorSubscriptions)

            const changeInInvoices = invoicesToday.length - invoicesYesterday.length
            const percentChangeInInvoices = (invoicesYesterday.length !== 0) ? ((changeInInvoices / invoicesYesterday.length) * 100) : (invoicesToday.length !== 0) ? 100 : 0;

            const revenueToday = invoicesToday.reduce((total, invoice) => total + invoice.price_in_usd, 0);
            const revenueYesterday = invoicesYesterday.reduce((total, invoice) => total + invoice.price_in_usd, 0);
            const changeInRevenue = revenueToday - revenueYesterday;
            const percentChangeInRevenue = (revenueYesterday !== 0) ? ((changeInRevenue / revenueYesterday) * 100) : (revenueToday !== 0) ? 100 : 0;

            setCards([
                { name: 'Total Revenue', href: '#', icon: BanknotesIcon, amount: "$" + revenueToday.toString(), change: percentChangeInRevenue.toFixed(2) },
                { name: 'Orders', href: '#', icon: BuildingStorefrontIcon, amount: invoicesToday.length.toString(), change: percentChangeInInvoices.toFixed(2) },
            ]);
        }
    }

    function convertUnixToTimeAgo(unixTimestamp) {
        // Convert the Unix timestamp from seconds to milliseconds
        const date = new Date(unixTimestamp);

        // Get the current date in milliseconds
        const now = new Date();

        // Calculate the difference in milliseconds
        const diffMillis = now - date;

        // Convert the difference to seconds, minutes, hours and days
        const diffSeconds = Math.floor(diffMillis / 1000);
        const diffMinutes = Math.floor(diffMillis / (1000 * 60));
        const diffHours = Math.floor(diffMillis / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMillis / (1000 * 60 * 60 * 24));

        // If less than 1 minute, return in seconds
        if (diffMinutes < 1) {
            return `${diffSeconds} seconds ago`;
        }

        // If less than 1 hour, return in minutes
        if (diffHours < 1) {
            return `${diffMinutes} minutes ago`;
        }

        // If less than 1 day, return in hours
        if (diffDays < 1) {
            return `${diffHours} hours ago`;
        }

        // Otherwise, return in days
        return `${diffDays} days ago`;
    }


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
                    setEthAddress(data[0].eth_address);
                }

            } catch (error) {
                console.error(error);
            }
        };

        const getInvoices = async () => {
            try {
                const user = await supabase.auth.getUser();
                const { data, error } = await supabase
                    .from('invoices')
                    .select('*')
                    .eq('merchant_id', user.data.user.id);
                if (error) {
                    throw error;
                } else {
                    if (data) {
                        transactions = [];
                        for (let i = 0; i < data.length; i++) {
                            transactions.push({
                                id: i,
                                name: data[i].customer_email,
                                href: "/invoice/" + data[i].id,
                                amount: data[i].value_to_receive,
                                currency: cryptos.find(crypto => crypto.id == data[i].crypto_option).icon,
                                status: data[i].status,
                                date: convertUnixToTimeAgo(data[i].created_at),
                                date_unix: data[i].created_at,
                                background_color: cryptos.find(crypto => crypto.id == data[i].crypto_option).background_color,
                                price: data[i].price_in_usd,
                                crypto_name: cryptos.find(crypto => crypto.id == data[i].crypto_option).sym,
                            })
                        }
                        transactions.sort((a, b) => b.date_unix - a.date_unix);
                    }
                }

            } catch (error) {
                console.error(error);
            }
        };

        getUser();
        getInvoices();
        getCompletedInvoices().then(() => {
            getDataForPastDay();
        });
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

    if (!shouldRender) {
        return <div></div>;
    }

    function changeColor(n) {
        if (n > 0)
            return { color: "text-green-500", arrow: "\u2191" };
        else if (n < 0)
            return { color: "text-red-500", arrow: "\u2193" };
        else
            return { color: "text-yellow-500", arrow: "\u2212" };
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
                <title>Dashboard | Blockpay</title>
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
                                                                                'items-center gap-x-1.5 block px-4 py-2 text-sm'
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
                                                            href="/settings/general"
                                                            className={classNames(
                                                                active ? ' bg-[#18191E] px-4 rounded-md inline-block' : '',
                                                                'flex text-zinc-300/80 items-center gap-x-1.5 px-4 py-2 text-sm'
                                                            )}
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
                                <div className="mr-6 flex items-center">
                                    <SecondaryButton
                                        onClick={() => setModalOpen(true)}
                                        content="Feedback"
                                    />

                                </div>
                            </div>
                        </div>
                    </div>

                    <main className="py-10 bg-[#0a0a0a] h-full min-h-screen relative">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <main className="flex-1 pb-8">
                                <div className="mt-8">
                                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                                        <h2 className="text-lg font-medium leading-6 text-white">Cashflow</h2>
                                        <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                            {/* Card */}
                                            {cards.map((card) => (
                                                <div href={card.href} key={card.name} className="overflow-hidden rounded-lg bg-[#18191E] border border-gray-500/30">
                                                    <div className="p-5">
                                                        <div className="flex items-center">
                                                            <div className="w-0 flex-1">
                                                                <dl className="grid grid-cols-2 h-full items-end gap-4">
                                                                    <div>
                                                                        <dt className="truncate text-sm font-medium text-gray-200 mb-6">{card.name}</dt>
                                                                        <dd>
                                                                            <div className="text-3xl font-medium text-white">{card.amount}</div>
                                                                        </dd>
                                                                        <div className='mt-4 text-sm'>
                                                                            <span className={changeColor(card.change).color}>
                                                                                {changeColor(card.change).arrow}&nbsp;{card.change == "0.00" ? 0 : card.change}%
                                                                            </span>
                                                                            <span className='text-white/60'>
                                                                                &nbsp;from yesterday
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    {loaded
                                                                        ?
                                                                        <div className='self-end justify-self-end'>
                                                                            <Chart data={card.hourlyData} n={card.change} />
                                                                        </div>
                                                                        :
                                                                        <div className='self-end justify-self-end'>
                                                                            <Chart data={[{ value: 0 }, { value: 0 }]} n={card.change} />
                                                                        </div>
                                                                    }
                                                                </dl>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                    </div>

                                    <h2 className="mx-auto mt-8 max-w-6xl px-4 text-lg font-medium leading-6 text-white sm:px-6 lg:px-8">
                                        Recent activity
                                    </h2>

                                    {/* Activity list (smallest breakpoint only) */}
                                    <div className="shadow sm:hidden">
                                        <ul role="list" className="mt-2 divide-y divide-gray-200 overflow-hidden shadow sm:hidden">
                                            {loaded && transactions.slice(page * itemsPerPage, (page + 1) * itemsPerPage).map((transaction) => (
                                                <li key={transaction.id}>
                                                    <a href={transaction.href} className="block bg-white px-4 py-4 hover:bg-gray-50">
                                                        <span className="flex items-center space-x-4">
                                                            <span className="flex flex-1 space-x-2 truncate">
                                                                <BanknotesIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                                <span className="flex flex-col truncate text-sm text-gray-500">
                                                                    <span className="truncate">{transaction.name}</span>
                                                                    <div className='flex items-center justify-end'>
                                                                        <span className="font-medium text-gray-900">
                                                                            {parseFloat(parseFloat(transaction.amount).toFixed(8))}
                                                                        </span>
                                                                        <Image
                                                                            src={transaction.currency}
                                                                            alt={transaction.currency}
                                                                            width={24}
                                                                            height={24}
                                                                            className={`ml-2 inline-block rounded-md ${transaction.background_color}`}
                                                                        />
                                                                    </div>
                                                                    <time dateTime={transaction.date}>{transaction.date}</time>
                                                                </span>
                                                            </span>
                                                            <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                        </span>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>

                                        <nav
                                            className="flex items-center justify-between border-t border-gray-500/30 bg-white px-4 py-3"
                                            aria-label="Pagination"
                                        >
                                            <div className="flex flex-1 justify-between">
                                                <button
                                                    onClick={prevPage}
                                                    className="relative inline-flex items-center rounded-md bg-[white] px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    onClick={nextPage}
                                                    className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </nav>
                                    </div>

                                    {/* Activity table (small breakpoint and up) */}
                                    <div className="hidden sm:block mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                                        <div className="mt-2 flex flex-col min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-md">
                                            <div className="border border-gray-500/30 rounded-lg overflow-hidden">
                                                <table className="min-w-full divide-y divide-gray-500/30 text-gray-200 bg-gray-900 rounded-md">
                                                    <thead className="bg-[#18191E]">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-sm font-semibold" scope="col">Customer Email</th>
                                                            <th className="px-6 py-3 text-center text-sm font-semibold" scope="col">Price</th>
                                                            <th className="px-6 py-3 text-center text-sm font-semibold" scope="col">Amount</th>
                                                            <th className="px-6 py-3 text-center text-sm font-semibold" scope="col">Crypto</th>
                                                            <th className="hidden px-6 py-3 text-center text-sm font-semibold md:table-cell" scope="col">Status</th>
                                                            <th className="px-6 py-3 text-center text-sm font-semibold" scope="col">Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-[#0a0a0a] divide-y divide-gray-500/30">
                                                        {loaded && transactions.slice(page * itemsPerPage, (page + 1) * itemsPerPage).map((transaction) => (
                                                            <tr key={transaction.id}>
                                                                <td className="px-6 py-4 text-left text-sm whitespace-nowrap">
                                                                    <div className="flex">
                                                                        <a href={transaction.href} className="group inline-flex space-x-2 truncate text-sm">
                                                                            {/* <BanknotesIcon className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" aria-hidden="true" /> */}
                                                                            <p className="truncate text-white group-hover:text-gray-500">{transaction.name}</p>
                                                                        </a>
                                                                    </div>
                                                                </td>
                                                                <td className="hidden px-6 py-4 text-center text-sm md:table-cell">
                                                                    <div className="text-sm">
                                                                        <span className='text-white/60'>$</span>{transaction.price}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                                                                    <div className="flex items-center justify-center">
                                                                        <span className="font-mono">{parseFloat(transaction.amount).toFixed(8)}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                                                                    <div className="flex items-center justify-center">
                                                                        <span className="font-mono">&nbsp; {transaction.crypto_name}</span>
                                                                        <Image src={transaction.currency} alt={transaction.currency} width={24} height={24} className={`ml-2 inline-block rounded-md ${transaction.background_color}`} />
                                                                    </div>
                                                                </td>


                                                                <td className="hidden px-6 py-4 text-center text-sm md:table-cell">
                                                                    <div className="text-sm">
                                                                        <Badge color={changeStatus(transaction.status)} text={transaction.status} />
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                                                                    <time dateTime={transaction.date}>{transaction.date}</time>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>

                                                <nav className="flex items-center justify-between border-t border-gray-500/30 bg-[#18191E] px-4 py-3 sm:px-6" aria-label="Pagination">
                                                    <div className="hidden sm:block">
                                                        <p className="text-sm text-gray-400">
                                                            Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of <span className="font-medium">{transactions.length}</span> results
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-1 justify-between gap-x-3 sm:justify-end">
                                                        <button onClick={prevPage} className="relative inline-flex items-center rounded-md bg-[#18191E] px-3 py-2 text-sm font-semibold text-gray-400 ring-1 ring-inset ring-gray-500/30 hover:ring-gray-500">Previous</button>
                                                        <button onClick={nextPage} className="relative inline-flex items-center rounded-md bg-[#18191E] px-3 py-2 text-sm font-semibold text-gray-400 ring-1 ring-inset ring-gray-500/30 hover:ring-gray-500">Next</button>
                                                    </div>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>



                                </div>
                            </main></div>
                    </main>
                </div >
            </div >
        </>
    )
}