<template>
  <div class="appointment-management-container min-h-screen p-6 space-y-6 animate-fade-up">
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <div class="i-sf-calendar-badge-clock text-blue-500 text-2xl" />
          预约管理
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium ml-9">
          审核学生预约申请，管理咨询记录
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button class="p-2 rounded-full bg-gray-100/50 dark:bg-white/10 text-gray-500 hover:text-blue-600 transition-colors">
          <div class="i-sf-arrow-clockwise text-lg" />
        </button>
        <button class="flex items-center gap-2 bg-white/50 dark:bg-white/10 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200/50 dark:border-white/10 shadow-sm hover:bg-white/80 transition-all">
          <div class="i-sf-square-and-arrow-up" />
          导出记录
        </button>
      </div>
    </header>

    <GlassCard class="flex flex-col min-h-[600px] overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex flex-wrap items-center gap-4">
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div class="i-sf-magnifyingglass text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索姓名、学号..."
              class="pl-10 pr-4 py-2 w-64 bg-gray-50/50 dark:bg-black/20 backdrop-blur-md border border-gray-200/50 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>

        <div class="flex items-center gap-2">
          <el-select v-model="filterStatus" placeholder="状态" class="w-32!bg-transparent" popper-class="glass-popper">
            <el-option label="全部" value="" />
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已驳回" value="rejected" />
            <el-option label="已完成" value="completed" />
          </el-select>

          <el-date-picker
              v-model="filterDate"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="!w-64!bg-transparent!border-gray-200/50 dark:!border-white/10!rounded-xl"
              popper-class="glass-popper"
          />
        </div>

        <div class="flex-1" />

        <div class="flex bg-gray-100/50 dark:bg-white/5 p-1 rounded-lg">
          <button class="p-1.5 rounded-md bg-white dark:bg-gray-700 shadow-sm text-blue-600">
            <div class="i-sf-list-bullet text-sm" />
          </button>
          <button class="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <div class="i-sf-square-grid-2x2 text-sm" />
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-auto">
        <el-table
            :data="appointmentList"
            style="width: 100%"
            class="custom-table"
            v-loading="loading"
        >
          <el-table-column label="申请学生" min-width="180">
            <template #default="scope">
              <div class="flex items-center gap-3">
                <el-avatar :size="40" :src="scope.row.studentAvatar" class="border border-white/20 shadow-sm" />
                <div>
                  <div class="font-medium text-gray-900 dark:text-white text-sm">{{ scope.row.studentName }}</div>
                  <div class="text-xs text-gray-500">{{ scope.row.studentId }}</div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="咨询师" min-width="140">
            <template #default="scope">
              <div class="flex items-center gap-2">
                <div class="w-1 h-8 rounded-full bg-blue-500/20" />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ scope.row.counselorName }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="预约时间" min-width="200">
            <template #default="scope">
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                  <div class="i-sf-calendar text-gray-400" />
                  {{ scope.row.date }}
                </span>
                <span class="text-xs text-gray-500 pl-5">{{ scope.row.timeSlot }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="咨询方式" width="120">
            <template #default="scope">
              <div class="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 bg-gray-100/50 dark:bg-white/5 px-2 py-1 rounded-lg w-fit">
                <div :class="scope.row.type === 'online'? 'i-sf-video-fill text-blue-500' : 'i-sf-person-2-fill text-green-500'" />
                {{ scope.row.type === 'online'? '视频咨询' : '线下面谈' }}
              </div>
            </template>
          </el-table-column>

          <el-table-column label="状态" width="100">
            <template #default="scope">
              <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                  :class="getStatusClass(scope.row.status)"
              >
                {{ getStatusText(scope.row.status) }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="160" fixed="right">
            <template #default="scope">
              <div class="flex items-center gap-2">
                <button
                    v-if="scope.row.status === 'pending'"
                    @click="openAudit(scope.row)"
                    class="text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                >
                  审核
                </button>
                <button
                    @click="viewDetail(scope.row)"
                    class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  详情
                </button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="px-6 py-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
        <span class="text-xs text-gray-400">显示 1-10 共 128 条</span>
        <el-pagination
            background
            layout="prev, pager, next"
            :total="128"
            class="custom-pagination"
        />
      </div>
    </GlassCard>

    <el-dialog
        v-model="auditDialogVisible"
        title="预约审核"
        width="400px"
        align-center
        class="glass-dialog"
        :show-close="false"
    >
      <div class="p-4" v-if="currentRow">
        <div class="flex items-center gap-4 mb-6">
          <el-avatar :size="56" :src="currentRow.studentAvatar" />
          <div>
            <div class="text-lg font-semibold text-gray-900 dark:text-white">{{ currentRow.studentName }}</div>
            <div class="text-sm text-gray-500">申请预约 {{ currentRow.counselorName }}</div>
          </div>
        </div>

        <div class="bg-gray-50 dark:bg-white/5 rounded-xl p-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
          <div class="flex justify-between mb-2">
            <span class="text-gray-400">时间</span>
            <span class="font-medium">{{ currentRow.date }} {{ currentRow.timeSlot }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">备注</span>
            <span class="font-medium">{{ currentRow.note |

                | '无备注信息' }}</span>
          </div>
        </div>

        <el-form :model="auditForm">
          <el-form-item>
            <el-input
                v-model="auditForm.reason"
                type="textarea"
                :rows="3"
                placeholder="请输入审核意见（驳回时必填）"
                class="glass-input"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="flex justify-between px-4 pb-2">
          <button @click="auditDialogVisible = false" class="text-gray-500 text-sm hover:text-gray-700">取消</button>
          <div class="flex gap-2">
            <el-button type="danger" plain class="!rounded-xl" @click="handleAudit('reject')">驳回</el-button>
            <el-button type="primary" class="!rounded-xl!bg-[#007AFF]!border-none" @click="handleAudit('approve')">通过</el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMotion } from '@vueuse/motion'
import { ElMessage } from 'element-plus'

// --- State ---
const loading = ref(false)
const searchKeyword = ref('')
const filterStatus = ref('')
const filterDate = ref()
const auditDialogVisible = ref(false)
const currentRow = ref<any>(null)
const auditForm = ref({ reason: '' })

// --- Mock Data ---
const appointmentList = ref()

// --- Helpers ---
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待审核',
    approved: '已预约',
    rejected: '已驳回',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] |

      | status
}

