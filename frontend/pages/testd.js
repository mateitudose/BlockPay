import Bitcoin from "@/public/Crypto/Bitcoin.svg"
import Image from "next/image"

const crypto = [


    {
        name: 'Bitcoin',
    },
    // More crypto...
]

export default function Example() {
    return (
        <button 
            className="m-10 inline-flex items-center justify-center bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
        >
            <Image
                src={Bitcoin}
                alt="Bitcoin"
                width={24} // Set the image width
                height={24} // Set the image height
                className="mr-2"
            />
            <span>Bitcoin</span>
        </button>
    )
}
