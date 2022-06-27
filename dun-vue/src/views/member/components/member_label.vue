<template>
  <div class="member_label">
      <RouterLink active-class="active" to="/member/dynamic" class="member_body"><div>动态</div></RouterLink>
      <RouterLink active-class="active" to="/member/focuson" class="member_body"><div>关注</div></RouterLink>
      <RouterLink active-class="active" to="/member/fan" class="member_body"><div>粉丝</div></RouterLink>
      <RouterLink active-class="active" to="/member/bas" class="member_body"><div>关注的吧</div></RouterLink>
      <RouterLink active-class="active" to="/member/collect" class="member_body"><div>收藏</div></RouterLink>
      <RouterLink active-class="active" to="/member/history" class="member_body"><div>浏览记录</div></RouterLink>
      <RouterLink active-class="active" to="/member/revise/1" class="member_body"><el-icon><Setting /></el-icon><div>其他</div></RouterLink>
  </div>
</template>

<script>
export default {
    name:'memberlabel'
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