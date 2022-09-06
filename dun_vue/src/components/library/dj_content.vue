<template>
  <div class="ad" v-if="show">
    <el-card :body-style="{ padding: '10px' }" class="body_item" shadow="hover">
      <!-- 左 -->
      <div class="item_left">
        <div class="item_left_left">
          <!-- 标题 -->
          <div class="item_title">
            <RouterLink
              :to="`/bas/item/${content.ba_id}/${content.id}`"
              @click="content_click()"
            >
              {{ content.title }}
            </RouterLink>
          </div>
          <!-- 内容 -->
          <div class="item_content">
            <!-- 文字内容 -->
            <span class="item_text">
              <RouterLink
                :to="`/bas/item/${content.ba_id}/${content.id}`"
                @click="content_click()"
              >
                {{ content.content }}
              </RouterLink>
            </span>
            <!-- 图片内容 -->
            <div class="item_img" v-if="content.img">
              <span
                class="block"
                v-for="(item, i) in content.img.slice(0, 4)"
                :key="i"
              >
                <el-image
                  :src="item"
                  :preview-src-list="content.img"
                  fit="cover"
                  lazy
                  close-on-press-escape:true
                />
                <!-- <el-image>
                            <template #error>
                                <div class="image-slot"><el-icon><picture /></el-icon></div>
                            </template>
                        </el-image> -->
              </span>
            </div>
          </div>
        </div>
        <div class="item_time">
          {{ content.add_time }}
        </div>
      </div>
      <!-- 右 -->
      <div class="item_right">
        <!-- 用户头像-名字 -->
        <div class="item_right_top" v-if="source == 'ba'">
          <RouterLink
            :to="
              content.co_user_id == $store.state.user.profile.id
                ? `/member`
                : `/user/${content.co_user_id}`
            "
            :title="content.user_nickname || content.user_name"
          >
            <img :src="content.user_face" class="image" />
          </RouterLink>
          <RouterLink
            :to="
              content.co_user_id == $store.state.user.profile.id
                ? `/member`
                : `/user/${content.co_user_id}`
            "
            :title="content.user_nickname || content.user_name"
          >
            <span class="user_name">
              {{ content.user_nickname || content.user_name }}
            </span>
          </RouterLink>
        </div>
        <div class="item_right_top" v-if="source == 'shouye'">
          <RouterLink
            :to="`/bas/item/${content.ba_id}`"
            :title="content.ba_name"
          >
            <img :src="content.ba_img" class="image" />
          </RouterLink>
          <span class="user_name">
            <RouterLink
              :to="`/bas/item/${content.ba_id}`"
              :title="content.ba_name"
            >
              {{ content.ba_name }}
            </RouterLink>
          </span>
        </div>
        <!-- 评论 收藏 点赞 -->
        <div class="like" v-if="contentStats">
          <!-- 评论 -->
          <RouterLink :to="`/bas/item/${content.ba_id}/${content.id}`">
            <el-icon class="like_1" :size="20"><ChatDotSquare /></el-icon>
          </RouterLink>
          {{ contentStats[0].content_s }}
          <!-- 收藏 -->
          <div v-if="$store.state.user.profile.token">
            <el-icon
              class="like_1"
              :size="20"
              v-if="like_show_2"
              @click="ba_botton(false)"
              ><Star
            /></el-icon>
            <el-icon
              class="like_1"
              :size="20"
              style="color: #f3a034"
              v-else
              @click="ba_botton(true)"
              ><StarFilled
            /></el-icon>
          </div>
          <div v-else>
            <RouterLink to="/login">
              <el-icon class="like_1" :size="20"><Star /></el-icon>
            </RouterLink>
          </div>
          {{ contentStats[0].content_user }}
          <!-- 点赞 -->
          <div v-if="$store.state.user.profile.token">
            <el-icon
              class="like_1"
              :size="20"
              v-if="like_show_3"
              @click="ba_botton_two(false)"
              ><Help
            /></el-icon>
            <el-icon
              class="like_1"
              :size="20"
              style="color: #ff5d47"
              v-else
              @click="ba_botton_two(true)"
              ><HelpFilled
            /></el-icon>
          </div>
          <div v-else>
            <RouterLink to="/login">
              <el-icon class="like_1" :size="20"><Help /></el-icon>
            </RouterLink>
          </div>
          {{ contentStats[0].content_user_like }}
        </div>
        <!-- 吧主 删除帖子，取消或加精帖子-->
        <div v-if="content.ba_user_id == $store.state.user.profile.id">
          <!-- 删除按钮 -->
          <div class="other_1">
            <el-popconfirm
              confirmButtonText="好的"
              cancelButtonText="不用了"
              icon="el-icon-info"
              iconColor="red"
              @confirm="handleDeleteRow()"
              title="您确定删除吗？"
            >
              <template #reference>
                <el-icon><Delete /></el-icon>
              </template>
            </el-popconfirm>
          </div>
          <!-- 加精帖子按钮-->
          <div class="other_2" v-if="coEssence == 0">
            <el-popconfirm
              confirmButtonText="好的"
              cancelButtonText="不用了"
              icon="el-icon-info"
              iconColor="red"
              @confirm="handlEessenceAdd()"
              title="要把这帖子加入精华榜吗？"
            >
              <template #reference>
                <!-- <el-icon ><Stamp /></el-icon> -->
                <el-icon><Coordinate /></el-icon>
              </template>
            </el-popconfirm>
          </div>
          <!-- 取消帖子加精按钮-->
          <div class="other_2" v-if="coEssence == 1">
            <el-popconfirm
              confirmButtonText="好的"
              cancelButtonText="不用了"
              icon="el-icon-info"
              iconColor="red"
              @confirm="handlEessenceDel()"
              title="从精华榜移出吗？"
            >
              <template #reference>
                <el-icon><Stamp /></el-icon>
                <!-- <el-icon><Coordinate /></el-icon> -->
              </template>
            </el-popconfirm>
          </div>
        </div>
        <!-- 小吧主用户 删除的帖子，看加精的是哪些帖子-->
        <div
          v-else-if="
            content.ba_team_ids &&
            content.ba_team_ids.includes($store.state.user.profile.id)
          "
        >
          <!-- 删除按钮 -->
          <div class="other_1">
            <el-popconfirm
              confirmButtonText="好的"
              cancelButtonText="不用了"
              icon="el-icon-info"
              iconColor="red"
              @confirm="handleDeleteRow()"
              title="您确定删除吗？"
            >
              <template #reference>
                <el-icon><Delete /></el-icon>
              </template>
            </el-popconfirm>
          </div>
          <!-- 精华按钮 只能看 -->
          <div class="other_2" v-if="content.co_essence == 1">
            <el-icon><Stamp /></el-icon>
          </div>
        </div>
        <!-- 普通用户 只能删除自己的帖子，看加精的是哪些帖子-->
        <div v-else>
          <!-- 删除按钮 -->
          <div
            class="other_1"
            v-if="content.co_user_id == $store.state.user.profile.id"
          >
            <el-popconfirm
              confirmButtonText="好的"
              cancelButtonText="不用了"
              icon="el-icon-info"
              iconColor="red"
              @confirm="handleDeleteRow()"
              title="您确定删除吗？"
            >
              <template #reference>
                <el-icon><Delete /></el-icon>
              </template>
            </el-popconfirm>
          </div>
          <!-- 精华按钮 只能看 -->
          <div class="other_2" v-if="content.co_essence == 1">
            <el-icon><Stamp /></el-icon>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
