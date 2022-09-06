<template>
  <div class="bas_item" v-if="bastext">
    <div class="container">
      <el-breadcrumb separator=">" style="margin: 10px">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/bas' }">贴吧列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: `/bas/item/${bastext.id}` }"
          >{{ bastext.name }}贴吧</el-breadcrumb-item
        >
        <el-breadcrumb-item>帖子</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 吧的主要信息 -->
      <div class="bas_header">
        <div class="bas_header_bottom">
          <div class="bas_header_bottom_left">
            <!-- 吧头像 -->
            <div class="bottom_left_img">
              <RouterLink
                :to="`/bas/item/${bastext.id}`"
                class="bottom_left_img_a"
              >
                <img :src="bastext.img" alt="" />
              </RouterLink>
            </div>
            <!-- 吧信息 -->
            <div class="bottom_left_text">
              <div class="bottom_left_text_left_top">
                <div class="bottom_left_text_left_top_1">
                  <RouterLink :to="`/bas/item/${bastext.id}`">
                    {{ bastext.name }}吧
                  </RouterLink>
                </div>
                <div class="bottom_left_text_left_top_2">
                  关注:
                  <p>{{ bastext.ba_hits }}</p>
                </div>
                <div class="bottom_left_text_left_top_2">
                  帖子:
                  <p>{{ bastext.ba_information }}</p>
                </div>
              </div>
            </div>
          </div>
          <div
            class="bas_header_bottom_right"
            v-if="$store.state.user.profile.token"
          >
            <el-button
              type="danger"
              class="bottom_left_text_right"
              v-if="ba_show"
              @click="ba_botton(false)"
            >
              <el-icon :size="20" class="bottom_left_text_right_1"
                ><Plus
              /></el-icon>
              关注
            </el-button>
            <el-button
              type="info"
              class="bottom_left_text_right"
              v-else
              @click="ba_botton(true)"
            >
              取消关注
            </el-button>
          </div>
          <div class="bas_header_bottom_right" v-else>
            <RouterLink to="/login">
              <el-button type="danger" class="bottom_left_text_right">
                <el-icon :size="20" class="bottom_left_text_right_1"
                  ><Plus
                /></el-icon>
                关注
              </el-button>
            </RouterLink>
          </div>
        </div>
      </div>
      <!-- 吧的帖子 -->
      <div class="bas_body">
        <!-- 帖子 -->
        <div class="bas_body_1" v-if="texttitle">
          <!-- 发送帖子 -->
          <BasAddContent />
          <!-- 帖子内容 -->
          <ul class="main_ul">
            <!-- 主贴 -->
            <li>
              <ContentCommentItem
                :content="texttitle"
                :titletop="texttitle.title"
                @toggle_sort="toggle_sort"
                :landlord="texttitle.user_id"
                @toggle_show_landlord="toggle_show_landlord"
                v-model:content_show="content_show"
              />
            </li>
            <!-- 从贴 -->
            <li v-for="(item, i) in contentsComment.result" :key="i">
              <ContentCommentItem
                :content="item"
                :landlord="texttitle.user_id"
                @toggle_show_landlord="toggle_show_landlord"
              />
            </li>
          </ul>
          <!-- 分页 -->
          <div>
            <el-pagination
              style="justify-content: center"
              background
              layout="total,prev, pager, next, jumper"
              :total="contentsComment.totalpage"
              :page-size="10"
              @current-change="handleCurrentChange"
              :hide-on-single-page="true"
            />
          </div>
        </div>
        <div class="bas_body_1" v-else>
          <el-empty description="出错" />
        </div>
        <!-- 吧务+加精榜 -->
        <div class="aside">
          <DasAdmin style="margin: 0 0 10px 0" :bastext="bastext" />
          <BasEssence hot_title="加精榜" :content="baEssence" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 主贴里面详情
