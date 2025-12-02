<template>
  <div class="assessment-do-container">
    <header class="progress-header glass-panel">
      <div class="flex justify-between items-center mb-2 px-4">
        <el-button link @click="confirmExit">取消</el-button>
        <span class="text-sm font-semibold text-gray-500">问题 {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}</span>
        <el-button link disabled></el-button> </div>
      <div class="progress-track">
        <div
            class="progress-fill"
            :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
    </header>

    <main class="main-content">
      <div v-if="loading" class="flex justify-center items-center h-full">
        <el-icon class="is-loading text-4xl text-blue-500"><Loading /></el-icon>
      </div>

      <div v-else class="question-wrapper max-w-2xl mx-auto w-full">
        <GlassCard class="question-card p-8 md:p-12 relative overflow-hidden">
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>

          <transition :name="transitionName" mode="out-in">
            <div :key="currentQuestion.id" class="w-full">
              <h2 class="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8 leading-tight">
                {{ currentQuestion.content }}
              </h2>

              <div class="options-list space-y-4">
                <div
                    v-for="option in currentQuestion.options"
                    :key="option.value"
                    class="option-item"
                    :class="{ 'is-selected': isSelected(option.value) }"
                    @click="handleSelect(option.value)"
                >
                  <div class="flex items-center justify-between w-full">
                    <span class="text-lg font-medium">{{ option.label }}</span>
                    <div class="checkbox-circle">
                      <el-icon v-if="isSelected(option.value)" class="text-white"><Check /></el-icon>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-8 text-center text-gray-400 text-sm">
                请根据您最近两周的实际情况回答
              </div>
            </div>
          </transition>
        </GlassCard>

        <div class="action-bar mt-8 flex justify-between items-center px-4">
          <el-button
              round
              size="large"
              :disabled="currentQuestionIndex === 0"
              @click="prevQuestion"
              class="nav-btn"
          >
            上一题
          </el-button>

          <el-button
              type="primary"
              round
              size="large"
              :disabled="!canProceed"
              :loading="submitting"
              @click="nextQuestion"
              class="next-btn shadow-lg shadow-blue-500/30"
          >
            {{ isLastQuestion? '提交评估' : '下一题' }}
          </el-button>
        </div>
      </div>
    </main>

    <el-dialog v-model="showExitDialog" title="退出测评？" width="320px" center align-center class="ios-dialog">
      <span class="text-gray-600 text-center block">当前的进度将不会保存，确定要退出吗？</span>
      <template #footer>
        <div class="flex justify-center gap-4">
          <el-button @click="showExitDialog = false">继续作答</el-button>
          <el-button type="danger" @click="router.back()">确认退出</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Loading, Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useMotion } from '@vueuse/motion'

const route = useRoute()
const router = useRouter()
const scaleId = route.params.id

// 状态
const loading = ref(true)
const submitting = ref(false)
const showExitDialog = ref(false)
const currentQuestionIndex = ref(0)
const answers = ref<Record<number, any>>({}) // Map<questionId, value>
const transitionName = ref('slide-left')

// 模拟数据结构
interface Option {
  label: string
  value: number
  score: number
}
interface Question {
  id: number
  content: string
  type: 'single' | 'multiple'
  options: Option
}

const questions = ref<Question>()

// Mock Data Load
onMounted(() => {
  setTimeout(() => {
    // 模拟 PHQ-9 题目
    questions.value = Array.from({ length: 9 }).map((_, i) => ({
      id: i + 1,
      content: [
        '做事时提不起劲或没有兴趣',
        '感到心情低落、沮丧或绝望',
        '入睡困难、睡不着或睡得太多',
        '感觉疲倦或没有活力',
        '食欲不振或吃太多',
        '对自己感到不满，或者觉得自己是个失败者',
        '注意力不能集中（如看报纸或看电视时）',
        '说话或行动缓慢，或者相反，烦躁坐立不安',
        '有不如死掉或用某种方式伤害自己的念头'
      ][i],
      type: 'single',
      options: [
        { label: '完全不会', value: 0, score: 0 },
        { label: '好几天', value: 1, score: 1 },
        { label: '一半以上的天数', value: 2, score: 2 },
        { label: '几乎每天', value: 3, score: 3 }
      ]
    }))
    loading.value = false

    // 入场动画
    useMotion(document.querySelector('.question-card')!, {
      initial: { opacity: 0, scale: 0.95 },
      enter: { opacity: 1, scale: 1, transition: { duration: 400 } }
    })
  }, 500)
})

