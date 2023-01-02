import getConfig from 'next/config'
import { RssChannel } from '@/api/types'

const { publicRuntimeConfig } = getConfig()
export default function fetchChannels(
    initialSelectedID?: string
): Promise<RssChannel[]> {
    const response: Promise<any> = fetch(
        `${publicRuntimeConfig.apiRoot}/channels?initial=${initialSelectedID}`
    )
    return response.then((res) => res.json())
}
