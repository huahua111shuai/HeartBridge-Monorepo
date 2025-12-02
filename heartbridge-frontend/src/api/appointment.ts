import request from '@/utils/request'
import type {
    AppointmentApplyReq,
    AppointmentAuditReq,
    AppointmentDetailVO,
    ScheduleVO,
    PageResult
} from '@/types/entity'

// 学生端接口
export const getStudentAppointments = (params: any) => {
    return request<PageResult<AppointmentDetailVO>>({
        url: '/appointment/student/list',
        method: 'get',
        params
    })
}

export const createAppointment = (data: AppointmentApplyReq) => {
    return request<void>({
        url: '/appointment/apply',
        method: 'post',
        data
    })
}

export const cancelAppointment = (id: number) => {
    return request<void>({
        url: `/appointment/cancel/${id}`,
        method: 'put'
    })
}

// 管理端接口
export const getAdminAppointments = (params: any) => {
    return request<PageResult<AppointmentDetailVO>>({
        url: '/appointment/admin/list',
        method: 'get',
        params
    })
}

export const auditAppointment = (data: AppointmentAuditReq) => {
    return request<void>({
        url: '/appointment/audit',
        method: 'put',
        data
    })
}

export const getSchedules = (params: any) => {
    return request<ScheduleVO[]>({
        url: '/appointment/schedule/list',
        method: 'get',
        params
    })
}

export const updateSchedule = (data: any) => {
    return request<void>({
        url: '/appointment/schedule/update',
        method: 'put',
        data
    })
}