import { useContext, useState, useEffect } from 'react'
import { RssChannel, RssItem } from '@/api/types'
import APIContext from '@/api/context'
import Intersection from '@/components/intersection'
import ItemSummary from '@/components/itemSummary'
import MediaSummary from '@/components/mediaSummary'

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
        <div
            className={`space-y-2 ${props.className ? props.className : ''} ${
                props.channel.isImageMedia
                    ? 'grid grid-flow-row-dense grid-cols-2 mx-auto max-w-4xl'
                    : ''
            }`}
        >
            {items.map((item, index) => (
                <Intersection
                    key={item.id}
                    item={item}
                    className={`snap-start px-4 ${
                        props.channel.isImageMedia ? 'max-w-xl' : ''
                    }`}
                    onRead={
                        index == Math.max(items.length - 3, 0)
                            ? () => {
                                  console.log('prefetch items')
                                  handleLoadMore(items[items.length - 1])
                              }
                            : undefined
                    }
                >
                    {props.channel.isImageMedia ? (
                        <MediaSummary item={item} />
                    ) : (
                        <ItemSummary item={item} />
                    )}
                </Intersection>
            ))}
        </div>
    )
}
