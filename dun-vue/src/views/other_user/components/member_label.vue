<template>
  <div class="member_label">
      <RouterLink active-class="active" :to="`/user/${user_id}/dynamic`" class="member_body"><div>动态</div></RouterLink>
      <RouterLink active-class="active" :to="`/user/${user_id}/focuson`" class="member_body"><div>关注</div></RouterLink>
      <RouterLink active-class="active" :to="`/user/${user_id}/fan`" class="member_body"><div>粉丝</div></RouterLink>
      <RouterLink active-class="active" :to="`/user/${user_id}/bas`" class="member_body"><div>关注的吧</div></RouterLink>
  </div>
</template>

<script>
import {useRoute} from 'vue-router'
export default {
    name:'memberlabel',
    setup(){
        const route=useRoute()
        var user_id=route.params.id
        return {user_id}
    }
}
</script>

<style scoped lang='less'>
.member_label{
    display: flex;
    height: 60px;
    width: 980px;
    background-color: #fff;
    .member_body{
        font-size: 14px;
        border-top: 1px solid #f6f6f6;
        display: flex;
        align-items:center;
        width: 100px;
        justify-content:center;
        &:hover{
            border-bottom: 1px solid #00a1d6;
        }
    }
}
</style>