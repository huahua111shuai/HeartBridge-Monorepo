<template>
  <aside
      class="relative h-full bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-2xl border-r border-gray-200/50 dark:border-white/5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-40 flex flex-col"
      :class="appStore.sidebarOpen? 'w-64' : 'w-20'"
  >
    <div class="h-16 flex items-center justify-center border-b border-gray-100 dark:border-white/5 shrink-0 overflow-hidden">
      <div class="flex items-center gap-3 transition-all duration-300" :class="appStore.sidebarOpen? 'px-6 w-full' : 'justify-center'">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
          <div class="i-sf-heart-fill text-xl" />
        </div>
        <span
            v-show="appStore.sidebarOpen"
            class="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 whitespace-nowrap opacity-0 animate-fade-in"
            :class="{ '!opacity-100': appStore.sidebarOpen }"
        >
          HeartBridge
        </span>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
      <template v-for="item in menuItems" :key="item.path">
        <div v-if="item.children" class="mb-2">
          <div
              v-if="appStore.sidebarOpen"
              class="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider animate-fade-in"
          >
            {{ item.name }}
          </div>
          <router-link
              v-for="child in item.children"
              :key="child.path"
              :to="child.path"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden"
              active-class="bg-[#007AFF] text-white shadow-md shadow-blue-500/30"
              :class="!$route.path.includes(child.path)? 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5' : ''"
          >
            <div :class="[child.meta?.icon, 'text-lg shrink-0 transition-transform duration-300 group-hover:scale-110']" />
            <span
                v-show="appStore.sidebarOpen"
                class="text-sm font-medium whitespace-nowrap opacity-0 animate-slide-right"
                :class="{ '!opacity-100!translate-x-0': appStore.sidebarOpen }"
            >
              {{ child.name }}
            </span>

            <div
                v-if="!appStore.sidebarOpen"
                class="absolute left-16 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl"
            >
              {{ child.name }}
            </div>
          </router-link>
        </div>

        <router-link
            v-else
            :to="item.path"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group mb-1"
            active-class="bg-[#007AFF] text-white shadow-md shadow-blue-500/30"
            :class="!$route.path.includes(item.path)? 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5' : ''"
        >
          <div :class="[item.meta?.icon, 'text-lg shrink-0 transition-transform duration-300 group-hover:scale-110']" />
          <span
              v-show="appStore.sidebarOpen"
              class="text-sm font-medium whitespace-nowrap opacity-0 animate-slide-right"
              :class="{ '!opacity-100!translate-x-0': appStore.sidebarOpen }"
          >
            {{ item.name }}
          </span>
        </router-link>
      </template>
    </div>

    <div class="p-4 border-t border-gray-100 dark:border-white/5 shrink-0">
      <div
          class="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 flex items-center gap-3 overflow-hidden cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          @click="appStore.toggleSidebar"
      >
        <div class="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
          <div class="i-sf-sparkles" />
        </div>
        <div v-show="appStore.sidebarOpen" class="opacity-0 animate-fade-in" :class="{ '!opacity-100': appStore.sidebarOpen }">
          <p class="text-xs font-bold text-gray-900 dark:text-white">Pro 版本</p>
          <p class="text-[10px] text-gray-500">更多高级功能</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store/app'
import { computed } from 'vue'

const appStore = useAppStore()

// Simulating Routes structure for menu
const menuItems = [
  {
    path: '/admin/dashboard',
    name: '仪表盘',
    children: [
      { path: '/admin/dashboard/workbench', name: '工作台', meta: { icon: 'i-sf-square-grid-2x2' } },
      { path: '/admin/dashboard/analysis', name: '数据分析', meta: { icon: 'i-sf-chart-pie' } }
    ]
  },
  {
    path: '/admin/appointment',
    name: '预约中心',
    children: [
      { path: '/admin/appointment/management', name: '预约管理', meta: { icon: 'i-sf-calendar-badge-clock' } },
      { path: '/admin/appointment/schedule', name: '排班管理', meta: { icon: 'i-sf-clock' } }
    ]
  },
  {
    path: '/admin/crisis',
    name: '危机干预',
    children: [
      { path: '/admin/crisis/alert-list', name: '危机预警', meta: { icon: 'i-sf-exclamationmark-triangle' } },
      { path: '/admin/crisis/intervention', name: '干预记录', meta: { icon: 'i-sf-doc-text-viewfinder' } }
    ]
  },
  {
    path: '/admin/content',
    name: '内容管理',
    children: [
      { path: '/admin/content/article/list', name: '文章列表', meta: { icon: 'i-sf-doc-text' } }
    ]
  },
  {
    path: '/admin/users',
    name: '用户管理',
    children: [
      { path: '/admin/users/user-list', name: '用户列表', meta: { icon: 'i-sf-person-2' } },
      { path: '/admin/users/role-list', name: '角色权限', meta: { icon: 'i-sf-lock-shield' } }
    ]
  }
]
</script>

<style scoped>
.animate-fade-in {
  transition: opacity 0.3s ease-out;
}
.animate-slide-right {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  transform: translateX(-10px);
}
</style>