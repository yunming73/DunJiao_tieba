<template>
    <div class="body_item" v-if="main_show">
        <!--  -->
        <div class="body_1">
            <div class="user_info">
                <!-- 头像 -->
                <div class="avatar">
                    <!-- 人头像 -->
                    <RouterLink :to="bodys.user_id==$store.state.user.profile.id?`/member`:`/user/${bodys.user_id}`">
                        <div class="avatar_1">
                            <img :src="bodys.user_face" alt="">
                        </div>
                    </RouterLink>
                </div>
                <!-- 基本信息 -->
                <div class="user_basic">
                    <div class="user_basic_top">
                        <!-- 人名 -->
                        <RouterLink :to="bodys.user_id==$store.state.user.profile.id?`/member`:`/user/${bodys.user_id}`">
                            <span class="user_basic_top_1">{{bodys.user_nickname||bodys.user_name}}</span>
                        </RouterLink>
                        <!-- 图标 -->
                        <span class="user_basic_top_2"></span>
                    </div>
                    <div class="user_basic_bottom">
                        <!-- <div>123</div> -->
                        <div style="color: #6d757a;" >
                            <span><p>申请时间&nbsp;&nbsp;:</p>
                                {{bodys.add_time}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 内容 -->
        <div class="body_1_middle">
            <el-scrollbar v-if="bodys.content">
                 {{bodys.content}}
            </el-scrollbar>
            <el-scrollbar v-else style="color: rgb(159 173 181);">
                没有想说的话
            </el-scrollbar>
        </div>
        <!-- 操作区域按钮 -->
        <div class="body_2">
            <div v-if="create">创建贴吧</div>
            <div v-else>加入吧务</div>

            <div class="body_2_text" v-if="create">
                {{bodys.ba_name}}
            </div>
            <RouterLink :to="`/bas/item/${bodys.post_id}`" v-else>
                <div class="body_2_text">{{bodys.ba_name}}贴吧</div>
            </RouterLink>

            <!-- 用户看自己发的申请 -->
            <div v-if="own">
                <div v-if="user_show">
                    <el-button type="danger" class="body_2_button"  @click="own_ba_botton()" v-if="create">撤销</el-button>
                    <el-button type="danger" class="body_2_button"  @click="own_botton()" v-else>撤销</el-button>
                </div>
                <!-- 处理后 -->
                <div v-else>
                    <el-button type="info" disabled class="body_2_button" v-if="!user_result">已拒接</el-button>
                    <el-button type="success" disabled class="body_2_button" v-else>已同意</el-button>
                </div>
            </div>
            <!-- 吧主看到的申请 -->
            <div v-else>
                <div v-if="user_show">
                    <el-button type="danger"  @click="user_botton(true)">同意</el-button>
                    <el-button type="primary"  @click="user_botton(false)">拒接</el-button>
                </div>
                <!-- 处理后 -->
                <div v-else>
                    <el-button type="info" disabled class="body_2_button" v-if="!user_result">已拒接</el-button>
                    <el-button type="success" disabled class="body_2_button" v-else>已同意</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// 吧务申请模块
import {ref} from 'vue'
import {addBaTeam,submitBaTeam,delTeam,delBa}from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
    name:'memberreadonly51body',
    props:{
        bodys:{
            type:Object,
            default:()=>({})
        },
        own:{
            type:Boolean,
            default:false,
        },
        create:{
            type:Boolean,
            default:false,
        }
    },
    setup(props){
        const user_show=ref(!props.bodys.status)
        const user_result=ref(props.bodys.result)
        const main_show=ref(true)
        // 同意或拒接
        const user_botton=(val)=>{
            if(val){
                 addBaTeam({ postid:props.bodys.post_id, takeoverid:props.bodys.user_id }).then(data=>{
                    // console.log(data);
                    if(data.meta.status==201){
                        ElMessage.error('此人已经是吧务')
                    }else if(data.meta.status==200){
                        ElMessage({type: 'success',message: '添加吧务成功成功'})
                    }else{
                        ElMessage.error('添加吧务失败')
                    }
                })
                user_result.value=1
            }
            // console.log(user_result.value);
            submitBaTeam({id:props.bodys.id,result:user_result.value})
            user_show.value=false
        }
        // 撤销吧务申请
        const own_botton=()=>{
            ElMessageBox.confirm(
                '你确定撤销这条吧务申请吗?',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '再看看',
                    type: 'warning',
                }
            )
            .then(() => {
                delTeam({id:props.bodys.id,userid:props.bodys.user_id})
                ElMessage({type: 'success', message: '撤销成功',})
                main_show.value=false
            })
            .catch(() => {})
        }
        // 撤销吧申请
        const own_ba_botton=()=>{
            ElMessageBox.confirm(
                '你确定撤销这条贴吧申请吗?',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '再看看',
                    type: 'warning',
                }
            )
            .then(() => {
                delBa({id:props.bodys.id,userid:props.bodys.user_id})
                ElMessage({type: 'success', message: '撤销成功',})
                main_show.value=false
            })
            .catch(() => {})
        }
        return{user_show,user_botton,own_botton,user_result,main_show,own_ba_botton}
    }
}
</script>

<style scoped lang="less">
.body_item{
    width: 100%;
    height: 90px;
    display: flex;
    justify-content: space-between;
    margin: 10px 0 0 0;
    border-bottom: 1px solid #e5e9ef;
    .body_1{
        line-height: 16px;
        color: #9499a0;
            .user_info{
            display: flex;
            align-items: center;
            margin-left: 20px;
            // padding-bottom: 16px;
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
                        // height: 26px;
                        // margin-top: 6px;
                        font-size: 12px;
                        a{
                            color: rgb(109, 117, 122);
                        }
                    }
                }
        } 
    }
    .body_1_middle{
        flex:1;
        padding: 0 10px;
        height: 90%;
        
    }
    .body_2{
        line-height: 16px;
        color: #6d757a;
        font-size: 12px;
        display: flex;
        min-width: 132px;
        flex-direction: column;
        justify-content :space-between;
        align-items :center;
        // margin-right: 16px;
        padding: 0 10px 10px 0;
        .body_2_text{
            font-size: 14px;
            font-weight: bold;
            color: #333;
        }
        .body_2_button{
            width: 100px;
        }
    }
}
</style>