import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import { h } from 'vue'
const Login = () =>
    import ('@/views/login')
const Home = () =>
    import ('@/views/home')
const HomeUsers = () =>
    import ('@/views/components/home_users')
const HomeBa = () =>
    import ('@/views/components/home_ba')
const BaContent = () =>
    import ('@/views/ba_content')
const BaContents = () =>
    import ('@/views/ba_content_s')
const HomeContent = () =>
    import ('@/views/components/home_content')
const HomeApplication = () =>
    import ('@/views/components/home_application')
const HomeCarousel = () =>
    import ('@/views/home_carousel')
const routes = [
    // 路由重定向
    { path: '/', redirect: '/login' },
    // 登录组件路由
    { path: '/login', component: Login },
    {
        path: '/home',
        component: Home,
        children: [{
            path: '/home',
            component: { render: () => h( < RouterView / > ) },
            children: [
                { path: '/home', component: HomeUsers },
                { path: '/home/users', component: HomeUsers },
                { path: '/home/ba', component: HomeBa },
                { path: '/home/ba/content/:id', component: BaContent },
                { path: '/home/ba/content/:id/:contentid', component: BaContents },
                { path: '/home/content', component: HomeContent },
                { path: '/home/application', component: HomeApplication },
                { path: '/home/carousel', component: HomeCarousel },
            ]
        }]
    },
]

const router = createRouter({
        // 使用hash方式实现路由
        history: createWebHashHistory(),
        // 配置路由规则
        routes,
        // 每次切换路由的时候滚动到页面顶部
        scrollBehavior() {
            // vue2.0 x y 控制
            // vue3.0 left top 控制
            return { left: 0, top: 0 }
        }
    })
    // 前置导航守卫
router.beforeEach((to, from, next) => {
    // 需要登录的路由:地址是以/home开头
    const { profile } = store.state.user
    if (!profile.token && to.path.startsWith('/home')) {
        return next('/login?redirectUrl=' + encodeURIComponent(to.fullPath))
    }
    next()
})

export default router