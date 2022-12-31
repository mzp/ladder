export interface RssItemType {
    url: string
    title: string
    site: string
    date: string
    imageurl: string | null
    description: string
    hatena_bookmark_count: number
}

interface Props {
    item: RssItemType
}

export default function RssItem(props: Props) {
    const item = props.item
    const Link = (props) => {
        return (
            <a href={item.url} target="_blank" {...props}>
                {props.children}
            </a>
        )
    }

    return (
        <div>
            <h2 className="font-bold">
                <Link>{item.title}</Link>
            </h2>
            <div className="flex space-x-4 my-2 leading-6">
                <div
                    className="text-gray-600"
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
            <Link className="border-t-[1px] text-xs text-gray-600 flex space-x-4 font-light">
                <div>{item.date}</div>
                <div>{item.site}</div>
                {item.hatena_bookmark_count > 0 ? (
                    <div>
                        {item.hatena_bookmark_count}
                        <span className="text-xs">users</span>
                    </div>
                ) : null}
            </Link>
        </div>
    )
}
