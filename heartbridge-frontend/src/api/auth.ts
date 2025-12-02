import request from '@/utils/request'
import type { LoginReq, RegisterReq, TokenVO, UserInfoVO, Result } from '@/types/entity'

// 明确泛型，让 request 知道返回的数据类型
export const login = (data: LoginReq) => {
    return request<TokenVO>({
        url: '/auth/login',
        method: 'post',
        data
    })
}

export const register = (data: RegisterReq) => {
    return request<void>({
        url: '/auth/register',
        method: 'post',
        data
    })
}

export const getUserInfo = () => {
    return request<UserInfoVO>({
        url: '/user/info',
        method: 'get'
    })
}

export const logout = () => {
    return request<void>({
        url: '/auth/logout',
        method: 'post'
    })
}