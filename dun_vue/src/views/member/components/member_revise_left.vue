<template>
  <el-menu
    default-active="1"
    class="el-menu-vertical-demo"
    :unique-opened=true
    @select="handleOpen"
  >
  <!-- 我的信息 -->
    <el-menu-item index="1">
      <el-icon><Edit /></el-icon>
      <template #title>我的信息</template>
    </el-menu-item>
    <!-- 我的头像 -->
    <el-menu-item index="2">
      <el-icon><Avatar /></el-icon>
      <template #title>我的头像</template>
    </el-menu-item>
    <!-- 修改密码 -->
    <el-menu-item index="3">
      <el-icon><EditPen /></el-icon>
      <template #title>修改密码</template>
    </el-menu-item>
    <!-- 申请 -->
    <el-sub-menu index="4">
        <template #title><el-icon><Expand /></el-icon>申请</template>
        <el-menu-item index="4-1">消息</el-menu-item>
        <el-menu-item index="4-2">吧务申请</el-menu-item>
        <el-menu-item index="4-3">贴吧申请</el-menu-item>
    </el-sub-menu>
     <!-- 贴吧 -->
    <el-sub-menu index="5" v-if="baadmin">
        <template #title><el-icon><Expand /></el-icon>贴吧管理</template>
        <el-menu-item index="5-1">消息</el-menu-item>
        <el-menu-item index="5-2">吧务</el-menu-item>
        <el-menu-item index="5-3">贴吧信息修改</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script>
import { ref } from 'vue'
import {getUserBaAdmin} from '@/api/user'
import {useRouter} from 'vue-router'
import { useStore } from 'vuex'
export default {
    name:'memberreviseleft',
    setup(){
        const router=useRouter()
        const handleOpen = (key, keyPath) => {
           router.push(`/member/revise/${key}`)
        }
        const store=useStore()
        const baadmin=ref(false)
        getUserBaAdmin(store.state.user.profile.id).then(data=>{
          if(data.data.length>0) baadmin.value=true
        })
        return{handleOpen,baadmin}
    }
}
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>