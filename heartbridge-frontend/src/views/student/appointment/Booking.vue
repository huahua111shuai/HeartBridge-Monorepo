<template>
  <div class="booking-page">
    <div class="wizard-container glass-effect">
      <div class="wizard-header">
        <h2 class="page-title">预约心理咨询</h2>
        <el-steps :active="currentStep" finish-status="success" simple class="custom-steps">
          <el-step title="选择咨询师" icon="User" />
          <el-step title="选择时间" icon="Calendar" />
          <el-step title="确认信息" icon="Check" />
        </el-steps>
      </div>

      <transition name="slide-fade" mode="out-in">
        <section v-if="currentStep === 0" class="step-content" key="step1">
          <div class="filter-bar">
            <el-input
                v-model="searchQuery"
                placeholder="搜索姓名或专长（如：焦虑、失眠）"
                prefix-icon="Search"
                class="search-input"
                clearable
            />
            <div class="filter-tags">
              <el-check-tag
                  v-for="tag in commonTags"
                  :key="tag"
                  :checked="selectedTags.includes(tag)"
                  @change="toggleTag(tag)"
              >
                {{ tag }}
              </el-check-tag>
            </div>
          </div>

          <div class="provider-list-scroll">
            <div
                v-for="provider in filteredProviders"
                :key="provider.id"
                class="provider-card"
                :class="{ 'is-selected': selectedProvider?.id === provider.id }"
                @click="selectProvider(provider)"
            >
              <div class="provider-main">
                <div class="avatar-wrapper">
                  <el-avatar :size="70" :src="provider.avatar" />
                  <span class="status-dot" :class="provider.available? 'online' : 'offline'"></span>
                </div>
                <div class="provider-details">
                  <h3 class="name">{{ provider.name }}</h3>
                  <p class="title">{{ provider.title }}</p>
                  <div class="skill-tags">
                    <el-tag size="small" type="info" v-for="skill in provider.skills" :key="skill">{{ skill }}</el-tag>
                  </div>
                  <div class="meta-row">
                    <span class="language"><el-icon><Microphone /></el-icon> {{ provider.languages.join(', ') }}</span>
                  </div>
                </div>
              </div>
              <div class="provider-availability">
                <span class="next-slot">最早可约：{{ provider.nextSlot }}</span>
                <el-icon class="arrow-icon"><ArrowRight /></el-icon>
              </div>
            </div>
          </div>
        </section>

        <section v-else-if="currentStep === 1" class="step-content" key="step2">
          <div class="schedule-layout">
            <div class="calendar-wrapper">
              <el-calendar v-model="selectedDate">
                <template #date-cell="{ data }">
                  <div class="custom-date-cell" :class="{ 'is-selected': data.isSelected }">
                    <span class="day-num">{{ data.day.split('-').pop() }}</span>
                    <div v-if="hasSlots(data.day)" class="slot-dots">
                      <span class="dot"></span>
                    </div>
                  </div>
                </template>
              </el-calendar>
            </div>

            <div class="slots-panel">
              <h3 class="slots-header">
                {{ formatDate(selectedDate) }} 可用时段
                <small class="timezone-hint">时区：北京时间 (GMT+8)</small>
              </h3>

              <div v-if="isLoadingSlots" class="loading-slots">
                <el-skeleton :rows="3" animated />
              </div>

              <div v-else class="slots-grid">
                <button
                    v-for="slot in availableSlots"
                    :key="slot.time"
                    class="slot-item"
                    :class="{ 'active': selectedSlot === slot.time }"
                    @click="selectSlot(slot.time)"
                >
                  {{ slot.time }}
                </button>
                <div v-if="availableSlots.length === 0" class="no-slots-tip">
                  当日暂无可用时段，请切换日期。
                </div>
              </div>
            </div>
          </div>
        </section>

        <section v-else-if="currentStep === 2" class="step-content confirmation-step" key="step3">
          <div class="summary-box">
            <div class="summary-header">
              <el-icon class="confirm-icon"><cal-check /></el-icon>
              <h3>请核对预约信息</h3>
            </div>

            <div class="info-row">
              <label>咨询专家</label>
              <div class="value-highlight">{{ selectedProvider?.name }} <small>{{ selectedProvider?.title }}</small></div>
            </div>
            <div class="info-row">
              <label>预约时间</label>
              <div class="value-highlight">{{ formatDate(selectedDate) }} {{ selectedSlot }}</div>
            </div>
            <div class="info-row">
              <label>咨询方式</label>
              <div class="value-highlight">视频咨询 (Zoom)</div>
            </div>

            <el-divider />

            <div class="form-section">
              <label class="form-label">咨询意向（选填）</label>
              <el-input
                  v-model="visitReason"
                  type="textarea"
                  :rows="3"
                  placeholder="简要描述你想聊的话题（如：最近失眠严重、人际关系困扰等）。此信息仅咨询师可见。"
              />
            </div>

            <div class="consent-section">
              <el-checkbox v-model="hasConsented">
                我已阅读并同意 <a href="#">《心理咨询知情同意书》</a> 及 <a href="#">《隐私保护政策》</a>
              </el-checkbox>
            </div>
          </div>
        </section>
      </transition>

      <div class="action-footer">
        <el-button v-if="currentStep > 0" @click="prevStep" icon="ArrowLeft">上一步</el-button>
        <div class="spacer"></div>
        <el-button
            type="primary"
            size="large"
            @click="handleNext"
            :disabled="!canProceed"
            :loading="isSubmitting"
        >
          {{ currentStep === 2? '确认预约' : '下一步' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Search, User, Calendar, Check, ArrowRight, ArrowLeft, Microphone } from '@element-plus/icons-vue';

// --- 状态管理 ---
const router = useRouter();
const currentStep = ref(0);
const searchQuery = ref('');
const selectedTags = ref<string>();
const commonTags = ['焦虑', '抑郁', '人际关系', '学业压力', '自我探索'];

// 选中的数据
const selectedProvider = ref<any>(null);
const selectedDate = ref(new Date());
const selectedSlot = ref<string | null>(null);
const visitReason = ref('');
const hasConsented = ref(false);
const isSubmitting = ref(false);

// 模拟数据源
const providers =, languages: ['普通话', 'English'],
    avatar: 'https://via.placeholder.com/150', nextSlot: '明日 14:00', available: true
},
{
  id: 2, name: '李老师', title: '资深咨询师',
    skills: ['人际关系', '家庭治疗'], languages: ['普通话', '粤语'],
    avatar: 'https://via.placeholder.com/150', nextSlot: '11月20日', available: true
}
];

