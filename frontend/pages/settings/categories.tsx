import Head from 'next/head'
import Link from 'next/link'
import SettingSidebar from '@/components/settingSidebar'
import Toolbar from '@/components/toolbar'
import { Category } from '@/api/types'
import APIContext from '@/api/context'
import { useContext, useEffect, useState, useRef } from 'react'

type Props = {
    category: Category
    setCategories(categories: Category[]): void
}

function CategoryRow({ category, setCategories }: Props) {
    const ref = useRef<HTMLInputElement>(null)
    const api = useContext(APIContext)
    return (
        <tr>
            <td className="w-48 p-2">
                <input
                    ref={ref}
                    type="text"
                    className="p-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg"
                    defaultValue={category.title || '<null>'}
                />
            </td>
            <td>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 text-sm rounded mx-2"
                    onClick={() =>
                        api
                            .updateCategory(category.id, ref.current.value)
                            .then(setCategories)
                    }
                >
                    Update
                </button>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 text-sm rounded"
                    onClick={() =>
                        api.removeCategory(category.id).then(setCategories)
                    }
                >
                    Remove
                </button>
            </td>
        </tr>
    )
}

export default function CategoryList() {
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
                    <div className="w-80 flex-none border-r-[1px] overflow-scroll snap-y scroll-pt-8">
                        <Toolbar className="w-80 h-8 fixed border-r-[1px]" />
                        <SettingSidebar active="categories" />
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
                                    <CategoryRow
                                        key={category.id}
                                        category={category}
                                        setCategories={setCategories}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </>
    )
}
