<template>
  <div class="aside_bottom">
    <!--标题 -->
    <h3>{{ hot_title }}</h3>
    <!-- 内容 -->
    <ul v-if="content.length > 0">
      <li
        :style="{ background: i % 2 == 0 ? '#f6f7f8' : '#fff' }"
        v-for="(item, i) in content.slice(0, 10)"
        :key="i"
      >
        <div class="aside_bottom_1">
          <div class="aside_bottom_2">
            <RouterLink
              :to="`/bas/item/${item.ba_id}/${item.id}`"
              @click="button(item.id)"
              :title="item.title"
            >
              {{ item.title }}
            </RouterLink>
          </div>
          <!-- <div class="aside_bottom_num">
                        {{content.num}}
                    </div> -->
        </div>
      </li>
    </ul>
    <ul v-else>
      <li class="aside_bottom_3">信息缺少</li>
    </ul>
  </div>
</template>

<script>
// 榜单模板
import { inject } from "vue";
import { ref } from "vue";
import { addHistoryRecord } from "@/api/user";
import { getContentStats } from "@/api/bas";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
export default {
  name: "bas_essence",
  props: {
    hot_title: {
      type: String,
      default: "",
    },
    content: {
      type: [Array, Object],
      default: () => ({}),
    },
  },
  setup(props) {
    const store = useStore();
    const ceshi = inject("reload");
    // const num=ref([])
    // for(let i=0;i<props.content.length;i++){
    //     getContentStats(props.content[i].id).then(data=>{
    //         num.value.push(data.data)
    //     })
    // }
    const button = (val) => {
      // 用户浏览记录添加
      if (store.state.user.profile.token) {
        addHistoryRecord({
          userid: store.state.user.profile.id,
          contentid: val,
        }).then((data) => {
          if (data.meta.status !== 200)
            return ElMessage.error("用户浏览记录添加失败");
        });
      }
      ceshi();
    };
    return { button };
  },
};
</script>

<style lang='less' scoped>
.aside_bottom {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 10px 0 0 0;
  padding: 7px;
  h3 {
    margin: 10px;
  }
  ul {
    flex: 1;
    li {
      height: 40px;
      width: 100%;
      .aside_bottom_1 {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        height: 100%;
        .aside_bottom_2 {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-direction: column;
          min-width: 0;
          flex: 1;
          letter-spacing: 2px;
          a {
            padding-left: 10px;
            overflow: hidden;
            display: -webkit-box;
            text-overflow: ellipsis;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
          }
        }
        .aside_bottom_num {
          margin-right: 10px;
          color: #939393;
        }
      }
    }
  }
  .aside_bottom_3 {
    background: #f6f7f8;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: bold;
    letter-spacing: 4px;
    color: #939393;
    user-select: none;
  }
}
</style>