<template>
  <div class="bas_item" v-if="bastext">
    <div class="container">
      <el-breadcrumb separator=">" style="margin: 10px">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/bas' }">贴吧列表</el-breadcrumb-item>
        <el-breadcrumb-item>{{ bastext.name }}贴吧</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 吧的主要信息 -->
      <div class="bas_header">
        <div class="bas_header_top">
          <img src="http://127.0.0.1:99/img/home_banner/banner_6.png" alt="" />
        </div>
        <div class="bas_header_bottom">
          <div class="bas_header_bottom_left">
            <!-- 吧头像 -->
            <div class="bottom_left_img">
              <a class="bottom_left_img_a">
                <img :src="bastext.img" alt="" />
              </a>
            </div>
            <!-- 吧信息 -->
            <div class="bottom_left_text">
              <div class="bottom_left_text_left">
                <div class="bottom_left_text_left_top">
                  <div class="bottom_left_text_left_top_1">
                    {{ bastext.name }}吧
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
                <div class="bottom_left_text_left_bottom">
                  {{ bastext.ba_signature }}
                </div>
              </div>
              <div v-if="$store.state.user.profile.token">
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
              <div v-else>
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
          <div class="bas_header_bottom_right"></div>
        </div>
      </div>
      <!-- 吧的帖子 -->
      <div class="bas_body">
        <!-- 帖子 -->
        <div class="bas_body_1">
          <!-- 发送帖子 -->
          <BasAddContent />
          <!-- 帖子内容 -->
          <ul class="main_ul" v-if="contents.totalpage !== 0">
            <li v-for="(item, i) in contents.result" :key="i">
              <DjContent :content="item" :source="source" />
            </li>
          </ul>
          <div class="bas_body_1" v-else>
            <el-empty description="帖子空空如也" />
          </div>
          <!-- 分页 -->
          <div>
            <el-pagination
              style="justify-content: center"
              background
              layout="total,prev, pager, next, jumper"
              :total="contents.totalpage"
              @current-change="handleCurrentChange"
              :hide-on-single-page="true"
            />
          </div>
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
// 贴吧主体
import { ref, reactive } from "vue";
import { DjContent } from "@/components/library/dj_content.vue";
import {
  getBaContents,
  basSearch,
  getBaEssence,
  addbaCollect,
  delbaCollect,
} from "@/api/bas";
import { getBasCollect } from "@/api/home";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import DasAdmin from "./bas_admin.vue";
import BasEssence from "@/components/library/dj_essence.vue";
import { useStore } from "vuex";
import BasAddContent from "./bas_add_content.vue";
export default {
  name: "BasItem",
  components: { DjContent, DasAdmin, BasEssence, BasAddContent },
  setup() {
    const route = useRoute();
    const contents = ref([]);
    const bastext = ref();
    const baEssence = ref();
    const pagination = reactive({
      pagenum: 1,
      pagesize: 10,
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
    // 帖子来源(吧:ba;  首页:shouye)
    const source = ref("ba");
    // 吧信息
    basSearch(route.params.id).then((data) => {
      if (data.meta.status !== 200) return ElMessage.error("获取贴吧信息出错");
      bastext.value = data.data;
      // console.log(bastext.value);
    });
    // 吧所属帖子列表
    const getlist = () => {
      getBaContents({
        query: route.params.id,
        pagenum: pagination.pagenum,
        pagesize: pagination.pagesize,
      }).then((data) => {
        if (data.meta.status !== 200)
          return ElMessage.error("获取贴子列表信息出错");
        contents.value = data.data;
      });
    };
    getlist();
    // 吧加精帖子列表
    getBaEssence(route.params.id).then((data) => {
      if (data.meta.status !== 200)
        return ElMessage.error("获取贴吧加精帖子出错");
      baEssence.value = data.data;
    });
    // 分页
    const handleCurrentChange = (currentPageNum) => {
      pagination.pagenum = currentPageNum;
      contents.value.result = [];
      getlist();
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
    return {
      contents,
      source,
      bastext,
      baEssence,
      handleCurrentChange,
      ba_botton,
      ba_show,
      pagination,
    };
  },
};
</script>

<style lang='less' scoped>
.bas_body {
  display: flex;
  .bas_body_1 {
    flex: 1;
  }
}
// 吧的主要信息
.main_ul {
  display: flex;
  flex-direction: column;
  li {
    margin-bottom: 10px;
  }
}
.bottom_left_text_right {
  position: absolute;
  bottom: 50px;
  right: -500px;
  width: 102px;
  height: 50px;
  font-weight: bold;
  color: #fff;
}
.bas_header {
  border: 1px solid #eee;

  margin: 10px 0;
  height: 380px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  .bas_header_top {
    width: 100%;
    height: 300px;
    max-height: 260px;
    img {
      border-radius: 10px 10px 0 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .bas_header_bottom {
    position: relative;
    border-radius: 0 0 10px 10px;
    height: 120px;
    width: 100%;
    background-color: #fff;
  }
}
.bottom_left_img_a {
  position: absolute;
  padding: 4px;
  background-color: #fff;
  display: block;
  height: 160px;
  width: 160px;
  border: 1px solid #dadcdf;
  top: -80px;
  left: 50px;
  img {
    width: 100%;
    height: 100%;
  }
}
.bottom_left_text {
  position: absolute;
  bottom: 0;
  left: 250px;
  width: 400px;
  height: 100px;
  // background-color: aqua;
  .bottom_left_text_left_top {
    width: 100%;
    display: flex;
    height: 50px;
    .bottom_left_text_left_top_1 {
      font-size: 30px;
      margin: 0 10px 0 0;
      color: #333;
      font-weight: bold;
    }
    .bottom_left_text_left_top_2 {
      align-items: center;
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
// 吧的帖子
.aside {
  display: flex;
  flex-direction: column;
  margin: 0 0 10px 10px;
  width: 230px;
}
</style>