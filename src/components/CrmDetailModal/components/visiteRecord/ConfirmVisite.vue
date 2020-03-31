<template>
  <!-- 确认到访 -->
  <el-dialog
    :visible.sync="visitedVisible"
    :close-on-click-modal="false"
    append-to-body
    title="确认到访"
    width="500px"
  >
    <el-form
      ref="visitedForm"
      :model="visitedForm"
      label-width="80px"
    >
      <el-form-item
        :rules="[
          { required: true, message: '请选择销售'}
        ]"
        label="分配销售"
      >
        <el-select
          v-model="visitedForm.sellerId"
          :style="{width: '100%'}"
          placeholder="请选择销售"
        >
          <el-option
            v-for="(item, index) in sallerList"
            :key="'saller'+index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button
        :loading="visitedLoading"
        @click="close"
      >取 消</el-button>
      <el-button
        :loading="visitedLoading"
        type="primary"
        @click="confirmVisited"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>>

<script>
import { tenantUserSummaryQuery } from '@/api/crm/studentInfo/lantentStu'
import { updateVisitStatus } from '@/api/crm/visitMgr/visitMgr'

export default {
  props: {
    id: {
      type: String,
      required: true
    },
    refresh: {
      type: Function,
      required: true
    }
  },

  data() {
    return {
      visitedVisible: false,
      sallerList: [], // 销售下拉
      visitedLoading: false,

      visitedForm: {
        sellerId: ''
      }
    }
  },

  mounted() {
    this.getSaller()
  },

  methods: {
    /** 打开 */
    show() {
      this.visitedVisible = true
    },

    /** 关闭 */
    close() {
      this.visitedForm.sellerId = ''
      this.visitedVisible = false
    },

    /** 获取负责销售 */
    getSaller() {
      tenantUserSummaryQuery().then(res => {
        const data = res.data
        if (data && data.errorCode === 0) {
          this.sallerList = data.results || []
        } else {
          this.$message.error(data && data.errorMessage || '销售下拉获取失败')
        }
      })
    },

    /* 到访确认 */
    confirmVisited() {
      this.$refs.visitedForm.validate((valid) => {
        if (valid) {
          const params = {
            ids: this.id,
            status: '1',
            sellerId: this.visitedForm.sellerId
          }
          this.visitedLoading = true
          updateVisitStatus(params).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.$message.success(data.errorMessage)
              this.close()
              // 更新列表
              this.refresh()
            } else {
              this.$message.error(data.errorMessage)
            }
            this.visitedLoading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
