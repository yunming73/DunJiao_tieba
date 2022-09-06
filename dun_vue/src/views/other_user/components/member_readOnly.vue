<template>
  <div class="readonly">
      <div class="readonly_title">
          <span>个人资料</span>
      </div>
      <div class="readonly_body">
         <div class="body_item" v-if="userread.id">
              <p class="body_1">ID&nbsp;&nbsp;:</p>
              <p class="body_2">{{userread.id}}</p>
          </div>
          <div class="body_item" v-if="userread.username">
              <p class="body_1">用户名&nbsp;&nbsp;:</p>
              <p class="body_2">{{userread.username}}</p>
          </div>
          <div class="body_item" v-if="userread.nickname">
              <p class="body_1">昵称&nbsp;&nbsp;:</p>
              <p class="body_2">{{userread.nickname}}</p>
          </div>
          <div class="body_item" v-if="userread.sex">
              <p class="body_1">性别&nbsp;&nbsp;:</p>
              <p class="body_2">{{userread.sex}}</p>
          </div>
          <div class="body_item" v-if="userread.signature">
              <p class="body_1">个性签名&nbsp;&nbsp;:</p>
              <p class="body_2">{{userread.signature}}</p>
          </div>
          <div class="body_item" v-if="userread.email">
              <p class="body_1">邮箱&nbsp;&nbsp;:</p>
              <p class="body_2">{{userread.email}}</p>
          </div>
          <div class="body_item" v-if="userread.add_time">
              <p class="body_1">加入时间&nbsp;&nbsp;:</p>
              <p class="body_2">{{userread.add_time}}</p>
          </div>
      </div>
  </div>
</template>

<script>
import {ref} from 'vue';
import {userSearch} from '@/api/user'
import {useRoute} from 'vue-router'
export default {
    name:'memberreadOnly',
    setup(){
        const userread=ref({})
        const route=useRoute()
        var user_id=route.params.id
        userSearch(user_id).then(data=>{
            userread.value=data.data
            // console.log(userread.value);
        })
        return{userread}
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