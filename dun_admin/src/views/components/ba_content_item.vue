<template>

<div class="ad" v-if="show">
  <el-card :body-style="{ padding: '10px' }" class="body_item" shadow="hover">
      <!-- 左 -->
    <div class="item_left">
        <div class="item_left_left">
            <!-- 标题 -->
            <div class="item_title">
                {{content.title}}
            </div>
            <!-- 内容 -->
            <div class="item_content">
                <!-- 文字内容 -->
                <span class="item_text">
                    {{content.content}}
                </span>
                <!-- 图片内容 -->
                <div class="item_img" v-if="content.img" >
                    <span class="block" v-for="(item,i) in content.img.slice(0,4)" :key="i">
                        <el-image :src="item" 
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
            {{content.add_time}}
        </div>
    </div>
    <!-- 修改 -->
    <div>
        <el-button type="primary"  @click="dialogVisible = true">修改</el-button>
        <el-button type="success"   @click="routerto()">详情</el-button>
    </div>
    <!-- 右 -->
    <div class="item_right">
        <!-- 用户头像-名字 -->
        <div class="item_right_top">
            <img :src="content_img" class="image">
            <span class="user_name">
                {{content_name}}
            </span>
        </div>
        <!-- 评论 收藏 点赞 -->
        <div class="like" v-if="contentStats">
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
        <!-- 删除帖子-->
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
            <!-- 加精帖子按钮-->
            <div class="other_2" v-if="coEssence==0" >
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
            <div class="other_2" v-if="coEssence==1" >
                <el-popconfirm
                    confirmButtonText='好的'
                    cancelButtonText='不用了'
                    icon="el-icon-info"
                    iconColor="red"
                    @confirm="handlEessenceDel()"
                    title="从精华榜移出吗？"
                    >
                    <template #reference>
                    <el-icon ><Stamp /></el-icon>
                    <!-- <el-icon><Coordinate /></el-icon> -->
                    </template>
                </el-popconfirm>
            </div>
       </div>
    </div>
</el-card>
</div>
<!-- 弹出框 -->
     <el-dialog
        v-model="dialogVisible"
        title=" 帖子信息"
        width="600px"
        :before-close="handleClose"
        >
        <BaContentItemSubmit :subcontent='content'/>
    </el-dialog>
</template>

<script>
// 单个主贴的模板
import {ref} from 'vue';
import {delContent,getContentStats,addEssenceComment,delEssenceComment} from '@/api/ba';
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import {useRouter} from 'vue-router';
import BaContentItemSubmit from './ba_content_item_submit.vue';
export default {
    name:'bacontentitem',
    components:{BaContentItemSubmit},
    props:{
        content:{
            type:[Object,Array],
            default:()=>({})
        },
        source:{
            type:String,
            default:'ba'
        }
    },
    setup(props){
        // console.log(props.source);
        const router=useRouter()
        const dialogVisible=ref(false)
        const store=useStore()
        const content_img=ref(null)
        const content_name=ref(null)
        // 关闭修改贴吧弹出框
        const handleClose = () => {
            dialogVisible.value = false
        }
        // 帖子显示与隐藏
        const show=ref(true)
        // 加精按钮与没有加精按钮的显示与隐藏
        const coEssence=ref(0)
        coEssence.value=props.content.co_essence
        // 显示吧信息或用户信息
        if(props.source=='ba'){
            content_img.value=props.content.user_face
            content_name.value=props.content.user_nickname||props.content.user_name
        }else if(props.source=='shouye'){
            content_img.value=props.content.ba_img
            content_name.value=props.content.ba_name
        }
        // 获取主贴点赞数量 收藏数量 评论数量
        const contentStats=ref(null)
        getContentStats(props.content.id).then(data=>{
            if(data.meta.status!==200) return ElMessage.error('获取主贴点赞数量 收藏数量 评论数量失败')
            contentStats.value=data.data
            // console.log(contentStats.value);
        })
        // 删除主帖
        const handleDeleteRow=()=>{
            delContent(props.content.id).then(data=>{
                if(data.meta.status!==200) return ElMessage.error('删除帖子失败')
                ElMessage({message: '删除帖子成功',type: 'success',})
                show.value=false
            })
        }
        // 加精主帖
        const handlEessenceAdd=()=>{
            addEssenceComment(props.content.id).then(data=>{
                // console.log(data);
                if(data.meta.status!==200) return ElMessage.error('加精帖子失败')
                ElMessage({message: '加精帖子成功',type: 'success',})
                coEssence.value=1
            })
        }
         // 取消加精
        const handlEessenceDel=()=>{
            delEssenceComment(props.content.id).then(data=>{
                // console.log(data);
                if(data.meta.status!==200) return ElMessage.error('取消加精帖子失败')
                ElMessage({message: '取消加精帖子成功',type: 'success',})
                coEssence.value=0
            })
        }
        const routerto=()=>{
            router.push(`/home/ba/content/${props.content.ba_id}/${props.content.id}`)
        }
        return{handleDeleteRow,show,coEssence,contentStats,handlEessenceAdd,handlEessenceDel,handleClose,dialogVisible,routerto,content_img,content_name}
    }
}
</script>

<style lang='less' scoped>
.item_left_left{
    display: flex;
    flex-direction: column;
    
}
.ad{
    position: relative;
}
.ad :deep(.el-card__body){
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 114px;
}
.body_item{
    .item_left{
        display: flex;
        float: left;
        width: 50%;
        min-height: 96px;
        max-height: 230px;
        flex-direction:column;
        justify-content:space-between;
        .item_title{
            font-size: 20px;
            font-weight: bold;
            max-height: 28px;
            overflow: hidden;
            display: -webkit-box;
            text-overflow: ellipsis;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
        }
        .item_content{
            display: flex;
            flex-direction: column;
            margin-left: 10px;
            .item_img{
                display: flex;
                max-height: 130px;
            }
            .item_text{
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
            .block{
                margin-right: 10px;
                display: flex;
                flex: 1;
                box-sizing: border-box;
                vertical-align: top;
            }
        }
        .item_time{
            color: #8f8b8b;
            font-size: 7px;
            color: #8f8b8b;
        }
        
    }
    .item_right{
        float: right;
        width: 200px;
        align-items: center;
        min-height: 96px;
        justify-content:space-between;
        display: flex;
        flex-direction: column;
        .like{
            display: flex;
            justify-content:center;
            align-items: center;
            padding-top: 10px;
            .like_1{
                margin: 10px;
                text-align:center;
            }
        }
        .other_1{
            position: absolute;
            bottom: 4px;
            right: 8px
        }
        .other_2{
            position: absolute;
            right: 8px;
            top: 8px; 
        }
        .item_right_top{
            display: flex;
            align-items: center;
        }
        .image{
            width: 45px;
            height: 45px;
            overflow: hidden;
            border-radius: 50%;
        }
        .user_name{
            margin-left: 6px;
            max-width: 90px;
            overflow: hidden;
            display: -webkit-box;
            text-overflow: ellipsis;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            text-align:center
        }
    }
    
   
}
</style>