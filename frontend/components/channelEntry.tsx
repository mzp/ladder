import { RssChannel } from '@/api/channels'

interface Props {
    channel: RssChannel
    selected?: boolean
    className?: string
    onClick?(channel: RssChannel): void
}

export default function ChannelEntry({
    channel,
    className,
    selected,
    onClick,
}: Props) {
    return (
        <div
            className={`text-xs p-2 cursor-pointer truncate whitespace-nowrap border-l-2 ${className} ${
                selected ? 'font-bold text-sky-400 border-sky-400' : ''
            }`}
            onClick={() => {
                onClick && onClick(channel)
            }}
        >
            {channel.title}
        </div>
    )
}
