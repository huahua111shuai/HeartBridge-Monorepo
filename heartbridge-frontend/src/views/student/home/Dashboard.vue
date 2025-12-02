<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div class="header-left">
        <h1 class="welcome-text">
          早安，{{ studentName }} <span class="emoji">☀️</span>
        </h1>
        <p class="subtitle">今天你的心情指数如何？记得深呼吸。</p>
      </div>
      <div class="header-right">
        <div class="privacy-switch-wrapper">
          <el-switch
              v-model="isPrivacyMode"
              inline-prompt
              active-text="隐私模式"
              inactive-text="标准模式"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #409eff"
          />
        </div>
        <el-button
            class="sos-button"
            type="danger"
            circle
            size="large"
            @click="triggerCrisisProtocol"
        >
          <el-icon class="sos-icon"><BellFilled /></el-icon>
        </el-button>
      </div>
    </header>

    <div class="main-grid">
      <section class="left-panel">
        <div class="card appointment-card glass-effect">
          <div class="card-header">
            <h2 class="section-title">
              <el-icon><Calendar /></el-icon> 近期预约
            </h2>
            <el-tag v-if="nextAppointment" type="success" effect="dark" round>
              即将开始
            </el-tag>
          </div>

          <div v-if="nextAppointment" class="appointment-content">
            <div class="doctor-info">
              <el-avatar :size="64" :src="nextAppointment.avatar" class="doctor-avatar" />
              <div class="text-info">
                <h3 class="doctor-name">{{ isPrivacyMode? '咨询师' : nextAppointment.providerName }}</h3>
                <p class="specialty">{{ nextAppointment.specialty }}</p>
                <div class="time-badge">
                  <el-icon><Timer /></el-icon>
                  {{ formatTime(nextAppointment.startTime) }} ({{ timeUntilText }})
                </div>
              </div>
            </div>
            <div class="action-buttons">
              <el-button type="primary" round class="join-btn" @click="joinSession">
                进入视频咨询
              </el-button>
              <el-button round class="reschedule-btn" @click="handleReschedule">
                变更预约
              </el-button>
            </div>
          </div>

          <div v-else class="empty-appointment">
            <el-empty description="暂无待进行的预约" :image-size="100">
              <el-button type="primary" @click="$router.push('/student/appointment/booking')">
                预约心理咨询
              </el-button>
            </el-empty>
          </div>
        </div>

        <div class="card resources-card glass-effect">
          <div class="card-header">
            <h2 class="section-title">
              <el-icon><Reading /></el-icon> 每日精选
            </h2>
            <el-button link type="primary">查看更多</el-button>
          </div>
          <div class="resource-list">
            <div v-for="item in recommendedResources" :key="item.id" class="resource-item">
              <div class="resource-cover" :style="{ backgroundImage: `url(${item.coverUrl})` }"></div>
              <div class="resource-meta">
                <h4>{{ item.title }}</h4>
                <p>{{ item.summary }}</p>
                <span class="tag">{{ item.category }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside class="right-panel">
        <div class="card quick-actions glass-effect">
          <h3 class="panel-title">快捷通道</h3>
          <div class="action-grid">
            <div class="action-item" @click="$router.push('/student/appointment/booking')">
              <div class="icon-box blue-gradient"><el-icon><Plus /></el-icon></div>
              <span>预约咨询</span>
            </div>
            <div class="action-item" @click="$router.push('/student/appointment/history')">
              <div class="icon-box purple-gradient"><el-icon><Memo /></el-icon></div>
              <span>预约记录</span>
            </div>
            <div class="action-item">
              <div class="icon-box green-gradient"><el-icon><ChatDotRound /></el-icon></div>
              <span>AI 助手</span>
            </div>
            <div class="action-item">
              <div class="icon-box orange-gradient"><el-icon><Notebook /></el-icon></div>
              <span>心情日记</span>
            </div>
          </div>
        </div>

        <transition name="fade">
          <div v-if="showRiskAlert" class="card risk-alert-card">
            <div class="alert-content">
              <el-icon class="alert-icon"><WarningFilled /></el-icon>
              <div>
                <h4>心情预警</h4>
                <p>监测到您最近压力指数较高，建议进行一次放松练习。</p>
              </div>
            </div>
            <el-button type="danger" plain size="small" class="alert-btn">立即放松</el-button>
          </div>
        </transition>

        <div class="card mood-tracker glass-effect">
          <h3 class="panel-title">今日心情</h3>
          <div class="mood-selector">
             <span v-for="mood in moods" :key="mood.value" class="mood-emoji" @click="logMood(mood.value)">
               {{ mood.emoji }}
             </span>
          </div>
        </div>
      </aside>
    </div>

    <el-dialog
        v-model="crisisDialogVisible"
        title="紧急援助通道"
        width="400px"
        center
        destroy-on-close
        class="crisis-dialog"
    >
      <div class="crisis-body">
        <p class="crisis-text">如果你感到极度痛苦或有伤害自己的念头，请立即联系：</p>
        <div class="hotline-box">
          <div class="hotline-row">
            <span>校内24h紧急热线</span>
            <a href="tel:12345678" class="phone-number">123-456-78</a>
          </div>
          <div class="hotline-row">
            <span>全国心理危机干预</span>
            <a href="tel:988" class="phone-number">988</a>
          </div>
        </div>
        <el-button type="primary" class="safety-plan-btn" @click="viewSafetyPlan">查看我的安全计划</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  BellFilled, Calendar, Timer, Reading, Plus, Memo,
  ChatDotRound, Notebook, WarningFilled
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

// --- 状态定义 ---
const router = useRouter();
const studentName = ref('同学');
const isPrivacyMode = ref(false);
const crisisDialogVisible = ref(false);
const showRiskAlert = ref(true); // 模拟后台返回的风险评估

// 模拟预约数据
const nextAppointment = ref<any>(null);

// 模拟资源数据
const recommendedResources = ref([
  { id: 1, title: '如何应对期末考试焦虑？', summary: '认知行为疗法在备考中的应用...', category: '学业压力', coverUrl: 'https://via.placeholder.com/100' },
  { id: 2, title: '正念冥想入门', summary: '5分钟呼吸练习引导', category: '自我关怀', coverUrl: 'https://via.placeholder.com/100' }
]);

const moods = [
  { emoji: '😄', value: 5 },
  { emoji: '🙂', value: 4 },
  { emoji: '😐', value: 3 },
  { emoji: '😔', value: 2 },
  { emoji: '😫', value: 1 }
];

// --- 计算属性 ---
const timeUntilText = computed(() => {
  if (!nextAppointment.value) return '';
  // 简化的时间计算逻辑
  return '2小时后开始';
});

// --- 生命周期与方法 ---
onMounted(async () => {
  // 模拟 API 请求获取用户信息和预约
  setTimeout(() => {
    studentName.value = '林';
    nextAppointment.value = {
      id: 'apt_001',
      providerName: '王心理师',
      specialty: '情绪管理专家',
      startTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2小时后
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    };
  }, 800);
});

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', { hour: 'numeric', minute: 'numeric', hour12: false }).format(date);
};

