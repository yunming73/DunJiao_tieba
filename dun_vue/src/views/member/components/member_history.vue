<template>
  <div class="home" v-if="historys.length>0">
    <div class="content">
      <ul class="main_ul">
        <li v-for="(item,i) in historys" :key="i" class="main_li">
            <DjContent 
            :content="item[0]" 
            :source='source'
            />
        </li>
      </ul>
    </div>
  </div>
  <div v-else>
      <el-empty description="浏览记录空空如也" />
  </div>
</template>

<script>
// 个人中心浏览记录
import {ref,reactive} from 'vue';
import {DjContent} from '@/components/library/dj_content.vue'
import {userSearch} from '@/api/user';
import {searchContent} from '@/api/bas';
import { ElMessage } from 'element-plus'
import {useRoute} from 'vue-router'
import { useStore } from 'vuex';
export default {
    name:'memberdynamic',
    components:{DjContent},
    setup(){
      const history=ref([])
       const route=useRoute()
      const source=ref('ba')
      const store =useStore()
      const historys=ref([])
       // 浏览记录
        const getlist=()=>{
          userSearch(store.state.user.profile.id).then(data=>{
              if(data.meta.status!==200) return ElMessage.error('获取浏览记录id出错')
              history.value=data.data
              if(history.value.history_Record!==null){
                for(let i=history.value.history_Record.length-1;i>=0;i--){
                  searchContent({id:history.value.history_Record[i]}).then(data=>{
                    if(data.meta.status==1){
                      return ElMessage.error('获取浏览记录信息出错')
                    }else if(data.meta.status==200){
                      historys.value.push(data.data)
                    }
                  })
                }
              }
          })
        }
        getlist()
        return {source,history,historys}
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