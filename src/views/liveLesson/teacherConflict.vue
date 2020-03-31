<template>
  <el-dialog
    :visible.sync="teacherDialogShow"
    title="老师冲突信息"
    width="500px"
    @close="cancelFindDialog()"
  >

    <!-- 精确查找表格 -->
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :data-source="dataSource"
      :table-height="tableHeight"
      :options="options"
    />
    <!-- :pagination="pagination" -->

    <span
      slot="footer"
      class="dialog-footer"
    >

      <el-button
        type="primary"
        @click="submitFindForm()"
      >确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import CommonTable from '@/components/CommonTable/CommonTable'
import { checkTime } from '@/api/online/liveLesson'
export default {
  components: {
    CommonTable
  },
  data() {
    return {
      teacherDialogShow: false, // 弹窗显示
      lastCheckList: [],

      columns: [
        {
          label: '老师姓名',
          prop: 'uname',
          width: '150',
          isShowTooltip: true
        }, {
          label: '直播名称',
          prop: 'liveName',
          width: '150',
          isShowTooltip: true
        },
        {
          label: '开始时间',
          prop: 'startTime',
          width: '150',
          isShowTooltip: true
        },
        {
          label: '结束时间',
          prop: 'endTime',
          width: '150',
          isShowTooltip: true
          // formatter: (row) => {
          //   return `<div>${row.startTime} ~ ${row.endTime}</div>`
          // }
        }
      ],
      tableHeight: 'calc(100vh - 585px)',
      pagination: {
        show: true,
        sizeChange: this.sizeChange,
        indexChange: this.indexChange
      },
      dataSource: [],
      options: {
        mutiSelect: false,
        apiService: checkTime
      },
      checkNum: '', // 选中的个数
      checkList: [],
      checkedInfo: []
    }
  },
  watch: {

  },
  mounted() {
  },
  methods: {
    show(val) {
      // console.log('val', val)
      this.teacherDialogShow = true
      this.dataSource = val
      // this.options.apiService = checkTime
      // this.options.params = {
      //   tid: val.tid,
      //   startTime: val.startTime,
      //   endTime: val.endTime
      // }
      // this.getList(this.options.params)
    },
    // getList(params) {
    //   //  let dataSource = []
    //   checkTime(params).then(res => {
    //     this.
    //   })
    // },
    // /** 页数改变 */
    // indexChange(pageIndex) {
    //   const payload = {
    //     type: '2',
    //     pageIndex: pageIndex - 1,
    //     ...this.formValue
    //   }
    //   //   this.options.selected = this.lastCheckList
    //   this.$refs.tableCommon.getList(payload)
    // },
    // /** 每页条数改变 */
    // sizeChange(pageSize) {
    //   const payload = {
    //     type: '2',
    //     pageSize,
    //     ...this.formValue
    //   }
    //   //   this.options.selected = this.lastCheckList
    //   this.$refs.tableCommon.getList(payload)
    // },

    /* 取消 */
    cancelFindDialog() {
      this.teacherDialogShow = false
    //   this.$emit('toclose', false)
    //   this.lastCheckList = []
    //   this.$refs.commonTable.clearSelection()
    },
    /* 确定 */
    submitFindForm() {
      this.teacherDialogShow = false
    //   this.lastCheckList.map(item => {
    //     checkArr.push(item.id)
    //     checkName.push(item.name)
    //   })
    //   this.$emit('toParent', checkArr, checkName, this.lastCheckList)
    }

  }
}
</script>
<style lang="scss" scoped>
.checkList {
  margin-bottom: 14px;
  .no_checkList {
    display: none;
  }
  .select_block {
    padding: 2px 8px;
    display: inline-block;
    border-radius: 3px;
    background: #eef7ff;
    position: relative;
    margin-left: 10px;
    color: #666;
    img {
      position: absolute;
      right: -7px;
      top: -5px;
      cursor: pointer;
    }
  }
}
</style>
