import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { useState, useEffect } from 'react'
import {
    Category,
    RssChannel,
    RssItem,
    ChannelOption,
    ChannelsResponse,
    ItemsResponse,
    UnreadCount,
    MarkAsReadResponse,
} from '@/api/types'
import { default as APIContext, BackendAPI } from '@/api/context'

function Provider(props: { children: any }) {
    const [isLoading, setLoading] = useState<boolean>(false)
    const [unreadCount, setUnreadCount] = useState<UnreadCount>({})
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
            return new Promise<MarkAsReadResponse>((resolver) => {
                setMarkAsRead({ item, resolver })
            })
        },
        channels() {
            return new Promise<ChannelsResponse>((resolver) => {
                setAPICall({ resolver, api: () => BackendAPI.channels() })
            })
        },
        items(id: string) {
            return new Promise<ItemsResponse>((resolver) => {
                setAPICall({ resolver, api: () => BackendAPI.items(id) })
            })
        },
        channel(id: string, upto: string) {
            return new Promise<RssChannel>((resolver) => {
                setAPICall({
                    resolver,
                    api: () => BackendAPI.channel(id, upto),
                })
            })
        },
        updateChannel(id: string, option: ChannelOption) {
            return new Promise<RssChannel[]>((resolver) => {
                setAPICall({
                    resolver,
                    api: () => BackendAPI.updateChannel(id, option),
                })
            })
        },
        createCategory(title: string): Promise<Category[]> {
            return new Promise<Category[]>((resolver) => {
                setAPICall({
                    resolver,
                    api: () => BackendAPI.createCategory(title),
                })
            })
        },
        updateCategory(id: string, title: string) {
            return new Promise<Category[]>((resolver) => {
                setAPICall({
                    resolver,
                    api: () => BackendAPI.updateCategory(id, title),
                })
            })
        },
        removeCategory(id: string) {
            return new Promise<Category[]>((resolver) => {
                setAPICall({
                    resolver,
                    api: () => BackendAPI.removeCategory(id),
                })
            })
        },

        categories() {
            return new Promise<Category[]>((resolver) => {
                setAPICall({
                    resolver,
                    api: () => BackendAPI.categories(),
                })
            })
        },
        canMarkAsRead,
        setCanMarkAsRead,
        isLoading,
        unreadCount,
        setUnreadCount,
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
        console.log('Start API Request')
        api()
            .then(resolver)
            .then(() => {
                setLoading(false)
                console.log('End API Request')
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
