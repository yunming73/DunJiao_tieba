<template>
    <div class="body_content">
        <div class="body_content_form">
        <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="rules"
            label-width="120px"
            :size="formSize">
            <!-- 标题 -->
            <el-form-item label="标题" prop="itemtitle" style="width:330px" >
                <el-input v-model="ruleForm.itemtitle" />
            </el-form-item>
            <!-- 内容 -->
            <el-form-item label="内容" prop="itemcontent">
                <el-input v-model="ruleForm.itemcontent" type="textarea" />
            </el-form-item>
            <el-form-item v-if="shows" ref="userform" class="form_img">
                <!-- <Form  > -->
                    <div v-for="(item,i) in imgs" :key="i" class="form_img_1">
                        <el-image :src="item" 
                        :preview-src-list="imgs"
                        fit="cover"
                        lazy
                        close-on-press-escape:true
                        />
                    </div>
                <!-- </Form> -->
            </el-form-item>
            <!-- 按钮 -->
            <el-form-item>
                <!-- 上传图片 -->
                <el-button>上传图片</el-button>
                <input @change="add" type="file" class="kjj">
                <!-- 提交 -->
                <el-button type="primary" @click="submitForm(ruleFormRef)">发表</el-button>
                <!-- 重置 -->
                <el-button @click="resetForm(ruleFormRef)">重置</el-button>
            </el-form-item>
        </el-form>
        </div>
    </div>
</template>


<script>
// 发送帖子
import {ref,reactive} from 'vue';
import {addMainComment} from '@/api/bas';
import {uploadContent} from '@/api/bas'
import {useStore} from 'vuex'
import {ElMessage} from 'element-plus'
import { useRoute } from 'vue-router';
export default {
    name:'basaddcontentitem',
    setup(){
        // 图片
        const store=useStore()
        const userform=ref(null)
        var imgsrc=ref([]);
        const imgs=ref([])
        const shows=ref(false)
        const route=useRoute()
        // 图片上传
        const add=(data)=>{
            shows.value=true
            if(data==undefined){
                return
            }else if(imgs.value.length>3){
                return ElMessage({type: 'error',message: '一次最多四张图片上传'})
            }else{
                let file=data.target.files[0];
                let img=new FileReader();
                img.readAsDataURL(file)
                img.onload=({target})=>{
                    imgsrc.value=target.result;
                }   
                var param=new FormData();
                param.append("icon",file);
                uploadContent(param).then(data=>{
                    imgs.value.push('http://127.0.0.1:99/'+data.data.tmp_path)
                })
            }
        }
        const formSize = ref('default')
        const ruleFormRef = ref()
        const ruleForm = reactive({
            itemtitle: '',
            itemcontent: '',
        })
        //验证规则
        const rules = reactive({
            itemtitle: [
                { required: true, message: '请输入标题', trigger: 'blur' },
                { min: 2, max: 25, message: '长度最小2 最大25', trigger: 'blur' },
            ],
            itemcontent: [
                { required: true, message: '请输入帖子内容', trigger: 'blur' },
                {required: true, max: 300, message: '长度最大300', trigger: 'change' },
            ],
        })
        // 发表
        const submitForm = async (formEl) => {
        if (!formEl) return
        await formEl.validate((valid, fields) => {
            if (valid) {
                const  {itemtitle,itemcontent }=ruleForm
                const userid=store.state.user.profile.id
                const baid=route.params.id
                addMainComment({ title:itemtitle, content:itemcontent, baid:baid, userid:userid, img:imgs.value }).then(data=>{
                    // 消息提示
                    if(data.meta.status!==200) return ElMessage.error('发表主贴失败')
                    ElMessage({type: 'success',message: '发表主贴成功'})
                    imgs.value=[]
                    formEl.resetFields()
                    location.reload()
                })
            } else {
                ElMessage.error('主贴错误提交')
            }
        })
        }
        // 重置
        const resetForm = (formEl) => {
            if (!formEl) return
            imgs.value=[]
            formEl.resetFields()
        }
        
        return{shows,formSize,ruleFormRef,ruleForm,rules,submitForm,resetForm,add,userform,imgsrc,imgs}
    }
}
</script>


<style lang='less' scoped>
.form_img{
    width: 100%;
    height: 100%;
    display: flex;
    .form_img_1{
        width: 20%;
        margin-right: 10px;
    }
}
.kjj{
    width: 57px;
    height: 32px;
    opacity: 0;
    position: relative;
    left: -59px;
    top: 4px;
}
.body_content{
    margin-top: 10px;
    display: flex;
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 10px;
    .body_content_form{
        height: 100%;
        width: 80%;
        margin-top: 20px;
    }
}
</style>