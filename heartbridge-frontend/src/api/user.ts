import request from '@/utils/request'
import type { UserUpdateReq, PasswordUpdateReq } from '@/types/entity'

export const updateUserInfo = (data: UserUpdateReq) => {
    return request<void>({
        url: '/user/update',
        method: 'put',
        data
    })
}

export const changePassword = (data: PasswordUpdateReq) => {
    return request<void>({
        url: '/user/password',
        method: 'put',
        data
    })
}

// 上传头像通常返回图片的 URL string
export const uploadAvatar = (formData: FormData) => {
    return request<string>({
        url: '/common/upload',
        method: 'post',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}