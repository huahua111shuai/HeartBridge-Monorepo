<template>
  <div class="user-list-container min-h-screen p-6 space-y-6 animate-fade-up">
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <div class="i-sf-person-2-fill text-blue-500 text-2xl" />
          用户管理
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium ml-9">
          管理平台所有注册用户及其权限状态
        </p>
      </div>
      <div class="flex items-center gap-3">
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div class="i-sf-magnifyingglass text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索姓名、学号..."
              class="pl-10 pr-4 py-2 w-64 bg-white/50 dark:bg-black/20 backdrop-blur-md border border-gray-200/50 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>
        <button class="flex items-center gap-2 bg-[#007AFF] hover:bg-[#0062cc] active:scale-95 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm shadow-blue-500/20">
          <div class="i-sf-plus" />
          新增用户
        </button>
      </div>
    </header>

    <GlassCard class="overflow-hidden min-h-[600px] flex flex-col">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="text-xs font-medium text-gray-500">状态筛选:</span>
          <div class="flex bg-gray-100/50 dark:bg-white/5 p-1 rounded-lg">
            <button
                v-for="tab in ['全部', '正常', '禁用']"
                :key="tab"
                @click="currentTab = tab"
                class="px-3 py-1 text-xs rounded-md transition-all"
                :class="currentTab === tab? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
            >
              {{ tab }}
            </button>
          </div>
        </div>
        <div class="flex-1" />
        <div class="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
          <div class="i-sf-arrow-up-arrow-down text-xs" />
          <span class="text-xs">排序</span>
        </div>
      </div>

      <el-table
          :data="filteredUsers"
          style="width: 100%"
          class="custom-table flex-1"
          :header-cell-style="{ background: 'transparent', color: '#6B7280', fontWeight: '500', fontSize: '13px' }"
          :cell-style="{ background: 'transparent' }"
          v-loading="loading"
      >
        <el-table-column label="用户信息" min-width="200">
          <template #default="scope">
            <div class="flex items-center gap-3">
              <el-avatar :size="40" :src="scope.row.avatar" class="border border-white/20 shadow-sm" />
              <div>
                <div class="font-medium text-gray-900 dark:text-white text-sm">{{ scope.row.name }}</div>
                <div class="text-xs text-gray-500">{{ scope.row.username }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="角色" min-width="120">
          <template #default="scope">
            <div class="flex items-center gap-1.5">
              <div
                  class="w-2 h-2 rounded-full"
                  :class="{
                  'bg-purple-500': scope.row.role === '管理员',
                  'bg-blue-500': scope.row.role === '咨询师',
                  'bg-green-500': scope.row.role === '学生'
                }"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ scope.row.role }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="所属学院" prop="department" min-width="150" />

        <el-table-column label="状态" min-width="100">
          <template #default="scope">
            <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                :class="scope.row.status === 1? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'"
            >
              {{ scope.row.status === 1? '活跃' : '禁用' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="最后登录" prop="lastLogin" min-width="160" class-name="text-gray-500 text-xs" />

        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <el-tooltip content="编辑资料" placement="top" :hide-after="0">
                <button class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 hover:text-blue-600 transition-colors">
                  <div class="i-sf-pencil" />
                </button>
              </el-tooltip>

              <el-tooltip content="分配角色" placement="top" :hide-after="0">
                <button @click="openRoleDialog(scope.row)" class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 hover:text-purple-600 transition-colors">
                  <div class="i-sf-person-badge-plus" />
                </button>
              </el-tooltip>

              <el-tooltip :content="scope.row.status === 1? '禁用账户' : '启用账户'" placement="top" :hide-after="0">
                <button
                    @click="toggleStatus(scope.row)"
                    class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    :class="scope.row.status === 1? 'text-gray-500 hover:text-red-600' : 'text-red-500 hover:text-green-600'"
                >
                  <div :class="scope.row.status === 1? 'i-sf-lock' : 'i-sf-lock-open'" />
                </button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="px-6 py-4 border-t border-gray-100 dark:border-white/5 flex justify-end">
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            layout="prev, pager, next"
            background
            class="custom-pagination"
        />
      </div>
    </GlassCard>

    <el-dialog
        v-model="roleDialogVisible"
        title="分配角色"
        width="400px"
        align-center
        class="glass-dialog"
        :show-close="false"
    >
      <div class="p-4">
        <div class="flex items-center gap-3 mb-6 p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
          <el-avatar :size="48" :src="currentUser?.avatar" />
          <div>
            <div class="font-medium text-gray-900 dark:text-white">{{ currentUser?.name }}</div>
            <div class="text-xs text-gray-500">当前角色: {{ currentUser?.role }}</div>
          </div>
        </div>

        <el-form label-position="top">
          <el-form-item label="选择新角色">
            <el-select v-model="selectedRole" class="w-full" placeholder="请选择">
              <el-option label="管理员" value="admin" />
              <el-option label="心理咨询师" value="counselor" />
              <el-option label="学生" value="student" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3 px-4 pb-2">
          <el-button @click="roleDialogVisible = false" class="!border-none!bg-gray-100 dark:!bg-white/10 hover:!bg-gray-200">取消</el-button>
          <el-button type="primary" @click="handleRoleAssign" class="!bg-[#007AFF]!border-none">确认分配</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMotion } from '@vueuse/motion'
import { ElMessage, ElMessageBox } from 'element-plus'

// --- Types ---
interface User {
  id: number
  name: string
  username: string
  avatar: string
  role: string
  department: string
  status: number // 1: Active, 0: Disabled
  lastLogin: string
}

// --- State ---
const loading = ref(false)
const searchQuery = ref('')
const currentTab = ref('全部')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)
const roleDialogVisible = ref(false)
const currentUser = ref<User | null>(null)
const selectedRole = ref('')

