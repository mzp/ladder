import { useContext } from 'react'
import { RssChannel } from '@/api/types'
import APIContext from '@/api/context'

function Checkmark() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
            />
        </svg>
    )
}

interface Props {
    channel: RssChannel
    className?: string
}

export default function ChannelSummary({ channel, className }: Props) {
    return (
        <div
            className={`backdrop-blur-sm w-full bg-slate-200/90 border-b-[1px] border-slate-300 ${className}`}
        >
            <div className="flex">
                <h2 className="text-lg font-bold flex-auto">
                    <a href={channel.url} target="_blank">
                        {channel.title}
                    </a>
                </h2>
                <div>
                    <div className="text-slate-400 hover:text-slate-600 peer">
                        <Checkmark />
                    </div>
                </div>
            </div>
            <div className="text-sm">
                <a href={channel.url} target="_blank">
                    {channel.description}
                </a>
            </div>
        </div>
    )
}
