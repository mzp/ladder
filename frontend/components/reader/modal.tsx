import { useContext, ReactNode } from 'react'
import ReaderContext from '@/components/reader/readerContext'
import classNames from 'classnames'

interface Props {
    className?: string
    onClose?(): void
    children?: ReactNode
}

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

export default function Modal() {
    const { modal, openModal } = useContext(ReaderContext)

    return (
        <div
            className={classNames(
                'w-[600px]',
                'h-[300px]',
                'rounded-lg',
                'py-4',
                'px-10',
                'bg-white',
                'dark:bg-slate-800',
                'shadow',
                'm-auto',
                'absolute',
                'top-0',
                'left-0',
                'right-0',
                'bottom-0',
                'z-40',
                modal ? '' : 'hidden'
            )}
        >
            <button
                className="hover:text-sky-400"
                onClick={() => openModal(null)}
            >
                <Xmark />
            </button>
            {modal}
        </div>
    )
}
