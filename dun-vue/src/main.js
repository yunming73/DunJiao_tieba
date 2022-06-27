import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// element
import ElementPlus from 'element-plus'
// element样式
import 'element-plus/dist/index.css'
// element图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// element中文
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import store from './store'
// // 1.重置样式的库
import 'normalize.css'
// // 2.自己项目的重置样式和公用样式
import '@/assets/styles/common.less'
// // 导入自己UI组件库
import UI from '@/components/library'
// 创建一个vue应用实例
const app = createApp(App)
    // 全局配置element中文
app.use(ElementPlus, {
    locale: zhCn,
})
app.use(store)
app.use(ElementPlus)
app.use(router)
app.use(UI)
app.mount('#app')
    // 全局导入element图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}