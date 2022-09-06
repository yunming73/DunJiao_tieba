<template>
   <div class="comment_bottom" v-if="comment">
     <!--  循环从贴评论 -->
     <div v-for="(item,i) in comment.result" :key="i">
       <BasContentCommentItemTextText :comments="item" />
     </div>
     <!-- 评论分页 -->
     <div>
       <div >
          <el-pagination 
          background 
          layout="total,prev, pager, next" 
          :total="comment.totalpage" 
          :page-size="pagination.pagesize"
          @current-change="handleCurrentChange"
          :hide-on-single-page=true
          />
      </div>
     </div>
    </div>
</template>

<script>
// 从贴评论
import {ref,reactive} from 'vue';
import {getContentsComments} from '@/api/bas';
import BasContentCommentItemTextText from './bas_content_comment_item_text_text.vue';
export default {
    name:'bascontentcommentitemtext',
    components:{BasContentCommentItemTextText},
    props:{
      commentid:{
        type:Number,
        default:0
      }
    },
    setup(props){
      const pagination = reactive({
        pagenum: 1,
        pagesize: 4
      })
      const comment=ref([])
      const getlist=()=>{
        getContentsComments({query:props.commentid,pagesize:pagination.pagesize,pagenum:pagination.pagenum}).then(data=>{
          if(data.meta.status!==200) return ElMessage.error('获取从贴评论列表出错')
          comment.value=data.data
          // console.log(comment.value);
        })
      }    
      getlist()
      const handleCurrentChange = (currentPageNum) => {
        pagination.pagenum=currentPageNum
        comment.value.result=[]
        getlist()
      }
      return{comment,handleCurrentChange,pagination}
    }
}
</script>