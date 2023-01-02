import Link from 'next/link'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

type Props = {
    active: string
}

export default function SettingSidebar({ active }: Props) {
    function className(type: string): string {
        return type == active
            ? 'font-bold text-sky-400 border-sky-400'
            : 'border-transparent'
    }

    return (
        <div>
            <div className={`mt-8 border-l-4 p-2 ${className('feeds')}`}>
                <Link href="/settings/feeds">Feeds</Link>
            </div>
            <div className={`border-l-4 p-2 ${className('categories')}`}>
                <Link href="/settings/categories">Category</Link>
            </div>
            <div className="border-l-4 p-2">
                <a href={`${publicRuntimeConfig.apiRoot}/sidekiq`}>Job Monitor</a>
            </div>
            <div className="p-2 mt-4">
                <Link href="/">←Back</Link>
            </div>
        </div>
    )
}
