import { useContext, useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { Category, RssChannel, RssItem } from '@/api/types'
import { default as APIContext, BackendAPI } from '@/api/context'
import AddChannel from '@/components/addChannel'
import ItemList from '@/components/reader/itemList'
import Toolbar from '@/components/toolbar'
import ItemDetail from '@/components/reader/itemDetail'
import ChannelList from '@/components/reader/channelList'
import ChannelSummary from '@/components/reader/channelSummary'
import useLocalStorage from '@/components/hook/useLocalStorage'
import {
    ReaderContextProvider,
    default as ReaderContext,
} from '@/components/reader/readerContext'
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
function Content() {
    const [categories, setCategories] = useState<Category[]>([])
    const [selected, setSelected] = useState<RssChannel | null>(null)

    const [fetchInitalChannel, storeInitialChannel] =
        useLocalStorage('initial-channel-id')
    const [fetchShowUnread, storeShowUnread] = useLocalStorage('show-unread')
    const [fetchShowNSFW, storeShowNSFW] = useLocalStorage('show-nsfw')

    const [showAddChannelModal, setShowAddChannelModal] =
        useState<boolean>(false)

    const api = useContext(APIContext)
    const { setUnreadCount, setShowNSFW, setShowUnread, showNSFW, showUnread } =
        useContext(ReaderContext)

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
                <div className="w-80 flex-none border-r-[1px]">
                    <Toolbar className="h-8" />
                    <div className="mb-2 flex space-x-1">
                        <button
                            className="hover:text-sky-400"
                            onClick={() => setShowAddChannelModal(true)}
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
                                setSelected(channel)
                                storeInitialChannel(channel.id)
                            }}
                        />
                    )}
                </div>
                <div className="w-full">
                    {selected ? (
                        <ChannelSummary
                            channel={selected}
                            className="snap-start h-24 py-4 px-4"
                        />
                    ) : null}
                    {selected ? (
                        <ItemList
                            height="calc(100vh - 5rem)"
                            channel={selected}
                            items={selected.items}
                        />
                    ) : null}
                </div>
            </div>
            <ItemDetail />
            <AddChannel
                className={`${showAddChannelModal ? '' : 'hidden'}`}
                onClose={() => setShowAddChannelModal(false)}
            />
        </>
    )
}

export default function Home() {
    return (
        <>
            <Head>
                <title>Ultraladder</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </Head>
            <main>
                <ReaderContextProvider>
                    <Content />
                </ReaderContextProvider>
            </main>
        </>
    )
}
