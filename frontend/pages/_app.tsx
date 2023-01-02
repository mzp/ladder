import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { useContext, useState, useEffect, useRef } from 'react'
import { RssChannel, RssItem } from '@/api/types'
import { default as APIContext, BackendAPI } from '@/api/context'

function Provider(props : { children: any }) {
    const [channels, setChannels] = useState<RssChannel[]>([])
    const [selected, setSelected] = useState<RssChannel | null>(null)
    const [isLoading, setLoading] = useState<boolean>(false)
    const [markAsRead, setMarkAsRead] = useState<{
        item: RssItem
        resolver: any
    } | null>()
    const [canMarkAsRead, setCanMarkAsRead] = useState<boolean>(false)
    const [channelsAPI, setChannelsAPI] = useState<{
        id: string
        resolver: any
    }>()

    const [channelAPI, setChannelAPI] = useState<{
        id: string
        upto: string
        resolver: any
    } | null>()
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
        canMarkAsRead,
        setCanMarkAsRead,
        isLoading,
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

    return (
        <APIContext.Provider value={ContextAPI}>
            {props.children}
        </APIContext.Provider>
    )
}

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Provider>
            <Component {...pageProps} />
        </Provider>
    )
}
