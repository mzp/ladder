import Head from 'next/head'
import { RssItem } from '@/api/channels'
import markAsRead from '@/api/markAsRead'
import { useState, useEffect, useRef } from 'react'
import { default as fetchChannel, RssChannel } from '@/api/channels'
import ItemList from '@/components/itemList'
import ChannelList from '@/components/channelList'
import ChannelSummary from '@/components/channelSummary'

type State = {
    channels: RssChannel[]
    selectedChannel: RssChannel
}

export default function Home() {
    const [channels, setChannels] = useState<RssChannel[]>([])
    const [selected, setSelected] = useState<RssChannel | null>(null)
    const [isLoading, setLoading] = useState<boolean>(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setLoading(true)
        fetchChannel().then((channels) => {
            if (channels.length > 0) {
                setChannels(channels)
            }
            setLoading(false)
        })
    }, [])

    if (isLoading) return <p>Loading...</p>
    if (channels.length == 0) return <p>No data</p>

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
                    <div className="w-64 flex-none border-r-[1px] overflow-scroll scroll-pt-14 snap-y scroll-pt-8">
                        <div className="text-xl fixed h-8 align-middle bg-white w-full px-2">
                            <h1>Ultraladder</h1>
                        </div>
                        <ChannelList
                            className="mt-8"
                            channels={channels}
                            onSelect={(channel) => {
                                setSelected(channel)
                                if (containerRef.current) {
                                    containerRef.current.scrollTo(0, 0)
                                }
                            }}
                        />
                    </div>
                    <div
                        className="m-w-3xl overflow-scroll snap-y snap-mandatory scroll-pt-14"
                        ref={containerRef}
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
