<template>
  <el-dialog
    :visible.sync="stuErrVisible"
    width="450px"
    title="预约异常提示"
  >
    <p :style="{ marginBottom: '10px'}">本次约课需课时{{ cost }}，如下学员约课时间冲突，剩余学员已成功约课：</p>
    <p
      v-for="(item, index) in errList"
      :key="index"
    >{{ item }}</p>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="primary"
        @click="stuErrVisible = false"
      >我知道了</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      stuErrVisible: false,
      errList: [],
      cost: ''
    }
  },
  methods: {
    errDialogShow(errList, cost) {
      this.stuErrVisible = true
      this.errList = errList
      this.cost = cost
    }
  }
}
</script>
