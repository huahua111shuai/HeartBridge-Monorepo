import { createPinia } from 'pinia'

const store = createPinia()

export default storeimport { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi, getUserInfo as getUserInfoApi } from '@/api/auth'
import type { LoginReq, UserInfoVO } from '@/types/entity'
import { setToken, getToken, removeToken } from '@/utils/auth'

export const useUserStore = defineStore('user', () => {
    const token = ref(getToken())
    const userInfo = ref<UserInfoVO | null>(null)
    const role = ref<string>('')

    const login = async (data: LoginReq) => {
        const res = await loginApi(data)
        token.value = res.data.token
        setToken(res.data.token)
        await getUserInfo()
    }

    const getUserInfo = async () => {
        const res = await getUserInfoApi()
        userInfo.value = res.data
        role.value = res.data.role
    }

    const logout = () => {
        token.value = ''
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