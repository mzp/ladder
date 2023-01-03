import { useContext } from 'react'
import { RssChannel } from '@/api/types'
import APIContext from '@/api/context'

function Adjustment() {
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
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
            />
        </svg>
    )
}

interface Props {
    channel: RssChannel
    className?: string
}

export default function ChannelSummary({ channel, className }: Props) {
    const { unreadCount, setUnreadCount, markAllAsRead } =
        useContext(APIContext)
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
                        <Adjustment />
                    </div>
                    <div
                        className="hidden text-sm peer-hover:flex hover:flex
		 w-[180px]
		 flex-col bg-white ring-1 ring-slate-900/5 shadow fixed -ml-[160px] p-2 rounded-lg space-y-2 -mt-4 z-10"
                    >
                        <button
                            className="hover:text-sky-400 text-left"
                            onClick={() => {
                                markAllAsRead(channel).then(({ unreadCount }) =>
                                    setUnreadCount(unreadCount)
                                )
                            }}
                        >
                            Mark all as read({unreadCount[channel.id]})
                        </button>
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
