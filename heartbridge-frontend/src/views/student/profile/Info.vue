<template>
  <div class="profile-page">
    <div class="max-w-3xl mx-auto space-y-8 animate-fade-up">

      <div class="text-center space-y-2">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">个人信息</h1>
        <p class="text-gray-500 dark:text-gray-400">管理您的个人档案与联系方式</p>
      </div>

      <GlassCard class="overflow-hidden">
        <div class="p-8 md:p-10">

          <div class="flex flex-col items-center mb-10">
            <div class="relative group cursor-pointer">
              <el-avatar
                  :size="120"
                  :src="formData.avatar"
                  class="shadow-2xl shadow-blue-500/20 transition-transform duration-500 group-hover:scale-105"
              />
              <div class="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                <el-icon class="text-white text-3xl"><Camera /></el-icon>
              </div>
              <input
                  type="file"
                  accept="image/*"
                  class="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  @change="handleAvatarChange"
              />
            </div>
            <p class="mt-4 text-sm text-blue-500 font-medium cursor-pointer hover:text-blue-600 transition-colors">
              更换头像
            </p>
          </div>

          <el-form
              ref="formRef"
              :model="formData"
              :rules="rules"
              label-position="top"
              class="ios-form space-y-6"
          >
            <div class="ios-group">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <el-form-item label="真实姓名" prop="name">
                  <el-input v-model="formData.name" placeholder="您的姓名" class="ios-input" />
                </el-form-item>

                <el-form-item label="学号" prop="studentId">
                  <el-input v-model="formData.studentId" disabled class="ios-input is-disabled">
                    <template #suffix><el-icon><Lock /></el-icon></template>
                  </el-input>
                </el-form-item>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <el-form-item label="所属院系" prop="department">
                  <el-input v-model="formData.department" disabled class="ios-input is-disabled" />
                </el-form-item>

                <el-form-item label="性别" prop="gender">
                  <el-select v-model="formData.gender" placeholder="选择性别" class="ios-select w-full">
                    <el-option label="男" value="1" />
                    <el-option label="女" value="2" />
                    <el-option label="其他" value="3" />
                  </el-select>
                </el-form-item>
              </div>
            </div>

            <div class="ios-group mt-8">
              <h3 class="group-title">联系方式</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <el-form-item label="手机号码" prop="phone">
                  <el-input v-model="formData.phone" placeholder="11位手机号" class="ios-input" />
                </el-form-item>

                <el-form-item label="电子邮箱" prop="email">
                  <el-input v-model="formData.email" placeholder="campus@example.com" class="ios-input" />
                </el-form-item>
              </div>
            </div>

            <div class="ios-group mt-8">
              <h3 class="group-title">个人简介</h3>
              <el-form-item prop="bio">
                <el-input
                    v-model="formData.bio"
                    type="textarea"
                    :rows="4"
                    placeholder="写一句话介绍你自己..."
                    class="ios-textarea"
                    resize="none"
                />
              </el-form-item>
            </div>

            <div class="flex justify-end pt-6">
              <el-button
                  type="primary"
                  size="large"
                  class="save-btn"
                  :loading="loading"
                  @click="submitForm"
              >
                保存更改
              </el-button>
            </div>
          </el-form>

        </div>
      </GlassCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Camera, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useMotion } from '@vueuse/motion'

// --- 数据定义 ---
const formRef = ref<FormInstance>()
const loading = ref(false)

const formData = reactive({
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
  name: '',
  studentId: '',
  department: '',
  gender: '',
  phone: '',
  email: '',
  bio: ''
})

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
})

// --- 生命周期 ---
onMounted(() => {
  // 模拟从后端获取数据
  setTimeout(() => {
    Object.assign(formData, {
      name: '林安',
      studentId: '20210089',
      department: '计算机科学与技术学院',
      gender: '1',
      phone: '13800138000',
      email: 'lin.an@university.edu.cn',
      bio: '热爱生活，保持正念。Coding for a better world.'
    })

    // 入场微动效
    useMotion(document.querySelector('.profile-page')!, {
      initial: { opacity: 0, y: 20 },
      enter: { opacity: 1, y: 0, transition: { duration: 600 } }
    })
  }, 500)
})

// --- 方法 ---
const handleAvatarChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.avatar = e.target?.result as string
      ElMessage.success('头像预览已更新，保存后生效')
    }
    reader.readAsDataURL(file)
  }
}

const submitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // 模拟提交
      setTimeout(() => {
        loading.value = false
        ElMessage.success('个人信息保存成功')
      }, 1500)
    }
  })
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 40px 20px;
  background-color: #f5f5f7;
}
.dark.profile-page { background-color: #000; }

/* Group Styles */
.ios-group {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.6);
}
.dark.ios-group { background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.1); }

.group-title {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #86868b;
  margin-bottom: 16px;
  font-weight: 600;
  margin-left: 4px;
}

/* Input Overrides for Apple Feel */
:deep(.el-form-item__label) {
  font-weight: 500;
  color: #1d1d1f!important;
  font-size: 14px;
  padding-bottom: 8px;
}
.dark :deep(.el-form-item__label) { color: #f5f5f7!important; }

:deep(.el-input__wrapper), :deep(.el-textarea__inner) {
  background-color: #f2f2f7!important; /* iOS grouped background color */
  box-shadow: none!important;
  border-radius: 12px;
  padding: 8px 16px;
  transition: all 0.2s ease;
  height: 44px;
}
:deep(.el-textarea__inner) { height: auto; padding: 12px 16px; }

.dark :deep(.el-input__wrapper),.dark :deep(.el-textarea__inner) {
  background-color: #1c1c1e!important;
}

:deep(.el-input__wrapper.is-focus), :deep(.el-textarea__inner:focus) {
  background-color: #fff!important;
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.15)!important;
}
.dark :deep(.el-input__wrapper.is-focus),.dark :deep(.el-textarea__inner:focus) {
  background-color: #2c2c2e!important;
}

/* Disabled State */
:deep(.is-disabled.el-input__wrapper) {
  background-color: rgba(0, 0, 0, 0.03)!important;
  opacity: 0.8;
}

.save-btn {
  border-radius: 24px;
  padding: 12px 32px;
  font-weight: 600;
  background: #007aff;
  border: none;
  transition: transform 0.1s;
}
.save-btn:active { transform: scale(0.96); }
</style>