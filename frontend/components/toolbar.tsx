import Link from 'next/link'
import Spin from '@/components/spin'
import Cog from '@/components/cog'
import { useContext, useState, useEffect } from 'react'
import APIContext from '@/api/context'

export default function Toolbar({ className }: { className?: string }) {
    const api = useContext(APIContext)
    return (
        <div className={`text-xl  align-middle bg-white px-2 ${className}`}>
            <div className="flex items-center">
                <h1 className="pr-2 flex-none">Ultraladder</h1>
                <div className="flex-auto">{api.isLoading && <Spin />}</div>
                <div className="text-slate-400">
                    <Link href="/folder">
                        <Cog />
                    </Link>
                </div>
            </div>
        </div>
    )
}
