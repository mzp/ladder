import { useContext, useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { RssChannel, RssItem } from '@/api/types'
import { default as APIContext, BackendAPI } from '@/api/context'
import ItemList from '@/components/itemList'
import Toolbar from '@/components/toolbar'
import ChannelList from '@/components/channelList'
import ChannelSummary from '@/components/channelSummary'
import useLocalStorage from '@/components/hook/useLocalStorage'

export default function Home() {
    const [channels, setChannels] = useState<RssChannel[]>([])
    const [selected, setSelected] = useState<RssChannel | null>(null)
    const [fetchInitalChannel, storeInitialChannel] =
        useLocalStorage('initial-channel-id')
    const ref = useRef<HTMLDivElement>(null)

    const api = useContext(APIContext)
    useEffect(() => {
        api.items(fetchInitalChannel()).then(({ channels, unreadCount }) => {
            if (channels.length > 0) {
                setChannels(channels)
                api.setUnreadCount(unreadCount)
            }
        })
    }, [])

    return (
        <>
            <Head>
                <title>Ultraladder</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </Head>
            <main>
                <div className="flex h-screen">
                    <div className="w-80 flex-none border-r-[1px]">
                        <Toolbar className="h-8" />
                        {channels.length && (
                            <ChannelList
                                className="overflow-scroll snap-y"
                                channels={channels}
                                style={{ height: 'calc(100vh - 2rem)' }}
                                onSelect={(channel) => {
                                    setSelected(channel)
                                    storeInitialChannel(channel.id)
                                    if (ref.current) {
                                        ref.current.scrollTo(0, 0)
                                    }
                                }}
                            />
                        )}
                    </div>
                    <div
                        className="m-w-3xl"
                        onScroll={
                            api.canMarkAsRead
                                ? undefined
                                : () => {
                                      ref.current &&
                                          api.setCanMarkAsRead(
                                              ref.current.scrollTop > 100
                                          )
                                  }
                        }
                        ref={ref}
                    >
                        {selected ? (
                            <ChannelSummary
                                channel={selected}
                                className="snap-start h-14 py-1 px-4"
                            />
                        ) : null}
                        {selected ? (
                            <ItemList
                                channel={selected}
                                className="overflow-scroll snap-y snap-mandatory"
                                style={{ height: 'calc(100vh - 3.5rem)' }}
                                items={selected.items}
                            />
                        ) : null}
                    </div>
                </div>
            </main>
        </>
    )
}
