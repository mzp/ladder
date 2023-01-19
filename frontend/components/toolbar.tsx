import Link from 'next/link'
import getConfig from 'next/config'
import { useContext } from 'react'
import APIContext from '@/api/context'

const {
    publicRuntimeConfig: { development },
} = getConfig()

function Spin() {
    return (
        <svg
            className="animate-spin h-3 w-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
    )
}

export default function Toolbar({
    className,
    children,
}: {
    className?: string
    children?: any
}) {
    const { isLoading } = useContext(APIContext)

    return (
        <div
            className={`w-full text-xl align-middle bg-white dark:bg-black px-2 ${className}`}
        >
            <div className="flex items-center">
                <h1 className="pr-2 flex-none">
                    <Link href="/">
                        Ultraladder {development ? '[dev]' : ''}
                    </Link>
                </h1>
                <div className="flex-auto  text-black dark:text-white">
                    {isLoading && <Spin />}
                </div>
                {children}
            </div>
        </div>
    )
}
