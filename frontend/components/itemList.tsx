import { useState, useEffect } from 'react'
import { RssChannel, RssItem } from '@/api/channels'
import ItemSummary from '@/components/itemSummary'

interface Props {
    channel: RssChannel
    items: RssItem[]
    className?: string
}

export default function ItemList(props: Props) {
    const [items, setItems] = useState<RssItem[]>(props.items)
    const handleRead = (item: RssItem) => {
        console.log(item)
    }
    useEffect(() => {
        setItems(props.items)
    }, [props.channel])

    return (
        <div className={`space-y-4 ${props.className}`}>
            {items.map((item) => (
                <ItemSummary
                    key={item.id}
                    item={item}
                    className="snap-start px-4"
                    onRead={handleRead}
                />
            ))}
        </div>
    )
}
