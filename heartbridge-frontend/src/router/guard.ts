import type { Router } from 'vue-router'
import { useUserStore } from '@/store/user'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

export function setupRouterGuard(router: Router) {
    router.beforeEach(async (to, from, next) => {
        NProgress.start()
        const userStore = useUserStore()
        const token = userStore.token

        if (to.path.startsWith('/auth')) {
            if (token) {
                // 如果已登录，重定向到对应角色的首页
                const role = userStore.role
                next(role === 'admin' ? '/admin/dashboard/workbench' : '/student/home')
            } else {
                next()
            }
            return
        }

        if (!token) {
            next(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`)
            return
        }

        // 确保用户信息已加载
        if (!userStore.userInfo) {
            try {
                await userStore.getUserInfo()
            } catch (error) {
                userStore.logout()
                next(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`)
                return
            }
        }

        // 角色权限检查
        const role = userStore.role
        // 如果路由有 roles 元信息，且当前用户角色不在其中
        if (to.meta.roles && Array.isArray(to.meta.roles) && !to.meta.roles.includes(role)) {
            next('/403') // 需要确保 routes 中有定义 /403 或者重定向到首页
            return
        }

        next()
    })

    router.afterEach(() => {
        NProgress.done()
    })
}