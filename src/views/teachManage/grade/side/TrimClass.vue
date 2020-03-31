<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      title="选择班级"
      width="800px"
      append-to-body
      @open="openDialog"
      @close="closeDialog"
    >
      <common-search
        :is-inline="true"
        :params="formInline"
        :forms="formInline"
        @toParent="resetFieldHanle"
      />
      <common-table
        ref="tableCommon"
        :columns="columns"
        :options="options"
        :pagination="pagination"
      />
      <span slot="footer">
        <el-button
          :loading="trimLoading"
          @click="closeDialog"
        >取 消</el-button>
        <el-button
          :loading="trimLoading"
          type="primary"
          @click="confirm"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 错误信息 -->
    <el-dialog
      :visible.sync="errVisible"
      :close-on-click-modal="false"
      title="调班异常提示"
      width="500px"
      append-to-body
    >
      <div>
        <p :style="{ marginBottom: '10px' }">本次调班异常情况</p>
        <p
          v-for="(item, index) in errList"
          :key="'err_' + index"
          :style="{ color: '#d0021b' }"
        >{{ item }}</p>
      </div>

      <span slot="footer">
        <el-button
          type="primary"
          @click="errVisible = false"
        >我知道了</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { classGradeSummary } from '@/api/teachManage/arrangeCourse'
import { trimClass } from '@/api/teachManage/grade'
import { queryClassGradeList } from '@/api/teachManage/grade'
import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'

export default {
  components: {
    CommonTable,
    CommonSearch
  },
  props: {
    row: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      classId: null,
      dialogVisible: false, // 调班是否显示
      classList: [], // 班级下拉
      formValues: {
        type: '1'
      },
      oldClsId: '', // 旧班级id
      stuIds: [], // 学员id
      trimLoading: false,

      errVisible: false, // 错误信息是否显示
      errList: [], // 失败原因
      columns: [{
        label: '',
        prop: 'num',
        width: '30',
        render: (h, params) => {
          const self = this
          return h(
            'el-radio',
            {
              props: { value: self.classId, label: params.row.clsId, disabled: self.oldClsId === params.row.clsId },
              on: {
                input: function(value) {
                  self.classId = value
                }
              }
            }
          )
        }
      },
      {
        label: '班级名称',
        prop: 'name',
        isShowTooltip: true
      },
      {
        label: '班级人数',
        prop: 'num',
        isShowTooltip: true,
        formatter: (row, column, cellValue) => {
          return `<div>${row.classStuNum}/${row.maxNum}</div>`
        }
      },
      {
        label: '所属课程',
        prop: 'courseName',
        isShowTooltip: true
      },
      {
        label: '主教',
        prop: 'mainTeacherNames',
        isShowTooltip: true
      },
      {
        label: '助教',
        prop: 'assistanTeacherNames',
        isShowTooltip: true
      }],
      options: {
        apiService: queryClassGradeList,
        params: {
          type: '1'
        },
        isSettingShow: true
      },
      pagination: {
        show: true,
        sizes: true
      },
      formInline: {
        type: '1',
        searchMethod: formValue => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '班级名称',
            modelValue: 'name',
            isClearable: true,
            itemStyle: 'width:140px'
          },
          {
            itemType: 'input',
            placeholder: '课程名称',
            modelValue: 'courseName',
            isClearable: true,
            itemStyle: 'width:140px'
          },
          {
            itemType: 'input',
            placeholder: '主教/助教',
            modelValue: 'teacherName',
            isClearable: true,
            itemStyle: 'width:140px'
          }
        ]
      }
    }
  },

  methods: {

    /** 打开弹窗 */
    showDialog({ oldClsId, stuIds }) {
      this.dialogVisible = true
      this.oldClsId = oldClsId
      this.stuIds = stuIds
    },
    searchHandle(formValue) {
      this.formValue = formValue
      // 搜索的入参
      const params = {
        ...formValue
      }
      this.$refs.tableCommon.getList(params)
    },
    resetFieldHanle() {
      // 重置的入参
      const params = {
        pageIndex: 0,
        type: this.formInline.type
      }
      this.formValue = {}
      this.$refs.tableCommon.getList(params)
    },
    /** 打开回调 */
    async openDialog() {
      const { data } = await classGradeSummary()
      if (data && data.errorCode === 0) {
        this.classList = data.results
      } else {
        this.$message.error(data && data.errorMessage || '获取班级列表失败')
      }
    },

    /** 关闭弹窗 */
    closeDialog() {
      this.dialogVisible = false
      this.classId = null
    },

    /** 确定调班 */
    confirm() {
      if (this.classId) {
        const params = {
          removeClsId: this.oldClsId,
          addClsId: this.classId,
          stuId: this.stuIds.join(',')
        }
        this.trimLoading = true
        trimClass(params).then(({ data }) => {
          if (data && data.errorCode === 0) {
            if (data.reasonList && data.reasonList.length > 0) {
              // 失败原因
              this.errVisible = true
              this.errList = data.reasonList
              this.closeDialog()
              this.$emit('refresh', this.row.clsId)
            } else {
              this.$message.success('调班成功')
              this.closeDialog()
              this.$emit('refresh', this.row.clsId)
            }
          } else {
            this.$message.error(data && data.errorMessage || '调班失败')
          }
          this.trimLoading = false
        })
      } else {
        this.$message.error('请选择要调配的班级')
      }
    }
  }
}
</script>
