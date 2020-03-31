/** 课时月结表 */
<template>
  <div>
    <el-alert :closable="false" type="info" title="此表可以查看机构每月的运营情况以及每张会员卡的月度余额情况" show-icon />
    <FormSearch ref="formSearch" v-bind="formSearchProps" :loading="loading" />
    <div class="top">
      <div class="cloud_btn">
        <el-tooltip :content="lastTime" effect="dark" placement="top">
          <el-button :style="{color:'#46b6ee'}" @click="centerUpdate">更新云数据</el-button>
        </el-tooltip>
      </div>
    </div>
    <el-dialog
      :visible.sync="centerDialogVisible"
      :before-close="handleDialogClose"
      width="35%"
      center
      title="更新云数据"
    >
      <div id="data" class="block">
        <span class="date">选择日期:</span>
        <el-date-picker
          v-model="from.startTime"
          :picker-options="pickerOptions"
          type="month"
          placeholder="请选择月份"
          format="yyyy-MM"
          value-format="yyyy-MM"
        />
      </div>
      <span v-if="startupdate" class="startupdate">时间不能为空</span>
      <div class="coyp">
        <span class="update">1、更新云数据将花费较长时间，每次最多可更新1个月数据</span>
        <span class="update">2、为保证数据正常更新，请在08:00-22:00这段间内操作，每15天可更新一次</span>
        <span class="update">3、我们努力在两小时内将历史数据更新完毕</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="canCel">取 消</el-button>
        <el-button type="primary" class="comfirm" @click="centerDialog">确 定</el-button>
      </span>
    </el-dialog>
    <div>
      <CommonTable
        ref="classMonthTotal"
        :columns="columns"
        :table-height="'100px'"
        :table-loading="loading"
        :data-source="total"
      />
      <Media :query="{minWidth: 980}">
        <CommonTable
          ref="classMonthList"
          :columns="listColumns"
          :table-height="'calc(100vh - 345px)'"
          :table-loading="loading"
          :data-source="monthList"
          :pagination="listQuery"
          :page-count="pageCount"
          page-size-key="classMonthList"
          class="class-month-table"
        />
      </Media>
      <Media :query="{maxWidth: 980}">
        <CommonTable
          ref="classMonthList"
          :columns="listColumns"
          :table-height="'calc(100vh - 372px)'"
          :table-loading="loading"
          :data-source="monthList"
          :pagination="listQuery"
          :page-count="pageCount"
          page-size-key="classMonthList"
          class="class-month-table"
        />
      </Media>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Media from 'vue-media'
