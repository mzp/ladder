import { useContext, useEffect, useRef, useState } from 'react'
import { RssItem } from '@/api/types'
import APIContext from '@/api/context'

interface Props {
    item: RssItem
    className?: string
    onRead: ((item: RssItem) => void) | undefined
}

export default function ItemSummary({ item, className, onRead }: Props) {
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
                    if (readAt == null) {
           		api.markAsRead(item).then((readAt) => setReadAt(readAt))
                    }
		    if (onRead) {
		        onRead(item)
		    }
		}
            },
            { threshold: 1 }
        )

        if (ref.current === null) return

        observer.observe(ref.current)

        const { current } = ref

        return () => {
            observer.unobserve(current)
        }
    }, [item.id, readAt])

    const Link = (props: any) => {
        return (
            <a href={item.url} target="_blank" {...props}>
                {props.children}
            </a>
        )
    }

    return (
        <div
            className={`${className} ${item.readAt && 'opacity-30'} py-2`}
            ref={ref}
        >
            <h2 className="font-bold">
                <Link>{item.title}</Link>
            </h2>
            <div className="flex space-x-4 my-2 leading-6">
                <div
                    className="text-gray-600 max-w-3xl flex-auto"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                />
                {item.imageurl ? (
                    <div className="w-48 flex-none">
                        <img
                            src={item.imageurl}
                            className="max-w-full max-h-36"
                        />
                    </div>
                ) : null}
            </div>
            <Link className="border-t-[1px] text-xs text-gray-600 flex space-x-4 font-light">
                <div>{item.date}</div>
                <div>{item.site}</div>
                {item.hatenaBookmarkCount > 0 && (
                    <div>
                        {item.hatenaBookmarkCount}
                        users
                    </div>
                )}
                {readAt && <div>✓</div>}
            </Link>
        </div>
    )
}
