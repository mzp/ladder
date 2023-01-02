import { createContext } from 'react'
import { Category, RssChannel, RssItem, ChannelOption } from '@/api/types'
import getConfig from 'next/config'

interface API {
    markAsRead(item: RssItem): Promise<string | null>
    channels(): Promise<{ channels: RssChannel[]; categories: Category[] }>
    items(
        id?: string
    ): Promise<{ channels: RssChannel[]; categories: Category[] }>
    channel(id: string, upto?: string): Promise<RssChannel>
    updateChannel(id: string, option: { category_id: string }): Promise<void>
    createCategory(title: string): Promise<Category[]>
    updateCategory(id: string, title: string): Promise<Category[]>
    categories(): Promise<Category[]>
    isLoading: boolean
    setCanMarkAsRead(value: boolean): void
    canMarkAsRead: boolean
    readCount: number
    setReadCount(value: number): void
}

const { publicRuntimeConfig } = getConfig()

export const BackendAPI: API = {
    markAsRead(item: RssItem): Promise<string> {
        const response: Promise<any> = fetch(
            `${publicRuntimeConfig.apiRoot}/items/${item.id}/markAsRead`,
            { method: 'POST' }
        )
        return response.then((res) => res.json())
    },
    channels() {
        const response: Promise<any> = fetch(
            `${publicRuntimeConfig.apiRoot}/channels`
        )
        return response.then((res) => res.json())
    },
    items(initialSelectedID?: string) {
        const response: Promise<any> = fetch(
            `${publicRuntimeConfig.apiRoot}/items?initial=${initialSelectedID}`
        )
        return response.then((res) => res.json())
    },

    channel(id: string, upto: string): Promise<RssChannel> {
        const response: Promise<any> = fetch(
            `${publicRuntimeConfig.apiRoot}/channels/${id}?upto=${
                upto ? upto : ''
            }`
        )
        return response.then((res) => res.json())
    },
    updateChannel(id: string, option: ChannelOption): Promise<RssChannel> {
        const response: Promise<any> = fetch(
            `${publicRuntimeConfig.apiRoot}/channels/${id}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(option),
            }
        )
        return response.then((res) => res.json())
    },
    createCategory(title: string): Promise<Category[]> {
        const response: Promise<any> = fetch(
            `${publicRuntimeConfig.apiRoot}/categories`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title }),
            }
        )
        return response.then((res) => res.json())
    },
    updateCategory(id: string, title: string): Promise<Category[]> {
        const response: Promise<any> = fetch(
            `${publicRuntimeConfig.apiRoot}/categories/${id}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title }),
            }
        )
        return response.then((res) => res.json())
    },
    removeCategory(id: string): Promise<Category[]> {
        const response: Promise<any> = fetch(
            `${publicRuntimeConfig.apiRoot}/categories/${id}`,
            {
                method: 'DELETE',
            }
        )
        return response.then((res) => res.json())
    },
    categories(): Promise<Category[]> {
        const response: Promise<any> = fetch(
            `${publicRuntimeConfig.apiRoot}/categories`
        )
        return response.then((res) => res.json())
    },

    isLoading: false,
    setCanMarkAsRead(value: boolean) {},
    canMarkAsRead: false,
    readCount: 0,
    setReadCount(value: number) {},
}

const context = createContext<API>(BackendAPI)
export default context
