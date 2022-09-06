<template>
    <div>
        <el-breadcrumb separator=">" style="margin:10px">
            <el-breadcrumb-item :to="{ path: '/home/ba' }">贴吧列表</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: `/home/ba/content/${bainfo.id}` }">{{bainfo.name}}贴吧</el-breadcrumb-item>
            <el-breadcrumb-item>帖子</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
  <div class="user_top" >
    <HomeBaItem :bainfo="baid"  />
  </div>
  <div class="user_bottom">
    <div class="user_bottom_item" v-loading="loading" :data="contentsComment.result" >
        <ul class="main_ul" v-if="texttitle">
          <!-- 主贴 -->
          <li>
              <ContentCommentItem 
              :content="texttitle" 
              :titletop="texttitle.title" 
              @toggle_sort='toggle_sort'
              :landlord='texttitle.user_id' 
              @toggle_show_landlord='toggle_show_landlord' 
              v-model:content_show='content_show'
              />
          </li>
          <!-- 从贴 -->
          <li v-for="(item,i) in contentsComment.result" :key="i">
              <ContentCommentItem 
              :content="item"
              :landlord='texttitle.user_id' 
              @toggle_show_landlord='toggle_show_landlord' 
              />
          </li>
        </ul>
    </div>
    <!-- 分页 -->
    <el-pagination 
    style="justify-content:center;margin-right: 80px;"
    background 
    layout="total,prev, pager, next" 
    :total="contentsComment.totalpage" 
    :page-size="pagination.pagesize"
    @current-change="handlebasChange"
    :hide-on-single-page=true
    />
  </div>
</template>

<script>
// 主贴的从贴列表
import {ref,reactive} from 'vue';
import {getContentsComment,basSearch,searchContent,getLandlordContentComment} from '@/api/ba';
import BaContentItem from './components/ba_content_item.vue';
import HomeBaItem from './components/home_ba_item.vue';
import ContentCommentItem from './components/bas_content_comment_item.vue'
import {ElMessage} from 'element-plus'
import {useRoute} from 'vue-router';
export default {
  name:'bacontent',
  components:{BaContentItem,HomeBaItem,ContentCommentItem},
  setup(){
    const input=ref('')
    // 获取主贴的从贴列表
    const contentsComment=ref([])
    const route=useRoute()
    var show_landlord=false
    const pagination = reactive({
      query:route.params.contentid,
      pagenum: 1,
      pagesize: 10,
      sort:''
    })
    const baid=route.params.id
    // console.log(baid);
    const loading=ref(true)
    const bainfo=ref([])
    // 吧信息
    basSearch(baid).then(data=>{
        if(data.meta.status!==200) return ElMessage.error('获取贴吧信息出错')
        bainfo.value=data.data
    })
    // 主贴信息
    const texttitle=ref()
    searchContent({id:pagination.query}).then(data=>{
        if(data.meta.status!==200) return ElMessage.error('获取主贴信息出错')
        texttitle.value=data.data[0]
    })
    //主贴所属从帖列表
    const getlist=()=>{
       getContentsComment({query:pagination.query,pagenum:pagination.pagenum,pagesize:pagination.pagesize,sort:pagination.sort}).then(data=>{
          if(data.meta.status!==200) return ElMessage.error('获取从贴列表信息出错')
          loading.value=false
          contentsComment.value=data.data
      })
    }
    getlist()
    // 楼主发言的从贴列表
    const getListLandlord=()=>{
        getLandlordContentComment({query:pagination.query,pagenum:pagination.pagenum,pagesize:pagination.pagesize,sort:pagination.sort,userid:texttitle.value.user_id}).then(data=>{
            if(data.meta.status!==200) return ElMessage.error('获取楼主发言的从贴列表出错')
            loading.value=false
            contentsComment.value=data.data
        })
    }
    // 分页
    const content_show=ref(true)
    const handlebasChange = (currentPageNum) => {
      pagination.pagenum=currentPageNum
      contentsComment.value.result=[]
      loading.value=true
      // 判断是否显示楼主从贴或正常从贴数据
      if(show_landlord){
          getListLandlord()
      }else{
          getlist()
      }
      // 分页时候的主贴显示与隐藏
      if(currentPageNum==1){
          content_show.value=true
      }else{
          content_show.value=false
      }
      // 滑动到顶部
      document.body.scrollIntoView()
    }
    // 接收到的排序方式
    const toggle_sort=(val)=>{
      if(val){
          pagination.sort='desc'
      }else{
          pagination.sort=''
      }
      if(show_landlord){
        getListLandlord()
      }else{
        getlist()
      }
    }
    // 接收到的是否显示楼主发送的从贴数据格式
    const toggle_show_landlord=(val)=>{
        show_landlord=val
        if(val){
            getListLandlord()
        }else{
            getlist()
        }
    }
    return {
      input,
      handlebasChange,
      contentsComment,
      pagination,
      loading,
      bainfo,
      baid,
      texttitle,
      toggle_sort,
      toggle_show_landlord,
      content_show
    }
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
  }
}
.main_ul{
  display: flex;
  flex-direction: column;
  li{
      margin-bottom: 10px;
  }
}

</style>