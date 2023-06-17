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
    UserCircle,
    LogOut,
    MoreHorizontal,
    Edit,
    Settings2,
} from 'lucide-react'

import {
    ChevronDownIcon,
} from '@heroicons/react/20/solid'

import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient'
import logo from "@/public/logo.svg"
import Image from 'next/image'
const { v4: uuidv4 } = require('uuid');
import toast, { Toaster } from 'react-hot-toast';


const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: WindowIcon, current: false },
    { name: 'Products', href: '/products', icon: Square3Stack3DIcon, current: true },
    { name: 'Subscriptions', href: '/subscriptions', icon: CurrencyDollarIcon, current: false },
]



let products = [];


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


export default function Products() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [shouldRender, setShouldRender] = useState(false);
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [loaded, setLoaded] = useState(false);
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [currentID, setCurrentID] = useState('');

    const handleProductNameChange = (e) => {
        setProductName(e.target.value);
    };

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
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
                    .from('checkout')
                    .select('*')
                    .eq('merchant_id', user.data.user.id);
                if (error) {
                    throw error;
                } else {
                    if (data) {
                        products = [];
                        for (let i = 0; i < data.length; i++) {
                            products.push({
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

    const addProduct = async (product_name, price) => {
        const user = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from('checkout')
            .insert({
                id: (uuidv4().split('-')).pop(),
                merchant_id: user.data.user.id,
                product_name: product_name,
                price_in_usd: price,
            });
        if (error) {
            toast.error(error.message);
        } else {
            toast.success(`Product ${product_name} added`);
            router.reload();
        }
    };

    const updateProduct = async (id, name, price) => {
        const { data, error } = await supabase
            .from('checkout')
            .update({
                product_name: name,
                price_in_usd: price
            })
            .eq('id', id);
        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Product updated');
            router.reload();
        }
    };

    const deleteProduct = async (id) => {
        const { data, error } = await supabase
            .from('checkout')
            .delete()
            .eq('id', id);
        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Product deleted');
            router.reload();
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
                <title>Products | Blockpay</title>
                {/* Add product */}
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
                                                            <h2 className='my-4 font-medium'>Product Details</h2>
                                                            <div>
                                                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-zinc-300">
                                                                    Product name
                                                                </label>
                                                                <div className="mt-2">
                                                                    <input
                                                                        type="text"
                                                                        name="name"
                                                                        id="Name"
                                                                        className="pl-2.5 block w-full rounded-md border lg:border-0 py-1.5 text-zinc-300 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                        placeholder="Name"
                                                                        required
                                                                        value={productName}
                                                                        onChange={handleProductNameChange}
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
                                                                    className="block w-full rounded-md border lg:border-0 py-1.5 pl-7 pr-12 text-zinc-300 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                                                    </div>
                                                    <div className="flex">
                                                        <button
                                                            type="button"
                                                            className="flex-1 rounded-md bg-white/80 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                                                            onClick={async () => {
                                                                await addProduct(productName, price);
                                                                setOpen(false);
                                                            }}
                                                        >
                                                            Add product
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

                {/* Edit product*/}
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
                                                            <h2 className='my-4 font-medium'>Product Details</h2>
                                                            <div>
                                                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-zinc-300">
                                                                    Product name
                                                                </label>
                                                                <div className="mt-2">
                                                                    <input
                                                                        type="text"
                                                                        name="name"
                                                                        id="Name"
                                                                        className="pl-2.5 block w-full rounded-md border lg:border-0 py-1.5 text-zinc-300 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                        placeholder={productName}
                                                                        required
                                                                        value={productName}
                                                                        onChange={handleProductNameChange}
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
                                                                    className="block w-full rounded-md border lg:border-0 py-1.5 pl-7 pr-12 text-zinc-300 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                    placeholder={price}
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
                                                    </div>
                                                    <div className="flex justify-between space-x-2">
                                                        <button
                                                            type="button"
                                                            className="flex-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                            onClick={async () => {
                                                                await updateProduct(currentID, productName, price);
                                                                setOpenEdit(false);
                                                            }}
                                                        >
                                                            Update product
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                                            onClick={async () => {
                                                                await deleteProduct(currentID);
                                                                setOpenEdit(false);
                                                            }}
                                                        >
                                                            Delete product
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
                                                                            ? 'bg-gray-50 text-indigo-600'
                                                                            : 'text-zinc-300 hover:text-indigo-600 hover:bg-gray-50',
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
                                                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-zinc-300 hover:bg-gray-50 hover:text-indigo-600"
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
                                className="-m-2.5 p-2.5 text-zinc-300 lg:hidden"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <span className="sr-only">Open sidebar</span>
                                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                            </button>

                            {/* Separator */}
                            <div className="h-6 w-px bg-gray-500/30 lg:hidden" aria-hidden="true" />
                        </div>
                    </div>

                    <main className="py-10 bg-[#0a0a0a] h-screen relative">
                        <div className="px-4 sm:px-6 lg:px-24">
                            <div className="sm:flex sm:items-center">
                                <div className="sm:flex-auto">
                                    <h1 className="text-base font-semibold leading-6 text-zinc-300">
                                        Products
                                    </h1>
                                    <p className="mt-2 text-sm text-zinc-300">
                                        A list of all the products in your account including their name, id, price and link.
                                    </p>
                                </div>
                                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                                    <button
                                        type="button"
                                        className="block rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-black shadow-sm hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                                        onClick={async () => {
                                            await addProduct(productName, price);
                                            setOpen(true)
                                        }}
                                    >
                                        Add product
                                    </button>
                                </div>
                            </div>
                            <div className="mt-8 flow-root">
                                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                        <div className="border border-gray-500/30 rounded-lg overflow-hidden">
                                            <table className="min-w-full divide-y divide-gray-500/30 text-gray-200 bg-gray-900 rounded-md">
                                                <thead className="bg-[#18191E]">
                                                    <tr>
                                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-300 sm:pl-6">
                                                            Product Name
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
                                                <tbody className="bg-[#0a0a0a] divide-y divide-gray-500/30">
                                                    {loaded && products.map((product) => (
                                                        <tr key={product.id}>
                                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-zinc-300 sm:pl-6">
                                                                {product.name}
                                                            </td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-300 font-mono">{product.id_hash}</td>
                                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-300 font-medium">
                                                                <span className='text-zinc-300'>
                                                                    $
                                                                </span>
                                                                {product.price}
                                                                <span className='text-zinc-300'>
                                                                    USD
                                                                </span>
                                                            </td>
                                                            <button
                                                                className="font-mono whitespace-nowrap px-3 py-4 text-sm text-zinc-300 hover:underline hover:cursor-pointer"
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(`http://localhost:3000/c/${product.id_hash}`);
                                                                    toast.success('Copied link to clipboard!');
                                                                }}
                                                            >
                                                                localhost:3000/c/{product.id_hash}
                                                            </button>
                                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                                <button
                                                                    className="text-white/80 hover:text-white/90 flex items-center"
                                                                    onClick={() => {
                                                                        setCurrentID(product.id_hash);
                                                                        setProductName(product.name);
                                                                        setPrice(product.price);
                                                                        setOpenEdit(true);
                                                                    }}
                                                                >
                                                                    Edit <Edit className='ml-1 w-4 h-4' aria-hidden="true" />
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