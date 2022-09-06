<template>
  <div class="member_header">
    <img src="http://127.0.0.1:99/img/home_banner/banner_5.png" alt="" />
    <div class="header-gradient"></div>
    <div class="header_user">
      <div class="user_info">
        <!-- 头像 -->
        <div class="avatar">
          <!-- 头像 -->
          <div class="avatar_1">
            <img :src="userinfo.face" alt="" />
          </div>
        </div>
        <!-- 基本信息 -->
        <div class="user_basic">
          <div class="user_basic_top">
            <!-- 名字 -->
            <RouterLink to="/member/revise/1" class="user_basic_top_1">{{
              userinfo.nickname || userinfo.username
            }}</RouterLink>
            <!-- 图标 -->
            <span class="user_basic_top_2"></span>
          </div>
          <div class="user_basic_bottom">
            <span v-if="userinfo.signature">{{ userinfo.signature }}</span>
            <span v-else>没有签名</span>
          </div>
        </div>
        <!-- 关注按钮 -->
        <div class="user_button" v-if="$store.state.user.profile.token">
          <el-button
            type="danger"
            size="large"
            v-if="user_show"
            @click="user_botton(false)"
            >关注</el-button
          >
          <el-button type="info" size="large" v-else @click="user_botton(true)"
            >已关注</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 其他用户信息头部
import { ref } from "vue";
import { userSearch, seaLike, addLike, delLike } from "@/api/user";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
export default {
  name: "memberheader",
  setup() {
    const userinfo = ref([]);
    const route = useRoute();
    const store = useStore();
    var user_id = route.params.id;
    // 获取路由携带用户id的信息
    userSearch(user_id).then((data) => {
      userinfo.value = data.data;
      // console.log(userinfo.value.id);
    });
    // 默认关注按钮的显示
    const user_show = ref(true);
    if (store.state.user.profile.token) {
      seaLike({ memberid: user_id, userid: store.state.user.profile.id }).then(
        (data) => {
          if (data.meta.status == 200) user_show.value = false;
          // console.log(user_show.value);
        }
      );
    }
    // 关注按钮的切换
    const user_botton = (val) => {
      if (val) {
        delLike({
          memberid: user_id,
          userid: store.state.user.profile.id,
        }).then((data) => {
          if (data.meta.status !== 200) return ElMessage.error("取消关注失败");
          ElMessage({ message: "取消关注成功", type: "success" });
        });
      } else {
        addLike({
          memberid: user_id,
          userid: store.state.user.profile.id,
        }).then((data) => {
          if (data.meta.status !== 200) return ElMessage.error("关注失败");
          ElMessage({ message: "关注成功", type: "success" });
        });
      }
      user_show.value = val;
    };
    return { userinfo, user_show, user_botton };
  },
};
</script>

<style scoped lang="less">
.member_header {
  position: relative;
  height: 190px;
  background-position: 50%;
  background-size: cover;
  display: flex;
  flex-direction: column-reverse;
  .header-gradient {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 84px;
    background-image: url(@/assets/img/member_shadow.png);
  }
  .header_user {
    width: 100%;
    height: 82px;
    z-index: 1;
    position: absolute;
    .user_info {
      position: relative;
      display: flex;
      align-items: center;
      margin-left: 20px;
      padding-bottom: 16px;
      .avatar {
        position: relative;
        .avatar_1 {
          width: 64px;
          height: 64px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 2px solid #d6dee4;
          }
        }
        .avatar_2 {
          position: absolute;
          top: 0;
          left: 0;
          width: 64px;
          height: 64px;
          background: rgba(0, 0, 0, 0.6);
          font-size: 12px;
          color: #fff;
          line-height: 60px;
          text-align: center;
          opacity: 0;
          border-radius: 50%;
          &:hover {
            opacity: 1;
          }
        }
      }
      .user_basic {
        color: #fff;
        font-size: 0;
        margin-left: 22px;
        line-height: 30px;
        .user_basic_top {
          .user_basic_top_1 {
            display: inline-block;
            margin-right: 5px;
            font-weight: 700;
            line-height: 18px;
            font-size: 18px;
            color: #fff;
            vertical-align: middle;
          }
          .user_basic_top_2 {
            width: 21px;
            height: 18px;
            margin-right: 5px;
          }
        }
        .user_basic_bottom {
          // margin-top: 6px;
          height: 26px;
          margin-top: 6px;
          color: #fff;
          font-size: 12px;
        }
      }
      .user_button {
        position: absolute;
        right: 40px;
        bottom: 16px;
      }
    }
  }
}
img {
  object-fit: cover;
}
</style>