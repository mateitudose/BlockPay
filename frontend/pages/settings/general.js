import { useState, Fragment, useEffect } from 'react'
import { Dialog, Transition, Menu } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/20/solid'
import {
    UserCircleIcon,
    XMarkIcon,
    ChevronDownIcon,
    Cog8ToothIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabaseClient';

import BitcoinIcon from '@/components/BitcoinIcon';

import logo from '@/public/logo.svg'
import Image from 'next/image'
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';



const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Products', href: '/products' },
    { name: 'Subscriptions', href: '/subscriptions' },
]

const secondaryNavigation = [
    { name: 'General', href: '/settings/general', icon: UserCircleIcon, current: true },
    { name: 'Crypto', href: '/settings/crypto', icon: BitcoinIcon, current: false },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function General() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [username, setUsername] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [email, setEmail] = useState('');
    const [shouldRender, setShouldRender] = useState(false);
    const router = useRouter();


    const handleUsernameChange = (e) => {
        setNewUsername(e.target.value);
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
                console.log(username);

            } catch (error) {
                console.error(error);
            }
        };
        getUser();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        const user = await supabase.auth.getUser();
        if (newUsername !== '') {
            const { data, error } = await supabase
                .from('profiles')
                .update({
                    username: newUsername,
                })
                .eq('id', user.data.user.id);
            if (error) {
                toast.error(error.message);
            } else {
                toast.success('Username updated successfully!');
                setUsername(newUsername);
            }
        }
    };

    if (!shouldRender) {
        return <div></div>;
    }


    return (
        <>
            <Toaster position="top-right"
                reverseOrder={false} />
            <title>Settings - General | Blockpay</title>
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
                    <div className="space-y-10 divide-y divide-gray-900/10">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
                            <div className="px-4 sm:px-0">
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">
                                    This information will be stored in our database
                                </p>
                            </div>

                            <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                                <div className="px-4 py-6 sm:p-8">
                                    <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                        <div className="sm:col-span-4">
                                            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                                                Username
                                            </label>
                                            <div className="mt-2">
                                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                    <input
                                                        type="text"
                                                        name="username"
                                                        id="username"
                                                        className="pl-2.5 block flex-1 border rounded-md bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                        placeholder={username ? username : 'blockpayuser'}
                                                        value={newUsername}
                                                        onChange={handleUsernameChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                                    <button
                                        type="submit"
                                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        onClick={(e) => handleSave(e)}
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
