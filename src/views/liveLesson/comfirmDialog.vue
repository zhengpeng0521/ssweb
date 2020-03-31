<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    title="提示"
    width="500px">
    <div>退出后将不保存已编辑的信息，是否继续退出</div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="goBack">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    'returnBackFun': {
      type: Function,
      default: true
    }
  },

  data() {
    return {
      dialogVisible: false
    }
  },

  methods: {
    show() {
      this.dialogVisible = true
    },

    /** 退出编辑 */
    goBack() {
      this.dialogVisible = false
      this.returnBackFun()
    }
  }
}
</script>
