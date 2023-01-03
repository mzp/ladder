export interface RssItem {
    id: string
    url: string
    title: string
    site: string
    date: string
    imageurl: string | null
    description: string
    hatenaBookmarkCount: number
    readAt: string | null
}

export interface RssChannel {
    id: string
    url: string
    title: string
    description: string
    items: RssItem[]
    category_id: string
}

export interface ChannelOption {
    category_id: string
}

export interface Category {
    id: string
    title: string
}

export interface ChannelsResponse {
    channels: RssChannel[]
    categories: Category[]
}

export interface ItemsResponse {
    channels: RssChannel[]
    categories: Category[]
    unreadCount: Map<string, number>
}
