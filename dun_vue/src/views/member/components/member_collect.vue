<template>
  <div class="home" v-if="contents.totalpage>0">
    <div class="content">
      <ul class="main_ul">
        <li v-for="(item,i) in contents.result" :key="i" class="main_li">
            <DjContent 
            :content="contents.result[i]" 
            :source='source'
            />
        </li>
      </ul>
      <div>
          <el-pagination 
          style="justify-content:center;"
          background 
          layout="total,prev, pager, next, jumper" 
          :total="contents.totalpage" 
          :page-size="pagination.pagesize"
          @current-change="handleCurrentChange"
          :hide-on-single-page=true
          />
      </div>
    </div>
  </div>
  <div v-else>
      <el-empty description="收藏空空如也" />
  </div>
</template>

<script>
// 用户收藏列表
import {ref,reactive} from 'vue';
import {DjContent} from '@/components/library/dj_content.vue'
import {useStore} from 'vuex'
import {userCollect} from '@/api/user';
import { ElMessage } from 'element-plus'
export default {
    name:'membercollect',
    components:{DjContent},
    setup(){
      const store=useStore()
      const contents=ref([])
      const source=ref('ba')
       const pagination = reactive({
            pagenum: 1,
            pagesize: 10
        })
       // 用户收藏列表
        const getlist=()=>{
            userCollect({query:store.state.user.profile.id,pagesize:pagination.pagesize,pagenum:pagination.pagenum}).then(data=>{
                if(data.meta.status!==200) return ElMessage.error('获取用户收藏列表出错')
                contents.value=data.data
                // console.log(contents.value);
            })
        }
        getlist()
        // 分页
        const handleCurrentChange = (currentPageNum) => {
            pagination.pagenum=currentPageNum
            contents.value.result=[]
            getlist()
            // 滑动到顶部
            document.body.scrollIntoView()
        }
        return {source,contents,handleCurrentChange,pagination}
    }
}
</script>

<style scoped lang="less">
// .home{
//   // margin-top: 10px;
// }
.content{
  // width: 980px;
  .main_li{
    margin-bottom: 10px;
  }
}
</style>