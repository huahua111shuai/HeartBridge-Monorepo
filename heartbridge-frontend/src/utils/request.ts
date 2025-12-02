import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'

// 定义统一的后端返回结构
interface Result<T = any> {
    code: number
    message: string
    data: T
}

const service: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE || '/api', // 增加 fallback
    timeout: 10000,
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
})

// 请求拦截器
service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const userStore = useUserStore()
        if (userStore.token) {
            config.headers.Authorization = `Bearer ${userStore.token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse<Result>) => {
        // 兼容部分直接返回 data 的情况，或标准的 code-data-message 结构
        const res = response.data
        // 假设后端成功状态码为 200
        if (res.code === 200) {
            return res.data
        } else {
            ElMessage.error(res.message || '系统繁忙，请稍后再试')

            // 401 处理：Token 过期或未登录
            if (res.code === 401) {
                const userStore = useUserStore()
                userStore.logout()
                // 建议使用 router replace 而不是 location.reload 以保持 SPA 体验
                window.location.href = '/auth/login'
            }
            return Promise.reject(new Error(res.message || 'Error'))
        }
    },
    (error) => {
        console.error('Request Error:', error)
        let msg = '网络连接异常'
        if (error.response) {
            const status = error.response.status
            switch (status) {
                case 401: msg = '未授权，请重新登录'; break;
                case 403: msg = '拒绝访问'; break;
                case 404: msg = '请求资源不存在'; break;
                case 500: msg = '服务器内部错误'; break;
                default: msg = error.response.data?.message || `请求错误 ${status}`;
            }
        }
        ElMessage.error(msg)
        return Promise.reject(error)
    }
)

// 封装 Request 方法，支持泛型推断
const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
    return service(config) as Promise<T>
}

export default request