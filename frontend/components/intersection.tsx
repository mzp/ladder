import { useEffect, useRef, useState } from 'react'

interface Props {
    children: any
    className?: string
    onIntersect?(): void
    enabled: boolean
}

export default function Intersection({
    children,
    className,
    onIntersect,
    enabled,
}: Props) {
    const ref = useRef<HTMLDivElement>(null)
    const [intersected, setIntersected] = useState<boolean>(false)

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
