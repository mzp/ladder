import { useContext, useEffect, useRef, useState } from 'react'
import { RssItem } from '@/api/types'
import APIContext from '@/api/context'

interface Props {
    item: RssItem
    className?: string
}

export default function MediaSummary({ item, className }: Props) {
    const api = useContext(APIContext)

    
    const Link = (props: any) => {
        return (
            <a href={item.url} target="_blank" {...props}>
                {props.children}
            </a>
        )
    }

    const handleOpenDetail = () => {
        console.log(`open detail page: ${item.title}`)
        api.openDetail(item)
    }
    const readClassName = api.showUnread ? 'opacity-30' : 'hidden'

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
            <div className="py-2 ">
                {item.imageurl ? (
                    <a href={item.url} target="_blank">
                        <img
                            src={item.imageurl}
                            className="min-h-[400px] max-h-[30vh]"
                        />
                    </a>
                ) : null}
                <div
                    className="text-gray-600 flex-auto"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                />
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
