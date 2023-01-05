import { useEffect } from 'react'

export default function useKeyBind(
    keyBinds: { key: string; ctrlKey: boolean; action(): void }[],
    dependentList: any[]
) {
    useEffect(() => {
        const listener = (event: any) => {
            const keyBind = keyBinds.find(
                (bind) => bind.key == event.key && bind.ctrlKey == event.ctrlKey
            )
            if (keyBind) {
                event.preventDefault()
                keyBind.action()
            }
        }
        document.addEventListener('keydown', listener)
        return () => {
            document.removeEventListener('keydown', listener)
        }
    }, dependentList)
}
