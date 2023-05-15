import { Fragment, useState, useEffect, use } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
    Bars3Icon,
    BellIcon,
    CalendarIcon,
    ChartPieIcon,
    Cog8ToothIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    HomeIcon,
    UsersIcon,
    XMarkIcon,
    ArrowRightOnRectangleIcon,
    ScaleIcon,
    WindowIcon,
    BuildingStorefrontIcon,
    BanknotesIcon,
    CreditCardIcon
} from '@heroicons/react/24/outline'
import {
    ChevronDownIcon,
    MagnifyingGlassIcon,
    BuildingOfficeIcon,
    CheckCircleIcon,
    ChevronRightIcon,
}
    from '@heroicons/react/20/solid'
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'react-hot-toast';
import logo from "@/public/logo.svg"
import Image from 'next/image'
import TimeGreeting from '@/components/TimeGreeting';
import Badge from '@/components/Badge';

const navigation = [
    { name: 'Dashboard', href: '#', icon: WindowIcon, current: true },
]

const teams = [
    { id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false },
    { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
    { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false },
]


const cards = [
    { name: 'Total Revenue', href: '#', icon: BanknotesIcon, amount: '$30,659.45', change: 12 },
    { name: 'Orders', href: '#', icon: BuildingStorefrontIcon, amount: '1,257', change: 0 },
    { name: 'Subscription Revenue', href: '#', icon: CreditCardIcon, amount: '$12,557.44', change: -3 },
]

const transactions = [
    {
        id: 1,
        name: 'Payment to Molly Sanders',
        href: '#',
        amount: '$20,000',
        currency: 'USD',
        status: 'success',
        date: 'July 11, 2020',
        datetime: '2020-07-11',
    },
    // More transactions...
]
const statusStyles = {
    success: 'bg-green-100 text-green-800',
    processing: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-gray-100 text-gray-800',
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [shouldRender, setShouldRender] = useState(false);
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        const getUser = async () => {
            try {
                const user = await await supabase.auth.getUser();
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
                // If precheck passes, set shouldRender to true
                setShouldRender(true);
            } else {
                // If precheck fails, handle it accordingly
                // For example, you can show an error message, redirect, etc.
            }
        };

        runPrecheck();
    }, []);

    if (!shouldRender) {
        // You can render a loading indicator, a placeholder, or nothing
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

    return (
        <>
            <div>
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
                                                <li>
                                                    <div className="text-xs font-semibold leading-6 text-gray-400">Your teams</div>
                                                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                                                        {teams.map((team) => (
                                                            <li key={team.name}>
                                                                <a
                                                                    href={team.href}
                                                                    className={classNames(
                                                                        team.current
                                                                            ? 'bg-gray-50 text-indigo-600'
                                                                            : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                                                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                                    )}
                                                                >
                                                                    <span
                                                                        className={classNames(
                                                                            team.current
                                                                                ? 'text-indigo-600 border-indigo-600'
                                                                                : 'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600',
                                                                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'
                                                                        )}
                                                                    >
                                                                        {team.initial}
                                                                    </span>
                                                                    <span className="truncate">{team.name}</span>
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                                <li className="mt-auto">
                                                    <a
                                                        href="#"
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
                                <li>
                                    <div className="text-xs font-semibold leading-6 text-gray-400">Your teams</div>
                                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                                        {teams.map((team) => (
                                            <li key={team.name}>
                                                <a
                                                    href={team.href}
                                                    className={classNames(
                                                        team.current
                                                            ? 'bg-gray-50 text-indigo-600'
                                                            : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                    )}
                                                >
                                                    <span
                                                        className={classNames(
                                                            team.current
                                                                ? 'text-indigo-600 border-indigo-600'
                                                                : 'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600',
                                                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'
                                                        )}
                                                    >
                                                        {team.initial}
                                                    </span>
                                                    <span className="truncate">{team.name}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li className="mt-auto">
                                    <a
                                        href="#"
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
                                    <label htmlFor="search-field" className="sr-only">
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
                                    />
                                </form>
                                <div className="flex items-center gap-x-4 lg:gap-x-6">
                                    <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                                        <span className="sr-only">View notifications</span>
                                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>

                                    {/* Separator */}
                                    <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

                                    {/* Profile dropdown */}
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
                                                                href="#"
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
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <a
                                                                href="#"
                                                                className={classNames(
                                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                    'block px-4 py-2 text-sm'
                                                                )}
                                                            >
                                                                Support
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <a
                                                                href="#"
                                                                className={classNames(
                                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                    'block px-4 py-2 text-sm'
                                                                )}
                                                            >
                                                                License
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
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><main className="flex-1 pb-8">
                            {/* Page header */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
                                    <div className="py-6 md:flex md:items-center md:justify-between ">
                                        <div className="min-w-0 flex-1">
                                            {/* Profile */}
                                            <div className="flex items-center">
                                                <img
                                                    className="hidden h-16 w-16 rounded-full sm:block"
                                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.6&w=256&h=256&q=80"
                                                    alt=""
                                                />
                                                <div>
                                                    <div className="flex items-center">
                                                        <img
                                                            className="h-16 w-16 rounded-full sm:hidden"
                                                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.6&w=256&h=256&q=80"
                                                            alt=""
                                                        />
                                                        <h1 className="inline-flex block ml-3 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
                                                            <TimeGreeting />&nbsp;<span>{username}</span>
                                                        </h1>
                                                    </div>
                                                    <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                                                        <dt className="sr-only">Company</dt>
                                                        <dd className="flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6">
                                                            <BuildingOfficeIcon
                                                                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                                                aria-hidden="true"
                                                            />
                                                            Duke street studio
                                                        </dd>
                                                        <dt className="sr-only">Account status</dt>
                                                        <dd className="mt-3 flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6 sm:mt-0">
                                                            <CheckCircleIcon
                                                                className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-400"
                                                                aria-hidden="true"
                                                            />
                                                            Verified account
                                                        </dd>
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-6 flex space-x-3 md:ml-4 md:mt-0">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                            >
                                                Add money
                                            </button>
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                                            >
                                                Send money
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                                    <h2 className="text-lg font-medium leading-6 text-gray-900">Cashflow</h2>
                                    <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                        {/* Card */}
                                        {cards.map((card) => (
                                            <div key={card.name} className="overflow-hidden rounded-lg bg-white shadow">
                                                <div className="p-5">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0">
                                                            <card.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                                                        </div>
                                                        <div className="ml-5 w-0 flex-1">
                                                            <dl>
                                                                <dt className="truncate text-sm font-medium text-gray-500">{card.name}</dt>
                                                                <dd>
                                                                    <div className="text-lg font-medium text-gray-900">{card.amount}</div>

                                                                </dd>
                                                            </dl>
                                                        </div>
                                                        <div className='mt-4 text-sm'>
                                                            <Badge color={changeColor(card.change)} text={`${card.change}%`} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 px-5 py-3">
                                                    <div className="text-sm">
                                                        <a href={card.href} className="font-medium text-cyan-700 hover:text-cyan-900">
                                                            View all
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <h2 className="mx-auto mt-8 max-w-6xl px-4 text-lg font-medium leading-6 text-gray-900 sm:px-6 lg:px-8">
                                    Recent activity
                                </h2>

                                {/* Activity list (smallest breakpoint only) */}
                                <div className="shadow sm:hidden">
                                    <ul role="list" className="mt-2 divide-y divide-gray-200 overflow-hidden shadow sm:hidden">
                                        {transactions.map((transaction) => (
                                            <li key={transaction.id}>
                                                <a href={transaction.href} className="block bg-white px-4 py-4 hover:bg-gray-50">
                                                    <span className="flex items-center space-x-4">
                                                        <span className="flex flex-1 space-x-2 truncate">
                                                            <BanknotesIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                            <span className="flex flex-col truncate text-sm text-gray-500">
                                                                <span className="truncate">{transaction.name}</span>
                                                                <span>
                                                                    <span className="font-medium text-gray-900">{transaction.amount}</span>{' '}
                                                                    {transaction.currency}
                                                                </span>
                                                                <time dateTime={transaction.datetime}>{transaction.date}</time>
                                                            </span>
                                                        </span>
                                                        <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                                    </span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>

                                    <nav
                                        className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3"
                                        aria-label="Pagination"
                                    >
                                        <div className="flex flex-1 justify-between">
                                            <a
                                                href="#"
                                                className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                            >
                                                Previous
                                            </a>
                                            <a
                                                href="#"
                                                className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                            >
                                                Next
                                            </a>
                                        </div>
                                    </nav>
                                </div>

                                {/* Activity table (small breakpoint and up) */}
                                <div className="hidden sm:block">
                                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                                        <div className="mt-2 flex flex-col">
                                            <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead>
                                                        <tr>
                                                            <th
                                                                className="bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900"
                                                                scope="col"
                                                            >
                                                                Transaction
                                                            </th>
                                                            <th
                                                                className="bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900"
                                                                scope="col"
                                                            >
                                                                Amount
                                                            </th>
                                                            <th
                                                                className="hidden bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900 md:block"
                                                                scope="col"
                                                            >
                                                                Status
                                                            </th>
                                                            <th
                                                                className="bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900"
                                                                scope="col"
                                                            >
                                                                Date
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200 bg-white">
                                                        {transactions.map((transaction) => (
                                                            <tr key={transaction.id} className="bg-white">
                                                                <td className="w-full max-w-0 whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                                    <div className="flex">
                                                                        <a href={transaction.href} className="group inline-flex space-x-2 truncate text-sm">
                                                                            <BanknotesIcon
                                                                                className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                                                                aria-hidden="true"
                                                                            />
                                                                            <p className="truncate text-gray-500 group-hover:text-gray-900">
                                                                                {transaction.name}
                                                                            </p>
                                                                        </a>
                                                                    </div>
                                                                </td>
                                                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                                                                    <span className="font-medium text-gray-900">{transaction.amount}</span>
                                                                    {transaction.currency}
                                                                </td>
                                                                <td className="hidden whitespace-nowrap px-6 py-4 text-sm text-gray-500 md:block">

                                                                    <div className="text-sm">
                                                                        <Badge color="green" text={transaction.status} />
                                                                    </div>
                                                                </td>
                                                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                                                                    <time dateTime={transaction.datetime}>{transaction.date}</time>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                {/* Pagination */}
                                                <nav
                                                    className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
                                                    aria-label="Pagination"
                                                >
                                                    <div className="hidden sm:block">
                                                        <p className="text-sm text-gray-700">
                                                            Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                                                            <span className="font-medium">20</span> results
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-1 justify-between gap-x-3 sm:justify-end">
                                                        <a
                                                            href="#"
                                                            className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                                                        >
                                                            Previous
                                                        </a>
                                                        <a
                                                            href="#"
                                                            className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                                                        >
                                                            Next
                                                        </a>
                                                    </div>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main></div>
                    </main>
                </div>
            </div>
        </>
    )
}