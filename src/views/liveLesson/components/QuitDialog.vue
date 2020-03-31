<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    title="提示"
    width="500px">
    <div>您确定要退出直播间吗？</div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="goBack">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    localStream: {
      type: null,
      required: true
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

    /** 退出直播间 */
    goBack() {
      this.localStream.close()
      this.$emit('leaveRoom')
      this.$router.push('/online/liveLesson')
    }
  }
}
</script>
