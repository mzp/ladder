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
                <div className="flex h-screen">
                    <div className="w-64 flex-none border-r-[1px] overflow-scroll">
		        <h1 className="text-xl m-2">Ultraladder</h1>
                        {data.channels.map((channel) => (
                            <ChannelSummary
			        key={channel.id}
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
                    <div className="m-w-3xl overflow-scroll snap-y snap-mandatory scroll-pt-16">
                        <h2 className="text-2xl backdrop-blur-sm w-full bg-slate-200/90 p-1 border-b-[1px] border-slate-200 snap-start fixed h-16">
                            {data.selectedChannel.title}
                        </h2>
			<div className="space-y-4">
                            {data.selectedChannel.items.map((item) => (
                                <ItemSummary key={item.id} item={item} className="snap-start first:pt-16"/>
                            ))}
			</div>
                    </div>
                </div>
            </main>
        </>
    )
}
