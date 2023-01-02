import { useContext } from 'react'
import { RssChannel } from '@/api/types'
import APIContext from '@/api/context'

interface Props {
    channel: RssChannel
    className?: string
}

export default function ChannelSummary({ channel, className }: Props) {
    return (
        <div
            className={`backdrop-blur-sm w-full bg-slate-200/90 border-b-[1px] border-slate-300 ${className}`}
        >
            <h2 className="text-lg font-bold">
                <a href={channel.url} target="_blank">
                    {channel.title}
                </a>
            </h2>
            <div className="text-sm">
                <a href={channel.url} target="_blank">
                    {channel.description}
                </a>
            </div>
        </div>
    )
}
