import { useContext, useState, useEffect, useRef, RefObject } from 'react'
import classNames from 'classnames'
import { RssChannel, RssItem } from '@/api/types'
import APIContext from '@/api/context'
import ReaderContext from '@/components/reader/readerContext'
import ArticleItem from '@/components/reader/articleItem'
import MediaItem from '@/components/reader/mediaItem'
import useKeyBind from '@/components/hook/useKeyBind'
interface Props {
    channel: RssChannel
    items: RssItem[]
    className?: string
    height?: string
}

function useIntersect(
    action: (args: any[]) => void,
    ref: RefObject<HTMLDivElement>,
    argumentClass: string,
    dependant: unknown[]
) {
    useEffect(() => {
        if (ref.current === null) return

        const observer = new IntersectionObserver(
            (elements) => {
                let items = []
                for (const element of elements) {
                    if (element.isIntersecting) {
                        const json =
                            element.target.attributes.getNamedItem(
                                argumentClass
                            )?.value
                        if (json) {
                            items.push(JSON.parse(json))
                        }
                    }
                }
                if (items.length) {
                    action(items)
                }
            },
            { threshold: 0.8, root: ref.current }
        )

        for (const element of Array.from(
            ref.current.querySelectorAll('.ladder-item')
        )) {
            observer.observe(element)
        }
        const { current } = ref

        return () => {
            observer.unobserve(current)
        }
    }, dependant)
}

function useNavigation(
    ref: RefObject<HTMLDivElement>,
    className: string,
    dependant: unknown[]
) {
    const activeItem = (
        f: (element: HTMLElement, scrollTop: number) => boolean
    ) => {
        if (ref.current) {
            const elements: any[] = Array.from(
                ref.current.querySelectorAll(className)
            )
            const scrollTop = ref.current.scrollTop
            return elements.filter((element) => f(element, scrollTop)) || []
        } else {
            return []
        }
    }
    useKeyBind(
        [
            {
                key: 'j',
                ctrlKey: false,
                action: () => {
                    console.log('keybind: move next item')
                    const targetItem = activeItem((element, scrollTop) => {
                        return scrollTop < element.offsetTop
                    })[0]
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
                    const targetItem = activeItem(
                        (element, scrollTop) => element.offsetTop < scrollTop
                    )
                    if (targetItem.length) {
                        targetItem
                            .reverse()[0]
                            .scrollIntoView({ behavior: 'smooth' })
                    }
                },
            },
        ],
        dependant
    )
}

export default function ItemList({ channel, className }: Props) {
    const ref = useRef<HTMLDivElement>(null)
    const [items, setItems] = useState<RssItem[]>([])
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [canMarkAsRead, setCanMarkAsRead] = useState<boolean>(false)
    const [page, setPage] = useState<number>(0)
    const [activeItemID, setActiveItemID] = useState<
        string /* RssItem#id */ | null
    >(null)

    const { channel: fetchChannel, markAsRead } = useContext(APIContext)
    const { setUnreadCount } = useContext(ReaderContext)

    useEffect(() => {
        console.log(`initialize with: ${channel.title}`)
        fetchChannel(channel.id, 0).then((newChannel) => {
            setItems(newChannel.items)
            setCurrentPage(newChannel.page)
            setPage(0)
            setCanMarkAsRead(false)
            ref.current?.scrollTo(0, 0)
        })
    }, [channel])

    useEffect(() => {
        if (page <= currentPage) {
            return
        }
        console.log(`pagination: ${channel.title} #${page}`)
        fetchChannel(channel.id, page).then((newChannel) => {
            setCurrentPage(newChannel.page)
            setItems([...items, ...newChannel.items])
            console.log(newChannel)
        })
    }, [page])

    const prefetchThreshold = Math.max(items.length - 3, 0)

    useIntersect(
        (items) => {
            if (items.length) {
                const [item, index] = items[items.length - 1]

                const handleLoadMore = () => {
                    if (index > prefetchThreshold) {
                        console.log(`request #${currentPage + 1}`)
                        setPage(currentPage + 1)
                    }
                }

                if (item.readAt == null && canMarkAsRead) {
                    markAsRead(item).then(({ unreadCount }) => {
                        setUnreadCount(unreadCount)
                        handleLoadMore()
                    })
                } else {
                    handleLoadMore()
                }
            }
        },
        ref,
        'data-item',
        [items, canMarkAsRead]
    )

    useNavigation(ref, '.ladder-item', [channel])

    return (
        <div
            className={classNames(
                'overflow-scroll',
                'snap-y',
                'snap-mandatory',
                'relative',
                channel.isImageMedia && classNames('w-full'),
                className && className
            )}
            ref={ref}
            onScroll={() => {
                if (!ref.current) {
                    return
                }

                const elements: any[] = Array.from(
                    ref.current.querySelectorAll('.ladder-item')
                )
                const scrollTop = ref.current.scrollTop
                const activeElement = elements.find(
                    (element) => scrollTop <= element.offsetTop
                )
                const json =
                    activeElement?.attributes?.getNamedItem('data-item')?.value
                if (json) {
                    const [item, index] = JSON.parse(json)
                    console.log(item.title)
                    setActiveItemID(item.id)
                }

                if (scrollTop > 150) {
                    setCanMarkAsRead(true)
                }
            }}
        >
            <div
                className={
                    channel.isImageMedia
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
                    <div
                        key={item.id}
                        className={classNames(
                            'snap-start',
                            'px-4',
                            channel.isImageMedia && 'max-w-xl',
                            'ladder-item'
                        )}
                        data-item={JSON.stringify([item, index])}
                    >
                        {channel.isImageMedia ? (
                            <MediaItem
                                item={item}
                                enableKeyBind={activeItemID == item.id}
                            />
                        ) : (
                            <ArticleItem
                                item={item}
                                enableKeyBind={activeItemID == item.id}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
