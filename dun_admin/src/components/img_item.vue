<template>
  <div class="ba_img">
    <img :src="imgUrl" alt="">
    <input type="file" @change="add" class="ba_input" />
  </div>
</template>

<script>
// 单张图片上传模块
import {ref} from 'vue';
import {uploadContent} from '@/api/ba';
export default {
    name:'imgitem',
    props:{
        img:{
            type:String,
            defalut:''
        },
        itemkey:{
            type:Number,
            default:0
        }
    },
    emits:['change'],
    setup(props,{emit}){
        const imgUrl=ref(props.img)
        // 图片上传
        const add=(data)=>{
            if(data==undefined){
                return
            }else{
                let file=data.target.files[0];
                let img=new FileReader();
                img.readAsDataURL(file)
                img.onload=({target})=>{
                    imgUrl.value=target.result;
                }
            var param=new FormData();
            param.append("icon",file);
                uploadContent(param).then(data=>{
                    imgUrl.value='http://127.0.0.1:99/'+data.data.tmp_path
                    // console.log(imgUrl.value);
                    // 让组件支持change事件
                    // console.log(props.itemkey);
                    emit('change',{img:imgUrl.value,i:props.itemkey})
                })
            }
        }
        return {add,imgUrl}
    }
}
</script>
<style scoped lang="less">
.ba_img{
        width: 100%;
        height:80%;
        position: relative;
        // display: flex;
        // border: 1px solid #d6dee4;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .ba_input{
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        // height:124px; 
        // width:124px
        width: 100%;
        height: 100%;
    }
</style>
