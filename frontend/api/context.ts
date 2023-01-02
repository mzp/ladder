import { createContext } from 'react'
import { RssChannel, RssItem } from '@/api/types'
import fetchChannels from '@/api/channels'
import markAsRead from '@/api/markAsRead'

interface API {
    markAsRead(item: RssItem): Promise<string | null>
    fetchChannels(): Promise<RssChannel[]>
}
export const StandardAPI = {
    markAsRead,
    fetchChannels,
}

const context = createContext<API>(StandardAPI)
export default context
