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
      <el-empty description="动态空空如也" />
  </div>
</template>

<script>
// 个人中心动态
import {ref,reactive} from 'vue';
import {DjContent} from '@/components/library/dj_content.vue'
import {userContent} from '@/api/user';
import { ElMessage } from 'element-plus'
import {useRoute} from 'vue-router'
export default {
    name:'memberdynamic',
    components:{DjContent},
    setup(){
      const contents=ref([])
       const route=useRoute()
      var user_id=route.params.id
      const source=ref('ba')
       const pagination = reactive({
            pagenum: 1,
            pagesize: 10
        })
       // 用户帖子列表
        const getlist=()=>{
          userContent({query:user_id,pagenum:pagination.pagenum,pagesize:pagination.pagesize}).then(data=>{
              if(data.meta.status!==200) return ElMessage.error('获取用户贴子列表出错')
              contents.value=data.data
              // console.log(contents.value);
          })
        }
        getlist()
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