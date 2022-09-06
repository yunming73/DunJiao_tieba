<template>
  <div class="revise_body">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        :size="formSize">
        <!-- 吧名称 -->
        <el-form-item label="吧名称" prop="baname" style="width:330px" >
            <el-input v-model="ruleForm.baname" />
        </el-form-item>
        <!-- 头像 -->
        <el-form-item label="头像">
            <a class="ba_img">
                <img :src="ruleForm.imgUrl" alt="">
                <input type="file" @change="add" class="ba_input" />
            </a>
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
// import {userRevise,reviseUserImg} from '@/api/user';
import {UploadBaImg,submitba} from '@/api/ba';
import {useStore} from 'vuex'
import {ElMessage} from 'element-plus'
export default {
    name:'homeuseritemsubmit',
    props:{
        subba:{
            type:Object,
            defalut:()=>({})
        }
    },
    setup(props){
        // console.log(props.subba);
        const formSize = ref('default')
        const ruleFormRef = ref()
        const store=useStore()
        const ruleForm = reactive({
            baname: props.subba.name,
            imgUrl:props.subba.img,
            signature: props.subba.ba_signature,
        })
        //验证规则
        const rules = reactive({
            baname: [
                { required: true, message: '请输入吧名称', trigger: 'blur' },
                { min: 2, max: 10, message: '长度应该是2-10', trigger: 'change' },
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
                UploadBaImg(param).then(data=>{
                    ruleForm.imgUrl='http://127.0.0.1:99/'+data.data.tmp_path
                })
            }
        }
        // 提交
        const submitForm = async (formEl) => {
        if (!formEl) return
        await formEl.validate((valid, fields) => {
            if (valid) {
                submitba({id:props.subba.id,name:ruleForm.baname,signature:ruleForm.signature,img:ruleForm.imgUrl}).then(data=>{
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