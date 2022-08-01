<template>
  <footer class="app-footer">
    <div class="contact">
       <!-- 版权信息 -->
        <div class="copyright">
          <p>
            <a href="javascript:;">商务市场合作:18072125048</a>
            <a href="javascript:;">内容合作: 2418004261@qq.com</a>
            <a href="javascript:;">违法和不良信息举报电话:110</a>
          </p>
          <p>dunjiao © 钝角贴吧</p>
        </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
}
</script>
<style scoped lang="less">
.app-footer {
  overflow: hidden;
  background-color: #fff;
  padding-top: 20px;
  margin-top: 10px;
  .copyright {
    height: 170px;
    padding-top: 40px;
    text-align: center;
    color: #999;
    font-size: 15px;
    p {
      line-height: 1;
      margin-bottom: 20px;
    }
    a {
      color: #999;
      line-height: 1;
      padding: 0 10px;
      border-right: 1px solid #999;
      &:last-child {
        border-right: none;
      }
    }
  }
}
</style>
