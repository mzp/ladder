import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { RssChannel, RssItem } from '@/api/types'
import { default as APIContext, BackendAPI } from '@/api/context'
import fetchChannels from '@/api/channels'
import ItemList from '@/components/itemList'
import Spin from '@/components/spin'
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
    const [markAsRead, setMarkAsRead] = useState<{ item: RssItem, resolver: any } | null>()
    const [canMarkAsRead, setCanMarkAsRead] = useState<boolean>(false)
    const ref = useRef<HTMLDivElement>(null)

    const ContextAPI = {
        markAsRead(item: RssItem) {
	    return new Promise<string | null>((resolver) => {
	      setMarkAsRead({ item, resolver })
	    })
        },
    }
    useEffect(() => {
       if(!canMarkAsRead) { return }
       if(!markAsRead) { return }
       const {item, resolver} = markAsRead;
       console.log(item.title)

       setLoading(true)
       BackendAPI.markAsRead(item)
           .then(resolver)
	   .then(() => setLoading(false))
    }, [markAsRead, canMarkAsRead])

    useEffect(() => {
        setLoading(true)
        fetchChannels().then((channels) => {
            if (channels.length > 0) {
                setChannels(channels)
            }
	    setLoading(false)
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
                <APIContext.Provider value={ContextAPI}>
                    <div className="flex h-screen">
                        <div className="w-64 flex-none border-r-[1px] overflow-scroll scroll-pt-14 snap-y scroll-pt-8">
                            <div className="text-xl fixed h-8 align-middle bg-white w-full px-2">
                                <div className="flex items-center">
                                    <h1 className="pr-2">Ultraladder</h1>
                                    {isLoading && <Spin />}
                                </div>
                            </div>
                            {channels.length && (
                                <ChannelList
                                    className="mt-8"
                                    channels={channels}
                                    onSelect={(channel) => {
                                        setSelected(channel)
                                        if (ref.current) {
                                            ref.current.scrollTo(0, 0)
                                        }
                                    }}
                                />
                            )}
                        </div>
                        <div
                            className="m-w-3xl overflow-scroll snap-y snap-mandatory scroll-pt-14"
			    onScroll={canMarkAsRead ? undefined : () => { 
			        ref.current && setCanMarkAsRead(ref.current.scrollTop > 100) 
			    }}
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
                </APIContext.Provider>
            </main>
        </>
    )
}
