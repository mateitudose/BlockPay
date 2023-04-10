import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient'
import toast, { Toaster } from 'react-hot-toast';



export default function Test() {
    const [address, setAddress] = useState('');

    const handleFormSubmit = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .update({ eth_address: address })
            .match({ id: (await supabase.auth.getUser()).data.user.id })
        if (error) {
            toast.error(error.message)

        } else {
            toast.success('Your Ethereum address has been updated!')
        }
    }
    return (
        <div>
            <Toaster />
            <label htmlFor="email" className="mt-10 ml-10 block text-sm font-medium leading-6 text-gray-900">
                Your Ethereum Address
            </label>
            <div className="ml-10 mt-2">
                <input
                    type="text"
                    className="block w-1/2 rounded-lg border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="0x0000000000000000000000000000000000000000"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </div>
            <button
                type="button"
                className="ml-10 mt-4 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleFormSubmit}
            >
                Submit
            </button>
        </div>
    )
}
