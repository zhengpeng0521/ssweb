<template>
  <div class="BackHighSeaDialog_container">
    <el-dialog
      :visible.sync="productDialogShow"
      :title="'删除在读学员'"
      @close="cancelDialog()"
    >
      <div>确定删除在读学员吗?将会清除该学员所有数据!</div>

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
          @click="submitForm(val)"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import {
  deleteReadingStu// 删除在读学员
} from '@/api/crm/studentInfo/readingStu.js'

export default {
  components: {

  },
  props: {
    refresh: {
      type: Function,
      required: true
    }

  },
  data() {
    return {
      productDialogShow: false,
      message: '',
      val: ''
    }
  },
  methods: {
    /* 显示不能删除弹框 */
    showDialog(val) {
      this.val = val
      this.productDialogShow = !this.productDialogShow
    },
    /* 关闭弹框 */
    cancelDialog() {
      this.productDialogShow = false
    },
    submitForm(val) {
      const params = { 'stuId': this.val.stuId }
      deleteReadingStu(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.$message.success(data.errorMessage)
          // this.refresh()删除成功的时候
          this.$emit('toUpdateTables', true)
        } else {
          this.$message.error(data.errorMessage)
          this.$emit('toUpdateTables')
        }
      })
      this.productDialogShow = !this.productDialogShow
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
.BackHighSeaDialog_container /deep/ {
  .el-dialog {
    width: 400px;
  }
}
</style>

