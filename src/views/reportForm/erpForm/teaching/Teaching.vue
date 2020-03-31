<template>
  <div>
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
      title="更新云数据"
      width="30%"
      center
    >
      <div class="block">
        <span class="date">选择日期:</span>
        <el-date-picker
          v-model="from.startTime"
          :picker-options="startPickerOptions"
          type="date"
          placeholder="开始时间"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="startDateChange"
        />
        <span class="sign">~</span>
        <el-date-picker
          v-model="from.endTime"
          :picker-options="endPickerOptions"
          type="date"
          placeholder="结束时间"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="endDateChange"
        />
      </div>
      <span v-if="startupdate" class="startupdate">时间不能为空或者开始时间大于结束时间</span>
      <div class="coyp">
        <span class="update">1、更新云数据将花费较长时间，每次最多可更新3个月数据</span>
        <span class="update">2、为保证数据正常更新，请在08:00-22:00这段间内操作</span>
        <span class="update">3、我们努力在两小时内将历史数据更新完毕</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="canCel">取 消</el-button>
        <el-button type="primary" class="comfirm" @click="cenTer">确 定</el-button>
      </span>
    </el-dialog>
    <div class="teaching-box">
      <!-- 授课总节数 -->
      <ChartCard
        v-if="chart === '1'"
        v-bind="teachProps"
        :loading="loading"
        :data-source="teachSource"
      />
      <!-- 教学总人次 -->
      <ChartCard
        v-else-if="chart === '2'"
        v-bind="numProps"
        :loading="loading"
        :data-source="teachSource"
      />
      <!-- 授课课时数 -->
      <ChartCard
        v-else-if="chart === '3'"
        v-bind="timesProps"
        :loading="loading"
        :data-source="teachSource"
      />
      <FormTable
        :loading="loading"
        :data-source="teachTotal"
        :columns="totalCols"
        :has-page="false"
        class="table-top"
      />
      <FormTable
        :loading="loading"
        :data-source="teachList"
        :columns="detailCols"
        :page-count="pageCount"
        :page-change="pageChange"
        class="table-top"
      />
      <DetailModal
        :detail-visible="detailVisible"
        :close-detail="closeDetail"
        :detail-loading="detailLoading"
        :detail-list="detailList"
        :detail-total="detailTotal"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// import Media from 'vue-media'
