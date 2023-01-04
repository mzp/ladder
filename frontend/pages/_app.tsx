import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { APIProvider } from '@/api/context'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <APIProvider>
            <Component {...pageProps} />
        </APIProvider>
    )
}
