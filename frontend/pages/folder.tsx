import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

export default function Folder() {
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
                <Link href="/">Back</Link>
            </main>
        </>
    )
}
