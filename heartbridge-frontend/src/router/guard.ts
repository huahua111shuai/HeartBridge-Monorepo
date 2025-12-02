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
                const role = userStore.role
                next(role === 'admin'? '/admin/dashboard/workbench' : '/student/home')
            } else {
                next()
            }
            return
        }

        if (!token) {
            next(`/auth/login?redirect=${to.fullPath}`)
            return
        }

        if (!userStore.userInfo) {
            try {
                await userStore.getUserInfo()
            } catch (error) {
                userStore.logout()
                next('/auth/login')
                return
            }
        }

        const role = userStore.role
        if (to.meta.roles &&!(to.meta.roles as string).includes(role)) {
            next('/403')
            return
        }

        next()
    })

    router.afterEach(() => {
        NProgress.done()
    })
}