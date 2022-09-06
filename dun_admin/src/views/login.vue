<template>
  <div class="login-center">
        <!-- 登录盒子 -->
        <div class="login-box">
        <!-- 头像 -->
        <div class="avatar-box">
            <img src="../assets/img/logo.png" alt="">
        </div>
          <!-- 登录表单区域 -->
          <el-form ref='loginForm' :model='loginform' :rules='rules'  label-width="0px" class="login_form">
            <!-- 用户名 -->
            <el-form-item prop='username' hide-required-asterisk='true' >
              <el-input  v-model="loginform.username" ></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop='password'>
              <el-input  v-model="loginform.password" type="password"></el-input>
            </el-form-item>
            <!-- 按钮 -->
            <el-form-item class="login_button" >
              <el-button type="primary" @click='login(loginForm)'>登录</el-button>
              <el-button type="info" @click='restForm(loginForm)'>重置</el-button>
            </el-form-item>
          </el-form>
        </div>
  </div>
</template>

<script>
import { reactive,ref } from "vue"
import { ElMessage } from 'element-plus'
import {useRouter} from 'vue-router'
import {AdminLogin} from '@/api/user';
import {useStore} from 'vuex'
export default {
  name:'login',
  setup(){
    const loginform=reactive({
      username:'',
      password:''
    })
    const rules=reactive({
      username:[
          {required:true,message:'请输入用户名',trigger:'blur'},
          {min:3,max:10,message:'长度在3到10字符',trigger:'blur'}
      ],
      password:[
          {required:true,message:'请输入密码',trigger:'blur'},
          {min:6,max:12,message:'长度在6到12字符',trigger:'blur'}
      ]
    })
    const loginForm=ref('')
    const router=useRouter()
    const store=useStore()
    const login=async (formEl)=>{
      if(!formEl) return
      await formEl.validate((valid,faields)=>{
        if(valid){
          AdminLogin({username:loginform.username,password:loginform.password}).then(data=>{
            // 登录成功 保存token到客户端
            const {id,username,nickname,face,sex,email,signature,token}=data.data
            store.commit('user/setUser',{id,username,nickname,face,sex,email,signature,token})
            // 成功消息提示
            if(data.meta.status==200){
                ElMessage({type:'success',message:'登录成功'})
                router.push('/home')
            }else{
                ElMessage({type:'error',message:"登录失败"})
            }  
          })
        }else{
          ElMessage({type:'error',message:"登录信息出错"})
          // console.log('err',faields);
        }
      })
    }
    const restForm=(formEl)=>{
      if(!formEl) return
      formEl.resetFields()
    }
    return{loginform,rules,login,restForm,loginForm}
  }
   
}
</script>

<style lang="less" scoped>
.login-center{
    background-color: #2b5b6b;
    height: 100%;
}
.login-box{
    width: 450px;
    height: 300px;
    background: #fff;
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%); 
    border-radius: 10px;
}
.avatar-box{
    height: 130px;
    width: 130px;
    border: 1px solid #fff;
    border-radius: 50%;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    box-shadow: 0 0 10px #ddd;
}
.avatar-box img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #fff;
}
.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.login_form .login_button{
    /*弹性盒模型*/
    display: flex;
    justify-content: end;
    // justify-content:space-between;
    
}
</style>