import {
  queryArrageCourseList,
  courseSummaryQuery
} from '@/api/teachManage/orderCourse'
import { FormatDate } from '../../../../../utils/dateFormat'
/* 普通搜索 */
import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
/* 高级搜索 */
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
/* 详情页 */
import OrderCourseDetail from './side/orderCourseDetail'
/* 取消上课学员 */
import CancelOrderCourse from './dialog/cancelOrderCourse'
/* 取消试听学员 */
import CancelTryStudent from './dialog/cancelTryStudent'
/* 单次约课 */
import OnceOrderCourse from './dialog/onceOrderCourse'
/* 批量约课 */
import BatchOrderCourse from './dialog/batchOrderCourse'
/* 预约补课 */
import OrderMissLesson from './dialog/orderMissLesson'
/* 预约试听 */
import OrderTryCourse from './dialog/orderTryCourse'
import OrderCourseSchedule from '../orderCourseSchedule/orderCourseSchedule.vue'
import SchedulePrintByDay from './schedulePrintByDay.vue'
export default {
  components: {
    CommonSearch,
    CommonTable,
    AdvancedSearch,
    OrderCourseDetail,
    CancelOrderCourse,
    OnceOrderCourse,
    BatchOrderCourse,
    OrderMissLesson,
    OrderTryCourse,
    OrderCourseSchedule,
    SchedulePrintByDay,
    CancelTryStudent
  },
  data() {
    return {
      formInline: {
        searchMethod: formValue => {
          this.searchHandle(formValue)
        },
        modifyTime: [
          this.$moment().format('YYYY-MM-DD'),
          this.$moment().format('YYYY-MM-DD')
        ],
        forms: [
          {
            itemType: 'input',
            placeholder: '学员姓名/家长电话',
            modelValue: 'nameOrMobile',
            isClearable: true,
            itemStyle: 'width:150px'
          },
          {
            itemType: 'select',
            placeholder: '课程名称',
            modelValue: 'courseId',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            labelKey: 'title',
            valueKey: 'id',
            apiService: courseSummaryQuery // 是否从接口中获取
          },
          {
            itemType: 'datePickerChange',
            datePickerType: 'daterange',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'yyyy-MM-dd',
            modelValue: 'modifyTime',
            name: ['startDate', 'endDate'],
            itemStyle: 'width:231px',
            isClearable: false,
            default: true,
            toChange: this.timeChange
          }
        ]
      },
      columns: [
        {
          label: '日期',
          prop: 'studyDate',
          isShowTooltip: true,
          width: '150',
          isShowSet: false,
          hasSort: 'custom',
          render: (h, params) => {
            return h(
              'span',
              {
                class: 'studyDate',
                on: {
                  click: () => {
                    this.toOrderCourseDetail(params.row)
                    // this.toOrderCourseDetail(params.row)
                  }
                }
              },
              params.row.studyDate + ' ' + params.row.weekDay
            )
          }
        },
        {
          label: '时间段',
          prop: 'rangeTime',
          width: '150',
          isShowTooltip: true,
          hasSort: 'custom',
          formatter: (row, column) => {
            return `<div>${row.startTime} ~ ${row.endTime}</div>`
          }
        },
        {
          label: '标题',
          prop: 'title',
          isShowTooltip: true,
          width: '120',
          hasSort: 'custom'
        },
        {
          label: '课程名称',
          prop: 'courseName',
          isShowTooltip: true,
          width: '120'
        },
        {
          label: '进度',
          prop: 'process',
          isShowTooltip: true,
          width: '120'
        },
        {
          label: '上课主题',
          prop: 'courseTheme',
          isShowTooltip: true,
          width: '120'
        },
        {
          label: '主教',
          prop: 'mtNames',
          width: '120',
          isShowTooltip: true
        },
        {
          label: '助教',
          prop: 'atNames',
          width: '120',
          isShowTooltip: true
        },
        {
          label: '教室',
          prop: 'roomName',
          isShowTooltip: true
        },
        {
          label: '消耗课时',
          prop: 'cost',
          width: '120',
          isShowTooltip: true
        },
        {
          label: '排队人数',
          prop: 'lineNum',
          hasSort: 'custom',
          width: '120',
          isShowTooltip: true
        },
        {
          label: '最大人数',
          prop: 'maxNum',
          hasSort: 'custom',
          width: '120',
          isShowTooltip: true
        },
        {
          label: '上课人数',
          prop: 'num',
          hasSort: 'custom',
          width: '120',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.maxAttNum === -1) {
              return `<div>${row.num}</div>`
            } else {
              return `<div>${row.num}/${row.maxAttNum}</div>`
            }
          }
        },
        {
          label: '补课人数',
          prop: 'mulNum',
          hasSort: 'custom',
          width: '120',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.maxMulNum === -1) {
              return `<div>${row.mulNum}</div>`
            } else {
              return `<div>${row.mulNum}/${row.maxMulNum}</div>`
            }
          }
        },
        {
          label: '试听人数',
          prop: 'tryNum',
          hasSort: 'custom',
          width: '120',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.maxTryNum === -1) {
              return `<div>${row.tryNum}</div>`
            } else {
              return `<div>${row.tryNum}/${row.maxTryNum}</div>`
            }
          }
        },
        {
          label: '自主约课',
          prop: 'bookCls',
          width: '120',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.bookCls === '1') {
              return `<div>开启</div>`
            } else if (row.bookCls === '2') {
              return `<div>关闭</div>`
            }
          }
        },
        {
          label: '约课班级',
          prop: 'clsName',
          width: '160',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            return `<div>${row.clsName}</div>`
          }
        }
      ],
      tableHeight: 'calc(100vh - 277px)',
      listQuery: {
        show: true,
        sizes: true,
        sizeChange: this.sizeChange,
        indexChange: this.indexChange
      },
      options: {
        isSettingShow: true,
        apiService: queryArrageCourseList,
        params: {
          startDate: this.$moment().format('YYYY-MM-DD'),
          endDate: this.$moment().format('YYYY-MM-DD')
        }
      },
      superSearch: {
        onClear: () => {
          this.onClear()
        },
        onSearch: superValue => {
          this.onSearch(superValue)
        },
        fields: [
          {
            type: 'input',
            key: 'title',
            label: '排课标题'
          },
          {
            type: 'select',
            key: 'isfull',
            label: '是否满班',
            options: [
              { value: '1', label: '满班' },
              { value: '0', label: '未满班' }
            ]
          },
          {
            key: 'roomId',
            type: 'select',
            label: '教室名称',
            placeholder: '教室名称',
            optionValue: 'id',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SS_CRM}/sysBase/cerp/classroom/summaryQuery`
          },
          {
            type: 'select',
            key: 'mtid',
            label: '主教',
            placeholder: '主教',
            optionValue: 'id',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          },
          {
            type: 'select',
            key: 'atid',
            label: '助教',
            placeholder: '助教',
            optionValue: 'id',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          },
          {
            type: 'timePicker',
            key: 'studyTime',
            label: '上课时间',
            format: 'HH:mm',
            valueFormat: 'HH:mm',
            isRange: true
          }
        ]
      },
      tabKey: '1', // 选择的tab
      start: this.$moment().format('YYYY-MM-DD'),
      end: this.$moment().format('YYYY-MM-DD'),
      isBackDay: false, // 是否返回今天
      isBackWeek: false, // 是否返回本周
      isSchedule: false, // 是否是课程表
      btnName: '切换成课程表', // 按钮名称
      isSchedulePrintByDay: false, // 是否是按天打印课程表
      value4: [],
      superValue: {}, // 高级搜索数据
      pageSize: 10,
      pageIndex: 0,
      formValue: {
        modifyTime: [
          this.$moment().format('YYYY-MM-DD'),
          this.$moment().format('YYYY-MM-DD')
        ]
      }, // 搜索的数据
      flag: true,
      course: false, // 课程列表
      schedule: true // 课程表
    }
  },

  mounted() {
    const params = this.$router.history.current.params
    if (params && params.action && params.action === 'schedule') { // toUpdateSchedule  schedule
      this.toSchedule()
    }
  },

  methods: {
    timeChange(val) {
      this.start = val[0]
      this.end = val[1]
      var weekOfday = this.$moment().format('d')
      var monday = this.$moment()
        .subtract(weekOfday - 1, 'days')
        .format('YYYY-MM-DD') // 周一日期
      var sunday = this.$moment()
        .add(7 - weekOfday, 'days')
        .format('YYYY-MM-DD') // 周日日期
      if (
        this.start == monday && //eslint-disable-line
        this.end == sunday //eslint-disable-line
      ) {
        this.isBackWeek = false
      } else {
        this.isBackWeek = true
      }
      if (
        this.start == this.$moment().format("YYYY-MM-DD") && //eslint-disable-line
        this.start == this.end //eslint-disable-line
      ) {
        this.isBackDay = false
      } else {
        this.isBackDay = true
      }
    },
    /** 页数改变 */
    indexChange(pageIndex) {
      let startDate = ''
      let endDate = ''
      if (this.tabKey === '1') {
        startDate = this.formValue.modifyTime[0]
        endDate = this.formValue.modifyTime[1]
      } else {
        startDate = this.$refs.search.formValue.modifyTime[0]
        endDate = this.$refs.search.formValue.modifyTime[1]
      }
      this.pageIndex = pageIndex - 1
      const payload = {
        startDate: startDate,
        endDate: endDate,
        pageIndex: this.pageIndex,
        ...this.formValue,
        ...this.superValue
      }
      if (this.superValue.studyTime && this.superValue.studyTime.length > 0) {
        payload.startTime = this.superValue.studyTime[0]
        payload.endTime = this.superValue.studyTime[1]
      }
      delete payload.modifyTime
      delete payload.studyTime
      this.$refs.tableCommon.getList(payload)
    },
    /** 每页条数改变 */
    sizeChange(pageSize) {
      let startDate = ''
      let endDate = ''
      if (this.tabKey === '1') {
        startDate = this.formValue.modifyTime[0]
        endDate = this.formValue.modifyTime[1]
      } else {
        startDate = this.$refs.search.formValue.modifyTime[0]
        endDate = this.$refs.search.formValue.modifyTime[1]
      }
      this.pageSize = pageSize
      this.pageIndex = 0
      const payload = {
        startDate: startDate,
        endDate: endDate,
        pageSize,
        pageIndex: this.pageIndex,
        ...this.formValue,
        ...this.superValue
      }
      if (this.superValue.studyTime && this.superValue.studyTime.length > 0) {
        payload.startTime = this.superValue.studyTime[0]
        payload.endTime = this.superValue.studyTime[1]
      }
      delete payload.modifyTime
      delete payload.studyTime
      this.$refs.tableCommon.getList(payload)
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      if (formValue.startDate && formValue.endDate) {
        this.formValue.modifyTime = [formValue.startDate, formValue.endDate]
      }
      this.pageIndex = 0
      const params = {
        ...this.formValue,
        ...this.superValue,
        pageIndex: this.pageIndex
      }
      this.flag = true
      // params.startDate = formValue.modifyTime[0]
      // params.endDate = formValue.modifyTime[1]
      delete params.modifyTime
      if (this.superValue.studyTime && this.superValue.studyTime.length > 0) {
        params.startTime = this.superValue.studyTime[0]
        params.endTime = this.superValue.studyTime[1]
      }
      delete params.studyTime
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle() {
      // 重置的入参
      this.pageIndex = 0
      const params = {
        pageIndex: this.pageIndex,
        startDate: this.$moment().format('YYYY-MM-DD'),
        endDate: this.$moment().format('YYYY-MM-DD'),
        ...this.superValue
      }
      if (this.superValue.studyTime && this.superValue.studyTime.length > 0) {
        params.startTime = this.superValue.studyTime[0]
        params.endTime = this.superValue.studyTime[1]
      }
      this.tabKey = '1'
      delete params.studyTime
      delete params.modifyTime
      this.formValue = {}
      this.start = this.$moment().format('YYYY-MM-DD')
      this.end = this.$moment().format('YYYY-MM-DD')
      this.isBackDay = false
      this.formValue.modifyTime = [
        this.$moment().format('YYYY-MM-DD'),
        this.$moment().format('YYYY-MM-DD')
      ]
      this.$refs.tableCommon.getList(params)
    },
    /* 高级搜索 */
    onSearch(superValue, currentIndex) {
      this.superValue = superValue
      if (currentIndex) {
        this.pageIndex = currentIndex
      } else {
        this.pageIndex = 0
      }
      // if (superValue.pageIndex) {
      //   this.pageIndex = superValue.pageIndex
      // } else {
      //   this.pageIndex = 0
      // }
      const params = {
        ...superValue,
        ...this.formValue,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
      if (superValue.studyTime && superValue.studyTime.length > 0) {
        params.startTime = superValue.studyTime[0]
        params.endTime = superValue.studyTime[1]
      }
      if (this.formValue.modifyTime) {
        params.startDate = this.formValue.modifyTime[0]
        params.endDate = this.formValue.modifyTime[1]
      }
      delete params.modifyTime
      delete params.studyTime
      this.$refs.tableCommon.getList(params)
    },
    /* 清空高级搜索 */
    onClear() {
      this.pageIndex = 0
      const params = {
        pageIndex: this.pageIndex,
        ...this.formValue
      }
      if (this.formValue.modifyTime) {
        params.startDate = this.formValue.modifyTime[0]
        params.endDate = this.formValue.modifyTime[1]
      }
      delete params.modifyTime
      this.tabKey = '1'
      this.superValue = {}
      this.$refs.tableCommon.getList(params)
    },
    /* 课程表 */
    toSchedule() {
      // this.isSchedule = true
      this.course = false // 显示课程表
      this.schedule = true
    },
    getUpdateSchedule(val) {
      console.log(val)
      this.isSchedule = val
      this.course = true // 显示课程表
      this.schedule = false
    },
    /* 上一天 / 下一天 / 上一周 /下一周 */
    OperationQuery(type) {
      let start
      let end
      this.flag = false
      var weekOfday = this.$moment().format('d')
      var monday = this.$moment()
        .subtract(weekOfday - 1, 'days')
        .format('YYYY-MM-DD') // 周一日期
      var sunday = this.$moment()
        .add(7 - weekOfday, 'days')
        .format('YYYY-MM-DD') // 周日日期
      if (type === 'yesterday') {
        // 上一天
        start =
          new Date(this.$refs.search.formValue.modifyTime[0]).getTime() -
          24 * 60 * 60 * 1000
        this.start = FormatDate(start).substr(0, 10)
        end =
          new Date(this.$refs.search.formValue.modifyTime[1]).getTime() -
          24 * 60 * 60 * 1000
        this.end = FormatDate(end).substr(0, 10)
        // this.$refs.search.formValue.modifyTime = [this.start, this.end]
        if (
          this.start == this.$moment().format("YYYY-MM-DD") && //eslint-disable-line
          this.start == this.end //eslint-disable-line
        ) {
          this.isBackDay = false
        } else {
          this.isBackDay = true
        }
      } else if (type === 'tomorrow') {
        // 下一天
        start =
          new Date(this.$refs.search.formValue.modifyTime[0]).getTime() +
          24 * 60 * 60 * 1000
        this.start = FormatDate(start).substr(0, 10)
        end =
          new Date(this.$refs.search.formValue.modifyTime[1]).getTime() +
          24 * 60 * 60 * 1000
        this.end = FormatDate(end).substr(0, 10)
        // this.formValue.modifyTime = [this.start, this.end]
        if (
          this.start == this.$moment().format("YYYY-MM-DD") && //eslint-disable-line
          this.start == this.end //eslint-disable-line
        ) {
          this.isBackDay = false
        } else {
          this.isBackDay = true
        }
      } else if (type === 'today') {
        // 回到今天
        this.start = this.$moment().format('YYYY-MM-DD')
        this.end = this.$moment().format('YYYY-MM-DD')
        // this.formValue.modifyTime = [this.start, this.end]
        this.isBackDay = false
      } else if (type === 'lastWeek') {
        // 上一周
        start =
          new Date(this.$refs.search.formValue.modifyTime[0]).getTime() -
          7 * 24 * 60 * 60 * 1000
        this.start = FormatDate(start).substr(0, 10)
        end =
          new Date(this.$refs.search.formValue.modifyTime[0]).getTime() -
          1 * 24 * 60 * 60 * 1000
        this.end = FormatDate(end).substr(0, 10)
        // this.formInline.modifyTime = [this.start, this.end]
        if (
          this.start == monday && //eslint-disable-line
          this.end == sunday //eslint-disable-line
        ) {
          this.isBackWeek = false
        } else {
          this.isBackWeek = true
        }
      } else if (type === 'nextWeek') {
        // 下一周
        start =
          new Date(this.$refs.search.formValue.modifyTime[1]).getTime() +
          1 * 24 * 60 * 60 * 1000
        this.start = FormatDate(start).substr(0, 10)
        end =
          new Date(this.$refs.search.formValue.modifyTime[1]).getTime() +
          7 * 24 * 60 * 60 * 1000
        this.end = FormatDate(end).substr(0, 10)
        // this.formInline.modifyTime = [this.start, this.end]
        if (
          this.start == monday && //eslint-disable-line
          this.end == sunday //eslint-disable-line
        ) {
          this.isBackWeek = false
        } else {
          this.isBackWeek = true
        }
      } else if (type === 'backToWeek') {
        // 返回本周
        this.start = monday
        this.end = sunday
        // this.formInline.modifyTime = [this.start, this.end]
        this.isBackWeek = false
      }
      this.pageIndex = 0
      const params = {
        ...this.superValue,
        ...this.formValue,
        startDate: this.start,
        endDate: this.end,
        pageIndex: this.pageIndex
      }
      if (this.superValue.studyTime && this.superValue.studyTime.length > 0) {
        params.startTime = this.superValue.studyTime[0]
        params.endTime = this.superValue.studyTime[1]
      }
      delete params.modifyTime
      delete params.studyTime
      this.$refs.tableCommon.getList(params)
      this.$refs.search.formValue.modifyTime = [this.start, this.end]
      this.formValue.modifyTime = [this.start, this.end]
    },
    /* 天数radio切换*/
    tabChange(val) {
      var weekOfday = this.$moment().format('d') // 计算今天是这周第几天
      var monday = this.$moment()
        .subtract(weekOfday - 1, 'days')
        .format('YYYY-MM-DD')
      var sunday = this.$moment()
        .add(7 - weekOfday, 'days')
        .format('YYYY-MM-DD') // 周日日期
      if (val === '1') {
        this.$refs.search.formValue.modifyTime = [
          this.$moment().format('YYYY-MM-DD'),
          this.$moment().format('YYYY-MM-DD')
        ]
        this.start = this.$moment().format('YYYY-MM-DD')
        this.end = this.$moment().format('YYYY-MM-DD')
        const params = {
          ...this.superValue,
          ...this.formValue,
          startDate: this.$refs.search.formValue.modifyTime[0],
          endDate: this.$refs.search.formValue.modifyTime[1],
          pageIndex: 0
        }
        this.formValue.modifyTime = [params.startDate, params.endDate]
        this.$refs.tableCommon.getList(params)
      } else if (val === '2') {
        this.$refs.search.formValue.modifyTime = [monday, sunday]
        this.start = monday
        this.end = sunday
        const params = {
          ...this.superValue,
          ...this.formValue,
          startDate: monday,
          endDate: sunday,
          pageIndex: 0
        }
        this.formValue.modifyTime = [params.startDate, params.endDate]
        this.$refs.tableCommon.getList(params)
      }

      this.isBackWeek = false
      this.isBackDay = false
    },
    /* 约课详情 */
    toOrderCourseDetail(row) {
      this.$refs.orderDetail.show(row)
    },
    /* 上课学员取消 */
    getCancelData(row, detail) {
      this.$refs.cancel.show(row, detail)
    },
    /* 排队学员取消 */
    getLineCancelData(row, detail) {
      this.$refs.cancel.show(row, detail)
    },
    /* 试听学员取消 */
    getTryCancelData(row, detail) {
      this.$refs.cancelTry.show(row, detail)
    },
    /* 单次约课 */
    getOnceOrderCourse(val, detail) {
      this.$refs.onceOrderCourse.show(val, detail)
    },
    /* 单次约课更新 */
    getUpdateOnceOrder(val) {
      // const params = {
      //   startDate: this.formValue.modifyTime[0],
      //   endDate: this.formValue.modifyTime[1],
      //   pageSize: this.pageSize,
      //   pageIndex: this.pageIndex
      // }
      // this.$refs.tableCommon
      const params = {
        ...this.superValue
      }
      this.onSearch(params, this.pageIndex)
      this.$refs.orderDetail.show(val)
    },
    /* 批量约课 */
    getBatchOrderCourse(val, detail) {
      this.$refs.batchOrderCourse.show(val, detail)
    },
    /* 预约补课 */
    getOrderMissCourse(val, detail) {
      this.$refs.orderMissLesson.show(val, detail)
    },
    /* 预约试听 */
    getOrderTryCourse(val, detail) {
      this.$refs.orderTryCourse.show(val, detail)
    },
    /* 按天打印课程表 */
    schedulePrintByDay() {
      this.isSchedulePrintByDay = true
    },
    /* 转为上课学员 */
    getInlineUpdate(detail) {
      const params = {
        startDate: this.formInline.modifyTime[0],
        endDate: this.formInline.modifyTime[1]
      }
      this.$refs.tableCommon.getList(params)
      this.$refs.orderDetail.show(detail)
    }
  }
}

