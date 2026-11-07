import { createApp } from 'vue'
import App from './App.vue'

// 引入pinia
import {createPinia} from 'pinia'

//  ============== 创建 ===================
// 创建应用实例
const app = createApp(App)

// 创建pinia
const pinia = createPinia()

// ============== 挂载 ===================
// 将pinia挂载到应用上
app.use(pinia)

// 挂载应用
app.mount('#app')
