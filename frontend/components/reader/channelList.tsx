import { useContext, useEffect, useState } from 'react'
import { Category, RssChannel } from '@/api/types'
import classNames from 'classnames'
import ReaderContext from '@/components/reader/readerContext'
import useKeyBind from '@/components/hook/useKeyBind'

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
    const { unreadCount, showUnread, showNSFW } = useContext(ReaderContext)
    const hasUnread = unreadCount.categories[category.id] > 0
    const [isOpened, setOpened] = useState<boolean>(hasUnread)
    const readClassName = showUnread ? 'opacity-30' : 'hidden'
    const nsfwClassName = showNSFW ? '' : 'hidden'
    return (
        <div key={category.id} className="mb-3">
            <div
                className={`space-x-2 flex cursor-pointer hover:text-sky-400 text-sm ${
                    hasUnread ? '' : readClassName
                } ${category.isNSFW ? nsfwClassName : ''}`}
                onClick={() => setOpened(!isOpened)}
            >
                <div>{isOpened ? <FolderOpen /> : <Folder />}</div>
                <div>
                    {category.title}({unreadCount.categories[category.id]})
                </div>
            </div>
            {isOpened &&
                (category.channels || []).map((channel) => (
                    <div
                        key={channel.id}
                        className={`text-xs ml-2 p-2 cursor-pointer flex hover:text-sky-400
		    ${
                selected && selected.id == channel.id
                    ? 'font-bold text-sky-400 border-sky-400'
                    : 'border-transparent'
            } ${unreadCount.channels[channel.id] == 0 && readClassName} ${
                            category.isNSFW ? nsfwClassName : ''
                        }`}
                        onClick={() => {
                            onSelect(channel)
                        }}
                    >
                        <div className="shrink truncate whitespace-nowrap">
                            {channel.title}
                        </div>
                        <div>({unreadCount.channels[channel.id]})</div>
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

export default function ChannelList({
    categories,
    className,
    onSelect,
    style,
}: Props) {
    const category = categories.find(({ selected }) => selected)
    const [selected, setSelected] = useState<RssChannel | undefined>(undefined)

    const { unreadCount } = useContext(ReaderContext)

    const handleChannelSelect = (forward: boolean) => {
        if (!selected) {
            return
        }
        const channels = categories.flatMap(({ channels }) => channels || [])
        const index = channels.findIndex(({ id }) => id == selected.id)
        if (forward) {
            console.log(channels.slice(index))
            const target = channels
                .slice(index + 1)
                .find((channel) => unreadCount.channels[channel.id] > 0)
            setSelected(target)
        } else {
            const target = channels
                .slice(0, index)
                .reverse()
                .find((channel) => unreadCount.channels[channel.id] > 0)
            setSelected(target)
        }
    }

    useKeyBind(
        [
            {
                key: 'n',
                ctrlKey: true,
                action: () => {
                    console.log('keybind: move next channel')
                    handleChannelSelect(true)
                },
            },
            {
                key: 'p',
                ctrlKey: true,
                action: () => {
                    console.log('keybind: move previous channel')
                    handleChannelSelect(false)
                },
            },
        ],
        [selected, unreadCount]
    )

    useEffect(() => {
        const channel = (() => {
            if (!category) {
                return undefined
            }
            if (!category.channels) {
                return undefined
            }
            return category.channels.find(({ items }) => items.length > 0)
        })()
        setSelected(channel)
        if (channel && onSelect) {
            console.log(`Initial select: ${channel.title}`)
            onSelect(channel)
        }
    }, [categories])

    useEffect(() => {
        if (onSelect && selected) {
            onSelect(selected)
        }
    }, [selected])

    return (
        <div className={classNames(className, 'ml-2')} style={style}>
            {categories.map((category) => {
                return (
                    <Category
                        key={category.id}
                        category={category}
                        selected={selected}
                        onSelect={(channel) => {
                            setSelected(channel)
                        }}
                    />
                )
            })}
        </div>
    )
}
