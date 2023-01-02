import getConfig from 'next/config'
import { RssChannel } from '@/api/types'

const { publicRuntimeConfig } = getConfig()
export default function fetchChannel(id: string, upto: string): Promise<RssChannel> {
    const response: Promise<any> = fetch(
        `${publicRuntimeConfig.apiRoot}/channels/${id}?upto=${upto ? upto : ''}`
    )
    return response.then((res) => res.json())
}
