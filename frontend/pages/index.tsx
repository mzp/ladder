import { useContext, useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { Category, RssChannel, RssItem } from '@/api/types'
import { default as APIContext, BackendAPI } from '@/api/context'
import ItemList from '@/components/itemList'
import Toolbar from '@/components/toolbar'
import ChannelList from '@/components/channelList'
import ChannelSummary from '@/components/channelSummary'
import useLocalStorage from '@/components/hook/useLocalStorage'

export default function Home() {
    const [categories, setCategories] = useState<Category[]>([])
    const [selected, setSelected] = useState<RssChannel | null>(null)
    const [fetchInitalChannel, storeInitialChannel] =
        useLocalStorage('initial-channel-id')
    const ref = useRef<HTMLDivElement>(null)

    const api = useContext(APIContext)
    useEffect(() => {
        api.items(fetchInitalChannel() || '').then(
            ({ categories, unreadCount }) => {
                setCategories(categories)
                api.setUnreadCount(unreadCount)
            }
        )
    }, [])

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
                <div className="flex h-screen">
                    <div className="w-80 flex-none border-r-[1px]">
                        <Toolbar className="h-8" />
                        {categories.length && (
                            <ChannelList
                                className="overflow-scroll snap-y"
                                categories={categories}
                                style={{ height: 'calc(100vh - 2rem)' }}
                                onSelect={(channel) => {
                                    setSelected(channel)
                                    storeInitialChannel(channel.id)
                                    if (ref.current) {
                                        ref.current.scrollTo(0, 0)
                                    }
                                }}
                            />
                        )}
                    </div>
                    <div className="m-w-3xl">
                        {selected ? (
                            <ChannelSummary
                                channel={selected}
                                className="snap-start h-14 py-1 px-4"
                            />
                        ) : null}
                        {selected ? (
                            <div
                                className="overflow-scroll snap-y snap-mandatory"
                                style={{ height: 'calc(100vh - 3.5rem)' }}
                                ref={ref}
                                onScroll={
                                    api.canMarkAsRead
                                        ? undefined
                                        : () => {
                                              console.log(
                                                  'Scroll detected: enable unread management'
                                              )
                                              ref.current &&
                                                  api.setCanMarkAsRead(
                                                      ref.current.scrollTop >
                                                          100
                                                  )
                                          }
                                }
                            >
                                <ItemList
                                    channel={selected}
                                    items={selected.items}
                                />
                            </div>
                        ) : null}
                    </div>
                </div>
            </main>
        </>
    )
}
