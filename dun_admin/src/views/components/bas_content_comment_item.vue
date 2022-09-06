<template>
    <div class="comment" v-if="show">
        <!-- 标题 -->
        <!-- 主贴功能 -->
        <div class="comment_top" v-if="titletop">
            {{titletop}}
            <div class="comment_top_right">
                 <!--主贴 评论 收藏 点赞 -->
                <div class="like" v-if="contentStats">
                    <!-- 修改内容 -->
                    <el-button type="primary"  @click="dialogVisible = true">修改</el-button>
                    <!-- 切换排序 -->
                    <el-button plain @click="toggle_sort()">
                        <el-icon ><Sort /></el-icon>
                    </el-button>
                    <!-- 隐藏主贴 -->
                    <el-button round @click="content_main_show=!content_main_show">隐藏</el-button>
                    <!-- 评论 -->
                    <el-icon class="like_1" :size="20"><ChatDotSquare /></el-icon>
                    {{contentStats[0].content_s}}
                    <!-- 收藏 -->
                    <el-icon class="like_1" :size="20" ><Star /></el-icon>
                    {{contentStats[0].content_user}}
                    <!-- 点赞 -->
                    <el-icon class="like_1" :size="20" ><Help /></el-icon>
                    {{contentStats[0].content_user_like}}
                </div>
            </div>
        </div>
        <!-- 从贴内容 -->
        <div class="comment_bottom" v-if="content_main_show">
            <div class="bottom_main">
                <!-- 头像 -->
                <div class="bottom_avatar">
                    <img :src="content.user_face" alt="">
                    <span v-if="!titletop">{{content.floor_num}}楼</span>
                    <span v-if="content.user_id==landlord">
                        <el-button size="small" color="#2d64b3" @click="landlord_button()">楼主</el-button>
                    </span>
                </div>
                <!-- 名字+时间 -->
                <div class="bottom_header">
                    <div class="bottom_header_title">
                        {{content.user_nickname||content.user_name}}
                    </div>
                    <div class="bottom_header_time">{{content.add_time}}</div>
                </div>
            <!-- 内容 -->
            <div class="bottom_text">
                <div class="bottom_text_text">
                    {{content.content}}
                </div>
            </div>
            <!-- 图片内容 -->
            <div class="item_img" v-if="content.img" >
                <span class="block" v-for="(item,i) in content.img.slice(0,4)" :key="i">
                    <el-image :src="item" 
                    :preview-src-list="content.img"
                    fit="cover"
                    lazy
                    close-on-press-escape:true
                    />
                    <!-- 图片出错显示 -->
                    <!-- <el-image>
                        <template #error>
                            <div class="image-slot"><el-icon><picture /></el-icon></div>
                        </template>
                    </el-image> -->
                </span>
            </div>
            <!-- 从贴点赞+收藏+详情 -->
            <div class="bottom_footer" v-if="!admincontent">
                <!-- 回复 -->
                <div class="bottom_footer_action">
                    <div class="action"  v-if="commentStats">
                        <el-icon class="active_1" :size="20"><ChatDotSquare /></el-icon>
                        {{commentStats.comment_s_s}}
                    </div>
                </div>
                <!-- 点赞 -->
                <div class="bottom_footer_action" v-if="commentStats">
                    <!-- 点赞 -->
                    <div class="action">
                        <el-icon class="active_1" :size="20"><Help /></el-icon>
                        {{commentStats.comment_s_user_like}}
                    </div>

                </div>
            </div>
            <div v-if="!admincontent">
                <!-- 评论 -->
                <div>
                    <BasContentCommentItemText :commentid='content.id'/>
                </div>
            </div>
             <!-- 删除帖子，取消或加精帖子-->
            <div>
                <!-- 删除按钮 -->
                <!-- 如果是主贴 -->
                <div class="other_1" v-if="titletop">
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
                <!-- 如果是从贴 -->
                <div class="other_1" v-else>
                    <el-popconfirm
                        confirmButtonText='好的'
                        cancelButtonText='不用了'
                        icon="el-icon-info"
                        iconColor="red"
                        @confirm="handleDeleteRowTwo()"
                        title="您确定删除吗？"
                        >
                        <template #reference>
                        <el-icon><Delete /></el-icon>
                        </template>
                    </el-popconfirm>
                </div>
                 <!-- 加精帖子按钮-->
                <div class="other_2" v-if="titletop && coEssence==0" >
                    <el-popconfirm
                        confirmButtonText='好的'
                        cancelButtonText='不用了'
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
                <div class="other_2" v-if="titletop && coEssence==1" >
                    <el-popconfirm
                        confirmButtonText='好的'
                        cancelButtonText='不用了'
                        icon="el-icon-info"
                        iconColor="red"
                        @confirm="handlEessenceDel()"
                        title="从精华榜移出吗？"
                        >
                        <template #reference>
                        <el-icon><Stamp /></el-icon>
                        </template>
                    </el-popconfirm>
                </div>
            </div>
      </div>
  </div>
    </div>
    <!-- 弹出框 -->
     <el-dialog
        v-model="dialogVisible"
        title="贴吧信息"
        width="600px"
        :before-close="handleClose"
        >
        <BaContentItemSubmit :subcontent='content'/>
    </el-dialog>
