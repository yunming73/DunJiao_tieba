<template>
  <div class="user_top">
    <el-input v-model="input" class="user_top_input" placeholder="请输入想搜索帖子关键词" clearable autofocus=true @change='input_change()'>
        <template #prefix>
          <el-icon class="el-input__icon"><search /></el-icon>
        </template>
      </el-input>
  </div>
  <div class="user_bottom">
    <div class="user_bottom_item" v-loading="loading" :data="content.result" >
        <div v-if="content.totalpage>0">
           <div v-for="(item,i) in content.result" :key="i" class="user_bottom_item_user">
            <BaContentItem :content="item" :source='source'/>
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
    :total="content.totalpage" 
    :page-size="pagination.pagesize"
    @current-change="handlebasChange"
    :hide-on-single-page=true
    />
  </div>
</template>

<script>
// 首页全部帖子列表
import {ref,reactive} from 'vue';
import {homeSearchContent} from '@/api/ba';
import HomeBaItem from './home_ba_item.vue';
import BaContentItem from './ba_content_item.vue';
import {ElMessage} from 'element-plus'
export default {
  name:'ba',
  components:{HomeBaItem,BaContentItem},
  setup(){
    const input=ref('')
    // 获取全部帖子列表
    const content=ref([])
    const pagination = reactive({
      query:'',
      pagenum: 1,
      pagesize: 10
    })
    const input_change=()=>{
      // pagination.query=''
      pagination.query=input.value
      // console.log(pagination.query);
      getlist()
    }
    const source=ref('shouye')
    const loading=ref(true)
    const getlist=()=>{
      homeSearchContent({query:pagination.query, pagesize:pagination.pagesize, pagenum:pagination.pagenum }).then(data=>{
        if(data.meta.status!==200) return ElMessage.error('获取全部帖子列表出错')
        loading.value=false
        content.value=data.data
      })
    }
    getlist()
    // 全部帖子分页
    const handlebasChange = (currentPageNum) => {
      pagination.pagenum=currentPageNum
      content.value.result=[]
      loading.value=true
      getlist()
    }
    return {input,handlebasChange,content,pagination,input_change,loading,source}
  }
}
</script>

<style scoped lang="less">
.user_top{
  .user_top_input{
    margin: 10px 0;
  }
}
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