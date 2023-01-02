import getConfig from 'next/config'
import { RssChannel } from '@/api/types'

const { publicRuntimeConfig } = getConfig()
export default function updateChannel(
    id: string,
    option: { category_id: string }
): Promise<RssChannel> {
    const response: Promise<any> = fetch(
        `${publicRuntimeConfig.apiRoot}/channels/${id}`,
	{
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(option)
	}
    )
    return response.then((res) => res.json())
}
