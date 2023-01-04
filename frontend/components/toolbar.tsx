import Link from 'next/link'
import DropMenu from '@/components/dropMenu'
import { useContext, useState, useEffect } from 'react'
import APIContext from '@/api/context'
import useLocalStorage from '@/components/hook/useLocalStorage'
import getConfig from 'next/config'

function Spin() {
    return (
        <svg
            className="animate-spin h-3 w-3 text-black"
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

function Cog() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
            />
        </svg>
    )
}

const { publicRuntimeConfig } = getConfig()

export default function Toolbar({ className }: { className?: string }) {
    const { isLoading } = useContext(APIContext)

    return (
        <div
            className={`w-full text-xl align-middle bg-white px-2 ${className}`}
        >
            <div className="flex items-center">
                <h1 className="pr-2 flex-none">
                    <Link href="/">Ultraladder</Link>
                </h1>
                <div className="flex-auto">{isLoading && <Spin />}</div>
                <DropMenu icon={<Cog />} width={150}>
                    <Link className="hover:text-sky-400" href="/settings/feeds">
                        Settings
                    </Link>
                    <a
                        className="hover:text-sky-400"
                        href={`${publicRuntimeConfig.apiRoot}/sidekiq`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Job Monitor
                    </a>
                </DropMenu>
            </div>
        </div>
    )
}
