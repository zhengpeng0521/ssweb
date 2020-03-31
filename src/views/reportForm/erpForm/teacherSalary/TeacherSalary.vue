/**
 * 老师工资表
 */
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
        <el-button type="primary" @click="CenterDialog">确 定</el-button>
      </span>
    </el-dialog>
    <Media :query="{minWidth: 980}">
      <CommonTable
        ref="teacherSalary"
        :columns="columns"
        :table-height="'calc(100vh - 182px)'"
        :pagination="listQuery"
        :options="options"
        page-size-key="teacherSalary"
      />
    </Media>
    <Media :query="{maxWidth: 980}">
      <CommonTable
        ref="teacherSalary"
        :columns="columns"
        :table-height="'calc(100vh - 230px)'"
        :pagination="listQuery"
        :options="options"
        page-size-key="teacherSalary"
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
import { getSalary } from '@/api/reportForm/teacherSalary'
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
    const now = moment()
    const params = {
      startDate: now.format('YYYY-MM-DD'),
      endDate: now.format('YYYY-MM-DD')
    }

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
      startupdate: false,
      lastTime: '暂未更新', // 获取上次时间
      centerDialogVisible: false,
      formSearchProps: {
        mediaWidth: 980,
        searchHandle: this.makeForm,
        exportFile: this.exportFile
      },
      listQuery: {
        show: true // 是否显示
      },
      options: {
        apiService: getSalary, // 表格的数据请求接口
        params
      },
      columns: [
        {
          label: '姓名',
          prop: 'uname',
          width: '150px',
          isShowTooltip: true
        },
        {
          label: '授课总节数',
          prop: 'teachTime',
          width: '150px',
          isShowTooltip: true
        },
        {
          label: '授课总人次',
          prop: 'teachNum',
          width: '150px',
          isShowTooltip: true
        },
        {
          label: '消课总金额',
          prop: 'costMoney',
          width: '150px',
          isShowTooltip: true
        },
        {
          label: '基本工资',
          prop: 'baseSalary',
          width: '150px',
          isShowTooltip: true
        },
        {
          label: '补贴',
          prop: 'subsidy',
          width: '150px',
          isShowTooltip: true
        },
        {
          label: '提成',
          prop: 'royalty',
          width: '150px',
          isShowTooltip: true,
          render: (h, params) => {
            if (!!params.row.courseList && params.row.courseList.length > 0) {
              const prefix = `${params.row.royalty}元 = `
              const content = []
              params.row.courseList.map((item, index) => {
                content.push(
                  `${item.courseName}${item.time}${item.desc}*${item.money}`
                )
              })
              const renderContent = prefix + content.join(' + ')

              return h('span', {}, [
                h(
                  'el-popover',
                  {
                    props: {
                      placement: 'top',
                      width: '260',
                      trigger: 'hover',
                      popperClass: 'teacher-salary-pop',
                      content: renderContent
                    }
                  },
                  [h('a', { slot: 'reference' }, params.row.royalty)]
                )
              ])
            } else {
              return h('span', {}, params.row.royalty)
            }
          }
        },
        {
          label: '工资金额',
          prop: 'salary',
          width: '150px',
          isShowTooltip: true
        }
      ],
      searchValue: params
    }
  },

  computed: {
    ...mapState('commonTable', ['loading'])
  },
  created() {
    this.getLastTime()
  },
  methods: {
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
    /** 更新云数据*/
    centerUpdate() {
      const date = new Date()
      const hour = date.getHours()
      if (hour >= 8 && hour <= 22) {
        getUpdatingData({
          name: '老师工资表'
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
    /** 初始进入页面 */
    getLastTime() {
      const params = {
        name: '老师工资表'
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
    /** 弹框的确定*/
    CenterDialog() {
      if ((this.from.startTime > this.from.endTime) || (!this.from.startTime && !this.from.endTime) || (!this.from.startTime) || (!this.from.endTime)) {
        this.startupdate = true
        this.centerDialogVisible = true
      } else {
        const params = {
          name: '老师工资表',
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
    makeForm(values) {
      const payload = {
        startDate: values.date[0],
        endDate: values.date[1]
      }
      this.options.params = payload
      this.searchValue = payload
      this.$refs.teacherSalary.getList(payload)
    },
    // 第一次弹框的确定
    centerDialog() {
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
    exportFile() {
      const params = {
        ...this.searchValue
      }
      if (this.$refs.teacherSalary.totalCount > 0) {
        exportFile(`${window.REPORT_URL}/crm/salary/export`, params)
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
.el-input /deep/ .el-input__prefix{
  right:120px !important;
}
.el-date-editor.el-input{
  width: 150px;
  color: black;
}
.cloud_btn{
  position: absolute;
  top: 0;
  right: 190px;
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
<style lang="scss">
.teacher-salary-pop {
  text-align: center;
}
</style>
