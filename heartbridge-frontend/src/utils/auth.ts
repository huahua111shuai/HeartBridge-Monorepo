import { useStorage } from '@vueuse/core'

const TokenKey = 'heartbridge-token'

// Using VueUse's useStorage for reactive local storage, but wrapped for static access
export const getToken = () => {
    return localStorage.getItem(TokenKey)
}

export const setToken = (token: string) => {
    localStorage.setItem(TokenKey, token)
}

export const removeToken = () => {
    localStorage.removeItem(TokenKey)
}