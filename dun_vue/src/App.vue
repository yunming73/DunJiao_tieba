<template>
  <!-- 一级路由 -->
  <RouterView v-if="isRouterAlive" />
  <!-- <BLank v-else /> -->
</template>
<script>
import { ref, nextTick, provide } from "vue";
import BLank from "@/components/BLank.vue";
export default {
  name: "App",
  components: {
    BLank,
  },
  setup() {
    // 局部组件刷新
    const isRouterAlive = ref(true);
    const reload = () => {
      isRouterAlive.value = false;
      nextTick(() => {
        isRouterAlive.value = true;
      });
    };
    provide("reload", reload);
    return {
      isRouterAlive,
    };
  },
};
</script>