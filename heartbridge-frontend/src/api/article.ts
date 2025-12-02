import request from '@/utils/request'
import type { ArticleVO, ArticlePublishReq } from '@/types/entity'

export const getArticlePage = (params: any) => {
    return request<{ records: ArticleVO, total: number }>({
        url: '/content/article/page',
        method: 'get',
        params
    })
}

export const getArticleDetail = (id: string) => {
    return request<ArticleVO>({
        url: `/content/article/${id}`,
        method: 'get'
    })
}

export const publishArticle = (data: ArticlePublishReq) => {
    return request<void>({
        url: '/content/article',
        method: 'post',
        data
    })
}

export const deleteArticle = (id: number) => {
    return request<void>({
        url: `/content/article/${id}`,
        method: 'delete'
    })
}

export const uploadFile = (data: FormData) => {
    return request<string>({
        url: '/common/upload',
        method: 'post',
        data,
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}