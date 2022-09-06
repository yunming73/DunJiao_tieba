<template>
    <div class="revise_body_top_right" style="boxShadow: boxShadowBase" v-if="item_show">
        <div class="revise_body_top_right_left">
            <div class="revise_body_top_right_left" v-if="applicationinfo.user_face">
                <img :src="applicationinfo.user_face" alt="">
            </div>
            <div class="revise_body_top_right_left_name">
                <el-scrollbar>
                    {{applicationinfo.user_nickname||applicationinfo.user_username}}
                </el-scrollbar>
            </div>
            <div>
                <div v-if="applicationinfo.user_ustate" class="revise_body_top_right_left_name_login">
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
            <div class="revise_body_top_right_right_text" v-if="applicationinfo.user_username">
                <p>用户名&ensp;:</p>
                <p>{{applicationinfo.user_username}}</p>
            </div>
            <div class="revise_body_top_right_right_text" v-if="applicationinfo.user_sex">
                <p>性别&ensp;:</p>
                <p>{{applicationinfo.user_sex}}</p>
            </div>
            <div class="revise_body_top_right_right_text" v-if="applicationinfo.user_signature">
                <p>个性签名&ensp;:</p>
                <p>{{applicationinfo.user_signature}}</p>
            </div>
            <div class="revise_body_top_right_right_text" v-if="applicationinfo.user_email">
                <p>邮箱&ensp;:</p>
                <p>{{applicationinfo.user_email}}</p>
            </div>
            <div class="revise_body_top_right_right_text" v-if="applicationinfo.user_add_time">
                <p>加入时间&ensp;:</p>
                <p>{{applicationinfo.user_add_time}}</p>
            </div>
        </div>
        <div class="user_ba">
            <div>申请时间&ensp;:</div>
            <!-- <div class="user_ba_item"> -->
                <div class="user_ba_text">{{applicationinfo.user_add_time}}</div>
            <!-- </div> -->
        </div>
        <div class="user_ba">
            <div>贴吧名称&ensp;:</div>
            <!-- <div class="user_ba_item"> -->
                <div class="user_ba_text">{{applicationinfo.ba_name}}</div>
            <!-- </div> -->
        </div>
         <div class="user_ba">
            <div>内容&ensp;:</div>
            <div class="user_ba_item" v-if="applicationinfo.content">
                <el-scrollbar>
                    {{applicationinfo.content}}
                </el-scrollbar>
            </div>
            <div style="margin-left: 10px;" v-else>
               无
            </div>
        </div>
        <div>
            <div v-if="bn_show">
                <el-button type="primary"  @click="application_button(true)">同意</el-button>
                <el-button type="success" @click="application_button(false)">拒接</el-button>
            </div>
            <div v-else>
                <el-button type="info" disabled class="body_2_button" v-if="!bn_result">已拒接</el-button>
                <el-button type="success" disabled class="body_2_button" v-else>已同意</el-button>
            </div>
        </div>
            <div>
            <!-- 删除按钮 -->
            <div>
                <el-popconfirm
                    confirmButtonText='好的'
                    cancelButtonText='不用了'
                    icon="el-icon-info"
                    iconColor="red"
                    @confirm="handleDeleteRow()"
                    title="您要删除这条申请吗？"
                    >
                    <template #reference>
                    <el-button type="danger">删除</el-button>
                    </template>
                </el-popconfirm>
            </div>
        </div>
    </div>
</template>

<script>
// 单个用户信息模块
import {ref} from 'vue'
import {submitBaCreate,delBa} from '@/api/user'
import {addBas} from '@/api/ba';
import {ElMessage} from 'element-plus'
export default {
    name:'homeuseritem',
    props:{
        applicationinfo:{
            type:[Array,Object],
            default:()=>({})
        }
    },
    setup(props){
        // console.log(props.applicationinfo);
        const item_show=ref(true)
        const bn_show=ref(!props.applicationinfo.status)
        const bn_result=ref(props.applicationinfo.result)
        // 处理申请
        const application_button=(val)=>{
            if(val){
                addBas({ name:props.applicationinfo.ba_name, userid:props.applicationinfo.user_id}).then(data=>{
                    if(data.meta.status==201){
                        ElMessage.error('该贴吧已经存在')
                    }else if(data.meta.status==200){
                        ElMessage({type: 'success',message: '添加贴吧成功'})
                    }else{
                        ElMessage.error('添加贴吧失败')
                    }
                })
                bn_result.value=1 
            }
            submitBaCreate({id:props.applicationinfo.id,result:bn_result.value})
            bn_show.value=false
        }
        // 删除申请
        const handleDeleteRow=()=>{
            delBa({id:props.applicationinfo.id,userid:props.applicationinfo.user_id}).then(data=>{
                if(data.meta.status!==200) return ElMessage.error('删除创建贴吧的申请失败')
                ElMessage({message: '删除创建贴吧的申请成功',type: 'success',})
                item_show.value=false
            })
        }
        return{handleDeleteRow,item_show,application_button,bn_show,bn_result}
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
        margin-bottom: 10px;
        width: 300px;
        height: 100%;
        display: flex;
        // margin-right: 100px;
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
    .body_2_button{
        width: 132px;
    }
}
</style>