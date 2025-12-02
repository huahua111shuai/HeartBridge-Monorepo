<template>
  <div class="workbench-container min-h-screen p-6 space-y-6 animate-fade-up">
    <header class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">
          工作台
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
          {{ currentDate }} · 欢迎回来，管理员
        </p>
      </div>
      <div class="flex items-center gap-4">
        <GlassCard class="px-4 py-2 flex items-center gap-2!rounded-full cursor-pointer hover:bg-white/80 transition-colors">
          <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span class="text-xs font-medium text-gray-600 dark:text-gray-300">系统运行正常</span>
        </GlassCard>
        <el-button circle class="!border-none!bg-white/50 dark:!bg-white/10!shadow-sm">
          <el-icon><Bell /></el-icon>
        </el-button>
      </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

      <GlassCard
          v-for="(stat, index) in statistics"
          :key="index"
          class="relative overflow-hidden group hover:!-translate-y-1 transition-all duration-300"
      >
        <div class="p-5 relative z-10">
          <div class="flex justify-between items-start mb-4">
            <div class="p-2 rounded-xl bg-gray-100/50 dark:bg-white/10 text-xl text-blue-600 dark:text-blue-400">
              <component :is="stat.icon" />
            </div>
            <span
                class="text-xs font-semibold px-2 py-1 rounded-lg"
                :class="stat.trend >= 0? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'"
            >
              {{ stat.trend >= 0? '+' : '' }}{{ stat.trend }}%
            </span>
          </div>
          <div class="space-y-1">
            <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">{{ stat.title }}</p>
            <h3 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              <count-up :end-val="stat.value" :duration="2" />
            </h3>
          </div>
        </div>
        <div
            class="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-40"
            :class="stat.color"
        ></div>
      </GlassCard>

      <GlassCard class="md:col-span-2 lg:col-span-3 row-span-2 flex flex-col">
        <div class="flex justify-between items-center mb-6 p-6 pb-0">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <el-icon class="text-blue-500"><DataLine /></el-icon>
            平台活跃趋势
          </h3>
          <div class="flex bg-gray-100/50 dark:bg-white/5 rounded-lg p-1">
            <button class="px-3 py-1 text-xs font-medium rounded-md bg-white shadow-sm text-gray-800">周</button>
            <button class="px-3 py-1 text-xs font-medium rounded-md text-gray-500 hover:text-gray-800">月</button>
          </div>
        </div>
        <div class="flex-1 w-full h-[350px] px-4" ref="mainChartRef"></div>
      </GlassCard>

      <GlassCard class="flex flex-col h-full">
        <div class="p-6 border-b border-gray-100 dark:border-white/5">
          <h3 class="font-semibold text-gray-900 dark:text-white">快捷操作</h3>
        </div>
        <div class="p-4 grid grid-cols-2 gap-3">
          <button v-for="action in quickActions" :key="action.label" class="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50/50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group">
            <el-icon class="text-2xl mb-2 text-gray-400 group-hover:text-blue-500 transition-colors"><component :is="action.icon" /></el-icon>
            <span class="text-xs font-medium text-gray-600 dark:text-gray-300">{{ action.label }}</span>
          </button>
        </div>
      </GlassCard>

      <GlassCard class="lg:col-span-1 h-full flex flex-col">
        <div class="p-6 pb-2">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">待处理预约</h3>
        </div>
        <div class="flex-1 overflow-y-auto px-4 pb-4 space-y-3 custom-scrollbar">
          <div v-for="apt in recentAppointments" :key="apt.id" class="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
            <el-avatar :size="40" :src="apt.avatar" class="border border-white/20 shadow-sm" />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ apt.studentName }}</p>
              <p class="text-xs text-gray-500 truncate">{{ apt.type }} · {{ apt.time }}</p>
            </div>
            <el-button circle size="small" type="primary" plain>
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>
      </GlassCard>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineComponent, h } from 'vue'
import { useMotion } from '@vueuse/motion'
import * as echarts from 'echarts'
import { Bell, User, Calendar, Warning, DataLine, Plus, Setting, Reading, ArrowRight, Timer } from '@element-plus/icons-vue'
import CountUp from 'vue-countup-v3'

// ------------------- Animation Init -------------------
onMounted(() => {
  const cards = document.querySelectorAll('.glass-card')
  cards.forEach((card, index) => {
    useMotion(card, {
      initial: { opacity: 0, y: 20 },
      enter: {
        opacity: 1,
        y: 0,
        transition: {
          delay: index * 100,
          duration: 600,
          type: 'spring',
          stiffness: 100,
          damping: 15
        }
      }
    })
  })

  initMainChart()
})

// ------------------- Data & State -------------------
const currentDate = new Date().toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })

const statistics =

const quickActions =

const recentAppointments = ref([
  { id: 1, studentName: '李明', type: '心理咨询', time: '10:00', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, studentName: '张晓雯', type: '危机干预', time: '11:30', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, studentName: '王凯', type: '学业咨询', time: '14:00', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: 4, studentName: '赵子龙', type: '心理咨询', time: '15:30', avatar: 'https://i.pravatar.cc/150?u=4' },
])

// ------------------- ECharts Logic -------------------
const mainChartRef = ref<HTMLElement | null>(null)

const initMainChart = () => {
      if (!mainChartRef.value) return

      const myChart = echarts.init(mainChartRef.value)
      const option = {
        grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderColor: 'rgba(0,0,0,0.05)',
          textStyle: { color: '#333' },
          extraCssText: 'backdrop-filter: blur(10px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-radius: 8px;'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data:,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: '#9CA3AF', fontFamily: '-apple-system' }
        },
        yAxis: {
          type: 'value',
          splitLine: { lineStyle: { type: 'dashed', color: '#E5E7EB' } },
          axisLabel: { color: '#9CA3AF', fontFamily: '-apple-system' }
        },
        series:)
    },
      data:
    },
    {
      name: '访问量',
      type: 'line',
      smooth: 0.4,
      symbol: 'none',
      lineStyle: { width: 3, color: '#34C759' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
  { offset: 0, color: 'rgba(52, 199, 89, 0.3)' },
  { offset: 1, color: 'rgba(52, 199, 89, 0)' }
])
},
data:
    }
]
}
myChart.setOption(option)

window.addEventListener('resize', () => myChart.resize())
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}
</style>