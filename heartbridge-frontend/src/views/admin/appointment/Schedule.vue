<template>
  <div class="schedule-container min-h-screen p-6 space-y-6 animate-fade-up">
    <header class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <div class="i-sf-clock-badge-exclamationmark text-purple-500 text-2xl" />
          排班管理
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium ml-9">
          配置咨询师的可预约时段与休假状态
        </p>
      </div>
      <button class="flex items-center gap-2 bg-[#007AFF] hover:bg-[#0062cc] active:scale-95 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm shadow-blue-500/20">
        <div class="i-sf-arrow-triangle-2-circlepath" />
        批量排班
      </button>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
      <GlassCard class="lg:col-span-1 flex flex-col p-4 gap-6 overflow-y-auto">
        <div>
          <label class="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1 mb-2 block">选择咨询师</label>
          <div class="relative">
            <el-select
                v-model="currentTeacher"
                class="w-full"
                placeholder="请选择"
                filterable
            >
              <template #prefix>
                <div class="i-sf-person-fill text-gray-400" />
              </template>
              <el-option
                  v-for="t in teachers"
                  :key="t.id"
                  :label="t.name"
                  :value="t.id"
              >
                <div class="flex items-center gap-2">
                  <el-avatar :size="24" :src="t.avatar" />
                  <span>{{ t.name }}</span>
                </div>
              </el-option>
            </el-select>
          </div>
        </div>

        <div class="flex-1 bg-gray-50/50 dark:bg-white/5 rounded-2xl p-2 border border-gray-100 dark:border-white/5">
          <el-calendar v-model="currentDate" class="custom-calendar-mini">
            <template #header="{ date }">
              <div class="text-sm font-semibold text-gray-900 dark:text-white w-full text-center">
                {{ date }}
              </div>
            </template>
            <template #date-cell="{ data }">
              <div class="w-full h-full flex flex-col items-center justify-center relative">
                <span :class="{'text-blue-600 font-bold': data.isSelected}">
                  {{ data.day.split('-').slice(2).join('') }}
                </span>
                <div class="flex gap-0.5 mt-1" v-if="hasSchedule(data.day)">
                  <div class="w-1 h-1 rounded-full bg-blue-500"></div>
                  <div class="w-1 h-1 rounded-full bg-red-500" v-if="hasBlockedSlot(data.day)"></div>
                </div>
              </div>
            </template>
          </el-calendar>
        </div>

        <div class="space-y-2 px-2">
          <div class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <div class="w-3 h-3 rounded-md bg-white border border-gray-200 dark:bg-white/10 dark:border-white/10"></div>
            <span>可预约</span>
          </div>
          <div class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <div class="w-3 h-3 rounded-md bg-blue-100 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-800"></div>
            <span>已有预约</span>
          </div>
          <div class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <div class="w-3 h-3 rounded-md bg-stripe-red border border-red-200"></div>
            <span>已锁定/休息</span>
          </div>
        </div>
      </GlassCard>

      <GlassCard class="lg:col-span-3 flex flex-col overflow-hidden relative">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-white/40 dark:bg-white/5 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ formatDate(currentDate) }}
            </h2>
            <p class="text-xs text-gray-500 mt-0.5">{{ currentTeacher? '王教授的排班表' : '请先选择咨询师' }}</p>
          </div>
          <div class="flex gap-2">
            <button @click="blockAll" class="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">全天停诊</button>
            <button @click="resetAll" class="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">重置</button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-6">
          <div v-if="currentTeacher" class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
            <div
                v-for="slot in timeSlots"
                :key="slot.time"
                @click="toggleSlot(slot)"
                class="relative group cursor-pointer transition-all duration-300"
            >
              <div
                  class="h-24 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all"
                  :class="getSlotClass(slot)"
              >
                <span class="text-lg font-semibold font-mono">{{ slot.time }}</span>
                <span class="text-xs font-medium px-2 py-0.5 rounded-full" :class="getStatusBadgeClass(slot)">
                  {{ getStatusLabel(slot) }}
                </span>

                <div class="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity flex items-center justify-center">
                  <div class="i-sf-lock-fill text-2xl text-gray-600 dark:text-white" v-if="slot.status === 'available'" />
                  <div class="i-sf-lock-open-fill text-2xl text-white" v-if="slot.status === 'blocked'" />
                </div>
              </div>
            </div>
          </div>

          <div v-else class="h-full flex flex-col items-center justify-center text-gray-400">
            <div class="i-sf-person-crop-circle-badge-questionmark text-6xl mb-4 opacity-50" />
            <p>请在左侧选择一位咨询师以查看排班</p>
          </div>
        </div>
      </GlassCard>
    </div>

    <el-dialog v-model="blockDialogVisible" title="设置不可用时段" width="350px" align-center class="glass-dialog">
      <div class="p-4">
        <p class="text-sm text-gray-600 mb-4">
          您正在锁定 <span class="font-bold text-gray-900">{{ selectedSlot?.time }}</span> 时段。
        </p>
        <el-input
            v-model="blockReason"
            placeholder="请输入原因（如：午休、会议）"
            class="glass-input"
        />
        <div class="mt-4 flex items-center gap-2">
          <el-checkbox v-model="repeatWeekly" label="未来4周同时间重复" />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2 px-4 pb-2">
          <el-button @click="blockDialogVisible = false" text>取消</el-button>
          <el-button type="primary" @click="confirmBlock" class="!bg-[#007AFF]">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMotion } from '@vueuse/motion'