import FormSearch from '@/components/ReportForm/FormSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import { fmtDateFormat } from '@/utils/dateFormat'
import { exportFile } from '@/utils/exportFile'
import {
  getLastTime,
  getUpdataData,
  getUpdatingData
} from '@/api/reportForm/leadsSource'
export default {
  components: {
    Media,
    FormSearch,
    CommonTable
  },

  data() {
    const language = this.$store.getters.language
    return {
      pickerOptions: {
        disabledDate(time) {
          if (language === 'dsf') {
            const d = new Date('2019-09-30')
            return time.getTime() < d
          }
        }
      },
      datatime: '',
      from: {
        startTime: '',
        endtTime: ''
      },
      lastTime: '暂未更新', // 获取上次时间
      startupdate: false,
      centerDialogVisible: false,
      formSearchProps: {
        DateType: 'month',
        monthExport: true,
        mediaWidth: 980,
        searchHandle: this.makeForm,
        exportCourse: this.exportFile.bind(this, 'course'),
        exportVip: this.exportFile.bind(this, 'vip')
      },
      columns: [
        {
          label: '统计类型',
          prop: 'countType',
          width: '96px'
        },
        {
          label: '上月底剩余课时',
          prop: 'periodEndLeftNumTotal',
          width: '140px'
        },
        {
          label: '上月底剩余金额',
          prop: 'periodEndLeftMoneyTotal',
          width: '140px'
        },
        {
          label: '本月增加课时',
          prop: 'periodAddNumTotal',
          width: '140px'
        },
        {
          label: '本月实收金额',
          prop: 'payMoneyTotal',
          width: '140px'
        },
        {
          label: '本月应收金额',
          prop: 'oriMoneyTotal',
          width: '140px'
        },
        {
          label: '总剩余课时',
          prop: 'totalPeriodLeftNumTotal',
          width: '140px'
        },
        {
          label: '总剩余金额',
          prop: 'totalPeriodLeftMoneyTotal',
          width: '140px'
        },
        {
          label: '本月已消耗课时',
          prop: 'periodCostNumTotal',
          width: '140px'
        },
        {
          label: '本月已消耗金额',
          prop: 'periodCostMoneyTotal',
          width: '140px'
        },
        {
          label: '转课转出总课时',
          prop: 'periodTranOutNumTotal',
          width: '140px'
        },
        {
          label: '转课转出总金额',
          prop: 'periodTranOutMoneyTotal',
          width: '140px'
        },
        {
          label: '转课转入总课时',
          prop: 'periodTranInNumTotal',
          width: '140px'
        },
        {
          label: '转课转入总金额',
          prop: 'periodTranInMoneyTotal',
          width: '140px'
        },
        {
          label: '转校转出总数量',
          prop: 'periodTranSchOutNumTotal',
          width: '140px'
        },
        {
          label: '转校转出总金额',
          prop: 'periodTranSchOutMoneyTotal',
          width: '140px'
        },
        {
          label: '转校转入总数量',
          prop: 'periodTranSchInNumTotal',
          width: '140px'
        },
        {
          label: '转校转入总金额',
          prop: 'periodTranSchInMoneyTotal',
          width: '140px'
        },
        {
          label: '总退课时',
          prop: 'periodRefundNumTotal',
          width: '140px'
        },
        {
          label: '总退课金额',
          prop: 'periodRefundMoneyTotal',
          width: '140px'
        },
        {
          label: '总退课手续费',
          prop: 'periodRefundFeeTotal',
          width: '140px'
        },
        {
          label: '总过期作废课时',
          prop: 'periodExpireNumTotal',
          width: '140px'
        },
        {
          label: '总过期作废金额',
          prop: 'periodExpireMoneyTotal',
          width: '140px'
        },
        {
          label: '总消耗课时',
          prop: 'periodAllCostTotal',
          width: '140px'
        },
        {
          label: '总消耗课时金额',
          prop: 'periodAllCostMoneyTotal',
          width: '140px'
        },
        {
          label: '剩余课时',
          prop: 'periodLeftNumTotal',
          width: '140px'
        },
        {
          label: '剩余金额',
          prop: 'periodLeftMoneyTotal',
          width: '140px'
        }
      ],
      // 列表
      listQuery: {
        show: true, // 是否显示
        sizeChange: this.sizeChange,
        indexChange: this.indexChange
      },
      listColumns: [
        {
          label: '会员卡号',
          prop: 'cardId',
          width: '150px',
          isShowTooltip: true
        },
        {
          label: '学员姓名',
          prop: 'stuNames',
          width: '140px',
          isShowTooltip: true
        },
        {
          label: '家长手机号',
          prop: 'mobile',
          width: '140px',
          render: (h, params) => {
            const mobiles = []
            params.row.parents &&
              params.row.parents.forEach(item => {
                const text = (item.name || '--') + ' : ' + (item.mobile || '--')
                mobiles.push(h('p', {}, text))
              })

            return h('span', {}, [
              h(
                'el-popover',
                {
                  props: { placement: 'top', trigger: 'hover' }
                },
                [...mobiles, h('a', { slot: 'reference' }, '查看')]
              )
            ])
          }
        },
        {
          label: '上月底剩余课时',
          prop: 'periodEndLeftNum',
          width: '140px',
          isShowTooltip: true
        },
        {
          label: '上月底剩余金额',
          prop: 'periodEndLeftMoney',
          width: '140px',
          isShowTooltip: true
        },
        {
          label: '本月增加课时',
          prop: 'periodAddNum',
          width: '140px',
          isShowTooltip: true
        },
        {
          label: '本月实收金额',
          prop: 'payMoney',
          width: '140px',
          isShowTooltip: true
        },
        {
          label: '本月应收金额',
          prop: 'oriMoney',
          width: '140px',
          isShowTooltip: true
        },
        {
          label: '总剩余课时',
          prop: 'totalPeriodLeftNum',
          width: '140px',
          isShowTooltip: true
        },
        {
          label: '总剩余金额',
          prop: 'totalPeriodLeftMoney',
          width: '140px',
          isShowTooltip: true
        },
        {
          label: '课时均价',
          prop: 'periodAveragePrice',
          width: '140px',
          isShowTooltip: true
        },
        {
          label: '本月已消耗课时',
          prop: 'periodCostNum',
          width: '140px',
          isShowTooltip: true
        },
        {
          label: '本月已消耗金额',
          prop: 'periodCostMoney',
          width: '140px',
          isShowTooltip: true
        },
        {
          label: '转课转出课时',
          prop: 'periodTranOutNum',
          width: '140px',
          isShowTooltip: true
        },
        {
          label: '转课转出金额',
          prop: 'periodTranOutMoney',
          width: '140px',
          isShowTooltip: true
        },
        {
          label: '转课转入课时',
          prop: 'periodTranInNum',
          width: '140px',
          isShowTooltip: true
        },
        {
          label: '转课转入金额',
          prop: 'periodTranInMoney',
          width: '140px',
          isShowTooltip: true
        },
        {
          label: '转校转出数量',
          prop: 'periodTranSchOutNum',
          width: '140px',
          isShowTooltip: true
        },
        {
          label: '转校转出金额',
          prop: 'periodTranSchOutMoney',
          width: '140px',
          isShowTooltip: true
        },
        {
          label: '转校转入数量',
          prop: 'periodTranSchInNum',
          width: '140px',
          isShowTooltip: true
        },
        {
          label: '转校转入金额',
          prop: 'periodTranSchInMoney',
          width: '140px',
          isShowTooltip: true
        },
        {
          label: '退课时',
          prop: 'periodRefundNum',
          width: '140px',
          isShowTooltip: true
        },
        {
          label: '退课金额',
          prop: 'periodRefundMoney',
          width: '140px',
          isShowTooltip: true
        },
        {
          label: '退课手续费',
          prop: 'periodRefundFee',
          width: '140px',
          isShowTooltip: true
        },
        {
          label: '过期作废课时',
          prop: 'periodExpireNum',
          width: '140px',
          isShowTooltip: true
        },
        {
          label: '过期作废金额',
          prop: 'periodExpireMoney',
          width: '140px',
          isShowTooltip: true
        },
        {
          label: '总消耗课时',
          prop: 'totalExpendPeriod',
          width: '140px',
          isShowTooltip: true
        },
        {
          label: '总消耗课时金额',
          prop: 'totalExpendPeriodMoney',
          width: '140px',
          isShowTooltip: true
        },
        {
          label: '剩余课时',
          prop: 'periodLeftNum',
          width: '140px',
          isShowTooltip: true
        },
        {
          label: '剩余金额',
          prop: 'periodLeftMoney',
          width: '140px',
          isShowTooltip: true
        }
      ]
    }
  },

  computed: {
    ...mapState('classMonth', [
      'loading',
      'total',
      'monthList',
      'pageCount',
      'searchValue'
    ])
  },
  created() {
    this.getLastTime()
  },
  mounted() {
    const payload = {
      month: fmtDateFormat(this.$refs.formSearch.formSearch.date, 'yyyy-MM'),
      pageIndex: 0,
      pageSize: 20
    }
    this.getClassMonth(payload)
  },

  methods: {
    ...mapActions('classMonth', ['getClassMonth']),
    /** 弹框取消 */
    canCel() {
      this.centerDialogVisible = false
      this.startupdate = false
    },
    /** 弹框x */
    handleDialogClose() {
      this.centerDialogVisible = false
      this.startupdate = false
    },
    // 点击更新云按钮
    centerUpdate() {
      const date = new Date()
      const hour = date.getHours()
      if (hour >= 8 && hour <= 22) {
        getUpdatingData({
          name: '课时月结表'
        }).then(res => {
          if (res.data.errorCode === 0) {
            this.centerDialogVisible = true
          }
          if (res.data.errorCode === 1000) {
            this.centerDialogVisible = false
            this.$message({
              showClose: true,
              message: '该任务执行间隔15天~',
              type: 'warning'
            })
          }
        })
      } else {
        this.centerDialogVisible = false
        this.$message({
          showClose: true,
          message: '请在08:00-22:00这段间内操作',
          type: 'warning'
        })
      }
    },
    /** 初始进入页面 */
    getLastTime() {
      const params = {
        name: '课时月结表'
      }
      getLastTime(params).then(res => {
        if (res.data.errorCode === 0) {
          this.lastTime = '上次更新时间 :' + res.data.lastTime
          if (res.data.lastTime == null) {
            this.lastTime = '暂未更新'
          }
        }
      })
    },
    // 弹框的确定
    centerDialog() {
      if (this.from.startTime) {
        const params = {
          name: '课时月结表',
          startDate: this.from.startTime,
          endDate: this.from.startTime
        }
        getUpdataData(params)
        this.centerDialogVisible = false
        this.startupdate = false
        this.getLastTime()
      } else {
        this.startupdate = true
      }
    },
    /** 生成报表 */
    makeForm(value) {
      const payload = {
        ...this.searchValue,
        month: value.date
      }
      this.getClassMonth(payload)
    },

    /** 页数改变 */
    indexChange(pageIndex) {
      const payload = {
        ...this.searchValue,
        pageIndex
      }
      this.getClassMonth(payload)
    },
    /** 每页条数改变 */
    sizeChange(pageSize) {
      const payload = {
        ...this.searchValue,
        pageSize
      }
      this.getClassMonth(payload)
    },

    /** 导出 */
    exportFile(type) {
      const params = {
        month: this.searchValue.month
      }
      if (type === 'course') {
        if (this.total.length > 0) {
          exportFile(
            `${window.REPORT_URL}/crm/cardReport/exportCoursePeriodMonthList`,
            params
          )
        } else {
          this.$message.error('暂无数据导出')
        }
      } else {
        if (this.total.length > 0) {
          exportFile(
            `${window.REPORT_URL}/crm/cardReport/exportPeriodMonthList`,
            params
          )
        } else {
          this.$message.error('暂无数据导出')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.class-month-table {
  margin-top: 10px;
}
.el-input /deep/ .el-input__prefix{
  right:120px !important;
}
.cloud_btn{
  position: absolute;
  top:54px;
  right: 340px;
}
.cloud_btn span{
color:#46b6ee;
}
.el-date-editor.el-input{
  width: 150px;
  color: black;
}
.block{
  display: flex;
  height:30px;
  line-height: 30px;
  margin-top:40px;
}
.sign{
  padding: 0 10px;
}
.date{
  padding-right:10px;
}
.coyp{
  width:100%;
  margin-bottom:50px;
  margin-top:50px
}
.update{
  display:block;
  color:#46b6ee;
  margin-bottom: 10px;
}
.el-dialog--center .el-dialog__footer .el-button--primary{
  background-color: #46b6ee;
border: #46b6ee 1px solid;
}
.startupdate{
  color: rgba(255, 0, 0, 0.733);
  font-size: 12px;
  text-align: center;
  display: block;
}
</style>
