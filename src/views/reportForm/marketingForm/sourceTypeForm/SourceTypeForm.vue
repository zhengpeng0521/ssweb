<template>
  <div>
    <FormSearch
      ref="formSearch"
      v-bind="formSearchProps"
      :loading="loading"
    />
    <Media :query="{minWidth: 980}">
      <CommonTable
        ref="sourceType"
        :columns="columns"
        :table-height="'calc(100vh - 150px)'"
        :pagination="listQuery"
        :options="options"
      />
    </Media>
    <Media :query="{maxWidth: 980}">
      <CommonTable
        ref="sourceType"
        :columns="columns"
        :table-height="'calc(100vh - 200px)'"
        :pagination="listQuery"
        :options="options"
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
import { getSourceType } from '@/api/reportForm/sourceType'
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
        exportFile: this.exportFile,
        popoverTitle: '来源类别转化表',
        popoverContent: [
          {
            name: 'Leads数：',
            content: '查询时间段内各渠道收集到的客户名单数量。',
            annotation: '注：只计算查询时段内新增leads数，不包括历史未处理的leads数。'
          },
          {
            name: '到访数：',
            content: '查询时间段内各类渠道名下客户名单有确认到访记录的数量。',
            annotation: '注：1. 多次到访只计算一次到访；2. 到访数 = 实际上门试听的人数 + 实际到访的人数，只完成上门试听或实际到访都可计算为一个到访数；到访数客户去重；3. 到访数计算包括在读学员，潜在学员，往期学员的确认到访数。'
          },
          {
            name: '到访比：',
            content: 'Lead数/到访数。'
          },
          {
            name: '签单数：',
            content: '查询时间段内，客户一次或多次新签单只计为1次签单数，1次签单生成多个合同也算1次签单；若有退费合同，当该学员在查询时段内所生成的所有主合同所有课时都通过退款单退课时退为0，该签单数减1；若有历史合同在查询时段内退费不扣签单数。',
            annotation: '注：1.不计算转校转入合同数据；2.历史合同退费不影响查询时间段内的签单数；3.续费合同不计算。'
          },
          {
            name: '到访签单比：',
            content: '到访数/签单数。'
          },
          {
            name: '签单金额：',
            content: '查询时间段内各市场渠道客户签单金额累计数（只计算客户名下完成合同审核通过、合同全额付款完成、付款审核通过的合同的应缴金额，如这类合同在查询时间段内发生退费，签单金额则扣除实际在系统内的合同中退掉的的金额，退费手续费留在签单金额内）。',
            annotation: '注：1.退费金额只计算查询时间段内完成合同审核、合同全额付款完成且付款审核通过的合同，并且这些合同在查询时段内发生退款且完成退款审核的退款金额；2.来源类别转化表不计算转校转入合同、续约合同数据；3.历史合同退费不影响查询时间段内的签单金额。'
          },
          {
            name: '均单金额：',
            content: '签单金额/签单数。',
            annotation: '注：1.查询时间段内的转校收入不计算转入校业绩；2.查询时间段内的转校转入学员不计算转入校的签单数；3.历史合同退费不影响查询时间段内的均单金额。'
          }
        ]
      },
      listQuery: {
        show: false // 是否显示
      },
      options: {
        apiService: getSourceType, // 表格的数据请求接口
        params
      },
      columns: [
        {
          label: '来源类别',
          prop: 'channel',
          isShowTooltip: true
        }, {
          label: 'Leads数',
          prop: 'leads',
          isShowTooltip: true
        }, {
          label: '到访数',
          prop: 'visit',
          isShowTooltip: true
        }, {
          label: '到访比',
          prop: 'visitRatio',
          isShowTooltip: true
        }, {
          label: '签单数',
          prop: 'purNum',
          isShowTooltip: true
        }, {
          label: '到访签单比',
          prop: 'visitRatioPur',
          width: '120px',
          isShowTooltip: true
        }, {
          label: '签单金额',
          prop: 'orderMoney',
          isShowTooltip: true
        }, {
          label: '均单金额',
          prop: 'avgPurMoney',
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
      this.searchValue = payload
      this.options.params = payload
      this.$refs.sourceType.getList(payload)
    },

    /** 导出 */
    exportFile() {
      const params = {
        ...this.searchValue
      }
      exportFile(`${window.REPORT_URL}/erp/tmk/export/sourceType`, params)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-table {
  margin-top: 20px;
}
</style>
