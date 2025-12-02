import { createPinia } from 'pinia'

const store = createPinia()

export default storeimport { defineStore } from 'pinia'
import { ref } from 'vue'
import { useDark, useToggle } from '@vueuse/core'

export const useAppStore = defineStore('app', () => {
    const isDark = useDark()
    const toggleDark = useToggle(isDark)
    const sidebarOpen = ref(true)

    const toggleSidebar = () => {
        sidebarOpen.value =!sidebarOpen.value
    }

    return {
        isDark,
        toggleDark,
        sidebarOpen,
        toggleSidebar
    }
})