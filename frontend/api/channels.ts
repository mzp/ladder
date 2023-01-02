import getConfig from 'next/config'
import { RssChannel } from '@/api/types'

const { publicRuntimeConfig } = getConfig()
export default function fetchChannels(): Promise<RssChannel[]> {
    const response: Promise<any> = fetch(
        `${publicRuntimeConfig.apiRoot}/channels`
    )
    return response.then((res) => res.json())
}
