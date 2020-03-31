<template>
  <el-dialog
    :visible.sync="centerDialogVisible"
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="closed"
    title="选择支付方式"
    width="600px"
    class="wrapWall"
  >
    <el-dialog
      :visible.sync="innerVisible"
      :close-on-click-modal="false"
      width="500px"
      title="提交汇款凭证"
      append-to-body
    >
      <!-- <el-dialog
        :visible.sync="innerVisilast"
        :close-on-click-modal="false"
        width="500px"
        title="提交汇款凭证"
        append-to-body
      >
        <div>我们会在3个工作日内审核并开通服务</div>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button type="primary">确 定</el-button>
        </span>
      </el-dialog> -->
      <!-- 表单提交 -->
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="付款人户名"
          prop="payerAccountName"
        >
          <el-input
            v-model="ruleForm.payerAccountName"
            placeholder="请输入付款人户名"
          />
        </el-form-item>
        <el-form-item
          label="开户行"
          prop="payerBank"
        >
          <el-input
            v-model="ruleForm.payerBank"
            placeholder="请输入开户行"
          />
        </el-form-item>
        <el-form-item
          label="付款人账号:"
          prop="payerAccountNumber"
        >
          <el-input
            v-model="ruleForm.payerAccountNumber"
            placeholder="请输入付款人账号"
            @input="inputFunction(ruleForm.payerAccountNumber)"
          />
        </el-form-item>
        <div class="proceAll">
          <span>支付金额：</span>
          <span>¥{{ price }}</span>
        </div>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
    <div class="sameWord">订单已提交，请尽快付款！</div>
    <div class="tel">请您在7天内完成支付，否则订单会被自动取消</div>
    <div class="line" />
    <div class="school">订购校区：{{ orgName }}</div>
    <div class="paym"><span>支付金额：</span><span>¥{{ price }}</span></div>
    <!-- 二维码 -->
    <div class="topMain">
      <div
        v-for="(title,index) in title"
        :key="index"
        :class="index == indexnum ? 'active' : ''"
        @click="changeBuy(index)"
      >
        {{ title }}
        <img
          v-show="index == indexnum"
          src="http://img.ishanshan.com/gimg/user/n///267884901104091137.png"
        >
      </div>
    </div>
    <div
      v-if="indexnum == 0"
      class="bottomMain"
    >
      <div class="cons">
        <qrcode
          :url="url"
          :iconurl="imageUrl"
          :wid="169"
          :hei="169"
          :imgwid="35"
          :imghei="35"
        />
        <div class="consWrap">
          <img
            src="http://img.ishanshan.com/gimg/user/n///267890778280296449.png"
            width="20"
            height="20"
            alt="支付宝"
          >
          <img
            src="http://img.ishanshan.com/gimg/user/n///267891160700157953.png"
            width="20"
            height="20"
            alt="微信"
            style="margin-right:20px"
          >
          <span class="conWord">扫一扫完成支付</span>
        </div>
      </div>
    </div>
    <div
      v-if="indexnum == 1"
      class="rightMain"
    >
      <div>
        您需要转账<span style="color:#F56C6C">{{ price }}</span>元至以下帐户，转账成功后填写相关信息并提交审核
      </div>
      <div style="margin:30px 0 20px 0">
        <span>收款户名</span>
        <span class="titleC">杭州闪宝科技有限公司</span>
      </div>
      <div style="margin-bottom:20px">
        <span>收款银行</span>
        <span class="titleC">浙江泰隆银行杭州萧山支行</span>
      </div>
      <div>
        <span>银行账号</span>
        <span class="titleC">3302050120100024516</span>
      </div>
      <div
        class="rightB"
        @click="rightB"
      >
        已转账，提交汇款凭证
      </div>
    </div>
  </el-dialog>
