<template>
  <div class="min-h-screen bg-[#F5F5F7] dark:bg-black font-sans selection:bg-blue-100 dark:selection:bg-blue-900">
    <StudentNavbar />

    <main class="pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
      <router-view v-slot="{ Component }">
        <transition
            enter-active-class="transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            enter-from-class="opacity-0 translate-y-4 scale-[0.99]"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-[0.99]"
            mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="py-8 text-center text-xs text-gray-400 dark:text-gray-600">
      <p>© 2025 HeartBridge Mental Health Platform. Designed with care.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import StudentNavbar from './StudentNavbar.vue'
</script>