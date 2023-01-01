import Head from 'next/head'
import { useState, useEffect } from 'react'
import { default as fetchChannel, RssChannel } from '@/api/channels'
import ItemSummary from '@/components/itemSummary'
import ChannelSummary from '@/components/channelSummary'

type State = {
    channels: RssChannel[]
    selectedChannel: RssChannel
}

export default function Home() {
    const [data, setData] = useState<State | null>(null)
    const [isLoading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        setLoading(true)
        fetchChannel().then((channels) => {
            if (channels.length > 0) {
                setData({ channels, selectedChannel: channels[0] })
            }
            setLoading(false)
        })
    }, [])

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
                <h1 className="text-xl">Ultraladder</h1>
                <div className="flex space-x-2">
                    <div className="w-64 flex-none border-r-[1px] h-screenoverflow-auto">
                        {data.channels.map((channel) => (
                            <ChannelSummary
                                channel={channel}
                                selected={data.selectedChannel.id == channel.id}
                                onClick={(channel) =>
                                    setData({
                                        ...data,
                                        selectedChannel: channel,
                                    })
                                }
                            />
                        ))}
                    </div>
                    <div className="m-w-3xl overflow-scroll">
                        <h2 className="text-2xl">
                            {data.selectedChannel.title}
                        </h2>
                        <div className="space-y-10 h-full">
                            {data.selectedChannel.items.map((item) => (
                                <ItemSummary item={item} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
