import { useContext, useState, useEffect, useRef } from 'react'
import { RssChannel, RssItem } from '@/api/types'
import APIContext from '@/api/context'
import Intersection from '@/components/intersection'
import ItemSummary from '@/components/itemSummary'
import MediaSummary from '@/components/mediaSummary'

interface Props {
    channel: RssChannel
    items: RssItem[]
    className?: string
    height?: string
}

export default function ItemList(props: Props) {
    const channelID = props.channel.id
    const [itemData, setItemData] = useState<{ [key: string]: RssItem[] }>({
        [channelID]: props.items,
    })
    const [canMarkAsRead, setCanMarkAsRead] = useState<boolean>(false)
    const api = useContext(APIContext)
    const ref = useRef<HTMLDivElement>(null)

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

    useEffect(() => {
        console.log('Disable unread management')
        setCanMarkAsRead(false)
    }, [props.channel.id])

    const items = itemData[channelID] || []
    const prefetchThreshold = Math.max(items.length - 3, 0)
    return (
        <div
            className={`overflow-scroll snap-y snap-mandatory ${
                props.className ? props.className : ''
            }`}
            style={{ height: props.height }}
            ref={ref}
            onScroll={
                canMarkAsRead
                    ? undefined
                    : () => {
                          if (ref.current && ref.current.scrollTop > 100) {
                              console.log(
                                  'Scroll detected: enable unread management'
                              )
                              setCanMarkAsRead(true)
                          }
                      }
            }
        >
            <div
                className={`space-y-2 ${
                    props.channel.isImageMedia
                        ? 'grid grid-flow-row-dense grid-cols-2 mx-auto max-w-4xl'
                        : ''
                }`}
            >
                {items.map((item, index) => (
                    <Intersection
                        enabled={
                            (canMarkAsRead && item.readAt == null) ||
                            index == prefetchThreshold
                        }
                        key={item.id}
                        item={item}
                        className={`snap-start px-4 ${
                            props.channel.isImageMedia ? 'max-w-xl' : ''
                        }`}
                        onIntersect={() => {
                            if (item.readAt == null) {
                                console.log(`markAsRead: ${item.title}`)
                                api.markAsRead(item).then(({ unreadCount }) => {
                                    api.setUnreadCount(unreadCount)
                                })
                            }
                            if (index == prefetchThreshold) {
                                console.log('prefetch items')
                                handleLoadMore(items[items.length - 1])
                            }
                        }}
                    >
                        {props.channel.isImageMedia ? (
                            <MediaSummary item={item} />
                        ) : (
                            <ItemSummary item={item} />
                        )}
                    </Intersection>
                ))}
            </div>
        </div>
    )
}
