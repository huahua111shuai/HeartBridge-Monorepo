<template>
  <nav class="fixed top-0 left-0 right-0 z-50 h-16 bg-white/70 dark:bg-[#1c1c1e]/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 transition-colors duration-500">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
      <div class="flex items-center gap-2 cursor-pointer" @click="$router.push('/student/home')">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <div class="i-sf-heart-fill text-lg" />
        </div>
        <span class="text-lg font-bold text-gray-900 dark:text-white tracking-tight">HeartBridge</span>
      </div>

      <div class="hidden md:flex items-center gap-1 bg-gray-100/50 dark:bg-white/5 p-1 rounded-full border border-gray-200/50 dark:border-white/5 backdrop-blur-md">
        <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 relative group"
            active-class="bg-white dark:bg-[#2c2c2e] text-blue-600 dark:text-blue-400 shadow-sm"
        >
          <span class="relative z-10 flex items-center gap-2">
            <div :class="item.icon" class="text-base" />
            {{ item.name }}
          </span>
          <div class="absolute inset-0 rounded-full hover:bg-gray-200/50 dark:hover:bg-white/5 transition-colors" v-if="!$route.path.includes(item.path)" />
        </router-link>
      </div>

      <div class="flex items-center gap-4">
        <ThemeSwitch />

        <el-dropdown trigger="click" popper-class="apple-dropdown">
          <div class="flex items-center gap-2 cursor-pointer pl-2 py-1 pr-1 rounded-full hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">{{ userStore.userInfo?.nickname || userStore.userInfo?.name || '同学' }}</span>
            <el-avatar :size="32" :src="userStore.userInfo?.avatar" class="border border-gray-200 dark:border-white/10" />
          </div>
          <template #dropdown>
            <el-dropdown-menu class="w-48 p-2">
              <div class="px-4 py-2 border-b border-gray-100 dark:border-white/5 mb-1">
                <p class="text-xs text-gray-400">已登录账号</p>
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ userStore.userInfo?.username }}</p>
              </div>
              <el-dropdown-item @click="$router.push('/student/profile/info')">
                <div class="flex items-center gap-2"><div class="i-sf-person-crop-circle" /> 个人中心</div>
              </el-dropdown-item>
              <el-dropdown-item @click="$router.push('/student/appointment/history')">
                <div class="flex items-center gap-2"><div class="i-sf-clock" /> 预约记录</div>
              </el-dropdown-item>
              <el-dropdown-item divided class="text-red-500 hover:!bg-red-50 dark:hover:!bg-red-900/10" @click="handleLogout">
                <div class="flex items-center gap-2"><div class="i-sf-rectangle-portrait-and-arrow-right" /> 退出登录</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'
import ThemeSwitch from '@/components/common/ThemeSwitch.vue'

const userStore = useUserStore()
const router = useRouter()

const navItems = [
  { name: '首页', path: '/student/home', icon: 'i-sf-house-fill' },
  { name: '心理测评', path: '/student/assessment', icon: 'i-sf-doc-text-fill' },
  { name: '预约咨询', path: '/student/appointment', icon: 'i-sf-calendar' },
]

const handleLogout = async () => {
  await userStore.logout()
  router.push('/auth/login')
}
</script>

<style>
.apple-dropdown {
  border-radius: 16px!important;
  border: 1px solid rgba(255,255,255,0.1)!important;
  background: rgba(255, 255, 255, 0.8)!important;
  backdrop-filter: blur(20px)!important;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1)!important;
  padding: 6px!important;
}
.dark.apple-dropdown {
  background: rgba(30, 30, 30, 0.8)!important;
  border-color: rgba(255,255,255,0.1)!important;
}
.apple-dropdown .el-dropdown-menu__item {
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 2px;
}
</style>