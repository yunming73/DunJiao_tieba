<template>
  <div class="login-center">
    <!-- 登录盒子 -->
    <div class="login-box">
        <!-- logo -->
        <RouterLink to="/" class="home_img">
            <img src="@/assets/img/logochang.png" alt="">
        </RouterLink>
        <!-- 注册 -->
        <Form ref="formCom" class="left" :validation-schema="schema" v-slot="{errors}">
            <h2>注册</h2>
            <div class="login_forms">
                <div class="form_item">
                    <Field type="text" v-model="form.username" name="username" :class="{error:errors.username}" placeholder="请输入用户名"/>
                    <!-- username验证错误提示 -->
                    <span v-if="errors.username" class="errors">
                        <!-- <i class="iconfont icon-warning" /> -->
                        {{ errors.username }}
                    </span>
                </div>
                <div class="form_item">
                    <Field type="password" v-model="form.password" name="password" :class="{error:errors.password}" placeholder="请输入密码"/>
                        <!-- password验证错误提示 -->
                        <span v-if="errors.password" class="errors">
                            <!-- <i class="iconfont icon-warning" /> -->
                            {{ errors.password }}
                        </span>
                </div>
                <div class="form_item">
                    <Field type="password" v-model="form.rePassword" name="rePassword" :class="{error:errors.rePassword}" placeholder="请再次输入密码"/>
                        <!-- password验证错误提示 -->
                        <span v-if="errors.rePassword" class="errors">
                            <!-- <i class="iconfont icon-warning" /> -->
                            {{ errors.rePassword }}
                        </span>
                </div>
                <!-- <div class="form_item">
                    <div class="code">
                        <Field type="text" v-model="form.code" name="code" :class="{error:errors.code}" placeholder="请输入验证码"/>
                        <button>获取验证码</button>
                    </div>
                    <span v-if="errors.code" class="errors">
                        {{ errors.code }}
                    </span>
                </div> -->
                <button type="button"  @click="signup()">注册</button>
            </div>
            <div class="login_bottom">
               <p>已有账号,去<RouterLink to="/login" class="bottm_a">登录</RouterLink></p>
            </div>
        </Form>
    </div>
  </div>
</template>

<script>

import {ref,reactive} from 'vue';
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import {userRegister} from '@/api/user'
import {useRouter} from 'vue-router'
import Message from '@/components/library/Message'
export default {
    name:'signup',
    components:{Form,Field},
    setup(){
    //表单数据对象
    const form=reactive({
        username:'',
        password:'',
        rePassword:'',
        // code:''
    })
    const mySchema={
        // 校验函数规则：返回true就是校验成功,返回一个字符串就是失败，字符串就是错误提示
        username:schema.username,
        password:schema.password,
        rePassword:schema.rePassword,
        // code:schema.code,
    }
    const router=useRouter()
    const formCom=ref(null)
    const signup=async()=>{
        const valid=await formCom.value.validate()
        if(valid){
        userRegister({username:form.username,password:form.password}).then(data=>{
            console.log(data);
        if(data.meta.status==200){
            router.push('/login')
            Message({type:'success',message:'注册成功'})
        }else if(data.meta.status==201){
            Message({type:'error',message:"用户名已存在"})
        }else{
            Message({type:'error',message:"注册失败"})
        }
        })
    }}
    return {form,schema:mySchema,signup,formCom}
    }
}
</script>

<style scoped lang="less">
.login-center{
    width: 100%;
    height: 100vh;
    // background:url(@/assets/img/login2.png) no-repeat;
    background-color: #fff;
    background-size: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .login-box{
        position: relative;
        width: 1000px;
        height: 600px;
        min-height: 600px;
        // background-color: #fff;
        border-radius: 5px;
        display: flex;
        box-shadow: 0 0 10px rgba(0,0,0,.2);
        justify-content: flex-end;
        background:url(@/assets/img/login.png) no-repeat;
        .home_img{
            position: absolute;
            top: 50px;
            left: 50px;
            width: 200px;
        }
        .left{
            padding: 30px;
            padding-top: 80px;
            backdrop-filter: blur(3px);
            width: 350px;
            height: 100%;
            
            display: flex;
            flex-direction: column;
            h2{
                display: flex;
                justify-content: center;

            }
            .login_forms{
                display: flex;
                flex-direction: column;
               .form_item{
                   position: relative;
                   display: flex;
                   flex-direction: column-reverse;
                    margin-bottom: 30px;
                &.error{
                    border-color: @warnColor;
                }
                input{
                    height: 40px;
                    border: 1px solid #e0dfdf;
                    border-radius: 5px;
                    padding: 15px;
                    &:focus{
                        border: 1px solid @xtxColor;
                    }
                }
                .errors{
                    position: absolute;
                    font-size: 12px;
                    margin-bottom: -20px;
                    color: @warnColor;
                    // i {
                    // font-size: 14px;
                    // margin-right: 2px;
                    // }
                }
                
                .code{
                    display: flex;
                    >button{
                    margin-left: 15px;
                    width: 100px;
                    height: 40px;
                    font-size: 13px;
                    border-radius: 10px;
                    border: none;
                    }
                }
               }
                >button{
                    height: 40px;
                    border-radius: 20px;
                    border: none;
                    background: @xtxColor;
                    color: #fff;
                }
            }
            
            .login_bottom{
                margin-top: 25px;
                position: relative;
                 display: flex;
                justify-content: center;
                .bottm_a{
                    color: #ef7d49;
                }
                p{
                    color: #7d7d7d;
                    &::before{
                        position: absolute;
                        content: '';
                        display: block;
                        width: 80%;
                        height: 1px;
                        background-color: #808595;
                        left: 25px;
                        top: -10px;
                    }
                }
            }
        }
    }
}
</style>