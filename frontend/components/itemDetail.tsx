import { useContext, useEffect, useRef } from 'react'
import APIContext from '@/api/context'

function Xmark() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
            />
        </svg>
    )
}

interface Props {
    className?: string
}

export default function ItemDetail({ className }: Props) {
    const { detailItem, openDetail } = useContext(APIContext)
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (!detailItem) {
            return
        }
        const listener = (event: any) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return
            }
            if (event.target.attributes['data-prevent-menu-close']) {
                return
            }
            console.log('close detail menu by outside click')
            openDetail(null)
        }
        document.addEventListener('mousedown', listener)
        document.addEventListener('touchstart', listener)
        return () => {
            document.removeEventListener('mousedown', listener)
            document.removeEventListener('touchstart', listener)
        }
    }, [detailItem, ref])

    return (
        <div
            ref={ref}
            className={`bg-white py-4 px-10 pr-0 drop-shadow-lg ${className}`}
        >
            <div className="bg-white">
                <button
                    onClick={() => openDetail(null)}
                    className="hover:text-sky-400"
                >
                    <Xmark />
                </button>
            </div>
            {detailItem && detailItem.content && (
                <div>
                    <h3 className="text-2xl font-bold">
                        <a
                            href={detailItem.url}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {detailItem.title}
                        </a>
                    </h3>
                    <div className="text-sm text-slate-400">
                        <div className="flex space-x-4">
                            <div>{detailItem.date}</div>
                            <div>
                                <a
                                    href={detailItem.url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {detailItem.url}
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="h-screen overflow-scroll mt-2">
                        <div
                            className="text-gray-600 mr-10"
                            dangerouslySetInnerHTML={{
                                __html: detailItem.content,
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
