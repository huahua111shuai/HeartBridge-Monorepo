import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

export const formatDate = (date: string | Date | undefined, format = 'YYYY-MM-DD HH:mm:ss') => {
    if (!date) return '-'
    return dayjs(date).format(format)
}

export const formatRelativeTime = (date: string | Date | undefined) => {
    if (!date) return '-'
    return dayjs(date).fromNow()
}

export const useDate = () => {
    return {
        format: formatDate,
        fromNow: formatRelativeTime,
        dayjs
    }
}