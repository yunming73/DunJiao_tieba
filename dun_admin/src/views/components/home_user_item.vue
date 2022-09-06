<template>
    <div class="revise_body_top_right" style="boxShadow: boxShadowBase" v-if="item_show">
        <div class="revise_body_top_right_left">
            <div class="revise_body_top_right_left" v-if="userinfo.face">
                <img :src="userinfo.face" alt="">
            </div>
            <div class="revise_body_top_right_left_name">
                <el-scrollbar>
                    {{userinfo.nickname||userinfo.username}}
                </el-scrollbar>
            </div>
            <div>
                <div v-if="userinfo.ustate" class="revise_body_top_right_left_name_login">
                    <el-icon color='#f9c41c' ><Opportunity /></el-icon>
                    在线
                </div>
                <div v-else class="revise_body_top_right_left_name_logout">
                    <el-icon color="#919191" ><Opportunity /></el-icon>
                    离开
                </div>
            </div>
        </div>
        <div class="revise_body_top_right_right">
            <div class="revise_body_top_right_right_text" v-if="userinfo.username">
                <p>用户名&ensp;:</p>
                <p>{{userinfo.username}}</p>
            </div>
            <div class="revise_body_top_right_right_text" v-if="userinfo.sex">
                <p>性别&ensp;:</p>
                <p>{{userinfo.sex}}</p>
            </div>
            <div class="revise_body_top_right_right_text" v-if="userinfo.signature">
                <p>个性签名&ensp;:</p>
                <p>{{userinfo.signature}}</p>
            </div>
            <div class="revise_body_top_right_right_text" v-if="userinfo.email">
                <p>邮箱&ensp;:</p>
                <p>{{userinfo.email}}</p>
            </div>
            <div class="revise_body_top_right_right_text" v-if="userinfo.add_time">
                <p>加入时间&ensp;:</p>
                <p>{{userinfo.add_time}}</p>
            </div>
        </div>
        <div class="user_ba">
            <div>吧主&ensp;:</div>
            <ul class="user_ba_item" v-if="user_ba_admin.length>0">
                <el-scrollbar>
                    <li v-for="(item,i) in user_ba_admin" :key="i">
                        <div class="user_ba_text">{{item.name}}</div>
                    </li>
                </el-scrollbar>
            </ul>
            <div v-else>
               无
            </div>
        </div>
       <div class="user_ba">
            <div>小吧主&ensp;:</div>
            <ul class="user_ba_item" v-if="user_ba_team.length>0">
                <el-scrollbar>
                    <li v-for="(item,i) in user_ba_team" :key="i">
                        <div class="user_ba_text">{{item.name}}</div>
                    </li>
                </el-scrollbar>
            </ul>
             <div v-else>
               无
            </div>
        </div>
        <div>
            <!-- 修改 -->
            <el-button type="primary"  @click="dialogVisible = true">修改</el-button>
            <!-- 封禁 -->
            <el-button type="warning" v-if="user_show" @click="user_button(false)">封禁</el-button>
            <el-button type="success" v-else @click="user_button(true)">解封</el-button>
        </div>
        <div>
            <el-button type="danger"  @click="user_button_del()">删除</el-button>
        </div>
    </div>
    <!-- 弹出框 -->
     <el-dialog
        v-model="dialogVisible"
        title="用户信息"
        width="600px"
        :before-close="handleClose"
        >
        <HomeUserItemSubmit :subuser='userinfo'/>
    </el-dialog>
</template>

