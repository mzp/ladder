import { useContext, useEffect, useRef, ReactNode } from 'react'
import classNames from 'classnames'
import ReaderContext from '@/components/reader/readerContext'

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

export default function HalfModal() {
    const { halfModal, openHalfModal } = useContext(ReaderContext)
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (!halfModal) {
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
            openHalfModal(null)
        }
        document.addEventListener('mousedown', listener)
        document.addEventListener('touchstart', listener)
        return () => {
            document.removeEventListener('mousedown', listener)
            document.removeEventListener('touchstart', listener)
        }
    }, [halfModal, ref])

    return (
        <div
            ref={ref}
            className={classNames(
                'bg-white',
                'p-4',
                'md:px-10',
                'md:pr-0',
                'drop-shadow-lg',
                'w-full',
                'md:w-1/2',
                'right-0',
                'fixed',
                'top-0',
                'h-screen',
                'transition',
                'ease-in-out',
                'duration-200',
                halfModal ? 'translate-x-0' : 'translate-x-full'
            )}
        >
            <div className="bg-white">
                <button
                    onClick={() => openHalfModal(null)}
                    className="hover:text-sky-400"
                >
                    <Xmark />
                </button>
            </div>
            {halfModal}
        </div>
    )
}
