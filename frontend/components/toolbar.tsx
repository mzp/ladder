import Link from 'next/link'
import Spin from '@/components/spin'
import Cog from '@/components/cog'

export default function Toolbar(props) {
return                            <div className="text-xl fixed h-16 align-middle bg-white w-64 px-2">
                                <div className="flex items-center">
                                    <h1 className="pr-2 flex-none">Ultraladder</h1>
                                    <div className="flex-auto">{props.isLoading && <Spin />}</div>
				    <div className="text-slate-400"><Link href="/folder"><Cog /></Link></div>
                                </div>
                            </div>
}


