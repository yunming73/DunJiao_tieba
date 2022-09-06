<template>
  <div class="user_top">
    <el-input v-model="input" class="user_top_input" placeholder="请输入想搜索吧名称" clearable autofocus=true @change='input_change()'>
      <template #prefix>
        <el-icon class="el-input__icon"><search /></el-icon>
      </template>
    </el-input>
  </div>
  <div class="user_bottom">
    <div class="user_bottom_item" v-loading="loading" :data="bas.result" >
      <div v-if="bas.totalpage>0">
        <div v-for="(item,i) in bas.result" :key="i" class="user_bottom_item_user">
          <HomeBaItem :bainfo="item.id"/>
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
    :total="bas.totalpage" 
    :page-size="pagination.pagesize"
    @current-change="handlebasChange"
    :hide-on-single-page=true
    />
  </div>
</template>

<script>
// 吧列表
import {ref,reactive} from 'vue';
import {getBas} from '@/api/ba';
import HomeBaItem from './home_ba_item.vue';
import {ElMessage} from 'element-plus'
export default {
  name:'ba',
  components:{HomeBaItem},
  setup(){
    const input=ref('')
    // 获取吧列表
    const bas=ref([])
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
    const loading=ref(true)
    const getlist=()=>{
      getBas({query:pagination.query, pagesize:pagination.pagesize, pagenum:pagination.pagenum }).then(data=>{
        // console.log(data);
        if(data.meta.status!==200) return ElMessage.error('获取吧列表出错')
        loading.value=false
        bas.value=data.data
      })
    }
    getlist()
    // 吧分页
    const handlebasChange = (currentPageNum) => {
      pagination.pagenum=currentPageNum
      bas.value.result=[]
      loading.value=true
      getlist()
    }
    return {input,handlebasChange,bas,pagination,input_change,loading}
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
  }
}
</style>