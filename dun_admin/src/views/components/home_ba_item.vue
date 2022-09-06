<template>
    <div class="revise_body_top_right" style="boxShadow: boxShadowBase" v-if="item_show" >
        <div class="revise_body_top_right_left">
            <div class="revise_body_top_right_left" v-if="ba_info.img">
                <img :src="ba_info.img" alt="">
            </div>
            <div class="revise_body_top_right_left_name">
                <el-scrollbar>
                    {{ba_info.name}}
                </el-scrollbar>
            </div>
        </div>
        <div class="revise_body_top_right_right">
            <div class="revise_body_top_right_right_text" v-if="ba_user.nickname||ba_user.username">
                <p>吧主&ensp;:</p>
                <p>{{ba_user.nickname||ba_user.username}}</p>
            </div>
            <div class="revise_body_top_right_right_text" v-if="ba_info.ba_signature">
                <p>个性签名&ensp;:</p>
                <p>{{ba_info.ba_signature}}</p>
            </div>
            <div class="revise_body_top_right_right_text" v-if="ba_info.ba_hits">
                <p>关注数&ensp;:</p>
                <p class="revise_body_top_right_right_text_p_1">{{ba_info.ba_hits}}</p>
            </div>
            <div class="revise_body_top_right_right_text" v-if="ba_info.ba_information">
                <p>帖子总数&ensp;:</p>
                <p class="revise_body_top_right_right_text_p_2">{{ba_info.ba_information}}</p>
            </div>
            <div class="revise_body_top_right_right_text" v-if="ba_info.add_time">
                <p>创建时间&ensp;:</p>
                <p>{{ba_info.add_time}}</p>
            </div>
        </div>
        
        <div class="user_ba">
            <div>吧务&ensp;:</div>
            <ul class="user_ba_item" v-if="ba_team.length>0">
                <el-scrollbar>
                    <li v-for="(item,i) in ba_team" :key="i">
                        <div class="user_ba_text">{{item.nickname||item.username}}</div>
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
            <el-button type="success"   @click="routerto()">详情</el-button>
        </div>
         <div>
            <el-button type="danger"  @click="ba_button_del()">删除</el-button>
        </div>
    </div>
    <!-- 弹出框 -->
     <el-dialog
        v-model="dialogVisible"
        title="贴吧信息"
        width="600px"
        :before-close="handleClose"
        >
        <HomeBaItemSubmit :subba='ba_info'/>
    </el-dialog>
</template>

<script>
// 贴吧主体
import {ref} from 'vue'
import {basSearch,delBas} from '@/api/ba'
import {userSearch} from '@/api/user'
import {ElMessage, ElMessageBox} from 'element-plus'
import {useRouter} from 'vue-router';
import HomeBaItemSubmit from './home_ba_item_submit.vue';
export default {
    name:'homeuseritem',
    components:{HomeBaItemSubmit},
    props:{
        bainfo:{
            type:[String,Number],
            default:''
        }
    },
    setup(props){
        // console.log(props.bainfo);
        const router=useRouter()
        const ba_info=ref([])
        const ba_user=ref([])
        const ba_team=ref([])
        const dialogVisible=ref(false)
        basSearch(props.bainfo).then(data=>{
            // console.log(data);
            if(data.meta.status!==200) return ElMessage.error('查询贴吧信息出错')
            ba_info.value=data.data
            userSearch(ba_info.value.ba_user_id).then(data=>{
                if(data.meta.status!==200) return ElMessage.error('查询吧主信息出错')
                ba_user.value=data.data
            })
            // console.log(ba_info.value.ba_team_ids.length);
            if(ba_info.value.ba_team_ids){
                for(let i=0;i<ba_info.value.ba_team_ids.length;i++){
                    // console.log(ba_info.value.ba_team_ids[i]);
                    userSearch(ba_info.value.ba_team_ids[i]).then(data=>{
                        if(data.meta.status!==200) return ElMessage.error('查询小吧主信息出错')
                        ba_team.value.push(data.data)
                    })
                }
            }
        })
        // 关闭修改贴吧弹出框
        const handleClose = () => {
            dialogVisible.value = false
        }
        // 删除贴吧
        const item_show=ref(true)
        const ba_button_del=()=>{
            ElMessageBox.confirm(
                '你确定删除这个贴吧吗(不可恢复)?',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
            .then(() => {
                 delBas(props.bainfo).then(data=>{
                    // console.log(data);
                    if(data.meta.status!==200) return ElMessage.error('删除贴吧失败')
                    item_show.value=false
                })
            })
            .catch(() => {})
        }
        const routerto=()=>{
            router.push(`/home/ba/content/${ba_info.value.id}`)
        }
        return{ba_info,ba_user,ba_team,ba_button_del,item_show,dialogVisible,handleClose,routerto}
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
    }
    .revise_body_top_right_right{
        // flex: 1;
        width: 300px;
        height: 100%;
        display: flex;
        margin-bottom: 10px;
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
            .revise_body_top_right_right_text_p_1{
                color: rgb(255, 106, 41);
                font-style: italic;
                font-weight: 600;
            }
            .revise_body_top_right_right_text_p_2{
                color: rgb(255, 146, 20);
                font-style: italic;
                font-weight: 600;
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
            font-size: 16px;
            font-weight: 600;
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