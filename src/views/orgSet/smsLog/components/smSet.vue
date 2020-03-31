<template>

  <el-dialog
    :visible.sync="dialogVisible"
    title="短信预警"
    width="500px"
    @click="handleClose"
  >

    <el-form
      ref="smsData"
      :inline="true"
      :model="smsData"
      class="demo-form-inline"
    >
      <span>剩余短信小于</span>
      <el-form-item
        :rules="[
          { required: true, message: '请输入正整数', trigger: 'change' },
          { pattern: /^[+]{0,1}(\d+)$/, message: '请输入正整数', trigger: 'change' }
        ]"
        prop="minNumber"
        class="smsLost"
      >
        <el-input
          v-model="smsData.minNumber"
          style="width: 100px;"
          class="smsLostInput"
        />
        <i>条</i>
      </el-form-item>

      <span style="line-height: 28px;margin-right: 9px;">时发送短信给</span>

      <el-form-item
        :rules="[
          { required: true, message: '请输入手机号', trigger: 'change' },
          { validator: checkMobile, trigger: 'change' }
        ]"
        prop="remindTel"
      >
        <el-input
          v-model="smsData.remindTel"
          placeholder="请输入手机号"
          style="width: 130px;"
        />
      </el-form-item>
    </el-form>

    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="handleClose">取 消</el-button>
      <el-button
        type="primary"
        @click="submitForm('smsData')"
      >保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  smsRemind // 短信条数不足提醒添加
} from '@/api/orgSet/smsLog'
export default {
  data() {
    return {
      smsData: {
        minNumber: '',
        remindTel: ''
      }, // 设置短信的提醒条数和电话
      dialogVisible: false
    }
  },
  methods: {
    // 确定保存
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            mobile: this.smsData.remindTel,
            leftNumber: this.smsData.minNumber
          }
          smsRemind(params).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('短信提醒设置成功')
              this.$emit('toParent')
              this.dialogVisible = false
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        } else {
          return false
        }
      })
    },
    // 手机号验证
    checkMobile(rule, value, callback) {
      if (value == '' || value == undefined || value == null) { //eslint-disable-line
        callback()
      } else if (!(/^1[0-9]{10}$/.test(value))) {
        callback('请输入正确的手机号')
      } else {
        callback()
      }
    },

    // 打开弹窗
    showDialog(value) {
      if (value.minNumber === undefined) {
        this.smsData.minNumber = '10'
      } else {
        this.smsData.minNumber = value.minNumber
        this.smsData.remindTel = value.remindTel
      }
      this.dialogVisible = true
    },

    // 点击错号关闭弹窗
    handleClose() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.smsLost {
  position: relative;
  /*.smsLostInput {
    margin-right: -10px;
    margin-left: -8px;
  }*/
  i {
    position: absolute;
    top: 7px;
    right: 6px;
    font-style: normal;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFangSC;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 14px;
  }
}

</style>

