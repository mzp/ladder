import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { RssChannel, RssItem } from '@/api/types'
import { default as APIContext, BackendAPI } from '@/api/context'
import fetchChannels from '@/api/channels'
import ItemList from '@/components/itemList'
import Toolbar from '@/components/toolbar'
import ChannelList from '@/components/channelList'
import ChannelSummary from '@/components/channelSummary'
import useLocalStorage from '@/components/hook/useLocalStorage'

type State = {
    channels: RssChannel[]
    selectedChannel: RssChannel
}

export default function Home() {
    const [channels, setChannels] = useState<RssChannel[]>([])
    const [selected, setSelected] = useState<RssChannel | null>(null)
    const [isLoading, setLoading] = useState<boolean>(false)
    const [markAsRead, setMarkAsRead] = useState<{
        item: RssItem
        resolver: any
    } | null>()
    const [canMarkAsRead, setCanMarkAsRead] = useState<boolean>(false)
    const [channelsAPI, setChannelsAPI] = useState<{ id: string, resolver: any}>()

    const [channelAPI, setChannelAPI] = useState<{
        id: string
        upto: string
        resolver: any
    } | null>()
    const [fetchInitalChannel, storeInitialChannel] =
        useLocalStorage('initial-channel-id')

    const ref = useRef<HTMLDivElement>(null)

    const ContextAPI = {
        markAsRead(item: RssItem) {
            return new Promise<string | null>((resolver) => {
                setMarkAsRead({ item, resolver })
            })
        },
	channels(id: string) {
	    return new Promise<RssChannel[]>((resolver) => {
	        setChannelsAPI({ id, resolver })
	    })
	},
        channel(id: string, upto: string) {
            return new Promise<RssChannel>((resolver) => {
                setChannelAPI({ id, upto, resolver })
            })
        },
    }
    useEffect(() => {
        if (!canMarkAsRead) {
            return
        }
        if (!markAsRead) {
            return
        }
        const { item, resolver } = markAsRead

        setLoading(true)
        BackendAPI.markAsRead(item)
            .then(resolver)
            .then(() => setLoading(false))
    }, [markAsRead, canMarkAsRead])

    useEffect(() => {
        if (!channelAPI) {
            return
        }
        const { id, upto, resolver } = channelAPI
        setLoading(true)
        BackendAPI.channel(id, upto)
            .then(resolver)
            .then(() => setLoading(false))
    }, [channelAPI])

    useEffect(() => {
        if (!channelsAPI) {
            return
        }
        const { id, resolver } = channelsAPI
        setLoading(true)
        BackendAPI.channels(id)
            .then(resolver)
            .then(() => setLoading(false))
    }, [channelsAPI])

    useEffect(() => {
        ContextAPI.channels(fetchInitalChannel()).then((channels) => { 
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
                <APIContext.Provider value={ContextAPI}>
                    <div className="flex h-screen">
                        <div className="w-64 flex-none border-r-[1px] overflow-scroll snap-y scroll-pt-16">
			    <Toolbar isLoading={isLoading} />
                            {channels.length && (
                                <ChannelList
                                    className="mt-16"
                                    channels={channels}
                                    onSelect={(channel) => {
                                        console.log(channel)
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
                                canMarkAsRead
                                    ? undefined
                                    : () => {
                                          ref.current &&
                                              setCanMarkAsRead(
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
                </APIContext.Provider>
            </main>
        </>
    )
}
