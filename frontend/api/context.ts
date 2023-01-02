import { createContext } from 'react'
import { RssChannel, RssItem } from '@/api/types'
import markAsRead from '@/api/markAsRead'
import channels from '@/api/channels'
import channel from '@/api/channel'

interface API {
    markAsRead(item: RssItem): Promise<string | null>
    channels(id?: string): Promise<RssChannel[]>
    channel(id: string, upto?: string): Promise<RssChannel>
    isLoading: boolean
    setCanMarkAsRead(value: boolean): void
    canMarkAsRead: boolean
}
export const BackendAPI: API = {
    markAsRead,
    channels,
    channel,
    isLoading: false,
    setCanMarkAsRead(value: boolean) {},
    canMarkAsRead: false
}

const context = createContext<API>(BackendAPI)
export default context
