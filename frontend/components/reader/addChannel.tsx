import { useContext, useRef, useEffect, useState } from 'react'
import classNames from 'classnames';
import APIContext from '@/api/context'

interface Props {
    onClose?(): void
}

function FeedURL({ url, onClose }: { url: string; onClose?(): void }) {
    const { createChannel } = useContext(APIContext)

    function handleClick() {
        createChannel(url).then(() => {
            if (onClose) {
                onClose()
            }
        })
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
        </div>
    )
}

export default function AddChannel({ onClose }: Props) {
    const ref = useRef<HTMLInputElement>(null)
    const [urls, setURLs] = useState<string[]>([])
    const { newChannel } = useContext(APIContext)

    return (
        <div>
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
                    <FeedURL key={url} url={url} onClose={onClose} />
                ))}
            </div>
        </div>
    )
}
