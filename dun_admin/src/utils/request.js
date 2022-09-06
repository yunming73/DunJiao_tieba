// 封装一个请求工具
// 1. 创建一个新的axios实例
// 2. 请求拦截器，如果有token进行头部携带
// 3. 响应拦截器：1. 剥离无效数据  2. 处理token失效
// 4. 导出一个函数，调用当前的axsio实例发请求，返回值promise
import axios from 'axios'
import store from '@/store'
import router from '@/router'
// 1.创建一个新的axios实例
// 导出基准地址,原因：其他地方(图片上传)不是通过axios发请求的地方用上的基准地址
export const baseURL = 'http://127.0.0.1:99/api/private/v1'
const instance = axios.create({
        // 设计基准路径
        // 配置请求的基准URL地址
        baseURL,
        // 过期时间
        timeout: 5000
    })
    // 2.请求拦截器，如果有token进行偷渡携带
instance.interceptors.request.use(config => {
        // 响应正确
        // 拦截业务逻辑
        // 进行请求配置修改
        // 如果本地有token，就在请求头中携带token
        // 1.获取用户信息对象，
        const { profile } = store.state.user
            // console.log(profile.token);
            // 2.判断是否有token
        if (profile.token) {
            config.headers.Authorization = `Bearer ${profile.token}`
        }
        return config
    }, err => {
        //响应错误
        return Promise.reject(err)
    })
    // 3.响应拦截器，1.剥离无效数据，获取有效数据2.处理token失效
    // res => res.data 取出data数据，将来调用接口的时候直接拿到的就是后台数据
instance.interceptors.response.use(res => res.data, err => {
        // 401状态码，进入该函数
        if (err.response && err.response.status === 401) {
            // 1.清除本地无效用户信息
            // 2.跳转到登陆页
            // 3.跳转页面需要传递参数(当前的路由地址)给登录页
            store.commit('user/setUser', {})
                // 当前的路由地址
                // 组件里面:'/user?a=10' $route.path==='/user' $route.fullPath==='/user?a=10'
                // js模块中 route.currentRoute.value.fullPath 获取当前的路由地址,route：currentRouter是ref响应式数据
            const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
                // encodeURIComponent 转换url编码,防止解析地址出错
            router.push('/login?redirectUrl=' + fullPath)

        }
        return Promise.reject(err)
    })
    // 请求工具函数
export default (url, method, submitData) => {
    // 负责发请求，请求地址，请求方式，提交的数据
    return instance({
        url,
        method,
        // 1.如果是get请求，需要使用params来传递submitData
        // 1.如果不是get请求，需要使用data来传递submitData
        // []设置一个动态的key，写js表达式，js表达式的执行结果当作key
        // method参数:get,Get,GET转化成消息再来判断
        [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
    })
}