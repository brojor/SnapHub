import { createApp } from 'vue'
import './style.css'
import router from './router/router.ts'
import App from './App.vue'
import 'virtual:uno.css'

createApp(App).use(router).mount('#app')
