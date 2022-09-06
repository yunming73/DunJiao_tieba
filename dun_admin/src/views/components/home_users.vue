<template>
  <div class="user_top">
    <el-input v-model="input" class="user_top_input" placeholder="请输入想搜索用户名或昵称" clearable autofocus=true @change='input_change()'>
        <template #prefix>
          <el-icon class="el-input__icon"><search /></el-icon>
        </template>
    </el-input>
  </div>
  <div class="user_bottom">
    <div class="user_bottom_item" v-loading="loading" :data="users.result" >
      <div v-if="users.totalpage>0">
        <div v-for="(item,i) in users.result" :key="i" class="user_bottom_item_user">
          <HomeUserItem :userinfo="item"/>
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
    :total="users.totalpage" 
    :page-size="pagination.pagesize"
    @current-change="handleUsersChange"
    :hide-on-single-page=true
    />
  </div>
</template>

<script>
// 首页全部用户列表
import {ref,reactive} from 'vue';
import {getUsers} from '@/api/user';
import HomeUserItem from './home_user_item.vue';
import {ElMessage} from 'element-plus'
export default {
  name:'user',
  components:{HomeUserItem},
  setup(){
    const input=ref('')
    // 获取用户列表
    const users=ref([])
    const pagination = reactive({
      query:'',
      pagenum: 1,
      pagesize: 10
    })
    const input_change=()=>{
      pagination.query=''
      pagination.query=input.value
      getlist()
    }
    const loading=ref(true)
    const getlist=()=>{
      getUsers({query:pagination.query, pagesize:pagination.pagesize, pagenum:pagination.pagenum }).then(data=>{
        if(data.meta.status!==200) return ElMessage.error('获取用户列表出错')
        loading.value=false
        users.value=data.data
        // console.log(users.value);
      })
    }
    getlist()
    // 吧分页
    const handleUsersChange = (currentPageNum) => {
      pagination.pagenum=currentPageNum
      users.value.result=[]
      loading.value=true
      getlist()
    }
    return {input,handleUsersChange,users,pagination,input_change,loading}
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