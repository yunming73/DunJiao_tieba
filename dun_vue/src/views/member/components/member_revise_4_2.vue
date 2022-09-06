<template>
  <div class="revise_body">
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="rules"
        label-width="120px"
        :size="formSize">
        <!-- 吧名称 -->
        <el-form-item label="吧名称" prop="baname" style="width:330px" >
            <el-select v-model="addForm.baname" clearable filterable @change='selectchange'>
                <el-option
                v-for="item in list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                />
            </el-select>
        </el-form-item>
        <!-- 申请人用户名 -->
        <el-form-item label="申请人">
            <span style="color:#898989">{{addForm.username}}</span>
        </el-form-item>
        <!-- 介绍自己 -->
        <el-form-item label="介绍自己" prop="content">
            <el-input v-model="addForm.content" type="textarea" />
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
// 吧务申请
import {ref,reactive} from 'vue';
import {applicationTeam} from '@/api/user';
import {getBas,basSearch} from '@/api/bas'
import {useStore} from 'vuex'
import {ElMessage} from 'element-plus'
export default {
    name:'memberrevise42',
    setup(){
        const formSize = ref('default')
        const addFormRef = ref()
        const store=useStore()
        const addForm = reactive({
            baname: '',
            username:store.state.user.profile.nickname||store.state.user.profile.username,
            content: '',
        })
        //验证规则
        const rules = reactive({
            baname: [
                { required: true, message: '请输入吧名称', trigger: 'blur' },
            ],
            content: [
            { required: true, message: '请输入内容', trigger: 'blur' },
            ],
        })
        const list=ref([])
        getBas({query:''}).then(data=>{
            list.value=data.data.result
            // console.log(list.value);
        })
        const ba_info=([])
        const selectchange=(val)=>{
            // console.log(val);
            basSearch(val).then(data=>{
                if(data.meta.status!==200) ElMessage.error('获取吧信息出错') 
                ba_info.value=data.data
                // console.log(ba_info.value);
            })
        }
        // 提交
        const submitForm = async (formEl) => {
        if (!formEl) return
        await formEl.validate((valid, fields) => {
            if (valid) {
                // 修改信息
                const { baname, username, content}=addForm
                applicationTeam({ user_id:store.state.user.profile.id, takeover_id:ba_info.value.ba_user_id, post_id:baname, content:content }).then(data=>{
                    // 消息提示
                    if(data.meta.status==201){
                        ElMessage.error('已经发送申请吧务')
                    }else if(data.meta.status==202){
                        ElMessage.error('你已经是该吧吧务')
                    }else if(data.meta.status==200){
                        ElMessage({type: 'success',message: '发送申请吧务成功'})
                        formEl.resetFields()
                    }else{
                        ElMessage.error('申请吧务出错')
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
        
        return{
            formSize,
            addFormRef,
            addForm,
            rules,
            submitForm,
            resetForm,
            list,
            selectchange
        }
    }
}
</script>

<style scoped lang="less">
.revise_body{
    padding: 50px 20px 0 20px;
    width: 70%;
}
</style>