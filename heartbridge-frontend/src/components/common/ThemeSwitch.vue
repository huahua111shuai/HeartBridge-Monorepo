<template>
  <button
      @click="toggleDark()"
      class="relative p-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-white/10 transition-colors group"
      aria-label="Toggle Theme"
  >
    <div class="i-sf-sun-max-fill text-xl text-amber-500 dark:hidden transform transition-transform group-hover:rotate-45" />
    <div class="i-sf-moon-fill text-xl text-blue-400 hidden dark:block transform transition-transform group-hover:-rotate-12" />
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
const { toggleDark } = useTheme()
</script>