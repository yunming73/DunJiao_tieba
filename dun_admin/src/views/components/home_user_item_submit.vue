<template>
  <div class="revise_body">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        :size="formSize">
        <!-- 昵称 -->
        <el-form-item label="昵称" prop="nickname" style="width:330px" >
            <el-input v-model="ruleForm.nickname" />
        </el-form-item>
        <!-- 姓名 -->
        <el-form-item label="姓名">
            <span style="color:#898989">{{ruleForm.username}}</span>
        </el-form-item>
        <!-- 头像 -->
        <el-form-item label="头像">
            <a class="ba_img">
                <img :src="ruleForm.imgUrl" alt="">
                <input type="file" @change="add" class="ba_input" />
            </a>
        </el-form-item>
        <!-- 性别 -->
        <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="ruleForm.sex">
                <el-radio label="男" />
                <el-radio label="女" />
            </el-radio-group>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email" style="width:330px" >
            <el-input v-model="ruleForm.email" type="email" />
        </el-form-item>
        <!-- 签名 -->
        <el-form-item label="个性签名" prop="signature">
            <el-input v-model="ruleForm.signature" type="textarea" />
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item>
            <!-- 提交 -->
            <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
            <!-- 重置 -->
            <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {ref,reactive} from 'vue';
import {userRevise,reviseUserImg,upload} from '@/api/user';
import {useStore} from 'vuex'
import {ElMessage} from 'element-plus'
export default {
    name:'homeuseritemsubmit',
    props:{
        subuser:{
            type:Object,
            defalut:()=>({})
        }
    },
    setup(props){
        const formSize = ref('default')
        const ruleFormRef = ref()
        const store=useStore()
        const ruleForm = reactive({
            nickname: props.subuser.nickname,
            username: props.subuser.username,
            imgUrl:props.subuser.face,
            sex: props.subuser.sex,
            email:props.subuser.email,
            signature: props.subuser.signature,
        })
        //验证规则
        const rules = reactive({
            nickname: [
                { required: true, message: '请输入昵称', trigger: 'blur' },
                { min: 2, max: 7, message: '长度应该是2-7', trigger: 'change' },
            ],
            sex: [
                {
                required: true,
                message: '请选择性别',
                trigger: 'change',
                },
            ],
            email:[
                { 
                required: true, 
                type: 'email', 
                message: '邮箱格式错误', 
                trigger: 'change' }
            ],
            signature: [
            { max: 20, message: '长度最大20', trigger: 'change' },
            ],
        })
         // 图片上传
        const add=(data)=>{
            if(data==undefined){
                return
            }else{
                let file=data.target.files[0];
                let img=new FileReader();
                img.readAsDataURL(file)
                img.onload=({target})=>{
                    ruleForm.imgUrl=target.result;
                }
            var param=new FormData();
            param.append("icon",file);
                upload(param).then(data=>{
                    ruleForm.imgUrl='http://127.0.0.1:99/'+data.data.tmp_path
                })
            }
        }
        // 提交
        const submitForm = async (formEl) => {
        if (!formEl) return
        await formEl.validate((valid, fields) => {
            if (valid) {
                // 修改信息
                const  { nickname, email, sex, signature,imgUrl }=ruleForm
                userRevise({id:props.subuser.id, nickname, email, sex, signature}).then(data=>{
                    if(data.meta.status!==200) return ElMessage.error('修改失败')
                    ElMessage({type: 'success',message: '修改成功'})
                })
                reviseUserImg({id:props.subuser.id,tmp_path:imgUrl}).then(data=>{
                    if(data.meta.status!==200) return ElMessage.error('修改头像失败')
                })
            } else {
                ElMessage.error('错误提交')
            }
        })
        }
        // 重置
        const resetForm = (formEl) => {
            if (!formEl) return
            formEl.resetFields()
        }
        
        return{formSize,ruleFormRef,ruleForm,rules,submitForm,resetForm,add}
    }
}
</script>

<style scoped lang="less">
.revise_body{
    // padding: 20px 20px 0 20px;
    width: 80%;
}
.ba_img{
        width: 124px;
        height:124px;
        border: 1px solid #d6dee4;
    }
    .ba_input{
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        height:124px; 
        width:124px
    }
</style>