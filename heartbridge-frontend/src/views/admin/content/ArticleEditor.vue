<template>
  <div class="animate-fade-up h-full pb-6">
    <GlassCard class="min-h-[calc(100vh-100px)] flex flex-col relative overflow-hidden">

      <div class="sticky top-0 z-50 bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 transition-all">
        <div class="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button
                @click="handleBack"
                class="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-gray-500 active:scale-90"
            >
              <div class="i-sf-chevron-backward text-xl font-medium" />
            </button>
            <div class="h-6 w-px bg-gray-200 dark:bg-white/10 mx-1" />
            <div class="flex flex-col">
              <span class="text-[10px] text-gray-400 uppercase tracking-widest font-bold">EDITOR</span>
              <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ isEdit? '编辑文章' : '新建文章' }}</span>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span v-if="lastSaved" class="text-xs text-gray-400 mr-2 flex items-center gap-1.5 animate-pulse">
              <div class="i-sf-cloud text-blue-500" />
              已保存 {{ lastSaved }}
            </span>

            <button
                @click="handleSave(0)"
                :disabled="submitting"
                class="px-5 py-2 text-[13px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors active:scale-95 disabled:opacity-50"
            >
              存为草稿
            </button>

            <button
                @click="handleSave(1)"
                :disabled="submitting"
                class="group relative px-6 py-2 text-[13px] font-medium text-white bg-[#007AFF] hover:bg-[#0062CC] rounded-full shadow-[0_4px_12px_rgba(0,122,255,0.3)] hover:shadow-[0_6px_16px_rgba(0,122,255,0.4)] transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 overflow-hidden"
            >
              <div v-if="submitting" class="absolute inset-0 bg-white/20 animate-pulse" />
              <div v-if="submitting" class="i-sf-arrow-triangle-2-circlepath animate-spin" />
              <div v-else class="i-sf-paperplane-fill text-xs" />
              <span>{{ submitting? '发布中...' : '发布文章' }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar">
        <div class="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-8">

          <div class="w-full group relative animate-slide-up" style="animation-delay: 100ms">
            <input
                type="file"
                ref="fileInput"
                class="hidden"
                accept="image/*"
                @change="handleFileChange"
            />

            <div
                v-if="!form.cover"
                class="w-full h-64 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#007AFF] hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-300 group-hover:scale-[1.01]"
                @click="triggerUpload"
            >
              <div class="w-16 h-16 rounded-full bg-white dark:bg-white/10 shadow-sm flex items-center justify-center text-gray-400 group-hover:text-[#007AFF] transition-colors">
                <div class="i-sf-photo-on-rectangle text-3xl" />
              </div>
              <div class="text-center">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-300">点击上传封面图片</p>
                <p class="text-xs text-gray-400 mt-1">支持 JPG, PNG, WEBP (建议尺寸 1200x630)</p>
              </div>
            </div>

            <div v-else class="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-lg shadow-gray-200/50 dark:shadow-none group-hover:shadow-xl transition-all duration-500">
              <img :src="form.cover" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
                <button
                    @click="triggerUpload"
                    class="px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white text-sm font-medium transition-all border border-white/30 flex items-center gap-2"
                >
                  <div class="i-sf-arrow-triangle-2-circlepath" /> 更换封面
                </button>
                <button
                    @click="form.cover = ''"
                    class="px-5 py-2.5 bg-red-500/80 hover:bg-red-600/80 backdrop-blur-md rounded-full text-white text-sm font-medium transition-all border border-white/10 flex items-center gap-2"
                >
                  <div class="i-sf-trash" /> 移除
                </button>
              </div>
            </div>
          </div>

          <div class="relative animate-slide-up" style="animation-delay: 200ms">
            <textarea
                v-model="form.title"
                rows="1"
                class="w-full text-4xl md:text-5xl font-bold bg-transparent border-none placeholder-gray-300 dark:placeholder-gray-700 text-gray-900 dark:text-white focus:ring-0 p-0 leading-tight tracking-tight resize-none overflow-hidden"
                placeholder="请输入文章标题..."
                @input="autoResizeTitle"
                ref="titleInput"
            ></textarea>
          </div>

          <div class="flex flex-wrap items-center gap-4 animate-slide-up" style="animation-delay: 300ms">
            <div class="flex items-center gap-2 bg-gray-100/50 dark:bg-white/5 px-1 py-1 rounded-xl border border-gray-200/50 dark:border-white/5 transition-colors focus-within:bg-white dark:focus-within:bg-white/10 focus-within:border-[#007AFF]/30 focus-within:ring-2 focus-within:ring-[#007AFF]/10">
              <div class="w-8 h-8 rounded-lg bg-gray-200/50 dark:bg-white/10 flex items-center justify-center text-gray-500">
                <div class="i-sf-folder text-sm" />
              </div>
              <el-select
                  v-model="form.category"
                  placeholder="选择分类"
                  class="!w-36!bg-transparent custom-select-borderless"
                  size="large"
              >
                <el-option label="心理科普" value="SCIENCE" />
                <el-option label="康复指导" value="RECOVERY" />
                <el-option label="最新资讯" value="NEWS" />
              </el-select>
            </div>

            <div class="flex-1 flex items-center gap-2 bg-gray-100/50 dark:bg-white/5 px-1 py-1 rounded-xl border border-gray-200/50 dark:border-white/5 transition-colors focus-within:bg-white dark:focus-within:bg-white/10 focus-within:border-[#007AFF]/30 focus-within:ring-2 focus-within:ring-[#007AFF]/10">
              <div class="w-8 h-8 rounded-lg bg-gray-200/50 dark:bg-white/10 flex items-center justify-center text-gray-500">
                <div class="i-sf-tag text-sm" />
              </div>
              <el-select
                  v-model="form.tags"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"
                  placeholder="添加标签..."
                  class="w-full custom-select-borderless"
                  size="large"
              >
                <el-option label="焦虑症" value="Anxiety" />
                <el-option label="抑郁症" value="Depression" />
                <el-option label="睡眠障碍" value="Sleep" />
                <el-option label="压力管理" value="Stress" />
              </el-select>
            </div>
          </div>

          <div class="h-px w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent opacity-50 my-2" />

          <div class="relative min-h-[500px] animate-slide-up" style="animation-delay: 400ms">
            <textarea
                v-model="form.content"
                class="w-full h-full min-h-[600px] bg-transparent border-none resize-none focus:ring-0 text-lg leading-loose text-gray-700 dark:text-gray-300 placeholder-gray-300 dark:placeholder-gray-700 font-serif"
                placeholder="在此处开始撰写正文..."
                spellcheck="false"
            ></textarea>
          </div>

        </div>
      </div>
    </GlassCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMotion } from '@vueuse/motion'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getArticleDetail, publishArticle, uploadFile } from '@/api/article'
