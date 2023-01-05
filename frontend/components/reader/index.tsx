import { useContext, useState, useEffect, useRef } from 'react'
import Link from 'next/link'

import { Category, RssChannel, RssItem } from '@/api/types'
import { default as APIContext, BackendAPI } from '@/api/context'

import Toolbar from '@/components/toolbar'
import DropMenu from '@/components/dropMenu'

import AddChannel from '@/components/reader/addChannel'
import Modal from '@/components/reader/modal'
import ItemList from '@/components/reader/itemList'
import HalfModal from '@/components/reader/halfModal'
import ChannelList from '@/components/reader/channelList'
import ChannelSummary from '@/components/reader/channelSummary'

import useLocalStorage from '@/components/hook/useLocalStorage'
import { default as ReaderContext } from '@/components/reader/readerContext'
import classNames from 'classnames'
function PlusSmall() {
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
                d="M12 6v12m6-6H6"
            />
        </svg>
    )
}

function Eye() {
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
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
        </svg>
    )
}
function EyeSlash() {
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
                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
            />
        </svg>
    )
}
function Bookmark() {
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
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
            />
        </svg>
    )
}
function BookmarkSlash() {
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
                d="M3 3l1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 011.743-1.342 48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664L19.5 19.5"
            />
        </svg>
    )
}
function Bar4() {
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
                d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
            />
        </svg>
    )
}

function Cog() {
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
                d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
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

export default function Reader() {
    const [categories, setCategories] = useState<Category[]>([])
    const [selected, setSelected] = useState<RssChannel | null>(null)
    const [showChannelList, setShowChannelList] = useState<boolean>(false)

    const [fetchInitalChannel, storeInitialChannel] =
        useLocalStorage('initial-channel-id')
    const [fetchShowUnread, storeShowUnread] = useLocalStorage('show-unread')
    const [fetchShowNSFW, storeShowNSFW] = useLocalStorage('show-nsfw')

    const [showAddChannelModal, setShowAddChannelModal] =
        useState<boolean>(false)

    const api = useContext(APIContext)
    const {
        setUnreadCount,
        setShowNSFW,
        setShowUnread,
        showNSFW,
        showUnread,
        openModal,
    } = useContext(ReaderContext)

    useEffect(() => {
        console.log('load initial data')
        api.items(fetchInitalChannel() || '').then(
            ({ categories, unreadCount }) => {
                setCategories(categories)
                setUnreadCount(unreadCount)
            }
        )
        const showUnread = fetchShowUnread() != 'false'
        console.log(`restored unread: ${showUnread}`)
        setShowUnread(showUnread)

        const showNSFW = fetchShowNSFW() != 'false'
        console.log(`restored nsfw: ${showNSFW}`)
        setShowNSFW(showNSFW)
    }, [])

    const handleToggleUnread = () => {
        const value = !showUnread
        setShowUnread(value)
        storeShowUnread(value)
    }
    const handleToggleNSFW = () => {
        const value = !showNSFW
        setShowNSFW(value)
        storeShowNSFW(value)
    }

    return (
        <>
            <div className="flex h-screen">
                <div
                    className={classNames(
                        'md:w-80',
                        'w-3/4',
                        'flex-none',
                        'border-r-[1px]',
                        'transition',
                        'ease-in-out',
                        'duration-200',
                        'bg-white',
                        'z-10',
                        'fixed',
                        'md:relative',
                        showChannelList ? 'translate-x-0' : '-translate-x-full',
                        'md:translate-x-0'
                    )}
                >
                    <Toolbar className="h-8">
                        <DropMenu icon={<Cog />} width={150}>
                            <Link
                                className="hover:text-sky-400"
                                href="/settings/feeds"
                            >
                                Settings
                            </Link>
                        </DropMenu>
                        <button
                            className={classNames(
                                'hover:text-sky-400',
                                'md:hidden'
                            )}
                            onClick={() => setShowChannelList(false)}
                        >
                            <Xmark />
                        </button>
                    </Toolbar>
                    <div className="mb-2 flex space-x-1">
                        <button
                            className="hover:text-sky-400"
                            onClick={() =>
                                openModal(
                                    <AddChannel
                                        onClose={() => openModal(null)}
                                    />
                                )
                            }
                        >
                            <PlusSmall />
                        </button>
                        <button
                            className={`hover:text-sky-400 ${
                                showUnread ? '' : 'text-gray-400'
                            }`}
                            title={showNSFW ? 'Hide Unread' : 'Show Unread'}
                            onClick={handleToggleUnread}
                        >
                            {showUnread ? <Bookmark /> : <BookmarkSlash />}
                        </button>
                        <button
                            className={`hover:text-sky-400 ${
                                showNSFW ? '' : 'text-gray-400'
                            }`}
                            title={showNSFW ? 'Hide NSFW' : 'Show NSFW'}
                            onClick={handleToggleNSFW}
                        >
                            {showNSFW ? <Eye /> : <EyeSlash />}
                        </button>
                    </div>
                    {categories && categories.length && (
                        <ChannelList
                            className="overflow-scroll snap-y"
                            categories={categories}
                            style={{ height: 'calc(100vh - 2rem)' }}
                            onSelect={(channel) => {
                                setShowChannelList(false)
                                setSelected(channel)
                                storeInitialChannel(channel.id)
                            }}
                        />
                    )}
                </div>
                <div className="w-full">
                    <div
                        className={classNames(
                            'backdrop-blur-sm',
                            'w-full',
                            'bg-slate-200/90',
                            'border-b-[1px]',
                            'border-slate-300',
                            'md:h-24',
                            'py-4',
                            'px-4',
                            'flex',
                            'space-x-2'
                        )}
                    >
                        <div
                            className={classNames(
                                'md:hidden',
                                'hover:text-sky-400',
                                'cursor-pointer'
                            )}
                            onClick={() => setShowChannelList(!showChannelList)}
                        >
                            <Bar4></Bar4>
                        </div>
                        {selected ? (
                            <ChannelSummary
                                channel={selected}
                                className="flex-auto"
                            />
                        ) : null}
                    </div>
                    {selected ? (
                        <ItemList
                            height="calc(100vh - 5rem)"
                            channel={selected}
                            items={selected.items}
                        />
                    ) : null}
                </div>
            </div>
            <HalfModal />
            <Modal />
        </>
    )
}
