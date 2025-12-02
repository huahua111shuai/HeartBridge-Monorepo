<template>
  <div class="intervention-container h-screen bg-[#F5F5F7] dark:bg-black overflow-hidden flex font-sans">

    <aside class="w-[400px] min-w-[380px] bg-white dark:bg-[#1c1c1e] border-r border-gray-200 dark:border-white/10 flex flex-col z-20 shadow-xl">

      <div class="p-6 pb-8 bg-gradient-to-b from-gray-50 to-white dark:from-[#2c2c2e] dark:to-[#1c1c1e] relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />

        <button @click="$router.back()" class="mb-4 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
          <div class="i-sf-chevron-backward" /> 返回列表
        </button>

        <div class="flex items-start gap-5 relative z-10">
          <div class="relative">
            <el-avatar :size="72" :src="student.avatar" class="border-4 border-white dark:border-[#1c1c1e] shadow-md" />
            <div class="absolute -bottom-1 -right-1 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm border-2 border-white dark:border-[#1c1c1e]">
              HIGH RISK
            </div>
          </div>
          <div>
            <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ student.name }}</h2>
            <div class="flex flex-col gap-1 mt-1 text-gray-500 text-sm">
              <span class="flex items-center gap-1.5"><div class="i-sf-number-square" /> {{ student.studentId }}</span>
              <span class="flex items-center gap-1.5"><div class="i-sf-graduationcap" /> {{ student.college }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="h-64 p-4 border-b border-gray-100 dark:border-white/5 relative">
        <div class="flex justify-between items-center mb-2 px-2">
          <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">风险维度画像</h3>
        </div>
        <div ref="radarChartRef" class="w-full h-full" />
      </div>

      <div class="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-black/20 p-6 scrollbar-hide">
        <div class="flex items-center justify-between mb-6 sticky top-0 bg-gray-50/95 dark:bg-black/20 backdrop-blur py-2 z-10">
          <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">历史干预记录</h3>
        </div>

        <el-timeline>
          <el-timeline-item
              v-for="(activity, index) in history"
              :key="index"
              :type="activity.type"
              :color="activity.color"
              :timestamp="activity.timestamp"
              placement="top"
              :hollow="activity.hollow"
          >
            <div class="bg-white dark:bg-[#2c2c2e] p-3 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-md transition-all cursor-pointer group">
              <div class="flex justify-between items-start">
                <h4 class="font-bold text-gray-800 dark:text-gray-200 text-sm group-hover:text-blue-600 transition-colors">{{ activity.title }}</h4>
                <span class="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-500">{{ activity.severity }}</span>
              </div>
              <p class="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed line-clamp-3">{{ activity.content }}</p>
              <div class="mt-2 pt-2 border-t border-gray-50 dark:border-white/5 flex items-center gap-2 text-[10px] text-gray-400">
                <div class="i-sf-person-circle" />
                <span>记录人: {{ activity.staff }}</span>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </aside>

    <main class="flex-1 flex flex-col h-full relative">

      <div class="bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 px-8 py-4 flex justify-between items-center shadow-sm z-30">
        <div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            新建干预记录
            <span class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-xs font-medium border border-blue-100">草稿</span>
          </h1>
          <p class="text-sm text-gray-500">记录日期: {{ currentDate }}</p>
        </div>
        <div class="flex gap-3">
          <button class="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10 rounded-lg transition-colors">取消</button>
          <button
              @click="submitForm"
              :disabled="submitting"
              class="px-6 py-2 text-sm font-medium text-white bg-[#007AFF] hover:bg-[#0062CC] rounded-lg shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70"
          >
            <div v-if="submitting" class="i-sf-arrow-triangle-2-circlepath animate-spin" />
            <span>归档记录</span>
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-8 pb-32 custom-scrollbar">
        <div class="max-w-3xl mx-auto space-y-8">

          <section class="bg-white dark:bg-[#1c1c1e] p-6 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30 relative overflow-hidden animate-slide-up" style="animation-delay: 100ms">
            <div class="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <div class="i-sf-exclamationmark-triangle-fill text-red-500" />
              即时风险评估 (C-SSRS 筛查)
            </h3>

            <div class="space-y-4">
              <div class="flex justify-between items-center border-b border-gray-100 dark:border-white/5 pb-3">
                <span class="text-sm text-gray-800 dark:text-gray-200 w-3/4">1. 是否有希望自己死掉或入睡后不再醒来的念头？</span>
                <el-radio-group v-model="form.cssrs.q1" size="small" class="apple-radio">
                  <el-radio-button label="是" />
                  <el-radio-button label="否" />
                </el-radio-group>
              </div>
              <div class="flex justify-between items-center border-b border-gray-100 dark:border-white/5 pb-3">
                <span class="text-sm text-gray-800 dark:text-gray-200 w-3/4">2. 是否有实际自杀念头？</span>
                <el-radio-group v-model="form.cssrs.q2" size="small" class="apple-radio">
                  <el-radio-button label="是" />
                  <el-radio-button label="否" />
                </el-radio-group>
              </div>
              <transition name="fade">
                <div v-if="form.cssrs.q2 === '是'" class="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-bold text-red-800 dark:text-red-300 w-3/4">3. 是否已实施任何准备行为（如收集药片、购买工具、写遗书）？</span>
                    <el-radio-group v-model="form.cssrs.q3" size="small" class="apple-radio-danger">
                      <el-radio-button label="是" />
                      <el-radio-button label="否" />
                    </el-radio-group>
                  </div>
                </div>
              </transition>
            </div>
          </section>

          <section class="bg-white dark:bg-[#1c1c1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 animate-slide-up" style="animation-delay: 200ms">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <div class="i-sf-eye-fill text-blue-500" />
              观察与诱因
            </h3>

            <el-form :model="form" label-position="top">
              <el-form-item label="主要触发因素 (多选)">
                <el-checkbox-group v-model="form.triggers" class="grid grid-cols-3 gap-3 w-full">
                  <el-checkbox label="学业压力" border class="!ml-0!mr-0 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl" />
                  <el-checkbox label="人际冲突" border class="!ml-0!mr-0 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl" />
                  <el-checkbox label="家庭变故" border class="!ml-0!mr-0 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl" />
                  <el-checkbox label="失恋/情感" border class="!ml-0!mr-0 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl" />
                  <el-checkbox label="经济困难" border class="!ml-0!mr-0 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl" />
                  <el-checkbox label="健康问题" border class="!ml-0!mr-0 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-xl" />
                </el-checkbox-group>
              </el-form-item>

              <el-form-item label="行为描述记录">
                <el-input
                    v-model="form.description"
                    type="textarea"
                    :rows="4"
                    placeholder="请客观描述学生的外显行为、语言及情绪反应..."
                    class="glass-input"
                />
              </el-form-item>
            </el-form>
          </section>

          <section class="bg-white dark:bg-[#1c1c1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 animate-slide-up" style="animation-delay: 300ms">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <div class="i-sf-checkmark-shield-fill text-green-500" />
              干预策略与结果
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">采取的干预措施</label>
                <el-select v-model="form.strategies" multiple collapse-tags placeholder="请选择措施" class="w-full">
                  <el-option label="情感支持/倾听" value="listening" />
                  <el-option label="认知重构" value="cognitive" />
                  <el-option label="放松训练" value="relax" />
                  <el-option label="制定安全计划" value="safety_plan" />
                  <el-option label="联系监护人" value="guardian" />
                  <el-option label="转介专科医院" value="hospital" />
                </el-select>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">干预结果</label>
                <el-select v-model="form.outcome" placeholder="请评估结果" class="w-full">
                  <el-option label="情绪平稳，返回宿舍" value="stable" />
                  <el-option label="情绪改善，持续观察" value="improved" />
                  <el-option label="风险未减，24h监护" value="high_risk" />
                  <el-option label="送医治疗" value="hospitalized" />
                </el-select>
              </div>
            </div>

            <div class="mt-6 pt-6 border-t border-gray-100 dark:border-white/5">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">后续跟进计划</label>
              <el-checkbox-group v-model="form.nextSteps" class="flex flex-col gap-2">
                <el-checkbox label="通知辅导员关注" />
                <el-checkbox label="24小时内电话回访" />
                <el-checkbox label="预约下一次咨询" />
                <el-checkbox label="家校联动会议" />
              </el-checkbox-group>
            </div>
          </section>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import dayjs from 'dayjs'

const route = useRoute()

// --- State ---
const submitting = ref(false)
const currentDate = dayjs().format('YYYY年MM月DD日')
const radarChartRef = ref<HTMLElement | null>(null)
let radarChart: echarts.ECharts | null = null

// Mock Student Data
const student = reactive({
  name: (route.query.name as string) |

      | '林安',
  studentId: (route.query.studentId as string) |

      | '2021001',
  college: '计算机科学与技术学院',
  avatar: 'https://i.pravatar.cc/150?u=1'
})

const form = reactive({
  cssrs: { q1: '', q2: '', q3: '' },
  triggers:,
  description: '',
  strategies:,
  outcome: '',
  nextSteps:
})

// Mock History
const history = [
  {
    title: '紧急干预',
    content: '学生因考试失利产生强烈自责，在宿舍哭泣不止。辅导员上报。',
    timestamp: '2023-11-20 14:00',
    type: 'danger',
    color: '#ef4444',
    staff: '王老师',
    severity: '高危',
    hollow: false
  },
  {
    title: '定期回访',
    content: '情绪较为稳定，表示睡眠有所改善。',
    timestamp: '2023-11-15 09:30',
    type: 'primary',
    color: '#3b82f6',
    staff: '李医生',
    severity: '常规',
    hollow: true
  }
]

// --- ECharts ---
const initChart = () => {
  if (!radarChartRef.value) return
  radarChart = echarts.init(radarChartRef.value)
  const option = {
    radar: {
      indicator: [
        { name: '学业压力', max: 100 },
        { name: '人际关系', max: 100 },
        { name: '情绪状态', max: 100 },
        { name: '家庭支持', max: 100 },
        { name: '睡眠质量', max: 100 },
        { name: '危机过往', max: 100 }
      ],
      center: ['50%', '50%'],
      radius: '65%',
      splitArea: {
        areaStyle: {
          color: ['rgba(255,255,255,0.1)', 'rgba(200,200,200,0.1)']
        }
      },
      axisName: {
        color: '#9CA3AF',
        fontWeight: 'bold'
      }
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: ,
            name: '当前状态',
            itemStyle: { color: '#ef4444' },
            areaStyle: { color: 'rgba(239, 68, 68, 0.2)' },
            lineStyle: { width: 2 }
          },
          {
            value: [50, 50, 50, 50, 50, 50],
            name: '基准线',
            itemStyle: { color: '#3b82f6' },
            lineStyle: { type: 'dashed', width: 1 }
          }
        ]
      }
    ]
  }
  radarChart.setOption(option)
}

// --- Actions ---
const submitForm = () => {
  if (!form.outcome) {
    ElMessage.warning('请选择干预结果')
    return
  }
  if (form.cssrs.q2 === '是' && form.nextSteps.length === 0) {
    ElMessage.error('高风险案例必须勾选后续跟进计划！')
    return
  }

  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    ElMessage.success('干预记录已归档保存')
    // router.push('/admin/crisis/alert-list')
  }, 1500)
}

// --- Lifecycle ---
onMounted(() => {
  nextTick(() => {
    initChart()
    window.addEventListener('resize', () => radarChart?.resize())
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', () => radarChart?.resize())
  radarChart?.dispose()
})
</script>

<style scoped>
/* Scrollbar Hiding */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Custom Checkbox Style for Apple feel */
:deep(.el-checkbox.is-bordered.is-checked) {
  background-color: rgba(0, 122, 255, 0.05);
  border-color: #007AFF;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-slide-up {
  animation: slideUp 0.5s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>