// --- 逻辑处理 ---

// 1. 筛选逻辑
const filteredProviders = computed(() => {
  return providers.filter(p => {
    const matchesSearch = p.name.includes(searchQuery.value) |

        | p.skills.some(s => s.includes(searchQuery.value));
    const matchesTags = selectedTags.value.length === 0 |

        | selectedTags.value.some(tag => p.skills.includes(tag));
    return matchesSearch && matchesTags;
  });
});

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag);
  if (index > -1) selectedTags.value.splice(index, 1);
  else selectedTags.value.push(tag);
};

const selectProvider = (provider: any) => {
  selectedProvider.value = provider;
};

// 2. 日历与时段逻辑
const isLoadingSlots = ref(false);
const availableSlots = ref<{time: string}>();

// 监听日期变化，模拟获取时段
watch(selectedDate, (newVal) => {
  isLoadingSlots.value = true;
  selectedSlot.value = null;
  // 模拟网络延迟
  setTimeout(() => {
    // 随机生成时段
    availableSlots.value = Math.random() > 0.3
        ? [{time: '09:00'}, {time: '10:30'}, {time: '14:00'}, {time: '16:30'}]
        :;
    isLoadingSlots.value = false;
  }, 600);
});

const hasSlots = (dayStr: string) => {
  // 简单的伪随机逻辑用于展示UI
  return parseInt(dayStr.split('-').pop()!) % 3!== 0;
};