</template>

<script>
// 从贴
import {ref,reactive,watch} from 'vue';
import BasContentCommentItemText from './bas_content_comment_item_text.vue';
import {getContentCommentStats} from '@/api/ba';
import {useStore} from 'vuex'
import BaContentItemSubmit from './ba_content_item_submit.vue';
import {
    delContentComment,
    delContent,
    addEssenceComment,
    delEssenceComment,
    getContentStats,
    } from '@/api/ba';
import { ElMessage } from 'element-plus'
import {useRouter} from 'vue-router';
export default {
    name:'bascontentcommentitem',
    components:{BasContentCommentItemText,BaContentItemSubmit},
    props:{
        content:{
            type:[Object,Array],
            default:()=>({})
        },
        titletop:{
            type:String,
            default:''
        },
        landlord:{
            type:Number,
            default:0
        },
        content_show:{
            type:Boolean,
            default:true
        }
    },
    emits:['toggle_sort','toggle_show_landlord'],
    setup(props,{emit}){
        const dialogVisible=ref(false)
        const admincontent=ref(false)
        const store=useStore()
        const router=useRouter()
        const content_main_show=ref(true)
        watch(()=>props.content_show,(newVal)=>{
            //   结构和样式同时加上无过渡效果，需要些延时
            setTimeout(()=>{
            content_main_show.value=newVal
            },0)
        },{immediate:false})
        // 切换从贴排序方式
        var content_sort=false
        const toggle_sort=()=>{
            content_sort=!content_sort
            emit('toggle_sort',content_sort)
        }
        // 切换是否显示楼主发言的从贴
        var show_landlord=false
        const landlord_button=()=>{
            show_landlord=!show_landlord
            emit('toggle_show_landlord',show_landlord)
        }
         // 关闭修改贴吧弹出框
        const handleClose = () => {
            dialogVisible.value = false
        }
        // 帖子显示与隐藏
        const show=ref(true)
        const addinfo=reactive({
            userid:store.state.user.profile.id,
            fatherid:props.content.id,
            postid:props.content.postid,
            mainid:props.content.father_id
        })
         // 获取主贴点赞数量 收藏数量 评论数量
         // 获取从贴点赞数量 评论数量
        const contentStats=ref(null)
        const commentStats=ref(null)
        if(props.titletop){
            getContentStats(props.content.id).then(data=>{
                if(data.meta.status!==200) return ElMessage.error('获取主贴点赞数量 收藏数量 评论数量失败')
                contentStats.value=data.data 
            })
        }else{
             getContentCommentStats(props.content.id).then(data=>{
                if(data.meta.status!==200) return ElMessage.error('获取从贴点赞数量 评论数量失败')
                commentStats.value=data.data[0]
            })
        }
        // 主贴加精按钮与没有加精按钮的显示与隐藏
        const coEssence=ref(0)
        if(props.titletop)coEssence.value=props.content.co_essence
              // 删除从帖
        const handleDeleteRowTwo=()=>{
            delContentComment(props.content.id).then(data=>{
                if(data.meta.status!==200) return ElMessage.error('删除帖子失败')
                ElMessage({message: '删除帖子成功',type: 'success',})
                show.value=false
            })
        }
             // 删除主贴
        const handleDeleteRow=()=>{
            delContent(props.content.id).then(data=>{
                if(data.meta.status!==200) return ElMessage.error('删除帖子失败')
                ElMessage({message: '删除帖子成功',type: 'success',})
                router.push(`/bas/item/${props.content.ba_id}`)
            })
        }
                // 加精主帖
        const handlEessenceAdd=()=>{
            addEssenceComment(props.content.id).then(data=>{
                if(data.meta.status!==200) return ElMessage.error('加精帖子失败')
                ElMessage({message: '加精帖子成功',type: 'success',})
                coEssence.value=1
            })
        }
         // 取消加精
        const handlEessenceDel=()=>{
            delEssenceComment(props.content.id).then(data=>{
                if(data.meta.status!==200) return ElMessage.error('取消加精帖子失败')
                ElMessage({message: '取消加精帖子成功',type: 'success',})
                coEssence.value=0
            })
        }
        admincontent.value=props.titletop
        return {
            admincontent,
            coEssence,
            addinfo,
            handlEessenceDel,
            handlEessenceAdd,
            handleDeleteRow,
            handleDeleteRowTwo,
            show,
            contentStats,
            commentStats,
            handleClose,
            dialogVisible,
            content_main_show,
            toggle_sort,
            landlord_button
        }
    }
}
</script>

