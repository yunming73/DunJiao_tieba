<template>
  <div class="readonly">
      <memberreviseleft/>
      <RouterView/>
  </div>
  
</template>

<script>
import memberreviseleft from './member_revise_left.vue'
export default {
    name:'memberfan',
    components:{memberreviseleft},
}
</script>

<style scoped lang="less">
.readonly{
    // width: 250px;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 4px;
    display: flex;
    // padding: 15px 20px 18px;
    margin-bottom: 10px;
    .readonly_title{
        display: flex;
        padding-bottom: 10px;
        border-bottom: 1px solid #e5e9ef;
        // margin-bottom: 20px;
        justify-content: space-between;
        span{
            line-height: 23px;
            font-size: 18px;
            color: #222;
            font-weight: bolder;
        }
    }
    .readonly_body{
         display: flex;
        //  justify-content: space-between;
        flex-direction: column;
        margin: 10px 0 10px 0;
            // border-bottom: 1px solid #e5e9ef;
        
    }
}
</style>