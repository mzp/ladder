import Head from 'next/head'
import Link from 'next/link'
import Toolbar from '@/components/toolbar'
import APIContext from '@/api/context'
import { useContext, useEffect, useState } from 'react'

export default function Folder() {
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
                <div className="flex h-screen">
                    <div className="w-64 flex-none border-r-[1px] overflow-scroll snap-y scroll-pt-8">
                        <Toolbar className="w-64 h-8 fixed border-r-[1px]" />
                        <div className="mt-8 border-l-4 p-2 font-bold text-sky-400 border-sky-400">
                            Feeds
                        </div>
                        <div className="border-l-4 p-2 border-transparent">
                            <Link href="/settings/category">Category</Link>
                        </div>
                    </div>
                    <div className="m-w-3xl overflow-scroll snap-y snap-mandatory scroll-pt-14 p-4">
                        <table className="my-10">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {channels.map((channel) => (
                                    <tr key={channel.id}>
                                        <td className="py-2">
                                            <select
                                                value={
                                                    channel.category_id || ''
                                                }
                                                onChange={(e) => {
                                                    api.updateChannel(
                                                        channel.id,
                                                        {
                                                            category_id:
                                                                e.target.value,
                                                        }
                                                    ).then(({ channels }) =>
                                                        setChannels(channels)
                                                    )
                                                }}
                                                className="rounded-lg shadow-sm text-sm"
                                            >
                                                <option value="">
                                                    no category
                                                </option>
                                                {categories.map(
                                                    ({ id, title }) => (
                                                        <option
                                                            value={id}
                                                            key={id}
                                                        >
                                                            {title}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </td>
                                        <td className="px-4 py-2">
                                            {channel.title}
                                        </td>
                                        <td className="px-4 py-2">
                                            {channel.description}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div>
                            <Link
                                href="/"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Close
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