const triggerCrisisProtocol = () => {
  crisisDialogVisible.value = true;
};

const joinSession = () => {
  window.open('https://zoom.us/j/mock-meeting-id', '_blank');
};

const handleReschedule = () => {
  router.push(`/student/appointment/booking?reschedule=${nextAppointment.value.id}`);
};

const logMood = (val: number) => {
  ElMessage.success('心情记录成功，继续保持觉察！');
};

const viewSafetyPlan = () => {
  // 导航至安全计划页面
  ElMessage.info('正在加载您的个人安全计划...');
};
</script>

<style scoped>
/*
  Liquid Glass Design System Implementation
  参考 iOS 18 设计规范：高斯模糊、柔和阴影、大圆角
*/
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
  background-color: #f5f7fa; /* 柔和背景色 */
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* Header Styles */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.welcome-text {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.subtitle {
  color: #606266;
  margin-top: 8px;
  font-size: 16px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.sos-button {
  box-shadow: 0 4px 14px rgba(245, 108, 108, 0.4);
  transition: transform 0.2s;
}

.sos-button:hover {
  transform: scale(1.05);
}

/* Grid Layout */
.main-grid {
  display: grid;
  grid-template-columns: 2fr 1fr; /* 左2右1比例 */
  gap: 32px;
}

@media (max-width: 768px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}

/* Card Common Styles (Glassmorphism) */
.card {
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  transition: all 0.3s ease;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.1);
}

.section-title,.panel-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

/* Appointment Card Specifics */
.appointment-card {
  background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(236,245,255,0.9) 100%);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.doctor-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.text-info h3 {
  margin: 0;
  font-size: 18px;
}

.specialty {
  color: #909399;
  font-size: 14px;
  margin: 4px 0 12px;
}

.time-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #e1f3d8;
  color: #67c23a;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
}

.action-buttons {
  margin-top: 24px;
  display: flex;
  gap: 12px;
}

/* Quick Actions */
.action-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 20px;
}

.action-item {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.action-item:hover {
  background: #f2f6fc;
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 12px;
  color: white;
}

.blue-gradient { background: linear-gradient(135deg, #409eff, #79bbff); }
.purple-gradient { background: linear-gradient(135deg, #b37feb, #d3adf7); }
.green-gradient { background: linear-gradient(135deg, #67c23a, #95d475); }
.orange-gradient { background: linear-gradient(135deg, #e6a23c, #f3d19e); }

/* Resource List */
.resource-item {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #ebeef5;
}
.resource-item:last-child { border-bottom: none; }
.resource-cover {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
}
.resource-meta h4 { margin: 0 0 4px; font-size: 15px; }
.resource-meta p { margin: 0 0 8px; color: #909399; font-size: 12px; line-height: 1.4; }
.tag { font-size: 10px; background: #f0f2f5; padding: 2px 8px; border-radius: 4px; color: #606266; }

/* Risk Alert */
.risk-alert-card {
  background: #fef0f0;
  border: 1px solid #fde2e2;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.alert-content { display: flex; gap: 12px; align-items: center; }
.alert-icon { font-size: 24px; color: #f56c6c; }
.alert-content h4 { margin: 0; color: #f56c6c; }
.alert-content p { margin: 4px 0 0; font-size: 12px; color: #909399; }

/* Mood Tracker */
.mood-selector {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  font-size: 28px;
}
.mood-emoji { cursor: pointer; transition: transform 0.2s; }
.mood-emoji:hover { transform: scale(1.2); }

/* Crisis Dialog */
.crisis-body { text-align: center; }
.crisis-text { font-weight: 600; margin-bottom: 24px; color: #303133; }
.hotline-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #fef0f0;
  border-radius: 8px;
  margin-bottom: 12px;
}
.phone-number {
  font-weight: 700;
  font-size: 18px;
  color: #f56c6c;
  text-decoration: none;
}
.safety-plan-btn { width: 100%; margin-top: 16px; }
</style>