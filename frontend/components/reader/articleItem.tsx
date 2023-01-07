import { useContext } from 'react'
import classNames from 'classnames'
import { RssItem } from '@/api/types'
import ReaderContext from '@/components/reader/readerContext'
import APIContext from '@/api/context'
import useKeyBind from '@/components/hook/useKeyBind'
import ItemDetail from '@/components/reader/itemDetail'

interface Props {
    item: RssItem
    className?: string
    enableKeyBind: boolean
}

export default function ArticleItem({ item, className, enableKeyBind }: Props) {
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

    useKeyBind(
        enableKeyBind
            ? [
                  {
                      key: ' ',
                      ctrlKey: false,
                      action: () => {
                          console.log('keybind: open')
                          window.open(item.url)
                          markAsRead(item).then(({ unreadCount }) => {
                              setUnreadCount(unreadCount)
                          })
                      },
                  },
              ]
            : [],
        [item, enableKeyBind]
    )

    const handleOpenDetail = () => {
        if (item.content) {
            console.log(`open detail page: ${item.title}`)
            openHalfModal(<ItemDetail item={item} />)
        }
    }

    const readClassName = showUnread ? 'opacity-30' : 'hidden'

    return (
        <div
            className={classNames(
                className,
                item.readAt ? readClassName : '',
                'py-2',
                'max-w-4xl',
                'mx-auto'
            )}
            data-id={item.id}
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
