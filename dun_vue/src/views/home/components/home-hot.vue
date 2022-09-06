<template>
  <div class="hot">
    <!-- 头部 -->
    <div class="hot_head">
      <div class="left">
        <span>排行榜</span>
      </div>
      <div class="right">
        <RouterLink to="/bas">
          <span>更多</span>
        </RouterLink>
      </div>
    </div>
    <!-- 吧卡片 -->
    <div class="hot_body" v-if="bahot">
      <template v-for="(item, i) in bahot" :key="i">
        <RouterLink :to="`/bas/item/${item.id}`">
          <div
            class="number"
            :style="{
              color:
                i == 0
                  ? '#ff473d'
                  : i == 1
                  ? '#ff6a29'
                  : i == 2
                  ? '#ff9214'
                  : '',
            }"
          >
            {{ i + 1 }}
          </div>
          <HomeBannerContent :bas="item" />
        </RouterLink>
      </template>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import { getBasHot } from "@/api/home";
import HomeBannerContent from "./home_banner_content.vue";
import { ElMessage } from "element-plus";
export default {
  name: "homehot",
  components: { HomeBannerContent },
  setup() {
    const bahot = ref();
    getBasHot().then((data) => {
      if (data.meta.status !== 200)
        return ElMessage.error("获取热门贴吧id出错");
      bahot.value = data.data;
    });
    return { bahot };
  },
};
</script>

<style scoped lang="less">
.hot {
  padding: 6px;
  width: 230px;
  display: flex;
  border: 1px solid #eee;
  background-color: #fff;
  border-radius: 5px;
  flex-direction: column;
  .hot_head {
    justify-content: space-between;
    height: 28px;
    margin-bottom: 12px;
    display: flex;
    .left {
      font-size: 24px;
    }
    .right {
      height: 34px;
      width: 64px;
      border: 1px solid @priceColor;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #000;
      border-radius: 8px;
      span {
        color: #949494;
      }
    }
  }
  .hot_body {
    a {
      display: flex;
    }
    .number {
      font-family: Avenir;
      font-style: italic;
      font-weight: 600;
      margin: 0 4px;
      padding-top: 26px;
      width: 20px;
      color: #c9ccd0;
    }
  }
}
</style>