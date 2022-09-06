<template>
    <div class="bottom_main" v-if="comments && mainshow">
        <!-- 头像 -->
        <div class="bottom_avatar">
          <img :src="comments.user_face" alt="">
        </div>
        <div class="bottom_top">
          <div class="username">
            <div class="username_1">
              {{comments.user_nickname||comments.user_name}}
            </div>
            <!-- 评论@的人 -->
            <span v-if="!comments.respond_id==''" class="username_respond">
                <div class="username_respond_a">
                  <el-icon class="username_respond_icon" ><Sugar /></el-icon>
                {{respond_info.nickname||respond_info.username}}
                </div>
            </span>
            <span class="username_text">
              {{comments.content}}
            </span>
          </div>
        </div>
        <!-- 时间+回复 -->
        <div class="bottom_bottom">
          <span>{{comments.add_time}}</span>
          <span>
            <div class="action" >
              <el-icon class="active_1" :size="20"><ChatDotSquare /></el-icon>
            </div>
          </span>
        </div>
        <!-- 删除帖子 -->
        <div>
            <!-- 删除按钮 -->
            <div class="other_1">
                <el-popconfirm
                    confirmButtonText='好的'
                    cancelButtonText='不用了'
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
       </div>
    </div>
</template>

<script>
// 从贴的评论的单个
import {ref,reactive} from 'vue';
import {useStore} from 'vuex'
import {userSearch} from '@/api/user';
import {DelContentComments} from '@/api/ba';
import { ElMessage } from 'element-plus'
export default {
    name:'bascontentcommentitemtext',
    props:{
      comments:{
        type:Object,
        default:[]
      }
    },
    setup(props){
      // console.log(props.comments);
       const store=useStore()
       const mainshow=ref(true)
        // 获取回复id的名字
        const respond_info=ref([])
        if(props.comments.respond_id){
            userSearch(props.comments.respond_id).then(data=>{
            respond_info.value=data.data
            // console.log(respond_info.value);
          })
        }
        // 删除从贴的评论
        const handleDeleteRow=()=>{
            DelContentComments(props.comments.id).then(data=>{
                if(data.meta.status!==200) return ElMessage.error('删除帖子的评论失败')
                ElMessage({message: '删除帖子的评论成功',type: 'success',})
                mainshow.value=false
            })
        }
        return {respond_info,handleDeleteRow,mainshow}
    }
}
</script>

<style lang='less' scoped>
    .bottom_main{
      padding: 10px 0;
      position: relative;
      background-color:#f7f8fa;
      .bottom_avatar{
          height:24px;
          position: absolute;
          width: 24px;
          border-radius: 50%;
          border: 1px solid #d2dae7;
          img{
              border-radius: 50%;
              width: 100%;
              height: 100%;
          }
      }
      .bottom_top{
        margin-left: 34px;
        display: inline-block;
        .username{
          font-size: 12px;
          font-weight: bold;
          line-height: 18px;
          padding-bottom: 4px;
          display: flex;
          position: relative;
          .username_1{
            color: #FB7299;
            margin-right: 12px;
            display: flex;
              align-items: center;
          }
          .username_respond{
            margin-right: 10px;
            display: flex;
            .username_respond_a{
              color: #008ac5;
              font-size: 12px;
              display: flex;
              align-items: center;
              .username_respond_icon{
                margin-right: 4px;
                color: red;
              }
            }
          }
          .username_2{
            margin-left: 8px;
          }
          .username_text{
            font-weight: normal;
            font-size: 13px;
            line-height: 20px;
            white-space: pre-wrap;
            display: flex;
            align-items: center;
            flex: 1;
          }
        }
      }
      .bottom_bottom{
        margin-left: 34px;
        color: #99a2aa;
        line-height: 14px;
        margin-top: 6px;
        font-size: 12px;
        display: flex;
        span{
          margin-right: 20px;
          .active_1{
            width: 14px;
            height: 14px;
            margin-right: 5px;
          }
        }
      }
      .other_1{
        position: absolute;
        top: 40px;
        left: 4px;
      }
    }

</style>