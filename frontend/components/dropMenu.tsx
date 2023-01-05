import { useState, useEffect, useRef } from 'react'
interface Props {
    width: number
    icon: any
    children: any
    className?: string
}

export default function DropMenu({ className, icon, children, width }: Props) {
    const [opened, setOpened] = useState<boolean>(false)
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (!opened) {
            return
        }
        const listener = (event: any) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return
            }
            setOpened(false)
        }
        document.addEventListener('mousedown', listener)
        document.addEventListener('touchstart', listener)
        return () => {
            document.removeEventListener('mousedown', listener)
            document.removeEventListener('touchstart', listener)
        }
    }, [opened, ref])
    return (
        <div ref={ref}>
            <div
                className="text-slate-400 hover:text-slate-600"
                onClick={() => {
                    setOpened(!opened)
                }}
            >
                {icon}
            </div>
            <div
                style={{ width: `${width}px`, marginLeft: `-${width - 20}px` }}
                className={`text-sm flex ${className ? className : ''}
		 ${opened ? '' : 'hidden'}
		 flex-col bg-white dark:bg-slate-900 ring-1 ring-slate-900/5 shadow fixed p-2 rounded-lg space-y-2 mt-[1px] z-10`}
            >
                {children}
            </div>
        </div>
    )
}
