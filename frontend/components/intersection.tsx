import { useContext, useEffect, useRef, useState } from 'react'
import { RssItem } from '@/api/types'
import APIContext from '@/api/context'

interface Props {
    children: any
    item: RssItem
    className?: string
    onIntersect?(): void
    enabled: boolean
}

export default function Intersection({
    item,
    children,
    className,
    onIntersect,
    enabled,
}: Props) {
    const ref = useRef<HTMLDivElement>(null)
    const [intersected, setIntersected] = useState<boolean>(false)
    const api = useContext(APIContext)

    useEffect(() => {
        if (enabled) {
            const observer = new IntersectionObserver(
                ([element]) => {
                    if (element.isIntersecting && onIntersect) {
                        onIntersect()
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
        }
    }, [enabled])

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    )
}
