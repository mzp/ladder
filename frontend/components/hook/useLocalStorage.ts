// https://dev.to/devlargs/nextjs-hook-for-accessing-local-or-session-storage-variables-3n0
//
//
type StorageType = 'session' | 'local'

const useStorage = (key: string, type?: StorageType): any[] => {
    const isBrowser: boolean = ((): boolean => typeof window !== 'undefined')()
    const storageType: 'localStorage' | 'sessionStorage' = `${
        type ?? 'local'
    }Storage`
    const getItem = (): string => {
        return isBrowser ? window[storageType][key] : ''
    }
    const setItem = (value: string): boolean => {
        if (isBrowser) {
            window[storageType].setItem(key, value)
            return true
        }

        return false
    }

    return [getItem, setItem]
}

export default useStorage
