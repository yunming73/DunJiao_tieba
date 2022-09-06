<template>
  <div class="revise_body">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        :size="formSize">
        <!-- 旧密码 -->
        <el-form-item label="旧密码" prop="oldpwd">
            <el-input v-model="ruleForm.oldpwd" type="password" autocomplete="off" />
        </el-form-item>
        <!-- 新密码 -->
        <el-form-item label="新密码" prop="newpwd">
            <el-input v-model="ruleForm.newpwd" type="password" autocomplete="off" />
        </el-form-item>
        <!-- 确认新密码 -->
        <el-form-item label="确认新密码" prop="renewpwd">
            <el-input v-model="ruleForm.renewpwd" type="password" autocomplete="off" />
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
// 修改密码
import {ref,reactive} from 'vue';
import {putpassword} from '@/api/user';
import {useStore} from 'vuex'
import {ElMessage} from 'element-plus'
export default {
    name:'memberrevise3',
    setup(){
        const formSize = ref('default')
        const ruleFormRef = ref()
        const store=useStore()
        const ruleForm = reactive({
            oldpwd: '',
            newpwd:'',
            renewpwd:'',
        })
        const validatePass1 = (rule,value, callback) => {
            if (value === '') {
                callback(new Error('请输入原密码'))
            } else {
                if (ruleForm.oldpwd !== '') {
                    if (!ruleFormRef.value) return
                }
                callback()
            }
        }
        const validatePass2 = (rule,value, callback) => {
            if (value === '') {
                callback(new Error('请输入新密码'))
            } else {
                if (ruleForm.newpwd !== '') {
                    if (!ruleFormRef.value) return
                    ruleFormRef.value.validateField('renewpwd', () => null)
                }
                callback()
            }
        }
        const validatePass3 = (rule,value, callback) => {
            if (value === '') {
                callback(new Error('请在此输入密码'))
            } else if (value !== ruleForm.newpwd) {
                callback(new Error("两个输入并不匹配!"))
            } else {
                callback()
            }
        }
        
        //验证规则
        const rules = reactive({
            oldpwd:[{required: true, validator: validatePass1, trigger: 'blur' }],
            newpwd: [{ required: true,validator: validatePass2, trigger: 'blur' }],
            renewpwd: [{ required: true,validator: validatePass3, trigger: 'blur' }],
        })
        // 提交修改密码
        const submitForm = (formEl) => {
            if (!formEl) return
            formEl.validate((valid) => {
                if (valid) {
                    putpassword({ userid:store.state.user.profile.id, oldpwd:ruleForm.oldpwd, newpwd:ruleForm.renewpwd }).then(data=>{
                        if(data.meta.status==200){
                            return ElMessage({type: 'success',message: '修改密码成功'})
                        }else if(data.meta.status==207){
                            return ElMessage.error('原密码错误')
                        }else{
                            return ElMessage.error('修改密码失败')
                        }
                    })
                } else {
                    ElMessage.error('错误提交')
                    return false
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