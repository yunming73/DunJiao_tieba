<template>
   <!-- 个人信息内容 -->
    <div class="member_body">
        <!--  标签 -->
       <div class="body_top">
           <MemberLabel/>
       </div>
       <!-- 标签内容 -->
       <div class="body_bottom">
            <RouterView />
       </div>
    </div>
</template>

<script>
import MemberLabel from './member_label.vue'
export default {
    name:'memberbody',
    components:{MemberLabel},
    setup(){

    }
}
</script>

<style scoped lang="less">
.member_body{
    // display: flex;
    // height: 900px;
    .body_top{
        margin-bottom: 10px;
    }
}
</style>