import { useContext, useEffect, useState } from 'react'
import { Category, RssChannel } from '@/api/types'
import ItemSummary from '@/components/itemSummary'
import APIContext from '@/api/context'

function Folder() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
            />
        </svg>
    )
}

function FolderOpen() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
            />
        </svg>
    )
}

interface CategoryProps {
    category: Category
    onSelect(channel: RssChannel): void
    selected: RssChannel | undefined
}

function Category({ category, selected, onSelect }: CategoryProps) {
    const [isOpened, setOpened] = useState<boolean>(true)
    const { unreadCount } = useContext(APIContext)
    return (
        <div key={category.id} className="mb-3">
            <div
                className="space-x-2 flex cursor-pointer hover:text-sky-400 text-sm"
                onClick={() => setOpened(!isOpened)}
            >
                <div>{isOpened ? <FolderOpen /> : <Folder />}</div>
                <div>{category.title}</div>
            </div>
            {isOpened &&
                (category.channels || []).map((channel) => (
                    <div
                        key={channel.id}
                        className={`border-l-4 text-xs ml-2 p-2 cursor-pointer flex hover:text-sky-400
		    ${
                (selected && selected.id == channel.id)
                    ? 'font-bold text-sky-400 border-sky-400'
                    : 'border-transparent'
            } ${unreadCount[channel.id] == 0 && 'opacity-30'}`}
                        onClick={() => {
                            onSelect(channel)
                        }}
                    >
                        <div className="shrink truncate whitespace-nowrap">
                            {channel.title}
                        </div>
                        <div>({unreadCount[channel.id]})</div>
                    </div>
                ))}
        </div>
    )
}

interface Props {
    categories: Category[]
    className?: string
    onSelect?(channel: RssChannel): void
    style?: { [key: string]: string }
}

export default function ItemList({
    categories,
    className,
    onSelect,
    style,
}: Props) {
    const { unreadCount } = useContext(APIContext)

    const category = categories.find(({ selected }) => selected)

    const [openedCategory, setOpenedCategory] = useState<Category | undefined>(
        category
    )
    const [selected, setSelected] = useState<RssChannel | undefined>(
        (() => {
            if (!category) {
                return undefined
            }
            if (!category.channels) {
                return undefined
            }
            return category.channels.find(({ items }) => items.length > 0)
        })()
    )
    useEffect(() => {
        if (selected && onSelect) {
            console.log(`Initial select: ${selected.title}`)
            onSelect(selected)
        }
    }, [])

    return (
        <div className={`${className} ml-[1px]`} style={style}>
            {categories.map((category) => {
                const isOpened =
                    openedCategory && category.id == openedCategory.id
                return (
                    <Category
                        key={category.id}
                        category={category}
                        selected={selected}
                        onSelect={(channel) => {
                            setSelected(channel)
                            if (onSelect) {
                                onSelect(channel)
                            }
                        }}
                    />
                )
            })}
        </div>
    )
}
