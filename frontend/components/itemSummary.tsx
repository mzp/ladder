import { RssItem } from '@/api/channels'
import markAsRead from '@/api/markAsRead'
import { useEffect, useRef, useState } from 'react'
interface Props {
    item: RssItem
    className?: string
}

export default function ItemSummary({ item, className }: Props) {
    const ref = useRef<HTMLDivElement>(null)
    const [readAt, setReadAt] = useState<string>(item.read_at)
    useEffect(() => {
    if (readAt != null) { return }
        const observer = new IntersectionObserver(
            ([element]) => {
                if (element.isIntersecting) {
		  markAsRead(item)
		    .then((readAt) => setReadAt(readAt))
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
        <div className={`${className} ${item.read_at != null ? 'opacity-30' : ''}`} ref={ref}>
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
                {item.hatena_bookmark_count > 0 ? (
                    <div>
                        {item.hatena_bookmark_count}
                        users
                    </div>
                ) : null}
		{readAt && <div>✓</div>}
            </Link>
        </div>
    )
}
