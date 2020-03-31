<template>
  <div class="serviceDistributeDialog_container">
    <el-dialog
      :visible.sync="serviceDistributeDialogShow"
      title="批量删除"
      @close="cancelDialog('serviceDistributeDialogForm')"
    >
      <div class="content">
        <div class="content_text">
          <img src="https://img.ishanshan.com/gimg/n/20190125/46049c37bbcd47e5c75f08ca8a9cac96">
          <div>是否删除已选中的{{ checkNum }}个学员</div>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog()"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm()"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
} from '@/api/crm/studentInfo/readingStu.js'
export default {
  data() {
    return {
      serviceDistributeDialogShow: false,
      serviceDistributeDialogData: {
        worker: ''
      },
      serviceList: [], // 员工（客服）列表
      checkNum: '', // 选中的条数
      checkData: [] // 选中的数据
    }
  },
  methods: {
    /* 显示弹框 */
    show(checkedData) {
      this.serviceDistributeDialogShow = true
      this.checkNum = checkedData
      this.checkData = checkedData
    },
    /* 关闭弹框 */
    cancelDialog() {
      this.serviceDistributeDialogShow = false
      this.$emit('toParent')
    },
    /* 确定提交弹框表单内容 */
    submitForm() {
      this.serviceDistributeDialogShow = false
      this.$emit('toUpdateTableFace')
    }
  }
}
</script>

<style lang="scss" scoped>
.serviceDistributeDialog_container /deep/ {
  .el-dialog {
    width: 500px;
  }
  .title_text {
    margin-bottom: 16px;
  }
  .content {
    margin: 15px 20px 14px;
    .content_text {
      margin-bottom: 15px;
      img {
        margin-right: 12px;
      }
      :last-child {
        display: inline-block;
        vertical-align: super;
        color: #666;
      }
    }
  }
}
.leads_follow_modals_alert_message {
  span {
    color: #ff5500;
    padding: 0 15px;
  }
  div {
    line-height: 20px;
    text-indent: 2.5rem;
  }
  div:last-child {
    color: #ff5500;
  }
}
</style>

