<template>
  <div class="member_label">
    <RouterLink active-class="active" to="/member/dynamic"> 动态 </RouterLink>
    <RouterLink active-class="active" to="/member/focuson"> 关注 </RouterLink>
    <RouterLink active-class="active" to="/member/fan"> 粉丝 </RouterLink>
    <RouterLink active-class="active" to="/member/bas"> 关注的吧 </RouterLink>
    <RouterLink active-class="active" to="/member/collect"> 收藏 </RouterLink>
    <RouterLink active-class="active" to="/member/history">
      浏览记录
    </RouterLink>
    <RouterLink active-class="active" to="/member/revise/1">
      <el-icon><Setting /></el-icon>
      其他
    </RouterLink>
  </div>
</template>

<script>
export default {
  name: "memberlabel",
};
</script>

<style scoped lang='less'>
.member_label {
  display: flex;
  height: 60px;
  width: 980px;
  background-color: #fff;
  a {
    font-size: 14px;
    border-top: 1px solid #f6f6f6;
    display: flex;
    align-items: center;
    width: 100px;
    justify-content: center;
    &:hover {
      border-bottom: 1px solid #00a1d6;
    }
  }
}
</style>