<template>
  <header class="bas">
    <div class="container">
        <!-- 面包屑 -->
        <el-breadcrumb separator=">" style="margin:10px">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>贴吧列表</el-breadcrumb-item>
        </el-breadcrumb>
        <ul class="bas_body" v-if="bas.result">
                <li v-for="(item,i) in bas.result" :key="i">
                    <DjBaItem :bas='item'/>
                </li>
            <!-- 添加贴吧 -->
            <div class="body_item" v-if="bas.result.length<pagination.pagesize">
                <RouterLink to="/member/revise/4-2">
                    <el-icon style="margin-left: 90px;" :size="170"><CirclePlus/></el-icon>
                </RouterLink>
            </div>
        </ul>
        <div v-else>
            <el-empty description="没有更多贴吧" />
        </div>
        <div>
            <el-pagination 
             style="justify-content:center;"
              background 
              layout="total,prev, pager, next, jumper" 
              :total="bas.totalpage" 
              :page-size="pagination.pagesize"
              @current-change="handleCurrentChange"
              :hide-on-single-page=true
              />
        </div>
    </div>
  </header>
</template>

<script>
// 全部帖子列表
import {ref,reactive} from 'vue';
import {getBas} from '@/api/bas'
import DjBaItem from '@/components/library/dj_baitem.vue';
export default {
    name:'bas',
    components:{DjBaItem},
    setup(){
        const pagination = reactive({
            pagenum: 1,
            pagesize: 9
        })
        let bas=ref([])
        const getlist=()=>{
            getBas(pagination).then(data=>{
                bas.value=data.data
            })
        }
        getlist()
        const handleCurrentChange = (currentPageNum) => {
            pagination.pagenum=currentPageNum
            bas.value.result=[]
            getlist()
            // 滑动到顶部
            document.body.scrollIntoView()
        }
        return {bas,handleCurrentChange,pagination}
    }

}
</script>

<style lang='less' scoped>
.bas{
    .container{
        flex-direction :column;
        display: flex;
        .bas_header{
            height: 40px;
        }
        .bas_body{
            flex-wrap :wrap;
            display: flex;
            .body_item{
                float: left;
                border-radius: 6px;
                background-color: #fff;
                width: 390px;
                height: 197px;
                display: flex;
                border: 1px solid #eee;
                flex-direction :column;
                padding: 8px;
                 margin: 0 22px 22px 0;
                .item_top{
                    flex: 1;
                    display: flex;
                    .item_top_img{
                        margin-top: 2px;
                        justify-content:center;
                        flex-direction :row;
                        width: 120px;
                        border: 1px solid #eee;
                        height: 120px;
                        display: block;
                    }
                    .item_top_text{
                        flex: 1;
                        padding: 0 12px;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        .text_1{
                            font-size: 24px;
                            color: #444;
                            font-weight: 600;
                        }
                        .text_2{
                            color: #F96E02;
                            margin: 2px 0;
                            font-size: 16px;
                            display: flex;
                            .text_2_2{
                                margin-left: 60px;
                            }
                        }
                        .text_3{
                            flex: 1;
                            font-size: 16px;
                            color: #999;
                        }
                    }
                }
                .item_bottom{
                    margin-top: 6px;
                    background-color: #fcfcfc;
                    height: 50px;
                    padding: 4px;
                        
                }
            }
        }
    }
}
</style>