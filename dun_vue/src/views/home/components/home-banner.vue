<template>
  <div class="home-banner">
    <div class="container">
      <div class="ban">
        <DjCarousel autoPlay :sliders="sliders" />
      </div>
      <!-- 登录 -->
      <div class="home_user" v-if="user_states">
        <div class="user_info_content">
          <RouterLink to="/member" class="user_info_header_top">
            <img :src="$store.state.user.profile.face" alt="" />
          </RouterLink>
          <RouterLink to="/member" class="user_word">{{
            $store.state.user.profile.nickname ||
            $store.state.user.profile.username
          }}</RouterLink>
          <!-- 个人信息 -->
          <div class="user_stats">
            <RouterLink to="/member/focuson" class="user_stats_1">
              <div class="user_stats_2">{{ user_states.user_focus }}</div>
              <div class="user_stats_3">关注</div>
            </RouterLink>
            <RouterLink to="/member/fan" class="user_stats_1">
              <div class="user_stats_2">{{ user_states.user_fan }}</div>
              <div class="user_stats_3">粉丝</div>
            </RouterLink>
            <RouterLink to="/member/dynamic" class="user_stats_1">
              <div class="user_stats_2">{{ user_states.user_content }}</div>
              <div class="user_stats_3">动态</div>
            </RouterLink>
          </div>
        </div>
        <!-- 关注的吧 -->
        <div class="user_info_bottom">
          <!-- 头 -->
          <div class="user_info_bottom_ba1">
            <RouterLink to="/member/bas"><h4>关注的吧</h4></RouterLink>
          </div>
          <!-- 内容 -->
          <div class="user_info_bottom_ba2">
            <RouterLink
              class="user_info_bottom_item"
              v-for="(item, i) in basCollect.slice(0, 5)"
              :key="i"
              :to="`/bas/item/${item.id}`"
              :title="item.name"
            >
              <div class="user_info_bttom_item_1">
                <img :src="item.img" alt="" />
              </div>
              <div class="user_info_bttom_item_2">
                {{ item.name }}
              </div>
            </RouterLink>
            <RouterLink
              to="/member/bas"
              class="user_info_bottom_item"
              v-if="basCollect.length > 4"
            >
              <div class="user_info_bttom_item_2">更多</div>
            </RouterLink>
            <RouterLink to="/bas" class="user_info_bottom_item" v-else>
              <div class="user_info_bttom_item_2">添加+</div>
            </RouterLink>
          </div>
        </div>
      </div>
      <!-- 没有登录 -->
      <div class="home_user" v-else>
        <div class="user_info_content">
          <RouterLink to="/member" class="user_info_header_top">
            <img src="http://127.0.0.1:99/img/users_img/default.jpeg" alt="" />
          </RouterLink>
          <RouterLink to="/member" class="user_word">游客</RouterLink>
          <!-- 个人信息 -->
          <div class="user_stats">
            <RouterLink to="/member/focuson" class="user_stats_1">
              <div class="user_stats_2">0</div>
              <div class="user_stats_3">关注</div>
            </RouterLink>
            <RouterLink to="/member/fan" class="user_stats_1">
              <div class="user_stats_2">0</div>
              <div class="user_stats_3">粉丝</div>
            </RouterLink>
            <RouterLink to="/member/dynamic" class="user_stats_1">
              <div class="user_stats_2">0</div>
              <div class="user_stats_3">动态</div>
            </RouterLink>
          </div>
        </div>
        <!-- 关注的吧 -->
        <div class="user_info_bottom">
          <!-- 头 -->
          <div class="user_info_bottom_ba1">
            <RouterLink to="/member/bas"><h4>关注的吧</h4></RouterLink>
          </div>
          <!-- 内容 -->
          <div class="user_info_bottom_ba2">
            <RouterLink to="/bas" class="user_info_bottom_item">
              <div class="user_info_bttom_item_2">添加+</div>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { findBanner, getstats, getBasCollect } from "@/api/home";
import { useStore } from "vuex";
export default {
  name: "HomeBanner",
  setup() {
    // 获取轮播图数据
    const sliders = ref([]);
    findBanner().then((data) => {
      sliders.value = data.data;
    });
    // 获取粉丝关注帖子数量+吧列表
    var user_states = ref(null);
    const store = useStore();
    const basCollect = ref([]);
    if (store.state.user.profile.token) {
      var user_id = store.state.user.profile.id;
      getstats({ id: user_id }).then((data) => {
        user_states.value = data.data[0];
      });
      // 获取用户关注吧列表
      getBasCollect(user_id).then((data) => {
        basCollect.value = data.data;
      });
    }
    return { sliders, user_states, basCollect };
  },
};
</script>

<style scoped lang="less">
.home-banner {
  left: 0;
  top: 0;
  .container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .ban {
      flex: 1;
      height: 400px;
      border: 1px solid #eee;
      border-radius: 10px;
    }
    .home_user {
      margin-left: 8px;
      height: 400px;
      width: 260px;
      display: flex;
      flex-direction: column;
    }
  }
}
.user_info_header {
  height: 64px;
  width: 100%;
}
// 个人信息模块样式
.user_info_content {
  border: 1px solid #eee;
  background-color: #fff;
  border-radius: 10px;
  box-sizing: border-box;
  width: 100%;
  height: 144px;
  position: relative;
  padding: 10px 26px;
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  justify-content: space-between;
  .user_info_header_top {
    position: absolute;
    width: 56px;
    height: 56px;
    left: 16px;
    top: -16px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
  }
  .user_word {
    padding-left: 54px;
    font-size: 13px;
    cursor: pointer;
  }
  .user_stats {
    display: flex;
    justify-content: space-between;
    .user_stats_1 {
      width: 33.33333%;
      height: 46px;
      flex-direction: column;
      align-items: center;
      display: flex;
      justify-content: space-between;
    }
    .user_stats_2 {
      font-weight: 700;
      line-height: 19px;
      font-size: 14px;
      color: #222;
    }
    .user_stats_3 {
      font-size: 12px;
      color: #99a2aa;
    }
  }
}
// 关注吧模块样式
.user_info_bottom {
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  box-sizing: border-box;
  width: 100%;
  flex: 1;
  padding: 18px 18px;
  display: flex;
  flex-direction: column;
  .user_info_bottom_ba1 {
    font-size: 20px;
    margin-bottom: 6px;
  }
  .user_info_bottom_ba2 {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .user_info_bottom_item {
      padding: 3px;
      display: flex;
      justify-content: center;
      width: 96px;
      height: 46px;
      border-radius: 6px;
      background-color: #f6f7f8;
      .user_info_bttom_item_1 {
        border: 1px solid #eee;
        left: 0;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
      }
      .user_info_bttom_item_2 {
        color: #61666d;
        flex: 1;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        text-align: center;
        line-height: 40px;
      }
    }
  }
}
</style>