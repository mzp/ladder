export interface RssItem {
    id: string
    url: string
    title: string
    site: string
    date: string
    imageurl: string | null
    description: string
    content: string | null
    hatenaBookmarkCount: number
    readAt: string | null
}

export interface RssChannel {
    id: string
    url: string
    title: string
    originalTitle: string
    description: string
    items: RssItem[]
    category_id: string
    isImageMedia: boolean
}

export interface ChannelOption {
    category_id?: string
    image_media?: boolean
    override_title?: string
}

export interface Category {
    id: string
    title: string
    channels?: RssChannel[]
    selected?: boolean
    isNSFW: boolean
}

export interface ChannelsResponse {
    channels: RssChannel[]
    categories: Category[]
}

export type UnreadCount = {
    channels: { [key: string]: number }
    categories: { [key: string]: number }
}

export interface ItemsResponse {
    categories?: Category[]
    unreadCount?: UnreadCount
    error?: string
}

export interface MarkAsReadResponse {
    readAt: string
    unreadCount: UnreadCount
}
