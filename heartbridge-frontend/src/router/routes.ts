import type { RouteRecordRaw } from 'vue-router'
import component from "*.vue";

export const routes: RouteRecordRaw =
},
{
    path: '/student',
        component: () => import('@/components/layout/StudentLayout.vue'),
    meta: { roles: ['student'] },
    children:
},
{
    path: 'assessment',
        name: 'StudentAssessment',
    children:
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
    children:
},
{
    path: 'appointment',
        name: 'AdminAppointment',
    children:
},
{
    path: 'users',
        name: 'AdminUsers',
    children:
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
    path: '/:pathMatch(.*)*',
        redirect: '/auth/login'
}
]