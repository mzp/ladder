import React, { createContext, useState, ReactNode } from 'react'

import { RssItem, UnreadCount } from '@/api/types'

interface ReaderContext {
    unreadCount: UnreadCount
    setUnreadCount(unreadCount: UnreadCount): void
    detailItem: RssItem | null
    openDetail(item: RssItem | null): void
    showUnread: boolean
    setShowUnread(value: boolean): void
    showNSFW: boolean
    setShowNSFW(value: boolean): void
    halfModal: ReactNode | null
    openHalfModal(content: ReactNode | null): void
    modal: ReactNode | null
    openModal(content: ReactNode | null): void
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
    halfModal: null,
    openHalfModal(value: ReactNode | null) {},
    modal: null,
    openModal(value: ReactNode | null) {},
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
    const [halfModal, openHalfModal] = useState<ReactNode>(null)
    const [modal, openModal] = useState<ReactNode>(null)

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
                halfModal,
                openHalfModal,
                modal,
                openModal,
            }}
        >
            {children}
        </context.Provider>
    )
}
