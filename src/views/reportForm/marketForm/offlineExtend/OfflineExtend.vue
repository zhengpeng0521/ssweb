/**
 * 户外地推产出表
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
        ref="offlineExtend"
        :columns="columns"
        :table-height="'calc(100vh - 182px)'"
        :pagination="listQuery"
        :options="options"
        page-size-key="offlineExtend"
      />
    </Media>
    <Media :query="{maxWidth: 980}">
      <CommonTable
        ref="offlineExtend"
        :columns="columns"
        :table-height="'calc(100vh - 230px)'"
        :pagination="listQuery"
        :options="options"
        page-size-key="offlineExtend"
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
import { getOfflineExtend } from '@/api/reportForm/marketForm/offlineExtend'
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
        popoverTitle: '户外地推产出表',
        popoverContent: [
          {
            name: 'Leads数：',
            content: '查询时间段内户外推广员收集到的客户名单数量。',
            annotation: '注：只计算查询时段内新增leads数，不包括历史未处理的leads数。'
          },
          {
            name: '有效单数(率)：',
            content: '查询时间段内各类渠道收集到的名单，有效单率：有效单数 / Leads；呈现方式：有效单数&（百分比）（学员不在回收站为有效单）。'
          },
          {
            name: '无效单数(率)：',
            content: '查询时间段内各类渠道收集到的名单。无效单率：无效单数 / Leads；呈现方式：无效单数&（百分比）（学员添加至回收站计为无效单）。'
          },
          {
            name: '到访数：',
            content: '查询时间段内各类渠道名下客户名单有确认到访记录的数量。',
            annotation: '注：1. 多次到访只计算一次到访；2. 到访数 = 实际上门试听的人数 + 实际到访的人数，只完成上门试听或实际到访都可计算为一个到访数，到访数客户去重；3. 到访数计算包括在读学员，潜在学员，往期学员的确认到访数。'
          },
          {
            name: '到访比：',
            content: 'Leads / 到访数，例子：Leads数100，签单数10，则数据呈现样式为：（10：1）。'
          },
          {
            name: '签单数：',
            content: '查询时间段内，客户一次或多次新签单只计为1次签单数，1次签单生成多个合同也算1次签单；若有退费合同，当该学员在查询时段内所生成的所有主合同所有课时都通过退款单退课时退为0，该签单数减1；若有历史合同在查询时段内退费不扣签单数。',
            annotation: '注：1.不计算转校转入，转介绍合同；2.历史签约合同退费不计算进查询时间段内的签单数；3.续费签单金额不计算。'
          },
          {
            name: '到访签单比：',
            content: '到访数 / 签单数。'
          },
          {
            name: '签单金额：',
            content: '查询时间段内各市场渠道客户签单金额累计数（只计算客户名下完成合同审核通过、合同全额付款完成、付款审核通过算为业绩的合同金额，如合同在查询时间段内发生退费，签单金额则扣除实际在系统内的合同中退掉的的金额）。',
            annotation: '注：1.退费金额只计算查询时间段内完成合同审核、合同全额付款完成且付款审核通过的合同，并且这些合同在查询时段内发生退款且完成退款审核的退款金额，若有退费手续费则留在签单金额中；2.不计算转校转入合同、转介绍合同数据；3.历史合同退费不影响查询时间段内的签单金额；4.续费签单金额不计算。'
          },
          {
            name: '均单金额：',
            content: '签单金额 / 签单数。'
          }
        ]
      },
      listQuery: {
        show: true // 是否显示
      },
      options: {
        index: true,
        apiService: getOfflineExtend, // 表格的数据请求接口
        params
      },
      columns: [
        {
          label: '户外推广员',
          prop: 'sellerName',
          width: '150px',
          isShowTooltip: true
        }, {
          label: 'Leads数',
          prop: 'leadsNum',
          width: '150px',
          isShowTooltip: true
        }, {
          label: '有效单（率）',
          prop: 'effectiveClue',
          width: '150px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => (
            `${row.effectiveClue}（${row.effectiveClueRate}）`
          )
        }, {
          label: '无效单（率）',
          prop: 'invalidClue',
          width: '150px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => (
            `${row.invalidClue}（${row.invalidClueRate}）`
          )
        }, {
          label: '到访数',
          prop: 'visitNum',
          width: '150px',
          isShowTooltip: true
        }, {
          label: '到访比',
          prop: 'visitRate',
          width: '150px',
          isShowTooltip: true
        }, {
          label: '签单数',
          prop: 'signNum',
          width: '150px',
          isShowTooltip: true
        }, {
          label: '到访签单比',
          prop: 'signVisitRate',
          width: '150px',
          isShowTooltip: true
        }, {
          label: '签单金额',
          prop: 'signMoney',
          width: '150px',
          isShowTooltip: true
        }, {
          label: '均单金额',
          prop: 'signAVGMoney',
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
      this.searchValue = payload
      this.options.params = payload
      this.$refs.offlineExtend.getList(payload)
    },

    /** 导出 */
    exportFile() {
      const params = {
        ...this.searchValue
      }
      if (this.$refs.offlineExtend.totalCount > 0) {
        exportFile(`${window.REPORT_URL}/stat/tmk/outpromote/export`, params)
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