<style lang='less' scoped>
.comment{
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 10px;
    border: 1px solid #eee;
    padding-bottom: 6px;
    .comment_top{
        position: relative;
        width: 100%;
        align-items: center;
        display: flex;
        font-size: 16px;
        height: 45px;
        font-weight: bold;
        padding: 0 14px;
        border-bottom: 1px solid #eee;
        .comment_top_right{
            position: absolute;
            top: 4px;
            right: 12px;
            .like{
                display: flex;
                justify-content:center;
                align-items: center;
                font-size: 14px;
                font-weight: normal;
                .like_1{
                    margin: 10px;
                    text-align:center;
                }
            }
        }
    }
    .comment_bottom{
        position: relative;
        .bottom_main{
            padding: 0 30px 0 88px;
            position: relative;
            .bottom_avatar{
                height: 48px;
                left: 24px;
                position: absolute;
                top: 24px;
                width: 48px;
                border-radius: 50%;
                border: 1px solid #d2dae7;
                img{
                    border-radius: 50%;
                    width: 100%;
                    height: 100%;
                }
                span{
                    margin-top: 10px;
                    display: flex;
                    justify-content :center;
                    color: #99a2aa;
                }
            }
            .other_1{
                position: absolute;
                bottom: -4px;
                right: 8px
            }
            .other_2{
                position: absolute;
                top: 8px;
                right: 8px
            }
        }
        .bottom_header{
            height: 73px;
            padding-top: 27px;
            .bottom_header_title{
                align-items: center;
                display: flex;
                height: 24px;
                color: #222;
                font-size: 16px;
                color: rgb(251, 114, 153);
                font-weight: bolder;
            }
            .bottom_header_time{
                color: #99a2aa;
                font-size: 12px;
                height: 22px;
                line-height: 18px;
                padding-top: 4px;
            }
        }
        .bottom_text{
                margin-top: 10px;
            .bottom_text_text{
                font-size: 14px;
                letter-spacing: .5px;
                line-height: 22px;
                white-space: pre-wrap;
            }
            
        }
        .item_img{
            display: flex;
            flex-wrap :wrap;
            flex-direction: column;
                .block{
                    margin-right: 10px;
                    display: flex;
                    float: left;
                    width: 45%;
                    margin-bottom: 10px;
                    box-sizing: border-box;
                    vertical-align: top;
                }
            }
        .bottom_footer{
            display: flex;
            height: 40px;
            .bottom_footer_action{
                position: relative;
                .action{
                    align-items: center;
                    display: flex;
                    font-size: 12px;
                    height: 100%;
                    position: relative;
                    width: 50px;
                    a{
                        align-items: center;
                        display: flex;
                    }
                    .active_1{
                            margin-right: 4px;
                        }
                    
                }
            }
        }
    }
}
</style>