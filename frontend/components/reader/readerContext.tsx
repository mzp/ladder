import { createContext, useState } from 'react'

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

interface ReaderContext {
    unreadCount: UnreadCount
    setUnreadCount(unreadCount: UnreadCount): void
    detailItem: RssItem | null
    openDetail(item: RssItem | null): void
    showUnread: boolean
    setShowUnread(value: boolean): void
    showNSFW: boolean
    setShowNSFW(value: boolean): void
}

const context = createContext<ReaderContext>({
    unreadCount: { channels: {}, categories: {} },
    setUnreadCount(value: UnreadCount) {},
    openDetail(item: RssItem | null) {},
    detailItem: null,
    showUnread: false,
    setShowUnread(value: boolean) {},
    showNSFW: true,
    setShowNSFW(value: boolean) {},
})
export default context

export function ReaderContextProvider({ children }: { children: any }) {
    const [unreadCount, setUnreadCount] = useState<UnreadCount>({
        channels: {},
        categories: {},
    })
    const [detailItem, openDetail] = useState<RssItem | null>(null)
    const [showUnread, setShowUnread] = useState<boolean>(false)
    const [showNSFW, setShowNSFW] = useState<boolean>(true)

    return (
        <context.Provider
            value={{
                unreadCount,
                setUnreadCount,
                detailItem,
                openDetail,
                showUnread,
                setShowUnread,
                showNSFW,
                setShowNSFW,
            }}
        >
            {children}
        </context.Provider>
    )
}
