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
                <h3>{{ apt.counselorName }} <el-tag size="small" effect="plain">{{ apt.type }}</el-tag></h3>
                <p class="time-loc">
                  <el-icon><Clock /></el-icon> {{ apt.timeSlot }}
                  <span class="divider">|</span>
                  <el-icon><VideoCamera /></el-icon> 视频会议
                </p>
              </div>
              <div class="action-box">
                <el-button type="primary" round class="action-btn" @click="enterMeeting(apt.meetingLink || '#')">
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

    </el-tabs>

    <el-dialog
        v-model="cancelDialogVisible"
        title="取消预约"
        width="30%"
        align-center
        class="cancel-dialog"
    >
      <div class="dialog-content">
        <p class="warning-text">确定要取消与 <strong>{{ selectedApt?.counselorName }}</strong> 的预约吗？</p>
        <div class="suggestion-box">
          <el-icon><Calendar /></el-icon>
          <span>建议选择“改期”以保留您的治疗进度。</span>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelDialogVisible = false">暂不取消</el-button>
          <el-button type="danger" plain @click="confirmCancel">确认取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Clock, VideoCamera, Check, Calendar } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { getStudentAppointments, cancelAppointment } from '@/api/appointment';
import type { AppointmentDetailVO } from '@/types/entity';

const router = useRouter();
const activeTab = ref('upcoming');
const cancelDialogVisible = ref(false);
const selectedApt = ref<AppointmentDetailVO | null>(null);
const allAppointments = ref<AppointmentDetailVO[]>([]);

onMounted(async () => {
  try {
    const res = await getStudentAppointments({});
    allAppointments.value = res.records;
  } catch (e) {
    console.error(e);
  }
});

const upcomingList = computed(() => allAppointments.value.filter(a => a.status === 'approved' || a.status === 'pending'));
// const completedList...

const getMonth = (dateStr: string) => new Date(dateStr).toLocaleString('zh-CN', { month: 'short' });
const getDay = (dateStr: string) => new Date(dateStr).getDate();

const enterMeeting = (url: string) => {
  window.open(url, '_blank');
};

const handleCancelRequest = (apt: AppointmentDetailVO) => {
  selectedApt.value = apt;
  cancelDialogVisible.value = true;
};

const confirmCancel = async () => {
  if (selectedApt.value) {
    await cancelAppointment(selectedApt.value.id);
    ElMessage.warning('预约已取消');
    cancelDialogVisible.value = false;
    // refresh
    const res = await getStudentAppointments({});
    allAppointments.value = res.records;
  }
};
</script>

<style scoped>
/* 样式保留原样或根据需要调整 */
.history-page { max-width: 900px; margin: 0 auto; padding: 32px 24px; }
.page-header { margin-bottom: 32px; }
.card-list { display: flex; flex-direction: column; gap: 16px; margin-top: 16px; }
.apt-card { background: #fff; border-radius: 12px; border: 1px solid #ebeef5; display: flex; }
.upcoming .status-strip { width: 6px; background: #409eff; }
.card-body { flex: 1; padding: 20px; display: flex; align-items: center; justify-content: space-between; }
.date-box { background: #ecf5ff; color: #409eff; padding: 12px; border-radius: 8px; margin-right: 24px; text-align: center; }
.date-box .day { font-size: 24px; font-weight: 700; display: block; }
.info-box h3 { margin: 0 0 8px; }
.time-loc { display: flex; align-items: center; gap: 6px; font-size: 14px; color: #666; }
.suggestion-box { background: #f0f9eb; color: #67c23a; padding: 12px; border-radius: 8px; display: flex; align-items: center; gap: 8px; margin: 16px 0; }
</style>