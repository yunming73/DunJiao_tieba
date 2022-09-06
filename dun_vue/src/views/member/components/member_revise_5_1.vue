<template>
 <div class="body_main">
     <el-scrollbar v-if="bodys" >
        <div v-for="(item,i) in bodys" :key="i">
            <MemberRevise51Body :bodys='item'/>
        </div>
     </el-scrollbar>
     <el-empty description="没有申请" v-else />
 </div>
</template>

<script>
import {ref} from 'vue'
import MemberRevise51Body from './member_revise_5_1_body'
import {getBaTeam} from '@/api/user'
import {useStore} from 'vuex'
export default {
    name:'MemberRevise51',
    components:{MemberRevise51Body},
    setup(){
        const bodys=ref(null)
        const store=useStore()
        const userid=store.state.user.profile.id
        getBaTeam({id:userid}).then(data=>{
            if(data.meta.status==204) return 
            bodys.value=data.data
        })
        
        return{bodys}
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
}
</style>