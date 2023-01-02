import { createContext } from 'react'
import { RssItem } from '@/api/types'
import markAsRead from '@/api/markAsRead'

interface API {
    markAsRead(item: RssItem): Promise<string | null>
}
export const BackendAPI: API = {
    markAsRead,
}

const context = createContext<API>(BackendAPI)
export default context
