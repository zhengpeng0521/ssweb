<template>
  <div>
    <el-dialog
      :visible.sync="contractPayFromDialogShow"
      close-on-press-escape
      destroy-on-close="true"
      width="550px"
      style="marginTop: 25px;"
      title="合同收款单"
      append-to-body
      @close="closeDialog"
      @open="open"
    >
      <div class="payFrom">

        <!-- 隐藏input框 -->
        <!-- @input="(value) => qrcodeInputChange(value)" -->
        <div>
          <el-input
            ref="qrcodeScanInput"
            v-model="payNumber"
            autofocus="true"
            class="hiddenInput"
            @blur="loseFocus"
            @keydown="keydown"
            @keypress.native="keydown"
          />
        </div>

        <p>收款金额：{{ PayMoney }} 元</p>
        <p>学员姓名： {{ stuName }}</p>
        <p>请提示家长出示「 付款码 」，支持支付宝和微信</p>
        <div class="bottomImg">
          <img
            src="http://img.ishanshan.com/gimg/n/20190812/42dc26b7ef6ba23116b1142641908f10"
            alt="闪闪教培"
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  payOrder// 收款
  // 合同详情
} from '@/api/crm/contract/contract.js'

export default {
  data() {
    return {
      purchaseId: '', // 收款编号
      orderId: '', // 合同号
      payNumber: '', // 付款时候获取到的数字id
      contractPayFromDialogShow: false,
      PayMoney: '', // 收款金额
      stuName: '' // 学员姓名
    }
  },

  methods: {
    // 监听enter键
    keydown(e) { // 传入 event
      const event = e || window.event
      if (event.keyCode === 13) {
        const payWayMon = [{
          rate: 0,
          payid: this.orderId,
          money: this.PayMoney
        }]
        const params = {
          orderId: this.purchaseId, // 收款编号
          bextMoney: 0,
          payway: JSON.stringify(payWayMon),
          receiverId: '',
          depositId: '',
          payType: '3',
          authCode: this.payNumber
        }
        payOrder(params).then(res => {
          if (res.data.errorCode === 0) {
            this.$message.success(res.data.errorMessage)
            this.payNumber = '' // 支付成功，支付数字码置空
            this.contractPayFromDialogShow = false // 支付成功，关闭当前弹窗
            this.$emit('cancelDialog') // 支付成功，关闭上级弹窗
          } else {
            this.$message.error(res.data.errorMessage)
            this.payNumber = '' // 支付失败，支付数字码置空
          }
        })
      }
    },

    // // 数据改变
    // qrcodeInputChange(value) {
    //   console.log(value, 'qrcodeInputChange----------------')
    // },

    // 打开获取焦点
    open() {
      this.$nextTick(() => {
        this.$refs.qrcodeScanInput.$el.querySelector('input').focus()
      })
    },

    // 失去焦点后重新获取焦点
    loseFocus(e) {
      e.target.focus()
    },

    // 关闭弹窗
    closeDialog() {
      this.$emit('closeDialog')
    },
    // 显示弹框
    showDialog(type, value) {
      this.contractPayFromDialogShow = true
      if (type === 'saveAndPay') { // 通过保存并付款过来
        this.PayMoney = value.linePerMoney
        this.stuName = value.orderStuNames
        this.purchaseId = value.contractOrderId // 收款编号
        this.orderId = value.orderNum // 合同编号
      } else if (type === 'newAndPay') { // 通过财务新建过来
        this.PayMoney = value.linePerMoney
        this.stuName = value.checkStudent.stuName
        this.purchaseId = value.contractNum // 收款编号
        this.orderId = value.contractOrderId // 合同编号
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.payFrom {
  margin-bottom: 20px;
  position: relative;
  .hiddenInput {
    width: 180px;
    right: 100000px;
    position: absolute;
  }
  p:nth-of-type(1) {
    font-size: 16px;
    color: #409eff;
  }
  p:nth-of-type(2) {
    font-size: 16px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  p:nth-of-type(3) {
    font-size: 16px;
  }
  .bottomImg {
    margin-top: 20px;
    img {
      width: 500px;
    }
  }
}
</style>
