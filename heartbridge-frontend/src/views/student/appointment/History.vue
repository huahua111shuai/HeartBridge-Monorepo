<template>
  <div class="history-page">
    <div class="page-header">
      <h1>我的预约记录</h1>
      <p>回顾你的成长足迹，管理即将到来的咨询。</p>
    </div>

    <el-tabs v-model="activeTab" class="history-tabs" type="card">

      <el-tab-pane label="即将开始" name="upcoming">
        <div v-if="upcomingList.length > 0" class="card-list">
          <div v-for="apt in upcomingList" :key="apt.id" class="apt-card upcoming">
            <div class="status-strip"></div>
            <div class="card-body">
              <div class="date-box">
                <span class="month">{{ getMonth(apt.date) }}</span>
                <span class="day">{{ getDay(apt.date) }}</span>
              </div>
              <div class="info-box">
                <h3>{{ apt.providerName }} <el-tag size="small" effect="plain">{{ apt.type }}</el-tag></h3>
                <p class="time-loc">
                  <el-icon><Clock /></el-icon> {{ apt.time }}
                  <span class="divider">|</span>
                  <el-icon><VideoCamera /></el-icon> Zoom 会议
                </p>
              </div>
              <div class="action-box">
                <el-button type="primary" round class="action-btn" @click="enterMeeting(apt.link)">
                  进入会议
                </el-button>
                <el-button round plain class="action-btn" @click="handleCancelRequest(apt)">
                  取消/改期
                </el-button>
              </div>
            </div>
          </div>
        </div>
        <el-empty v-else description="暂无即将开始的预约">
          <el-button type="primary" @click="$router.push('/student/appointment/booking')">去预约</el-button>
        </el-empty>
      </el-tab-pane>

      <el-tab-pane label="已完成" name="completed">
        <div class="card-list">
          <div v-for="apt in completedList" :key="apt.id" class="apt-card completed">
            <div class="card-body">
              <div class="info-box simple">
                <h3>{{ apt.providerName }}</h3>
                <p class="timestamp">{{ apt.date }} {{ apt.time }}</p>
              </div>
              <div class="status-badge">
                <el-tag type="success"><el-icon><Check /></el-icon> 已完成</el-tag>
              </div>
              <div class="action-box">
                <el-button link type="primary" @click="viewNotes(apt.id)">查看反馈</el-button>
                <el-button size="small" type="primary" plain @click="rebook(apt.providerId)">
                  再次预约
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="已取消" name="canceled">
        <div class="card-list">
          <div v-for="apt in canceledList" :key="apt.id" class="apt-card canceled">
            <div class="card-body">
              <div class="info-box simple opacity-50">
                <h3>{{ apt.providerName }}</h3>
                <p class="timestamp">原定: {{ apt.date }}</p>
              </div>
              <el-tag type="info">已取消</el-tag>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
        v-model="cancelDialogVisible"
        title="取消预约"
        width="30%"
        align-center
        class="cancel-dialog"
    >
      <div class="dialog-content">
        <p class="warning-text">确定要取消与 <strong>{{ selectedApt?.providerName }}</strong> 的预约吗？</p>
        <div class="suggestion-box">
          <el-icon><Calendar /></el-icon>
          <span>建议选择“改期”以保留您的治疗进度。</span>
        </div>

        <el-form class="reason-form">
          <el-form-item label="取消原因（可选）">
            <el-select v-model="cancelReason" placeholder="请选择原因" style="width: 100%">
              <el-option label="时间冲突" value="conflict" />
              <el-option label="身体不适" value="sick" />
              <el-option label="感觉好转，不再需要" value="better" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelDialogVisible = false">暂不取消</el-button>
          <el-button type="primary" @click="redirectToReschedule">去改期</el-button>
          <el-button type="danger" plain @click="confirmCancel">确认取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Clock, VideoCamera, Check, Calendar } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const router = useRouter();
const activeTab = ref('upcoming');
const cancelDialogVisible = ref(false);
const selectedApt = ref<any>(null);
const cancelReason = ref('');

// 模拟数据
const allAppointments = ref([
  { id: 101, providerName: '陈博士', providerId: 1, date: '2023-11-20', time: '14:00', type: '初诊', status: 'upcoming', link: 'zoom_url' },
  { id: 102, providerName: '李老师', providerId: 2, date: '2023-10-15', time: '09:00', type: '复诊', status: 'completed', link: '' },
  { id: 103, providerName: '王心理师', providerId: 3, date: '2023-09-01', time: '16:00', type: '初诊', status: 'canceled', link: '' }
]);

// 计算属性过滤列表
const upcomingList = computed(() => allAppointments.value.filter(a => a.status === 'upcoming'));
const completedList = computed(() => allAppointments.value.filter(a => a.status === 'completed'));
const canceledList = computed(() => allAppointments.value.filter(a => a.status === 'canceled'));

// 日期处理工具
const getMonth = (dateStr: string) => new Date(dateStr).toLocaleString('zh-CN', { month: 'short' });
const getDay = (dateStr: string) => new Date(dateStr).getDate();

// 交互逻辑
const enterMeeting = (url: string) => {
  window.open(url, '_blank');
};

const handleCancelRequest = (apt: any) => {
  selectedApt.value = apt;
  cancelReason.value = '';
  cancelDialogVisible.value = true;
};

const redirectToReschedule = () => {
  cancelDialogVisible.value = false;
  router.push({ path: '/student/appointment/booking', query: { rescheduleId: selectedApt.value.id } });
};

const confirmCancel = () => {
  // 模拟 API 调用
  const index = allAppointments.value.findIndex(a => a.id === selectedApt.value.id);
  if (index!== -1) {
    allAppointments.value[index].status = 'canceled';
  }
  cancelDialogVisible.value = false;
  ElMessage.warning('预约已取消');
};

const rebook = (providerId: number) => {
  router.push({ path: '/student/appointment/booking', query: { providerId: providerId.toString() } });
};

const viewNotes = (id: number) => {
  ElMessage.info('功能开发中：查看咨询反馈');
};
</script>

<style scoped>
.history-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 24px;
}

.page-header { margin-bottom: 32px; }
.history-tabs { min-height: 400px; }

/* Card List Styling */
.card-list { display: flex; flex-direction: column; gap: 16px; margin-top: 16px; }

.apt-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  overflow: hidden;
  display: flex;
  transition: transform 0.2s;
  border: 1px solid #ebeef5;
}

.apt-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.08); }

/* Upcoming Card Specifics */
.upcoming.status-strip { width: 6px; background: #409eff; }
.card-body { flex: 1; padding: 20px; display: flex; align-items: center; justify-content: space-between; }

.date-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ecf5ff;
  color: #409eff;
  padding: 12px;
  border-radius: 8px;
  min-width: 60px;
  margin-right: 24px;
}
.date-box.day { font-size: 24px; font-weight: 700; line-height: 1; }
.date-box.month { font-size: 12px; }

.info-box h3 { margin: 0 0 8px; font-size: 18px; }
.time-loc { color: #606266; font-size: 14px; display: flex; align-items: center; gap: 6px; }
.divider { color: #dcdfe6; margin: 0 4px; }

/* Cancel Dialog */
.suggestion-box {
  background: #f0f9eb;
  color: #67c23a;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px 0;
  font-size: 13px;
}
.opacity-50 { opacity: 0.5; }
</style>