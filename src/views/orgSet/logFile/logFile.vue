<template>
  <div class="file">
    <div class="file_underline">操作日志</div>
    <CommonSearch
      :is-inline="true"
      :params="formInline"
      :forms="formInline"
      @toParent="resetFieldHanle"
    />
    <!-- 高级搜索 -->
    <advanced-search
      ref="superSearch"
      v-bind="superSearch"
    />
    <common-table
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :options="options"
      :pagination="pagination"
      :table-key="'orgSet_logfile_logFile'"
    />
  </div>
</template>

<script>
// 转换时间格式
Object.assign(Date.prototype, {
  pattern: function(fmt) {
    const o = {
      'M+': this.getMonth() + 1, // 月份
      'd+': this.getDate(), // 日
      'h+': this.getHours() % 12 === 0 ? 12 : this.getHours() % 12, // 小时
      'H+': this.getHours(), // 小时
      'm+': this.getMinutes(), // 分
      's+': this.getSeconds(), // 秒
      'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
      'S': this.getMilliseconds() // 毫秒
    }
    const week = {
      '0': '/u65e5',
      '1': '/u4e00',
      '2': '/u4e8c',
      '3': '/u4e09',
      '4': '/u56db',
      '5': '/u4e94',
      '6': '/u516d'
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    if (/(E+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[this.getDay() + ''])
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  }
})
import { logfilequery } from '@/api/orgSet/logfile'
import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
export default {
  components: {
    CommonSearch, // 搜索
    CommonTable, // 日志表格
    logfilequery,
    AdvancedSearch

  },
  data() {
    return {
      name: '',
      columns: [
        {
          label: '操作时间',
          hasSort: 'custom',
          prop: 'opDate',
          isShowTooltip: true,
          width: 120,
          formatter: row => {
            return `${new Date(row.opDate).pattern('yyyy-MM-dd hh:mm:ss')}`
          }

        }, {
          label: '操作人',
          prop: 'userName',
          isShowTooltip: true,
          width: 100
        }, {
          label: '操作人账号',
          prop: 'mobile',
          isShowTooltip: true
        }, {
          label: '业务类型',
          // hasSort: 'custom',
          prop: 'busType',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => { //eslint-disable-line
            if (row.busType == '001') { //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden;margin-left:0px;">
                        ${'员工账号'}
                      </div>`
            }
            if (row.busType == '002') { //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden;margin-left:0px;">
                        ${'合同'}
                      </div>`
            }
            if (row.busType == '003') { //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden;margin-left:0px;">
                        ${'收款单	'}
                      </div>`
            }
            if (row.busType == '004') { //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden;margin-left:0px;">
                        ${'退款单'}
                      </div>`
            }
             if (row.busType == '005') { //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden;margin-left:0px;">
                        ${'会员账户'}
                      </div>`
            }
          }
        },
        {
          label: '操作详情',
          prop: 'content',
          // isShowTooltip: true,
          width: 300,
          render: (h, params) => {
            return h('span', {}, [
              h('div', { style: { overflow: 'hidden', 'text-overflow': 'ellipsis', color: 'rgba(24,145,237,1)',
                'white-space': 'nowrap', display: '-webkit-box', '-webkit-line-clamp': '2', width: '500px',
                'line-height': '15px', 'font-size': '14px', '-webkit-box-orient': 'vertical'
              }
              }, [h('el-tooltip', {
                props: { placement: 'top', width: '500', content: params.row.content, effect: 'dark', class: 'el-tooltip__popper' }
              }, [
                h('div', { style: { color: 'rgba(102,102,102,1)', width: '500px', overflow: 'hidden', 'text-overflow': 'ellipsis',
                  'white-space': 'nowrap' }},

                params.row.content)
              ])])
            ])
          }
        }
      ],
      tableHeight: 'calc(100vh - 235px)', // 表格高度
      pagination: {
        show: true,
        sizes: true
      },
      options: {
        apiService: logfilequery, // 接口APIlogfilequery sortOrder
        params: {
          opDateOrder: 1 // 默认记录按时间倒序排列
        },
        isSettingShow: true // 是否出现设置

      },
      formValue: {}, // 搜索数据
      formInline: {
        searchMethod: formValue => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'datePicker', // datetimerange
            datePickerType: 'datetimerange',
            rangeSeparator: '~',
            startPlaceholder: '选择开始操作时间',
            endPlaceholder: '选择结束操作时间',
            modelValue: 'opDate',
            itemStyle: 'width:350px',
            defaulttime: ['00:00:00', '23:59:59']
          },
          {
            itemType: 'select',
            placeholder: '请选择业务类型',
            modelValue: 'busType',
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              {
                label: '员工账号',
                value: '001'
              },
              {
                label: '合同',
                value: '002'
              }, {
                label: '收款单',
                value: '003'
              }, {
                label: '退款单',
                value: '004'
              }, {
                label: '会员账户',
                value: '005'
              }
              // {
              //   label: '学员信息',
              //   value: '006'
              // }, {
              //   label: '学员状态',
              //   value: '007'
              // }, {
              //   label: '学员考勤',
              //   value: '008'
              // }, {
              //   label: '学员积分',
              //   value: '009'
              // }, {
              //   label: '班级信息',
              //   value: '010'
              // }, {
              //   label: '课程',
              //   value: '011'
              // }, {
              //   label: '课系',
              //   value: '012'
              // }, {
              //   label: '排课',
              //   value: '013'
              // }, {
              //   label: '合同套餐',
              //   value: '014'
              // }, {
              //   label: '积分兑换物资',
              //   value: '015'
              // }
            ]
          }, {
            itemType: 'input',
            placeholder: '请输入操作详情',
            modelValue: 'content',
            isClearable: true,
            itemStyle: 'width: 150'
          }
        ]
      },
      superValue: {}, // 高级搜索
      // 高级搜索
      superSearch: {
        onClear: () => { this.onClear() },
        onSearch: (superValue) => { this.onSearch(superValue) },
        fields: [
          {
            type: 'input',
            key: 'userName',
            label: '操作人'
          },
          {
            type: 'input',
            key: 'mobile',
            label: '操作人账号'
          }
          // {
          //   type: 'dateTimePicker',
          //   key: 'opDate',
          //   label: '操作时间'
          // }
        ]
      },
      // agentlist: '' // 全局搜索
      userName: ''
      // mobile: '',
      // content: ''
      // sortName: null, // 排序字段
      // sortOrder: null // 排序方式

    }
  },
  methods: {
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      let startOpDate
      let endOpDate
      if (formValue.opDate) {
        startOpDate = formValue.opDate[0]
        endOpDate = formValue.opDate[1]
      } else {
        startOpDate = ''
        endOpDate = ''
      }
      const params = {
        busType: formValue.busType,
        startOpDate: startOpDate,
        endOpDate: endOpDate,
        content: formValue.content,
        mobile: formValue.mobile
      }

      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle() {
      // 重置的入参
      console.log('11')
      const params = {
        pageIndex: 0
      }
      this.formValue = {}
      this.$refs.tableCommon.getList(params)
    },
    /* 高级搜索 */
    onSearch(superValue) {
      const params = {
        userName: superValue.userName,
        mobile: superValue.mobile,
        ...this.formValue
      }
      this.$refs.tableCommon.getList(params)
    },
    /** 高级清除 */
    onClear() {
      const params = {
        pageIndex: 0,
        ...this.formValue
      }
      this.superValue = {}
      this.$refs.tableCommon.getList(params)
    }
  }
}
</script>

<style lang="scss" scoped>
.file {
  margin: 20px;
  .file_underline{
    border-bottom:1px solid #EEEEEE;
    padding-bottom: 10px;
    margin-bottom: 15px;
  }
}
</style>
<style lang="scss">
.el-tooltip__popper {
  max-width: 500px !important;
  text-align: left !important;
}
</style>

