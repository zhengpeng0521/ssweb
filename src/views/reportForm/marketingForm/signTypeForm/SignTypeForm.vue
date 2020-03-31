<template>
  <div>
    <FormSearch
      ref="formSearch"
      v-bind="formSearchProps"
      :loading="loading"
    />
    <Media :query="{minWidth: 980}">
      <CommonTable
        ref="signType"
        :columns="columns"
        :table-height="'calc(100vh - 182px)'"
        :pagination="listQuery"
        :options="options"
      />
    </Media>
    <Media :query="{maxWidth: 980}">
      <CommonTable
        ref="signType"
        :columns="columns"
        :table-height="'calc(100vh - 230px)'"
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
import { getSignType } from '@/api/reportForm/signType'
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
        popoverTitle: '签单类型统计表',
        popoverContent: [
          {
            name: '业绩金额：',
            content: '退费前业绩 - 退费金额（退费金额：查询时间段内当前校区中所有合同的退费金额，以退费审核通过时间作为退费计算时间；该退费包括部分退费；该退费包括在选择时段外生成的合同在选择时段内的进行退费的金额，退费金额包括转校转入合同）。'
          },
          {
            name: '业绩占比：',
            content: '当前签约类型业绩金额 / 总业绩金额。'
          },
          {
            name: '退费前业绩：',
            content: '查询时段内，以合同审核时间为数据选取点，合同审核通过、合同全额付款完成、付款审核通过的合同才计算退费前业绩金额，转校转入的合同不算进退费前业绩金额。'
          },
          {
            name: '招生人数：',
            content: '查询时间段内合同算为业绩，则对应学员计算为签单人数。',
            annotation: '注：1. 一个学员查询时段内多次签单/生成多个合同的，只计算一个招生人数；2. 若学员对应合同部分退费，该学员人数不减；3. 当该学员在查询时段内所生成的所有主合同所有课时都通过退款单退课时退为0，该学员减去；4. 招生人数增减计算只看主合同，不考虑赠送合同情况；5. 历史合同退费不影响查询时间段内的招生人数；6. 转校转入学员不计算招生人数。'
          },
          {
            name: '均单金额：',
            content: '（查询时间段内的所有计算为业绩的金额 - 在查询时间段内计算业绩并当月发生退费的合同产生退费的金额）/ 招生人数。',
            annotation: '注：1.查询时间段内的转校转入合同不计算转入校业绩；2.查询时间段内的转校学员不计算转入校的招生人数；3.历史签订为业绩的合同退费不影响查询时间段内的均单金额。'
          },
          {
            name: '合同数：',
            content: '按合同审核通过时间在查询时段内为筛选点，合同审核通过，合同全额付款完成，付款审核通过即记一个合同数；合同数包括赠送合同数，赠送合同按合同审核通过时间在查询时段内为筛选点，合同审核为“已通过”，付款状态为“已通过”则记一个合同数。',
            annotation: '注：1.如果在查询时间段内发生部分退费，合同内的剩余课时数大于0，则不扣除该退费合同数，如果该合同所含所有课时都通过退款单退课时全部退光，则扣除该合同数），不算转校转入合同。（退合同计算包括赠送合同）；2.查询时段内手工作废的赠送合同数也要扣除；3.历史签约合同退费不影响查询时间段内的合同数。'
          },
          {
            name: '签单课时：',
            content: '查询时间段内由客户签单所生成对应合同类型所包含的课时总数（含赠送合同），只计算有过付清记录的合同数量（如发生退费，则扣除相应的退费课时）。',
            annotation: '注：1.查询时段内已经计算签单课时之后又手工作废掉的赠送合同内所含的课时数也扣除；2.查询时间段内的转校合同内所含的课时不计算转入校的签单课时；3.历史合同退费不影响查询时间段内的签单课时。'
          },
          {
            name: '课时单价：',
            content: '（查询时间段内退费前业绩的金额 - 在查询时间段内计算业绩并当月发生退费的合同产生退费的金额）/ 签单课时。',
            annotation: '注：1.查询时间段内的转校收入不计算转入校业绩；2.历史签约合同退费不影响查询时间段内的课时单价。'
          }
        ]
      },
      listQuery: {
        show: false // 是否显示
      },
      options: {
        apiService: getSignType, // 表格的数据请求接口
        params
      },
      columns: [
        {
          label: '签单类型',
          prop: 'typeName',
          isShowTooltip: true
          // formatter: (row, column, cellValue) => {
          //   const type = row.type + ''
          //   const text = type === '0' ? '新签' : type === '1' ? '新签-转介绍' : type === '2' ? '续费' : type === '3' ? '总计' : ''

          //   return `<div>${text}</div>`
          // }
        }, {
          label: '业绩金额',
          prop: 'orderMoney',
          isShowTooltip: true
        }, {
          label: '业绩占比',
          prop: 'perfPerce',
          isShowTooltip: true
        }, {
          label: '退费前业绩',
          prop: 'beforeOrderMoney',
          isShowTooltip: true,
          width: '120px'
        }, {
          label: '招生人数',
          prop: 'stuNum',
          isShowTooltip: true
        }, {
          label: '均单金额',
          prop: 'avgOrderMoney',
          isShowTooltip: true
        }, {
          label: '合同数',
          prop: 'purNum',
          isShowTooltip: true
        }, {
          label: '签单课时',
          prop: 'periodNum',
          isShowTooltip: true
        }, {
          label: '课时单价',
          prop: 'perPrice',
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
      this.$refs.signType.getList(payload)
    },

    /** 导出 */
    exportFile() {
      const params = {
        ...this.searchValue
      }

      exportFile(`${window.REPORT_URL}/erp/tmk/export/signType`, params)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-table {
  margin-top: 20px;
}
</style>
