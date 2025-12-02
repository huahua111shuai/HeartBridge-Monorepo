<template>
  <div class="password-page">
    <div class="max-w-xl mx-auto mt-10 animate-fade-up">

      <GlassCard class="relative overflow-hidden">
        <div class="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 opacity-50"></div>

        <div class="p-8 md:p-12">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center text-2xl shadow-inner">
              🔑
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">修改密码</h1>
              <p class="text-sm text-gray-500">为了您的账户安全，建议定期更换密码</p>
            </div>
          </div>

          <el-form
              ref="pwdFormRef"
              :model="pwdForm"
              :rules="rules"
              label-position="top"
              class="space-y-6"
          >
            <el-form-item label="当前密码" prop="oldPassword">
              <el-input
                  v-model="pwdForm.oldPassword"
                  type="password"
                  show-password
                  placeholder="请输入当前使用的密码"
                  class="apple-input"
              />
            </el-form-item>

            <el-form-item label="新密码" prop="newPassword">
              <el-input
                  v-model="pwdForm.newPassword"
                  type="password"
                  show-password
                  placeholder="请输入新密码"
                  class="apple-input"
                  @input="checkStrength"
              />

              <div class="mt-3 transition-all duration-300 ease-out" :class="{ 'opacity-100 h-auto': pwdForm.newPassword, 'opacity-0 h-0 overflow-hidden':!pwdForm.newPassword }">
                <div class="flex gap-1 mb-2 h-1.5 w-full">
                  <div class="rounded-full flex-1 transition-colors duration-300" :class="strengthScore >= 1? 'bg-red-400' : 'bg-gray-200 dark:bg-gray-700'"></div>
                  <div class="rounded-full flex-1 transition-colors duration-300" :class="strengthScore >= 2? 'bg-yellow-400' : 'bg-gray-200 dark:bg-gray-700'"></div>
                  <div class="rounded-full flex-1 transition-colors duration-300" :class="strengthScore >= 3? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'"></div>
                  <div class="rounded-full flex-1 transition-colors duration-300" :class="strengthScore >= 4? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'"></div>
                </div>
                <div class="flex justify-between text-xs text-gray-400">
                  <span>弱</span>
                  <span>强</span>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="确认新密码" prop="confirmPassword">
              <el-input
                  v-model="pwdForm.confirmPassword"
                  type="password"
                  show-password
                  placeholder="请再次输入新密码"
                  class="apple-input"
              />
            </el-form-item>

            <div class="bg-gray-50 dark:bg-white/5 rounded-xl p-4 text-xs text-gray-500 space-y-2 border border-gray-100 dark:border-white/10">
              <p class="font-medium text-gray-700 dark:text-gray-300 mb-2">密码必须包含：</p>
              <div class="flex items-center gap-2" :class="{ 'text-green-500': hasMinLength }">
                <el-icon><CircleCheck v-if="hasMinLength" /><CircleClose v-else /></el-icon> 至少 8 个字符
              </div>
              <div class="flex items-center gap-2" :class="{ 'text-green-500': hasNumber }">
                <el-icon><CircleCheck v-if="hasNumber" /><CircleClose v-else /></el-icon> 至少 1 个数字
              </div>
              <div class="flex items-center gap-2" :class="{ 'text-green-500': hasLetter }">
                <el-icon><CircleCheck v-if="hasLetter" /><CircleClose v-else /></el-icon> 至少 1 个字母
              </div>
            </div>

            <el-button
                type="primary"
                size="large"
                class="w-full submit-btn"
                :loading="loading"
                @click="submitChange"
            >
              更新密码
            </el-button>
          </el-form>
        </div>
      </GlassCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { CircleCheck, CircleClose } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useMotion } from '@vueuse/motion'
import { onMounted } from 'vue'

const pwdFormRef = ref<FormInstance>()
const loading = ref(false)

const pwdForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码强度校验逻辑
const hasMinLength = computed(() => pwdForm.newPassword.length >= 8)
const hasNumber = computed(() => /\d/.test(pwdForm.newPassword))
const hasLetter = computed(() => /[a-zA-Z]/.test(pwdForm.newPassword))

const strengthScore = computed(() => {
  let score = 0
  if (pwdForm.newPassword.length > 0) score++
  if (hasMinLength.value) score++
  if (hasNumber.value) score++
  if (hasLetter.value) score++
  return score
})

const validatePass = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请输入新密码'))
  } else {
    if (pwdForm.confirmPassword!== '') {
      if (!pwdFormRef.value) return
      pwdFormRef.value.validateField('confirmPassword', () => null)
    }
    if (strengthScore.value < 3) {
      callback(new Error('密码强度不足'))
    }
    callback()
  }
}

const validatePass2 = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value!== pwdForm.newPassword) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const rules = reactive({
  oldPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [{ validator: validatePass, trigger: 'change' }],
  confirmPassword: [{ validator: validatePass2, trigger: 'blur' }]
})

const checkStrength = () => {
  // 触发 computed 更新
}

const submitChange = async () => {
  if (!pwdFormRef.value) return
  await pwdFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      setTimeout(() => {
        loading.value = false
        ElMessage.success({
          message: '密码修改成功，请重新登录',
          duration: 3000
        })
        // 实际逻辑中这里应该登出并跳转
        pwdForm.oldPassword = ''
        pwdForm.newPassword = ''
        pwdForm.confirmPassword = ''
      }, 1500)
    }
  })
}

onMounted(() => {
  useMotion(document.querySelector('.password-page')!, {
    initial: { opacity: 0, scale: 0.98 },
    enter: { opacity: 1, scale: 1, transition: { duration: 500 } }
  })
})
</script>

<style scoped>
.password-page {
  min-height: 100vh;
  padding: 40px 20px;
  background-color: #f5f5f7;
  display: flex;
  justify-content: center;
}
.dark.password-page { background-color: #000; }

:deep(.apple-input.el-input__wrapper) {
  background-color: #f2f2f7!important;
  border-radius: 12px;
  padding: 10px 16px;
  box-shadow: none!important;
  height: 48px;
}
.dark :deep(.apple-input.el-input__wrapper) { background-color: #1c1c1e!important; }

:deep(.apple-input.el-input__wrapper.is-focus) {
  background-color: #fff!important;
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.15)!important;
}
.dark :deep(.apple-input.el-input__wrapper.is-focus) { background-color: #2c2c2e!important; }

.submit-btn {
  height: 48px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  background-color: #007aff;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
  transition: all 0.2s;
}

.submit-btn:hover {
  box-shadow: 0 6px 16px rgba(0, 122, 255, 0.4);
  transform: translateY(-1px);
}
.submit-btn:active {
  transform: scale(0.98);
}
</style>