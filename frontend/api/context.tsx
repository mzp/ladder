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
import { Context } from 'vm'

interface API {
    markAsRead(item: RssItem): Promise<MarkAsReadResponse>
    markAllAsRead(channel: RssChannel): Promise<{ unreadCount: UnreadCount }>
    channels(): Promise<ChannelsResponse>
    items(id?: string): Promise<ItemsResponse>
    channel(id: string, upto?: string): Promise<RssChannel>
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

const { publicRuntimeConfig } = getConfig()

export const BackendAPI: API = {
    markAsRead(item: RssItem) {
        return fetch(
            `${publicRuntimeConfig.apiRoot}/items/${item.id}/markAsRead`,
            { method: 'POST', credentials: 'include' }
        ).then((res) => res.json())
    },
    markAllAsRead(channel: RssChannel) {
        return fetch(
            `${publicRuntimeConfig.apiRoot}/channels/${channel.id}/markAllAsRead`,
            { method: 'POST', credentials: 'include' }
        ).then((res) => res.json())
    },
    channels() {
        return fetch(`${publicRuntimeConfig.apiRoot}/channels`, {
            credentials: 'include',
        }).then((res) => res.json())
    },
    items(initialSelectedID?: string) {
        return fetch(
            `${publicRuntimeConfig.apiRoot}/items?initial=${initialSelectedID}`,
            { credentials: 'include' }
        ).then((res) => res.json())
    },
    channel(id: string, upto: string) {
        return fetch(
            `${publicRuntimeConfig.apiRoot}/channels/${id}?upto=${
                upto ? upto : ''
            }`,
            { credentials: 'include' }
        ).then((res) => res.json())
    },
    updateChannel(id: string, option: ChannelOption) {
        return fetch(`${publicRuntimeConfig.apiRoot}/channels/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(option),
            credentials: 'include',
        }).then((res) => res.json())
    },
    newChannel(url: string) {
        return fetch(
            `${
                publicRuntimeConfig.apiRoot
            }/channels/new?url=${encodeURIComponent(url)}`,
            {
                method: 'GET',
                credentials: 'include',
            }
        ).then((res) => res.json())
    },
    createChannel(url: string) {
        return fetch(`${publicRuntimeConfig.apiRoot}/channels`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
            credentials: 'include',
        }).then((res) => res.json())
    },
    removeChannel(id: string) {
        return fetch(`${publicRuntimeConfig.apiRoot}/channels/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        }).then((res) => res.json())
    },
    createCategory(title: string): Promise<Category[]> {
        return fetch(`${publicRuntimeConfig.apiRoot}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title }),
            credentials: 'include',
        }).then((res) => res.json())
    },
    updateCategory(id: string, title: string): Promise<Category[]> {
        return fetch(`${publicRuntimeConfig.apiRoot}/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title }),
            credentials: 'include',
        }).then((res) => res.json())
    },
    removeCategory(id: string): Promise<Category[]> {
        return fetch(`${publicRuntimeConfig.apiRoot}/categories/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        }).then((res) => res.json())
    },
    categories(): Promise<Category[]> {
        return fetch(
            `${publicRuntimeConfig.apiRoot}/categories`,

            { credentials: 'include' }
        ).then((res) => res.json())
    },
    isLoading: false,
}

const context = createContext<API>(BackendAPI)
export default context

export function APIProvider({ children }: { children: any }) {
    const [isLoading, setLoading] = useState<boolean>(false)
    const [apiCall, setAPICall] = useState<{
        api: () => any
        resolver: any
    }>()

    const ContextAPI = {
        markAsRead(item: RssItem) {
            return new Promise<MarkAsReadResponse>((resolver) => {
                setAPICall({
                    resolver,
                    api: () => BackendAPI.markAsRead(item),
                })
            })
        },
        markAllAsRead(channel: RssChannel) {
            return new Promise<{ unreadCount: UnreadCount }>((resolver) => {
                setAPICall({
                    resolver,
                    api: () => BackendAPI.markAllAsRead(channel),
                })
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
        newChannel(url: string) {
            return new Promise<{ urls: string[] }>((resolver) => {
                setAPICall({
                    resolver,
                    api: () => BackendAPI.newChannel(url),
                })
            })
        },
        createChannel(url: string) {
            return new Promise<RssChannel[]>((resolver) => {
                setAPICall({
                    resolver,
                    api: () => BackendAPI.createChannel(url),
                })
            })
        },
        removeChannel(id: string) {
            return new Promise<RssChannel[]>((resolver) => {
                setAPICall({
                    resolver,
                    api: () => BackendAPI.removeChannel(id),
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
        isLoading,
    }

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

    return <context.Provider value={ContextAPI}>{children}</context.Provider>
}