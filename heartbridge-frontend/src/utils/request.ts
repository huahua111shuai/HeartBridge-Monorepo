import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'

interface Result<T = any> {
    code: number
    message: string
    data: T
}

const service: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
})

service.interceptors.request.use(
    (config) => {
        const userStore = useUserStore()
        if (userStore.token) {
            config.headers.Authorization = `Bearer ${userStore.token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

service.interceptors.response.use(
    (response: AxiosResponse<Result>) => {
        const { code, message, data } = response.data
        if (code === 200) {
            return data
        } else {
            ElMessage.error(message |

                | '系统错误')
            if (code === 401) {
                const userStore = useUserStore()
                userStore.logout()
                location.reload()
            }
            return Promise.reject(new Error(message |

                | 'Error'))
        }
    },
    (error) => {
        const msg = error.response?.data?.message |

            | error.message
        ElMessage.error(msg)
        return Promise.reject(error)
    }
)

// 封装一层以适配 TS 类型
const request = <T = any>(config: AxiosRequestConfig): Promise<{ code: number; message: string; data: T }> => {
    return service(config) as any
}

export default request