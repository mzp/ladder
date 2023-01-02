import { createContext } from 'react'
import { RssChannel, RssItem } from '@/api/types'
import markAsRead from '@/api/markAsRead'
import channels from '@/api/channels'
import channel from '@/api/channel'
import updateChannel from '@/api/updateChannel'

interface API {
    markAsRead(item: RssItem): Promise<string | null>
    channels(id?: string): Promise<RssChannel[]>
    channel(id: string, upto?: string): Promise<RssChannel>
    updateChannel(id: string, option: { category_id: string }): Promise<void>
    isLoading: boolean
    setCanMarkAsRead(value: boolean): void
    canMarkAsRead: boolean
}
export const BackendAPI: API = {
    markAsRead,
    channels,
    channel,
    updateChannel,
    isLoading: false,
    setCanMarkAsRead(value: boolean) {},
    canMarkAsRead: false,
}

const context = createContext<API>(BackendAPI)
export default context
