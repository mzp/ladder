import { useContext, useEffect, useState } from 'react'
import { RssChannel } from '@/api/types'
import ItemSummary from '@/components/itemSummary'
import APIContext from '@/api/context'

interface Props {
    channels: RssChannel[]
    className?: string
    onSelect?(channel: RssChannel): void
}

export default function ItemList({ channels, className, onSelect }: Props) {
    const api = useContext(APIContext)
    const [selected, setSelected] = useState<RssChannel>(
        channels.find(({ items }) => items.length > 0) || channels[0]
    )
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
                    className={`snap-start border-l-4 text-xs p-2 cursor-pointer flex
		    ${
                selected.id == channel.id
                    ? 'font-bold text-sky-400 border-sky-400'
                    : 'border-transparent'
            } ${channel.unreadCount == 0 && 'opacity-30'}`}
                    onClick={() => {
                        setSelected(channel)
                        api.setReadCount(0)
                        if (onSelect) {
                            onSelect(channel)
                        }
                    }}
                >
                    <div className="shrink truncate whitespace-nowrap">
                        {channel.title}
                    </div>
                    <div>
                        (
                        {channel.unreadCount -
                            (selected.id == channel.id ? api.readCount : 0)}
                        )
                    </div>
                </div>
            ))}
        </div>
    )
}
