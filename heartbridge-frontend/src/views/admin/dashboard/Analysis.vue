<template>
  <div class="analysis-container min-h-screen p-6 space-y-6 animate-fade-up">
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
      <div>
        <h1 class="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">数据分析</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">深度洞察心理健康服务数据</p>
      </div>
      <div class="flex items-center gap-3 bg-white/50 dark:bg-black/20 backdrop-blur-md p-1 rounded-xl border border-white/20">
        <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :size="'default'"
            class="!border-none!bg-transparent!shadow-none w-64"
        />
        <el-button type="primary" class="!rounded-lg!px-6">导出报表</el-button>
      </div>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      <GlassCard class="col-span-1 lg:col-span-2 min-h-[400px] flex flex-col">
        <div class="p-6 pb-0 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            <span class="mr-2">📈</span> 心理健康状态趋势
          </h3>
          <div class="flex gap-2">
            <span class="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
            <span class="text-xs text-gray-500">焦虑指数</span>
          </div>
        </div>
        <div class="flex-1 w-full p-4" ref="trendChartRef"></div>
      </GlassCard>

      <GlassCard class="col-span-1 min-h-[400px] flex flex-col">
        <div class="p-6 pb-0">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            <span class="mr-2">🧩</span> 测评类型分布
          </h3>
        </div>
        <div class="flex-1 w-full relative" ref="pieChartRef"></div>
        <div class="px-6 pb-6 grid grid-cols-2 gap-4">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-blue-500"></div>
            <span class="text-xs text-gray-500">人格测评 45%</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-purple-500"></div>
            <span class="text-xs text-gray-500">情绪压力 30%</span>
          </div>
        </div>
      </GlassCard>

      <GlassCard class="col-span-1 lg:col-span-3 min-h-[350px] flex flex-col">
        <div class="p-6 pb-0">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            <span class="mr-2">🏢</span> 各学院参与度排名
          </h3>
        </div>
        <div class="flex-1 w-full px-4" ref="barChartRef"></div>
      </GlassCard>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useMotion } from '@vueuse/motion'
import * as echarts from 'echarts'

const dateRange = ref('')

// Refs for chart containers
const trendChartRef = ref<HTMLElement | null>(null)
const pieChartRef = ref<HTMLElement | null>(null)
const barChartRef = ref<HTMLElement | null>(null)

// Chart Instances
let trendChart: echarts.ECharts | null = null
let pieChart: echarts.ECharts | null = null
let barChart: echarts.ECharts | null = null

const initCharts = () => {
  // 1. Trend Chart (iOS Health Style Line)
  if (trendChartRef.value) {
    trendChart = echarts.init(trendChartRef.value)
    trendChart.setOption({
      grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 12,
        padding: 12,
        textStyle: { color: '#1F2937' },
        extraCssText: 'box-shadow: 0 10px 30px rgba(0,0,0,0.1); backdrop-filter: blur(10px);'
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月'],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#9CA3AF' }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { type: 'dashed', color: '#E5E7EB' } },
        axisLabel: { color: '#9CA3AF' }
      },
      series: [{
        data: ,
        type: 'line',
        smooth: 0.5,
        showSymbol: false,
        lineStyle: { width: 4, color: '#007AFF' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 122, 255, 0.4)' },
            { offset: 1, color: 'rgba(0, 122, 255, 0)' }
          ])
        }
      }]
    })
  }

  // 2. Pie Chart (Donut Style)
  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value)
    pieChart.setOption({
      tooltip: { trigger: 'item' },
      series: [
        {
          name: '测评类型',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: { show: false },
          emphasis: {
            label: { show: true, fontSize: 16, fontWeight: 'bold' }
          },
          data:
        }
      ]
    })
  }

  // 3. Bar Chart (Rounded Columns)
  if (barChartRef.value) {
    barChart = echarts.init(barChartRef.value)
    barChart.setOption({
          grid: { left: '3%', right: '3%', bottom: '3%', top: '5%', containLabel: true },
          tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
          xAxis: {
            type: 'category',
            data: ['计算机', '经管', '人文', '外语', '艺术', '体育', '理学'],
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { color: '#6B7280' }
          },
          yAxis: {
            type: 'value',
            splitLine: { show: false },
            axisLabel: { show: false }
          },
          series:
        },
        showBackground: true,
        backgroundStyle: {
      color: 'rgba(180, 180, 180, 0.1)',
          borderRadius: [20, 20, 20, 20]
    },
    data:
  }
]
})
}
}

// ------------------- Lifecycle -------------------
onMounted(() => {
  const cards = document.querySelectorAll('.glass-card')
  cards.forEach((card, index) => {
    useMotion(card, {
      initial: { opacity: 0, y: 30 },
      enter: {
        opacity: 1,
        y: 0,
        transition: {
          delay: index * 100,
          duration: 700,
          ease: 'easeOut'
        }
      }
    })
  })

  // Delay chart init to ensure container size is calculated
  setTimeout(initCharts, 100)

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  pieChart?.dispose()
  barChart?.dispose()
})

const handleResize = () => {
  trendChart?.resize()
  pieChart?.resize()
  barChart?.resize()
}
</script>

<style scoped>
/* Override Element Plus DatePicker input style to match Glassmorphism */
:deep(.el-input__wrapper) {
  background-color: transparent!important;
  box-shadow: none!important;
}
:deep(.el-range-separator) {
  color: #6B7280!important;
}
:deep(.el-input__inner) {
  color: #374151!important;
  font-weight: 500;
}
.dark :deep(.el-input__inner) {
  color: #E5E7EB!important;
}
</style>