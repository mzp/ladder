import { useContext, useEffect, useRef, useState } from 'react'
import { RssItem } from '@/api/types'
import ReaderContext from '@/components/reader/readerContext'

interface Props {
    item: RssItem
    className?: string
}

export default function ItemSummary({ item, className }: Props) {
    const { openDetail, showUnread } = useContext(ReaderContext)

    const Link = (props: any) => {
        return (
            <a href={item.url} target="_blank" rel="noreferrer" {...props}>
                {props.children}
            </a>
        )
    }

    const handleOpenDetail = () => {
        console.log(`open detail page: ${item.title}`)
        openDetail(item)
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
            <div className="flex space-x-4 my-2 leading-6">
                <div
                    className="text-gray-600 flex-auto"
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

            <Link className="border-t-[1px] text-xs text-gray-600 flex space-x-4 font-light">
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
