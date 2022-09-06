<template>
  <div class="revise_body">
    <!-- 图片上传 -->
    <div class="body_left">
      <Form ref="userform">
        <img :src="$store.state.user.profile.face" alt="" class="nameimg" v-if="!imgsrc">
        <img :src="imgsrc" v-else>
      </Form>
      <div class="body_right">
        <el-button>上传</el-button><input @change="add" type="file" class="kjj">  
        <el-button @click="revise()">修改</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// 修改用户头像
import { ref,reactive } from 'vue-demi'
import { Form, Field } from 'vee-validate'
import {upload,reviseUserImg} from '@/api/user';
import { useStore } from 'vuex'
import {ElMessage} from 'element-plus'
export default {
    name:'member_revise_2',
    components:{Form ,Field},
    setup(){
    //  const ass=ref(false)
      const store=useStore()
      const form=reactive({
        imgUrl:store.state.user.profile.face,
      })
      var imgsrc=ref(store.state.user.profile.face);
      const userform=ref(null)
      const add=(data)=>{
        if(data==undefined){
          return
        }else{
          let file=data.target.files[0];
          let img=new FileReader();
          img.readAsDataURL(file)
          img.onload=({target})=>{
          imgsrc.value=target.result;
            // console.log(imgsrc);
          }
          var param=new FormData();
          param.append("icon",file);
            upload(param).then(data=>{
              // console.log(data.data);
              form.imgUrl='http://127.0.0.1:99/'+data.data.tmp_path
              // console.log(form);
            })
            // console.log(form);
          // store.state.user.profile.nameimg=form.imgUrl
        }
      }
      // console.log(form.imgUrl);
      const revise=()=>{
        reviseUserImg({id:store.state.user.profile.id,tmp_path:form.imgUrl}).then(data=>{
          // console.log(data);
          if(data.data.id==store.state.user.profile.id){
            const token=store.state.user.profile.token
            const { id,username,nickname,face, email, sex, signature }=data.data
            store.commit('user/setUser',{ id,username,nickname,face, email, sex, signature ,token})
            ElMessage({message: '修改头像成功',type: 'success',})
          }else{
             ElMessage.error('修改失败')
          }
        })
      }
      return{add,userform,form,revise,imgsrc}
    }
    }
</script>

<style scoped lang="less">
.revise_body{
    width: 70%;
    display: flex;
    justify-content: center;
    .body_left{
      width: 300px;
      height: 300px;
      margin-top: 16px;
    }
    .body_right{
      display: flex;
      margin-top: 10px;
      justify-content  :space-around;
    }
}
.kjj{
  width: 88px;
  height: 32px;
  opacity: 0;
  position: relative;
  left: -102px;
  top: 4px;
}
</style>