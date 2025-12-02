import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
    {
        path: '/auth',
        children: [
            {
                path: 'login',
                name: 'Login',
                component: () => import('@/views/auth/Login.vue'),
                meta: { title: '登录' }
            },
            {
                path: 'register',
                name: 'Register',
                component: () => import('@/views/auth/Register.vue'),
                meta: { title: '注册' }
            }
        ]
    },
    {
        path: '/student',
        component: () => import('@/components/layout/StudentLayout.vue'),
        meta: { roles: ['student'] },
        children: [
            {
                path: 'home',
                name: 'StudentHome',
                component: () => import('@/views/student/home/Dashboard.vue'),
                meta: { title: '学生首页' }
            },
            {
                path: 'assessment',
                name: 'StudentAssessment',
                children: [
                    { path: '', component: () => import('@/views/student/assessment/AssessmentList.vue') },
                    { path: ':id/do', component: () => import('@/views/student/assessment/AssessmentDo.vue') },
                    { path: 'result/:recordId', component: () => import('@/views/student/assessment/AssessmentResult.vue') }
                ]
            },
            {
                path: 'appointment',
                name: 'StudentAppointment',
                children: [
                    { path: '', redirect: '/student/appointment/booking' },
                    { path: 'booking', component: () => import('@/views/student/appointment/Booking.vue') },
                    { path: 'history', component: () => import('@/views/student/appointment/History.vue') }
                ]
            },
            {
                path: 'profile',
                name: 'StudentProfile',
                children: [
                    { path: 'info', component: () => import('@/views/student/profile/Info.vue') },
                    { path: 'password', component: () => import('@/views/student/profile/ChangePassword.vue') }
                ]
            }
        ]
    },
    {
        path: '/admin',
        component: () => import('@/components/layout/AdminLayout.vue'),
        meta: { roles: ['admin', 'counselor'] },
        redirect: '/admin/dashboard/workbench',
        children: [
            {
                path: 'dashboard',
                name: 'AdminDashboard',
                children: [
                    { path: 'workbench', component: () => import('@/views/admin/dashboard/Workbench.vue') },
                    { path: 'analysis', component: () => import('@/views/admin/dashboard/Analysis.vue') }
                ]
            },
            {
                path: 'appointment',
                name: 'AdminAppointment',
                children: [
                    { path: 'management', component: () => import('@/views/admin/appointment/Management.vue') },
                    { path: 'schedule', component: () => import('@/views/admin/appointment/Schedule.vue') }
                ]
            },
            {
                path: 'users',
                name: 'AdminUsers',
                children: [
                    { path: 'user-list', component: () => import('@/views/admin/users/UserList.vue') },
                    { path: 'role-list', component: () => import('@/views/admin/users/RoleList.vue') }
                ]
            },
            {
                path: 'content',
                name: 'AdminContent',
                children: [
                    { path: 'article/list', component: () => import('@/views/admin/content/ArticleList.vue') },
                    { path: 'article/editor', component: () => import('@/views/admin/content/ArticleEditor.vue') }
                ]
            },
            {
                path: 'crisis',
                name: 'AdminCrisis',
                children: [
                    { path: 'alert-list', component: () => import('@/views/admin/crisis/AlertList.vue') },
                    { path: 'intervention', component: () => import('@/views/admin/crisis/Intervention.vue') }
                ]
            }
        ]
    },
    {
        path: '/',
        redirect: '/auth/login'
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/auth/login'
    }
]