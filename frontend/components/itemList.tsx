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
    const channelID = props.channel.id
    const [itemData, setItemData] = useState<{ [key: string]: RssItem[] }>({
        [channelID]: props.items,
    })
    const api = useContext(APIContext)

    function handleLoadMore(lastItem: RssItem | null) {
        const oldestID = lastItem ? lastItem.id : undefined
        api.channel(channelID, oldestID).then((channel) => {
            if (lastItem) {
	        // avoid race condition(?)
                const newItems = [...itemData[channel.id], ...channel.items]
                setItemData({ ...itemData, [channel.id]: newItems })
            } else {
                setItemData({ [channel.id]: channel.items })
            }
        })
    }

    useEffect(() => {
        setItemData({ [channelID]: props.items })
        if (props.items.length == 0) {
            console.log(
                `${__filename}: initial load for ${props.channel.title}`
            )
            handleLoadMore(null)
        }
    }, [props.channel, props.items])

    const items = itemData[channelID] || []
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
