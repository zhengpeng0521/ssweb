<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="500px"
    custom-class="add_chapter"
    append-to-body>
    <div style="padding-top:10px;">
      <el-form ref="addForm" :model="form" label-width="100px" label-suffix=":">
        <el-form-item
          :rules="[
            { required: true, message: '章节名称不能为空'},
            { max: 20, message: '不能超过20字'}
          ]"
          label="章节名称"
          prop="name"
        >
          <el-input v-model="form.name" placeholder="章节名称不超过20字"/>
        </el-form-item>
      </el-form>
    </div>

    <div slot="footer">
      <el-button :loading="addLoading" @click="onClose">取 消</el-button>
      <el-button :loading="addLoading" type="primary" @click="onConfirm">确 认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      dialogVisible: false,
      type: 'add', // add新增，edit编辑
      chapterInfo: {},

      form: {
        name: ''
      }
    }
  },

  computed: {
    ...mapState('recorded', [
      'chapters',
      'courseId',
      'addLoading'
    ])
  },

  methods: {
    ...mapActions('recorded', [
      'addChapter',
      'updateChapter'
    ]),

    /** 打开 */
    show(info) {
      this.dialogVisible = true
      if (info) {
        this.form.name = info.name
        this.chapterInfo = info
        this.type = 'edit'
      } else {
        const num = this.chapters.length + 1
        this.form.name = `第${num}章`
        this.type = 'add'
      }
    },

    /** 关闭 */
    onClose() {
      this.$refs.addForm.resetFields()
      this.chapterInfo = {}
      this.dialogVisible = false
    },

    /** 确认 */
    onConfirm() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          if (this.type === 'edit') {
            const payload = {
              id: this.chapterInfo.id,
              name: this.form.name
            }
            this.updateChapter({ params: payload, close: this.onClose })
          } else {
            const params = {
              cwId: this.courseId,
              name: this.form.name
            }
            this.addChapter({ params, close: this.onClose })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.add_chapter{
  .el-dialog__header{
    display: none;
  }
}
</style>
