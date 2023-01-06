import { useContext, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { RssItem } from '@/api/types'
import APIContext from '@/api/context'
import ReaderContext from '@/components/reader/readerContext'

interface Props {
    item: RssItem
    className?: string
    enableKeyBind: boolean
}

export default function MediaSummary({ item, className }: Props) {
    const { showUnread, openHalfModal, setUnreadCount } =
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
            openHalfModal(
                <div>
                    <h3 className="text-2xl font-bold">
                        <Link>{item.title}</Link>
                    </h3>
                    <div className="text-sm text-slate-400 dark:text-slate-200">
                        <div className="md:flex md:space-x-4">
                            <div>{item.date}</div>
                            <div>
                                <Link>{item.url}</Link>
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
