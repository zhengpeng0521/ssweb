<template>
  <div>
    <el-dialog
      :visible.sync="linePayOpenDialogShow"
      style="marginTop: 110px;"
      width="480px"
      title="开通在线收款"
      append-to-body
    >
      <div class="linePayStyle">
        <div class="linePayStyleLeft">
          <img
            src="https://img.ishanshan.com/gimg/img/f4033ff0ece7e09ee302c7927d84edc3"
            alt="闪闪教培"
          >
        </div>
        <div class="linePayStyleRight">
          <div class="linePayStyleRightTop">
            <p>电脑端收银</p>
            <p>合同在线收款，支持支付宝微信，费率低至0.35%</p>
          </div>
          <div class="linePayStyleRightBottom">
            <el-button @click="cancelDialog()">暂不开通</el-button>
            <el-button
              type="primary"
              @click="freeOpen()"
            >免费开通</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      linePayOpenDialogShow: false
    }
  },
  methods: {
    // 免费开通按钮进行路由跳转
    freeOpen() {
      this.$router.push({ path: '/addService/cashierMgr' })
    },
    // 关闭弹窗
    cancelDialog() {
      this.linePayOpenDialogShow = false
    },
    // 显示弹窗
    showDialog() {
      this.linePayOpenDialogShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
.linePayStyle {
  overflow: hidden;
  margin-bottom: 10px;
  .linePayStyleLeft {
    float: left;
    img {
      width: 140px;
      height: 140px;
    }
  }
  .linePayStyleRight {
    margin-left: 20px;
    float: left;
    .linePayStyleRightTop {
      p:nth-of-type(1) {
        color: #303133;
        font-size: 18px;
        font-weight: 500;
      }
      p:nth-of-type(2) {
        color: #c0c4cc;
        font-size: 8px;
        margin-top: 20px;
      }
    }
    .linePayStyleRightBottom {
      margin-top: 60px;
      margin-left: 80px;
    }
  }
}
</style>
