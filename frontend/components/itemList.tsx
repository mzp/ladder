import { useContext, useState, useEffect } from 'react'
import { RssChannel, RssItem } from '@/api/types'
import APIContext from '@/api/context'
import ItemSummary from '@/components/itemSummary'

interface Props {
    channel: RssChannel
    items: RssItem[]
    className?: string
}

export default function ItemList(props: Props) {
    const [items, setItems] = useState<RssItem[]>(props.items)
    const api = useContext(APIContext)

    function handleLoadMore(lastItem: RssItem | null) {
        const oldestID = lastItem ? lastItem.id : undefined
        api.channel(props.channel.id, oldestID).then((channel) => {
            if (lastItem) {
                setItems([...items, ...channel.items])
            } else {
                setItems(channel.items)
            }
        })
    }

    useEffect(() => {
        setItems(props.items)
        if (props.items.length == 0) {
            console.log(
                `${__filename}: initial load for ${props.channel.title}`
            )
            handleLoadMore(null)
        }
    }, [props.channel])

    return (
        <div className={`space-y-2 ${props.className ? props.className : ''}`}>
            {items.map((item, index) => (
                <ItemSummary
                    key={item.id}
                    item={item}
                    className="snap-start px-4"
                    onRead={
                        index == Math.max(items.length - 3, 0)
                            ? () => {
                                  // prefetch
                                  handleLoadMore(items[items.length - 1])
                              }
                            : undefined
                    }
                />
            ))}
        </div>
    )
}
