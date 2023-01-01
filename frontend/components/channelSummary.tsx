import { RssChannel } from '@/api/channels'

interface Props {
    channel: RssChannel
    selected?: boolean
    onClick?(channel: RssChannel): void
}

export default function ChannelSummary({ channel, selected, onClick }: Props) {
    return (
        <div
            className={`text-xs p-2 cursor-pointer ${
                selected ? 'bg-slate-200' : ''
            }`}
            onClick={() => {
                onClick && onClick(channel)
            }}
        >
            {channel.title}
        </div>
    )
}
