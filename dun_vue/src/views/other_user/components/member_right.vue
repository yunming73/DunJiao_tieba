<template>
  <div class="text">
      <div class="home_user" v-if="user_states">
          <div class="user_info_content">
            <div class="user_stats">
              <RouterLink to="/member/focuson" class="user_stats_1">
                <div class="user_stats_2">{{user_states.user_focus}}</div>
                <div class="user_stats_3">关注</div>
              </RouterLink >
              <RouterLink to="/member/fan" class="user_stats_1">
                <div class="user_stats_2">{{user_states.user_fan}}</div>
                <div class="user_stats_3">粉丝</div>
              </RouterLink>
              <RouterLink to="/member/dynamic" class="user_stats_1">
                <div class="user_stats_2">{{user_states.user_content}}</div>
                <div class="user_stats_3">动态</div>
              </RouterLink>
            </div>
          </div>
      </div>
  </div>
</template>
<script>
import {ref} from 'vue';
import {getstats} from '@/api/home';
import {useRoute} from 'vue-router'
export default {
  name:'memeberright',
  setup(){
    // 获取粉丝关注帖子数量
    var user_states =ref(null)
    const route=useRoute()
    // console.log(route.params.id);
    var user_id=route.params.id
    getstats({id:user_id}).then(data=>{
      user_states.value=data.data[0]
    })
    return {user_states}
  }
}
</script>

<style scoped lang="less">
 .home_user{
        // height: 400px;
        width: 260px;
        display: flex;
        flex-direction:column;
        margin-bottom: 10px;
      }
.user_info_content{
    // border: 1px solid #eee;
    background-color: #fff;
    box-sizing: border-box;
    width: 100%;
    height: 60px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .user_stats{
      display: flex;
      justify-content: space-between;
      .user_stats_1{
        width: 33.33333%;
        height: 46px;
        flex-direction: column;
        align-items: center;
        display: flex;
        justify-content: space-between;
      }
      .user_stats_2{
        font-weight: 600;
        line-height: 19px;
        // font-size: 14px;
        color: #222;
      }
      .user_stats_3{
        font-size: 12px;
        color: #99a2aa;
      }
    }
}
</style>