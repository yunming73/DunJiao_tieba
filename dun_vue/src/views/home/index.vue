<template>
  <div class="home">
    <div class="container">
      <!--首页-上-轮播图-->
      <HomeBanner />
    </div>
    <!-- 首页-上-内容 -->
    <div class="container main">
      <HomeHot />
      <!-- 随机帖子 -->
      <div class="center" v-if="contentsTime.result">
        <div>
          <div
            class="content"
            v-for="(item, i) in contentsTime.result"
            :key="i"
          >
            <DjContent :content="item" :source="source" />
          </div>
        </div>
        <!-- 分页 -->
        <div class="center_pagination">
          <el-pagination
            style="justify-content: center"
            background
            layout="total,prev, pager, next, jumper"
            :total="contentsTime.totalpage"
            :page-size="10"
            @current-change="handleCurrentChange"
            :hide-on-single-page="true"
          />
        </div>
      </div>
      <!-- 没有帖子的效果 -->
      <div class="center" v-else>
        <el-empty description="帖子空空如也" />
      </div>
      <!-- 热门帖子榜 -->
      <div class="right">
        <BasEssence hot_title="热门帖子" :content="contentHot" />
      </div>
    </div>
  </div>
</template>

<script>
// 首页
import HomeBanner from "./components/home-banner.vue";
import HomeHot from "./components/home-hot.vue";
import BasEssence from "@/components/library/dj_essence.vue";
import { getHot, getContents } from "@/api/home";
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
export default {
  name: "Home",
  components: {
    HomeBanner,
    HomeHot,
    BasEssence,
  },
  setup() {
    const pagination = reactive({
      pagenum: 1,
      pagesize: 10,
    });
    const source = ref("shouye");

    // 获取最新帖子
    const contentsTime = ref([]);
    const getlist = () => {
      getContents(pagination).then((data) => {
        contentsTime.value = data.data;
      });
    };
    getlist();
    const handleCurrentChange = (currentPageNum) => {
      pagination.pagenum = currentPageNum;
      contentsTime.value.result = [];
      getlist();
      // 滑动到顶部
      document.body.scrollIntoView();
    };
    // 获取热门帖子
    const contentHot = ref();
    getHot().then((data) => {
      if (data.meta.status !== 200 && data.meta.status !== 204)
        return ElMessage.error("获取热门帖子失败");
      contentHot.value = data.data;
    });
    return { contentHot, contentsTime, handleCurrentChange, source };
  },
};
</script>

<style scoped lang="less">
.home {
  background: #f4f5f7;
  .container {
    margin-top: 10px;
    align-items: center;
  }
  .main {
    margin-top: 13px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    .right {
      width: 260px;
    }
    .center {
      flex: 1;
      .content {
        margin: 0 10px 10px 10px;
      }
      .center_pagination {
        flex: 1;
      }
    }
  }
}
</style>