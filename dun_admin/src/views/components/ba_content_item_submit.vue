<template>
  <div class="revise_body">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        :size="formSize">
        <!-- 标题 -->
        <el-form-item label="标题" prop="title" style="width:330px" >
            <el-input v-model="ruleForm.title" />
        </el-form-item>
        <!-- 内容 -->
        <el-form-item label="内容" prop="content">
            <el-input v-model="ruleForm.content" type="textarea" />
        </el-form-item>
        <!-- 图片 -->
        <el-form-item label="图片" v-if="ruleForm.imgUrl">
            <div class="ba_img" v-for="(item,i) in ruleForm.imgUrl " :key="i">
                <ImgItem :img='item' :itemkey='i' @change="imgss"/>
            </div>
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
// 修改主贴信息
import {ref,reactive} from 'vue';
import {submitMainComment} from '@/api/ba';
import ImgItem from '@/components/img_item.vue';
import {useStore} from 'vuex'
import {ElMessage} from 'element-plus'
export default {
    name:'homeuseritemsubmit',
    components:{ImgItem},
    props:{
        subcontent:{
            type:Object,
            defalut:()=>({})
        }
    },
    setup(props){
        // console.log(props.subcontent);
        const formSize = ref('default')
        const ruleFormRef = ref()
        const store=useStore()
        const ruleForm = reactive({
            title: props.subcontent.title,
            imgUrl:props.subcontent.img,
            content: props.subcontent.content,
        })
        //验证规则
        const rules = reactive({
            title: [
                { required: true, message: '请输入标题', trigger: 'blur' },
                { min: 2, max: 16, message: '长度最小2 最大16', trigger: 'blur' },
            ],
            content: [
                { required: true, message: '请输入帖子内容', trigger: 'blur' },
                {required: true, max: 50, message: '长度最大50', trigger: 'change' },
            ],
        })
        const imgss=(val)=>{
            ruleForm.imgUrl[val.i]=val.img
            // console.log(ruleForm.imgUrl);
        }
        // 提交
        const submitForm = async (formEl) => {
        if (!formEl) return
        await formEl.validate((valid, fields) => {
            if (valid) {
                submitMainComment({id:props.subcontent.id,title:ruleForm.title,content:ruleForm.content,img:ruleForm.imgUrl}).then(data=>{
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
        
        return{formSize,ruleFormRef,ruleForm,rules,submitForm,resetForm,imgss}
    }
}
</script>

<style scoped lang="less">
.revise_body{
    // padding: 20px 20px 0 20px;
    width: 80%;
}
</style>