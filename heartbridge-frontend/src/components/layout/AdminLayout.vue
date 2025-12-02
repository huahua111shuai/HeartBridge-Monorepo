<template>
  <div class="flex h-screen bg-[#F5F5F7] dark:bg-black font-sans selection:bg-blue-100 dark:selection:bg-blue-900 overflow-hidden">
    <AdminSidebar />

    <div class="flex-1 flex flex-col min-w-0 transition-all duration-300">
      <AdminNavbar />

      <main class="flex-1 overflow-x-hidden overflow-y-auto p-6 scroll-smooth custom-scrollbar">
        <router-view v-slot="{ Component }">
          <transition
              enter-active-class="transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
              enter-from-class="opacity-0 translate-y-4 scale-[0.98]"
              enter-to-class="opacity-100 translate-y-0 scale-100"
              leave-active-class="transition-all duration-200 ease-in absolute w-full"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminSidebar from './AdminSidebar.vue'
import AdminNavbar from './AdminNavbar.vue'
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 99px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.5);
}
</style>