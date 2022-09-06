<template>
  <div class="revise_body">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        :size="formSize">
        <!-- 吧名称 -->
        <el-form-item label="吧" prop="baname" style="width:400px" >
            <el-select v-model="ruleForm.baname" clearable filterable @change='selectchange' >
                <el-option
                v-for="item in list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                />
            </el-select>
        </el-form-item>
        <!-- 吧头像 -->
        <el-form-item label="吧头像">
            <a class="ba_img" v-if="form.imgUrl">
                <img :src="form.imgUrl" alt="">
                <input type="file" @change="add" class="ba_input" />
            </a>
        </el-form-item>
        <!-- 吧介绍 -->
        <el-form-item label="吧介绍" prop="signature">
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
import {getUserBaAdmin,UploadBaImg,submitba} from '@/api/user';
import {basSearch} from '@/api/bas';
import {useStore} from 'vuex'
import {ElMessage} from 'element-plus'
export default {
    name:'memberrevise53',
    setup(){
        const formSize = ref('default')
        const ruleFormRef = ref()
        const store=useStore()
        const ruleForm = reactive({
            baid: '',
            baname: '',
            signature: '',
        })
        const form=reactive({
            imgUrl:'',
        })
        // 用户可选的吧
        const list=ref([])
        getUserBaAdmin(store.state.user.profile.id).then(data=>{
            list.value=data.data
        })
        const selectchange=(val)=>{
            basSearch(val.toString()).then(data=>{
                ruleForm.baid=data.data.id
                ruleForm.baname=data.data.name
                ruleForm.signature=data.data.ba_signature
                form.imgUrl=data.data.img
            })
        }
        // 图片上传
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
                UploadBaImg(param).then(data=>{
                    form.imgUrl='http://127.0.0.1:99/'+data.data.tmp_path
                })
            }
        }
        //验证规则
        const rules = reactive({
            baname: [
                { required: true, message: '请输入吧名称', trigger: 'blur' },
            ],
            signature: [
                { required: true,max: 20, message: '长度最大20', trigger: 'change' },
            ],
        })
        // 提交
        const submitForm = async (formEl) => {
            if (!formEl) return
            await formEl.validate((valid, fields) => {
                if (valid) {
                    submitba({id:ruleForm.baid,name:ruleForm.baname,signature:ruleForm.signature,img:form.imgUrl}).then(data=>{
                        if(data.meta.status!==200) return ElMessage.error('修改吧信息失败')
                        ElMessage({message: '修改吧信息成功',type: 'success',})
                        formEl.resetFields()
                        form.imgUrl=''
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
            form.imgUrl=''
        }
        return{
            formSize,
            ruleFormRef,
            ruleForm,
            rules,
            submitForm,
            resetForm,
            form,
            list,
            selectchange,
            add
            }
    }
}
</script>

<style scoped lang="less">
.revise_body{
    position: relative;
    padding: 50px 20px 0 20px;
    width: 70%;
    .ba_img{
        width: 124px;
        height:124px;
    }
    .ba_input{
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        height:124px; 
        width:124px
    }
}
</style>