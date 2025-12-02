<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/store/user';
import { User, Lock, ArrowRight } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const loginFormRef = ref<FormInstance>();

const currentRole = ref<'student' | 'employee'>('student');
const form = reactive({
  id: '',
  password: '',
  remember: false
});

const rules = reactive<FormRules>({
  id: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, message: '账号长度过短', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
});

onMounted(() => {
  // 模拟从本地存储读取记住的账号 (实际需在 store 或 localStorage 实现)
  const savedId = localStorage.getItem('saved_uid');
  if (savedId) {
    form.id = savedId;
    form.remember = true;
  }
});

const handleRoleChange = (role: 'student' | 'employee') => {
  currentRole.value = role;
};

const handleLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        const success = await userStore.login({
          username: form.id,
          password: form.password,
          role: currentRole.value === 'employee' ? 'admin' : 'student', // 简单映射
          remember: form.remember
        });

        if (success) {
          if (form.remember) {
            localStorage.setItem('saved_uid', form.id);
          } else {
            localStorage.removeItem('saved_uid');
          }

          ElMessage.success('登录成功');
          const redirect = route.query.redirect as string;
          // 根据角色跳转
          if (redirect) {
            router.push(redirect);
          } else {
            router.push(userStore.role === 'admin' ? '/admin/dashboard/workbench' : '/student/home');
          }
        }
      } catch (e) {
        // 错误已在 request.ts 处理
      }
    }
  });
};

const goToRegister = () => {
  router.push('/auth/register');
};
</script>

<template>
  <div class="auth-container">
    <div class="ambient-background">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <div class="glass-panel ios-spring-entrance">
      <div class="header">
        <h1 class="title">Campus Portal</h1>
        <p class="subtitle">Sign in to access your dashboard</p>
      </div>

      <div class="segmented-control">
        <div
            class="slider"
            :style="{ transform: currentRole === 'student' ? 'translateX(0)' : 'translateX(100%)' }"
        ></div>
        <button
            class="segment-btn"
            :class="{ active: currentRole === 'student' }"
            @click="handleRoleChange('student')"
        >
          学生登录
        </button>
        <button
            class="segment-btn"
            :class="{ active: currentRole === 'employee' }"
            @click="handleRoleChange('employee')"
        >
          教工登录
        </button>
      </div>

      <el-form
          ref="loginFormRef"
          :model="form"
          :rules="rules"
          class="login-form"
          hide-required-asterisk
      >
        <el-form-item prop="id">
          <el-input
              v-model="form.id"
              :placeholder="currentRole === 'student' ? '请输入学号' : '请输入工号'"
              class="ios-input"
          >
            <template #prefix>
              <el-icon class="input-icon"><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              class="ios-input"
              show-password
          >
            <template #prefix>
              <el-icon class="input-icon"><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <div class="actions">
          <el-checkbox v-model="form.remember" class="ios-checkbox">
            记住我
          </el-checkbox>
          <a href="#" class="forgot-link">忘记密码？</a>
        </div>

        <el-button
            type="primary"
            class="submit-btn"
            @click="handleLogin(loginFormRef)"
        >
          登 录
        </el-button>
      </el-form>

      <div class="footer">
        <span>还没有账号？</span>
        <a @click.prevent="goToRegister" class="register-link">
          学生注册 <el-icon><ArrowRight /></el-icon>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/css/variables.css'; /* 假设有此文件或移除此行 */

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

.orb {
  position: absolute;
  border-radius: 50%;
  animation: float 10s ease-in-out infinite alternate;
}

.orb-1 {
  width: 50vw; height: 50vw;
  background: radial-gradient(circle, #a1c4fd 0%, #c2e9fb 100%);
  top: -10%; left: -10%;
}

.orb-2 {
  width: 40vw; height: 40vw;
  background: radial-gradient(circle, #d4fc79 0%, #96e6a1 100%);
  bottom: -5%; right: -5%;
  animation-delay: -2s;
}

.orb-3 {
  width: 30vw; height: 30vw;
  background: radial-gradient(circle, #fbc2eb 0%, #a6c1ee 100%);
  top: 40%; left: 30%;
  animation-delay: -5s;
}

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -30px) scale(1.1); }
  100% { transform: translate(-20px, 20px) scale(0.95); }
}

.glass-panel {
  position: relative;
  z-index: 10;
  width: 90%;
  max-width: 420px;
  padding: 40px 32px;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 25px 50px -12px rgba(0, 0, 0, 0.1);
}

.ios-spring-entrance {
  animation: spring-up 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

@keyframes spring-up {
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.header {
  text-align: center;
  margin-bottom: 32px;

  .title {
    font-size: 28px;
    font-weight: 700;
    color: #1c1c1e;
    letter-spacing: -0.5px;
    margin: 0 0 8px;
  }

  .subtitle {
    font-size: 15px;
    color: #8e8e93;
    margin: 0;
  }
}

.segmented-control {
  position: relative;
  background: rgba(118, 118, 128, 0.12);
  border-radius: 9px;
  padding: 2px;
  display: flex;
  height: 36px;
  margin-bottom: 24px;

  .slider {
    position: absolute;
    top: 2px; left: 2px;
    width: calc(50% - 2px);
    height: 32px;
    background: #fff;
    border-radius: 7px;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12), 0 3px 1px rgba(0, 0, 0, 0.04);
    transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
    z-index: 1;
  }

  .segment-btn {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 13px;
    font-weight: 500;
    color: #636366;
    z-index: 2;
    cursor: pointer;
    transition: color 0.3s;

    &.active {
      color: #000;
      font-weight: 600;
    }
  }
}

:deep(.ios-input.el-input__wrapper) {
  background-color: rgba(118, 118, 128, 0.08)!important;
  box-shadow: none!important;
  border-radius: 12px;
  padding: 4px 12px;
  transition: background-color 0.2s;

  &.is-focus {
    background-color: #fff!important;
    box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.15)!important;
  }
}

:deep(.ios-input.el-input__inner) {
  height: 40px;
  font-size: 16px;
  color: #1c1c1e;
}

.submit-btn {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  font-size: 17px;
  font-weight: 600;
  background-color: #007AFF;
  border: none;
  margin-top: 16px;
  transition: transform 0.1s;

  &:hover {
    background-color: #0062cc;
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.96);
  }
}

:deep(.ios-checkbox.el-checkbox__inner) {
  border-radius: 4px;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 14px;

  .forgot-link {
    color: #007AFF;
    text-decoration: none;
  }
}

.footer {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #8e8e93;

  .register-link {
    color: #007AFF;
    font-weight: 600;
    cursor: pointer;
    margin-left: 4px;
    display: inline-flex;
    align-items: center;

    .el-icon { margin-left: 2px; }

    &:hover { text-decoration: underline; }
  }
}
</style>