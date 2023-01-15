import { useContext, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { RssItem } from '@/api/types'
import APIContext from '@/api/context'
import ReaderContext from '@/components/reader/readerContext'

interface Props {
    item: RssItem
}

export default function ItemDetail({ item }: Props) {
    const { setUnreadCount } = useContext(ReaderContext)
    const { markAsRead } = useContext(APIContext)

    useEffect(() => {
        if (item.url.startsWith('https://twitter.com/')) {
            const tweet = document.createElement('script')
            tweet.setAttribute('src', 'https://platform.twitter.com/widgets.js')
            tweet.setAttribute('defer', 'true')
            document.head.appendChild(tweet)
        }
    }, [item.url])

    const Link = (props: any) => {
        return (
            <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                onClick={() =>
                    markAsRead(item.id).then(({ unreadCount }) => {
                        setUnreadCount(unreadCount)
                    })
                }
                {...props}
            >
                {props.children}
            </a>
        )
    }

    return (
        <div>
            <h3 className={classNames('text-2xl', 'font-bold')}>
                <Link>{item.title}</Link>
            </h3>
            <div
                className={classNames(
                    'text-sm',
                    'text-slate-400',
                    'dark:text-slate-200'
                )}
            >
                <div className={classNames('md:flex', 'md:space-x-4')}>
                    <div>{item.date}</div>
                    <div>
                        <Link>{item.url}</Link>
                    </div>
                </div>
            </div>
            <div className={classNames('h-screen', 'overflow-scroll', 'mt-2')}>
                <div
                    className={classNames(
                        'text-gray-600',
                        'dark:text-gray-200',
                        'mr-10'
                    )}
                    dangerouslySetInnerHTML={{
                        __html: item.content || '',
                    }}
                />
            </div>
        </div>
    )
}
