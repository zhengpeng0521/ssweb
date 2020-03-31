/**
 *财务对账表
 */
<template>
  <div>
    <FormSearch
      ref="formSearch"
      v-bind="formSearchProps"
      :loading="loading"
    />
    <Media :query="{minWidth: 980}">
      <CommonTable
        ref="checkMoney"
        :columns="columns"
        :table-height="'calc(100vh - 182px)'"
        :pagination="listQuery"
        :options="options"
        page-size-key="checkMoney"
      />
    </Media>
    <Media :query="{maxWidth: 980}">
      <CommonTable
        ref="checkMoney"
        :columns="columns"
        :table-height="'calc(100vh - 230px)'"
        :pagination="listQuery"
        :options="options"
        page-size-key="checkMoney"
        class="form-table"
      />
    </Media>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Media from 'vue-media'
import moment from 'moment'
import FormSearch from '@/components/ReportForm/FormSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import { getCheckMoney } from '@/api/reportForm/moneyForm/checkMoney'
import { exportFile } from '@/utils/exportFile'

export default {
  components: {
    Media,
    FormSearch,
    CommonTable
  },

  data() {
    const now = moment()
    const start = now.add('month', 0).format('YYYY-MM') + '-01'
    const end = moment(start).add('month', 1).add('days', -1).format('YYYY-MM-DD')
    const params = {
      startTime: start,
      endTime: end
    }

    return {
      formSearchProps: {
        mediaWidth: 980,
        defaultDate: [new Date(start), new Date(end)],
        searchHandle: this.makeForm,
        exportFile: this.exportFile
      },
      listQuery: {
        show: true // 是否显示
      },
      options: {
        index: true,
        apiService: getCheckMoney, // 表格的数据请求接口
        params
      },
      columns: [
        {
          label: '合同号',
          prop: 'purchaseNum',
          width: '150px',
          isShowTooltip: true
        }, {
          label: '学员姓名',
          prop: 'stuName',
          width: '150px',
          isShowTooltip: true
        }, {
          label: '日期',
          prop: 'costTime',
          width: '150px',
          isShowTooltip: true
        }, {
          label: '缴费类型',
          prop: 'typeName',
          width: '150px',
          isShowTooltip: true
        }, {
          label: '缴费方式',
          prop: 'costWay',
          width: '150px',
          isShowTooltip: true
        }, {
          label: '缴费金额',
          prop: 'money',
          width: '150px',
          isShowTooltip: true
        }, {
          label: '收据编号',
          prop: 'costNum',
          width: '150px',
          isShowTooltip: true
        }, {
          label: '创建人',
          prop: 'creator',
          width: '150px',
          isShowTooltip: true
        }, {
          label: '备注',
          prop: 'remark',
          width: '150px',
          isShowTooltip: true
        }
      ],
      searchValue: params
    }
  },

  computed: {
    ...mapState('commonTable', [
      'loading'
    ])
  },

  methods: {
    /** 生成报表 */
    makeForm(values) {
      const payload = {
        startTime: values.date[0],
        endTime: values.date[1]
      }
      this.options.params = payload
      this.searchValue = payload
      this.$refs.checkMoney.getList(payload)
    },

    /** 导出 */
    exportFile() {
      const params = {
        ...this.searchValue
      }
      if (this.$refs.checkMoney.totalCount > 0) {
        exportFile(`${window.REPORT_URL}/stat/tmk/financialCounting/export`, params)
      } else {
        this.$message.error('暂无数据导出')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-table {
  margin-top: 20px;
}
</style>
