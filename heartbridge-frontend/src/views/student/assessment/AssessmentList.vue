<template>
  <div class="page-container">
    <div class="header-section animate-fade-down">
      <h1 class="page-title">心理测评</h1>
      <p class="page-subtitle">探索内心世界，发现更好的自己</p>
    </div>

    <div class="search-bar-wrapper glass-panel mb-8">
      <el-icon class="search-icon"><Search /></el-icon>
      <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索量表名称、关键词..."
          class="search-input"
      />
    </div>

    <el-tabs v-model="activeCategory" class="ios-tabs mb-8" @tab-click="handleTabClick">
      <el-tab-pane label="全部" name="all" />
      <el-tab-pane label="情绪压力" name="emotion" />
      <el-tab-pane label="性格人格" name="personality" />
      <el-tab-pane label="人际关系" name="social" />
      <el-tab-pane label="学业职业" name="career" />
    </el-tabs>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="n in 6" :key="n" class="skeleton-card">
        <el-skeleton animated>
          <template #template>
            <el-skeleton-item variant="image" style="width: 100%; height: 160px; border-radius: 16px" />
            <div style="padding: 14px">
              <el-skeleton-item variant="h3" style="width: 50%" />
              <el-skeleton-item variant="text" style="margin-top: 8px" />
            </div>
          </template>
        </el-skeleton>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <GlassCard
          v-for="(scale, index) in filteredScales"
          :key="scale.id"
          class="scale-card hover-trigger cursor-pointer group"
          @click="goToDetail(scale.id)"
          v-motion
          :initial="{ opacity: 0, y: 50 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: index * 50, duration: 500 } }"
      >
        <div class="card-cover-wrapper">
          <img :src="scale.coverUrl" alt="cover" class="card-cover group-hover:scale-105 transition-transform duration-500" />
          <div class="card-badge">
            <el-icon><Timer /></el-icon> {{ scale.estimatedTime }}分钟
          </div>
        </div>

        <div class="card-content p-5">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">{{ scale.title }}</h3>
            <div class="rating-badge">
              <el-icon class="text-yellow-400 mr-1"><StarFilled /></el-icon>
              <span>{{ scale.rating }}</span>
            </div>
          </div>

          <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 h-10">
            {{ scale.description }}
          </p>

          <div class="flex items-center justify-between mt-auto">
            <span class="text-xs text-gray-400">{{ scale.questionCount }} 道题目</span>
            <button class="start-btn">
              开始测评
            </button>
          </div>
        </div>
      </GlassCard>
    </div>

    <el-empty v-if="!loading && filteredScales.length === 0" description="未找到相关量表" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Timer, StarFilled } from '@element-plus/icons-vue'
import { useMotion } from '@vueuse/motion'

// 类型定义（模拟 entity.d.ts）
interface Scale {
  id: number
  title: string
  description: string
  coverUrl: string
  category: string
  questionCount: number
  estimatedTime: number
  rating: number
}

const router = useRouter()
const loading = ref(true)
const searchKeyword = ref('')
const activeCategory = ref('all')

// 模拟数据
const scales = ref<Scale>()

onMounted(async () => {
  // 模拟 API 请求
  setTimeout(() => {
    scales.value =
        loading.value = false
  }, 800)

  // 页面进入动画
  const container = document.querySelector('.page-container')
  if (container) {
    useMotion(container, {
      initial: { opacity: 0 },
      enter: { opacity: 1, transition: { duration: 600 } }
    })
  }
})

const filteredScales = computed(() => {
  return scales.value.filter(scale => {
    const matchKeyword = scale.title.toLowerCase().includes(searchKeyword.value.toLowerCase())
    const matchCategory = activeCategory.value === 'all' |

        | scale.category === activeCategory.value
    return matchKeyword && matchCategory
  })
})

const handleTabClick = () => {
  // 可以在这里添加筛选埋点
}

const goToDetail = (id: number) => {
  router.push(`/student/assessment/${id}/do`)
}
</script>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
  min-height: 100vh;
}

.header-section {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #1d1d1f;
  letter-spacing: -0.5px;
  margin-bottom: 8px;
}
.dark.page-title { color: #f5f5f7; }

.page-subtitle {
  font-size: 17px;
  color: #86868b;
  font-weight: 400;
}

/* iOS Style Search Bar */
.search-bar-wrapper {
  max-width: 600px;
  margin: 0 auto 32px;
  height: 50px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  transition: all 0.3s ease;
  background: rgba(118, 118, 128, 0.12);
}
.dark.search-bar-wrapper { background: rgba(118, 118, 128, 0.24); }

.search-bar-wrapper:focus-within {
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.15);
}
.dark.search-bar-wrapper:focus-within { background: rgba(40, 40, 40, 0.8); }

.search-icon {
  font-size: 20px;
  color: #8e8e93;
  margin-right: 8px;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  font-size: 17px;
  color: #1d1d1f;
  outline: none;
}
.dark.search-input { color: #fff; }

/* Scale Card Styling */
.scale-card {
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.4);
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.3s ease;
}
.dark.scale-card { border-color: rgba(255, 255, 255, 0.1); }

.scale-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
}

.card-cover-wrapper {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.card-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-badge {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating-badge {
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  color: #1d1d1f;
  background: rgba(255, 204, 0, 0.2);
  padding: 2px 8px;
  border-radius: 6px;
}
.dark.rating-badge { color: #fff; }

.start-btn {
  background: #007aff;
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.1s;
}

.start-btn:active {
  transform: scale(0.95);
  background: #005ecb;
}

/* Skeleton Loading */
.skeleton-card {
  border-radius: 20px;
  background: white;
  overflow: hidden;
  height: 320px;
}
</style>