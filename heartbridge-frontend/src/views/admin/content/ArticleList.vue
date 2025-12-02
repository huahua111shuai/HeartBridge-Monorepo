<template>
  <div class="article-list-container min-h-screen p-6 space-y-6 animate-fade-up">
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <div class="i-sf-doc-text-fill text-blue-500 text-2xl" />
          文章管理
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium ml-9">
          发布与管理心理科普、康复指导等内容
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
            @click="$router.push('/admin/content/article/editor')"
            class="group relative bg-[#007AFF] hover:bg-[#0062CC] text-white px-5 py-2.5 rounded-full transition-all duration-300 shadow-[0_4px_14px_rgba(0,122,255,0.3)] hover:shadow-[0_6px_20px_rgba(0,122,255,0.4)] active:scale-95 flex items-center gap-2"
        >
          <div class="i-sf-plus text-sm font-bold transition-transform duration-300 group-hover:rotate-90" />
          <span class="text-[13px] font-medium">撰写文章</span>
        </button>
      </div>
    </header>

    <GlassCard class="flex flex-col min-h-[600px] overflow-hidden">
      <div class="px-6 py-4 flex flex-col md:flex-row gap-4 items-center justify-between z-10 shrink-0 border-b border-gray-100 dark:border-white/5 bg-white/30 dark:bg-white/5 backdrop-blur-md">
        <div class="flex items-center gap-3 w-full md:w-auto flex-1">
          <div class="relative group w-full md:max-w-xs">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div class="i-sf-magnifyingglass text-gray-400 group-focus-within:text-[#007AFF] transition-colors" />
            </div>
            <input
                v-model="queryParams.title"
                type="text"
                class="block w-full pl-9 pr-3 py-2 border-none rounded-xl bg-gray-100/50 dark:bg-white/10 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/50 transition-all text-sm h-9"
                placeholder="搜索文章标题..."
                @keyup.enter="handleSearch"
            />
          </div>

          <el-select
              v-model="queryParams.category"
              placeholder="全部分类"
              clearable
              class="w-32!bg-transparent apple-select"
              popper-class="glass-popper"
          >
            <el-option label="心理科普" value="SCIENCE" />
            <el-option label="康复指导" value="RECOVERY" />
            <el-option label="最新资讯" value="NEWS" />
          </el-select>

          <el-select
              v-model="queryParams.status"
              placeholder="状态"
              clearable
              class="w-28!bg-transparent apple-select"
              popper-class="glass-popper"
          >
            <el-option label="已发布" :value="1" />
            <el-option label="草稿" :value="0" />
          </el-select>
        </div>

        <div class="flex items-center gap-2">
          <button
              @click="loadData"
              class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 transition-colors active:scale-90"
              title="刷新"
          >
            <div class="i-sf-arrow-clockwise text-base" :class="{ 'animate-spin': loading }" />
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-auto custom-scrollbar relative z-0">
        <el-table
            v-loading="loading"
            :data="articleList"
            style="width: 100%;"
            class="custom-table"
            header-cell-class-name="!bg-transparent!text-gray-500!font-medium!border-b!border-gray-100 dark:!border-white/5!py-3!text-xs!uppercase!tracking-wide"
            cell-class-name="!bg-transparent!border-b!border-gray-50 dark:!border-white/5!py-3 text-gray-700 dark:text-gray-300"
            row-class-name="hover:!bg-blue-50/50 dark:hover:!bg-blue-900/10 transition-colors duration-200 group cursor-default"
        >
          <template #empty>
            <div class="flex flex-col items-center justify-center py-20 text-center">
              <div class="w-20 h-20 mb-4 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center shadow-inner">
                <div class="i-sf-doc-text-magnifyingglass text-3xl text-gray-300 dark:text-gray-600" />
              </div>
              <h3 class="text-gray-900 dark:text-white font-medium">暂无数据</h3>
              <p class="text-gray-500 dark:text-gray-400 text-xs mt-1">没有找到符合条件的文章</p>
            </div>
          </template>

          <el-table-column label="封面" width="80" align="center">
            <template #default="{ row }">
              <div class="w-10 h-10 rounded-lg overflow-hidden shadow-sm border border-white/20 relative group-hover/row:scale-110 transition-transform duration-300">
                <img
                    :src="row.cover || '/src/assets/images/empty-state.png'"
                    class="w-full h-full object-cover"
                    loading="lazy"
                    alt="cover"
                />
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="title" label="标题" min-width="250">
            <template #default="{ row }">
              <div class="flex flex-col">
                <span class="font-medium text-[14px] text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-[#007AFF] transition-colors">
                  {{ row.title }}
                </span>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="text-[11px] text-gray-400 font-mono tracking-tight">{{ formatDate(row.createTime) }}</span>
                  <span v-if="row.tags && row.tags.length" class="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-500">
                    {{ Array.isArray(row.tags)? row.tags.join(', ') : row.tags }}
                  </span>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="category" label="分类" width="120">
            <template #default="{ row }">
              <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors"
                   :class="categoryStyle(row.category)"
              >
                <div :class="categoryIcon(row.category)" class="text-[10px]" />
                {{ formatCategory(row.category) }}
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <div class="flex items-center gap-2">
                <div class="relative flex h-2 w-2">
                  <span v-if="row.status === 1" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2" :class="row.status === 1? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'"></span>
                </div>
                <span :class="row.status === 1? 'text-gray-700 dark:text-gray-200' : 'text-gray-400'" class="text-[12px]">
                  {{ row.status === 1? '已发布' : '草稿箱' }}
                </span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="views" label="阅读量" width="100" align="right">
            <template #default="{ row }">
              <span class="text-xs text-gray-500 font-mono">{{ row.views || 0 }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="140" align="right" fixed="right">
            <template #default="{ row }">
              <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-x-2 group-hover:translate-x-0">
                <el-tooltip content="编辑" placement="top" :show-after="500">
                  <button
                      @click.stop="handleEdit(row)"
                      class="p-2 rounded-lg hover:bg-white dark:hover:bg-white/10 text-gray-400 hover:text-[#007AFF] hover:shadow-sm transition-all active:scale-90"
                  >
                    <div class="i-sf-pencil-circle text-lg" />
                  </button>
                </el-tooltip>

                <el-tooltip content="删除" placement="top" :show-after="500">
                  <button
                      @click.stop="handleDelete(row)"
                      class="p-2 rounded-lg hover:bg-white dark:hover:bg-white/10 text-gray-400 hover:text-red-500 hover:shadow-sm transition-all active:scale-90"
                  >
                    <div class="i-sf-trash text-lg" />
                  </button>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-white/5 bg-white/30 dark:bg-white/5 backdrop-blur-xl z-10">
        <span class="text-xs text-gray-400">共 {{ total }} 篇文章</span>
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            layout="prev, pager, next"
            class="apple-pagination"
            @current-change="loadData"
        />
      </div>

    </GlassCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMotion } from '@vueuse/motion'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getArticlePage, deleteArticle } from '@/api/article'
