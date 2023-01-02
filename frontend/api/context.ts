import { createContext } from 'react'
import { RssChannel, RssItem } from '@/api/types'
import markAsRead from '@/api/markAsRead'
import channel from '@/api/channel'

interface API {
    markAsRead(item: RssItem): Promise<string | null>
    channel(id: string, upto: string): Promise<RssChannel>
}
export const BackendAPI: API = {
    markAsRead,
    channel,
}

const context = createContext<API>(BackendAPI)
export default context
