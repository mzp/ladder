import Head from 'next/head'
import Reader from '@/components/reader/index'
import { ReaderContextProvider } from '@/components/reader/readerContext'

export default function Home() {
    return (
        <>
            <Head>
                <title>Ultraladder</title>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </Head>
            <main>
                <ReaderContextProvider>
                    <Reader />
                </ReaderContextProvider>
            </main>
        </>
    )
}
