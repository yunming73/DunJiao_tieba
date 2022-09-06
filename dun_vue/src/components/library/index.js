import Message from './Message'
const importFn = require.context('./', false, /\.vue$/)
export default {
    install(app) {
        // 在app上进行扩展，app提供component，directive函数
        // 如果要挂载原型app.config.globalProperties.$http方式
        //批量注册全局组件
        importFn.keys().forEach(path => {
                // 导入组件
                const component = importFn(path).default
                    // 注册组件
                app.component(component.name, component)
            })
            // 定义指令
            // defineDiective(app)
            // 定义一个原型函数
        app.config.globalProperties.$message = Message
    }
}