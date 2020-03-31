<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    title="编辑视频信息"
    width="500px"
    append-to-body>
    <div>
      <el-form ref="editForm" :model="form" label-width="100px" label-suffix=":">
        <el-form-item
          :rules="[
            { required: true, message: '视频名称不能为空'},
            { max: 30, message: '不能超过30字'}
          ]"
          label="视频名称"
          prop="name"
        >
          <el-input v-model="form.name" placeholder="视频名称不超过30字"/>
        </el-form-item>

        <el-form-item
          :rules="[
            { max: 100, message: '不能超过100字'}
          ]"
          label="视频描述"
          prop="desc"
        >
          <el-input v-model="form.desc" :rows="4" type="textarea" placeholder="视频描述不超过100字"/>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="editLoading" @click="dialogVisible = false">取 消</el-button>
      <el-button :loading="editLoading" type="primary" @click="editVideo">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    refresh: {
      type: Function,
      required: true
    }
  },

  data() {
    return {
      dialogVisible: false,
      row: {},

      form: {
        name: '',
        desc: ''
      }
    }
  },

  computed: {
    ...mapState('recorded', [
      'editLoading',
      'currentItem'
    ])
  },

  methods: {
    ...mapActions('recorded', [
      'updateVideo'
    ]),

    /** 显示 */
    show(row) {
      this.dialogVisible = true
      this.row = row
      this.form.name = row.name
      this.form.desc = row.desc
    },

    /** 编辑后回调 */
    callback() {
      this.dialogVisible = false
      this.refresh({ itemId: this.currentItem.id })
    },

    /** 编辑视频 */
    editVideo() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          const params = {
            ...this.form,
            id: this.row.id
          }
          this.updateVideo({ params, refresh: this.callback })
        } else {
          return false
        }
      })
    }
  }
}
</script>
