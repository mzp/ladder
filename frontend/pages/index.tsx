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
        api.items(fetchInitalChannel()).then(({ channels }) => {
            if (channels.length > 0) {
                setChannels(channels)
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
                    <div className="w-80 flex-none border-r-[1px] overflow-scroll snap-y scroll-pt-8">
                        <Toolbar className="w-80 h-8 fixed border-r-[1px]" />
                        {channels.length && (
                            <ChannelList
                                className="mt-8"
                                channels={channels}
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
                        className="m-w-3xl overflow-scroll snap-y snap-mandatory scroll-pt-14"
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
                                className="snap-start fixed h-14 py-1 px-4"
                            />
                        ) : null}
                        {selected ? (
                            <ItemList
                                channel={selected}
                                className="mt-16"
                                items={selected.items}
                            />
                        ) : null}
                    </div>
                </div>
            </main>
        </>
    )
}
