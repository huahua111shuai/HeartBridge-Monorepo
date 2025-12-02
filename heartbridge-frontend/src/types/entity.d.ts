// 通用响应结构
export interface Result<T = any> {
    code: number
    message: string
    data: T
}

export interface PageResult<T> {
    records: T[]
    total: number
    size: number
    current: number
}

// 认证相关
export interface LoginReq {
    username?: string
    password?: string
    role?: string
    remember?: boolean
}

export interface RegisterReq {
    studentId: string
    name: string
    department: string
    password: string
}

export interface TokenVO {
    token: string
    expire: number
}

export interface UserInfoVO {
    id: number | string
    username: string
    name: string
    nickname?: string
    avatar: string
    role: 'admin' | 'student' | 'counselor'
    department?: string
    studentId?: string
}

export interface UserUpdateReq {
    name?: string
    avatar?: string
    gender?: string
    phone?: string
    email?: string
    bio?: string
}

export interface PasswordUpdateReq {
    oldPassword?: string
    newPassword?: string
}

// 预约相关
export interface AppointmentApplyReq {
    providerId: number
    date: string
    timeSlot: string
    type: 'online' | 'offline'
    reason?: string
}

export interface AppointmentAuditReq {
    id: number
    status: 'approved' | 'rejected'
    reason?: string
}

export interface AppointmentDetailVO {
    id: number
    studentName: string
    studentId: string
    studentAvatar?: string
    counselorName: string
    date: string
    timeSlot: string
    type: 'online' | 'offline'
    status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'
    note?: string
    meetingLink?: string
}

export interface ScheduleVO {
    id: number
    counselorId: number
    date: string
    slots: { time: string; status: 'available' | 'booked' | 'blocked' }[]
}

// 文章相关
export interface ArticleVO {
    id: number
    title: string
    content?: string
    cover?: string
    category: string
    tags?: string[] | string
    status: number
    views?: number
    createTime?: string
}

export interface ArticlePublishReq {
    id?: number
    title: string
    content: string
    cover?: string
    category: string
    tags?: string[]
    status: number
}

// 危机干预相关
export interface CrisisAlertVO {
    id: number
    studentId: string
    name: string
    college: string
    riskLevel: 'High' | 'Moderate' | 'Low'
    triggers: string[]
    status: 'pending' | 'active' | 'resolved'
    lastUpdate: string
}

export interface CrisisReportReq {
    studentId: string
    level: string
    description: string
}

export interface InterventionLogReq {
    alertId?: number
    studentId?: string
    measures: string[]
    outcome: string
    recorder: string
}

// 测评相关
export interface ScaleDetailVO {
    id: number
    title: string
    description: string
    coverUrl?: string
    questionCount?: number
    estimatedTime?: number
    rating?: number
    questions?: any[]
}

export interface SubmitAnswerReq {
    scaleId: number
    answers: Record<number, any>
}

export interface AssessmentResultVO {
    id: number
    score: number
    severity: string
    interpretation: string
    suggestion: string
    dimensions?: { name: string; value: number }[]
    articles?: any[]
}