import { FormatDate } from '../../../../utils/dateFormat'
import EditAndAttendance from './dialog/editAndAttendance'
import ReapplyAttendanceTicket from './dialog/reapplyAttendanceTicket'
import CommonSearch from '@/components/CommonSearch/CommonSearch'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import {
  checkQuery,
  tenantUserSummaryQuery
} from '@/api/teachManage/attendance'
export default {
  components: {
    EditAndAttendance,
    ReapplyAttendanceTicket,
    CommonSearch,
    AdvancedSearch
  },
  data() {
    return {
      studyDate: this.$moment().format('YYYY-MM-DD'),
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      isCurrentDay: true, // 是否是当天
      totalCount: 0, // 一页条数
      attendanceList: [],
      pageIndex: 1,
      pageSize: 10,
      teacherList: [], // 教师列表
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          // {
          //   itemType: 'select',
          //   placeholder: '请选择主教姓名',
          //   modelValue: 'mtNames',
          //   // isFilterable: true,
          //   valueKey: 'id',
          //   labelKey: 'name',
          //   isClearable: true,
          //   itemStyle: 'width:140px',
          //   apiService: teacherNameQuery,
          //   params: {
          //     prime: '1'
          //   }
          // },
          {
            itemType: 'input',
            placeholder: '请输入主教姓名',
            modelValue: 'mtNames',
            isClearable: true,
            itemStyle: 'width:140px'
          },
          {
            itemType: 'input',
            placeholder: '请输入排课标题',
            modelValue: 'title',
            isClearable: true,
            itemStyle: 'width:140px'
          },
          {
            itemType: 'input',
            placeholder: '请输入班级名称',
            modelValue: 'className',
            isClearable: true,
            itemStyle: 'width:140px'
          }
        ]
      },
      superSearch: {
        onClear: () => { this.onClear() },
        onSearch: (superValue) => { this.onSearch(superValue) },
        fields: [
          {
            type: 'input',
            key: 'courseName',
            label: '课程名称'
          },
          {
            type: 'select',
            key: 'roomName',
            label: '教室名称',
            optionValue: 'id',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SS_CRM}/cerp/cpbook/roomNameQuery`
          },
          // {
          //   type: 'select',
          //   key: 'atNames',
          //   label: '助教',
          //   optionValue: 'id',
          //   optionLabel: 'name',
          //   isAsync: true,
          //   url: `${window.SS_CRM}/cerp/cpbook/teacherNameQuery`,
          //   asyncParams: {
          //     prime: '0'
          //   }

          // },
          {
            type: 'input',
            key: 'atNames',
            label: '助教'
          },
          {
            type: 'input',
            key: 'stuName',
            label: '学生姓名'
          }
        ]
      }
    }
  },
  watch: {
    studyDate(newVal) {
      if (
        newVal == this.$moment().format('YYYY-MM-DD') //eslint-disable-line
      ) {
        this.isCurrentDay = true
      } else {
        this.isCurrentDay = false
      }
      this.pageIndex = 1
      this.getAttentdanceList()
    }
  },
  mounted() {
    const pageSizeStorage = localStorage.getItem('org_common_pageSize')
    this.pageSize = pageSizeStorage ? Number(pageSizeStorage) : 10
    this.getAttentdanceList()
    this.getUserlist()
  },
  methods: {
    /* 获取考勤列表 */
    getAttentdanceList(val) {
      // let params
      // if (val) { // 有传值
      //   params = {
      //     pageSize: this.pageSize,
      //     pageIndex: this.pageIndex - 1
      //   }
      //   Object.assign(params, val)
      //   if (this.pagination.indexChange) {
      //     this.pageIndex = val.pageIndex + 1
      //   } else {
      //     this.pageIndex = 1
      //   }
      // } else { // 没有传值
      //   params = {
      //     ...this.searchValue,
      //     pageSize: this.pageSize,
      //     pageIndex: this.pageIndex - 1
      //   }
      // }
      let params
      if (val) {
        params = {
          studyDate: this.studyDate,
          pageSize: this.pageSize,
          pageIndex: 0
        }
        Object.assign(params, val)
      } else {
        params = {
          studyDate: this.studyDate,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex - 1
        }
      }
      checkQuery(params).then(res => {
        // console.log('--------->', params)
        const data = res.data
        if (data.errorCode === 0) {
          this.attendanceList = data.results
          this.totalCount = data.data && data.data.resultCount
        } else {
          this.$message.error(data.errorMessage || '获取考勤列表失败')
        }
      })
    },
    /* 获取员工列表 */
    getUserlist() {
      tenantUserSummaryQuery().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.teacherList = data.results
        } else {
          this.$message.error(data.errorMessage || '获取员工列表失败')
        }
      })
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      const params = {
        ...this.formValue,
        ...this.superValue,
        pageIndex: 0
      }
      console.log('this.formValue', params)
      this.getAttentdanceList(params)
    },
    /* 搜索重置 */
    resetFieldHanle() {
      // 重置的入参
      const params = {
        pageIndex: 0,
        ...this.superValue
      }
      this.formValue = {}
      this.getAttentdanceList(params)
    },
    /** 高级清除 */
    onClear() {
      const params = {
        pageIndex: 0,
        ...this.formValue
      }
      this.superValue = {}
      this.getAttentdanceList(params)
    },
    /** 高级搜索 */
    onSearch(superValue) {
      this.superValue = superValue
      const params = {
        ...this.superValue,
        ...this.formValue,
        pageIndex: 0
      }
      console.log('onSearch', params)
      this.getAttentdanceList(params)
    },
    handleSizeChange(size) {
      this.pageSize = size
      // 存储每页条数
      localStorage.setItem(`org_common_pageSize`, size)
      this.getAttentdanceList()
    },
    handleCurrentChange(index) {
      this.pageIndex = index
      this.getAttentdanceList()
    },
    OperationQuery(type) {
      console.log('type', type)
      let start
      // eslint-disable-next-line
      if (type == 'beforeDay') {
        // 上一天
        start = new Date(this.studyDate).getTime() - 24 * 60 * 60 * 1000
        this.studyDate = FormatDate(start).substr(0, 10)
        if (
          this.studyDate == this.$moment().format('YYYY-MM-DD') //eslint-disable-line
        ) {
          this.isCurrentDay = true
        } else {
          this.isCurrentDay = false
        }
        // eslint-disable-next-line
      } else if (type == 'nextDay') {
        // 下一天
        start = new Date(this.studyDate).getTime() + 24 * 60 * 60 * 1000
        this.studyDate = FormatDate(start).substr(0, 10)
        if (
          this.studyDate == this.$moment().format('YYYY-MM-DD') //eslint-disable-line
        ) {
          this.isCurrentDay = true
        } else {
          this.isCurrentDay = false
        }
      }
    },
    /* 考勤 */
    stuAttendanceChange(item) {
      this.$refs.editAttendance.show(this.isCurrentDay, '1', item)
    },
    /* 明细 */
    stuAttendanceDetail(item) {
      this.$refs.editAttendance.show(this.isCurrentDay, '2', item)
    },
    /* 补打小票 */
    reapplyTicket(item) {
      this.$refs.reapplySmallTicket.show(item)
    },
    /* 更新数据 */
    getUpdateTable() {
      this.getAttentdanceList()
    }
  }
}
