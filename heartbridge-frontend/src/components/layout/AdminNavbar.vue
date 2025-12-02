<template>
  <header class="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white/70 dark:bg-[#1c1c1e]/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/5 transition-colors">
    <div class="flex items-center gap-4">
      <button
          @click="appStore.toggleSidebar"
          class="p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-white/5 text-gray-500 transition-colors"
      >
        <div class="i-sf-sidebar-left text-xl" />
      </button>

      <el-breadcrumb separator="/" class="hidden md:flex">
        <el-breadcrumb-item :to="{ path: '/admin/dashboard/workbench' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-for="(matched, idx) in $route.matched" :key="idx" v-show="matched.meta.title">
          {{ matched.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="flex items-center gap-4">
      <div class="relative hidden sm:block">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <div class="i-sf-magnifyingglass text-gray-400" />
        </div>
        <input
            type="text"
            placeholder="全局搜索..."
            class="pl-9 pr-4 py-1.5 w-48 bg-gray-100/50 dark:bg-black/20 border-none rounded-lg text-sm focus:w-64 transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
        >
      </div>

      <ThemeSwitch />

      <button class="p-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-white/5 text-gray-500 relative">
        <div class="i-sf-bell text-lg" />
        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-black" />
      </button>

      <div class="h-6 w-px bg-gray-200 dark:bg-white/10 mx-1" />

      <el-dropdown trigger="click" popper-class="apple-dropdown">
        <div class="flex items-center gap-3 cursor-pointer">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ userStore.userInfo?.nickname }}</p>
            <p class="text-xs text-gray-500">{{ roleName }}</p>
          </div>
          <el-avatar :size="36" :src="userStore.userInfo?.avatar" class="border-2 border-white dark:border-white/10 shadow-sm" />
        </div>
        <template #dropdown>
          <el-dropdown-menu class="w-48 p-1">
            <el-dropdown-item>
              <div class="flex items-center gap-2"><div class="i-sf-person" /> 个人资料</div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div class="flex items-center gap-2"><div class="i-sf-gear" /> 系统设置</div>
            </el-dropdown-item>
            <el-dropdown-item divided class="text-red-500 hover:!bg-red-50" @click="handleLogout">
              <div class="flex items-center gap-2"><div class="i-sf-power" /> 退出登录</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/store/user'
import { useAppStore } from '@/store/app'
import { useRouter } from 'vue-router'
import ThemeSwitch from '@/components/common/ThemeSwitch.vue'

const userStore = useUserStore()
const appStore = useAppStore()
const router = useRouter()

const roleName = computed(() => {
  const roleMap: Record<string, string> = {
    admin: '超级管理员',
    counselor: '心理咨询师'
  }
  return roleMap |

      | '管理员'
})

const handleLogout = async () => {
  await userStore.logout()
  router.push('/auth/login')
}
</script>