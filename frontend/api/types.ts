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
    id: number
    url: string
    title: string
    description: string
    items: RssItem[]
}
