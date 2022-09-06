<template>
  <!-- <div class="user_top">
    <el-input v-model="input" class="user_top_input" placeholder="请输入想搜索用户名或昵称22" clearable autofocus=true @change='input_change()'>
        <template #prefix>
          <el-icon class="el-input__icon"><search /></el-icon>
        </template>
    </el-input>
  </div> -->
  <div class="user_bottom">
    <div class="user_bottom_item" v-loading="loading" :data="application.result" >
      <div v-if="application.totalpage>0">
        <div v-for="(item,i) in application.result" :key="i" class="user_bottom_item_user">
          <HomeApplicationItem :applicationinfo="item"/>
        </div>
      </div>
      <div v-else>
         <el-empty description="没有申请创建贴吧" />
      </div>
    </div>
    <!-- 分页 -->
    <el-pagination 
    style="justify-content:center;margin-right: 80px;"
    background 
    layout="total,prev, pager, next" 
    :total="application.totalpage" 
    :page-size="pagination.pagesize"
    @current-change="handleUsersChange"
    :hide-on-single-page=true
    />
  </div>
</template>

<script>
// 首页申请创建贴吧全部列表
import {ref,reactive} from 'vue';
import {getBaApplication} from '@/api/user';
import HomeApplicationItem from './home_application_item.vue';
import {ElMessage} from 'element-plus'
export default {
  name:'user',
  components:{HomeApplicationItem},
  setup(){
    const input=ref('')
    // 获取申请创建贴吧列表
    const application=ref([])
    const pagination = reactive({
      query:'',
      pagenum: 1,
      pagesize: 10
    })
    // const input_change=()=>{
    //   pagination.query=''
    //   pagination.query=input.value
    //   getlist()
    // }
    const loading=ref(true)
    const getlist=()=>{
      getBaApplication({query:pagination.query, pagesize:pagination.pagesize, pagenum:pagination.pagenum }).then(data=>{
        if(data.meta.status!==200) return ElMessage.error('获取申请创建贴吧全部列表出错')
        loading.value=false
        application.value=data.data
      })
    }
    getlist()
    // 申请贴吧分页
    const handleUsersChange = (currentPageNum) => {
      pagination.pagenum=currentPageNum
      application.value.result=[]
      loading.value=true
      getlist()
    }
    return {input,handleUsersChange,application,pagination,loading}
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