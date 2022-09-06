<template>
  <div class="carousel_top">
    <div class="ba_imgs" v-for="(item,i) in banner" :key="i">
        <ImgBanner :img='item'/>
    </div>
  </div>
</template>

<script>
// 主页的轮播图
import {ref} from 'vue';
import {findBanner} from '@/api/home';
import ImgBanner from '@/components/img_banner.vue';
export default {
    name:'homecarousel',
    components:{ImgBanner},
    setup(){
        const banner=ref()
        findBanner().then(data=>{
            if(data.meta.status!==200) return ElMessage.error('获取轮播图失败')
            banner.value=data.data
        })
        return {banner}
    }
}
</script>

<style scoped lang="less">
.carousel_top{
    width: 100%;
    margin-top: 10px;
    display: flex;
    flex-wrap:wrap;
    .ba_imgs{
        display: flex;
        flex-direction: column;
    }
}
</style>