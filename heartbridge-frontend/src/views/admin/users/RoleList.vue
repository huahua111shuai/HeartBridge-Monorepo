<template>
  <div class="role-list-container min-h-screen p-6 space-y-6 animate-fade-up">
    <header class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <div class="i-sf-shield-lefthalf-filled text-purple-500 text-2xl" />
          角色权限
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium ml-9">
          定义系统角色及其对应的访问策略
        </p>
      </div>
      <button class="flex items-center gap-2 bg-[#007AFF] hover:bg-[#0062cc] active:scale-95 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm shadow-blue-500/20">
        <div class="i-sf-plus" />
        新建角色
      </button>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <GlassCard class="lg:col-span-2 overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-white/5">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">角色列表</h2>
        </div>

        <div class="flex-1 overflow-auto">
          <table class="w-full text-left border-collapse">
            <thead>
            <tr class="text-xs text-gray-500 border-b border-gray-100 dark:border-white/5">
              <th class="px-6 py-3 font-medium">角色名称</th>
              <th class="px-6 py-3 font-medium">用户数</th>
              <th class="px-6 py-3 font-medium">权限等级</th>
              <th class="px-6 py-3 font-medium text-right">操作</th>
            </tr>
            </thead>
            <tbody class="text-sm">
            <tr
                v-for="role in roles"
                :key="role.id"
                class="group border-b border-gray-50 dark:border-white/5 last:border-0 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors cursor-default"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                      class="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      :class="role.bgClass"
                  >
                    <div :class="role.icon" />
                  </div>
                  <div>
                    <div class="font-medium text-gray-900 dark:text-white">{{ role.name }}</div>
                    <div class="text-xs text-gray-400">{{ role.desc }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-1.5">
                  <div class="i-sf-person-2 text-gray-400" />
                  <span class="font-medium">{{ role.userCount }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="w-full max-w-[100px] h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                      class="h-full rounded-full"
                      :class="role.colorClass"
                      :style="{ width: role.level + '%' }"
                  />
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <button class="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  <div class="i-sf-chevron-right text-sm" />
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </GlassCard>

      <GlassCard class="flex flex-col h-full bg-gradient-to-b from-gray-50/50 to-white/30 dark:from-white/5 dark:to-transparent">
        <div class="p-6 pb-4">
          <div class="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-2xl text-blue-600 mb-4">
            <div class="i-sf-lock-shield" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">超级管理员</h3>
          <p class="text-sm text-gray-500 mt-1">拥有系统的完全控制权限，包括用户管理、系统配置及数据维护。</p>
        </div>

        <div class="px-6 py-2">
          <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">包含权限模块</div>
          <div class="space-y-2">
            <div v-for="(perm, idx) in demoPermissions" :key="idx" class="flex items-center gap-3 p-3 bg-white/60 dark:bg-black/20 rounded-xl border border-white/20 shadow-sm">
              <div class="i-sf-checkmark-circle-fill text-green-500" />
              <span class="text-sm text-gray-700 dark:text-gray-200">{{ perm }}</span>
            </div>
          </div>
        </div>

        <div class="mt-auto p-6 pt-4">
          <button class="w-full py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            编辑权限配置
          </button>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMotion } from '@vueuse/motion'

// --- Mock Data ---
const roles = ref([
  {
    id: 1,
    name: '超级管理员',
    desc: '系统最高权限拥有者',
    userCount: 3,
    level: 100,
    icon: 'i-sf-crown-fill',
    bgClass: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    colorClass: 'bg-yellow-500'
  },
  {
    id: 2,
    name: '心理咨询师',
    desc: '负责预约处理与咨询服务',
    userCount: 12,
    level: 70,
    icon: 'i-sf-heart-text-square-fill',
    bgClass: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
    colorClass: 'bg-pink-500'
  },
  {
    id: 3,
    name: '学生用户',
    desc: '基础访问权限',
    userCount: 8540,
    level: 30,
    icon: 'i-sf-graduationcap-fill',
    bgClass: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    colorClass: 'bg-blue-500'
  },
  {
    id: 4,
    name: '学院辅导员',
    desc: '查看本学院学生预警信息',
    userCount: 45,
    level: 50,
    icon: 'i-sf-person-crop-rectangle-fill',
    bgClass: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    colorClass: 'bg-green-500'
  },
])

const demoPermissions =

// --- Animation ---
    onMounted(() => {
      const card = document.querySelector('.glass-card')
      if (card) {
        useMotion(card, {
          initial: { opacity: 0, y: 30 },
          enter: { opacity: 1, y: 0, transition: { duration: 600, ease: 'easeOut' } }
        })
      }
    })
</script>

<style scoped>
/* Custom Scrollbar for list */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.2);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.4);
}
</style>