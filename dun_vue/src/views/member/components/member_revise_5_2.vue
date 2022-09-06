<template>
 <div class="revise_body">
    <div class="revise_body_top">
        <div class="revise_body_top_left">
            <el-form
                ref="addFormRef"
                :model="addForm"
                :rules="rules"
                label-width="65px"
                :size="formSize">
                <!-- 吧名称 -->
                <el-form-item label="吧" prop="baname" style="width:300px" >
                    <el-select v-model="addForm.baname" filterable @change='selectchange' >
                        <el-option
                        v-for="item in list"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <!-- 用户名 -->
                <el-form-item label="用户名" prop="username">
                    <el-select v-model="addForm.username" filterable @change='selectchangeUser'>
                        <el-option
                        v-for="item in listTwo"
                        :key="item.user_id"
                        :label="item.user_nickname||item.user_name"
                        :value="item.user_id"
                        />
                    </el-select>
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
        <!-- 选中用户信息 -->
        <div class="revise_body_top_right" style="boxShadow: boxShadowBase" v-if="selectUser">
            <div class="revise_body_top_right_left">
                <div class="revise_body_top_right_left" v-if="selectUser.face">
                    <RouterLink :to="selectUser.id==$store.state.user.profile.id?`/member`:`/user/${selectUser.id}`">
                        <img :src="selectUser.face" alt="">
                    </RouterLink>
                </div>
                <div class="revise_body_top_right_left_name">
                    <el-scrollbar>
                        <RouterLink :to="selectUser.id==$store.state.user.profile.id?`/member`:`/user/${selectUser.id}`">
                            {{selectUser.nickname||selectUser.username}}
                        </RouterLink>
                    </el-scrollbar>
                </div>
            </div>
            <div class="revise_body_top_right_right">
                <div class="revise_body_top_right_right_text" v-if="selectUser.username">
                    <p>用户名&ensp;:</p>
                    <p>{{selectUser.username}}</p>
                </div>
                <div class="revise_body_top_right_right_text" v-if="selectUser.sex">
                    <p>性别&ensp;:</p>
                    <p>{{selectUser.sex}}</p>
                </div>
                <div class="revise_body_top_right_right_text" v-if="selectUser.signature">
                    <p>个性签名&ensp;:</p>
                    <p>{{selectUser.signature}}</p>
                </div>
                <div class="revise_body_top_right_right_text" v-if="selectUser.email">
                    <p>邮箱&ensp;:</p>
                    <p>{{selectUser.email}}</p>
                </div>
            </div>
        </div>
    </div>
    <div class="revise_body_bottom" v-if="ba_team_ids!=[]">
        <div v-for="(item,i) in ba_team_ids" :key="i" class="revise_body_bottom_item">
        <MemberRevise52User :info='item' :baid='baid'/>
        </div>
    </div>
  </div>
</template>

<script>
// 添加吧务
import {ref,reactive} from 'vue';
import {addBaTeam,userSearch} from '@/api/user';
import {getBaUsers,basSearch} from '@/api/bas';
import {getUserBaAdmin} from '@/api/user';
import {useStore} from 'vuex'
import {ElMessage} from 'element-plus'
import MemberRevise52User from './member_revise_5_2_user.vue';
export default {
    name:'memberrevise52',
    components:{MemberRevise52User},
    setup(){
        const formSize = ref('default')
        const addFormRef = ref()
        const store=useStore()
        const addForm = reactive({
            baname: '',
            username: '',
        })
        //验证规则
        const rules = reactive({
            baname: [
                { required: true, message: '请输入吧名称', trigger: 'blur' },
            ],
            username: [
                { required: true, message: '请输入用户名称', trigger: 'blur' },
            ],
        })
        const list=ref([])
        getUserBaAdmin(store.state.user.profile.id).then(data=>{
            list.value=data.data 
        })
        const listTwo=ref([])
        const baid=ref(null)
        const ba_team_ids=ref([])
        // 选择吧
        const selectchange=(val)=>{
            // 关注吧的用户全部列表
            getBaUsers(val).then(data=>{
                if(data.meta.status!==200) return ElMessage.error('关注吧的用户全部列表出错')
                listTwo.value=data.data
            })
            // 选中的吧基本信息
            basSearch(val).then(data=>{
                if(data.meta.status!==200) return ElMessage.error('选中的吧基本信息出错')
                baid.value=data.data.id
                ba_team_ids.value=data.data.ba_team_ids
            })
        }
        // 选择用户
        const selectUser=ref([])
        const selectchangeUser=(val)=>{
            userSearch(val).then(data=>{
                if(data.meta.status!==200) return ElMessage.error('获取用户信息出错')
                selectUser.value=data.data
            })
        }
        // 提交
        const submitForm = async (formEl) => {
        if (!formEl) return
        await formEl.validate((valid, fields) => {
            if (valid) {
                // 修改信息
                const { baname, username }=addForm
                addBaTeam({ postid:baname, takeoverid:username }).then(data=>{
                    if(data.meta.status==201){
                        ElMessage.error('此人已经是吧务')
                    }else if(data.meta.status==200){
                        ElMessage({type: 'success',message: '添加吧务成功成功'})
                    }else{
                        ElMessage.error('添加吧务失败')
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
            selectUser.value=[]
            ba_team_ids.value=[]
        } 
        return{
            formSize,
            addFormRef,
            addForm,
            rules,
            submitForm,
            resetForm,
            list,
            listTwo,
            selectchange,
            baid,
            ba_team_ids,
            selectchangeUser,
            selectUser
        }
    }
}
</script>

<style scoped lang="less">
.revise_body{
    padding: 10px;
    display: flex;
    flex:1;
    flex-direction: column;
    align-items:center;
    // justify-content: center;
    .revise_body_top{
        display: flex;
        .revise_body_top_right{
            margin: 0 0 20px 34px;
            min-width: 320px;
            min-height: 130px;
            border: 2px dashed var(--el-border-color);
            display: flex;
                padding: 0 10px 0 0;
            .revise_body_top_right_left{
                width: 100px;
                    display: flex;
                    align-items:center;
                    justify-content:center;
                    flex-direction: column;
                .revise_body_top_right_left{
                    border: 3px solid #eee;
                    width: 80px;
                    height: 80px;
                    margin-bottom: 4px;
                }
                .revise_body_top_right_left_name{
                    width: 80%;
                    display: flex;
                    justify-content:center;
                }
            }
            .revise_body_top_right_right{
                flex: 1;
                display: flex;
                flex-direction:column;
                .revise_body_top_right_right_text{
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    margin: 10px 0 0 0;
                    p{
                        color: #9499a0;
                    }
                }
            }
        }
    }
    .revise_body_bottom{
        display: flex;
        width: 100%;
        flex-wrap:wrap;
        flex: 1;
        border: 2px dashed var(--el-border-color);
        .revise_body_bottom_item{
            display: flex;
            flex-direction: column;
            flex-wrap:wrap;
        }
    }
}
</style>