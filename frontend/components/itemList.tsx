import { useState, useEffect } from 'react'
import { RssChannel, RssItem } from '@/api/types'
import ItemSummary from '@/components/itemSummary'

interface Props {
    channel: RssChannel
    items: RssItem[]
    className?: string
}

export default function ItemList(props: Props) {
    const [items, setItems] = useState<RssItem[]>(props.items)
    useEffect(() => {
        setItems(props.items)

	if (props.items.length == 0 && props.channel.unreadCount != 0) {
	  console.log('request')
	}
    }, [props.channel])

    return (
        <div className={`space-y-4 ${props.className}`}>
            {items.map((item) => (
                <ItemSummary
                    key={item.id}
                    item={item}
                    className="snap-start px-4"
                />
            ))}
        </div>
    )
}
