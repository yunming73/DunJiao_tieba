<template>
  <div class="revise_body">
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="rules"
        label-width="120px"
        :size="formSize">
        <!-- 吧名称 -->
        <el-form-item label="名称" prop="baname" style="width:330px" >
            <el-input v-model="addForm.baname" />
        </el-form-item>
        <!-- 申请人用户名 -->
        <el-form-item label="申请人">
            <span style="color:#898989">{{addForm.username}}</span>
        </el-form-item>
        <!-- 简介 -->
        <el-form-item label="创建原因" prop="reason">
            <el-input v-model="addForm.reason" type="textarea" />
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item>
            <!-- 提交 -->
            <el-button type="primary" @click="submitForm(addFormRef)">提交</el-button>
            <!-- 重置 -->
            <el-button @click="resetForm(addFormRef)">重置</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {ref,reactive} from 'vue';
import {createBa} from '@/api/user';
import {useStore} from 'vuex'
import {ElMessage} from 'element-plus'
export default {
    name:'memberrevise43',
    setup(){
        const formSize = ref('default')
        const addFormRef = ref()
        const store=useStore()
        const addForm = reactive({
            baname: '',
            username:store.state.user.profile.nickname||store.state.user.profile.username,
            reason: '',
        })
        // console.log(addForm);
        //验证规则
        const rules = reactive({
        baname: [
            { required: true, message: '请输入吧名称', trigger: 'blur' },
            { min: 2, max: 10, message: '长度应该是2-10', trigger: 'change' },
        ],
        reason: [
            { required: true, message: '请输入为什么申请创建该吧', trigger: 'blur' },
           { max: 124, message: '长度最大124', trigger: 'change' },
        ],
        })
        // 提交
        const submitForm = async (formEl) => {
        if (!formEl) return
        await formEl.validate((valid, fields) => {
            if (valid) {
                const  { baname, username, reason }=addForm
                createBa({ user_id:store.state.user.profile.id,ba_name:baname, content:reason, }).then(data=>{
                    if(data.meta.status==201){
                        return ElMessage.error('已经发送申请创建该贴吧')
                    }else if(data.meta.status==1){
                        return ElMessage.error('发送申请创建该贴吧失败')
                    } else{
                        formEl.resetFields()
                        return ElMessage({type: 'success',message: '发送申请创建该贴吧成功'})
                    }
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
        return{formSize,addFormRef,addForm,rules,submitForm,resetForm}
    }
}
</script>

<style scoped lang="less">
.revise_body{
    padding: 50px 20px 0 20px;
    width: 70%;
}
</style>