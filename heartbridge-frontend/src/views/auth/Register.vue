<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '@/api/auth'; // 直接使用 API 或 Store
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { User, Lock, School, Back } from '@element-plus/icons-vue';

const router = useRouter();
const regFormRef = ref<FormInstance>();
const loading = ref(false);

const regForm = reactive({
  studentId: '',
  name: '',
  department: '',
  password: '',
  confirmPassword: ''
});

const validateConfirmPass = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== regForm.password) {
    callback(new Error('两次输入密码不一致'));
  } else {
    callback();
  }
};

const rules = reactive<FormRules>({
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { pattern: /^\d{8,12}$/, message: '学号格式错误（8-12位数字）', trigger: 'blur' }
  ],
  name: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  department: [{ required: true, message: '请输入所属院系', trigger: 'blur' }],
  password: [
    { required: true, message: '请设置密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' }
  ],
  confirmPassword: [{ validator: validateConfirmPass, trigger: 'blur' }]
});

const handleRegister = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        await register({
          studentId: regForm.studentId,
          name: regForm.name,
          department: regForm.department,
          password: regForm.password
        });
        ElMessage.success('注册成功，请登录');
        router.push('/auth/login');
      } catch (e) {
        // error handled by interceptor
      } finally {
        loading.value = false;
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
            :loading="loading"
            @click="handleRegister(regFormRef)"
        >
          立即注册
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 复用 Login.vue 样式并增加/覆盖 */
.auth-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #F2F2F7;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.ambient-background {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 0;
  filter: blur(80px);
  opacity: 0.8;
}

.glass-panel {
  position: relative;
  z-index: 10;
  width: 90%;
  max-width: 420px;
  padding: 32px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: saturate(180%) blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

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

  .placeholder { width: 40px; }
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

:deep(.el-form-item__label) {
  text-transform: uppercase;
  font-size: 12px;
  color: #6e6e73;
  margin-bottom: 4px;
  line-height: 1.5;
  font-weight: 500;
}

.submit-btn {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  background-color: #007AFF;
  border: none;
  margin-top: 16px;
  font-weight: 600;
  &:hover { background-color: #0062cc; }
}

.orb-reg-1 {
  width: 40vw; height: 40vw;
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, #ff9a9e 0%, #fecfef 99%, #fecfef 100%);
  top: -20%; right: -10%;
}
.orb-reg-2 {
  width: 50vw; height: 50vw;
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, #a18cd1 0%, #fbc2eb 100%);
  bottom: -20%; left: -20%;
}
</style>