import Head from 'next/head'
import { RssItem } from '@/api/channels'
import markAsRead from '@/api/markAsRead'
import { useState, useEffect, useRef } from 'react'
import { default as fetchChannel, RssChannel } from '@/api/channels'
import ItemSummary from '@/components/itemSummary'
import ChannelEntry from '@/components/channelEntry'
import ChannelSummary from '@/components/channelSummary'

type State = {
    channels: RssChannel[]
    selectedChannel: RssChannel
}

export default function Home() {
    const [data, setData] = useState<State | null>(null)
    const [isLoading, setLoading] = useState<boolean>(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setLoading(true)
        fetchChannel().then((channels) => {
            if (channels.length > 0) {
                setData({ channels, selectedChannel: channels[0] })
            }
            setLoading(false)
        })
    }, [])

    const handleRead = (item: RssItem) => {
      console.log(item)
      markAsRead(item)
    }
    

    if (isLoading) return <p>Loading...</p>
    if (!data) return <p>No data</p>

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
                        <div className="mt-8">
                            {data.channels.map((channel) => (
                                <ChannelEntry
                                    key={channel.id}
                                    className="snap-start"
                                    channel={channel}
                                    selected={
                                        data.selectedChannel.id == channel.id
                                    }
                                    onClick={(channel) => {
                                        setData({
                                            ...data,
                                            selectedChannel: channel,
                                        })
                                        if (containerRef.current) {
                                            containerRef.current.scrollTo(0, 0)
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                    <div
                        className="m-w-3xl overflow-scroll snap-y snap-mandatory scroll-pt-14"
                        ref={containerRef}
                    >
                        <ChannelSummary
                            channel={data.selectedChannel}
                            className="snap-start fixed h-14 py-1 px-4"
                        />
                        <div className="space-y-4 mt-16">
                            {data.selectedChannel.items.map((item) => (
                                <ItemSummary
                                    key={item.id}
                                    item={item}
                                    className="snap-start px-4"
				    onRead={handleRead}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
