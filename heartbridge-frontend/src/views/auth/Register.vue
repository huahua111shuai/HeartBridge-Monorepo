<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { User, Lock, School, Back } from '@element-plus/icons-vue';

const router = useRouter();
const authStore = useAuthStore();
const regFormRef = ref<FormInstance>();

// --- 表单数据 ---
const regForm = reactive({
  studentId: '',
  name: '',
  department: '',
  password: '',
  confirmPassword: ''
});

// --- 自定义验证器 ---
// 1. 学号验证：必须为 8-12 位数字
const validateStudentId = (rule: any, value: string, callback: any) => {
  if (!value) {
    return callback(new Error('请输入学号'));
  }
  const regex = /^\d{8,12}$/;
  if (!regex.test(value)) {
    callback(new Error('学号格式错误（8-12位数字）'));
  } else {
    callback();
  }
};

// 2. 密码确认验证
const validateConfirmPass = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value!== regForm.password) {
    callback(new Error('两次输入密码不一致'));
  } else {
    callback();
  }
};

const rules = reactive<FormRules>({
  studentId:,
  name: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  department: [{ required: true, message: '请输入所属院系', trigger: 'blur' }],
  password: [
    { required: true, message: '请设置密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' }
  ],
  confirmPassword: [{ validator: validateConfirmPass, trigger: 'blur' }]
});

// --- 提交逻辑 ---
const handleRegister = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      const success = await authStore.register(regForm);
      if (success) {
        ElMessage.success('注册成功，请登录');
        router.push('/auth/login');
      }
    }
  });
};

const goBack = () => router.push('/auth/login');
</script>

<template>
  <div class="auth-container">
    <div class="ambient-background register-bg">
      <div class="orb orb-reg-1"></div>
      <div class="orb orb-reg-2"></div>
    </div>

    <div class="glass-panel ios-spring-entrance">
      <div class="nav-header">
        <div class="back-btn" @click="goBack">
          <el-icon><Back /></el-icon> 返回
        </div>
        <div class="page-title">学生注册</div>
        <div class="placeholder"></div>
      </div>

      <div class="description">
        <p>仅限在校学生注册，注册后可访问校园服务。</p>
      </div>

      <el-form
          ref="regFormRef"
          :model="regForm"
          :rules="rules"
          label-position="top"
          class="register-form"
          hide-required-asterisk
      >
        <el-form-item label="学号 (Student ID)" prop="studentId">
          <el-input v-model="regForm.studentId" placeholder="请输入8-12位学号" class="ios-input">
            <template #prefix><el-icon><User /></el-icon></template>
          </el-input>
        </el-form-item>

        <div class="row">
          <el-form-item label="姓名" prop="name" style="flex:1; margin-right:10px;">
            <el-input v-model="regForm.name" placeholder="真实姓名" class="ios-input" />
          </el-form-item>

          <el-form-item label="院系" prop="department" style="flex:1;">
            <el-input v-model="regForm.department" placeholder="如：计算机学院" class="ios-input">
              <template #prefix><el-icon><School /></el-icon></template>
            </el-input>
          </el-form-item>
        </div>

        <el-form-item label="密码" prop="password">
          <el-input
              v-model="regForm.password"
              type="password"
              show-password
              placeholder="设置登录密码"
              class="ios-input"
          >
            <template #prefix><el-icon><Lock /></el-icon></template>
          </el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
              v-model="regForm.confirmPassword"
              type="password"
              show-password
              placeholder="再次输入密码"
              class="ios-input"
          >
            <template #prefix><el-icon><Lock /></el-icon></template>
          </el-input>
        </el-form-item>

        <el-button
            type="primary"
            class="submit-btn"
            :loading="authStore.isLoading"
            @click="handleRegister(regFormRef)"
        >
          立即注册
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/ios-theme.scss'; // 假设有一个共享的样式文件

// 复用 Login.vue 中的大部分样式，此处仅展示差异部分

.nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .back-btn {
    font-size: 14px;
    color: #007AFF;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: opacity 0.2s;

    &:hover { opacity: 0.7; }
    .el-icon { margin-right: 4px; font-size: 16px; }
  }

  .page-title {
    font-size: 17px;
    font-weight: 600;
    color: #000;
  }

  .placeholder { width: 40px; } // 占位保持标题居中
}

.description {
  background: rgba(118, 118, 128, 0.06);
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 24px;
  p {
    margin: 0;
    font-size: 13px;
    color: #8e8e93;
    text-align: center;
  }
}

.row {
  display: flex;
  justify-content: space-between;
}

// 覆盖 Label 样式，模仿 iOS Section Header
:deep(.el-form-item__label) {
  text-transform: uppercase;
  font-size: 12px;
  color: #6e6e73;
  margin-bottom: 4px;
  line-height: 1.5;
  font-weight: 500;
}

// 调整注册页的背景色球，使其略有不同
.orb-reg-1 {
  background: radial-gradient(circle, #ff9a9e 0%, #fecfef 99%, #fecfef 100%);
  top: -20%; right: -10%;
}
</style>