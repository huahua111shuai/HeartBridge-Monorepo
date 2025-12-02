import request from '@/utils/request'
import type { ScaleDetailVO, ScaleCreateReq, AssessmentResultVO, SubmitAnswerReq } from '@/types/entity'

export const getScaleList = (params: any) => {
    return request<ScaleDetailVO>({
        url: '/assessment/scale/list',
        method: 'get',
        params
    })
}

export const getScaleDetail = (id: number) => {
    return request<ScaleDetailVO>({
        url: `/assessment/scale/${id}`,
        method: 'get'
    })
}

export const submitAssessment = (data: SubmitAnswerReq) => {
    return request<number>({
        url: '/assessment/submit',
        method: 'post',
        data
    })
}

export const getAssessmentResult = (recordId: number) => {
    return request<AssessmentResultVO>({
        url: `/assessment/result/${recordId}`,
        method: 'get'
    })
}