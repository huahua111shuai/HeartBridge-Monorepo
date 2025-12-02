import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Styles
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/css/main.css'
import './assets/css/variables.css'

// Animation
import { MotionPlugin } from '@vueuse/motion'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(MotionPlugin)

app.mount('#app')