import { ElMessage } from 'element-plus'

// --- State ---
const currentTeacher = ref<number | null>(null)
const currentDate = ref(new Date())
const blockDialogVisible = ref(false)
const selectedSlot = ref<any>(null)
const blockReason = ref('')
const repeatWeekly = ref(false)

// --- Mock Data ---
const teachers = ref([
  { id: 1, name: '王教授', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: '李医生', avatar: 'https://i.pravatar.cc/150?u=2' },
])

// Generate 09:00 - 18:00 slots
const generateSlots = () => {
  const slots =
  for (let i = 9; i < 18; i++) {
    slots.push({ time: `${i.toString().padStart(2, '0')}:00`, status: 'available' })
    slots.push({ time: `${i.toString().padStart(2, '0')}:30`, status: 'available' })
  }
  // Mock some status
  slots.[1]status = 'booked' // 10:00
  slots.[2]status = 'blocked' // 11:30
  return slots
}

const timeSlots = ref(generateSlots())

// --- Helpers ---
const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })
}

const hasSchedule = (day: string) => Math.random() > 0.5
const hasBlockedSlot = (day: string) => Math.random() > 0.8

const getSlotClass = (slot: any) => {
  switch (slot.status) {
    case 'available':
      return 'bg-white border-gray-200 text-gray-900 hover:border-blue-400 dark:bg-white/5 dark:border-white/10 dark:text-white'
    case 'booked':
      return 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300 cursor-not-allowed'
    case 'blocked':
      return 'bg-stripe-red border-red-200 text-red-600 dark:border-red-900/50'
    default: return ''
  }
}

const getStatusBadgeClass = (slot: any) => {
  switch (slot.status) {
    case 'available': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    case 'booked': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'blocked': return 'bg-white/80 text-red-600 shadow-sm'
    default: return ''
  }
}

const getStatusLabel = (slot: any) => {
  switch (slot.status) {
    case 'available': return '空闲'
    case 'booked': return '已约'
    case 'blocked': return '锁定'
    default: return ''
  }
}

// --- Actions ---
const toggleSlot = (slot: any) => {
  if (slot.status === 'booked') {
    ElMessage.info('该时段已有预约，请前往预约管理处理')
    return
  }
  if (slot.status === 'blocked') {
    slot.status = 'available'
    ElMessage.success('时段已解锁')
  } else {
    selectedSlot.value = slot
    blockReason.value = ''
    blockDialogVisible.value = true
  }
}

const confirmBlock = () => {
  if (selectedSlot.value) {
    selectedSlot.value.status = 'blocked'
    ElMessage.success('时段已锁定')
    blockDialogVisible.value = false
  }
}

const blockAll = () => {
  timeSlots.value.forEach(s => {
    if (s.status === 'available') s.status = 'blocked'
  })
  ElMessage.warning('全天时段已锁定')
}

const resetAll = () => {
  timeSlots.value.forEach(s => {
    if (s.status === 'blocked') s.status = 'available'
  })
  ElMessage.success('排班已重置')
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
/* Striped Background for Blocked Slots */
.bg-stripe-red {
  background-color: #FEF2F2;
  background-image: repeating-linear-gradient(
      45deg,
      #FEE2E2,
      #FEE2E2 10px,
      #FEF2F2 10px,
      #FEF2F2 20px
  );
}
.dark.bg-stripe-red {
  background-color: rgba(69, 10, 10, 0.3);
  background-image: repeating-linear-gradient(
      45deg,
      rgba(127, 29, 29, 0.2),
      rgba(127, 29, 29, 0.2) 10px,
      rgba(69, 10, 10, 0.1) 10px,
      rgba(69, 10, 10, 0.1) 20px
  );
}

/* Calendar Customization */
:deep(.custom-calendar-mini.el-calendar__header) {
  padding: 12px 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}
:deep(.custom-calendar-mini.el-calendar__body) {
  padding: 0;
}
:deep(.custom-calendar-mini.el-calendar-table td) {
  border: none;
  padding: 4px;
}
:deep(.custom-calendar-mini.el-calendar-table td.is-selected.el-calendar-day) {
  background-color: rgba(0, 122, 255, 0.1);
  border-radius: 8px;
}
:deep(.custom-calendar-mini.el-calendar-day) {
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
:deep(.custom-calendar-mini.el-calendar-day:hover) {
  background-color: rgba(0,0,0,0.02);
  border-radius: 8px;
}
</style>