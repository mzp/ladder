import { useEffect, useState } from 'react'
import { RssChannel } from '@/api/channels'
import ItemSummary from '@/components/itemSummary'

interface Props {
    channels: RssChannel[]
    className?: string
    onSelect?(channel: RssChannel): void
}

export default function ItemList({ channels, className, onSelect }: Props) {
    const [selected, setSelected] = useState<RssChannel>(channels[0])
    useEffect(() => {
        if (onSelect) {
            onSelect(selected)
        }
    }, [])

    return (
        <div className={className}>
            {channels.map((channel) => (
                <div
                    key={channel.id}
                    className={`snap-start border-l-4 text-xs p-2 cursor-pointer truncate whitespace-nowrap
		    ${
                selected.id == channel.id
                    ? 'font-bold text-sky-400 border-sky-400'
                    : ''
            }`}
                    onClick={() => {
                        setSelected(channel)
                        if (onSelect) {
                            onSelect(channel)
                        }
                    }}
                >
                    {channel.title}
                </div>
            ))}
        </div>
    )
}
