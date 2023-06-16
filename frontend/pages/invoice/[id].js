import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/router'
import { Fragment } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
    Bars3Icon,
    CalendarDaysIcon,
    EllipsisVerticalIcon,
    UserCircleIcon,
    XMarkIcon as XMarkIconMini,
} from '@heroicons/react/20/solid'
import {
    BellIcon,
    XMarkIcon as XMarkIconOutline,
    DocumentTextIcon,
} from '@heroicons/react/24/outline'
import logo from "@/public/logo.svg"
import Image from 'next/image'
import Badge from '@/components/Badge';
import UTC from '@/components/UTC';

const navigation = [
    { name: 'Home', href: '/' },

]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
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

function convertTimestamp(timestamp) {
    var date = new Date(timestamp);
    var year = date.getFullYear();
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var month = months[date.getMonth()];
    var day = "0" + date.getDate();

    return `${month} ${day.substr(-2)}, ${year}`;
}


const Invoice = ({ invoice }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        const channel = supabase
            .channel('table-db-changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'invoices',
                },
                (payload) => {
                    if (payload.new.id === invoice.id) {
                        router.reload();
                    }
                }
            )
            .subscribe()
        return () => {
            channel.unsubscribe()
        }
    }, [invoice.id]);

    async function handleNotSignedIn() {
        const user = await supabase.auth.getUser();
        if (!user.data.user) {
            router.push('/login');
        }
        return user.data.user;
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
        return <div className="bg-[#0a0a0a]"></div>;
    }

    return (
        <>
            <header className="absolute inset-x-0 top-0 z-50 flex h-16 border-b border-gray-900/10">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-1 items-center gap-x-6">
                        <button type="button" className="-m-3 p-3 md:hidden" onClick={() => setMobileMenuOpen(true)}>
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon className="h-5 w-5 text-gray-900" aria-hidden="true" />
                        </button>
                        <Image
                            src={logo}
                            height={8}
                            width={8}
                            alt="Logo"
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
                    </div>
                </div>
                <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                    <div className="fixed inset-0 z-50" />
                    <Dialog.Panel className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white px-4 pb-6 sm:max-w-sm sm:px-6 sm:ring-1 sm:ring-gray-900/10">
                        <div className="-ml-0.5 flex h-16 items-center gap-x-6">
                            <button type="button" className="-m-2.5 p-2.5 text-gray-700" onClick={() => setMobileMenuOpen(false)}>
                                <span className="sr-only">Close menu</span>
                                <XMarkIconOutline className="h-6 w-6" aria-hidden="true" />
                            </button>
                            <div className="-ml-0.5">
                                <a href="#" className="-m-1.5 block p-1.5">
                                    <span className="sr-only">Your Company</span>
                                    <Image
                                        src={logo}
                                        height={8}
                                        width={8}
                                        alt="Logo"
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

            <main>
                <header className="relative isolate pt-16">
                    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
                        <div className="absolute left-16 top-full -mt-16 transform-gpu opacity-50 blur-3xl xl:left-1/2 xl:-ml-80">
                            <div
                                className="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-[#FF80B5] to-[#9089FC]"
                                style={{
                                    clipPath:
                                        'polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)',
                                }}
                            />
                        </div>
                        <div className="absolute inset-x-0 bottom-0 h-px bg-gray-900/5" />
                    </div>

                    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                        <div className="mx-auto flex max-w-2xl items-center justify-between gap-x-8 lg:mx-0 lg:max-w-none">
                            <div className="flex items-center gap-x-6">
                                <DocumentTextIcon
                                    className="h-16 w-16 flex-none py-3.5 text-gray-700 rounded-full ring-1 ring-gray-900/10"
                                />
                                <h1>
                                    <div className="text-sm leading-6 font-medium text-gray-500">
                                        Invoice <span className="text-gray-700 font-mono">#{invoice.id}</span>
                                    </div>
                                    <div className="mt-1 text-base font-semibold leading-6 text-gray-900">{invoice.product_name}</div>
                                </h1>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                        {/* Invoice summary */}
                        <div className="lg:col-start-3 lg:row-end-1">
                            <h2 className="sr-only">Summary</h2>
                            <div className="rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
                                <dl className="flex flex-wrap">
                                    <div className="flex-auto pl-6 pt-6">
                                        <dt className="text-sm font-semibold leading-6 text-gray-900">Amount</dt>
                                        <dd className="mt-1 text-base font-semibold leading-6 text-gray-900">${invoice.price_in_usd}</dd>
                                    </div>
                                    <div className="flex-none self-end px-6 pt-4">
                                        <dt className="sr-only">Status</dt>
                                        <dd className="text-sm">
                                            <Badge color={changeStatus(invoice.status)} text={invoice.status} />
                                        </dd>
                                    </div>
                                    <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                                        <dt className="flex-none">
                                            <span className="sr-only">Client</span>
                                            <UserCircleIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
                                        </dt>
                                        <dd className="text-sm font-medium leading-6 text-gray-900">{invoice.customer_email}</dd>
                                    </div>
                                    <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                                        <dt className="flex-none">
                                            <span className="sr-only">Due date</span>
                                            <CalendarDaysIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
                                        </dt>
                                        <dd className="text-sm leading-6 text-gray-500">
                                            <div>{convertTimestamp(invoice.created_at)}</div>
                                        </dd>
                                    </div>
                                </dl>
                                <div className="mt-6 border-t border-gray-900/5 px-6 py-6">
                                    {/* <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                                        Download receipt <span aria-hidden="true">&rarr;</span>
                                    </a> */}
                                </div>
                            </div>
                        </div>

                        {/* Invoice */}
                        <div className="-mx-4 px-4 py-8 shadow-sm ring-1 ring-gray-900/5 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-16 xl:pb-20 xl:pt-16">
                            <h2 className="text-base font-semibold leading-6 text-gray-900">Invoice</h2>
                            <dl className="mt-6 grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
                                <div className="sm:pr-4">
                                    <dt className="inline text-gray-500">Issued on</dt>{' '}
                                    <dd className="inline text-gray-700">
                                        <time><UTC timestamp={invoice.created_at} /></time>
                                    </dd>
                                </div>
                                <div className="mt-2 sm:mt-0 sm:pl-4">
                                    <dt className="inline text-gray-500">Due on</dt>{' '}
                                    <dd className="inline text-gray-700">
                                        <time><UTC timestamp={invoice.created_at + 1800000} /></time>
                                    </dd>
                                </div>
                                <div className="mt-6 border-t border-gray-900/5 pt-6 sm:pr-4">
                                    <dt className="font-semibold text-gray-900">From</dt>
                                    <dd className="mt-2 text-gray-500">
                                        <span className="font-medium text-gray-900 font-mono">Customer Address</span>

                                    </dd>
                                </div>
                                <div className="mt-8 sm:mt-6 sm:border-t sm:border-gray-900/5 sm:pl-4 sm:pt-6">
                                    <dt className="font-semibold text-gray-900">To</dt>
                                    <dd className="mt-2 text-gray-500">
                                        <span className="font-medium text-gray-90- font-mono">{invoice.address.substring(0, 6)}...{invoice.address.substring(invoice.address.length - 5)}</span>
                                    </dd>
                                </div>
                            </dl>
                            <table className="mt-16 w-full whitespace-nowrap text-left text-sm leading-6">
                                <colgroup>
                                    <col className="w-full" />
                                    <col />
                                    <col />
                                    <col />
                                </colgroup>
                                <thead className="border-b border-gray-200 text-gray-900">
                                    <tr>
                                        <th scope="col" className="px-0 py-3 font-semibold">
                                            Product
                                        </th>
                                        <th scope="col" className="hidden py-3 pl-8 pr-0 text-right font-semibold sm:table-cell">
                                            Exchange Rate
                                        </th>
                                        <th scope="col" className="py-3 pl-8 pr-0 text-right font-semibold">
                                            Price
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>

                                    <tr className="border-b border-gray-100">
                                        <td className="max-w-0 px-0 py-5 align-top">
                                            <div className="truncate font-medium text-gray-900">
                                                {invoice.product_name}
                                            </div>
                                        </td>

                                        <td className="hidden py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-700 sm:table-cell">
                                            {invoice.exchange_rate}
                                        </td>
                                        <td className="py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-700">
                                            {invoice.price_in_usd}
                                        </td>
                                    </tr>

                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th scope="row" className="px-0 pb-0 pt-6 font-normal text-gray-700 sm:hidden">
                                            Subtotal
                                        </th>
                                        <th
                                            scope="row"
                                            colSpan={3}
                                            className="hidden px-0 pb-0 pt-6 text-right font-normal text-gray-700 sm:table-cell"
                                        >
                                            Subtotal
                                        </th>
                                        <td className="pb-0 pl-8 pr-0 pt-6 text-right tabular-nums text-gray-900">${invoice.price_in_usd}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row" className="pt-4 font-normal text-gray-700 sm:hidden">
                                            Tax
                                        </th>
                                        <th
                                            scope="row"
                                            colSpan={3}
                                            className="hidden pt-4 text-right font-normal text-gray-700 sm:table-cell"
                                        >
                                            Tax
                                        </th>
                                        <td className="pb-0 pl-8 pr-0 pt-4 text-right tabular-nums text-gray-900">$0</td>
                                    </tr>
                                    <tr>
                                        <th scope="row" className="pt-4 font-semibold text-gray-900 sm:hidden">
                                            Total
                                        </th>
                                        <th
                                            scope="row"
                                            colSpan={3}
                                            className="hidden pt-4 text-right font-semibold text-gray-900 sm:table-cell"
                                        >
                                            Total
                                        </th>
                                        <td className="pb-0 pl-8 pr-0 pt-4 text-right font-semibold tabular-nums text-gray-900">
                                            {invoice.price_in_usd}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Invoice;

export async function getServerSideProps({ params }) {
    const { id } = params;
    const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.log(error);
        return {
            notFound: true,
        };
    }

    return {
        props: {
            invoice: data,
        },
    };
}