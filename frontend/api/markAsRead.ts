import getConfig from 'next/config'
import { RssItem } from '@/api/channels'

const { publicRuntimeConfig } = getConfig()
export default function markAsRead(item: RssItem): Promise<string> {
    const response: Promise<any> = fetch(
        `${publicRuntimeConfig.apiRoot}/items/${item.id}/markAsRead`,
	{ method: 'POST' }
    )
    return response.then((res) => res.json())
}

