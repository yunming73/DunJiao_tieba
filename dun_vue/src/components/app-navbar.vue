<template>
  <div class="app-topnav">
    <div class="container">
      <ul>
        <template v-if="profile.token">
          <li>
            <RouterLink to="/member">{{
              profile.nickname ? profile.nickname : profile.username
            }}</RouterLink>
          </li>
          <li><a @click="logouts()">退出登录</a></li>
        </template>
        <template v-else>
          <li><RouterLink to="/login">请先登录</RouterLink></li>
          <li><RouterLink to="/signup">免费注册</RouterLink></li>
        </template>
      </ul>
    </div>
  </div>
</template>
<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { logout } from "@/api/user";
import { ElMessage } from "element-plus";
export default {
  name: "AppTopnav",
  setup() {
    // 获取用户登录信息才能控制切换导航菜单
    const store = useStore();
    // 使用vuex中的state需要设置计算属性
    const profile = computed(() => {
      return store.state.user.profile;
    });
    // 退出登录
    // 1.清空本地存储信息和vuex的用户信息
    // 2.跳转登录
    const router = useRouter();
    const logouts = () => {
      // 清空用户信息
      logout({ id: profile.value.id }).then((data) => {
        if (data.meta.status !== 200) return ElMessage.error("退出登录出错");
        router.push("/");
        ElMessage({ type: "success", message: "退出登录成功" });
        store.commit("user/setUser", {});
      });
    };
    return { profile, logouts };
  },
};
</script>
<style scoped lang="less">
.app-topnav {
  background: rgb(255, 255, 255);
  border-bottom: 1px solid #ebebeb;
  ul {
    display: flex;
    height: 30px;
    justify-content: flex-end;
    align-items: center;
    li {
      a {
        padding: 0 15px;
        color: #333;
        line-height: 1;
        display: inline-block;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
        &:hover {
          color: @xtxColor;
        }
      }
      ~ li {
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
/* ~选择器的作用:选择当前选择器后的所有元素 */
</style>