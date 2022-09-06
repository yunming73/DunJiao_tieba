<template>
 <div class="body_main">
     <div class="body_main_top">
         <el-button plain size="small" class="body_main_button" @click="toggle_button()">
            {{toggle?'申请吧务':'申请创建'}}&nbsp;&nbsp;&nbsp;消息切换<el-icon><Switch /></el-icon>
        </el-button>
     </div>
     <div v-if="bodys" class="body_main_bottom">
         <el-scrollbar v-if="toggle">
            <div v-for="(item,i) in bodys" :key="i">
                <MemberRevise51Body :bodys='item' :own='true' />
            </div>
        </el-scrollbar>
        <el-scrollbar v-else>
            <div v-for="(item,i) in bodysTwo" :key="i">
                <MemberRevise51Body :bodys='item' :own='true' :create='true'/>
            </div>
        </el-scrollbar>
     </div>
     <el-empty description="没有申请" v-else />
 </div>
</template>

<script>
import {ref} from 'vue'
import MemberRevise51Body from './member_revise_5_1_body'
import {getUserTeam,getBaUserTeam} from '@/api/user'
import {useStore} from 'vuex'
export default {
    name:'MemberRevise41',
    components:{MemberRevise51Body},
    setup(){
        const bodys=ref(null)
        const bodysTwo=ref(null)
        const store=useStore()
        const toggle=ref(true)
        const userid=store.state.user.profile.id
        const toggle_button=()=>{
            toggle.value=!toggle.value
        }
        getUserTeam({id:userid}).then(data=>{
            if(data.meta.status==204) return 
            bodys.value=data.data
        })
        getBaUserTeam({id:userid}).then(data=>{
            if(data.meta.status==204) return 
            bodysTwo.value=data.data
        })
        return{bodys,bodysTwo,toggle,toggle_button}
    }
}
</script>

<style scoped lang="less">
.body_main{
    display: flex;
    width: 100%;
    height: 400px;
    margin: 0 10px;
    flex-direction: column;
    
    .body_main_top{
        height: 32px;
        display: flex;
        flex-direction: column;
        .body_main_button{
        margin-top: 8px;
    }
    }
    .body_main_bottom{
        height: 368px;
    }
}
</style>