// 提供一个能过显示xtx-message组件的函数
//这个函数将来：导入直接使用，也可以挂载在vue实例原型上
// import Message from 'Message.js' 使用Message({type:'error',message:'提示文字'})
// this.$message({type:'error,message:"提示文字"})
import { createVNode, render } from 'vue'
import DjMessage from './dj-message.vue'
// DOM容器
const div = document.createElement('div')
div.setAttribute('class', 'xtx-message-container')
document.body.appendChild(div)
    // 定时器标识
let timer = null
export default ({ type, message }) => {
    // 渲染组件
    // 1.导入消息提示组件
    // 2.将消息提示组件编译为虚拟节点(dom节点)
    // createVNode(组件，属性对象(props))
    const vonde = createVNode(DjMessage, { type, message })
        // 3.准备一个装载消息提示组件的DOM容器
        // 4.将虚拟节点渲染在容器中
        // render(虚拟节点，DOM容器)
    render(vonde, div)
        // 3s后销毁组件
    clearTimeout(timer)
    timer = setTimeout(() => {
        render(null, div)
    }, 3000)
}