<template>
   <!-- 吧务 -->
    <div class="aside_top">
        <h3>吧务</h3>
        <div class="aside_top_1">
            <RouterLink :to="userInfo.id==$store.state.user.profile.id?`/member`:`/user/${userInfo.id}`" :title="userInfo.nickname||userInfo.username" class="aside_top_2">
                <img :src="userInfo.face" alt="">
                <div class="ba_admin">吧主</div>
            </RouterLink>
        </div>
        <div class="aside_2" >
            <span>小吧主(共{{0||userInfoTwoNum}}位)</span>
            <div class="aside_3" v-if="userInfoTwo">
                <div class="aside_3_1" href="" v-for="(item,i) in userInfoTwo" :key="i">
                    <RouterLink :to="item.id==$store.state.user.profile.id?`/member`:`/user/${item.id}`">
                        {{item.nickname||item.username}}
                    </RouterLink>
                </div>
            </div>
            <div class="aside_4">
                <RouterLink to="/member/revise/4-2">
                    <el-button type="primary" round>申请吧务</el-button>
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script>
//贴吧的吧务信息展示区域
import {ref} from 'vue';
import {userSearch} from '@/api/user'
import { ElMessage } from 'element-plus'
export default {
    name:'basadmin',
    props:{
        bastext:{
            type:Object,
            default:()=>({})
        }
    },
    setup(props){
        // console.log(props.bastext);
        const userInfo=ref([])
        const userInfoTwo=ref([])
        const userInfoTwoNum=ref(0)
        // 小吧主数量
        if(props.bastext.ba_team_ids!==null) userInfoTwoNum.value=props.bastext.ba_team_ids.length
        // 吧主信息
        userSearch(props.bastext.ba_user_id).then(data=>{
            if(data.meta.status!==200) return ElMessage.error('获取吧主用户信息失败')
            userInfo.value=data.data
            // console.log(userInfo.value);
        })
        // 小吧主信息
        for(let i in props.bastext.ba_team_ids){
            // console.log(props.bastext.ba_team_ids.length);
            userSearch(props.bastext.ba_team_ids[i]).then(data=>{
                // console.log(data);
                if(data.meta.status!==200) return ElMessage.error('获取小吧主用户信息失败')
                userInfoTwo.value.push(data.data)
            })
        }
        // console.log(userInfoTwo.value);
        return{userInfo,userInfoTwo,userInfoTwoNum}
        
    }
}
</script>

<style lang='less' scoped>
.aside_top{
        width: 230px;
        max-height: 230px;
        min-height: 190px;
        display: flex;
        flex-direction:column;
        padding: 10px;
        background-color: #fff;
        border: 1px solid #eee;
        border-radius: 10px;
        .aside_top_1{
            width: 80px;
            height: 80px;
            text-align: center;
            .aside_top_2{
                position: relative;
                display: flex;
                 .ba_admin{
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 30px;
                    height: 16px;
                    line-height: 16px;
                    background: rgba(0,0,0,.5);
                    color: #fff;
                }
            }
        }
        .aside_2{
            display: flex;
            flex: 1;
            flex-direction: column;
            span{
                font-size: 12px;
                font-weight: bold;
            }
            .aside_3{
                // flex:1;
                height: 40px;
                display: flex;
                flex-wrap:wrap;
                overflow: hidden;
                text-overflow:ellipsis;
                .aside_3_1{
                    margin:0 10px 0 0 ;
                    a{
                        font-size: 4px;
                        color: rgb(123, 123, 123);
                    }
                }
            }
            .aside_4{
                display: flex;
                flex: 1;
               align-items : center;
               justify-content: center;
            }
        }
    }
</style>