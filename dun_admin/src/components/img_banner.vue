<template>
  <div class="revise_body">
    <!-- 图片上传 -->
    <div class="body_left">
      <div ref="userform">
        <img :src="form.imgUrl">
      </div>
      <div>
          <div>
              跳转地址&nbsp;:
          </div>
          <el-input v-model="form.hrefUrl" clearable></el-input>
      </div>
      <div class="body_right">
        <el-button>上传图片</el-button><input @change="add" type="file" class="kjj">  
        <el-button @click="revise()">确认修改</el-button>
      </div>
    </div>
  </div>
</template>

<script>
// 修改轮播图
import { ref,reactive } from 'vue-demi'
// import {upload,reviseUserImg} from '@/api/user';
import {UploadBanner,subbanner} from '@/api/home';
import { useStore } from 'vuex'
import {ElMessage} from 'element-plus'
export default {
    name:'imgbanner',
    props:{
        img:{
            type:Object,
            default:()=>({})
        }
    },
    setup(props){
      const store=useStore()
      const form=reactive({
        id:props.img.id,
        imgUrl:props.img.imgUrl,
        hrefUrl:props.img.hrefUrl
      })
      console.log(form.hrefUrl);
      const userform=ref(null)
      const add=(data)=>{
        if(data==undefined){
          return
        }else{
          let file=data.target.files[0];
          let img=new FileReader();
          img.readAsDataURL(file)
          img.onload=({target})=>{
          form.imgUrl=target.result;
          }
          var param=new FormData();
          param.append("icon",file);
            UploadBanner(param).then(data=>{
              form.imgUrl='http://127.0.0.1:99/'+data.data.tmp_path
            })
        }
      }
      const revise=()=>{
        subbanner({id:form.id,img:form.imgUrl,url:form.hrefUrl}).then(data=>{
            if(data.meta.status!==200) return ElMessage.error('修改轮播图失败')
            ElMessage({message: '修改轮播图成功',type: 'success',})
        })
      }
      return{add,userform,form,revise}
    }
    }
</script>

<style scoped lang="less">
.revise_body{
    // width: 70%;
    width: 300px;
      height: 300px;
    display: flex;
    justify-content: center;
    margin: 16px 120px 0 0;
    .body_left{
      // width: 300px;
      // height: 300px;
      width: 100%;
      height: 100%;
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