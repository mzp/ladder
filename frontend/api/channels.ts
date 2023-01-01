import getConfig from 'next/config'

export interface RssItem {
    id: string
    url: string
    title: string
    site: string
    date: string
    imageurl: string | null
    description: string
    hatena_bookmark_count: number
}

export interface RssChannel {
    id: number
    url: string
    title: string
    items: RssItem[]
}

const { publicRuntimeConfig } = getConfig()
export default function fetchChannels(): Promise<RssChannel[]> {
    const response: Promise<any> = fetch(
        `${publicRuntimeConfig.apiRoot}/channels`
    )
    return response.then((res) => res.json())
}
