<template>
<!-- 顶部通栏 -->
<AppNavbar />
<!-- 头部组件 -->
 <el-affix :offset="0">
    <AppHeader />
 </el-affix>
<!-- 内容容器 -->
<div class="app-body">
    <!-- 二级路由 -->
    <RouterView />
</div>
<!-- 底部组件 -->
<AppFooter />
</template>

<script>
import AppNavbar from '@/components/app-navbar.vue'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'
export default {
    name: 'layout',
    components:{
        AppNavbar,
        AppHeader,
        AppFooter,
    },
}
    
</script>

<style lang="less" scoped>
// .app-body{
//     min-height: 1200px;
//     background-color: #fff;
// }
</style>