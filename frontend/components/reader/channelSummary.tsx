import { useContext, useRef } from 'react'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import { RssChannel } from '@/api/types'
import APIContext from '@/api/context'
import ReaderContext from '@/components/reader/readerContext'
import DropMenu from '@/components/dropMenu'

function Adjustment() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
            />
        </svg>
    )
}
interface ChannelSettingProps {
    channel: RssChannel
}
function ChannelSetting({ channel }: ChannelSettingProps) {
    const ref = useRef<HTMLInputElement>(null)
    const api = useContext(APIContext)
    const router = useRouter()

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault()

                if (ref.current) {
                    api.updateChannel(channel.id, {
                        override_title: ref.current.value,
                    }).then(() => {
                        if (router) {
                            router.reload()
                        }
                    })
                }
            }}
        >
            <div className={classNames('mb-4')}>
                <label
                    className={classNames(
                        'block',
                        'text-gray-700',
                        'dark:text-gray-200',
                        'text-sm',
                        'font-bold',
                        'mb-2'
                    )}
                    htmlFor="username"
                >
                    Title
                </label>
                <input
                    className={classNames(
                        'shadow',
                        'appearance-none',
                        'border',
                        'rounded',
                        'w-full',
                        'py-2',
                        'px-3',
                        'text-gray-700',
                        'leading-tight',
                        'focus:outline-none',
                        'focus:shadow-outline'
                    )}
                    id="title"
                    type="text"
                    ref={ref}
                    defaultValue={channel.title}
                    placeholder={channel.originalTitle}
                />
            </div>

            <input
                type="submit"
                className={classNames(
                    'bg-blue-500',
                    'hover:bg-blue-700',
                    'text-white',
                    'font-bold',
                    'py-2',
                    'px-4',
                    'rounded',
                    'focus:outline-none',
                    'focus:shadow-outline'
                )}
                value="Save"
            />
        </form>
    )
}

interface Props {
    channel: RssChannel
    className?: string
}

export default function ChannelSummary({ channel, className }: Props) {
    const { markAllAsRead, updateChannel } = useContext(APIContext)
    const { unreadCount, setUnreadCount, openModal } = useContext(ReaderContext)
    const count = unreadCount.channels[channel.id]
    const router = useRouter()
    return (
        <div
            className={classNames(
                'text-ellipsis',
                'overflow-hidden',
                className
            )}
        >
            <div className="flex">
                <h2
                    className={classNames(
                        'md:text-lg',
                        'font-bold',
                        'flex-auto'
                    )}
                >
                    <a href={channel.url} target="_blank" rel="noreferrer">
                        {channel.title}
                    </a>
                    <span>({unreadCount.channels[channel.id]})</span>
                </h2>
                <DropMenu icon={<Adjustment />} width={180}>
                    <button
                        className="text-left hover:text-sky-400"
                        onClick={() => {
                            updateChannel(channel.id, {
                                image_media: !channel.isImageMedia,
                            }).then((response) => {
                                router.reload()
                            })
                        }}
                    >
                        {channel.isImageMedia ? 'Unmark' : 'Mark'} as image
                        media
                    </button>
                    <button
                        className={classNames(
                            'text-left',
                            count == 0 ? 'opacity-30' : 'hover:text-sky-400'
                        )}
                        onClick={() => {
                            markAllAsRead(channel).then(({ unreadCount }) =>
                                setUnreadCount(unreadCount)
                            )
                        }}
                    >
                        Mark all as read({count})
                    </button>
                    <button
                        className={classNames(
                            'text-left',
                            'hover:text-sky-400'
                        )}
                        onClick={() => {
                            openModal(<ChannelSetting channel={channel} />)
                        }}
                    >
                        More settings
                    </button>
                </DropMenu>
            </div>
            <div className="md:block hidden text-sm">
                <a href={channel.url} target="_blank" rel="noreferrer">
                    {channel.description}
                </a>
            </div>
        </div>
    )
}
