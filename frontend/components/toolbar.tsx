import Link from 'next/link'
import Spin from '@/components/spin'
import Cog from '@/components/cog'
import DropMenu from '@/components/dropMenu'
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
                <DropMenu icon={<Cog />} width={150}>
                    <Link className="hover:text-sky-400" href="/settings/feeds">
                        Settings
                    </Link>

                    <a
                        className="hover:text-sky-400"
                        href={`${publicRuntimeConfig.apiRoot}/sidekiq`}
                    >
                        Job Monitor
                    </a>
                </DropMenu>
            </div>
        </div>
    )
}
