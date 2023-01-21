import { createContext, useEffect, useState } from 'react'
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
import getConfig from 'next/config'

interface API {
    markAsRead(ids: string[]): Promise<MarkAsReadResponse>
    markAllAsRead(channel: RssChannel): Promise<{ unreadCount: UnreadCount }>
    channels(): Promise<ChannelsResponse>
    items(id?: string): Promise<ItemsResponse>
    channel(id: string, page: number, date: Date): Promise<RssChannel>
    newChannel(url: string): Promise<{ urls: string[] }>
    createChannel(url: string): Promise<RssChannel[]>
    removeChannel(id: string): Promise<RssChannel[]>
    updateChannel(id: string, option: ChannelOption): Promise<RssChannel[]>
    createCategory(title: string): Promise<Category[]>
    updateCategory(id: string, title: string): Promise<Category[]>
    removeCategory(id: string): Promise<Category[]>
    categories(): Promise<Category[]>
    isLoading: boolean
}

const {
    publicRuntimeConfig: { apiRoot },
} = getConfig()

console.log(`apiRoot: ${apiRoot}`)

export const BackendAPI: API = {
    markAsRead(ids: string[]) {
        return fetch(`${apiRoot}/items/markAsRead`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: ids }),
            credentials: 'include',
        }).then((res) => res.json())
    },
    markAllAsRead(channel: RssChannel) {
        return fetch(`${apiRoot}/channels/${channel.id}/markAllAsRead`, {
            method: 'POST',
            credentials: 'include',
        }).then((res) => res.json())
    },
    channels() {
        return fetch(`${apiRoot}/channels`, {
            credentials: 'include',
        }).then((res) => res.json())
    },
    items(initialSelectedID?: string) {
        return fetch(`${apiRoot}/items?initial=${initialSelectedID}`, {
            credentials: 'include',
        }).then((res) => res.json())
    },
    channel(id: string, page: number, date: Date) {
        return fetch(
            `${apiRoot}/channels/${id}?page=${page}&date=${date.toISOString()}`,
            {
                credentials: 'include',
            }
        ).then((res) => res.json())
    },
    updateChannel(id: string, option: ChannelOption) {
        return fetch(`${apiRoot}/channels/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(option),
            credentials: 'include',
        }).then((res) => res.json())
    },
    newChannel(url: string) {
        return fetch(`${apiRoot}/channels/new?url=${encodeURIComponent(url)}`, {
            method: 'GET',
            credentials: 'include',
        }).then((res) => res.json())
    },
    createChannel(url: string) {
        return fetch(`${apiRoot}/channels`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
            credentials: 'include',
        }).then((res) => res.json())
    },
    removeChannel(id: string) {
        return fetch(`${apiRoot}/channels/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        }).then((res) => res.json())
    },
    createCategory(title: string): Promise<Category[]> {
        return fetch(`${apiRoot}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title }),
            credentials: 'include',
        }).then((res) => res.json())
    },
    updateCategory(id: string, title: string): Promise<Category[]> {
        return fetch(`${apiRoot}/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title }),
            credentials: 'include',
        }).then((res) => res.json())
    },
    removeCategory(id: string): Promise<Category[]> {
        return fetch(`${apiRoot}/categories/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        }).then((res) => res.json())
    },
    categories(): Promise<Category[]> {
        return fetch(
            `${apiRoot}/categories`,

            { credentials: 'include' }
        ).then((res) => res.json())
    },
    isLoading: false,
}

const context = createContext<API>(BackendAPI)
export default context

export function APIProvider({ children }: { children: any }) {
    const [isLoading, setLoading] = useState<boolean>(false)
    const [apiCalls, setAPICalls] = useState<
        {
            api: Function
            args: any[]
            resolver: any
        }[]
    >([])
    const ContextAPI = {
        markAsRead(ids: string[]) {
            return new Promise<MarkAsReadResponse>((resolver) => {
                setAPICalls((calls) => [
                    ...calls,
                    {
                        resolver,
                        api: BackendAPI.markAsRead,
                        args: [ids],
                    },
                ])
            })
        },
        markAllAsRead(channel: RssChannel) {
            return new Promise<{ unreadCount: UnreadCount }>((resolver) => {
                setAPICalls((calls) => [
                    ...calls,
                    {
                        resolver,
                        api: BackendAPI.markAllAsRead,
                        args: [channel],
                    },
                ])
            })
        },
        channels() {
            return new Promise<ChannelsResponse>((resolver) => {
                setAPICalls((calls) => [
                    ...calls,
                    { resolver, api: BackendAPI.channels, args: [] },
                ])
            })
        },
        items(id: string) {
            return new Promise<ItemsResponse>((resolver) => {
                setAPICalls((calls) => [
                    ...calls,
                    { resolver, api: BackendAPI.items, args: [id] },
                ])
            })
        },
        channel(id: string, page: number, date: Date) {
            return new Promise<RssChannel>((resolver) => {
                setAPICalls((calls) => [
                    ...calls,
                    {
                        resolver,
                        api: BackendAPI.channel,
                        args: [id, page, date],
                    },
                ])
            })
        },
        newChannel(url: string) {
            return new Promise<{ urls: string[] }>((resolver) => {
                setAPICalls((calls) => [
                    ...calls,
                    {
                        resolver,
                        api: BackendAPI.newChannel,
                        args: [url],
                    },
                ])
            })
        },
        createChannel(url: string) {
            return new Promise<RssChannel[]>((resolver) => {
                setAPICalls((calls) => [
                    ...calls,
                    {
                        resolver,
                        api: BackendAPI.createChannel,
                        args: [url],
                    },
                ])
            })
        },
        removeChannel(id: string) {
            return new Promise<RssChannel[]>((resolver) => {
                setAPICalls((calls) => [
                    ...calls,
                    {
                        resolver,
                        api: BackendAPI.removeChannel,
                        args: [id],
                    },
                ])
            })
        },
        updateChannel(id: string, option: ChannelOption) {
            return new Promise<RssChannel[]>((resolver) => {
                setAPICalls((calls) => [
                    ...calls,
                    {
                        resolver,
                        api: BackendAPI.updateChannel,
                        args: [id, option],
                    },
                ])
            })
        },
        createCategory(title: string): Promise<Category[]> {
            return new Promise<Category[]>((resolver) => {
                setAPICalls((calls) => [
                    ...calls,
                    {
                        resolver,
                        api: BackendAPI.createCategory,
                        args: [title],
                    },
                ])
            })
        },
        updateCategory(id: string, title: string) {
            return new Promise<Category[]>((resolver) => {
                setAPICalls((calls) => [
                    ...calls,
                    {
                        resolver,
                        api: BackendAPI.updateCategory,
                        args: [id, title],
                    },
                ])
            })
        },
        removeCategory(id: string) {
            return new Promise<Category[]>((resolver) => {
                setAPICalls((calls) => [
                    ...calls,
                    {
                        resolver,
                        api: BackendAPI.removeCategory,
                        args: [id],
                    },
                ])
            })
        },

        categories() {
            return new Promise<Category[]>((resolver) => {
                setAPICalls((calls) => [
                    ...calls,
                    {
                        resolver,
                        api: BackendAPI.categories,
                        args: [],
                    },
                ])
            })
        },
        isLoading,
    }

    useEffect(() => {
        if (apiCalls.length == 0) {
            return
        }
        setLoading(true)
        ;(async () => {
            console.log(`Start API Request: ${apiCalls.length}`)
            for (const { resolver, api, args } of apiCalls) {
                console.log(`${api.name}(${args})`)
                const result = await api.apply(null, args)
                resolver(result)
            }
            console.log('End API Request')
            setLoading(false)
            setAPICalls([])
        })()
    }, [apiCalls])

    return <context.Provider value={ContextAPI}>{children}</context.Provider>
}