// 单个主贴的模板
import { ref } from "vue";
import {
  delContent,
  addEssenceComment,
  delEssenceComment,
  getContentStats,
  seaContentComments,
  addContentCollect,
  delContentCollect,
  seaContentLike,
  addContentLike,
  delContentLike,
} from "@/api/bas";
import { addHistoryRecord } from "@/api/user";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
export default {
  name: "DjContent",
  props: {
    content: {
      type: [Object, Array],
      default: () => ({}),
    },
    source: {
      type: String,
      default: "ba",
    },
  },
  setup(props) {
    const store = useStore();
    const content_img = ref(null);
    const content_name = ref(null);
    // 帖子显示与隐藏
    const show = ref(true);
    // 加精按钮与没有加精按钮的显示与隐藏
    const coEssence = ref(0);
    coEssence.value = props.content.co_essence;
    // 判断帖子 显示吧信息或用户信息
    if (props.source == "ba") {
      content_img.value = props.content.user_face;
      content_name.value =
        props.content.user_nickname || props.content.user_name;
    } else if (props.source == "shouye") {
      content_img.value = props.content.ba_img;
      content_name.value = props.content.ba_name;
    }
    // 获取主贴点赞数量 收藏数量 评论数量
    const contentStats = ref(null);
    getContentStats(props.content.id).then((data) => {
      if (data.meta.status !== 200)
        return ElMessage.error("获取主贴点赞数量 收藏数量 评论数量失败");
      contentStats.value = data.data;
    });
    // 收藏显示与隐藏
    const like_show_2 = ref(true);
    seaContentComments({
      contentid: props.content.id,
      userid: store.state.user.profile.id,
    }).then((data) => {
      if (data.meta.status == 200) like_show_2.value = false;
    });
    // 收藏按钮
    const ba_botton = (val) => {
      if (val) {
        if (store.state.user.profile.token) {
          delContentCollect({
            contentid: props.content.id,
            userid: store.state.user.profile.id,
          }).then((data) => {
            if (data.meta.status !== 200)
              return ElMessage.error("取消收藏失败");
            ElMessage({ message: "取消收藏成功", type: "success" });
            contentStats.value[0].content_user -= 1;
          });
        }
      } else {
        addContentCollect({
          contentid: props.content.id,
          userid: store.state.user.profile.id,
        }).then((data) => {
          if (data.meta.status !== 200) return ElMessage.error("加入收藏出错");
          ElMessage({ message: "收藏成功", type: "success" });
          contentStats.value[0].content_user += 1;
        });
      }
      like_show_2.value = val;
    };
    // 点赞显示与隐藏
    const like_show_3 = ref(true);
    seaContentLike({
      contentid: props.content.id,
      userid: store.state.user.profile.id,
    }).then((data) => {
      if (data.meta.status == 200) like_show_3.value = false;
    });
    // 点赞按钮
    const ba_botton_two = (reval) => {
      if (reval) {
        if (store.state.user.profile.token) {
          delContentLike({
            contentid: props.content.id,
            userid: store.state.user.profile.id,
          }).then((data) => {
            if (data.meta.status !== 200)
              return ElMessage.error("取消点赞失败");
            contentStats.value[0].content_user_like -= 1;
          });
        }
      } else {
        addContentLike({
          contentid: props.content.id,
          userid: store.state.user.profile.id,
        }).then((data) => {
          if (data.meta.status !== 200) return ElMessage.error("加入点赞出错");
          contentStats.value[0].content_user_like += 1;
        });
      }
      like_show_3.value = reval;
    };
    // 删除主帖
    const handleDeleteRow = () => {
      delContent(props.content.id).then((data) => {
        if (data.meta.status !== 200) return ElMessage.error("删除帖子失败");
        ElMessage({ message: "删除帖子成功", type: "success" });
        show.value = false;
      });
    };
    // 加精主帖
    const handlEessenceAdd = () => {
      addEssenceComment(props.content.id).then((data) => {
        if (data.meta.status !== 200) return ElMessage.error("加精帖子失败");
        ElMessage({ message: "加精帖子成功", type: "success" });
        coEssence.value = 1;
      });
    };
    // 取消加精
    const handlEessenceDel = () => {
      delEssenceComment(props.content.id).then((data) => {
        if (data.meta.status !== 200)
          return ElMessage.error("取消加精帖子失败");
        ElMessage({ message: "取消加精帖子成功", type: "success" });
        coEssence.value = 0;
      });
    };
    // 用户浏览记录添加
    const content_click = () => {
      if (store.state.user.profile.token) {
        addHistoryRecord({
          userid: store.state.user.profile.id,
          contentid: props.content.id,
        }).then((data) => {
          if (data.meta.status !== 200)
            return ElMessage.error("添加浏览记录失败");
        });
      }
    };
    return {
      content_click,
      handleDeleteRow,
      show,
      handlEessenceAdd,
      coEssence,
      handlEessenceDel,
      contentStats,
      like_show_2,
      like_show_3,
      ba_botton,
      ba_botton_two,
    };
  },
};
</script>

