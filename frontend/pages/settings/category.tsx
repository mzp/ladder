import Head from 'next/head'
import Link from 'next/link'
import Toolbar from '@/components/toolbar'
import APIContext from '@/api/context'
import { useContext, useEffect, useState } from 'react'

export default function Folder() {
    const [channels, setChannels] = useState<RssChannel[]>([])
    const api = useContext(APIContext)
    useEffect(() => {
        api.channels().then((channels) => {
            setChannels(channels)
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
                        <div className="mt-8 border-l-4 p-2 cursor-pointer border-transparent">
                            <Link href="/settings/feeds">Feeds</Link>
                        </div>
                        <div className="border-l-4 p-2 cursor-pointer font-bold text-sky-400 border-sky-400">
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
                                                onChange={(e) => {
                                                    // TODO: debounce
                                                    console.log(e)
                                                    api.updateChannel(
                                                        channel.id,
                                                        {
                                                            category_id:
                                                                e.target.value,
                                                        }
                                                    )
                                                }}
                                                className="rounded-lg shadow-sm w-32"
                                            >
                                                <option value="0">
                                                    no category
                                                </option>
                                                <option value="1">Mint</option>
                                                <option value="2">
                                                    Chocolate
                                                </option>
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