import type { ArticleVO } from '@/types/entity'
import { formatDate } from '@/utils/date'
import GlassCard from '@/components/common/GlassCard.vue'

const router = useRouter()
const loading = ref(false)
const articleList = ref<ArticleVO>()
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const queryParams = reactive({
  title: '',
  category: '',
  status: '' as string | number
})

const formatCategory = (val: string) => {
  const map: Record<string, string> = {
    'SCIENCE': '心理科普',
    'RECOVERY': '康复指导',
    'NEWS': '最新资讯'
  }
  return map[val] || val
}

const categoryIcon = (val: string) => {
  const map: Record<string, string> = {
    'SCIENCE': 'i-sf-brain-head-profile',
    'RECOVERY': 'i-sf-heart-circle',
    'NEWS': 'i-sf-newspaper'
  }
  return map[val] || 'i-sf-tag'
}

const categoryStyle = (val: string) => {
  const map: Record<string, string> = {
    'SCIENCE': 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/20',
    'RECOVERY': 'bg-teal-50 text-teal-600 border-teal-100 dark:bg-teal-500/10 dark:text-teal-300 dark:border-teal-500/20',
    'NEWS': 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20'
  }
  return map[val] || 'bg-gray-50 text-gray-600 border-gray-100'
}

const loadData = async () => {
  loading.value = true
  try {
    // Artificial delay for smooth loading animation perception
    // await new Promise(r => setTimeout(r, 300))
    const { data } = await getArticlePage({
      page: currentPage.value,
      size: pageSize.value,
      ...queryParams
    })
    articleList.value = data.records
    total.value = data.total
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

const handleEdit = (row: ArticleVO) => {
  router.push({ path: '/admin/content/article/editor', query: { id: row.id } })
}

const handleDelete = async (row: ArticleVO) => {
  try {
    await ElMessageBox.confirm(
        '确定要删除这篇文章吗？此操作将无法撤销。',
        '删除确认',
        {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'apple-message-box glass-effect',
          showClose: false,
          center: true
        }
    )
    await deleteArticle(row.id)
    ElMessage.success({ message: '删除成功', customClass: 'apple-toast' })
    loadData()
  } catch (error) {
    // cancelled
  }
}

onMounted(() => {
  loadData()

  const card = document.querySelector('.glass-card')
  if (card) {
    useMotion(card, {
      initial: { opacity: 0, y: 30, scale: 0.99 },
      enter: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 600,
          ease: [0.22, 1, 0.36, 1] // Apple ease-out-quart
        }
      }
    })
  }
})
</script>

<style scoped>
/* Element Plus Overrides for Apple Feel */
:deep(.el-table__inner-wrapper::before),
:deep(.el-table__border-left-patch) {
  display: none!important;
}

:deep(.el-table) {
  --el-table-header-bg-color: transparent;
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-row-hover-bg-color: transparent; /* Handled by tailwind */
}

/* Apple Select Style */
:deep(.apple-select.el-input__wrapper) {
  background-color: rgba(243, 244, 246, 0.6)!important;
  box-shadow: none!important;
  border-radius: 12px;
  padding: 4px 12px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.dark.apple-select.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.1)!important;
}

:deep(.apple-select.el-input__wrapper:hover),
:deep(.apple-select.el-input.is-focus.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.8)!important;
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2)!important;
}

:deep(.dark.apple-select.el-input__wrapper:hover) {
  background-color: rgba(255, 255, 255, 0.15)!important;
}

/* Pagination Style */
:deep(.apple-pagination.el-pager li) {
  background: transparent!important;
  border-radius: 8px;
  font-weight: 500;
  color: #888;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  transition: all 0.2s;
}

:deep(.apple-pagination.el-pager li.is-active) {
  color: #007AFF;
  background: rgba(0, 122, 255, 0.1)!important;
}

:deep(.apple-pagination.btn-prev),
:deep(.apple-pagination.btn-next) {
  background: transparent!important;
  color: #888;
}

:deep(.apple-pagination.btn-prev:hover),
:deep(.apple-pagination.btn-next:hover) {
  color: #007AFF;
}

/* Custom Animation Keyframes */
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite;
}
</style>