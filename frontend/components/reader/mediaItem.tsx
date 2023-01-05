import { useContext, useEffect, useRef, useState } from 'react'
import { RssItem } from '@/api/types'
import APIContext from '@/api/context'
import ReaderContext from '@/components/reader/readerContext'

interface Props {
    item: RssItem
    className?: string
}

export default function MediaSummary({ item, className }: Props) {
    const { showUnread } = useContext(ReaderContext)

    const Link = (props: any) => {
        return (
            <a href={item.url} target="_blank" rel="noreferrer" {...props}>
                {props.children}
            </a>
        )
    }

    const readClassName = showUnread ? '' : 'hidden'
    const readTitleClassName = showUnread ? 'opacity-30' : ''

    return (
        <div
            className={`${className ? className : ''} ${
                item.readAt ? readClassName : ''
            } p-2 min-h-[50vh]
	    `}
        >
            <h2
                className={`font-bold truncate ${
                    item.readAt ? readTitleClassName : ''
                }`}
            >
                <Link>{item.title}</Link>
            </h2>
            <Link
                className={`text-xs text-gray-600 flex space-x-4 font-light ${readTitleClassName}`}
            >
                <div>{item.date}</div>
                <div>{item.site}</div>
                {item.hatenaBookmarkCount > 0 && (
                    <div>
                        {item.hatenaBookmarkCount}
                        users
                    </div>
                )}
            </Link>
            <div className="py-2">
                {item.imageurl ? (
                    <a href={item.url} target="_blank" rel="noreferrer">
                        <img src={item.imageurl} className="max-h-[60vh]" />
                    </a>
                ) : null}
                <div
                    className="text-gray-600 text-sm truncate"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                />
            </div>
        </div>
    )
}
