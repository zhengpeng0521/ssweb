/**
 * 市场渠道转化表
 */
<template>
  <div>
    <FormSearch
      ref="formSearch"
      v-bind="formSearchProps"
      :loading="loading"
    />
    <div :style="{ height: 'calc(100vh - 130px)', overflow: 'auto' }">
      <CommonTable
        ref="classMonthTotal"
        :columns="columns"
        :table-height="'100px'"
        :table-loading="loading"
        :data-source="total"
      />
      <Media :query="{minWidth: 980}">
        <CommonTable
          ref="marketSourceList"
          :columns="listColumns"
          :table-height="'calc(100vh - 345px)'"
          :table-loading="loading"
          :data-source="sourceList"
          class="class-month-table"
        />
      </Media>
      <Media :query="{maxWidth: 980}">
        <CommonTable
          ref="marketSourceList"
          :columns="listColumns"
          :table-height="'calc(100vh - 372px)'"
          :table-loading="loading"
          :data-source="sourceList"
          class="class-month-table"
        />
      </Media>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Media from 'vue-media'
import moment from 'moment'
import FormSearch from '@/components/ReportForm/FormSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
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

    return {
      formSearchProps: {
        mediaWidth: 980,
        defaultDate: [new Date(start), new Date(end)],
        searchHandle: this.makeForm,
        exportFile: this.exportFile,
        popoverTitle: '市场渠道转化表',
        popoverContent: [
          {
            name: 'Leads数：',
            content: '查询时间段内从各类渠道收集到的客户名单数量。',
            annotation: '注：只计算查询时段内新增leads数，不包括历史未处理的leads数。'
          },
          {
            name: '有效单数(率)：',
            content: '查询时间段内各类渠道收集到的名单。有效单率：有效单数 / Leads；呈现方式：有效单数&（百分比）（学员有跟进状态为一个有效单）。'
          },
          {
            name: '无效单数(率)：',
            content: '查询时间段内各类渠道收集到的名单。无效单率：无效单数 / Leads；呈现方式：无效单数&（百分比）（学员添加至回收站计为一个无效单）。'
          },
          {
            name: '到访数：',
            content: '查询时间段内各类渠道名下客户名单有确认到访记录的数量。',
            annotation: '注：1. 多次到访只计算一次到访；2. 到访数 = 实际上门试听的人数 + 实际到访的人数，只完成上门试听或实际到访都可计算为一个到访数；到访数客户去重；3. 到访数计算包括在读学员，潜在学员，往期学员的确认到访数。'
          },
          {
            name: '到访比：',
            content: 'Leads / 到访数，例子：Leads数100，签单数10，则数据呈现样式为：（10：1）。'
          },
          {
            name: '签单数：',
            content: '查询时间段内，客户一次或多次新签单只计为1次签单数，1次签单生成多个合同也算1次签单；若有退费合同，当该学员在查询时段内所生成的所有主合同所有课时都通过退款单退课时退为0，该签单数减1；若有历史合同在查询时段内退费不扣签单数；转校转入的合同不计算。',
            annotation: '注：1.市场渠道不计算转校转入合同数据、转介绍合同数据；2.历史合同退费不影响查询时间段内的签单数；3.不计算续约签单数。'
          },
          {
            name: '到访签单比：',
            content: '到访数 / 签单数。'
          },
          {
            name: '签单金额：',
            content: '查询时间段内各市场渠道客户签单金额累计数（只计算客户名下完成合同审核通过、合同全额付款完成、付款审核通过算为业绩的合同金额，如合同在查询时间段内发生退费，签单金额则扣除实际在系统内的合同中退掉的的金额）。',
            annotation: '注：1.退费金额只计算查询时间段内完成合同审核、合同全额付款完成且付款审核通过的合同，并且这些合同在查询时段内发生退款且完成退款审核的退款金额；2.市场渠道不计算转校转入合同、转介绍合同数据；3.历史签约合同在查询时间段内退费不计算进签单金额；4.续费合同签单金额不计算；5.退费手续费留在签单金额中。'
          },
          {
            name: '均单金额：',
            content: '签单金额 / 签单数。'
          }
        ]
      },
      columns: [
        {
          label: '统计类型',
          prop: 'countType',
          width: '200px'
        }, {
          label: 'Leads数',
          prop: 'leadsNum',
          width: '140px'
        }, {
          label: '有效单数（率）',
          prop: 'effectPurData',
          width: '140px'
        }, {
          label: '无效单数（率）',
          prop: 'unEffectivePurData',
          width: '140px'
        }, {
          label: '到访数',
          prop: 'visitNum',
          width: '140px'
        }, {
          label: '到访比',
          prop: 'visitRat',
          width: '140px'
        }, {
          label: '签单数',
          prop: 'purNum',
          width: '140px'
        }, {
          label: '到访签单比',
          prop: 'purVisitRat',
          width: '140px'
        }, {
          label: '签单金额',
          prop: 'purMoney',
          width: '140px'
        }, {
          label: '均单金额',
          prop: 'avgMoney',
          width: '140px'
        }
      ],
      listColumns: [
        {
          label: '市场渠道',
          prop: 'channelName',
          width: '100px',
          isShowTooltip: true
        }, {
          label: '二级渠道',
          prop: 'secondName',
          width: '100px',
          isShowTooltip: true
        }, {
          label: 'Leads数',
          prop: 'leadsNum',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '有效单数（率）',
          prop: 'effectPurData',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '无效单数（率）',
          prop: 'unEffectivePurData',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '到访数',
          prop: 'visitNum',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '到访比',
          prop: 'visitRat',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '签单数',
          prop: 'purNum',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '到访签单比',
          prop: 'purVisitRat',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '签单金额',
          prop: 'purMoney',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '均单金额',
          prop: 'avgMoney',
          width: '140px',
          isShowTooltip: true
        }
      ]
    }
  },

  computed: {
    ...mapState('marketSource', [
      'loading',
      'total',
      'sourceList',
      'searchValue'
    ])
  },

  mounted() {
    const now = moment()
    const start = now.add('month', 0).format('YYYY-MM') + '-01'
    const end = moment(start).add('month', 1).add('days', -1).format('YYYY-MM-DD')
    const payload = {
      startTime: start,
      endTime: end
    }
    this.getMarketSource(payload)
  },

  methods: {
    ...mapActions('marketSource', [
      'getMarketSource'
    ]),

    /** 生成报表 */
    makeForm(values) {
      const payload = {
        startTime: values.date[0],
        endTime: values.date[1]
      }
      this.getMarketSource(payload)
    },

    /** 导出 */
    exportFile() {
      const params = {
        ...this.searchValue
      }
      if (this.total.length > 0) {
        exportFile(`${window.REPORT_URL}/stat/tmk/channelData/export`, params)
      } else {
        this.$message.error('暂无数据导出')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.class-month-table {
  margin-top: 20px;
}
</style>
