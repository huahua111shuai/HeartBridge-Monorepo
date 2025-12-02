import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi, getUserInfo as getUserInfoApi } from '@/api/auth'
import type { LoginReq, UserInfoVO } from '@/types/entity'
import { setToken, getToken, removeToken } from '@/utils/auth'

export const useUserStore = defineStore('user', () => {
    // State
    const token = ref<string | null>(getToken())
    const userInfo = ref<UserInfoVO | null>(null)
    const role = ref<string>('')

    // Actions
    const login = async (data: LoginReq) => {
        try {
            const res = await loginApi(data)
            // 兼容直接返回 token 字符串或对象的情况
            const tokenValue = typeof res === 'string' ? res : (res as any)?.token

            if (tokenValue) {
                token.value = tokenValue
                setToken(tokenValue)
                await getUserInfo()
                return true
            }
            return false
        } catch (error) {
            console.error('Login failed:', error)
            throw error
        }
    }

    const getUserInfo = async () => {
        if (!token.value) return
        try {
            const res = await getUserInfoApi()
            userInfo.value = res
            if (res.role) {
                role.value = res.role
            }
        } catch (error) {
            console.error('Get user info failed:', error)
            logout()
        }
    }

    const logout = () => {
        token.value = null
        userInfo.value = null
        role.value = ''
        removeToken()
    }

    return {
        token,
        userInfo,
        role,
        login,
        getUserInfo,
        logout
    }
})