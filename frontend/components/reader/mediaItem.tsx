import { useContext, useEffect, useRef, useState } from 'react'
import { RssItem } from '@/api/types'
import ReaderContext from '@/components/reader/readerContext'
import classNames from 'classnames'

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
                    <a href={item.url} target="_blank" rel="noreferrer">
                        <img
                            src={item.imageurl}
                            className={classNames('max-h-[60vh]')}
                        />
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
