import { useContext } from 'react'
import { RssChannel } from '@/api/types'
import APIContext from '@/api/context'
import DropMenu from '@/components/dropMenu'

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
    const {
        unreadCount,
        setUnreadCount,
        markAllAsRead,
        updateChannel,
        setNeedsRefresh,
    } = useContext(APIContext)
    const count = unreadCount.channels[channel.id]
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
                <DropMenu icon={<Adjustment />} width={180}>
                    <button
                        className="text-left"
                        onClick={() => {
                            updateChannel(channel.id, {
                                image_media: !channel.image_media,
                            }).then((response) => {
                                setNeedsRefresh(true)
                            })
                        }}
                    >
                        {channel.isImageMedia ? 'Unmark' : 'Mark'} as image media
                    </button>
                    <button
                        className={`text-left ${
                            count == 0 ? 'opacity-30' : 'hover:text-sky-400'
                        }`}
                        onClick={() => {
                            markAllAsRead(channel).then(({ unreadCount }) =>
                                setUnreadCount(unreadCount)
                            )
                        }}
                    >
                        Mark all as read({count})
                    </button>
                </DropMenu>
            </div>
            <div className="text-sm">
                <a href={channel.url} target="_blank">
                    {channel.description}
                </a>
            </div>
        </div>
    )
}
