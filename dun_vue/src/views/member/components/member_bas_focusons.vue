<template>
  <div class="readonly" v-if="userBasFocusons.length>0">
      <div class="readonly_title">
          <span>关注的吧</span>
      </div>
      <div class="readonly_body" v-for="(item,i) in userBasFocusons " :key="i">
            <memberreadonlybody :bodys='item' :ba=false />
      </div>
      <!-- <div>
          <el-pagination 
          style="justify-content:center;"
          background 
          layout="total,prev, pager, next, jumper" 
          :total="userBasFocusons.length" 
          :page-size="pagination.pagesize"
          @current-change="handleCurrentChange"
          :hide-on-single-page=true
          />
      </div> -->
  </div>
  <div v-else>
      <el-empty description="没有关注的吧" />
  </div>
</template>

<script>
// 个人中心关注的吧
import {ref,reactive} from 'vue'
import {getBasCollect} from '@/api/home'
import memberreadonlybody from './member_readonly_body.vue'
import {useStore} from 'vuex'
export default {
    name:'memberbasfocusons',
    components:{memberreadonlybody},
     setup(){
        const userBasFocusons=ref([])
        const store=useStore()
        // const pagination = reactive({
        //     pagenum: 1,
        //     pagesize: 10
        // })
        const getlist=()=>{
            getBasCollect(store.state.user.profile.id).then(data=>{
                userBasFocusons.value=data.data
                // console.log(userBasFocusons.value);
            })
        }
        getlist()
        // const handleCurrentChange = (currentPageNum) => {
        //     pagination.pagenum=currentPageNum
        //     userBasFocusons.value.result=[]
        //     getlist()
        //     // 滑动到顶部
        //     document.body.scrollIntoView()
        // }
        return{userBasFocusons}
    }
}
</script>

<style scoped lang="less">
.readonly{
    // width: 250px;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 15px 20px 18px;
    margin-bottom: 10px;
    .readonly_title{
        display: flex;
        padding-bottom: 10px;
        border-bottom: 1px solid #e5e9ef;
        // margin-bottom: 20px;
        justify-content: space-between;
        span{
            line-height: 23px;
            font-size: 18px;
            color: #222;
            font-weight: bolder;
        }
    }
    .readonly_body{
         display: flex;
        //  justify-content: space-between;
        flex-direction: column;
        margin: 10px 0 10px 0;
            // border-bottom: 1px solid #e5e9ef;
        
    }
}
</style>