import type { ArticlePublishReq } from '@/types/entity'
import GlassCard from '@/components/common/GlassCard.vue'
import { useDate } from '@/utils/date'

const route = useRoute()
const router = useRouter()
const { format } = useDate()

const fileInput = ref<HTMLInputElement | null>(null)
const titleInput = ref<HTMLTextAreaElement | null>(null)
const submitting = ref(false)
const lastSaved = ref('')

const form = reactive<ArticlePublishReq>({
  id: undefined,
  title: '',
  content: '',
  cover: '',
  category: '',
  tags:,
  status: 0
})

const isEdit = computed(() =>!!route.query.id)

// Auto-resize textarea for title
const autoResizeTitle = () => {
  if (titleInput.value) {
    titleInput.value.style.height = 'auto'
    titleInput.value.style.height = titleInput.value.scrollHeight + 'px'
  }
}

const loadDetail = async (id: string) => {
  try {
    const { data } = await getArticleDetail(id)
    Object.assign(form, data)
    if (typeof data.tags === 'string') {
      form.tags = (data.tags as string).split(',')
    }
    nextTick(autoResizeTitle)
  } catch (error) {
    console.error(error)
  }
}

const handleBack = async () => {
  if (form.title |

      | form.content) {
    try {
      await ElMessageBox.confirm(
          '未保存的内容将会丢失，确定要返回吗？',
          '确认离开',
          {
            confirmButtonText: '离开',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'apple-message-box'
          }
      )
      router.back()
    } catch {}
  } else {
    router.back()
  }
}

const triggerUpload = () => {
  fileInput.value?.click()
}

const handleFileChange = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files |

      | files.length === 0) return

  const file = files
  const formData = new FormData()
  formData.append('file', file)

  try {
    const { data } = await uploadFile(formData)
    form.cover = data
    ElMessage.success({ message: '封面上传成功', customClass: 'apple-toast' })
  } catch (error) {
    ElMessage.error({ message: '上传失败', customClass: 'apple-toast' })
  }
}

const handleSave = async (status: number) => {
  if (!form.title.trim()) {
    ElMessage.warning({ message: '请输入文章标题', customClass: 'apple-toast' })
    titleInput.value?.focus()
    return
  }
  if (!form.content.trim()) {
    ElMessage.warning({ message: '请输入正文内容', customClass: 'apple-toast' })
    return
  }
  if (!form.category) {
    ElMessage.warning({ message: '请选择文章分类', customClass: 'apple-toast' })
    return
  }

  submitting.value = true
  try {
    // Clone form to handle tags formatting if needed
    const submitData = {...form }
    submitData.status = status

    await publishArticle(submitData)

    lastSaved.value = format(new Date(), 'HH:mm')
    ElMessage.success({
      message: status === 1? '文章发布成功' : '草稿保存成功',
      customClass: 'apple-toast',
      duration: 2000
    })

    if (status === 1) {
      setTimeout(() => router.push('/admin/content/article/list'), 1000)
    }
  } catch (error) {
    console.error(error)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (route.query.id) {
    loadDetail(route.query.id as string)
  }

  const card = document.querySelector('.glass-card')
  if (card) {
    useMotion(card, {
      initial: { opacity: 0, scale: 0.98, y: 20 },
      enter: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 500, ease: [0.16, 1, 0.3, 1] }
      }
    })
  }
})
</script>

<style scoped>
/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.2);
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.4);
}

/* Borderless Select Overrides */
:deep(.custom-select-borderless.el-input__wrapper) {
  box-shadow: none!important;
  background: transparent!important;
  padding: 0 8px;
}
:deep(.custom-select-borderless.el-input__inner) {
  font-size: 0.95rem;
  color: inherit;
  font-weight: 500;
}
:deep(.custom-select-borderless.el-tag) {
  background: rgba(0, 122, 255, 0.1);
  color: #007AFF;
  border: none;
  border-radius: 6px;
}
:deep(.dark.custom-select-borderless.el-tag) {
  background: rgba(0, 122, 255, 0.2);
  color: #60a5fa;
}

/* Animation utilities */
.animate-slide-up {
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>