export interface RssItemType {
    url: string
    title: string
    site: string
    date: string
    imageurl: string | null
    description: string
}

interface Props {
    item: RssItemType
}

export default function RssItem(props: Props) {
    const item = props.item
    return (
        <div>
            <h2 className="font-bold">
                <a href={item.url} target="_blank">
                    {item.title}
                </a>
            </h2>
            <div>
                {' '}
                <a href={item.url} target="_blank">
                    {item.site}
                </a>
            </div>
            <div>{item.date}</div>
            <div className="flex space-x-4">
                {item.imageurl ? (
                    <img src={item.imageurl} className="max-w-40 max-h-24" />
                ) : null}
                <div>{item.description}</div>
            </div>
        </div>
    )
}
