import { useContext, useState, useEffect, useRef } from 'react'
import classNames from 'classnames'
import { RssChannel, RssItem } from '@/api/types'
import APIContext from '@/api/context'
import ReaderContext from '@/components/reader/readerContext'
import Intersection from '@/components/intersection'
import ArticleItem from '@/components/reader/articleItem'
import MediaItem from '@/components/reader/mediaItem'
import useKeyBind from '@/components/hook/useKeyBind'
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
    const { setUnreadCount } = useContext(ReaderContext)
    const [canMarkAsRead, setCanMarkAsRead] = useState<boolean>(false)
    const api = useContext(APIContext)
    const ref = useRef<HTMLDivElement>(null)
    const [activeItemID, setActiveItemID] = useState<string | null>(
        props.items[0]?.id
    )

    const activeItem = (offset: number) => {
        if (ref.current) {
            const items: any[] = Array.from(
                ref.current.querySelectorAll('.ladder-item')
            )
            const scrollTop = ref.current.scrollTop
            const index = items.findIndex(
                (item) =>
                    item.offsetTop <= scrollTop &&
                    scrollTop < item.offsetTop + item.offsetHeight
            )
            const activeItem = items[index]
            if (offset == 0) {
                return activeItem
            } else if (offset < 0) {
                return items
                    .slice(0, index + offset + 1)
                    .reverse()
                    .find((item) => item.offsetTop < activeItem.offsetTop)
            } else {
                return items
                    .slice(index + offset)
                    .find((item) => item.offsetTop > activeItem.offsetTop)
            }
        }
    }

    useKeyBind(
        [
            {
                key: 'j',
                ctrlKey: false,
                action: () => {
                    console.log('keybind: move next item')
                    const targetItem = activeItem(1)
                    console.log(targetItem)
                    if (targetItem) {
                        targetItem.scrollIntoView({ behavior: 'smooth' })
                    }
                },
            },
            {
                key: 'k',
                ctrlKey: false,
                action: () => {
                    console.log('keybind: move previous item')
                    const targetItem = activeItem(-1)
                    if (targetItem) {
                        targetItem.scrollIntoView({ behavior: 'smooth' })
                    }
                },
            },
        ],
        [props.channel]
    )

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
        console.log('Disable unread management')
        setCanMarkAsRead(false)
        setItemData({ [props.channel.id]: props.channel.items })
        if (items.length == 0) {
            console.log(
                `${__filename}: initial load for ${props.channel.title}`
            )
            handleLoadMore(null)
        }
    }, [props.channel])

    const items = itemData[channelID] || []
    const prefetchThreshold = Math.max(items.length - 3, 0)
    return (
        <div
            className={classNames(
                'overflow-scroll',
                'snap-y',
                'snap-mandatory',
                'relative',
                props.channel.isImageMedia && classNames('w-full'),
                props.className && props.className
            )}
            ref={ref}
            onScroll={() => {
                if (
                    !canMarkAsRead &&
                    ref.current &&
                    ref.current.scrollTop > 200
                ) {
                    console.log(ref.current.scrollTop)
                    console.log('Scroll detected: enable unread management')
                    setCanMarkAsRead(true)
                }

                const id = activeItem(0)?.attributes['data-id']?.value
                if (id && activeItemID != id) {
                    console.log(`active item: ${id}`)
                    setActiveItemID(id)
                }
            }}
        >
            <div
                className={
                    props.channel.isImageMedia
                        ? classNames(
                              'md:grid',
                              'md:grid-flow-row-dense',
                              'md:grid-cols-2',
                              'md:mx-auto',
                              'md:max-w-3xl'
                          )
                        : ''
                }
            >
                {items.map((item, index) => (
                    <Intersection
                        enabled={
                            (canMarkAsRead && item.readAt == null) ||
                            index == prefetchThreshold
                        }
                        key={item.id}
                        className={classNames(
                            'snap-start',
                            'px-4',
                            props.channel.isImageMedia && 'max-w-xl'
                        )}
                        onIntersect={() => {
                            if (item.readAt == null) {
                                console.log(`markAsRead: ${item.title}`)
                                api.markAsRead(item).then(({ unreadCount }) => {
                                    setUnreadCount(unreadCount)
                                })
                            }
                            if (index == prefetchThreshold) {
                                console.log('prefetch items')
                                handleLoadMore(items[items.length - 1])
                            }
                        }}
                    >
                        {props.channel.isImageMedia ? (
                            <MediaItem
                                className="ladder-item"
                                item={item}
                                enableKeyBind={item.id == activeItemID}
                            />
                        ) : (
                            <ArticleItem
                                className="ladder-item"
                                item={item}
                                enableKeyBind={item.id == activeItemID}
                            />
                        )}
                    </Intersection>
                ))}
            </div>
        </div>
    )
}
