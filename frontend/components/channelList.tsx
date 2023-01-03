import { useContext, useEffect, useState } from 'react'
import { RssChannel } from '@/api/types'
import ItemSummary from '@/components/itemSummary'
import APIContext from '@/api/context'

interface Props {
    channels: RssChannel[]
    className?: string
    onSelect?(channel: RssChannel): void
    style?: { [key: string]: string }
}

export default function ItemList({
    channels,
    className,
    onSelect,
    style,
}: Props) {
    const { unreadCount } = useContext(APIContext)
    const [selected, setSelected] = useState<RssChannel>(
        channels.find(({ items }) => items.length > 0) || channels[0]
    )
    useEffect(() => {
        if (onSelect) {
            onSelect(selected)
        }
    }, [])

    return (
        <div className={className} style={style}>
            {channels.map((channel) => (
                <div
                    key={channel.id}
                    className={`snap-start border-l-4 text-xs p-2 cursor-pointer flex
		    ${
                selected.id == channel.id
                    ? 'font-bold text-sky-400 border-sky-400'
                    : 'border-transparent'
            } ${unreadCount[channel.id] == 0 && 'opacity-30'}`}
                    onClick={() => {
                        setSelected(channel)
                        if (onSelect) {
                            onSelect(channel)
                        }
                    }}
                >
                    <div className="shrink truncate whitespace-nowrap">
                        {channel.title}
                    </div>
                    {unreadCount[channel.id] && (
                        <div>({unreadCount[channel.id]})</div>
                    )}
                </div>
            ))}
        </div>
    )
}
