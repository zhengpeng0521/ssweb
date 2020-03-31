<template>
  <div>
    <FormSearch ref="formSearch" v-bind="formSearchProps" :loading="loading"/>
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
        <el-button class="cancel" @click="cancel">取 消</el-button>
        <el-button type="primary" class="comfirm" @click="CenterDialog">确 定</el-button>
      </span>
    </el-dialog>
    <Media :query="{minWidth: 1275}">
      <CommonTable
        ref="stuAttence"
        :columns="columns"
        :table-height="'calc(100vh - 182px)'"
        :pagination="listQuery"
        :options="options"
        table-key="report_teach_attence"
        page-size-key="stuAttence"
      />
    </Media>
    <Media :query="{maxWidth: 1275}">
      <CommonTable
        ref="stuAttence"
        :columns="columns"
        :table-height="'calc(100vh - 230px)'"
        :pagination="listQuery"
        :options="options"
        table-key="report_teach_attence"
        page-size-key="stuAttence"
        class="form-table"
      />
    </Media>
  </div>
</template>

<script>
import Media from 'vue-media'
import moment from 'moment'
import { mapState } from 'vuex'
import FormSearch from '@/components/ReportForm/FormSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import {
  getAttenceByCourse,
  getAttenceByMteacher,
  getAttenceByAteacher,
  getAttenceByStu,
  getAttenceByPlan
} from '@/api/reportForm/stuAttence'
import { exportFile } from '@/utils/exportFile'
import {
  getLastTime,
  getUpdataData,
  getUpdatingData
} from '@/api/reportForm/leadsSource'
export default {
  components: {
    FormSearch,
    CommonTable,
    Media
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
      lastTime: '暂未更新', // 获取上次时间
      startupdate: false,
      centerDialogVisible: false,
      formSearchProps: {
        mediaWidth: 1275,
        searchHandle: this.makeForm,
        exportFile: this.exportFile,
        extraForm: [
          {
            type: 'select',
            key: 'type',
            clearable: false,
            options: [
              { value: '1', label: '按课程统计' },
              { value: '2', label: '按主教统计' },
              { value: '3', label: '按助教统计' },
              { value: '4', label: '按学员统计' },
              { value: '5', label: '按上课明细' }
            ],
            initFirst: true,
            control: { key: 'stuName', value: '4' }
          },
          {
            type: 'input',
            key: 'stuName',
            label: '学员姓名'
          }
        ]
      },
      listQuery: {
        show: true // 是否显示
      },
      options: {
        isSettingShow: true,
        apiService: getAttenceByCourse, // 表格的数据请求接口
        params
      },
      columns: this.renderCols('1'),
      currentType: '1',
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
    cancel() {
      this.centerDialogVisible = false
      this.startupdate = false
    },
    /** 弹框x */
    handleDialogClose() {
      this.centerDialogVisible = false
      this.startupdate = false
    },
    /** 当页面点击进入时 */
    getLastTime() {
      const params = {
        name: '学员考勤表'
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
    // 点击云数据时
    centerUpdate() {
      const date = new Date()
      const hour = date.getHours()
      if (hour >= 8 && hour <= 22) {
        getUpdatingData({
          name: '学员考勤表'
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
          name: '学员考勤表',
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
      const payload = {
        startDate: values.date[0],
        endDate: values.date[1],
        stuName: extra.stuName
      }
      if (extra.type !== '4') {
        delete payload.stuName
      } else {
        payload.stuName = extra.stuName
      }
      this.options.params = payload
      this.searchValue = payload
      this.currentType = extra.type

      if (extra.type === '1') {
        this.columns = this.renderCols('1')
        this.options.apiService = getAttenceByCourse
        this.$refs.stuAttence.getList(payload)
      } else if (extra.type === '2') {
        this.columns = this.renderCols('2')
        this.options.apiService = getAttenceByMteacher
        this.$refs.stuAttence.getList(payload)
      } else if (extra.type === '3') {
        this.columns = this.renderCols('3')
        this.options.apiService = getAttenceByAteacher
        this.$refs.stuAttence.getList(payload)
      } else if (extra.type === '4') {
        this.columns = this.renderCols('4')
        this.options.apiService = getAttenceByStu
        this.$refs.stuAttence.getList(payload)
      } else if (extra.type === '5') {
        this.columns = this.renderCols('5')
        this.options.apiService = getAttenceByPlan
        this.$refs.stuAttence.getList(payload)
      }
    },
    centerDialog() {
      if (this.from.startTime <= this.from.endTime) {
        this.centerDialogVisible = false
      } else {
        this.startupdate = true
      }
    },
    /** 导出 */
    exportFile() {
      const params = { ...this.searchValue }
      if (this.currentType === '1') {
        if (this.$refs.stuAttence.totalCount > 0) {
          exportFile(
            `${window.REPORT_URL}/crm/erp/statistics/exportByCourse`,
            params
          )
        } else {
          this.$message.error('暂无数据导出')
        }
      } else if (this.currentType === '2') {
        if (this.$refs.stuAttence.totalCount > 0) {
          exportFile(
            `${window.REPORT_URL}/crm/erp/statistics/exportByMteacher`,
            params
          )
        } else {
          this.$message.error('暂无数据导出')
        }
      } else if (this.currentType === '3') {
        if (this.$refs.stuAttence.totalCount > 0) {
          exportFile(
            `${window.REPORT_URL}/crm/erp/statistics/exportByAteacher`,
            params
          )
        } else {
          this.$message.error('暂无数据导出')
        }
      } else if (this.currentType === '4') {
        if (this.$refs.stuAttence.totalCount > 0) {
          exportFile(
            `${window.REPORT_URL}/erp/tmk/export/stuQueryAttend`,
            params
          )
        } else {
          this.$message.error('暂无数据导出')
        }
      } else {
        if (this.$refs.stuAttence.totalCount > 0) {
          exportFile(
            `${window.REPORT_URL}/crm/erp/statistics/exportByPlan`,
            params
          )
        } else {
          this.$message.error('暂无数据导出')
        }
      }
    },

    /** 表格columns */
    renderCols(type) {
      const columns =
        type === '1'
          ? [
            // 按课程统计
            {
              label: '课程名称',
              prop: 'courseName',
              width: '100px',
              isShowTooltip: true
            },
            {
              label: '预约报读(补课)',
              prop: 'studyMaa',
              width: '100px',
              isShowTooltip: true,
              render: (h, params) => {
                return h('span', {}, [
                  h(
                    'span',
                    { slot: 'reference' },
                    params.row.studyMaa +
                        ' (' +
                        (params.row.studyMaaR || 0) +
                        ')'
                  )
                ])
              }
            },
            {
              label: '出勤(补课)',
              prop: 'studyAttend',
              width: '100px',
              isShowTooltip: true,
              render: (h, params) => {
                return h('span', {}, [
                  h(
                    'span',
                    { slot: 'reference' },
                    params.row.studyAttend +
                        ' (' +
                        (params.row.studyAttendR || 0) +
                        ')'
                  )
                ])
              }
            },
            {
              label: '请假(补课)',
              prop: 'studyLeave',
              width: '100px',
              isShowTooltip: true,
              render: (h, params) => {
                return h('span', {}, [
                  h(
                    'span',
                    { slot: 'reference' },
                    params.row.studyLeave +
                        ' (' +
                        (params.row.studyLeaveR || 0) +
                        ')'
                  )
                ])
              }
            },
            {
              label: '旷课(补课)',
              prop: 'studyAbsent',
              width: '100px',
              isShowTooltip: true,
              render: (h, params) => {
                return h('span', {}, [
                  h(
                    'span',
                    { slot: 'reference' },
                    params.row.studyAbsent +
                        ' (' +
                        (params.row.studyAbsentR || 0) +
                        ')'
                  )
                ])
              }
            },
            {
              label: '出勤率',
              prop: 'rate',
              width: '100px',
              isShowTooltip: true,
              renderHeader: (h, { column, $index }) => {
                return h(
                  'div',
                  { class: 'stu_attence', style: { lineHeight: '23px' }},
                  [
                    h('span', '出勤率'),
                    h(
                      'el-tooltip',
                      {
                        props: {
                          effect: 'dark',
                          content: '已统计补课学员',
                          placement: 'top'
                        }
                      },
                      [
                        h('i', {
                          class: 'iconfont icon_ym_ts',
                          style: {
                            marginLeft: '5px',
                            cursor: 'pointer',
                            color: '#666',
                            fontSize: '16px',
                            verticalAlign: 'middle'
                          }
                        })
                      ]
                    )
                  ]
                )
              }
            },
            {
              label: '正常出勤率',
              prop: 'rateR',
              width: '100px',
              isShowTooltip: true,
              renderHeader: (h, { column, $index }) => {
                return h(
                  'div',
                  { class: 'stu_attence', style: { lineHeight: '23px' }},
                  [
                    h('span', '正常出勤率'),
                    h(
                      'el-tooltip',
                      {
                        props: {
                          effect: 'dark',
                          content: '不统计补课学员',
                          placement: 'top'
                        }
                      },
                      [
                        h('i', {
                          class: 'iconfont icon_ym_ts',
                          style: {
                            marginLeft: '5px',
                            cursor: 'pointer',
                            color: '#666',
                            fontSize: '16px',
                            verticalAlign: 'middle'
                          }
                        })
                      ]
                    )
                  ]
                )
              }
            }
          ]
          : type === '2'
            ? [
              // 按主教统计
              {
                label: '主教名称',
                prop: 'userName',
                width: '100px',
                isShowTooltip: true
              },
              {
                label: '预约报读(补课)',
                prop: 'mstudyMaa',
                width: '100px',
                isShowTooltip: true,
                render: (h, params) => {
                  return h('span', {}, [
                    h(
                      'span',
                      { slot: 'reference' },
                      params.row.mstudyMaa +
                        ' (' +
                        (params.row.mstudyMaaMissed || 0) +
                        ')'
                    )
                  ])
                }
              },
              {
                label: '出勤(补课)',
                prop: 'mstudyAttend',
                width: '100px',
                isShowTooltip: true,
                render: (h, params) => {
                  return h('span', {}, [
                    h(
                      'span',
                      { slot: 'reference' },
                      params.row.mstudyAttend +
                        ' (' +
                        (params.row.mstudyAttendMissed || 0) +
                        ')'
                    )
                  ])
                }
              },
              {
                label: '请假(补课)',
                prop: 'mstudyLeave',
                width: '100px',
                isShowTooltip: true,
                render: (h, params) => {
                  return h('span', {}, [
                    h(
                      'span',
                      { slot: 'reference' },
                      params.row.mstudyLeave +
                        ' (' +
                        (params.row.mstudyLeaveMissed || 0) +
                        ')'
                    )
                  ])
                }
              },
              {
                label: '旷课(补课)',
                prop: 'mstudyAbsent',
                width: '100px',
                isShowTooltip: true,
                render: (h, params) => {
                  return h('span', {}, [
                    h(
                      'span',
                      { slot: 'reference' },
                      params.row.mstudyAbsent +
                        ' (' +
                        (params.row.mstudyAbsentMissed || 0) +
                        ')'
                    )
                  ])
                }
              },
              {
                label: '出勤率',
                prop: 'rate',
                width: '100px',
                isShowTooltip: true
              }
            ]
            : type === '3'
              ? [
              // 按助教统计
                {
                  label: '助教名称',
                  prop: 'userName',
                  width: '100px',
                  isShowTooltip: true
                },
                {
                  label: '预约报读(补课)',
                  prop: 'astudyMaa',
                  width: '100px',
                  isShowTooltip: true,
                  render: (h, params) => {
                    return h('span', {}, [
                      h(
                        'span',
                        { slot: 'reference' },
                        params.row.astudyMaa +
                        ' (' +
                        (params.row.astudyMaaMissed || 0) +
                        ')'
                      )
                    ])
                  }
                },
                {
                  label: '出勤(补课)',
                  prop: 'astudyAttend',
                  width: '100px',
                  isShowTooltip: true,
                  render: (h, params) => {
                    return h('span', {}, [
                      h(
                        'span',
                        { slot: 'reference' },
                        params.row.astudyAttend +
                        ' (' +
                        (params.row.astudyAttendMissed || 0) +
                        ')'
                      )
                    ])
                  }
                },
                {
                  label: '请假(补课)',
                  prop: 'astudyLeave',
                  width: '100px',
                  isShowTooltip: true,
                  render: (h, params) => {
                    return h('span', {}, [
                      h(
                        'span',
                        { slot: 'reference' },
                        params.row.astudyLeave +
                        ' (' +
                        (params.row.astudyLeaveMissed || 0) +
                        ')'
                      )
                    ])
                  }
                },
                {
                  label: '旷课(补课)',
                  prop: 'astudyAbsent',
                  width: '100px',
                  isShowTooltip: true,
                  render: (h, params) => {
                    return h('span', {}, [
                      h(
                        'span',
                        { slot: 'reference' },
                        params.row.astudyAbsent +
                        ' (' +
                        (params.row.astudyAbsentMissed || 0) +
                        ')'
                      )
                    ])
                  }
                },
                {
                  label: '出勤率',
                  prop: 'rate',
                  width: '100px',
                  isShowTooltip: true
                }
              ]
              : type === '4'
                ? [
                  // 按学员统计
                  {
                    label: '学员姓名',
                    prop: 'stuName',
                    width: '100px',
                    isShowTooltip: true
                  },
                  {
                    label: '联系方式',
                    prop: 'parentList',
                    width: '120px',
                    isShowTooltip: true,
                    render: (h, params) => {
                      return h('span', {}, [
                        h(
                          'el-popover',
                          {
                            props: { placement: 'top', trigger: 'hover' }
                          },
                          [
                            h(
                              'span',
                              params.row.parentList &&
                            params.row.parentList.length > 0 &&
                            params.row.parentList.map((item, index) => {
                              if (index === params.row.parentList.length - 1) {
                                return h(
                                  'span',
                                  item.parentName + ':' + item.mobile
                                )
                              }
                              return h(
                                'span',
                                item.parentName + ':' + item.mobile + ' ' + ','
                              )
                            })
                            ),
                            h('a', { slot: 'reference' }, '查看')
                          ]
                        )
                      ])
                    }
                  },
                  {
                    label: '学员卡号',
                    prop: 'cardId',
                    width: '120px',
                    isShowTooltip: true
                  },
                  // {
                  //   label: '预约报读',
                  //   prop: 'studyMaa',
                  //   width: '100px',
                  //   isShowTooltip: true
                  // },
                  {
                    label: '考勤次数',
                    prop: 'stuyMaa',
                    width: '100px',
                    isShowTooltip: true
                  },
                  {
                    label: '出勤次数',
                    prop: 'stuAttenda',
                    width: '100px',
                    isShowTooltip: true
                  },
                  {
                    label: '请假次数',
                    prop: 'stuLeave',
                    width: '100px',
                    isShowTooltip: true
                  },
                  {
                    label: '旷课次数',
                    prop: 'stuAbsent',
                    width: '100px',
                    isShowTooltip: true
                  },
                  {
                    label: '补课次数',
                    prop: 'studyMakeCls',
                    width: '100px',
                    isShowTooltip: true
                  },
                  {
                    label: '出勤率',
                    prop: 'attendRate',
                    width: '100px',
                    isShowTooltip: true,
                    renderHeader: (h, { column, $index }) => {
                      return h(
                        'div',
                        { class: 'stu_attence', style: { lineHeight: '23px' }},
                        [
                          h('span', '出勤率'),
                          h(
                            'el-tooltip',
                            {
                              props: {
                                effect: 'dark',
                                content: '已统计补课学员',
                                placement: 'top'
                              }
                            },
                            [
                              h('i', {
                                class: 'iconfont icon_ym_ts',
                                style: {
                                  marginLeft: '5px',
                                  cursor: 'pointer',
                                  color: '#666',
                                  fontSize: '16px',
                                  verticalAlign: 'middle'
                                }
                              })
                            ]
                          )
                        ]
                      )
                    }
                  },
                  {
                    label: '正常出勤率',
                    prop: 'regularRate',
                    width: '140px',
                    isShowTooltip: true,
                    renderHeader: (h, { column, $index }) => {
                      return h(
                        'div',
                        { class: 'stu_attence', style: { lineHeight: '23px' }},
                        [
                          h('span', '正常出勤率'),
                          h(
                            'el-tooltip',
                            {
                              props: {
                                effect: 'dark',
                                content: '不统计补课学员',
                                placement: 'top'
                              }
                            },
                            [
                              h('i', {
                                class: 'iconfont icon_ym_ts',
                                style: {
                                  marginLeft: '5px',
                                  cursor: 'pointer',
                                  color: '#666',
                                  fontSize: '16px',
                                  verticalAlign: 'middle'
                                }
                              })
                            ]
                          )
                        ]
                      )
                    }
                  },
                  {
                    label: '消耗课时',
                    prop: 'expendPeriod',
                    width: '100px',
                    isShowTooltip: true
                  },
                  {
                    label: '剩余专用课时',
                    prop: 'leftSpecialPeriod',
                    width: '120px',
                    isShowTooltip: true
                  },
                  {
                    label: '剩余通用课时',
                    prop: 'leftGeneralPeriod',
                    width: '120px',
                    isShowTooltip: true
                  },
                  {
                    label: '剩余课时总计',
                    prop: 'leftPeriod',
                    width: '160px',
                    isShowTooltip: true
                  }
                ]
                : [
                  // 按上课明细
                  {
                    label: '课程名称',
                    prop: 'courseName',
                    width: '96px',
                    isShowTooltip: true
                  },
                  {
                    label: '课程标题',
                    prop: 'title',
                    width: '96px',
                    isShowTooltip: true
                  },
                  {
                    label: '上课主题',
                    prop: 'courseTheme',
                    width: '96px',
                    isShowTooltip: true
                  },
                  {
                    label: '日期',
                    prop: 'studyDate',
                    width: '120px',
                    isShowTooltip: true
                  },
                  {
                    label: '时间段',
                    prop: 'studyTime',
                    width: '120px',
                    isShowTooltip: true
                  },
                  {
                    label: '教室',
                    prop: 'room',
                    width: '120px',
                    isShowTooltip: true
                  },
                  {
                    label: '班级',
                    prop: 'classes',
                    width: '96px',
                    isShowTooltip: true
                  },
                  {
                    label: '主教',
                    prop: 'mtName',
                    width: '96px',
                    isShowTooltip: true
                  },
                  {
                    label: '助教',
                    prop: 'atName',
                    width: '96px',
                    isShowTooltip: true
                  },
                  {
                    label: '消耗课时',
                    prop: 'cost',
                    width: '96px',
                    isShowTooltip: true
                  },
                  {
                    label: '预约上课会员',
                    prop: 'attend',
                    width: '120px',
                    isShowTooltip: true
                  },
                  {
                    label: '实际上课会员',
                    prop: 'realAttend',
                    width: '120px',
                    isShowTooltip: true
                  },
                  {
                    label: '预约补课会员',
                    prop: 'makeUp',
                    width: '120px',
                    isShowTooltip: true
                  },
                  {
                    label: '实际补课会员',
                    prop: 'realMakeUp',
                    width: '120px',
                    isShowTooltip: true
                  },
                  {
                    label: '预约试听',
                    prop: 'audition',
                    width: '96px',
                    isShowTooltip: true
                  },
                  {
                    label: '实际试听',
                    prop: 'realAudition',
                    width: '96px',
                    isShowTooltip: true
                  },
                  {
                    label: '请假',
                    prop: 'vacate',
                    width: '96px',
                    isShowTooltip: true
                  },
                  {
                    label: '旷课',
                    prop: 'truant',
                    width: '96px',
                    isShowTooltip: true
                  }
                ]
      return columns
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
.stu_attence {
  padding: 0 !important;
}
</style>

