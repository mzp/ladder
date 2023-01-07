import { useContext, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { RssItem } from '@/api/types'
import ReaderContext from '@/components/reader/readerContext'
import ItemDetail from '@/components/reader/itemDetail'
import APIContext from '@/api/context'

interface Props {
    item: RssItem
    className?: string
    enableKeyBind: boolean
}

export default function MediaSummary({ item, className }: Props) {
    const { openHalfModal, showUnread, setUnreadCount } =
        useContext(ReaderContext)
    const { markAsRead } = useContext(APIContext)
    const Link = (props: any) => {
        return (
            <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                onClick={() =>
                    markAsRead(item).then(({ unreadCount }) => {
                        setUnreadCount(unreadCount)
                    })
                }
                {...props}
            >
                {props.children}
            </a>
        )
    }

    const readClassName = showUnread ? '' : 'hidden'
    const readTitleClassName = showUnread ? 'opacity-30' : ''

    const handleOpenDetail = () => {
        if (item.content) {
            console.log(`open detail page: ${item.title}`)
            openHalfModal(<ItemDetail item={item} />)
        }
    }

    return (
        <div
            className={classNames(
                className,
                item.readAt && readClassName,
                'p-2',
                'w-full',
                'min-h-[50vh]'
            )}
        >
            <h2
                className={classNames(
                    'font-bold',
                    'truncate',
                    item.readAt && readTitleClassName
                )}
            >
                <Link>{item.title}</Link>
            </h2>
            <Link
                className={classNames(
                    'text-xs',
                    'text-gray-600',
                    'flex',
                    'space-x-4',
                    'font-light',
                    item.readAt && readTitleClassName
                )}
            >
                <div>{item.date}</div>
                <div>{item.site}</div>
            </Link>
            <div className="py-2">
                {item.imageurl ? (
                    <Link>
                        <img
                            src={item.imageurl}
                            className={classNames('max-h-[60vh]')}
                        />
                    </Link>
                ) : null}
                <div
                    className="text-gray-600 text-sm truncate"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                />
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
        </div>
    )
}
