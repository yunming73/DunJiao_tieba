<template>
  <header class="app-header">
    <div class="container">
      <RouterLink to="/" class="logo"
        ><img src="/img/logochang.4f389ea2.png"
      /></RouterLink>
      <div class="search">
        <input
          placeholder="搜一搜"
          maxlength="15"
          type="text"
          v-model="searchs"
          @keyup.enter="buttom_search"
        />
        <div class="button" @click="buttom_search">搜索</div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
export default {
  name: "AppHeader",
  setup() {
    // const ceshi = inject("reload");
    const router = useRouter();
    const searchs = ref(null);
    const buttom_search = () => {
      if (searchs.value) {
        router.push(`/search/${searchs.value}`);
        // ceshi()
      } else {
        ElMessage({
          showClose: true,
          message: "请输入想要搜索的信息",
          type: "warning",
        });
      }
      searchs.value = "";
    };
    return { searchs, buttom_search };
  },
};
</script>

<style scoped lang="less">
.app-header {
  height: 70px;
  padding-top: 6px;
  background: #fff;
  .container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .logo {
    width: 200px;
  }
  .search {
    width: 600px;
    height: 100%;
    display: flex;
    margin-left: 10px;
    line-height: 45px;
    input {
      flex: 1;
      padding-left: 5px;
      border: 1px solid #f4f4f4;
      color: rgb(107, 107, 107);
      font-size: 14px;
    }
    .button {
      width: 70px;
      height: 100%;
      padding-left: 15px;
      margin: auto;
      background: #fc5531;
      color: #fff;
      font-size: 17px;
      border: 1px solid #fc5531;
      user-select: none;
    }
  }
}
</style>