const getStatusClass = (status: string) => {
  const map: Record<string, string> = {
    pending: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
    approved: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    rejected: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    completed: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    cancelled: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
  }
  return map[status] |

      | ''
}

// --- Actions ---
const openAudit = (row: any) => {
  currentRow.value = row
  auditForm.value.reason = ''
  auditDialogVisible.value = true
}

const handleAudit = (action: 'approve' | 'reject') => {
  if (action === 'reject' &&!auditForm.value.reason) {
    ElMessage.warning('请填写驳回原因')
    return
  }

  // Mock API call
  ElMessage.success(action === 'approve'? '预约已通过' : '预约已驳回')
  auditDialogVisible.value = false
  if (currentRow.value) {
    currentRow.value.status = action === 'approve'? 'approved' : 'rejected'
  }
}

const viewDetail = (row: any) => {
  ElMessage.info('查看详情功能开发中...')
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
/* Table Styling */
:deep(.el-table) {
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-header-bg-color: transparent;
  --el-table-row-hover-bg-color: rgba(0, 122, 255, 0.03);
  --el-table-border-color: rgba(255, 255, 255, 0.1);
  background-color: transparent;
}

:deep(.el-table__inner-wrapper::before),
:deep(.el-table__inner-wrapper::after) {
  display: none;
}

:deep(.el-table th.el-table__cell) {
  font-weight: 600;
  color: #6B7280;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
}

.dark :deep(.el-table th.el-table__cell) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

/* Glass Input inside Dialog */
:deep(.glass-input.el-textarea__inner) {
  background-color: rgba(243, 244, 246, 0.5);
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 12px;
  box-shadow: none;
  padding: 12px;
}
.dark :deep(.glass-input.el-textarea__inner) {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: white;
}

/* Date Picker override */
:deep(.el-date-editor.el-range-input) {
  background: transparent;
  color: inherit;
}
</style>