<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="600px"
      title="选择课程"
      @close="cancelDialog"
    >
      <div class="dialog-body">
        <p :style="{marginBottom:'30px'}">将调整{{ specialHour + commonHour }}个课时,{{ commonHour }}个通用课时,{{ specialHour }}个专用课时,专用课时将直接退回学员账户</p>
        <el-form ref="form">
          <el-form-item label="课程:">
            <el-select
              v-model="selectedCourse"
              :style="{width:'50%'}"
              size="small"
              placeholder="请选择课程"
              @change="courseSelectChange"
            >
              <el-option
                v-for="(item, index) in courseList"
                :key="index"
                :label="item.title"
                :value="item.id"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="主教:">
            <el-select
              v-model="selectedTeacher"
              :style="{width:'50%'}"
              size="small"
              placeholder="请选择主教"
              @change="teacherSelectChange"
            >
              <el-option
                v-for="(item, index) in teacherList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <div :style="{margin: '10px 0 0 50px'}">
              <el-button
                type="text"
                @click="resetSelect"
              >重置课程/主教</el-button>
            </div>
          </el-form-item>
          <el-form-item :style="{margin: '10px 0'}">
            <el-radio-group
              v-model="selectTimeType"
              @change="openInnerDialog"
            >
              <el-radio label="1">默认时间</el-radio>
              <el-radio label="2">选择时间</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <p :style="{color:'#48B5EE'}">默认时间，将自动帮您调整为最近时间的排课进行预约，剩余课时将退回学员账户</p>
      </div>
      <el-dialog
        :visible.sync="errVisible"
        :close-on-click-modal="false"
        title="调课异常提示"
        width="500px"
        append-to-body
      >
        <div>
          <p :style="{ marginBottom: '10px' }">本次调课异常情况</p>
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
      <el-dialog
        :visible.sync="innerVisible"
        :close-on-click-modal="false"
        append-to-body
        title="选择调课"
        width="800px"
        @close="cancelInnerDialog"
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
          @onSelect="onSelect"
          @onSelectAll="onSelectAll"
        />
        <p>已选: {{ hasSelectedHour }}课时 &nbsp;&nbsp;&nbsp;可调整: {{ commonHour }}课时&nbsp;&nbsp;&nbsp;剩余课时将退回学员账户 </p>
        <span slot="footer">
          <el-button @click="cancelInnerDialog">取 消</el-button>
          <el-button
            type="primary"
            @click="innerSubmit"
          >确 定</el-button>
        </span>
      </el-dialog>
      <span slot="footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button
          type="primary"
          @click="submit"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import { queryArrangeList } from '@/api/teachManage/arrangeCourse'
