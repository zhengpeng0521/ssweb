<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      title="提示"
      width="400px"
      append-to-body>
      <div class="live_tip_body">
        <i class="el-icon-warning"/>
        <span>您尚未购买「直播套餐」或没有相关菜单访问权限，如需使用请联系机构的系统管理员</span>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
        <el-button type="primary" @click="openQrcode">购买套餐</el-button>
      </div>
    </el-dialog>

    <!-- 联系客服 -->
    <el-dialog
      :visible.sync="qrVisible"
      :close-on-click-modal="false"
      title="联系客服"
      width="300px"
      append-to-body>
      <div>
        <img
          style="width:100%"
          class="live_tip_pic"
          src="https://img.ishanshan.com/gimg/n/20190711/dc58ce8b397a0b39f3349b16f6f4db3c"
        >
        <p class="live_tip_text">微信扫码，获取专属服务顾问</p>
        <p class="live_tip_tel">客服热线：400-660-5733</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      qrVisible: false
    }
  },

  methods: {
    show() {
      this.dialogVisible = true
    },

    openQrcode() {
      this.dialogVisible = false
      this.qrVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.live_tip_body{
  margin-bottom: 14px;
  display: flex;
  i{
    font-size: 30px;
    color: #FFAA00;
    margin-right: 20px;
  }
  span{
    line-height: 20px;
  }
}

.live_tip_text{
  text-align: center;
  margin: 10px 0;
  color: #666;
}
.live_tip_tel{
  text-align: center;
  color: #1d9df2;
  margin-bottom: 14px;
}
</style>
