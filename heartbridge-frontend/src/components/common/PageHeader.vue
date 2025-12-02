<template>
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 animate-fade-in-up">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
        <div v-if="icon" :class="icon" class="text-blue-500 text-2xl" />
        {{ title }}
      </h1>
      <p v-if="subtitle" class="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium ml-1">
        {{ subtitle }}
      </p>
    </div>
    <div class="flex items-center gap-3">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  icon?: string
}>()
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>