import { fmtDateFormat } from '@/utils/dateFormat'
import FormSearch from '@/components/ReportForm/FormSearch'
import ChartCard from '@/components/ReportForm/ChartCard'
import FormTable from '@/components/ReportForm/FormTable'
import DetailModal from './DetailModal'
import { exportFile } from '@/utils/exportFile'
import {
  getLastTime,
  getUpdataData,
  getUpdatingData
} from '@/api/reportForm/leadsSource'
export default {
  components: {
    FormSearch,
    ChartCard,
    FormTable,
    DetailModal
  },

  data() {
    return {
      from: {
        startTime: '',
        endtTime: ''
      },
      startPickerOptions: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime()
        }
      },
      endPickerOptions: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime()
        }
      },
      lastTime: '暂未更新', // 获取上次时间
      startupdate: false,
      centerDialogVisible: false,
      detailVisible: false,
      chart: '1',
      formSearchProps: {
        searchHandle: this.makeForm,
        exportFile: this.exportFile,
        extraForm: [
          {
            type: 'select',
            key: 'sortParam',
            clearable: false,
            initFirst: true,
            options: [
              { value: '1', label: '授课总节数' },
              { value: '2', label: '教学总人次' },
              { value: '3', label: '授课课时数' }
            ]
          }
        ]
      },
      // 授课总节数
      teachProps: {
        title: '授课总节数',
        type: 'histogram',
        legend: false,
        allCols: [{ key: 'tattend', value: '上课' }],
        showCols: ['title', 'tattend']
      },
      // 教学总人次
      numProps: {
        title: '教学总人次',
        type: 'histogram',
        allCols: [
          { key: 'sattend', value: '上课' },
          { key: 'smakeup', value: '补课' },
          { key: 'taudition', value: '试听' }
        ],
        showCols: ['title', 'sattend', 'smakeup', 'taudition']
      },
      // 授课课时数
      timesProps: {
        title: '授课课时数',
        type: 'histogram',
        legend: false,
        allCols: [{ key: 'teacherHours', value: '课时数' }],
        showCols: ['title', 'teacherHours']
      },
      // 总计
      totalCols: [
        {
          label: '统计类型',
          prop: 'countType',
          width: '96px'
        },
        {
          label: '授课节数',
          children: [
            {
              label: '上课',
              prop: 'tAttend',
              isShowTooltip: true,
              width: '110px'
            },
            {
              label: '补课',
              prop: 'tMakeup',
              isShowTooltip: true
            },
            {
              label: '试听',
              prop: 'tAudition',
              isShowTooltip: true
            },
            {
              label: '合计',
              prop: 'tTotal',
              isShowTooltip: true
            }
          ]
        },
        {
          label: '教学人次',
          children: [
            {
              label: '上课',
              prop: 'sAttend',
              isShowTooltip: true,
              width: '110px'
            },
            {
              label: '补课',
              prop: 'sMakeup',
              isShowTooltip: true
            },
            {
              label: '试听',
              prop: 'sAudition',
              isShowTooltip: true
            },
            {
              label: '合计',
              prop: 'sTotal',
              isShowTooltip: true
            }
          ]
        },
        {
          label: '授课课时数',
          prop: 'teacherHours',
          width: '96px'
        }
      ],
      // 授课列表
      detailCols: [
        {
          label: '姓名',
          prop: 'name',
          width: '96px',
          methods: this.openDetail
        },
        {
          label: '授课节数',
          children: [
            {
              label: '上课(助教)',
              prop: 'tattend',
              isShowTooltip: true,
              width: '110px',
              formatter: (row, column, cellValue) => {
                const tattend = row.tattend || '0'
                const attAttend = row.attAttend || '0'
                return `${tattend + ' (' + attAttend + ')'}`
              }
            },
            {
              label: '补课(助教)',
              prop: 'tmakeup',
              isShowTooltip: true,
              formatter: (row, column, cellValue) => {
                const tmakeup = row.tmakeup || '0'
                const attMakeup = row.attMakeup || '0'
                return `${tmakeup + ' (' + attMakeup + ')'}`
              }
            },
            {
              label: '试听(助教)',
              prop: 'taudition',
              isShowTooltip: true,
              formatter: (row, column, cellValue) => {
                const taudition = row.taudition || '0'
                const attAudition = row.attAudition || '0'
                return `${taudition + ' (' + attAudition + ')'}`
              }
            },
            {
              label: '合计(助教)',
              prop: 'ttotal',
              isShowTooltip: true,
              formatter: (row, column, cellValue) => {
                const ttotal = row.ttotal || '0'
                const attTotal = row.attTotal || '0'
                return `${ttotal + ' (' + attTotal + ')'}`
              }
            }
          ]
        },
        {
          label: '教学人次',
          children: [
            {
              label: '上课(助教)',
              prop: 'sattend',
              isShowTooltip: true,
              width: '110px',
              formatter: (row, column, cellValue) => {
                const sattend = row.sattend || '0'
                const atsAttend = row.atsAttend || '0'
                return `${sattend + ' (' + atsAttend + ')'}`
              }
            },
            {
              label: '补课(助教)',
              prop: 'smakeup',
              isShowTooltip: true,
              formatter: (row, column, cellValue) => {
                const smakeup = row.smakeup || '0'
                const atsMakeup = row.atsMakeup || '0'
                return `${smakeup + ' (' + atsMakeup + ')'}`
              }
            },
            {
              label: '试听(助教)',
              prop: 'saudition',
              isShowTooltip: true,
              formatter: (row, column, cellValue) => {
                const saudition = row.saudition || '0'
                const atsAudition = row.atsAudition || '0'
                return `${saudition + ' (' + atsAudition + ')'}`
              }
            },
            {
              label: '合计(助教)',
              prop: 'stotal',
              isShowTooltip: true,
              formatter: (row, column, cellValue) => {
                const stotal = row.stotal || '0'
                const atsTotal = row.atsTotal || '0'
                return `${stotal + ' (' + atsTotal + ')'}`
              }
            }
          ]
        },
        {
          label: '授课课时数(助教)',
          prop: 'teachHours',
          props: 'atTeachHours',
          width: '96px'
        }
      ]
    }
  },

  computed: {
    ...mapState('teaching', [
      'loading',
      'searchValue',
      'teachSource',
      'teachTotal',
      'teachList',
      'pageCount',
      'detailLoading',
      'detailList',
      'detailTotal'
    ])
  },
  created() {
    this.getLastTime()
  },
  mounted() {
    const payload = {
      startDate: fmtDateFormat(
        this.$refs.formSearch.formSearch.date[0],
        'yyyy-MM-dd'
      ),
      endDate: fmtDateFormat(
        this.$refs.formSearch.formSearch.date[1],
        'yyyy-MM-dd'
      ),
      sortParam: '1'
    }
    this.getTeachingList(payload)
  },

  methods: {
    ...mapActions('teaching', ['getTeachingList', 'getTachingDetail']),
    endDateChange() {
      this.startPickerOptions.disabledDate = time => {
        const endTime = new Date(this.from.endTime).getTime()
        const times = time.getTime()
        return endTime - times > 7776000000 || times > new Date().getTime()
      }
    },
    startDateChange() {
      this.endPickerOptions.disabledDate = time => {
        const startTime = new Date(this.from.startTime).getTime()
        const times = time.getTime()
        return times - startTime > 7776000000 || times > new Date().getTime()
      }
    },
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
    /** 更新云数据 */
    centerUpdate() {
      const date = new Date()
      const hour = date.getHours()
      if (hour >= 8 && hour <= 22) {
        getUpdatingData({
          name: '老师授课表'
        }).then(res => {
          if (res.data.errorCode === 0) {
            this.centerDialogVisible = true
          }
          if (res.data.errorCode === 1000) {
            this.centerDialogVisible = false
            this.$message({
              showClose: true,
              message: '每天只能更新一次,请明天再试',
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
    /** 初始出入页面 */
    getLastTime() {
      const params = {
        name: '老师授课表'
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
    cenTer() {
      if ((this.from.startTime > this.from.endTime) || (!this.from.startTime && !this.from.endTime) || (!this.from.startTime) || (!this.from.endTime)) {
        this.startupdate = true
        this.centerDialogVisible = true
      } else {
        const params = {
          name: '老师授课表',
          startDate: this.from.startTime,
          endDate: this.from.endTime
        }
        getUpdataData(params)
        this.centerDialogVisible = false
        this.startupdate = false
        this.getLastTime()
      }
    },
    /** 生成报表 */
    makeForm(values, extra) {
      this.chart = extra.sortParam
      const payload = {
        startDate: values.date[0],
        endDate: values.date[1],
        pageIndex: 0,
        ...extra
      }

      this.getTeachingList(payload)
    },

    /** 分页 */
    pageChange(pageIndex) {
      const payload = {
        ...this.searchValue,
        pageIndex
      }

      this.getTeachingList(payload)
    },
    // 第一次弹框的确定
    CenterDialog() {
      if (this.from.startTime <= this.from.endTime) {
        this.centerDialogVisibletwice = true
        this.centerDialogVisible = false
        this.Fromtime.startTime = this.from.startTime
        this.Fromtime.endTime = this.from.endTime
      } else {
        this.startupdate = true
      }
    },
    /** 导出 */
    exportFile(type) {
      const params = {
        endDate: this.searchValue.endDate,
        sortParam: this.searchValue.sortParam,
        startDate: this.searchValue.startDate,
        flag: 'detail'
      }
      exportFile(`${window.REPORT_URL}/cerp/stuClass/exportExcelDetail`, params)
    },

    // 打开详情
    openDetail(row) {
      this.detailVisible = true
      this.getTachingDetail({
        ...this.searchValue,
        inputUid: row.uid,
        pageSize: 99999,
        pageIndex: 0
      })
    },

    // 关闭详情
    closeDetail() {
      this.detailVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-input /deep/ .el-input__prefix{
  right:120px !important;
}
.table-top {
  margin-top: 20px;
}
.teaching-box {
  max-height: calc(100vh - 150px);
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 10px;
  margin-right: -10px;
}
.cloud_btn{
  position: absolute;
  top:0px;
  right: 190px;
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
.coyp{
  width:100%;
  margin-bottom:50px;
  margin-top:50px;
}
.sign{
  padding: 0 10px;
}
.date{
  padding-right:10px;
}
.date{
  padding-right:10px;
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
.el-popover,
.el-popover__title {
  color: #ffffff !important;
}
</style>