import { ref, reactive } from "vue";
import ContentCommentItem from "./bas_content_comment_item.vue";
import {
  getContentsComment,
  basSearch,
  getBaEssence,
  addbaCollect,
  delbaCollect,
  searchContent,
  getLandlordContentComment,
} from "@/api/bas";
import { getBasCollect } from "@/api/home";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import DasAdmin from "./bas_admin.vue";
import BasEssence from "@/components/library/dj_essence.vue";
import { useStore } from "vuex";
import BasAddContent from "./bas_add_content.vue";
export default {
  name: "bascontent",
  components: { ContentCommentItem, DasAdmin, BasEssence, BasAddContent },
  setup() {
    const route = useRoute();
    const contentsComment = ref([]);
    const bastext = ref();
    const baEssence = ref();
    var show_landlord = false;
    const pagination = reactive({
      pagenum: 1,
      pagesize: 10,
      sort: "",
    });
    const store = useStore();
    const ba_show = ref(true);
    const userid = store.state.user.profile.id;
    // 用户关注吧列表
    if (store.state.user.profile.token) {
      getBasCollect(userid).then((data) => {
        for (let i = 0; i < data.data.length; i++) {
          if (data.data[i].id == route.params.id)
            return (ba_show.value = false);
        }
      });
    }
    // 吧信息
    basSearch(route.params.id).then((data) => {
      if (data.meta.status !== 200) return ElMessage.error("获取贴吧信息出错");
      bastext.value = data.data;
    });
    // 主贴信息
    const texttitle = ref(null);
    searchContent({ id: route.params.commentid }).then((data) => {
      if (data.meta.status !== 200) return ElMessage.error("获取主贴信息出错");
      texttitle.value = data.data[0];
    });
    // 主贴所属从帖列表
    const getlist = () => {
      getContentsComment({
        query: route.params.commentid,
        pagenum: pagination.pagenum,
        pagesize: pagination.pagesize,
        sort: pagination.sort,
      }).then((data) => {
        if (data.meta.status !== 200)
          return ElMessage.error("获取从贴列表信息出错");
        contentsComment.value = data.data;
      });
    };
    getlist();
    // 吧加精帖子列表
    getBaEssence(route.params.id).then((data) => {
      if (data.meta.status !== 200)
        return ElMessage.error("获取贴吧加精帖子出错");
      baEssence.value = data.data;
    });
    // 楼主发言的从贴列表
    const getListLandlord = () => {
      getLandlordContentComment({
        query: route.params.commentid,
        pagenum: pagination.pagenum,
        pagesize: pagination.pagesize,
        sort: pagination.sort,
        userid: texttitle.value.user_id,
      }).then((data) => {
        if (data.meta.status !== 200)
          return ElMessage.error("获取楼主发言的从贴列表出错");
        contentsComment.value = data.data;
      });
    };
    // 分页
    const content_show = ref(true);
    const handleCurrentChange = (currentPageNum) => {
      pagination.pagenum = currentPageNum;
      contentsComment.value.result = [];
      // 判断是否显示楼主从贴或正常从贴数据
      if (show_landlord) {
        getListLandlord();
      } else {
        getlist();
      }
      // 分页时候的主贴显示与隐藏
      if (currentPageNum == 1) {
        content_show.value = true;
      } else {
        content_show.value = false;
      }
      // 滑动到顶部
      document.body.scrollIntoView();
    };
    // 关注按钮
    const ba_botton = (val) => {
      if (val) {
        if (store.state.user.profile.token) {
          delbaCollect({ baid: route.params.id, userid: userid }).then(
            (data) => {
              if (data.meta.status !== 200)
                return ElMessage.error("取消关注失败");
              ElMessage("取消关注成功");
            }
          );
        }
      } else {
        addbaCollect({ baid: route.params.id, userid: userid }).then((data) => {
          if (data.meta.status !== 200) return ElMessage.error("关注失败");
          ElMessage({ message: "关注成功", type: "success" });
        });
      }
      ba_show.value = val;
    };

    // 接收到的排序方式
    const toggle_sort = (val) => {
      if (val) {
        pagination.sort = "desc";
      } else {
        pagination.sort = "";
      }
      if (show_landlord) {
        getListLandlord();
      } else {
        getlist();
      }
    };
    // 接收到的是否显示楼主发送的从贴数据格式
    const toggle_show_landlord = (val) => {
      show_landlord = val;
      if (val) {
        getListLandlord();
      } else {
        getlist();
      }
    };
    return {
      contentsComment,
      bastext,
      baEssence,
      texttitle,
      handleCurrentChange,
      ba_botton,
      ba_show,
      toggle_sort,
      toggle_show_landlord,
      content_show,
    };
  },
};
</script>

<style lang='less' scoped>
.bas_header {
  border: 1px solid #eee;
  margin-bottom: 10px;
  border-radius: 10px;
  height: 70px;
  .bas_header_bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 10px;
    width: 100%;
    height: 100%;
    padding: 0 10px 0 64px;
    background-color: #fff;
    .bas_header_bottom_left {
      display: flex;
      .bottom_left_img {
        .bottom_left_img_a {
          // position: absolute;
          padding: 4px;
          background-color: #fff;
          display: block;
          height: 64px;
          width: 64px;
          border: 1px solid #dadcdf;
          top: -80px;
          left: 50px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .bottom_left_text {
        display: flex;
        margin-left: 14px;
        .bottom_left_text_left_top {
          width: 100%;
          display: flex;
          align-items: center;
          // height: 50px;
          .bottom_left_text_left_top_1 {
            font-size: 30px;
            margin: 0 10px 0 0;
            color: #333;
            font-weight: bold;
          }
          .bottom_left_text_left_top_2 {
            // align-items: center;
            font-size: 16px;
            display: flex;
            color: #aaa;
            p {
              margin: 0 10px;
              font-size: 16px;
              color: #ff7f3e;
            }
          }
        }
        .bottom_left_text_left_bottom {
          color: #4c4c4c;
          font-size: 20px;
        }
      }
    }
    // 关注按钮
    .bottom_left_text_right {
      float: right;
      width: 102px;
      height: 50px;
      font-weight: bold;
      color: #fff;
    }
  }
}
// 吧的帖子
.bas_body {
  display: flex;
  .bas_body_1 {
    flex: 1;
    .main_ul {
      display: flex;
      flex-direction: column;
      li {
        margin-bottom: 10px;
      }
    }
  }
  // 吧的帖子
  .aside {
    display: flex;
    flex-direction: column;
    margin: 0 0 10px 10px;
    width: 230px;
  }
}
</style>