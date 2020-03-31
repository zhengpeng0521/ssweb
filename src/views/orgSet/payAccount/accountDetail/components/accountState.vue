<template>
  <div>

    <CommonSearch
      ref="search"
      :is-inline="true"
      :params="formInline"
      :forms="formInline"
      @toParent="resetFieldHanle"
    />

    <el-button
      class="green_btn fr"
      @click="exportExcel('moneyWater')"
    >导出</el-button>

    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="optionsTab"
    />

  </div>
</template>

<script>
import { queryPayHistoryAccountList } from '@/api/orgSet/payAccount'//eslint-disable-line
import moment from 'moment'
import CommonTable from '@/components/CommonTable/CommonTable'
import CommonSearch from '@/components/CommonSearch/CommonSearch'
import { exportFile } from '@/utils/exportFile'

export default {
  components: {
    CommonTable,
    CommonSearch
  },
  data() {
    return {
      formValue: {
        startTime: moment().subtract(1, 'months').format('YYYY-MM-DD'),
        endTime: moment().format('YYYY-MM-DD')
      },
      formInline: {
        searchMethod: formValue => {
          this.searchHandle(formValue)
        },
        modifyTime: [
          moment().subtract(1, 'months').format('YYYY-MM-DD'),
          moment().format('YYYY-MM-DD')
        ],
        forms: [
          {
            itemType: 'datePickerChange',
            datePickerType: 'daterange',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'yyyy-MM-dd',
            modelValue: 'modifyTime',
            itemStyle: 'width:231px',
            isClearable: false,
            default: true,
            toChange: this.timeChange
          },
          {
            itemType: 'select',
            placeholder: '请选择类型',
            modelValue: 'moneyType',
            isClearable: true,
            selectOption: [
              {
                label: '收款',
                value: '1'
              },
              {
                label: '退款',
                value: '2'
              }
            ]
          }
        ]
      },

      listQuery: {
        show: true // 是否显示
      },
      columns: [

        {
          label: '编号',
          prop: 'id',
          isShowTooltip: true
        },
        {
          label: '交易单号',
          prop: 'tradeNo',
          isShowTooltip: true
        },
        {
          label: '描述',
          prop: 'subject',
          isShowTooltip: true
        },
        {
          label: '发生金额',
          prop: 'amount',
          render: (h, params) => {
            return h('span', {}, [
              h('el-popover', {
                props: { placement: 'top', trigger: 'hover', content: params.row.amount }
              }, [
                h('a', { slot: 'reference' }, params.row.amount)
              ])
            ])
          }
        },
        {
          label: '账号金额',
          prop: 'balance',
          isShowTooltip: true
        },
        {
          label: '类型',
          prop: 'trxType',
          isShowTooltip: true
        }, {
          label: '提交时间',
          prop: 'createTime',
          width: '140px',
          isShowTooltip: true
        }

      ],
      optionsTab: {
        apiService: queryPayHistoryAccountList, // 表格的数据请求接口
        isSettingShow: false, // 是否出现设置
        params: {
          startTime: moment().subtract(1, 'months').format('YYYY-MM-DD'),
          endTime: moment().format('YYYY-MM-DD')
        }
      },

      tableHeight: 'calc(100vh - 259px)'

    }
  },

  methods: {
    // 搜索重置
    resetFieldHanle() {
      this.$refs.search.formValue.modifyTime = [
        moment().subtract(1, 'months').format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD')
      ]
      this.$refs.search.formValue.moneyType = ''

      const params = {
        startTime: moment().subtract(1, 'months').format('YYYY-MM-DD'),
        endTime: moment().format('YYYY-MM-DD'),
        moneyType: ''
      }
      this.$refs.tableCommon.getList(params)
    },

    // 搜索数据
    searchHandle(formValue) {
      const params = {
        startTime: formValue.modifyTime[0],
        endTime: formValue.modifyTime[1],
        moneyType: formValue.moneyType
      }
      this.formValue = {
        ...this.formValue,
        ...params
      }
      this.$refs.tableCommon.getList(params)
    },

    // 时间修改
    timeChange(e) {
      this.formInline.modifyTime = e
    },

    // 导出表格
    exportExcel() {
      const params = {
        ...this.formValue
      }
      if (this.$refs.tableCommon.totalCount > 0) {
        exportFile(`${window.SYS_URL}/sysBase/accountList/export`, params)
      } else {
        this.$message.error('暂无数据导出')
      }
    }
  }
}
</script>
