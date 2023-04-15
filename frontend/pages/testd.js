
const people = [
    { id: 1, name: 'Bitcoin', imageUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=003' },
    { id: 2, name: 'Ethereum', imageUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=003' },
    { id: 3, name: 'Binance Coin', imageUrl: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.svg?v=003' },
    { id: 4, name: 'Cardano', imageUrl: 'https://cryptologos.cc/logos/cardano-ada-logo.svg?v=003' },
    { id: 5, name: 'Dogecoin', imageUrl: 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=003' },
    { id: 6, name: 'Polkadot', imageUrl: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.svg?v=003' },
    { id: 7, name: 'XRP', imageUrl: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=003' },
    { id: 8, name: 'Solana', imageUrl: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=003' },
    { id: 9, name: 'Tether', imageUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=003' },
    { id: 10, name: 'USD Coin', imageUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=003' }
];

import { useState } from 'react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Combobox } from '@headlessui/react'


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function CryptoCombobox() {
    const [query, setQuery] = useState('')
    const [selectedPerson, setSelectedPerson] = useState(null)

    const filteredPeople =
        query === ''
            ? people
            : people.filter((person) => {
                return person.name.toLowerCase().includes(query.toLowerCase())
            })

    return (
        <Combobox as="div" value={selectedPerson} onChange={setSelectedPerson}>
            <Combobox.Label className="block text-sm leading-6 text-gray-900">Select your token</Combobox.Label>
            <div className="relative mt-2">
                <Combobox.Input
                    className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(event) => setQuery(event.target.value)}
                    displayValue={(person) => person?.name}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </Combobox.Button>

                {filteredPeople.length > 0 && (
                    <Combobox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white text-gray-700 font-semibold text-sm py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredPeople.map((person) => (
                            <Combobox.Option
                                key={person.id}
                                value={person}
                                className={({ active }) =>
                                    classNames(
                                        'relative cursor-default select-none py-2 pl-3 pr-9',
                                        active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                    )
                                }
                            >
                                {({ active, selected }) => (
                                    <>
                                        <div className="flex items-center">
                                            <img src={person.imageUrl} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" />
                                            <span className={classNames('ml-3 truncate', selected && 'font-semibold')}>{person.name}</span>
                                        </div>

                                        {selected && (
                                            <span
                                                className={classNames(
                                                    'absolute inset-y-0 right-0 flex items-center pr-4',
                                                    active ? 'text-white' : 'text-indigo-600'
                                                )}
                                            >
                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                        )}
                                    </>
                                )}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                )}
            </div>
        </Combobox>

    )
}
