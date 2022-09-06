<template>
  <div class="revise_body">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        :size="formSize">
        <!-- 昵称 -->
        <el-form-item label="昵称" prop="nickname" style="width:330px" >
            <el-input v-model="ruleForm.nickname" />
        </el-form-item>
        <!-- 姓名 -->
        <el-form-item label="姓名">
            <span style="color:#898989">{{ruleForm.username}}</span>
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
// 修改用户信息
import {ref,reactive} from 'vue';
import {userRevise} from '@/api/user';
import {useStore} from 'vuex'
import {ElMessage} from 'element-plus'
export default {
    name:'memberrevise1',
    setup(){
        const formSize = ref('default')
        const ruleFormRef = ref()
        const store=useStore()
        const ruleForm = reactive({
            nickname: store.state.user.profile.nickname,
            username: store.state.user.profile.username,
            sex: store.state.user.profile.sex,
            email:store.state.user.profile.email,
            signature: store.state.user.profile.signature,
        })
        // console.log(ruleForm);
        //验证规则
        const rules = reactive({
        nickname: [
            // { required: true, message: '请输入昵称', trigger: 'blur' },
            { min: 2, max: 7, message: '长度应该是2-7', trigger: 'change' },
        ],
        sex: [
            {
            // required: true,
            message: '请选择性别',
            trigger: 'change',
            },
        ],
        email:[
            { 
            // required: true, 
            type: 'email', 
            message: '邮箱格式错误', 
            trigger: 'change' }
        ],
        signature: [
           { max: 20, message: '长度最大20', trigger: 'change' },
        ],
        })
        // 提交
        const submitForm = async (formEl) => {
        if (!formEl) return
        await formEl.validate((valid, fields) => {
            if (valid) {
                // 修改信息
                const id=store.state.user.profile.id
                const username=store.state.user.profile.username
                const token=store.state.user.profile.token
                const face=store.state.user.profile.face
                const  { nickname, email, sex, signature }=ruleForm
                userRevise({id:id, nickname, email, sex, signature}).then(data=>{
                    // 存储用户信息
                    const {nickname,sex,email,signature}=data.data
                    store.commit('user/setUser',{id,username,nickname,sex,email,signature,face,token})
                    // 消息提示
                    if(data.meta.status!==200) return ElMessage.error('修改失败')
                    ElMessage({type: 'success',message: '修改成功'})
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
        
        return{formSize,ruleFormRef,ruleForm,rules,submitForm,resetForm}
    }
}
</script>

<style scoped lang="less">
.revise_body{
    padding: 20px 20px 0 20px;
    width: 70%;
}
</style>