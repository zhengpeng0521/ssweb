<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    title="视频预览"
    width="600px"
    append-to-body
    @close="onClose">
    <div>
      <video :src="url" controls controlslist="nodownload" width="100%" style="max-height:400px;" />
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onClose">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      url: ''
    }
  },

  methods: {
    show(url) {
      this.dialogVisible = true
      this.url = url
    },

    /** 关闭 */
    onClose() {
      this.dialogVisible = false
      this.url = ''
    }
  }
}
</script>
