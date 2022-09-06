<template>
    <div class="add_text">
        <div class="add_text_face">
            <div class="face_avatar">
                <img :src="$store.state.user.profile.face" alt="">
            </div>
        </div>
        <div class="add_text_container">
            <el-form ref="ruleFormRef" :rules="rules" :model="form">
                <el-form-item prop="desc">
                    <el-input type="textarea" v-model="form.desc" />
                </el-form-item>
            </el-form>
        </div>
        <div class="add_button">
            <!-- 提交 -->
            <el-button type="primary" @click="onSubmit(ruleFormRef)" class="add_button_1">发送评论</el-button>    
        </div>
    </div>
</template>
<script>
// 评论添加
import { reactive } from '@vue/reactivity'
import {ref} from 'vue'
import {addContentsComments,readdContentsComments} from '@/api/bas';
import {ElMessage} from 'element-plus'
export default {
    name:'bascontentcommentitemaddtext',
    props:{
        addinfo:{
            type:Object,
            default:()=>({})
        }
    },
    setup(props){
        // console.log(props.addinfo);
        const form =reactive({desc:''})
        const rules=reactive({desc:[
            { required: true, message: '请输入内容', trigger: 'blur' },
            { max: 50, message: '长度最大50', trigger: 'change' },
        ]})
        const ruleFormRef=ref(null)
        const onSubmit = async (formEl) => {
        if (!formEl) return
        await formEl.validate((valid, fields) => {
            if (valid) {
                if(props.addinfo.respondid){
                    // 用户回复评论
                    const {userid, fatherid, postid, mainid , respondid}=props.addinfo
                    readdContentsComments({ content:form.desc, userid, fatherid, postid, mainid, respond:respondid }).then(data=>{
                        if(data.meta.status!==200) return ElMessage.error('回复发送失败')
                        ElMessage({type: 'success',message: '回复发送成功'})
                        formEl.resetFields()
                        location.reload()
                    })
                }else{
                    // 用户评论从贴
                    const  {userid, fatherid, postid, mainid}=props.addinfo
                    addContentsComments({content:form.desc, userid, fatherid, postid, mainid}).then(data=>{
                        // console.log(data);
                        if(data.meta.status!==200) return ElMessage.error('发送失败')
                        ElMessage({type: 'success',message: '发送成功'})
                        formEl.resetFields()
                        location.reload()
                    })
                }
                
            } else {
                ElMessage.error('发送失败')
            }
        })
        }
      return{form,onSubmit,rules,ruleFormRef}
    }
}
</script>


<style lang='less' scoped>
.add_text{
    // margin: 10px 30px;
    padding: 10px 0 0 30px;
    display: flex;
    // align-items:center;
    .add_text_face{
        width: 82px;
        height: 65px;
        display: flex;
        // align-items:center;
        .face_avatar{
            width: 48px;
            height: 48px;
            border-radius: 50%;
            img{
                border-radius: 50%;
                width: 100%;
                height: 100%;
            }
        }
    }
    .add_text_container{
        // display: flex;
        align-items:center;
        width: 500px;
    }
    .add_button{
        .add_button_1{
            margin-left: 10px;
            width: 57px;
            height: 52px;
        }
    }
}
</style>