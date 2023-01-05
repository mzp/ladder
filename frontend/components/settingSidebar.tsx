import Link from 'next/link'
import getConfig from 'next/config'
import classNames from 'classnames'

const { publicRuntimeConfig } = getConfig()

type Props = {
    active: string
}

export default function SettingSidebar({ active }: Props) {
    function className(type: string): string {
        return type == active
            ? 'p-2 border-l-4 font-bold text-sky-400 border-sky-400'
            : 'p-2 border-l-4 border-transparent'
    }

    return (
        <div>
            <div className={`md:mt-8 ${className('feeds')}`}>
                <Link href="/settings/feeds">Feeds</Link>
            </div>
            <div className={`${className('categories')}`}>
                <Link href="/settings/categories">Category</Link>
            </div>
            <a
                className={classNames('hover:text-sky-400', className('job'))}
                href={`${publicRuntimeConfig.apiRoot}/sidekiq`}
                target="_blank"
                rel="noreferrer"
            >
                Job Monitor
            </a>
            <div className="p-2 md:mt-4">
                <Link href="/">←Back</Link>
            </div>
        </div>
    )
}
