<template>
  <div :class="className">
    <ChartCard
      v-bind="stuNumProps"
      :loading="loading"
      :data-source="chartList"
    />
    <ChartCard
      v-bind="saleProps"
      :loading="loading"
      :data-source="chartList"
      class="sale-chart"
    />
    <BlockTitle
      :export-file="() => {exportFile('detail')}"
      class="achivement-title"
    >销售工作详情</BlockTitle>
    <CommonTable
      ref="achivementTotal"
      :columns="columns"
      :is-border="true"
      :table-height="'100px'"
      :table-loading="loading"
      :data-source="total"
      class="achivement-table"
    />
    <FormTable
      :loading="loading"
      :data-source="tableList"
      :columns="detailCols"
      :page-count="pageCount"
      :page-change="pageChange"
      class="form-detail-table"
    />
  </div>
</template>

<script>
import ChartCard from '@/components/ReportForm/ChartCard'
import BlockTitle from '@/components/MiniCommon/BlockTitle'
import CommonTable from '@/components/CommonTable/CommonTable'
import FormTable from '@/components/ReportForm/FormTable'

export default {
  components: {
    ChartCard,
    BlockTitle,
    CommonTable,
    FormTable
  },

  props: {
    size: {
      type: String,
      required: true
    },
    exportFile: {
      type: Function,
      default: undefined
    },
    loading: {
      type: Boolean,
      required: true
    },
    chartList: {
      type: Array,
      required: true
    },
    total: {
      type: Array,
      required: true
    },
    tableList: {
      type: Array,
      required: true
    },
    pageCount: {
      type: Number,
      default: 0
    },
    pageChange: {
      type: Function,
      default: undefined
    }
  },

  data() {
    return {
      // className: this.size === 'small' ? 'achivement-small' : 'achivement-large',
      className: 'achivement-large',
      stuNumProps: {
        title: '按学员数量',
        type: 'line',
        exportFile: this.exportFile.bind(this, 'stu'),
        allCols: [
          { key: 'newStuNum', value: '新学员' },
          { key: 'oldStuNum', value: '续费学员' }
        ],
        showCols: ['signTime', 'newStuNum', 'oldStuNum']
      },
      saleProps: {
        title: '按销售额',
        iconContent: '查询时间段内，合同签订后即计算销售额，包括转校转入的合同金额',
        type: 'line',
        exportFile: this.exportFile.bind(this, 'sale'),
        allCols: [
          { key: 'newPurchaseMoney', value: '新报销售额' },
          { key: 'continuePurchaseMoney', value: '续费销售额' }
        ],
        showCols: ['signTime', 'newPurchaseMoney', 'continuePurchaseMoney']
      },
      columns: this.$store.getters.language === 'dsf' ? [
        {
          label: '统计类型',
          prop: 'totalType',
          formatter: (row, column, cellValue) => {
            return '总计'
          }
        }, {
          label: '新学员数（占比）',
          prop: 'newStuNum',
          width: '96px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            const text = row.newStuNum + row.oldStuNum === 0 ? '0 (0.00%)'
              : `${row.newStuNum} (${(row.newStuNum / (row.newStuNum + row.oldStuNum) * 100).toFixed(2)}%)`
            return text
          }
        }, {
          label: '新学员合同数（占比）',
          prop: 'newPurNum',
          width: '120px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            const text = row.totalPurNum === 0 ? '0 (0.00%)'
              : `${row.newPurNum} (${(row.newPurNum / row.totalPurNum * 100).toFixed(2)}%)`
            return text
          }
        }, {
          label: '新学员合同金额（占比）',
          prop: 'newPurMoney',
          width: '130px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            const text = row.totalPurMoney === 0 ? '0 (0.00%)'
              : `${row.newPurMoney} (${(row.newPurMoney / row.totalPurMoney * 100).toFixed(2)}%)`
            return text
          }
        }, {
          label: '新学员业绩金额（占比）',
          prop: 'newDicmoneyMoney',
          width: '130px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            const text = row.totalDicmoneyMoney === 0 ? '0 (0.00%)'
              : `${row.newDicmoneyMoney} (${(row.newDicmoneyMoney / row.totalDicmoneyMoney * 100).toFixed(2)}%)`
            return text
          }
        }, {
          label: '续费学员数（占比）',
          prop: 'oldStuNum',
          width: '120px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            const text = row.oldStuNum + row.newStuNum === 0 ? '0 (0.00%)'
              : `${row.oldStuNum} (${(row.oldStuNum / (row.oldStuNum + row.newStuNum) * 100).toFixed(2)}%)`
            return text
          }
        }, {
          label: '续费学员合同数（占比）',
          prop: 'renewPurNum',
          width: '130px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            const text = row.totalPurNum === 0 ? '0 (0.00%)'
              : `${row.renewPurNum} (${(row.renewPurNum / row.totalPurNum * 100).toFixed(2)}%)`
            return text
          }
        }, {
          label: '续费学员合同金额（占比）',
          prop: 'renewPurMoney',
          width: '145px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            const text = row.totalPurMoney === 0 ? '0 (0.00%)'
              : `${row.renewPurMoney} (${(row.renewPurMoney / row.totalPurMoney * 100).toFixed(2)}%)`
            return text
          }
        }, {
          label: '续费学员业绩金额（占比）',
          prop: 'renewDicmoneyMoney',
          width: '145px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            const text = row.totalDicmoneyMoney === 0 ? '0 (0.00%)'
              : `${row.renewDicmoneyMoney} (${(row.renewDicmoneyMoney / row.totalDicmoneyMoney * 100).toFixed(2)}%)`
            return text
          }
        }, {
          label: '总合同数',
          prop: 'totalPurNum',
          width: '96px',
          isShowTooltip: true
        }, {
          label: '总合同金额',
          prop: 'totalPurMoney',
          width: '110px',
          isShowTooltip: true
        }, {
          label: '总业绩金额',
          prop: 'totalDicmoneyMoney',
          width: '110px',
          isShowTooltip: true
        }, {
          label: '转入/转出合同数',
          prop: 'tranSchInNum',
          width: '135px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            return `${row.tranSchInNum}/${row.tranSchOutNum}`
          }
        }, {
          label: '转入/转出合同金额',
          prop: 'tranSchOutMoney',
          width: '150px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            return `${row.tranSchInMoney}/${row.tranSchOutMoney}`
          }
        }
      ] : [
        {
          label: '统计类型',
          prop: 'totalType',
          formatter: (row, column, cellValue) => {
            return '总计'
          }
        }, {
          label: '新学员数（占比）',
          prop: 'newStuNum',
          width: '96px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            const text = row.newStuNum + row.oldStuNum === 0 ? '0 (0.00%)'
              : `${row.newStuNum} (${(row.newStuNum / (row.newStuNum + row.oldStuNum) * 100).toFixed(2)}%)`
            return text
          }
        }, {
          label: '新学员合同数（占比）',
          prop: 'newPurNum',
          width: '120px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            const text = row.totalPurNum === 0 ? '0 (0.00%)'
              : `${row.newPurNum} (${(row.newPurNum / row.totalPurNum * 100).toFixed(2)}%)`
            return text
          }
        }, {
          label: '新学员合同金额（占比）',
          prop: 'newPurMoney',
          width: '130px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            const text = row.totalPurMoney === 0 ? '0 (0.00%)'
              : `${row.newPurMoney} (${(row.newPurMoney / row.totalPurMoney * 100).toFixed(2)}%)`
            return text
          }
        }, {
          label: '续费学员数（占比）',
          prop: 'oldStuNum',
          width: '120px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            const text = row.oldStuNum + row.newStuNum === 0 ? '0 (0.00%)'
              : `${row.oldStuNum} (${(row.oldStuNum / (row.oldStuNum + row.newStuNum) * 100).toFixed(2)}%)`
            return text
          }
        }, {
          label: '续费学员合同数（占比）',
          prop: 'renewPurNum',
          width: '130px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            const text = row.totalPurNum === 0 ? '0 (0.00%)'
              : `${row.renewPurNum} (${(row.renewPurNum / row.totalPurNum * 100).toFixed(2)}%)`
            return text
          }
        }, {
          label: '续费学员合同金额（占比）',
          prop: 'renewPurMoney',
          width: '145px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            const text = row.totalPurMoney === 0 ? '0 (0.00%)'
              : `${row.renewPurMoney} (${(row.renewPurMoney / row.totalPurMoney * 100).toFixed(2)}%)`
            return text
          }
        }, {
          label: '总合同数',
          prop: 'totalPurNum',
          width: '96px',
          isShowTooltip: true
        }, {
          label: '总合同金额',
          prop: 'totalPurMoney',
          width: '110px',
          isShowTooltip: true
        }, {
          label: '转入/转出合同数',
          prop: 'tranSchInNum',
          width: '135px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            return `${row.tranSchInNum}/${row.tranSchOutNum}`
          }
        }, {
          label: '转入/转出合同金额',
          prop: 'tranSchOutMoney',
          width: '150px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            return `${row.tranSchInMoney}/${row.tranSchOutMoney}`
          }
        }
      ],
      detailCols: this.$store.getters.language === 'dsf' ? [
        {
          label: '姓名',
          prop: 'userName',
          isShowTooltip: true,
          width: '96px'
        }, {
          label: '新签合同（包含转介绍）',
          children: [
            {
              label: '新学员合同数',
              prop: 'newPurchaseNum',
              isShowTooltip: true,
              width: '110px',
              align: 'right'
            }, {
              label: '合同金额',
              prop: 'newPurchaseMoney',
              isShowTooltip: true,
              align: 'right',
              width: '110px',
              renderHeader: (h, { column, $index }) => {
                return h('div', { 'class': 'sale_achievement_header' }, [
                  h('span', '合同金额'),
                  h('el-tooltip', { props: { effect: 'dark', content: '新签合同的签订时间在选择时间段内则计算合同金额', placement: 'top' }}, [
                    h('i', { 'class': 'iconfont icon_ym_ts', style: { marginLeft: '5px', cursor: 'pointer', color: '#666', fontSize: '16px', verticalAlign: 'middle' }})
                  ])
                ])
              }
            }, {
              label: '业绩金额',
              prop: 'newDicmoneyMoney',
              isShowTooltip: true,
              align: 'right',
              width: '110px',
              renderHeader: (h, { column, $index }) => {
                return h('div', { 'class': 'sale_achievement_header' }, [
                  h('span', '业绩金额'),
                  h('el-tooltip', { props: { effect: 'dark', placement: 'top' }}, [
                    h('div', { slot: 'content', style: { maxWidth: '400px' }}, [
                      h('p', '业绩金额：查询时间段内，退费前业绩金额 — 退费金额'),
                      h('p', '注：退费前业绩金额计算条件：合同审核通过&全额付款完成&付款审核通过。退费前业绩计算时间按合同审核通过时间为筛选点，例如8月生成一合同在10月完成全额付款且审核通过，则该业绩算在8月份。退费金额为查询时间段内合同退费金额，以退费审核通过时间作为退费计算时间；该退费包括部分退费；该退费包括在选择时段外生成的合同在选择时段内的进行退费的金额（举例：8月份合同金额为1000元，8月份合同产生退费200元，6月份完成的合同在8月退费100元，则查询8月份该销售的业绩金额为1000-200-100=700元）')
                    ]),
                    h('i', { 'class': 'iconfont icon_ym_ts', style: { marginLeft: '5px', cursor: 'pointer', color: '#666', fontSize: '16px', verticalAlign: 'middle' }})
                  ])
                ])
              }
            }, {
              label: '业绩占比金额',
              prop: 'newProDicmoney',
              isShowTooltip: true,
              align: 'right',
              width: '130px',
              renderHeader: (h, { column, $index }) => {
                return h('div', { 'class': 'sale_achievement_header' }, [
                  h('span', '业绩占比金额'),
                  h('el-tooltip', { props: { effect: 'dark', placement: 'top' }}, [
                    h('div', { slot: 'content', style: { maxWidth: '400px' }}, [
                      h('p', '业绩金额 = 合计（退费前业绩合同金额 X 退费前业绩合同对应销售占比） — 合计（退费合同金额 X 对应退费合同对应销售占比）'),
                      h('p', '注：退费前业绩金额计算条件：合同审核通过&全额付款完成&付款审核通过。退费前业绩计算时间按合同审核通过时间为筛选点，例如8月生成一合同在10月完成全额付款且审核通过，则该业绩算在8月份。退费金额为查询时间段内合同退费金额，以退费审核通过时间作为退费计算时间；该退费包括部分退费；该退费包括在选择时段外生成的合同在选择时段内的进行退费的金额（举例：8月份合同金额为1000元，8月份合同产生退费200元，6月份完成的合同在8月退费100元，则查询8月份该销售的业绩金额为1000-200-100=700元）')
                    ]),
                    h('i', { 'class': 'iconfont icon_ym_ts', style: { marginLeft: '5px', cursor: 'pointer', color: '#666', fontSize: '16px', verticalAlign: 'middle' }})
                  ])
                ])
              }
            }, {
              label: '占比金额',
              prop: 'newProportionMoney',
              isShowTooltip: true,
              align: 'right',
              width: '110px',
              renderHeader: (h, { column, $index }) => {
                return h('div', { 'class': 'sale_achievement_header' }, [
                  h('span', '占比金额'),
                  h('el-tooltip', { props: { effect: 'dark', content: '该销售在新签合同金额中的占比', placement: 'top' }}, [
                    h('i', { 'class': 'iconfont icon_ym_ts', style: { marginLeft: '5px', cursor: 'pointer', color: '#666', fontSize: '16px', verticalAlign: 'middle' }})
                  ])
                ])
              }
            }
          ]
        }, {
          label: '续费合同',
          children: [
            {
              label: '老学员合同数',
              prop: 'renewPurchaseNum',
              isShowTooltip: true,
              width: '110px',
              align: 'right'
            }, {
              label: '合同金额',
              prop: 'renewPurchaseMoney',
              isShowTooltip: true,
              align: 'right',
              width: '110px',
              renderHeader: (h, { column, $index }) => {
                return h('div', { 'class': 'sale_achievement_header' }, [
                  h('span', '合同金额'),
                  h('el-tooltip', { props: { effect: 'dark', content: '续费合同的签订时间在选择时间段内则计算合同金额', placement: 'top' }}, [
                    h('i', { 'class': 'iconfont icon_ym_ts', style: { marginLeft: '5px', cursor: 'pointer', color: '#666', fontSize: '16px', verticalAlign: 'middle' }})
                  ])
                ])
              }
            }, {
              label: '业绩金额',
              prop: 'renewDicmoneyMoney',
              isShowTooltip: true,
              align: 'right',
              width: '110px',
              renderHeader: (h, { column, $index }) => {
                return h('div', { 'class': 'sale_achievement_header' }, [
                  h('span', '业绩金额'),
                  h('el-tooltip', { props: { effect: 'dark', placement: 'top' }}, [
                    h('div', { slot: 'content', style: { maxWidth: '400px' }}, [
                      h('p', '业绩金额：查询时间段内，退费前业绩金额 — 退费金额'),
                      h('p', '注：退费前业绩金额计算条件：合同审核通过&全额付款完成&付款审核通过。退费前业绩计算时间按合同审核通过时间为筛选点，例如8月生成一合同在10月完成全额付款且审核通过，则该业绩算在8月份。退费金额为查询时间段内合同退费金额，以退费审核通过时间作为退费计算时间；该退费包括部分退费；该退费包括在选择时段外生成的合同在选择时段内的进行退费的金额（举例：8月份合同金额为1000元，8月份合同产生退费200元，6月份完成的合同在8月退费100元，则查询8月份该销售的业绩金额为1000-200-100=700元）')
                    ]),
                    h('i', { 'class': 'iconfont icon_ym_ts', style: { marginLeft: '5px', cursor: 'pointer', color: '#666', fontSize: '16px', verticalAlign: 'middle' }})
                  ])
                ])
              }
            }, {
              label: '业绩占比金额',
              prop: 'oldProDicMoney',
              isShowTooltip: true,
              align: 'right',
              width: '130px',
              renderHeader: (h, { column, $index }) => {
                return h('div', { 'class': 'sale_achievement_header' }, [
                  h('span', '业绩占比金额'),
                  h('el-tooltip', { props: { effect: 'dark', placement: 'top' }}, [
                    h('div', { slot: 'content', style: { maxWidth: '400px' }}, [
                      h('p', '业绩金额 = 合计（退费前业绩合同金额 X 退费前业绩合同对应销售占比） — 合计（退费合同金额 X 对应退费合同对应销售占比）'),
                      h('p', '注：退费前业绩金额计算条件：合同审核通过&全额付款完成&付款审核通过。退费前业绩计算时间按合同审核通过时间为筛选点，例如8月生成一合同在10月完成全额付款且审核通过，则该业绩算在8月份。退费金额为查询时间段内合同退费金额，以退费审核通过时间作为退费计算时间；该退费包括部分退费；该退费包括在选择时段外生成的合同在选择时段内的进行退费的金额（举例：8月份合同金额为1000元，8月份合同产生退费200元，6月份完成的合同在8月退费100元，则查询8月份该销售的业绩金额为1000-200-100=700元）')
                    ]),
                    h('i', { 'class': 'iconfont icon_ym_ts', style: { marginLeft: '5px', cursor: 'pointer', color: '#666', fontSize: '16px', verticalAlign: 'middle' }})
                  ])
                ])
              }
            }, {
              label: '占比金额',
              prop: 'renewProportionMoney',
              isShowTooltip: true,
              align: 'right',
              width: '110px',
              renderHeader: (h, { column, $index }) => {
                return h('div', { 'class': 'sale_achievement_header' }, [
                  h('span', '占比金额'),
                  h('el-tooltip', { props: { effect: 'dark', content: '该销售在续费签合同金额中的占比', placement: 'top' }}, [
                    h('i', { 'class': 'iconfont icon_ym_ts', style: { marginLeft: '5px', cursor: 'pointer', color: '#666', fontSize: '16px', verticalAlign: 'middle' }})
                  ])
                ])
              }
            }
          ]
        }, {
          label: '合计',
          children: [
            {
              label: '合同合计数',
              prop: 'totalNum',
              isShowTooltip: true,
              align: 'right'
            }, {
              label: '合同合计金额',
              prop: 'totalMoney',
              isShowTooltip: true,
              width: '110px',
              align: 'right'
            }, {
              label: '业绩合计金额',
              prop: 'totalDicmoneyMoney',
              isShowTooltip: true,
              width: '110px',
              align: 'right'
            }, {
              label: '业绩占比合计金额',
              prop: 'totalProDicmony',
              isShowTooltip: true,
              align: 'right',
              width: '140px'
            }, {
              label: '占比合计金额',
              prop: 'totalProportionMoney',
              isShowTooltip: true,
              width: '110px',
              align: 'right'
            }
          ]
        }
      ] : [
        {
          label: '姓名',
          prop: 'userName',
          isShowTooltip: true,
          width: '96px'
        }, {
          label: '新签合同（包含转介绍）',
          children: [
            {
              label: '新学员合同数',
              prop: 'newPurchaseNum',
              isShowTooltip: true,
              width: '110px',
              align: 'right'
            }, {
              label: '合同金额',
              prop: 'newPurchaseMoney',
              isShowTooltip: true,
              align: 'right',
              width: '110px',
              renderHeader: (h, { column, $index }) => {
                return h('div', { 'class': 'sale_achievement_header' }, [
                  h('span', '合同金额'),
                  h('el-tooltip', { props: { effect: 'dark', content: '新签合同的签订时间在选择时间段内则计算合同金额', placement: 'top' }}, [
                    h('i', { 'class': 'iconfont icon_ym_ts', style: { marginLeft: '5px', cursor: 'pointer', color: '#666', fontSize: '16px', verticalAlign: 'middle' }})
                  ])
                ])
              }
            }, {
              label: '占比金额',
              prop: 'newProportionMoney',
              isShowTooltip: true,
              align: 'right',
              width: '110px',
              renderHeader: (h, { column, $index }) => {
                return h('div', { 'class': 'sale_achievement_header' }, [
                  h('span', '占比金额'),
                  h('el-tooltip', { props: { effect: 'dark', content: '该销售在新签合同金额中的占比', placement: 'top' }}, [
                    h('i', { 'class': 'iconfont icon_ym_ts', style: { marginLeft: '5px', cursor: 'pointer', color: '#666', fontSize: '16px', verticalAlign: 'middle' }})
                  ])
                ])
              }
            }
          ]
        }, {
          label: '续费合同',
          children: [
            {
              label: '老学员合同数',
              prop: 'renewPurchaseNum',
              isShowTooltip: true,
              width: '110px',
              align: 'right'
            }, {
              label: '合同金额',
              prop: 'renewPurchaseMoney',
              isShowTooltip: true,
              align: 'right',
              width: '110px',
              renderHeader: (h, { column, $index }) => {
                return h('div', { 'class': 'sale_achievement_header' }, [
                  h('span', '合同金额'),
                  h('el-tooltip', { props: { effect: 'dark', content: '续费合同的签订时间在选择时间段内则计算合同金额', placement: 'top' }}, [
                    h('i', { 'class': 'iconfont icon_ym_ts', style: { marginLeft: '5px', cursor: 'pointer', color: '#666', fontSize: '16px', verticalAlign: 'middle' }})
                  ])
                ])
              }
            }, {
              label: '占比金额',
              prop: 'renewProportionMoney',
              isShowTooltip: true,
              align: 'right',
              width: '110px',
              renderHeader: (h, { column, $index }) => {
                return h('div', { 'class': 'sale_achievement_header' }, [
                  h('span', '占比金额'),
                  h('el-tooltip', { props: { effect: 'dark', content: '该销售在续费签合同金额中的占比', placement: 'top' }}, [
                    h('i', { 'class': 'iconfont icon_ym_ts', style: { marginLeft: '5px', cursor: 'pointer', color: '#666', fontSize: '16px', verticalAlign: 'middle' }})
                  ])
                ])
              }
            }
          ]
        }, {
          label: '合计',
          children: [
            {
              label: '合同合计数',
              prop: 'totalNum',
              isShowTooltip: true,
              align: 'right'
            }, {
              label: '合同合计金额',
              prop: 'totalMoney',
              isShowTooltip: true,
              width: '110px',
              align: 'right'
            }, {
              label: '占比合计金额',
              prop: 'totalProportionMoney',
              isShowTooltip: true,
              width: '110px',
              align: 'right'
            }
          ]
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.achivement-small {
  max-height: calc(100vh - 264px);
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 10px;
  margin-right: -10px;
}
.achivement-large {
  max-height: calc(100vh - 214px);
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 10px;
  margin-right: -10px;
}
.sale-chart {
  margin-top: 20px;
}
.achivement-title {
  margin: 20px 0 10px;
}
.form-detail-table {
  margin-top: 20px;
}
</style>

<style lang="scss">
.achivement-table {
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #ebeef5 !important;
  }
}
.sale_achievement_header {
  padding: 0 !important;
  display: flex !important;
  justify-content: flex-end;
  line-height: 23px !important;
}
</style>
