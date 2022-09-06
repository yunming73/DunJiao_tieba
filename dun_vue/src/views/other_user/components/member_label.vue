<template>
  <div class="member_label">
    <RouterLink active-class="active" :to="`/user/${user_id}/dynamic`"
      >动态</RouterLink
    >
    <RouterLink active-class="active" :to="`/user/${user_id}/focuson`"
      >关注</RouterLink
    >
    <RouterLink active-class="active" :to="`/user/${user_id}/fan`"
      >粉丝</RouterLink
    >
    <RouterLink active-class="active" :to="`/user/${user_id}/bas`"
      >关注的吧</RouterLink
    >
  </div>
</template>

<script>
import { useRoute } from "vue-router";
export default {
  name: "memberlabel",
  setup() {
    const route = useRoute();
    var user_id = route.params.id;
    return { user_id };
  },
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