<style lang='less' scoped>
.item_left_left {
  display: flex;
  flex-direction: column;
}
.ad {
  position: relative;
}
.ad :deep(.el-card__body) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 114px;
}
.body_item {
  .item_left {
    display: flex;
    // flex: 1;
    float: left;
    width: 70%;
    min-height: 96px;
    max-height: 230px;
    flex-direction: column;
    justify-content: space-between;
    .item_title {
      font-size: 20px;
      font-weight: bold;
      max-height: 28px;
      overflow: hidden;
      display: -webkit-box;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }
    .item_content {
      display: flex;
      flex-direction: column;
      margin-left: 10px;
      .item_img {
        display: flex;
        max-height: 130px;
      }
      .item_text {
        max-height: 50px;
        left: 10px;
        bottom: 10px;
        margin: 4px 0;
        font-size: 18px;
        overflow: hidden;
        display: -webkit-box;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      .block {
        margin-right: 10px;
        display: flex;
        flex: 1;
        // float: left;
        // width: 20%;
        box-sizing: border-box;
        vertical-align: top;
      }
    }
    .item_time {
      color: #8f8b8b;
      font-size: 7px;
      color: #8f8b8b;
    }
  }
  .item_right {
    float: right;
    width: 200px;
    align-items: center;
    min-height: 96px;
    justify-content: space-between;
    display: flex;
    flex-direction: column;
    .like {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 10px;
      .like_1 {
        margin: 10px;
        text-align: center;
      }
    }
    .other_1 {
      position: absolute;
      bottom: 4px;
      right: 8px;
    }
    .other_2 {
      position: absolute;
      right: 8px;
      top: 8px;
    }
    .item_right_top {
      display: flex;
      align-items: center;
    }
    .image {
      width: 45px;
      height: 45px;
      overflow: hidden;
      border-radius: 50%;
    }
    .user_name {
      margin-left: 6px;
      a {
        max-width: 90px;
        overflow: hidden;
        display: -webkit-box;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        text-align: center;
      }
    }
  }
}
</style>