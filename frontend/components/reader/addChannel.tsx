import { useContext, useRef, useEffect, useState } from 'react'
import APIContext from '@/api/context'

interface Props {
    className?: string
    onClose?(): void
}

function Check() {
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
                d="M4.5 12.75l6 6 9-13.5"
            />
        </svg>
    )
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

function FeedURL({ url }: { url: string }) {
    const { newChannel, createChannel } = useContext(APIContext)
    const [isFinished, setFinished] = useState<boolean>(false)

    function handleClick() {
        createChannel(url).then(() => setFinished(true))
    }

    return (
        <div className="flex items-center">
            <div>
                <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-sky-400"
                >
                    {url}
                </a>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white m-2 p-1 text-sm rounded"
                    onClick={handleClick}
                >
                    Add
                </button>
            </div>
            {isFinished ? <Check /> : ''}
        </div>
    )
}

export default function AddChannel({ className, onClose }: Props) {
    const ref = useRef<HTMLInputElement>(null)
    const [urls, setURLs] = useState<string[]>([])
    const { newChannel } = useContext(APIContext)

    return (
        <div
            className={`w-[600px] h-[300px] rounded-lg py-4 px-10 bg-white shadow m-auto absolute top-0 left-0 right-0 bottom-0 ${
                className ? className : ''
            }`}
        >
            <button className="hover:text-sky-400" onClick={onClose}>
                <Xmark />
            </button>
            <form
                className="my-4 flex space-x-2"
                onSubmit={(event) => {
                    event.preventDefault()
                    if (ref.current) {
                        newChannel(ref.current.value).then(({ urls }) =>
                            setURLs(urls)
                        )
                    }
                }}
            >
                <input
                    ref={ref}
                    type="text"
                    className="p-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-[500px]"
                    placeholder="http://example.com"
                />
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-sm rounded"
                >
                    Add
                </button>
            </form>
            <div>
                {urls.map((url) => (
                    <FeedURL key={url} url={url} />
                ))}
            </div>
        </div>
    )
}
