import { createContext } from 'react'
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
    setCanMarkAsRead(value: boolean): void
    canMarkAsRead: boolean
    unreadCount: UnreadCount
    setUnreadCount(unreadCount: UnreadCount): void
    detailItem: RssItem | null
    openDetail(item: RssItem | null): void
    showUnread: boolean
    setShowUnread(value: boolean): void
    showNSFW: boolean
    setShowNSFW(value: boolean): void
    setNeedsRefresh(value: boolean): void
    needsRefresh: boolean
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
            `${publicRuntimeConfig.apiRoot}/channels/new?url=${encodeURI(url)}`,
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
    setCanMarkAsRead(value: boolean) {},
    canMarkAsRead: false,
    unreadCount: { channels: {}, categories: {} },
    setUnreadCount(value: UnreadCount) {},
    openDetail(item: RssItem | null) {},
    detailItem: null,
    showUnread: false,
    setShowUnread(value: boolean) {},
    setNeedsRefresh(value: boolean) {},
    needsRefresh: false,
    showNSFW: true,
    setShowNSFW(value: boolean) {},
}

const context = createContext<API>(BackendAPI)
export default context