// Computed
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] |

    | {})
const totalQuestions = computed(() => questions.value.length)
const progressPercentage = computed(() => ((currentQuestionIndex.value + 1) / totalQuestions.value) * 100)
const isLastQuestion = computed(() => currentQuestionIndex.value === totalQuestions.value - 1)
const canProceed = computed(() => answers.value[currentQuestion.value.id]!== undefined)

// Methods
const isSelected = (val: number) => {
  return answers.value[currentQuestion.value.id] === val
}

const handleSelect = (val: number) => {
  answers.value[currentQuestion.value.id] = val
  // 自动跳转体验优化：如果是单选，短暂延迟后自动下一题（ResearchKit 风格）
  if (currentQuestion.value.type === 'single' &&!isLastQuestion.value) {
    setTimeout(() => {
      nextQuestion()
    }, 250)
  }
}

const nextQuestion = async () => {
  if (isLastQuestion.value) {
    await submitAssessment()
  } else {
    transitionName.value = 'slide-left'
    currentQuestionIndex.value++
  }
}

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    transitionName.value = 'slide-right'
    currentQuestionIndex.value--
  }
}

const confirmExit = () => {
  showExitDialog.value = true
}

const submitAssessment = async () => {
  submitting.value = true
  // Mock API Submission
  setTimeout(() => {
    submitting.value = false
    // 假设后端返回 recordId = 12345
    router.push(`/student/assessment/result/12345`)
  }, 1500)
}
</script>

<style scoped>
.assessment-do-container {
  min-height: 100vh;
  background-color: #f2f2f7; /* iOS grouped background */
  display: flex;
  flex-direction: column;
}
.dark.assessment-do-container { background-color: #000; }

.progress-header {
  position: sticky;
  top: 0;
  z-index: 50;
  padding-top: 10px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0,0,0,0.05);
}
.dark.progress-header { background: rgba(0,0,0,0.8); border-bottom: 1px solid rgba(255,255,255,0.1); }

.progress-track {
  height: 4px;
  background: #e5e5ea;
  width: 100%;
}
.dark.progress-track { background: #333; }

.progress-fill {
  height: 100%;
  background: #007aff;
  transition: width 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
}

/* Option Items - iOS List Style */
.option-item {
  background: rgba(240, 240, 245, 0.6);
  border: 2px solid transparent;
  padding: 16px 20px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}
.dark.option-item { background: rgba(28, 28, 30, 0.6); }

.option-item:hover {
  background: rgba(220, 220, 230, 0.8);
}
.dark.option-item:hover { background: rgba(44, 44, 46, 0.8); }

.option-item.is-selected {
  background: #fff;
  border-color: #007aff;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.15);
}
.dark.option-item.is-selected { background: #1c1c1e; border-color: #0a84ff; }

.checkbox-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #c7c7cc;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.is-selected.checkbox-circle {
  background: #007aff;
  border-color: #007aff;
}

/* Nav Buttons */
.nav-btn,.next-btn {
  font-weight: 600;
  min-width: 120px;
  height: 48px;
}
.next-btn {
  background: #007aff;
  border: none;
}
.next-btn:active { transform: scale(0.98); }

/* Slide Transitions */
.slide-left-enter-active,.slide-left-leave-active,
.slide-right-enter-active,.slide-right-leave-active {
  transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
}

.slide-left-enter-from { opacity: 0; transform: translateX(30px); }
.slide-left-leave-to { opacity: 0; transform: translateX(-30px); }

.slide-right-enter-from { opacity: 0; transform: translateX(-30px); }
.slide-right-leave-to { opacity: 0; transform: translateX(30px); }
</style>