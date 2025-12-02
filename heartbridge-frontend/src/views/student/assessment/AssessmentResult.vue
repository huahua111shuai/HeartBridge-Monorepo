<template>
  <div class="result-page">
    <div class="content-wrapper max-w-4xl mx-auto py-10 px-4">

      <section class="mb-8" v-motion :initial="{opacity: 0, y: 20}" :enter="{opacity: 1, y: 0}">
        <GlassCard class="result-header-card p-0 overflow-hidden text-center relative">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-purple-900/20 z-0"></div>

          <div class="relative z-10 py-12 px-6">
            <div class="inline-block p-4 rounded-full bg-white/50 dark:bg-black/20 backdrop-blur-md mb-4 shadow-sm">
              <el-icon :size="40" :color="severityColor"><TrendCharts /></el-icon>
            </div>

            <h1 class="text-gray-500 font-medium mb-2">PHQ-9 抑郁症筛查结果</h1>
            <div class="score-display">
              <span class="text-6xl font-bold tracking-tighter text-gray-900 dark:text-white">{{ resultData?.score }}</span>
              <span class="text-2xl text-gray-400 ml-2">/ 27</span>
            </div>

            <div class="mt-4">
              <span
                  class="severity-tag px-4 py-1 rounded-full text-sm font-bold border"
                  :style="{ color: severityColor, borderColor: severityColor, backgroundColor: `${severityColor}15` }"
              >
                {{ resultData?.severity }}
              </span>
            </div>
          </div>

          <svg class="w-full h-12 text-white dark:text-black fill-current" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill-opacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320H0Z"></path>
          </svg>
        </GlassCard>
      </section>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <section class="md:col-span-2 space-y-6">
          <GlassCard title="结果解读" icon="Document" class="bg-white/70">
            <div class="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
              <p class="mb-4">
                根据您的作答，您的得分为 <strong>{{ resultData?.score }}</strong> 分，处于 <strong>{{ resultData?.severity }}</strong> 区间。
              </p>
              <p>
                {{ resultData?.interpretation }}
              </p>
              <div class="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl mt-6 border-l-4 border-blue-500">
                <h4 class="font-bold text-blue-700 dark:text-blue-300 mb-2">专业建议</h4>
                <p class="text-sm">{{ resultData?.suggestion }}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard title="维度分析" icon="DataAnalysis" v-if="resultData?.dimensions">
            <div ref="radarChartRef" class="w-full h-64"></div>
          </GlassCard>
        </section>

        <aside class="space-y-6">
          <GlassCard title="后续行动" class="bg-white/70">
            <div class="flex flex-col gap-3">
              <el-button
                  class="action-btn h-12 justify-start text-left"
                  :type="isHighRisk? 'danger' : 'primary'"
                  plain
                  icon="Phone"
                  @click="handleBooking"
              >
                {{ isHighRisk? '预约危机干预' : '预约心理咨询' }}
              </el-button>

              <el-button class="action-btn h-12 justify-start text-left" plain icon="Download" @click="exportPDF">
                下载报告 (PDF)
              </el-button>

              <el-button class="action-btn h-12 justify-start text-left" plain icon="Share" @click="shareResult">
                分享结果
              </el-button>
            </div>
          </GlassCard>

          <GlassCard title="推荐阅读" class="bg-white/70">
            <ul class="space-y-3">
              <li v-for="article in resultData?.articles" :key="article.id" class="flex gap-3 group cursor-pointer">
                <div class="w-16 h-16 rounded-lg bg-gray-200 bg-cover bg-center" :style="{backgroundImage: `url(${article.cover})`}"></div>
                <div class="flex-1">
                  <h5 class="text-sm font-medium line-clamp-2 group-hover:text-blue-600 transition-colors">{{ article.title }}</h5>
                  <span class="text-xs text-gray-400">阅读需 {{ article.time }} 分钟</span>
                </div>
              </li>
            </ul>
          </GlassCard>
        </aside>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TrendCharts, Document, DataAnalysis, Phone, Download, Share } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const route = useRoute()
const router = useRouter()
const recordId = route.params.recordId

// Mock Data
const resultData = ref<any>(null)
const radarChartRef = ref<HTMLElement | null>(null)

// 颜色映射
const severityColor = computed(() => {
  const score = resultData.value?.score |

      | 0
  if (score < 5) return '#34C759' // Green
  if (score < 10) return '#FFCC00' // Yellow
  if (score < 15) return '#FF9500' // Orange
  return '#FF3B30' // Red
})

const isHighRisk = computed(() => (resultData.value?.score |

    | 0) >= 15)

onMounted(() => {
  // 模拟 API 获取
  setTimeout(() => {
    resultData.value = {
      score: 12,
      severity: '中度抑郁',
      interpretation: '您的测试结果显示您目前可能存在中度的抑郁情绪。您可能经常感到情绪低落、疲乏无力，对事物缺乏兴趣。这种情况已经开始影响您的日常生活和工作效率。',
      suggestion: '建议您尝试调整生活作息，增加运动。同时，我们强烈建议您预约学校心理咨询中心的老师进行一次面谈，以获得更专业的评估和帮助。请记住，寻求帮助是强者的表现。',
      dimensions: [
        { name: '情绪低落', value: 80 },
        { name: '躯体症状', value: 60 },
        { name: '认知障碍', value: 40 },
        { name: '人际退缩', value: 70 },
        { name: '自杀意念', value: 10 }
      ],
      articles: [
        { id: 1, title: '《接纳不完美的自己：认知行为疗法入门》', time: 8, cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200' },
        { id: 2, title: '《正念冥想：每天10分钟改善情绪》', time: 5, cover: 'https://images.unsplash.com/photo-1515023115689-589c33041697?w=200' }
      ]
    }

    // 初始化图表
    nextTick(() => {
      initChart()
    })
  }, 600)
})

const initChart = () => {
  if (!radarChartRef.value ||!resultData.value?.dimensions) return

  const myChart = echarts.init(radarChartRef.value)
  const option = {
    radar: {
      indicator: resultData.value.dimensions.map((d: any) => ({ name: d.name, max: 100 })),
      splitArea: { areaStyle: { color: ['rgba(0,122,255,0.05)', 'rgba(0,0,0,0)'] } },
      axisName: { color: '#888' }
    },
    series:
  }]
}
myChart.setOption(option)
window.addEventListener('resize', () => myChart.resize())
}

const handleBooking = () => {
  router.push('/student/appointment/booking')
}

const exportPDF = () => {
  ElMessage.success('正在生成 PDF 报告...')
}

const shareResult = () => {
  ElMessage.info('链接已复制到剪贴板')
}
</script>

<style scoped>
.result-page {
  min-height: 100vh;
  background-color: #f5f5f7;
  padding-bottom: 40px;
}
.dark.result-page { background-color: #000; }

.result-header-card {
  border: 1px solid rgba(255,255,255,0.6);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.action-btn {
  width: 100%;
  border-radius: 12px;
  justify-content: flex-start;
  font-weight: 500;
}
</style>