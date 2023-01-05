import { useContext, useEffect, useRef, useState } from 'react'
import { RssItem } from '@/api/types'
import ReaderContext from '@/components/reader/readerContext'

interface Props {
    item: RssItem
    className?: string
}

export default function ArticleItem({ item, className }: Props) {
    const { openHalfModal, showUnread } = useContext(ReaderContext)

    const Link = (props: any) => {
        return (
            <a href={item.url} target="_blank" rel="noreferrer" {...props}>
                {props.children}
            </a>
        )
    }

    const handleOpenDetail = () => {
        if (item.content) {
            console.log(`open detail page: ${item.title}`)
            openHalfModal(
                <div>
                    <h3 className="text-2xl font-bold">
                        <a href={item.url} target="_blank" rel="noreferrer">
                            {item.title}
                        </a>
                    </h3>
                    <div className="text-sm text-slate-400 dark:text-slate-200">
                        <div className="md:flex md:space-x-4">
                            <div>{item.date}</div>
                            <div>
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {item.url}
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="h-screen overflow-scroll mt-2">
                        <div
                            className="text-gray-600 dark:text-gray-200 mr-10"
                            dangerouslySetInnerHTML={{
                                __html: item.content,
                            }}
                        />
                    </div>
                </div>
            )
        }
    }

    const readClassName = showUnread ? 'opacity-30' : 'hidden'

    return (
        <div
            className={`${className ? className : ''} ${
                item.readAt ? readClassName : ''
            } py-2
max-w-4xl mx-auto
	    `}
        >
            <h2 className="font-bold">
                <Link>{item.title}</Link>
            </h2>
            <div className="md:flex space-x-4 my-2 leading-6">
                <div
                    className="text-gray-600 flex-auto dark:text-gray-400"
                    data-prevent-menu-close="true"
                    onClick={item.content ? handleOpenDetail : undefined}
                    dangerouslySetInnerHTML={{ __html: item.description }}
                />
                {item.imageurl ? (
                    <div className="w-48 flex-none">
                        <img
                            src={item.imageurl}
                            className="max-w-full max-h-36"
                        />
                    </div>
                ) : null}
            </div>
            <div>
                {item.content && (
                    <div
                        className="my-2 hover:text-sky-400 cursor-pointer"
                        data-prevent-menu-close="true"
                        onClick={handleOpenDetail}
                    >
                        Detail
                    </div>
                )}
            </div>

            <Link className="border-t-[1px] text-xs text-gray-600 flex dark:text-gray-400 space-x-4 font-light">
                <div>{item.date}</div>
                <div>{item.site}</div>
                {item.hatenaBookmarkCount > 0 && (
                    <div>
                        {item.hatenaBookmarkCount}
                        users
                    </div>
                )}
            </Link>
        </div>
    )
}
