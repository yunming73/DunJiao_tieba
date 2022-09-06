<template>
  <div class="home-banner">
    <!-- 面包屑 -->
    <div class="container">
      <el-breadcrumb separator=">" style="margin: 10px">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>搜索</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container container_1">
      <!-- 搜索结果 -->
      <div class="ban">
        <!-- 吧结果 -->
        <div>
          <div class="ban_top">
            <div v-loading="loadingba" :data="bas.result">
              <div class="ban_top_item" v-if="bas.totalpage > 0">
                <div v-for="(item, i) in bas.result" :key="i">
                  <DjBaitem :bas="item" />
                </div>
              </div>
              <div class="ban_top_text" v-else>
                没有找到"{{ searchInfo }}"吧
                <RouterLink to="/member/revise/4-2"> 创建吧 </RouterLink>
              </div>
            </div>
            <!-- 分页 -->
            <el-pagination
              style="justify-content: center; margin-right: 80px"
              background
              layout="total,prev, pager, next"
              :total="bas.totalpage"
              :page-size="pagination.pagesize"
              @current-change="handleCurrentChange"
              :hide-on-single-page="true"
            />
          </div>
        </div>
        <!-- 帖子结果 -->
        <div class="ban_bottom">
          <div class="ban_botom_item">
            <div v-loading="loadingcontent" :data="contents.result">
              <div class="ban_botom_item_for" v-if="contents.totalpage > 0">
                <div
                  class="content"
                  v-for="(item, i) in contents.result"
                  :key="i"
                >
                  <DjContent :content="item" :source="source" />
                </div>
              </div>
              <div class="ban_botom_item_text" v-else>
                没有找到关于"{{ searchInfo }}"帖子
              </div>
            </div>
            <!-- 分页 -->
            <el-pagination
              style="justify-content: center; margin-right: 80px"
              background
              layout="total,prev, pager, next"
              :total="contents.totalpage"
              :page-size="paginations.pagesize"
              @current-change="handleCurrentChanges"
              :hide-on-single-page="true"
            />
          </div>
        </div>
      </div>
      <!-- 登录 -->
      <div class="home_user" v-if="user_states">
        <div class="user_info_content">
          <RouterLink to="/member" class="user_info_header_top">
            <img :src="$store.state.user.profile.face" alt="" />
          </RouterLink>
          <RouterLink to="/member" class="user_word">{{
            $store.state.user.profile.nickname ||
            $store.state.user.profile.account
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
            <h4>关注的吧</h4>
          </div>
          <!-- 内容 -->
          <div class="user_info_bottom_ba2">
            <RouterLink
              class="user_info_bottom_item"
              v-for="(item, i) in basCollect"
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
            <RouterLink to="/bas" class="user_info_bottom_item">
              <div class="user_info_bttom_item_2">更多</div>
            </RouterLink>
          </div>
        </div>
        <!-- 热门帖子榜 -->
        <div class="right">
          <BasEssence hot_title="热门帖子" :content="contentHot" />
        </div>
      </div>
      <!-- 没有登录 -->
      <div class="home_user" v-else>
        <div class="user_info_content">
          <a class="user_info_header_top">
            <img src="http://127.0.0.1:99/img/users_img/default.jpeg" alt="" />
          </a>
          <a class="user_word">游客</a>
          <!-- 个人信息 -->
          <div class="user_stats">
            <a class="user_stats_1">
              <div class="user_stats_2">0</div>
              <div class="user_stats_3">关注</div>
            </a>
            <a class="user_stats_1">
              <div class="user_stats_2">0</div>
              <div class="user_stats_3">粉丝</div>
            </a>
            <a class="user_stats_1">
              <div class="user_stats_2">0</div>
              <div class="user_stats_3">动态</div>
            </a>
          </div>
        </div>
        <!-- 关注的吧 -->
        <div class="user_info_bottom">
          <!-- 头 -->
          <div class="user_info_bottom_ba1">
            <h4>关注的吧</h4>
          </div>
          <!-- 内容 -->
          <div class="user_info_bottom_ba2">
            <RouterLink to="/login" class="user_info_bottom_item">
              <div class="user_info_bttom_item_2">更多</div>
            </RouterLink>
          </div>
        </div>
        <!-- 热门帖子榜 -->
        <div class="right">
          <BasEssence hot_title="热门帖子" :content="contentHot" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import HomeBanner from "@/views/home/components/home-banner.vue";
import HomeHot from "@/views/home/components/home-hot.vue";
import BasEssence from "./library/dj_essence.vue";
import { getHot, searchContent } from "@/api/home";
import { ref, reactive, watch } from "vue";
import { getstats, getBasCollect } from "@/api/home";
import { getBas } from "@/api/bas";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import DjBaitem from "@/components/library/dj_baitem.vue";
import { ElMessage } from "element-plus";
export default {
  name: "search",
  components: {
    HomeBanner,
    HomeHot,
    BasEssence,
    DjBaitem,
  },
  setup() {
    const route = useRoute();
    // 要搜索的内容
    const searchInfo = ref("");
    // 获取粉丝关注帖子数量+吧列表
    var user_states = ref(null);
    const store = useStore();
    var user_id = store.state.user.profile.id;
    if (store.state.user.profile.token) {
      getstats({ id: user_id }).then((data) => {
        user_states.value = data.data[0];
      });
    }
    // 获取用户关注吧列表
    const basCollect = ref("");
    if (store.state.user.profile.token) {
      getBasCollect(user_id).then((data) => {
        basCollect.value = data.data;
      });
    }
    // 获取热门帖子
    const contentHot = ref([]);
    getHot().then((data) => {
      contentHot.value = data.data.result;
    });
    // 搜索吧
    const loadingba = ref(true);
    const bas = ref([]);
    const pagination = reactive({
      pagenum: 1,
      pagesize: 2,
    });
    const getlist = () => {
      getBas({
        query: searchInfo.value,
        pagesize: pagination.pagesize,
        pagenum: pagination.pagenum,
      }).then((data) => {
        if (data.meta.status !== 200) return ElMessage.error("模糊搜索吧出错");
        loadingba.value = false;
        bas.value = data.data;
      });
    };
    // 吧分页
    const handleCurrentChange = (currentPageNum) => {
      pagination.pagenum = currentPageNum;
      loadingba.value = true;
      bas.value.result = [];
      getlist();
    };
    // 搜索帖子
    const loadingcontent = ref(true);
    const contents = ref({});
    const source = ref("shouye");
    const paginations = reactive({
      pagenums: 1,
      pagesizes: 10,
    });
    const getlistTwo = () => {
      searchContent({
        query: searchInfo.value,
        pagesize: paginations.pagesizes,
        pagenum: paginations.pagenums,
      }).then((data) => {
        if (data.meta.status !== 200)
          return ElMessage.error("模糊搜索帖子出错");
        loadingcontent.value = false;
        contents.value = data.data;
      });
    };
    // 帖子分页

    const handleCurrentChanges = (currentPageNums) => {
      paginations.pagenums = currentPageNums;
      contents.value.result = [];
      loadingcontent.value = true;
      document.body.scrollIntoView();
      getlistTwo();
    };
    watch(
      () => route.params,
      () => {
        searchInfo.value = route.params.string;
        getlist();
        getlistTwo();
      },
      { immediate: true }
    );
    return {
      source,
      contentHot,
      user_states,
      basCollect,
      searchInfo,
      bas,
      handleCurrentChange,
      handleCurrentChanges,
      contents,
      pagination,
      paginations,
      loadingba,
      loadingcontent,
    };
  },
};
</script>

<style scoped lang="less">
.home-banner {
  left: 0;
  top: 0;
  margin-top: 10px;
  .container_1 {
    display: flex;
    flex-direction: row;
    justify-content: center;
    // align-items:center;
    .ban {
      width: 100%;
      .ban_top {
        width: 100%;
        // min-height: 100%;
        // height: 100%;
        display: flex;
        line-height: 30px;
        padding-left: 20px;
        border: 1px solid #eee;
        border-radius: 10px;
        background-color: #fff;
        flex-direction: column;
        .ban_top_item {
          display: flex;
          padding-top: 18px;
          width: 100%;
          // height: 100%;
          height: 248px;
          justify-content: space-between;
          :deep(.bas_body) {
            width: 100%;
            justify-content: space-between;
            display: flex;
            margin: 0 30px;
          }
        }
        .ban_top_text {
          a {
            margin-left: 20px;
            color: #99a2aa;
          }
        }
      }
    }
    .ban_bottom {
      margin-top: 10px;
      .ban_botom_item {
        .ban_botom_item_for {
          min-height: 100px;
        }
        .content {
          margin-bottom: 10px;
        }
        .ban_botom_item_text {
          padding-left: 10px;
        }
      }
    }
    .home_user {
      margin-left: 8px;
      width: 260px;
      display: flex;
      flex-direction: column;
      .right {
        margin-top: 10px;
        width: 260px;
      }
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
      // cursor: pointer;
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
  // flex: 1;
  height: 244px;
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