</template>
<script>
import qrcode from 'vue_qrcodes'
import { submitPayInfo, payNotice } from '@/api/orgSet/message.js'
export default {
  components: {
    qrcode
  },
  data() {
    return {
      orgName: this.$store.getters.orgName,
      price: '',
      innerVisilast: false,
      imageUrl: 'http://img.ishanshan.com/gimg/user/n///268474000848453633.png',
      url: '',
      orderNo: '',
      indexnum: 0,
      title: ['在线支付', '线下转账'],
      centerDialogVisible: false,
      innerVisible: false,
      timer: '',
      ruleForm: {
        payerAccountName: '',
        payerBank: '',
        payerAccountNumber: ''
      },
      rules: {
        payerAccountName: [
          { required: true, message: '请填写付款人户名', trigger: 'blur' },
          { max: 30, trigger: 'blur', message: '不可超过30字 ' }
        ],
        payerBank: [
          { required: true, message: '请填写开户行', trigger: 'blur' },
          { max: 30, trigger: 'blur', message: '不可超过30字 ' }
        ],
        payerAccountNumber: [
          { required: true, message: '请填写付款人账号', trigger: 'blur' },
          { max: 30, trigger: 'blur', message: '不可超过30字 ' }
        ]
      }
    }
  },
  methods: {
    showDialog(url, orderNo, price) {
      this.centerDialogVisible = true
      this.url = url
      this.orderNo = orderNo
      this.price = price
      const typeP = {
        orderNo: orderNo
      }
      this.timer = setInterval(() => {
        this.payNotice(typeP)
      }, 3000)
    },
    changeBuy(index) {
      this.indexnum = index
      if (index === 1) {
        clearInterval(this.timer)
      } else {
        const typeP = {
          orderNo: this.orderNo
        }
        this.timer = setInterval(() => {
          this.payNotice(typeP)
        }, 3000)
      }
    },
    closed() {
      this.indexnum = 0
      this.centerDialogVisible = false
      // 清除定时器
      clearInterval(this.timer)
      // 更新列表数据
      this.$emit('message')
    },
    rightB() {
      this.innerVisible = true
    },
    payNotice(orderNo) {
      payNotice(orderNo).then(res => {
        if (res.data.errorMessage === '成功') {
          console.log(res.data.orderPayStatus)
          if (res.data.orderPayStatus === '1') {
            clearInterval(this.timer)
            this.$message({
              type: 'success',
              message: '订购成功'
              // center: true
            })
            this.centerDialogVisible = false
            const list = {
              statu: 5,
              order: this.orderNo
            }
            this.$emit('message', list)
          }
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.$refs[formName].resetFields()
          // this.innerVisible = false
          // this.centerDialogVisible = false
          // this.$emit('message', false)

          const data = {
            ...this.ruleForm,
            orderNo: this.orderNo,
            payMoney: this.price
          }
          submitPayInfo(data).then(res => {
            console.log(res)
            if (res.data.errorMessage === '成功') {
              // 订单号和金额传餐
              this.$confirm('我们会在3个工作日内审核并开通服务', '汇款凭证已提交', {
                confirmButtonText: '确定',
                cancelButtonText: '',
                type: 'success',
                showClose: false,
                showCancelButton: false,
                customClass: 'wrapallT'
              }).then(() => {
                this.$message({
                  type: 'success',
                  message: '订购成功'
                  // center: true
                })
                this.$refs[formName].resetFields()
                this.innerVisible = false
                this.centerDialogVisible = false
                this.indexnum = 0
                const list = {
                  statu: 3,
                  order: this.orderNo
                }
                this.$emit('message', list)
              })
            } else {
              this.$message({
                type: 'warning',
                message: res.data.errorMessage
              })
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.innerVisible = false
    },
    inputFunction(value) {
      // console.log(value.replace(/[^0-9]/g, ''))
      this.$nextTick(() => {
        this.ruleForm.payerAccountNumber = value.replace(/[^0-9]/g, '')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapWall {
  font-family: PingFangSC-Regular, PingFangSC;
}
.wrapWall /deep/ .el-dialog__body {
  max-height: 620px;
}
.sameWord {
  font-size: 20px;
  color: rgba(51, 51, 51, 1);
}
.tel {
  color: rgba(153, 153, 153, 1);
  margin: 15px 0 20px 0;
}
.school {
  font-size: 14px;
  color: rgba(102, 102, 102, 1);
  margin-top: 20px;
}
.line {
  width: 100%;
  height: 1px;
  background: #eeeeee;
}
.paym {
  display: flex;
  align-items: center;
  margin: 15px 0 30px 0;
}
.paym span:nth-child(1) {
  font-size: 14px;
  color: #666;
}
.paym span:nth-child(2) {
  font-size: 22px;
  color: #f56c6c;
  margin-left: 5px;
}
.topMain {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.topMain div img {
  position: absolute;
  top: 0;
  left: 0;
}
.topMain .active {
  background: rgba(70, 182, 238, 0.1);
  border-radius: 2px;
  border: 1px solid rgba(70, 182, 238, 1);
  color: #1d9df2;
}
.topMain div {
  width: 270px;
  border: 1px solid #eee;
  position: relative;
  height: 50px;
  text-align: center;
  line-height: 50px;
  cursor: pointer;
}
.bottomMain {
  height: 287px;
  background: rgba(246, 247, 249, 1);
  border-radius: 2px;
  margin-top: 20px;
  margin-bottom: 14px;
  padding: 28px 185px;
}
.bottomMain .cons {
  width: 189px;
  height: 227px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(221, 221, 221, 1);
  padding: 10px;
}
.consWrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}

.conWord {
  color: rgba(102, 102, 102, 1);
}
.rightMain {
  height: 287px;
  background: rgba(246, 247, 249, 1);
  border-radius: 2px;
  margin-top: 20px;
  padding: 20px 0 0 20px;
  margin-bottom: 14px;
  font-size: 14px;
  color: rgba(102, 102, 102, 1);
  position: relative;
}
.titleC {
  color: #333;
  margin-left: 16px;
}
.rightB {
  position: absolute;
  bottom: 30px;
  left: 173px;
  width: 214px;
  height: 40px;
  background: rgba(70, 182, 238, 1);
  border-radius: 5px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  cursor: pointer;
}
.proceAll {
  display: flex;
  align-items: center;
  margin: 0 0 10px 30px;
  :nth-child(1) {
    color: #666;
    font-size: 14px;
  }
  :nth-child(2) {
    color: #f56c6c;
    font-size: 22px;
  }
}
</style>