// --- Mock Data ---
const users = ref<User>()

// --- Computed ---
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchQuery = user.name.includes(searchQuery.value) |

        | user.username.includes(searchQuery.value)
    const matchTab = currentTab.value === '全部'
        ? true
        : currentTab.value === '正常'? user.status === 1 : user.status === 0
    return matchQuery && matchTab
  })
})

// --- Methods ---
const openRoleDialog = (user: User) => {
  currentUser.value = user
  selectedRole.value = '' // Reset or map from user.role
  roleDialogVisible.value = true
}

const handleRoleAssign = () => {
  if (!selectedRole.value) {
    ElMessage.warning('请选择一个角色')
    return
  }
  loading.value = true
  setTimeout(() => {
    loading.value = false
    roleDialogVisible.value = false
    ElMessage.success(`已将 ${currentUser.value?.name} 设置为 ${selectedRole.value === 'admin'? '管理员' : '其他角色'}`)
  }, 1000)
}

const toggleStatus = (user: User) => {
  const action = user.status === 1? '禁用' : '启用'
  ElMessageBox.confirm(
      `确定要${action}用户 "${user.name}" 吗？${action === '禁用'? '该用户将无法登录平台。' : '该用户将恢复正常访问权限。'}`,
      '状态变更',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'glass-message-box'
      }
  ).then(() => {
    user.status = user.status === 1? 0 : 1
    ElMessage.success(`已${action}用户`)
  })
}

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
/* Table Styling for Glass Effect */
:deep(.el-table) {
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-header-bg-color: transparent;
  --el-table-row-hover-bg-color: rgba(0, 0, 0, 0.02);
  --el-table-border-color: rgba(255, 255, 255, 0.1);
  background-color: transparent;
}

:deep(.el-table__inner-wrapper::before) {
  display: none; /* Remove bottom border */
}

:deep(.el-table__row) {
  transition: background-color 0.2s;
}

:deep(.el-table__row:hover) {
  background-color: rgba(0, 122, 255, 0.03)!important;
}

/* Pagination Styling */
:deep(.el-pagination.is-background.el-pager li:not(.is-disabled).is-active) {
  background-color: #007AFF;
  color: white;
}

:deep(.el-pagination.is-background.el-pager li) {
  background-color: transparent;
  border: 1px solid rgba(156, 163, 175, 0.2);
  border-radius: 8px;
}

/* Force hover effect on action buttons group */
:deep(.el-table__row:hover).group-hover\:opacity-100 {
  opacity: 1;
}

/* Dark mode adjustments */
.dark :deep(.el-table__row:hover) {
  background-color: rgba(255, 255, 255, 0.05)!important;
}
</style>