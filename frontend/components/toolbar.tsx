import Link from 'next/link'
import Spin from '@/components/spin'
import Cog from '@/components/cog'
import DropMenu from '@/components/dropMenu'
import { useContext, useState, useEffect } from 'react'
import APIContext from '@/api/context'
import useLocalStorage from '@/components/hook/useLocalStorage'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

export default function Toolbar({ className }: { className?: string }) {
    const [fetchShowUnread, storeShowUnread] = useLocalStorage('show-unread')
    const [fetchShowNSFW, storeShowNSFW] = useLocalStorage('show-nsfw')
    const api = useContext(APIContext)

    useEffect(() => {
        const showUnread = fetchShowUnread() != 'false'
        console.log(`restored unread: ${showUnread}`)
        api.setShowUnread(showUnread)

        const showNSFW = fetchShowNSFW() != 'false'
        console.log(`restored nsfw: ${showNSFW}`)
        api.setShowNSFW(showNSFW)
    }, [])

    const handleToggleUnread = () => {
        const value = !api.showUnread
        api.setShowUnread(value)
        storeShowUnread(value)
    }
    const handleToggleNSFW = () => {
        const value = !api.showNSFW
        api.setShowNSFW(value)
        storeShowNSFW(value)
    }

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
                    <button
                        className="text-left hover:text-sky-400"
                        onClick={handleToggleUnread}
                    >
                        {api.showUnread ? 'Hide' : 'Show'} unread
                    </button>
                    <button
                        className="text-left hover:text-sky-400"
                        onClick={handleToggleNSFW}
                    >
                        {api.showNSFW ? 'Hide' : 'Show'} NSFW
                    </button>
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
