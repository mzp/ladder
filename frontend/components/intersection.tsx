import { useContext, useEffect, useRef, useState } from 'react'
import { RssItem } from '@/api/types'
import APIContext from '@/api/context'

interface Props {
    children: any
    item: RssItem
    className?: string
    onRead: ((item: RssItem) => void) | undefined
}

export default function Intersection({
    item,
    children,
    onRead,
    className,
}: Props) {
    const ref = useRef<HTMLDivElement>(null)
    const [readAt, setReadAt] = useState<string | null>(item.readAt)
    const api = useContext(APIContext)

    useEffect(() => {
        if (readAt != null && onRead == null) {
            return
        }
        const observer = new IntersectionObserver(
            ([element]) => {
                if (element.isIntersecting) {
                    if (onRead) {
                        onRead(item)
                    }

                    if (readAt == null) {
                        api.markAsRead(item).then(({ readAt, unreadCount }) => {
                            setReadAt(readAt)
                            api.setUnreadCount(unreadCount)
                        })
                    }
                }
            },
            { threshold: 0.8 }
        )

        if (ref.current === null) return

        observer.observe(ref.current)
        const { current } = ref

        return () => {
            observer.unobserve(current)
        }
    }, [item.id, readAt])

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    )
}
