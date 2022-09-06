<template>
    <div>
        <el-breadcrumb separator=">" style="margin:10px">
            <el-breadcrumb-item :to="{ path: '/home/ba' }">贴吧列表</el-breadcrumb-item>
            <el-breadcrumb-item>{{bainfo.name}}贴吧</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
  <div class="user_top" >
    <HomeBaItem :bainfo="pagination.query"  />
  </div>
  <div class="user_bottom">
    <div class="user_bottom_item" v-loading="loading" :data="contents.result" >
      <div v-if="contents.totalpage>0">
        <div v-for="(item,i) in contents.result" :key="i" class="user_bottom_item_user">
          <BaContentItem :content="item"/>
        </div>
      </div> 
      <div v-else>
         <el-empty description="没有搜索结果" />
      </div>
    </div>
    <!-- 分页 -->
    <el-pagination 
    style="justify-content:center;margin-right: 80px;"
    background 
    layout="total,prev, pager, next" 
    :total="contents.totalpage" 
    :page-size="pagination.pagesize"
    @current-change="handlebasChange"
    :hide-on-single-page=true
    />
  </div>
</template>

<script>
// 吧的主贴列表
import {ref,reactive} from 'vue';
import {getBaContents,basSearch} from '@/api/ba';
import BaContentItem from './components/ba_content_item.vue';
import HomeBaItem from './components/home_ba_item.vue';
import {ElMessage} from 'element-plus'
import {useRoute} from 'vue-router';
export default {
  name:'bacontent',
  components:{BaContentItem,HomeBaItem},
  setup(){
    const input=ref('')
    // 获取吧的主贴列表
    const contents=ref([])
    const route=useRoute()
    const pagination = reactive({
      query:route.params.id,
      pagenum: 1,
      pagesize: 10
    })
    const loading=ref(true)
    const bainfo=ref([])
    // 吧信息
    basSearch(pagination.query).then(data=>{
        if(data.meta.status!==200) return ElMessage.error('获取贴吧信息出错')
        bainfo.value=data.data
    })
    // 吧所属帖子列表
    const getlist=()=>{
        getBaContents({query:pagination.query,pagenum:pagination.pagenum,pagesize:pagination.pagesize }).then(data=>{
            if(data.meta.status!==200) return ElMessage.error('获取贴子列表信息出错')
            loading.value=false
            contents.value=data.data
        })
    }
    getlist()
    // 吧分页
    const handlebasChange = (currentPageNum) => {
      pagination.pagenum=currentPageNum
      contents.value.result=[]
      loading.value=true
      getlist()
    }
    return {input,handlebasChange,contents,pagination,loading,bainfo}
  }
}
</script>

<style scoped lang="less">
.user_bottom{
  height: 100%;
  display: flex;
  flex-direction: column;
  .user_bottom_item{
    display: flex;
    height: 96%;
    flex-direction: column;
    .user_bottom_item_user{
      margin-bottom: 10px;
    }
  }
}
</style>