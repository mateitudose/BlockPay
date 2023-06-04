import { ChevronRightIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import iphone from "@/public/iphone.svg"
import { useRouter } from 'next/router'
export default function Landing() {
    const router = useRouter()
    return (
        <div className="min-h-screen relative isolate overflow-hidden bg-gray-950">
            <svg
                className="absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
                aria-hidden="true"
            >
                <defs>
                    <pattern
                        id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
                        width={200}
                        height={200}
                        x="50%"
                        y={-1}
                        patternUnits="userSpaceOnUse"
                    >
                        <path d="M.5 200V.5H200" fill="none" />
                    </pattern>
                </defs>
                <svg x="50%" y={-1} className="overflow-visible fill-gray-800/20">
                    <path
                        d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                        strokeWidth={0}
                    />
                </svg>
                <rect width="100%" height="100%" strokeWidth={0} fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)" />
            </svg>
            <div
                className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
                aria-hidden="true"
            >
                <div
                    className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-20"
                    style={{
                        clipPath:
                            'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
                    }}
                />
            </div>
            <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
                <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
                    <div className="mt-24 sm:mt-32 lg:mt-16">
                        <a href="/changelog" className="inline-flex space-x-6">
                            <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-semibold leading-6 text-green-400 ring-1 ring-inset ring-green-500/20">
                                What's new
                            </span>
                            <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-300">
                                <span>Just shipped v1.0</span>
                                <ChevronRightIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
                            </span>
                        </a>
                    </div>
                    <h1 className="mt-10 text-4xl font-bold tracking-tight bg-gradient-to-br from-white to-white/25 bg-clip-text text-transparent">
                        Unlock the Speed of Crypto
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-300/75">
                        Seamlessly Integrate with Your Store
                    </p>
                    <div className='mt-6 opacity-80 hover:opacity-100'>
                        <button
                            className="group animate-hero-text-slide-up-fade select-none items-center gap-2 text-sm font-semibold text-slate-100 outline-none hidden transition duration-200 ease-in-out hover:text-slate-200 focus:text-slate-200 sm:inline-flex"
                            type='button'
                            onClick={() => router.push('/signup')}
                        >

                            Press
                            <kbd className="inline-flex h-[22px] w-[22px] select-none items-center justify-center rounded text-sm uppercase bg-slate-100 text-black transition duration-200 ease-in-out group-hover:bg-slate-200 group-focus:bg-slate-200 group-focus:text-black">
                                S
                            </kbd>
                            to sign up
                        </button>
                    </div>
                </div>
                <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
                    <Image
                        src={iphone}
                        alt="App screenshot"
                        className="mx-auto w-[22.875rem] max-w-full drop-shadow-xl"
                    />
                </div>
            </div>
        </div>
    )
}
