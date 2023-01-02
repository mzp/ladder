import getConfig from 'next/config'
import { RssChannel } from '@/api/types'

const { publicRuntimeConfig } = getConfig()
export default function fetchChannel(channel: RssChannel): Promise<RssChannel> {
    const response: Promise<any> = fetch(
        `${publicRuntimeConfig.apiRoot}/channels/${channel.id}`
    )
    return response.then((res) => res.json())
}
