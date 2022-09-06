<template>
  <!-- 个人信息头部 -->
  <div class="member_header">
    <img src="http://127.0.0.1:99/img/home_banner/banner_2.png" alt="" />
    <div class="header-gradient"></div>
    <div class="header_user">
      <div class="user_info">
        <!-- 头像 -->
        <div class="avatar">
          <!-- 头像 -->
          <div class="avatar_1">
            <img :src="$store.state.user.profile.face" alt="" />
          </div>
          <!-- 动画显示--更好头像 -->
          <RouterLink to="/member/revise/2" class="avatar_2"
            >更换头像</RouterLink
          >
        </div>
        <!-- 基本信息 -->
        <div class="user_basic">
          <div class="user_basic_top">
            <!-- 名字 -->
            <RouterLink to="/member/revise/1" class="user_basic_top_1">{{
              $store.state.user.profile.nickname ||
              $store.state.user.profile.username
            }}</RouterLink>
            <!-- 图标 -->
            <span class="user_basic_top_2"></span>
          </div>
          <div class="user_basic_bottom">
            <span v-if="$store.state.user.profile.signature">{{
              $store.state.user.profile.signature
            }}</span>
            <RouterLink to="/member/revise/1" v-else style="color: #d6dee4"
              >编辑个人签名</RouterLink
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "memberheader",
  setup() {},
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
          height: 26px;
          margin-top: 6px;
          color: #fff;
          font-size: 12px;
        }
      }
    }
  }
  img {
    object-fit: cover;
  }
}
</style>