const selectSlot = (time: string) => {
  selectedSlot.value = time;
};

// 3. 步骤控制
const canProceed = computed(() => {
  if (currentStep.value === 0) return!!selectedProvider.value;
  if (currentStep.value === 1) return!!selectedSlot.value;
  if (currentStep.value === 2) return hasConsented.value;
  return false;
});

const prevStep = () => { if (currentStep.value > 0) currentStep.value--; };

const handleNext = () => {
  if (currentStep.value < 2) {
    currentStep.value++;
  } else {
    submitBooking();
  }
};

const submitBooking = () => {
  isSubmitting.value = true;
  // 模拟提交
  setTimeout(() => {
    isSubmitting.value = false;
    ElMessage.success({
      message: '预约成功！请在“我的记录”中查看详情。',
      duration: 3000
    });
    router.push('/student/appointment/history');
  }, 1500);
};

// 工具函数
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' }).format(date);
};
</script>

<style scoped>
/* Booking Page Layout */
.booking-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 100vh;
  background: #f0f2f5;
}

.wizard-container {
  background: #fff;
  border-radius: 24px;
  padding: 40px;
  min-height: 600px;
  display: flex;
  flex-direction: column;
}

.wizard-header { margin-bottom: 40px; text-align: center; }
.page-title { margin-bottom: 30px; color: #303133; }
.custom-steps { max-width: 800px; margin: 0 auto; background: transparent; }

/* Filter Styles */
.filter-bar { margin-bottom: 24px; }
.search-input { margin-bottom: 16px; }
.filter-tags { display: flex; gap: 12px; flex-wrap: wrap; }

/* Provider Card */
.provider-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border: 1px solid #ebeef5;
  border-radius: 16px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.provider-card:hover { border-color: #409eff; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.provider-card.is-selected { background-color: #ecf5ff; border-color: #409eff; border-width: 2px; }

.provider-main { display: flex; gap: 20px; align-items: center; }
.avatar-wrapper { position: relative; }
.status-dot { width: 12px; height: 12px; background: #ccc; border-radius: 50%; position: absolute; bottom: 2px; right: 2px; border: 2px solid #fff; }
.status-dot.online { background: #67c23a; }

.provider-details.name { margin: 0; font-size: 18px; }
.provider-details.title { margin: 4px 0 8px; color: #909399; font-size: 14px; }
.skill-tags { display: flex; gap: 8px; margin-bottom: 8px; }
.language { font-size: 12px; color: #606266; }

.provider-availability { text-align: right; color: #909399; font-size: 13px; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }

/* Calendar & Slots */
.schedule-layout { display: grid; grid-template-columns: 1.5fr 1fr; gap: 32px; }
.slots-panel { background: #fafafa; padding: 24px; border-radius: 16px; }
.slots-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 20px; }

.slot-item {
  padding: 12px;
  border: 1px solid #dcdfe6;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}
.slot-item.active { background: #409eff; color: white; border-color: #409eff; }
.slot-item:hover:not(.active) { border-color: #409eff; color: #409eff; }

.custom-date-cell { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; }
.dot { width: 6px; height: 6px; background: #409eff; border-radius: 50%; margin-top: 4px; }

/* Confirmation */
.summary-box { max-width: 600px; margin: 0 auto; background: #f9fafe; padding: 32px; border-radius: 16px; }
.info-row { display: flex; justify-content: space-between; margin-bottom: 16px; }
.label { color: #909399; }
.value-highlight { font-weight: 600; color: #303133; }
.form-section { margin: 24px 0; }

.action-footer { margin-top: auto; padding-top: 32px; border-top: 1px solid #ebeef5; display: flex; }
.spacer { flex: 1; }

/* Transition */
.slide-fade-enter-active,.slide-fade-leave-active { transition: all 0.3s ease; }
.slide-fade-enter-from { opacity: 0; transform: translateX(20px); }
.slide-fade-leave-to { opacity: 0; transform: translateX(-20px); }
</style>