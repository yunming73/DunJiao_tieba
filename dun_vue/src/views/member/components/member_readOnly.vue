<template>
    <div class="readonly">
        <div class="readonly_title">
            <span>个人资料</span>
        </div>
        <div class="readonly_body">
            <div class="body_item" v-if="$store.state.user.profile.id">
                <p class="body_1">ID&nbsp;&nbsp;:</p>
                <p class="body_2">{{$store.state.user.profile.id}}</p>
            </div>
            <div class="body_item" v-if="$store.state.user.profile.username">
                <p class="body_1">用户&nbsp;&nbsp;:</p>
                <p class="body_2">{{$store.state.user.profile.username}}</p>
            </div>
            <div class="body_item" v-if="$store.state.user.profile.nickname">
                <p class="body_1">昵称&nbsp;&nbsp;:</p>
                <p class="body_2">{{$store.state.user.profile.nickname}}</p>
            </div>
            <div class="body_item" v-if="$store.state.user.profile.sex">
                <p class="body_1">性别&nbsp;&nbsp;:</p>
                <p class="body_2">{{$store.state.user.profile.sex}}</p>
            </div>
            <div class="body_item" v-if="$store.state.user.profile.signature">
                <p class="body_1">个性签名&nbsp;&nbsp;:</p>
                <p class="body_2">{{$store.state.user.profile.signature}}</p>
            </div>
            <div class="body_item" v-if="$store.state.user.profile.email">
                <p class="body_1">邮箱&nbsp;&nbsp;:</p>
                <p class="body_2">{{$store.state.user.profile.email}}</p>
            </div>
            <div class="body_item" v-if="$store.state.user.profile.add_time">
                <p class="body_1">加入时间&nbsp;&nbsp;:</p>
                <p class="body_2">{{$store.state.user.profile.add_time}}</p>
            </div>
        </div>
    </div>
</template>

<script>
// import {ref} from 'vue';
// import {userSearch} from '@/api/user'
// import {useStore} from 'vuex'
export default {
    name:'memberreadOnly',
    setup(){
        // const userread=ref({})
        // const store=useStore()
        // var user_id=store.state.user.profile.id
        // userSearch(user_id).then(data=>{
        //     userread.value=data.data
        //     // console.log(userread.value);
        // })
        // return{userread}
    }
}
</script>

<style scoped lang="less">
.readonly{
    width: 250px;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 15px 20px 18px;
    margin-bottom: 10px;
    .readonly_title{
        display: flex;
        padding-bottom: 10px;
        border-bottom: 1px solid #e5e9ef;
        margin-bottom: 20px;
        justify-content: space-between;
        span{
            line-height: 23px;
            font-size: 14px;
            color: #222;
        }
    }
    .readonly_body{
         display: flex;
        //  justify-content: space-between;
        flex-direction: column;
        .body_item{
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin: 10px 0 10px 0;
            .body_1{
                line-height: 16px;
                color: #9499a0;
            }
            .body_2{
                line-height: 16px;
                color: #6d757a;
                font-size: 12px;
            }
        }
    }
}
</style>