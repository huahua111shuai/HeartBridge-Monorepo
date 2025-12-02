<template>
  <div class="alert-list-container min-h-screen p-6 space-y-6 animate-fade-up">
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <div class="i-sf-exclamationmark-triangle-fill text-red-500 text-2xl" />
          危机预警
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium ml-9">
          实时监控高危学生状态，优先处理紧急干预请求
        </p>
      </div>
      <div class="flex items-center gap-3">
        <div class="px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30 flex items-center gap-2 text-red-600 dark:text-red-400">
          <div class="i-sf-waveform-path-ecg text-lg animate-pulse" />
          <span class="text-sm font-bold">高危人数: {{ highRiskCount }}</span>
        </div>
        <button class="p-2 rounded-full bg-gray-100/50 dark:bg-white/10 text-gray-500 hover:text-blue-600 transition-colors active:scale-95">
          <div class="i-sf-arrow-clockwise text-lg" />
        </button>
      </div>
    </header>

    <GlassCard class="flex flex-col min-h-[600px] overflow-hidden relative">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex flex-wrap items-center gap-4 bg-white/30 dark:bg-white/5 backdrop-blur-md z-10 sticky top-0">
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div class="i-sf-magnifyingglass text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索学生姓名、学号..."
              class="pl-10 pr-4 py-2 w-64 bg-gray-50/50 dark:bg-black/20 backdrop-blur-md border border-gray-200/50 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>

        <div class="flex items-center gap-2 flex-1">
          <el-select v-model="filterLevel" placeholder="风险等级" clearable class="w-32!bg-transparent apple-select" popper-class="glass-popper">
            <el-option label="全部" value="" />
            <el-option label="高危 (High)" value="High" />
            <el-option label="中危 (Moderate)" value="Moderate" />
            <el-option label="低危 (Low)" value="Low" />
          </el-select>

          <el-select v-model="filterStatus" placeholder="干预状态" clearable class="w-32!bg-transparent apple-select" popper-class="glass-popper">
            <el-option label="待处理" value="pending" />
            <el-option label="干预中" value="active" />
            <el-option label="已解除" value="resolved" />
          </el-select>
        </div>
      </div>

      <div class="flex-1 overflow-auto custom-scrollbar">
        <el-table
            :data="filteredList"
            style="width: 100%"
            :row-class-name="tableRowClassName"
            class="custom-alert-table"
            @row-click="handleRowClick"
        >
          <el-table-column label="学生信息" min-width="200">
            <template #default="{ row }">
              <div class="flex items-center gap-4 py-2">
                <div class="relative">
                  <el-avatar :size="44" :src="row.avatar" class="border-2 border-white dark:border-white/10 shadow-sm" />
                  <div v-if="row.riskLevel === 'High'" class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 animate-ping" />
                  <div v-if="row.riskLevel === 'High'" class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800" />
                </div>
                <div>
                  <div class="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {{ row.name }}
                    <span v-if="row.isRepeat" class="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-medium">复发</span>
                  </div>
                  <div class="text-xs text-gray-500 mt-0.5">{{ row.college }} · {{ row.studentId }}</div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="风险评估" width="160">
            <template #default="{ row }">
              <span
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm backdrop-blur-sm transition-all"
                  :class="getRiskBadgeClass(row.riskLevel)"
              >
                <div :class="getRiskIcon(row.riskLevel)" />
                {{ row.riskLevelLabel }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="主要触发因素" min-width="220">
            <template #default="{ row }">
              <div class="flex flex-wrap gap-1.5">
                <span v-for="tag in row.triggers" :key="tag" class="px-2 py-0.5 bg-white/60 dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-md text-xs text-gray-600 dark:text-gray-300">
                  {{ tag }}
                </span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="最近更新" width="150">
            <template #default="{ row }">
              <div class="text-xs text-gray-500 flex flex-col">
                <span class="font-medium text-gray-700 dark:text-gray-300">{{ row.lastUpdate }}</span>
                <span>{{ row.daysAgo }}天前</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="140" fixed="right">
            <template #default="{ row }">
              <button
                  @click.stop="handleIntervention(row)"
                  class="w-full py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1"
                  :class="row.status === 'pending'? 'bg-[#007AFF] text-white hover:bg-[#0062cc] shadow-blue-500/30' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'"
              >
                <div :class="row.status === 'pending'? 'i-sf-exclamationmark-bubble-fill' : 'i-sf-doc-text'" />
                {{ row.status === 'pending'? '立即干预' : '查看记录' }}
              </button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="px-6 py-4 border-t border-gray-100 dark:border-white/5 bg-white/30 dark:bg-white/5 backdrop-blur-xl flex justify-between items-center">
        <span class="text-xs text-gray-400">显示最近 30 天的预警记录</span>
        <el-pagination
            background
            layout="prev, pager, next"
            :total="total"
            class="apple-pagination"
        />
      </div>
    </GlassCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMotion } from '@vueuse/motion'
import { ElMessage } from 'element-plus'
import GlassCard from '@/components/common/GlassCard.vue'

const router = useRouter()

// --- State ---
const searchKeyword = ref('')
const filterLevel = ref('')
const filterStatus = ref('')
const total = ref(12)