import { getClassHour, getTeacherOrCourse, adjustOrderCourse, cpbookCourseQuery, cpbookTeacherQuery } from '@/api/teachManage/orderCourse'
import { fmtDateFormat } from '@/utils/dateFormat'
export default {
  components: {
    CommonSearch,
    CommonTable
  },
  data() {
    return {
      dialogVisible: false,
      innerVisible: false,
      errVisible: false,
      errList: [],
      checkList: [],
      selectTimeType: '1', // 选择时间方式
      stuId: '',
      courseList: '', // 课程列表
      orderList: [], // 要调课的学员 cpStuId
      courseIdList: [], // 要调课的课程ID
      commonHour: '', // 通用课时
      specialHour: '', // 专用课时
      hasSelectedHour: 0,
      teacherList: '', // 主教列表
      selectedCourse: '',
      selectedTeacher: '',
      formValue: [],
      formInline: {
        type: '1',
        searchMethod: formValue => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'datePickerChange',
            datePickerType: 'daterange',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'yyyy-MM-dd',
            modelValue: 'modifyTime',
            itemStyle: 'width:230px',
            isClearable: false,
            pickerOption: {
              disabledDate(time) {
                const date = new Date()
                return ((Date.parse(date) - Date.parse(time)) > 86400000)
              }
            },
            toChange: this.dateChange
          }]
      },
      columns: [
        {
          label: '课程名称',
          prop: 'courseName',
          isShowTooltip: true
        },
        {
          label: '消耗课时',
          prop: 'cost',
          isShowTooltip: true
        },
        {
          label: '上课日期',
          prop: 'studyDate',
          isShowTooltip: true,
          width: '150',
          formatter: (row, column, cellValue) => {
            return `<div>${row.studyDate}(${row.weekDay})</div>`
          }
        },
        {
          label: '上课时间',
          prop: 'rangeTime',
          width: '150',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            return `<div>${row.startTime} ~ ${row.endTime}</div>`
          }
        },
        {
          label: '主教名称',
          prop: 'mtNames',
          isShowTooltip: true
        }
      ],
      options: {
        apiService: queryArrangeList,
        mutiSelect: true,
        selected: '',
        params: {
        },
        isSettingShow: true
      },
      pagination: {
        show: true,
        sizes: true,
        sizeChange: this.sizeChange,
        indexChange: this.indexChange
      }
    }
  },
  methods: {
    openDialog(checkList) {
      this.stuId = checkList[0].stuId
      this.dialogVisible = true
      this.orderList = []
      this.courseIdList = []
      checkList.forEach(item => {
        this.orderList.push(item.cpStuId)
        if (this.courseIdList.indexOf(item.courseId) === -1) {
          this.courseIdList.push(item.courseId)
        }
      })
      this.getcourseList()
      this.getTacherList()
      const params = {
        cpStuIds: this.orderList.join(',')
      }
      getClassHour(params).then(res => {
        if (res.data.errorCode === 0) {
          this.commonHour = res.data.commonNum
          this.specialHour = res.data.specialNum
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    resetSelect() {
      this.getcourseList()
      this.getTacherList()
      this.selectedTeacher = ''
      this.selectedCourse = ''
    },
    openInnerDialog(val) {
      if (val === '2') {
        if (this.verifyForm()) {
          const params = {
            mtid: this.selectedTeacher,
            courseId: this.selectedCourse,
            date: this.timeFormatter(),
            isAdjust: '1'
          }
          // this.selectTimeType = '1'
          this.options.params = params
          this.innerVisible = true
          this.$nextTick(function() {
            this.$refs.tableCommon.getList(params)
          })
        } else {
          this.selectTimeType = '1'
        }
      }
    },
    // 获取课程列表
    getcourseList() {
      const params = {
        courseIds: this.courseIdList.join(',')
      }
      cpbookCourseQuery(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.courseList = data.courseList
        } else {
          this.$message.error(data.errorMessage || '获取课程列表失败')
        }
      })
    },
    // 获取主教
    getTacherList() {
      cpbookTeacherQuery().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.teacherList = data.teacherList
        } else {
          this.$message.error(data.errorMessage || '获取主教列表失败')
        }
      })
    },
    // 课程下拉框值变化
    courseSelectChange(val) {
      const params = {
        courseId: val
      }
      getTeacherOrCourse(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.teacherList = data.teacherList
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    // 主教下拉框值变化
    teacherSelectChange(val) {
      const params = {
        teacherId: val,
        courseIds: this.courseIdList.join(',')
      }
      getTeacherOrCourse(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.courseList = data.courseList
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    searchHandle(val) {
      this.formValue = {
        startDate: val.modifyTime[0],
        endDate: val.modifyTime[1]
      }
      const params = {
        mtid: this.selectedTeacher,
        courseId: this.selectedCourse,
        startDate: val.modifyTime[0],
        endDate: val.modifyTime[1]
      }
      this.options.selected = this.checkList
      this.$refs.tableCommon.getList(params)
    },
    verifyForm() {
      if (this.selectedCourse === '') {
        this.$message.warning('请选择课程')
        return false
      }
      if (this.selectedTeacher === '') {
        this.$message.warning('请选择主教')
        return false
      }
      return true
    },
    onSelect(selection, row) {
      const index = this.checkList.findIndex(item => {
        return item.cpdId === row.cpdId
      })
      if (index === -1) {
        this.checkList.push(row)
      } else {
        this.checkList.splice(index, 1)
      }
      let totalHour = 0
      this.checkList.forEach(item => {
        totalHour += item.cost
      })
      this.hasSelectedHour = totalHour
    },
    onSelectAll(selection) {
      if (selection.length > 0) {
        selection.forEach((item, index) => {
          if (!(this.checkList.find(val => val.cpdId === item.cpdId))) {
            this.checkList.push(item)
          }
        })
      } else {
        const tableData = this.$refs.tableCommon.tableData
        const arr = []
        this.checkList.forEach((item, index) => {
          if (!(tableData.find(val => val.cpdId === item.cpdId))) {
            arr.push(item)
          }
        })
        this.checkList = arr
      }
      let totalHour = 0
      this.checkList.forEach(item => {
        totalHour += item.cost
      })
      this.hasSelectedHour = totalHour
    },
    sizeChange(pageSize) {
      const params = {
        mtid: this.selectedTeacher,
        courseId: this.selectedCourse,
        pageSize,
        ...this.formValue
      }
      this.options.selected = this.checkList
      this.$refs.tableCommon.getList(params)
    },
    indexChange(pageIndex) {
      const params = {
        mtid: this.selectedTeacher,
        courseId: this.selectedCourse,
        pageIndex: pageIndex - 1,
        ...this.formValue
      }
      this.options.selected = this.checkList
      this.$refs.tableCommon.getList(params)
    },
    submit() {
      if (this.verifyForm()) {
        const params = {
          cpStuIds: this.orderList.join(','),
          stuId: this.stuId,
          isDefault: '1',
          courseId: this.selectedCourse,
          teacherId: this.selectedTeacher
        }
        adjustOrderCourse(params).then(res => {
          const data = res.data
          if (data && data.errorCode === 0) {
            if (data.results.length === 0) {
              this.$message.success('调课成功！')
              this.checkList = []
              this.hasSelectedHour = 0
              this.dialogVisible = false
              this.selectedCourse = ''
              this.selectedTeacher = ''
              this.selectTimeType = '1'
              this.options.selected = []
              this.$emit('toAdjustOrder')
            } else {
              this.errVisible = true
              this.errList = data.results
            }
          }
        })
      }
    },
    innerSubmit() {
      if (this.hasSelectedHour > this.commonHour) {
        this.$message.warning('已选课时超出可调整课时数量')
        return false
      }
      if (this.checkList.length === 0) {
        this.$message.warning('至少选择一项进行调课')
        return false
      }
      const arr = []
      this.checkList.forEach(item => {
        arr.push(item.cpdId)
      })
      const cpdIds = arr.join(',')
      const params = {
        stuId: this.stuId,
        cpStuIds: this.orderList.join(','),
        isDefault: '0',
        cpdIds: cpdIds
      }
      adjustOrderCourse(params).then(res => {
        const data = res.data
        if (data && data.errorCode === 0) {
          if (data.results.length === 0) {
            this.$message.success('调课成功！')
            this.checkList = []
            this.hasSelectedHour = 0
            this.innerVisible = false
            this.dialogVisible = false
            this.selectedCourse = ''
            this.selectedTeacher = ''
            this.selectTimeType = '1'
            this.options.selected = []
            this.$emit('toAdjustOrder')
          } else {
            this.errVisible = true
            this.errList = data.results
          }
        }
      })
    },
    cancelDialog() {
      this.dialogVisible = false
      this.selectedCourse = ''
      this.selectedTeacher = ''
      this.selectTimeType = '1'
    },
    cancelInnerDialog() {
      this.innerVisible = false
      this.checkList = []
      this.hasSelectedHour = 0
      this.selectTimeType = '1'
      this.options.selected = []
    },
    resetFieldHanle() {
      const params = {
        mtid: this.selectedTeacher,
        courseId: this.selectedCourse,
        date: this.timeFormatter()
      }
      this.formValue = []
      this.options.selected = this.checkList
      this.$refs.tableCommon.getList(params)
    },
    dateChange(val) {
    },
    timeFormatter() {
      const time = new Date()
      return (fmtDateFormat(time, 'yyyy-MM-dd'))
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-body {
  padding-left: 30px;
  padding-top: 10px;
  height: 300px;
}
</style>
