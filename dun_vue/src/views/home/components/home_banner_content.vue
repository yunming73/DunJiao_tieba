<template>
  <div class="hot_li" v-if="bastext">
    <div class="forum_item">
      <img class="forum_img" :src="bastext.img" />
      <div class="forum_info">
        <div class="forum_name">{{ bastext.name }}</div>
        <div class="forum_member">{{ bastext.ba_hits }}</div>
        <div class="forum_comment">{{ bastext.ba_information }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { basSearch } from "@/api/bas";
export default {
  name: "homebannercontent",
  props: {
    bas: {
      type: [Object, Array],
      default: () => ({}),
    },
  },
  setup(props) {
    const bastext = ref();
    basSearch(props.bas.id).then((data) => {
      if (data.meta.status !== 200) return ElMessage.error("获取贴吧信息出错");
      bastext.value = data.data;
    });
    return { bastext };
  },
};
</script>

<style scoped lang="less">
.hot_li {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 8px;
}
.forum_item {
  border-radius: 4px;
  border: 1px solid @priceColor;
  padding: 1px 0 0 1px;
  display: flex;
  width: 180px;
  height: 70px;
  background-color: #f5f3f3;
  .forum_img {
    width: 66px;
    border-radius: 10px;
    background: #f7f7f7;
  }
  .forum_info {
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .forum_name {
      height: 20px;
      width: 90px;
      overflow: hidden;
      display: -webkit-box;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }
    .forum_member {
      background-image: url("@/assets/img/tou.png");
      background-repeat: no-repeat;
      line-height: 12px;
      padding-left: 14px;
      background-size: 12px 12px;
      color: #949494;
    }
    .forum_comment {
      background-image: url("@/assets/img/xin.png");
      background-repeat: no-repeat;
      line-height: 12px;
      padding-left: 14px;
      background-size: 12px 12px;
      color: #949494;
    }
  }
}
</style>