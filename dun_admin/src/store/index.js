import { createStore } from 'vuex'
// 导入持久化插件
import createPersistedState from "vuex-persistedstate";
// 导入用户仓库
import user from './modules/user'

// 导出仓库
export default createStore({
    modules: {
        user
    },
    // 配置插件
    plugins: [
        // 默认存储在localStorage
        createPersistedState({
            // 本地存储名字
            key: 'dun-admin-pc-store',
            // 指定需要存储的模块
            paths: ['user']
        })
    ]
})