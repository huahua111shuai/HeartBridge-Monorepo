import request from '@/utils/request'
import type { CrisisAlertVO, CrisisReportReq, InterventionLogReq, PageResult } from '@/types/entity'

export const getAlertList = (params: any) => {
    return request<PageResult<CrisisAlertVO>>({
        url: '/crisis/alert/list',
        method: 'get',
        params
    })
}

export const reportCrisis = (data: CrisisReportReq) => {
    return request<void>({
        url: '/crisis/report',
        method: 'post',
        data
    })
}

export const addInterventionLog = (data: InterventionLogReq) => {
    return request<void>({
        url: '/crisis/intervention',
        method: 'post',
        data
    })
}