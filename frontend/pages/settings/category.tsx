import Head from 'next/head'
import Link from 'next/link'
import Toolbar from '@/components/toolbar'
import { Category } from '@/api/types'
import APIContext from '@/api/context'
import { useContext, useEffect, useState, useRef } from 'react'

export default function Folder() {
    const [categories, setCategories] = useState<Category[]>([])
    const ref = useRef<HTMLInputElement>(null)
    const api = useContext(APIContext)
    useEffect(() => {
        api.categories().then((categories) => {
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
                        <div className="mt-8 border-l-4 p-2 cursor-pointer border-transparent">
                            <Link href="/settings/feeds">Feeds</Link>
                        </div>
                        <div className="border-l-4 p-2 cursor-pointer font-bold text-sky-400 border-sky-400">
                            Category
                        </div>
                    </div>
                    <div className="m-w-3xl overflow-scroll snap-y snap-mandatory scroll-pt-14 p-4">
                        <form
                            className="my-4 flex space-x-2"
                            onSubmit={(event) => {
                                event.preventDefault()
                                api.createCategory(ref.current.value).then(
                                    setCategories
                                )
                                ref.current.value = ''
                            }}
                        >
                            <input
                                ref={ref}
                                type="text"
                                className="p-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg"
                                placeholder="category"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-sm rounded"
                            >
                                Add
                            </button>
                        </form>
                        <table className="my-4">
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category.id}>
                                        <td className="w-48">
                                            {category.title || '<null>'}
                                        </td>
                                        <td>
                                            <button
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 text-sm rounded"
                                                onClick={() =>
                                                    api
                                                        .removeCategory(
                                                            category.id
                                                        )
                                                        .then(setCategories)
                                                }
                                            >
                                                Remove
                                            </button>
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
