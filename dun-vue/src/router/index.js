import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import { h } from 'vue'
const Login = () =>
    import ('@/views/login/login')
const Signup = () =>
    import ('@/views/login/signup')
const Layout = () =>
    import ('@/views/layout')
const Home = () =>
    import ('@/views/home/index')
const Bas = () =>
    import ('@/views/bas/index')
const BasItem = () =>
    import ('@/views/bas/components/bas_item')
const Member = () =>
    import ('@/views/member/index')
const MemberDynamic = () =>
    import ('@/views/member/components/member_dynamic')
const MemberFocuson = () =>
    import ('@/views/member/components/member_focusons')
const MemberFan = () =>
    import ('@/views/member/components/member_fan')
const MemberCollect = () =>
    import ('@/views/member/components/member_collect')
const MemberRevise = () =>
    import ('@/views/member/components/member_revise')
const MemberBasFocuson = () =>
    import ('@/views/member/components/member_bas_focusons')
const MemberRevise_1 = () =>
    import ('@/views/member/components/member_revise_1')
const MemberRevise_2 = () =>
    import ('@/views/member/components/member_revise_2')
const MemberRevise_3 = () =>
    import ('@/views/member/components/member_revise_3')
const MemberRevise_4_1 = () =>
    import ('@/views/member/components/member_revise_4_1')
const MemberRevise_4_2 = () =>
    import ('@/views/member/components/member_revise_4_2')
const MemberRevise_4_3 = () =>
    import ('@/views/member/components/member_revise_4_3')
const MemberRevise_5_1 = () =>
    import ('@/views/member/components/member_revise_5_1')
const MemberRevise_5_2 = () =>
    import ('@/views/member/components/member_revise_5_2')
const MemberRevise_5_3 = () =>
    import ('@/views/member/components/member_revise_5_3')
const BasContent = () =>
    import ('@/views/bas/components/bas_content_comment')
const Search = () =>
    import ('@/components/search')
const MemberHistory = () =>
    import ('@/views/member/components/member_history')
const OtherUser = () =>
    import ('@/views/other_user/index')
const UserDynamic = () =>
    import ('@/views/other_user/components/member_dynamic')
const UserFocuson = () =>
    import ('@/views/other_user/components/member_focusons')
const UserberFan = () =>
    import ('@/views/other_user/components/member_fan')
const UserBasFocuson = () =>
    import ('@/views/other_user/components/member_bas_focusons')
const routes = [
    // 一级路由布局容器
    {
        path: '/',
        component: Layout,
        children: [
            // 二级路由
            { path: '/', component: Home },
            { path: '/bas', component: Bas },
            { path: '/bas/item/:id', component: BasItem, },
            { path: '/bas/item/:id/:commentid', component: BasContent },
            { path: '/search/:string', component: Search },
            {
                // 自己的个人中心
                path: '/member',
                component: Member,
                children: [
                    // 三级路由
                    {
                        path: '/member',
                        component: { render: () => h( < RouterView / > ) },
                        children: [
                            { path: '', component: MemberDynamic },
                            { path: 'dynamic', component: MemberDynamic },
                            { path: 'focuson', component: MemberFocuson },
                            { path: 'fan', component: MemberFan },
                            { path: 'bas', component: MemberBasFocuson },
                            { path: 'collect', component: MemberCollect },
                            { path: 'history', component: MemberHistory },
                            {
                                path: 'revise',
                                component: MemberRevise,
                                children: [
                                    { path: '1', component: MemberRevise_1 },
                                    { path: '2', component: MemberRevise_2 },
                                    { path: '3', component: MemberRevise_3 },
                                    { path: '4-1', component: MemberRevise_4_1 },
                                    { path: '4-2', component: MemberRevise_4_2 },
                                    { path: '4-3', component: MemberRevise_4_3 },
                                    { path: '5-1', component: MemberRevise_5_1 },
                                    { path: '5-2', component: MemberRevise_5_2 },
                                    { path: '5-3', component: MemberRevise_5_3 },
                                ]
                            },
                        ]
                    }
                ]
            },
            {
                // 其他用户的个人中心
                path: '/user/:id',
                component: OtherUser,
                children: [
                    // 三级路由
                    {
                        path: '/user/:id',
                        component: { render: () => h( < RouterView / > ) },
                        children: [
                            { path: '', component: UserDynamic },
                            { path: 'dynamic', component: UserDynamic },
                            { path: 'focuson', component: UserFocuson },
                            { path: 'fan', component: UserberFan },
                            { path: 'bas', component: UserBasFocuson },
                        ]
                    }
                ]
            }

        ]
    },
    { path: '/login', component: Login, },
    { path: '/signup', component: Signup, }
]
const router = createRouter({
        // 使用hash方式实现路由
        history: createWebHashHistory(),
        // 配置路由规则
        routes,
        // 每次切换路由的时候滚动到页面顶部
        scrollBehavior() {
            return { left: 0, top: 0 }
        }
    })
    // 前置导航守卫
router.beforeEach((to, from, next) => {
    // 需要登录的路由:地址是以/member开头
    const { profile } = store.state.user
    if (!profile.token && to.path.startsWith('/member')) {
        return next('/login?redirectUrl=' + encodeURIComponent(to.fullPath))
    }
    next()
})
export default router