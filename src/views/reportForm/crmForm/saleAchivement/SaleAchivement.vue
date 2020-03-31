<template>
  <div class="achivement-container">
    <el-alert
      :closable="false"
      type="info"
      title="此销售业绩表从不同维度反映了近期机构的获客及经营情况，可据此了解机构销售指标的完成情况。"
      description="最下方为员工的业绩详情"
      show-icon
    />
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
        <el-button type="primary" class="comfirm" @click="CenterDialog">确 定</el-button>
      </span>
    </el-dialog>
    <media :query="{maxWidth: 1130}">
      <AchivementContent
        :loading="loading"
        :chart-list="chartList"
        :total="total"
        :table-list="tableList"
        :export-file="exportFile"
        :page-count="pageCount"
        size="small"
      />
    </media>
    <media :query="{minWidth: 1130}">
      <AchivementContent
        :loading="loading"
        :chart-list="chartList"
        :total="total"
        :table-list="tableList"
        :export-file="exportFile"
        :page-count="pageCount"
        :page-change="pageChange"
        size="large"
      />
    </media>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Media from 'vue-media'
import FormSearch from '@/components/ReportForm/FormSearch'
import AchivementContent from './AchivementContent'
import { fmtDateFormat } from '@/utils/dateFormat'
import { exportFile } from '@/utils/exportFile'
import {
  getLastTime,
  getUpdataData,
  getUpdatingData
} from '@/api/reportForm/leadsSource'
export default {
  components: {
    FormSearch,
    AchivementContent,
    Media
  },

  data() {
    return {
      from: {
        startTime: '',
        endTime: ''
      },
      lastTimes: '',
      lastTime: '暂未更新', // 获取上次时间
      startupdate: false,
      centerDialogVisible: false,
      disabledStartDate: null,
      disabledEndDate: null,
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
      formSearchProps: {
        searchHandle: this.makeForm,
        extraForm: [
          {
            type: 'select',
            key: 'sortParam',
            clearable: false,
            initFirst: true,
            options:
              this.$store.getters.language === 'dsf'
                ? [
                  { value: '1', label: '合同合计数' },
                  { value: '2', label: '合同合计金额' },
                  { value: '3', label: '合同合计占比金额' },
                  { value: '4', label: '合同业绩金额' }
                ]
                : [
                  { value: '1', label: '合同合计数' },
                  { value: '2', label: '合同合计金额' },
                  { value: '3', label: '合同合计占比金额' }
                ]
          },
          {
            type: 'select',
            key: 'inputRoleId',
            options: [],
            optionValue: 'id',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/role/tenantRoleQuery`,
            asyncParams: { appCode: 'ss' }
          }
        ]
      }
    }
  },

  computed: {
    ...mapState('saleAchivement', [
      'loading',
      'searchValue', // 搜索内容
      'chartList',
      'total',
      'tableList',
      'pageCount'
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
    this.getAchivementList(payload)
  },
  methods: {
    ...mapActions('saleAchivement', ['getAchivementList']),
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
    /** 生成报表*/
    makeForm(values, extra) {
      const payload = {
        startDate: values.date[0],
        endDate: values.date[1],
        pageIndex: 0,
        ...extra
      }
      this.getAchivementList(payload)
    },
    /** 初始话进入页面 */
    getLastTime() {
      const params = {
        name: '销售业绩表'
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
          name: '销售业绩表'
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
    // 弹框的确定
    CenterDialog() {
      if ((this.from.startTime > this.from.endTime) || (!this.from.startTime && !this.from.endTime) || (!this.from.startTime) || (!this.from.endTime)) {
        this.startupdate = true
        this.centerDialogVisible = true
      } else {
        const params = {
          name: '销售业绩表',
          startDate: this.from.startTime,
          endDate: this.from.endTime
        }
        getUpdataData(params)
        this.centerDialogVisible = false
        this.startupdate = false
        this.getLastTime()
      }
    },
    /** 分页 */
    pageChange(pageIndex) {
      const payload = {
        ...this.searchValue,
        pageIndex
      }
      this.getAchivementList(payload)
    },

    /** 导出 */
    exportFile(type) {
      const params = { ...this.searchValue }
      console.log(params)
      delete params.pageIndex
      if (type === 'stu') {
        if (this.chartList.length > 0) {
          params.exportType = '1'
          exportFile(
            `${window.REPORT_URL}/crm/statistics/seller/dup/exportSellerBrokenForCourse`,
            params
          )
        } else {
          this.$message.error('暂无数据导出')
        }
      } else if (type === 'sale') {
        if (this.chartList.length > 0) {
          params.exportType = '2'
          exportFile(
            `${window.REPORT_URL}/crm/statistics/seller/dup/exportSellerBrokenForCourse`,
            params
          )
        } else {
          this.$message.error('暂无数据导出')
        }
      } else {
        if (this.tableList.length > 0) {
          exportFile(
            `${window.REPORT_URL}/crm/statistics/seller/dup/exportSellerPerforList`,
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
<style lang="scss">
.el-alert__title.is-bold {
  font-weight: normal;
}
.el-alert--info .el-alert__description {
  color: #666;
}

</style>

<style lang="scss" scoped>

.el-input /deep/ .el-input__prefix{
  right:120px !important;
}
.achivement-container /deep/ {
  .el-alert__icon.is-big {
    font-size: 16px;
    width: 16px;
    margin-top: -18px;
  }
}
.cloud_btn{
  position: absolute;
  top:72px;
  right: 40px;
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
  margin-top:50px;
}
.update{
  display:block;
  color:#46b6ee;
  margin-bottom: 10px;
}
.el-dialog--center .el-dialog__footer .el-button--primary{
  background-color:#46b6ee;
border: #46b6ee 1px solid;
}
.startupdate{
  color: rgba(255, 0, 0, 0.733);
  font-size: 12px;
  text-align: center;
  display: block;
}
</style>
