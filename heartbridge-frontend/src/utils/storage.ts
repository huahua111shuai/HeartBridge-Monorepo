const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7

export const setLocal = (key: string, value: any, expire: number | null = DEFAULT_CACHE_TIME) => {
    const storageData = {
        value,
        expire: expire!== null? new Date().getTime() + expire * 1000 : null
    }
    localStorage.setItem(key, JSON.stringify(storageData))
}

export const getLocal = (key: string) => {
    const json = localStorage.getItem(key)
    if (json) {
        const storageData = JSON.parse(json)
        const { value, expire } = storageData
        if (expire === null |

            | expire >= new Date().getTime()) {
            return value
        }
        removeLocal(key)
    }
    return null
}

export const removeLocal = (key: string) => {
    localStorage.removeItem(key)
}

export const clearLocal = () => {
    localStorage.clear()
}