// --- Mock Data ---
const alertList = ref([
  {
    id: 1,
    studentId: '2021001',
    name: '林安',
    avatar: 'https://i.pravatar.cc/150?u=1',
    college: '计算机学院',
    riskLevel: 'High',
    riskLevelLabel: '高危预警',
    triggers: ['自杀意念', '学业重挫', '失眠'],
    lastUpdate: '10分钟前',
    daysAgo: 0,
    status: 'pending',
    isRepeat: true
  },
  {
    id: 2,
    studentId: '2021045',
    name: '张晓雯',
    avatar: 'https://i.pravatar.cc/150?u=2',
    college: '人文学院',
    riskLevel: 'Moderate',
    riskLevelLabel: '中度风险',
    triggers: ['人际冲突', '情绪低落'],
    lastUpdate: '2小时前',
    daysAgo: 0,
    status: 'active',
    isRepeat: false
  },
  {
    id: 3,
    studentId: '2022102',
    name: '王强',
    avatar: 'https://i.pravatar.cc/150?u=3',
    college: '体育学院',
    riskLevel: 'Low',
    riskLevelLabel: '低风险',
    triggers: ['缺勤', '焦虑'],
    lastUpdate: '3天前',
    daysAgo: 3,
    status: 'resolved',
    isRepeat: false
  },
  {
    id: 4,
    studentId: '2023009',
    name: '李思思',
    avatar: 'https://i.pravatar.cc/150?u=4',
    college: '艺术学院',
    riskLevel: 'High',
    riskLevelLabel: '高危预警',
    triggers: ['家庭变故', '自我伤害倾向'],
    lastUpdate: '昨天',
    daysAgo: 1,
    status: 'active',
    isRepeat: false
  }
])

// --- Computed ---
const highRiskCount = computed(() => alertList.value.filter(i => i.riskLevel === 'High').length)

const filteredList = computed(() => {
  return alertList.value.filter(item => {
    const matchSearch = item.name.includes(searchKeyword.value) |

        | item.studentId.includes(searchKeyword.value)
    const matchLevel =!filterLevel.value |

        | item.riskLevel === filterLevel.value
    const matchStatus =!filterStatus.value |

        | item.status === filterStatus.value
    return matchSearch && matchLevel && matchStatus
  })
})

// --- Methods ---
const tableRowClassName = ({ row }: { row: any }) => {
  if (row.riskLevel === 'High') {
    return 'high-risk-row'
  } else if (row.riskLevel === 'Moderate') {
    return 'moderate-risk-row'
  }
  return ''
}

const getRiskBadgeClass = (level: string) => {
  switch (level) {
    case 'High': return 'bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50'
    case 'Moderate': return 'bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-900/50'
    case 'Low': return 'bg-green-100 text-green-600 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const getRiskIcon = (level: string) => {
  switch (level) {
    case 'High': return 'i-sf-exclamationmark-triangle-fill'
    case 'Moderate': return 'i-sf-exclamationmark-circle-fill'
    default: return 'i-sf-checkmark-shield-fill'
  }
}

const handleRowClick = (row: any) => {
  handleIntervention(row)
}

const handleIntervention = (row: any) => {
  router.push({ path: '/admin/crisis/intervention', query: { studentId: row.studentId, name: row.name } })
}

// --- Animation ---
onMounted(() => {
  const card = document.querySelector('.glass-card')
  if (card) {
    useMotion(card, {
      initial: { opacity: 0, y: 20 },
      enter: { opacity: 1, y: 0, transition: { duration: 600, ease: 'easeOut' } }
    })
  }
})
</script>

<style scoped>
/* CRITICAL: High Risk Row Highlighting */
:deep(.el-table.high-risk-row) {
  --el-table-tr-bg-color: #FEF2F2; /* red-50 */
}
:deep(.el-table.high-risk-row:hover > td.el-table__cell) {
  background-color: #FEE2E2!important; /* red-100 */
}
.dark :deep(.el-table.high-risk-row) {
  --el-table-tr-bg-color: rgba(127, 29, 29, 0.2);
}
.dark :deep(.el-table.high-risk-row:hover > td.el-table__cell) {
  background-color: rgba(127, 29, 29, 0.3)!important;
}

/* Moderate Risk Row */
:deep(.el-table.moderate-risk-row) {
  --el-table-tr-bg-color: #FFF7ED; /* orange-50 */
}
:deep(.el-table.moderate-risk-row:hover > td.el-table__cell) {
  background-color: #FFEDD5!important;
}
.dark :deep(.el-table.moderate-risk-row) {
  --el-table-tr-bg-color: rgba(124, 45, 18, 0.1);
}

/* Table general styles */
:deep(.custom-alert-table) {
  --el-table-header-bg-color: transparent;
  --el-table-bg-color: transparent;
  --el-table-border-color: rgba(229, 231, 235, 0.5);
}
.dark :deep(.custom-alert-table) {
  --el-table-border-color: rgba(255, 255, 255, 0.05);
}

:deep(.el-table th.el-table__cell) {
  font-weight: 600;
  color: #6B7280;
  padding: 12px 0;
}

/* Remove default table borders for clean look */
:deep(.el-table__inner-wrapper::before) { display: none; }

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 10px;
}
</style>