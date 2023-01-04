import { useContext, useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { Category, RssChannel, RssItem } from '@/api/types'
import { default as APIContext, BackendAPI } from '@/api/context'
import AddChannel from '@/components/addChannel'
import ItemList from '@/components/itemList'
import Toolbar from '@/components/toolbar'
import ItemDetail from '@/components/itemDetail'
import ChannelList from '@/components/channelList'
import ChannelSummary from '@/components/channelSummary'
import useLocalStorage from '@/components/hook/useLocalStorage'

function PlusSmall() {
return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
</svg>

}

export default function Home() {
    const [categories, setCategories] = useState<Category[]>([])
    const [selected, setSelected] = useState<RssChannel | null>(null)
    const [fetchInitalChannel, storeInitialChannel] =
        useLocalStorage('initial-channel-id')
    const [showAddChannelModal, setShowAddChannelModal] =
        useState<boolean>(false)

    const ref = useRef<HTMLDivElement>(null)

    const api = useContext(APIContext)
    useEffect(() => {
        console.log('load initial data')
        api.items(fetchInitalChannel() || '').then(
            ({ categories, unreadCount }) => {
                setCategories(categories)
                api.setUnreadCount(unreadCount)
                api.setNeedsRefresh(false)
            }
        )
    }, [api.needsRefresh])

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
			<div className="mb-2">
			  <button className="hover:text-sky-400"
			  onClick={() => setShowAddChannelModal(true)}
			  ><PlusSmall /></button>
			</div>
                        {categories && categories.length && (
                            <ChannelList
                                className="overflow-scroll snap-y"
                                categories={categories}
                                style={{ height: 'calc(100vh - 2rem)' }}
                                onSelect={(channel) => {
                                    setSelected(channel)
                                    storeInitialChannel(channel.id)
                                    api.setCanMarkAsRead(false)
                                    if (ref.current) {
                                        ref.current.scrollTo(0, 0)
                                    }
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
                            <div
                                className="overflow-scroll snap-y snap-mandatory"
                                style={{ height: 'calc(100vh - 5rem)' }}
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
                <ItemDetail
                    className={`transition ease-in-out duration-200 w-1/2 right-0 fixed top-0 h-screen 
	    ${api.detailItem ? 'translate-x-0' : 'translate-x-full'}`}
                />
                <AddChannel
                    className={`${showAddChannelModal ? '' : 'hidden'}`}
                    onClose={() => setShowAddChannelModal(false)}
                />
            </main>
        </>
    )
}
