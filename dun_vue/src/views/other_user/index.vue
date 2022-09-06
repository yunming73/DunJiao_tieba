<template>
  <div class="app-topnav">
    <div class="container">
        <!-- 用户个人信息 -->
        <div>
            <MemberHeader/>
        </div>
        <!-- 内容 -->
        <div class="container_body">
            <!-- 标签页 -->
            <div class="container_middle">
                <MemberBody/>
            </div>
            <!-- 右边粉丝关注数量 -->
            <div class="container_right">
                <MemberRight/>
                <!-- 个人信息展示 -->
                <div class="container_right_bottom">
                    <MemberReadOnly/>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import MemberHeader from './components/member_header.vue';
import MemberBody from './components/member_body.vue';
import MemberRight from './components/member_right.vue';
import MemberReadOnly from './components/member_readOnly.vue'
export default {
    name:'member',
    components:{MemberHeader,MemberBody,MemberRight,MemberReadOnly}
}
</script>

<style scoped lang="less">
.container{
    display: flex;
    flex-direction: column;
    .container_body{
        display: flex;
        .container_middle{
        flex: 1;
    }
    }
}
.container_right_bottom{
    float: right;
}
</style>