<template>
  <div class="user_body" style="boxShadow: --el-box-shadow;">
    <div class="user_body_top">
        <RouterLink :to="user_info.id==$store.state.user.profile.id?`/member`:`/user/${user_info.id}`">
            <img :src="user_info.face" alt="">
        </RouterLink>
    </div>
    <div class="user_body_text">
        <RouterLink :to="user_info.id==$store.state.user.profile.id?`/member`:`/user/${user_info.id}`">
            {{user_info.nickname||user_info.username}}
        </RouterLink>
    </div>
    <div >
        <el-popconfirm
            confirmButtonText='好的'
            cancelButtonText='不用了'
            icon="el-icon-info"
            iconColor="red"
            @confirm="handleDeleteRow()"
            title="您确定取消该用户吧务身份吗？"
            v-if="button_show"
            >
            <template #reference>
            <el-icon :size="16"><CircleClose /></el-icon>
            </template>
        </el-popconfirm>
        <el-popconfirm
            confirmButtonText='好的'
            cancelButtonText='不用了'
            icon="el-icon-info"
            iconColor="red"
            @confirm="handleAddRow()"
            title="您确定重新恢复该用户吧务身份吗？"
            v-else
            >
            <template #reference>
            <el-icon :size="16" ><CirclePlusFilled /></el-icon>
            </template>
        </el-popconfirm>
    </div>
  </div>
</template>

<script>
import {ref} from 'vue';
import {userSearch,delBaTeam,addBaTeam} from '@/api/user';
export default {
    name:'memberrevise52user',
    props:{
        info:{
            type:Number,
            default:0
        },
        baid:{
            type:Number,
            default:0
        }
    },
    setup(props){
        const user_info=ref([])
        const button_show=ref(true)
        userSearch(props.info).then(data=>{
            user_info.value=data.data
        })
        const handleDeleteRow=()=>{
            delBaTeam({ postid:props.baid, takeoverid:props.info }).then(data=>{
                console.log(data);
                button_show.value=false
            })
        }
        const handleAddRow=()=>{
             addBaTeam({ postid:props.baid, takeoverid:props.info }).then(data=>{
                console.log(data);
                button_show.value=true
            })
        }
        return {user_info,handleDeleteRow,handleAddRow,button_show}
    }
}
</script>

<style scoped lang="less">
.user_body{
    height: 60px;
    // width: 140px;
    background-color: #f5f7fa;
    border: 1px solid #eee;
    border-radius: 4px;
    margin: 10px 0 0 10px;
    display: flex;
    align-items:center;
    padding: 0 4px 0 8px;
    justify-content :space-between;
    .user_body_top{
        width: 46px;
        height: 46px;
        
        img{
            border-radius: 50%;
            width: 100%;
            height: 100%;
        }
    }
    .user_body_text{
        margin: 0 10px;
    }
}
</style>