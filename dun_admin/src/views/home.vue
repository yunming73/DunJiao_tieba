<template>
<div class="container">
  <div class="common-layout">
    <div class="layout_top">
        <div class="layout_top_img">
            <RouterLink to="/home/users">
                <img src="../assets/img/logo.png" alt="">
            </RouterLink>
        </div>
        <div>
            <span class="layout_top_text">
                <RouterLink to="/home/users">
                    钝角贴吧后台管理系统
                </RouterLink>
            </span>
        </div>
        <div>
             <el-button @click="logout()" type="info">退出</el-button>
        </div>
    </div>
    <div class="layout_bottom">
        <div class="layout_bottom_left">
            <RouterLink active-class="active" to="/home/users" class="layout_bottom_left_a">
                <el-icon><User /></el-icon>
                用户
            </RouterLink>
            <RouterLink active-class="active" to="/home/ba" class="layout_bottom_left_a">
            <el-icon><Reading /></el-icon>
                贴吧
            </RouterLink>
            <RouterLink active-class="active" to="/home/content" class="layout_bottom_left_a">
            <el-icon><Document /></el-icon>
                帖子
            </RouterLink>
            <RouterLink active-class="active" to="/home/application" class="layout_bottom_left_a">
            <el-icon><Expand /></el-icon>
                申请
            </RouterLink>
            <RouterLink active-class="active" to="/home/carousel" class="layout_bottom_left_a">
            <el-icon><Setting /></el-icon>
                轮播图
            </RouterLink>
        </div>
        <div class="layout_bottom_right">
            <RouterView/>
        </div>
    </div>
  </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
    name:'home',
    setup(){
        const store=useStore()
        const router=useRouter()
        // 退出登录
        const logout=()=>{
            store.commit('user/setUser',{})
            router.push('/')
        }
        return {logout}
    }
}
</script>

<style lang="less" scoped>
.common-layout{
    height: 100%;
    width: 100%;
    .layout_top{
        display: flex;
        justify-content :space-between;
        background:#fff;
        border-bottom:1px solid #333;
        align-items:center;
        padding: 0 20px;
        .layout_top_img{
            width: 64px;
            height: 64px;
        }
        .layout_top_text{
            font-size: 20px;
            font-weight: bolder;
        }
    }
    .layout_bottom{
        display: flex;
        .layout_bottom_left{
            width: 140px;
            .layout_bottom_left_a{
                display: flex;
                height: 50px;
                font-weight: bolder;
                align-items:center;
                justify-content :center;
                margin: 0 0 30px 0;
                &:hover{
                    color: #00a1d6;
                    border-right: 2px solid #00a1d6;
                }
            }
        }
        .layout_bottom_right{
            flex: 1;
            height: 100%;
            padding: 10px;
        }
    }
    
}
</style>