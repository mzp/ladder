import Link from 'next/link'
import Spin from '@/components/spin'
import Cog from '@/components/cog'
import { useContext, useState, useEffect } from 'react'
import APIContext from '@/api/context'

import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

export default function Toolbar({ className }: { className?: string }) {
    const api = useContext(APIContext)
    return (
        <div
            className={`w-full text-xl align-middle bg-white px-2 ${className}`}
        >
            <div className="flex items-center">
                <h1 className="pr-2 flex-none">
                    <Link href="/">Ultraladder</Link>
                </h1>
                <div className="flex-auto">{api.isLoading && <Spin />}</div>
                <div>
                    <div className="text-slate-400 hover:text-slate-600 peer">
                        <Cog />
                    </div>
                    <div
                        className="hidden text-sm peer-hover:flex hover:flex
		 w-[150px]
		 flex-col bg-white ring-1 ring-slate-900/5 shadow fixed -ml-[130px] p-2 rounded-lg space-y-2 -mt-2 z-10"
                    >
                        <Link
                            className="hover:text-sky-400"
                            href="/settings/feeds"
                        >
                            Settings
                        </Link>

                        <a
                            className="hover:text-sky-400"
                            href={`${publicRuntimeConfig.apiRoot}/sidekiq`}
                        >
                            Job Monitor
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
