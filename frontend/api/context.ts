import { createContext } from 'react'
import { Category, RssChannel, RssItem, ChannelOption } from '@/api/types'
import getConfig from 'next/config'

interface API {
    markAsRead(item: RssItem): Promise<string | null>
    channels(id?: string): Promise<RssChannel[]>
    channel(id: string, upto?: string): Promise<RssChannel>
    updateChannel(id: string, option: { category_id: string }): Promise<void>
    createCategory(title: string): Promise<Category[]>
    categories(): Promise<Category[]>
    isLoading: boolean
    setCanMarkAsRead(value: boolean): void
    canMarkAsRead: boolean
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
    channels(initialSelectedID?: string): Promise<RssChannel[]> {
        const response: Promise<any> = fetch(
            `${publicRuntimeConfig.apiRoot}/channels?initial=${initialSelectedID}`
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
    categories(): Promise<Category[]> {
        const response: Promise<any> = fetch(
            `${publicRuntimeConfig.apiRoot}/categories`
        )
        return response.then((res) => res.json())
    },

    isLoading: false,
    setCanMarkAsRead(value: boolean) {},
    canMarkAsRead: false,
}

const context = createContext<API>(BackendAPI)
export default context
