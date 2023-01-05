import { useContext, useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import classNames from 'classnames'
import { Category, RssChannel } from '@/api/types'
import APIContext from '@/api/context'
import Toolbar from '@/components/toolbar'
import SettingSidebar from '@/components/settingSidebar'

function Trash() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-3 h-3"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
        </svg>
    )
}

interface Props {
    categories: Category[]
    channel: RssChannel
    setChannels(channels: RssChannel[]): void
}
function ChannelRow({ channel, categories, setChannels }: Props) {
    const ref = useRef<HTMLInputElement>(null)
    const api = useContext(APIContext)
    return (
        <div
            className={classNames(
                'my-6',
                'space-y-1',
                'md:grid',
                'md:grid-cols-4',
                'md:gap-x-2',
                'w-full'
            )}
        >
            <div className={classNames('font-bold')}>{channel.title}</div>
            <div className={classNames('text-sm', 'text-gray-600')}>
                {channel.description}
            </div>
            <div className={classNames()}>
                <select
                    value={channel.category_id || ''}
                    onChange={(e) => {
                        api.updateChannel(channel.id, {
                            category_id: e.target.value,
                        }).then((channels) => setChannels(channels))
                    }}
                    className="rounded-lg shadow-sm text-sm w-full"
                >
                    {categories.map(({ id, title }) => (
                        <option value={id} key={id}>
                            {title}
                        </option>
                    ))}
                </select>
            </div>

            <div className={classNames()}>
                <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold p-1 text-sm rounded"
                    onClick={() => {
                        if (
                            confirm(
                                `Do you want to delete "${channel.originalTitle}"?`
                            )
                        ) {
                            api.removeChannel(channel.id).then(setChannels)
                        }
                    }}
                >
                    <Trash />
                </button>
            </div>
        </div>
    )
}

export default function FeedsSetting() {
    const [channels, setChannels] = useState<RssChannel[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const api = useContext(APIContext)
    useEffect(() => {
        api.channels().then(({ channels, categories }) => {
            setChannels(channels)
            setCategories(categories)
        })
    }, [])

    return (
        <>
            <Head>
                <title>Ultraladder - Setting</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </Head>
            <main>
                <div
                    className={classNames(
                        'flex',
                        'h-screen',
                        'md:flex-row',
                        'flex-col'
                    )}
                >
                    <div
                        className={classNames(
                            'md:w-80',
                            'md:flex-none',
                            'md:border-r-[1px]',
                            'border-b-[1px]',
                            'md:border-b-0'
                        )}
                    >
                        <Toolbar className="h-8" />
                        <SettingSidebar active="feeds" />
                    </div>
                    <div className="md:m-w-3xl p-4">
                        <div className="my-10">
                            {channels.map((channel) => (
                                <ChannelRow
                                    channel={channel}
                                    setChannels={setChannels}
                                    categories={categories}
                                    key={channel.id}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