<script>
import {ref} from 'vue'
import {getUserBaAdmin,getUserBaTeam,submitUserBlack,delUsers} from '@/api/user'
import {ElMessage, ElMessageBox } from 'element-plus'
import HomeUserItemSubmit from './home_user_item_submit.vue';
export default {
    name:'homeuseritem',
    components:{HomeUserItemSubmit},
    props:{
        userinfo:{
            type:[Array,Object],
            default:()=>({})
        }
    },
    setup(props){
        // console.log(props.userinfo);
        // 默认关注用户按钮的显示
        const dialogVisible=ref(false)
        const user_show=ref(!props.userinfo.is_black)
        const user_ba_admin=ref([])
        getUserBaAdmin(props.userinfo.id).then(data=>{
            if(data.meta.status!==200) return ElMessage.error('获取用户是吧主的列表出错')
            user_ba_admin.value=data.data
            // console.log(user_ba_admin.value);
        })
        const user_ba_team=ref([])
        getUserBaTeam(props.userinfo.id).then(data=>{
            if(data.meta.status!==200 && data.meta.status!==204) return ElMessage.error('获取用户是小吧主的列表出错')
            user_ba_team.value=data.data
            // console.log(user_ba_team.value);
        })
        // 关闭修改用户弹出框
        const handleClose = () => {
            dialogVisible.value = false
        }
        // 封禁用户
        const user_button=(val)=>{
            if(val){
                submitUserBlack({id:props.userinfo.id,black:0}).then(data=>{
                    if(data.meta.status!==200) return ElMessage.error('解封失败')
                    ElMessage({message: '解封成功',type: 'success',})
                })
            }else{
                submitUserBlack({id:props.userinfo.id,black:1}).then(data=>{
                    if(data.meta.status!==200) return ElMessage.error('封禁失败')
                    ElMessage({message: '封禁成功',type: 'success',})
                })
            }
            user_show.value=val
        }
        const item_show=ref(true)
        // 删除用户
        const user_button_del=()=>{
            ElMessageBox.confirm(
                '你确定删除这个用户吗(不可恢复)?',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
            .then(() => {
                 delUsers(props.userinfo.id).then(data=>{
                    if(data.meta.status!==200) return ElMessage.error('删除用户失败')
                    item_show.value=false
                })
            })
            .catch(() => {})
        }
        return{user_ba_admin,user_ba_team,user_button,user_show,user_button_del,item_show,dialogVisible,handleClose}
    }
}
</script>

<style scoped lang="less">
.revise_body_top_right{
    margin: 0 0 10px 0;
    min-width: 320px;
    height: 150px;
    border: 2px dashed var(--el-border-color);
    display: flex;
    padding: 0 10px 0 0;
    justify-content:space-between;
    align-items:center;
    .revise_body_top_right_left{
            width: 100px;
            display: flex;
            align-items:center;
            justify-content:center;
            flex-direction: column;
        .revise_body_top_right_left{
            border: 3px solid #eee;
            width: 80px;
            height: 80px;
            margin-bottom: 4px;
        }
        .revise_body_top_right_left_name{
            width: 80%;
            display: flex;
            justify-content:center;
        }
        .revise_body_top_right_left_name_login{
            font-size: 12px;
            font-weight: bolder;
            display: flex;
            align-items:center;
            color: #f9c41c;
        }
        .revise_body_top_right_left_name_logout{
            font-size: 12px;
            font-weight: bolder;
            display: flex;
            align-items:center;
            color: #919191;
        }
    }
    .revise_body_top_right_right{
        // flex: 1;
        width: 300px;
        height: 100%;
        margin-bottom: 10px;
        display: flex;
        margin-right: 100px;
        flex-direction:column;
        .revise_body_top_right_right_text{
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin: 10px 0 0 0;
            p{
                color: #9499a0;
            }
        }
    }
    .user_ba{
        height: 100%;
        width: 140px;
        // display: flex;
        // align-items:center;
        // padding: 10px 0;
         .user_ba_item{
            height: 80%;
            // display: flex;
            // flex-direction: column;
            // margin-left: 10px;
            // align-items:center;
            }  
        .user_ba_text{
            margin: 4px 0;
            font-size: 18px;
            font-weight: bold;
            display: flex;
            align-items:center;
        }
    }

    // .user_ba_item :deep(.el-scrollbar__wrap){
    //     display: flex;
    //     flex-direction: column;
    //     justify-content: center;
    // }
}
</style>