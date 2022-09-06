<template>
    <div class="body_item" v-if="bastext">
        <RouterLink :to="`/bas/item/${bastext.id}`">
            <div class="item_top">
                <div class="item_top_img">
                <img :src="bastext.img" alt="">
                </div>
                <div class="item_top_text">
                    <p class="text_1">{{bastext.name}}</p>
                    <p class="text_2">
                        <span>
                            <el-icon><Avatar /></el-icon>
                            {{bastext.ba_hits}}
                        </span>
                        <span class="text_2_2">
                            <el-icon><ChatDotSquare /></el-icon>
                            {{bastext.ba_information}}
                        </span> 
                    </p>
                    <p class="text_3">{{bastext.name}}介绍:</p>
                    {{bastext.ba_signature}}
                </div>
            </div>
            <!-- 两条帖子 -->
            <div class="item_bottom" v-if="contenttwo &&contenttwo.totalpage>0">
                <div v-for="(item,i) in contenttwo.result" :key="i" >
                    <RouterLink :to="`/bas/item/${bas.id}/${item.id}`" :title="item.title">
                        <span>{{item.title}}</span>
                    </RouterLink> 
                </div>
            </div>
            <div class="item_bottom" v-else>
                <span>没有帖子发言</span>
            </div>
        </RouterLink>
    </div>
</template>

<script>
// 吧列表---单个卡片
import {ref} from 'vue';
import {getBaContents,basSearch} from '@/api/bas';
export default {
    name:'djbaitem',
    props:{
        bas:{
            type:Object,
            default:()=>({})
        }
    },
    setup(props){
        const contenttwo=ref(null)
        // 每条贴吧的两条帖子(暂定,和传来数据大部分重合)
        getBaContents({query:props.bas.id,pagesize:2, pagenum:1}).then(data=>{
            contenttwo.value=data.data
        })
        //单个吧的全部信息（暂定,和传来数据大部分重合)
        const bastext=ref()
        basSearch(props.bas.id).then(data=>{
            if(data.meta.status!==200) return ElMessage.error('获取贴吧信息出错')
            bastext.value=data.data
        })
        return{contenttwo,bastext}
    }
}
</script>

<style lang='less' scoped>

    .body_item{
        float: left;
        border-radius: 6px;
        background-color: #fff;
        width: 390px;
        // height: 200px;
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
            // height: 50px;
            min-height: 50px;
            padding: 4px;
            span{
                padding-left: 10px;
                color: #999;
                max-height: 20px;
                overflow: hidden;
                display: -webkit-box;
                text-overflow: ellipsis;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
            }
        }
    }


</style>