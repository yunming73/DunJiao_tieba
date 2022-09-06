<template>
    <div class="body_item">
        <div class="body_open" @click="openadd()">
            <div v-if="!addshow">
                <el-icon><ArrowRight /></el-icon>
                <el-icon><ArrowRight /></el-icon>
                <el-icon><ArrowRight /></el-icon>
                    {{title}}
                <el-icon><ArrowLeft /></el-icon>
                <el-icon><ArrowLeft /></el-icon>
                <el-icon><ArrowLeft /></el-icon>
            </div>
            <div v-if="addshow">
                <el-icon><ArrowLeft /></el-icon>
                <el-icon><ArrowLeft /></el-icon>
                <el-icon><ArrowLeft /></el-icon>
                    {{title}}
                <el-icon><ArrowRight /></el-icon>
                <el-icon><ArrowRight /></el-icon>
                <el-icon><ArrowRight /></el-icon>
            </div>
        </div>
        <div v-if="addshow">
            <BasAddContentItem v-if="title=='发表帖子'"/>
            <BasAddContentItemFollow v-else/>
        </div>
    </div>
</template>

<script>
// 主贴和从贴的发表帖子按钮
import {ref} from 'vue';
import BasAddContentItem from './bas_add_content_item.vue';
import BasAddContentItemFollow from './bas_add_content_item_follow.vue';
import {useRoute,useRouter} from 'vue-router';
import { useStore } from 'vuex'
export default {
    name:'basaddcontent',
    components:{BasAddContentItem,BasAddContentItemFollow},
    setup(){
        const addshow=ref(false)
        const title=ref('')
        const store=useStore()
        const route=useRoute()
        const router=useRouter()
        if(route.params.commentid){
            title.value='回复帖子'
        }else{
            title.value='发表帖子'
        }
        const openadd=()=>{
            if(!store.state.user.profile.token) return router.push('/login')
            addshow.value=!addshow.value
        }
        return {addshow,title,openadd}
    }
}
</script>

<style lang='less' scoped>
.body_item{
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    .body_open{
        display: flex;
        background-color: #fff;
        border: 1px solid #eee;
        border-radius: 10px;
        height: 30px;
        justify-content: center;
        align-items:center;
        // &:active{
        //     opacity: 1;
                 
        // }
    }
}


</style>