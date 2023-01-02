import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { useState, useEffect } from 'react'
import { RssChannel, RssItem, ChannelOption } from '@/api/types'
import { default as APIContext, BackendAPI } from '@/api/context'

function Provider(props: { children: any }) {
    const [isLoading, setLoading] = useState<boolean>(false)
    const [markAsRead, setMarkAsRead] = useState<{
        item: RssItem
        resolver: any
    } | null>()
    const [canMarkAsRead, setCanMarkAsRead] = useState<boolean>(false)
    const [apiCall, setAPICall] = useState<{
        api: () => any
        resolver: any
    }>()

    const ContextAPI = {
        markAsRead(item: RssItem) {
            return new Promise<string | null>((resolver) => {
                setMarkAsRead({ item, resolver })
            })
        },
        channels(id: string) {
            return new Promise<RssChannel[]>((resolver) => {
                setAPICall({ resolver, api: () => BackendAPI.channels(id) })
            })
        },
        channel(id: string, upto: string) {
            return new Promise<RssChannel[]>((resolver) => {
                setAPICall({
                    resolver,
                    api: () => BackendAPI.channel(id, upto),
                })
            })
        },
        updateChannel(id: string, option: ChannelOption) {
            return new Promise<void>((resolver) => {
                setAPICall({
                    resolver,
                    api: () => BackendAPI.updateChannel(id, option),
                })
            })
        },
        createCategory(title: string): Promise<Category[]> {
            return new Promise<void>((resolver) => {
                setAPICall({
                    resolver,
                    api: () => BackendAPI.createCategory(title),
                })
            })
        },
        categories(): Promise<Category[]> {
            return new Promise<void>((resolver) => {
                setAPICall({
                    resolver,
                    api: () => BackendAPI.categories(),
                })
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
        if (!apiCall) {
            return
        }
        const { resolver, api } = apiCall
        setLoading(true)
        api()
            .then(resolver)
            .then(() => {
                console.log('done')
                setLoading(false)
            })
    }, [apiCall])

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
