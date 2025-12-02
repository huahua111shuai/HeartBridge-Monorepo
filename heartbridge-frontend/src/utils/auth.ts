const TokenKey = 'heartbridge-token'

export const getToken = (): string | null => {
    return localStorage.getItem(TokenKey)
}

export const setToken = (token: string) => {
    localStorage.setItem(TokenKey, token)
}

export const removeToken = () => {
    localStorage.removeItem(TokenKey)
}