<template>
   <!-- 内容 -->
    <div class="body_item"  >
        <div class="body_1">
            <div class="user_info">
                <!-- 头像 -->
                <div class="avatar">
                    <!-- 人头像 -->
                    <RouterLink :to="bodys.id==$store.state.user.profile.id?`/member`:`/user/${bodys.id}`"  v-if="ba">
                        <div class="avatar_1">
                            <img :src="bodys.face" alt="">
                        </div>
                    </RouterLink>
                    <!-- 吧头像 -->
                    <RouterLink :to="`/bas/item/${bodys.id}`" v-else>
                        <div class="avatar_1" >
                            <img :src="bodys.img" alt="">
                        </div>
                    </RouterLink>
                </div>
                <!-- 基本信息 -->
                <div class="user_basic">
                    <div class="user_basic_top">
                        <!-- 人名 -->
                        <RouterLink :to="bodys.id==$store.state.user.profile.id?`/member`:`/user/${bodys.id}`"  v-if="ba">
                            <span class="user_basic_top_1">{{bodys.nickname||bodys.username}}</span>
                        </RouterLink>
                        <!-- 吧名 -->
                        <RouterLink :to="`/bas/item/${bodys.id}`" v-else>
                            <span class="user_basic_top_1">{{bodys.name}}</span>
                        </RouterLink>
                        <!-- 图标 -->
                        <span class="user_basic_top_2"></span>
                    </div>
                    <div class="user_basic_bottom">
                        <div style="color: #6d757a;"  v-if="bodys.signature">
                            <span>{{bodys.signature}}</span>
                        </div>
                        <span v-else style="color:#d6dee4">
                            <div v-if="ba">编辑个人签名</div>
                            <div v-else>吧没有简介</div>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="body_2" v-if="!fan">
            <div v-if="ba">
                <el-button type="danger" v-if="user_show" @click="user_botton(false)">关注</el-button>
                <el-button type="info" v-else @click="user_botton(true)">已关注</el-button>
            </div>
            <div v-else>
                <el-button type="info" v-if="fan_show" @click="fan_botton(false)">已关注</el-button>
                <el-button type="danger" v-else @click="fan_botton(true)">关注</el-button>
            </div>
        </div>
    </div>
</template>

<script>
// 个人中心关注，粉丝，吧
import {ref} from 'vue'
import {addbaCollect,delbaCollect} from '@/api/bas';
import {addLike,delLike} from '@/api/user'
import {useStore} from 'vuex'
import {ElMessage} from 'element-plus'
export default {
    name:'memberreadonlybody',
    props:{
        bodys:{
            type:Object,
            default:()=>({})
        },
        fan:{
            type:String,
            default:''
        },
        ba:{
            type:Boolean,
            default:true
        }
    },
    setup(props){
        // console.log(props.bodys);
        const store=useStore()
        const fan_show=ref(true)
        const userid=store.state.user.profile.id
        // 关注吧按钮的切换
        const fan_botton=(val)=>{
            if(val){
                addbaCollect({baid:props.bodys.id,userid:userid}).then(data=>{
                    if(data.meta.status!==200) return ElMessage.error('关注失败')
                    ElMessage({message: '关注成功',type: 'success',})
                })
            }else{
                delbaCollect({baid:props.bodys.id,userid:userid}).then(data=>{
                    if(data.meta.status!==200) return ElMessage.error('取消关注失败')
                    ElMessage('取消关注成功')
                })
            }
            fan_show.value=val
        }
        // 默认关注用户按钮的显示
        const user_show=ref(false)
        // 关注用户按钮的切换
        const user_botton=(val)=>{
            if(val){
                delLike({memberid:props.bodys.id,userid:store.state.user.profile.id}).then(data=>{
                    if(data.meta.status!==200) return ElMessage.error('取消关注失败')
                    ElMessage({message: '取消关注成功',type: 'success',})
                })
            }else{
                addLike({memberid:props.bodys.id,userid:store.state.user.profile.id}).then(data=>{
                    if(data.meta.status!==200) return ElMessage.error('关注失败')
                    ElMessage({message: '关注成功',type: 'success',})
                })
            }
            user_show.value=val
        }
        return{fan_show,fan_botton,user_show,user_botton}
    }
}
</script>

<style scoped lang="less">
.body_item{
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin: 10px 0 10px 0;
            border-bottom: 1px solid #e5e9ef;
            .body_1{
                line-height: 16px;
                color: #9499a0;
                 .user_info{
            display: flex;
            align-items: center;
            margin-left: 20px;
            padding-bottom: 16px;
            .avatar{
                position: relative;
                .avatar_1{
                    width: 64px;
                    height: 64px;
                    img{
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        border: 1px solid #d6dee4;
                    }
                }
                }
                        .user_basic{
                            color: rgb(251, 114, 153);
                            font-size: 0;
                            margin-left: 22px;
                            line-height: 30px;
                            .user_basic_top{
                                .user_basic_top_1{
                                    color: rgb(251, 114, 153);
                                    display: inline-block;
                                    margin-right: 5px;
                                    font-weight: 700;
                                    line-height: 18px;
                                    font-size: 18px;
                                    vertical-align: middle;
                                }
                                .user_basic_top_2{
                                    width: 21px;
                                    height: 18px;
                                    margin-right: 5px;
                                }
                            }
                            .user_basic_bottom{
                                // margin-top: 6px;
                                height: 26px;
                                margin-top: 6px;
                                // color: #fff;
                                font-size: 12px;
                                a{
                                    color: rgb(109, 117, 122);
                                }
                                // font-size: 12px;
                            }
                        }
                    }
            }
            .body_2{
                line-height: 16px;
                color: #6d757a;
                font-size: 12px;
                display: flex;
                align-items :center;
            }
        }
</style>