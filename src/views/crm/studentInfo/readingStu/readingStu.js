import {
  getZjlCRMStuList, // 在读学员列表
  getStuMsg, // 学员详情
  querySubName // 用户下拉树
} from '@/api/crm/studentInfo/readingStu.js'
import { subSecondChannelQuery } from '@/api/crm/studentInfo/highSeas'

import CommonTable from './../../../../components/CommonTable/CommonTable'
import CommonSearch from './../../../../components/CommonSearch/CommonSearch'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import CommonDateSearch from '../../../../components/CommonDateSearch/CommonDateSearch'
import DistributeDialog from './components/distributeDialog.vue'
import TeachDistributeDialog from './components/teachDistributeDialog.vue'
import serviceDistributeDialog from './components/serviceDistributeDialog.vue' // 分配给客服
import VisitDialog from './../lantentStu/components/visitDialog.vue'
import ListenDialog from './../../auditionMgr/components/addAuditionDialog.vue'
import ApplyDialog from './../../contractMgr/components/contractOrderDialog.vue'
import CrmDetailModal from '@/components/CrmDetailModal'
import AddLantentStuDialog from './../lantentStu/components/addLantentStuDialog.vue'
import TurnOtherDialog from './../lantentStu/components/turnOtherDialog.vue'
import { exportFile } from '@/utils/exportFile'
import ParentBindWX from './components/parentBindWX.vue'
import NameImportDialog from './components/nameImportDialog.vue'
import SubUserSelect from './../../../../components/SubUserSelect/SubUserSelect.vue'
import bindingFace from './components/bindingFace.vue' // 绑定人脸的弹窗
import DeleteStuDialog from './components/deleteStuDialog'
export default {
  components: {
    CommonTable,
    CommonSearch,
    AdvancedSearch,
    CommonDateSearch,
    ParentBindWX, // 家长绑定微信
    CrmDetailModal, // 侧边详情弹框
    DistributeDialog, // 分配转给他人弹框
    TeachDistributeDialog, // 教师分配在读学员
    serviceDistributeDialog, // 分配给客服
    VisitDialog, // 到访弹框
    ListenDialog, // 试听弹框
    ApplyDialog, // 报名弹框
    AddLantentStuDialog, // 侧边新建潜在学员 报名 弹框
    TurnOtherDialog, // 转给他人弹框
    NameImportDialog, // 导入
    SubUserSelect, // 用户下拉树
    bindingFace,
    DeleteStuDialog
  },
  data() {
    return {
      numI: 0,
      sortName: null,
      sortOrder: null,
      source: '',
      sourceTypes: '',
      studentType: 'reading',
      columns: [
        {
          label: '学员姓名',
          prop: 'name',
          isShowTooltip: true,
          width: '120',
          render: (h, params) => {
            // eslint-disable-next-line
            if (params.row.sex == "2") {
              return h(
                'div',
                {
                  on: {
                    click: () => {
                      this.openSideDetail(params.row)
                    }
                  }
                },
                [
                  h(
                    'div',
                    {
                      style: 'margin-right:10px;float:left;max-width: 80px;',
                      class: 'stuName'
                    },
                    params.row.name
                  ),
                  h('img', {
                    attrs: {
                      src:
                        'https://img.ishanshan.com/gimg/n/20190318/03fdc2ea05f27c74f5d8c706ef4f03c0'
                    }
                  })
                ]
              )
              // eslint-disable-next-line
            } else if (params.row.sex == "1") {
              return h(
                'div',
                {
                  on: {
                    click: () => {
                      this.openSideDetail(params.row)
                    }
                  }
                },
                [
                  h(
                    'div',
                    {
                      style: 'margin-right:10px;float:left;max-width: 80px;',
                      class: 'stuName'
                    },
                    params.row.name
                  ),
                  h('img', {
                    attrs: {
                      src:
                        'https://img.ishanshan.com/gimg/n/20190318/d56924830405313c7dc47fbc1763f10e'
                    }
                  })
                ]
              )
            } else {
              return h(
                'div',
                {
                  class: 'stuName',
                  on: {
                    click: () => {
                      this.openSideDetail(params.row)
                    }
                  }
                },
                params.row.name
              )
            }
          }
        },
        {
          label: '家长姓名',
          prop: 'parentName',
          isShowTooltip: true,
          render: (h, params) => {
            return h('span', {}, [
              h(
                'span',
                params.row.parents &&
                params.row.parents.map((item, index) => {
                  return h('span', item.name + ' ')
                })
              )
            ])
          }
        },
        {
          label: '手机号',
          prop: 'title',
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
                    params.row.parents &&
                    params.row.parents.length > 0 &&
                    params.row.parents.map(item => {
                      return h(
                        'span',
                        item.name + ':' + item.mobile + ','
                      )
                    })
                  ),
                  h('a', ' ' + '拨打'),
                  h('a', { slot: 'reference' }, '查看')
                ]
              )
            ])
          }
        },
        {
          label: '绑定微信',
          prop: 'open_id',
          isShowTooltip: true,
          render: (h, params) => {
            return h('span', {}, [
              h(
                'span',
                params.row.parents &&
                params.row.parents.map((item, index) => {
                  // eslint-disable-next-line
                  if (item.open_id == "" || item.open_id == null) {
                    return h('span', ' ')
                  } else {
                    return h('span', '已绑定' + ' ')
                  }
                })
              )
            ])
          }
        },
        {
          label: '绑定人脸',
          align: 'center',
          prop: 'bindingFace',
          isShowTooltip: true,
          width: '120px;',
          render: (h, params) => {
            // eslint-disable-next-line
            if (params.row.faceBindingNum >= "1") {
              return h(
                'div',
                {
                  on: {
                    click: () => {
                      this.bindingFace(params.row)
                    }
                  }
                },
                [
                  h('span', {
                    style:
                      'display:inline-block;width:8px;height:8px;background-color: rgb(136, 199, 10);border-radius: 50px;margin-right: 5px;margin-top: 7px;float:left;'
                  }),
                  h(
                    'div',
                    {
                      style: 'float:left;',
                      class: 'stuName'
                    },
                    '已绑定'
                  ),
                  h(
                    'span',
                    {
                      style:
                        'display:inline-block;text-overflow:ellipsis;float:left;color:#409EFF;'
                    },
                    params.row.faceBindingNum +
                    '/' +
                    params.row.canFaceBindingNum
                  )
                ]
              )
              // eslint-disable-next-line
            } else {
              return h(
                'div',
                {
                  on: {
                    click: () => {
                      this.bindingFace(params.row)
                    }
                  }
                },
                [
                  h('span', {
                    style:
                      'display:inline-block;width:8px;height:8px;background-color: rgb(255, 127, 117);border-radius: 50px;margin-right: 5px;margin-top: 7px;float:left;'
                  }),
                  h(
                    'div',
                    {
                      style: 'float:left;',
                      class: 'stuName'
                    },
                    '未绑定'
                  ),
                  h(
                    'span',
                    {
                      style:
                        'display:inline-block;text-overflow:ellipsis;float:left;color:#409EFF;'
                    },
                    params.row.faceBindingNum +
                    '/' +
                    params.row.canFaceBindingNum
                  )
                ]
              )
            }
          }
        },
        {
          label: '昵称',
          prop: 'nickName',
          isShowTooltip: true
        },
        {
          label: '生日',
          prop: 'birthday',
          hasSort: 'custom',
          isShowTooltip: true
        },
        {
          label: '年龄(月龄)',
          prop: 'age',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            const age = row.age || '0'
            const month = row.month || '0'
            return `<div style="text-overflow:ellipsis;overflow:hidden">${age +
              ' (' +
              month +
              ')'}</div>`
          }
        },
        {
          label: '学员账户',
          prop: 'stuCardId',
          isShowTooltip: true
        },
        {
          label: '学员类型',
          prop: 'studentType',
          width: 120,
          isShowTooltip: true
        },
        {
          label: '在读班级',
          prop: 'clsName',
          isShowTooltip: true
        },
        {
          label: '最后跟进时间',
          prop: 'followRecordTime',
          isShowTooltip: true,
          isColShow: false,
          hasSort: 'custom',
          width: 150
        },
        {
          label: '最后跟进记录',
          prop: 'content',
          isShowTooltip: true,
          isColShow: false,
          width: 120
        },
        {
          label: '下次跟进时间',
          prop: 'nextFollowTime',
          hasSort: 'custom',
          isShowTooltip: true,
          isColShow: false,
          width: 150
        },
        {
          label: '负责销售',
          prop: 'sellerName',
          isShowTooltip: true
        },
        {
          label: '负责老师',
          prop: 'counselorName',
          isShowTooltip: true
        },
        {
          label: '负责客服',
          prop: 'waiterName',
          isShowTooltip: true
        },
        {
          label: this.$t('firstChannel.label'),
          prop: 'channel',
          isShowTooltip: true,
          isColShow: false
        },
        {
          label: this.$t('secondChannel.label'),
          prop: 'secondChannel',
          isShowTooltip: true,
          isColShow: false
        },
        {
          label: this.$t('thirdChannel.label'),
          prop: 'subSecondChannel',
          isShowTooltip: true,
          isColShow: false
        },
        {
          label: '创建日期',
          prop: 'createTime',
          isShowTooltip: true,
          hasSort: 'custom',
          isColShow: false,
          width: 120
        },
        {
          label: '备注',
          prop: 'remark',
          isShowTooltip: true,
          width: '160',
          isColShow: false
        }, {
          label: '其他来源',
          prop: 'otherChannel',
          isShowTooltip: true,
          width: '160',
          isColShow: false
        }
      ],
      options: {
        noMount: true,
        mutiSelect: true, // 是否多选
        // apiService: getZjlCRMStuList, // 表格的数据请求接口
        isSettingShow: true // 是否出现设置
      },
      tableHeight: 'calc(100vh - 313px)',
      operates: {
        width: '190',
        fixed: 'right',
        list: [
          {
            label: '到访',
            type: 'normal',
            btnId: '404000001',
            method: row => {
              console.log(row, '111111111')
              this.openVisitDialog(row)
            }
          },
          {
            label: '试听',
            type: 'normal',
            method: row => {
              this.openListenDialog(row)
            }
          },
          {
            label: '报名',
            type: 'normal',
            method: row => {
              this.openApplyDialog(row)
            }
          }
        ]
      },
      formInline: {
        searchMethod: formValue => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '学员姓名/电话号码',
            modelValue: 'mobileOrStuName',
            isFilterable: true,
            isClearable: true
          },
          {
            itemType: 'select',
            placeholder: '微信绑定状态',
            modelValue: 'wxBind',
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              {
                label: '已绑定',
                value: '1'
              },
              {
                label: '未绑定',
                value: '0'
              }
            ]
          }
        ]
      },
      // 高级搜索
      superSearch: {
        onClear: () => {
          this.onClear()
        },
        onSearch: superValue => {
          this.onSearch(superValue)
        },
        fields: window.language === 'dsf' ? [
          {
            type: 'select',
            key: 'isBindFace',
            label: '人脸绑定状态',
            optionValue: 'id',
            optionLabel: 'name',
            options: [{ id: '0', name: '未绑定' }, { id: '1', name: '已绑定' }]
          },
          {
            type: 'select',
            key: 'waiterId',
            label: '负责客服',
            optionValue: 'id',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          },
          {
            type: 'select',
            key: 'counselorName',
            label: '负责老师',
            optionValue: 'name',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          },
          {
            type: 'select',
            key: 'studentType',
            label: '学员类型',
            optionValue: 'key',
            optionLabel: 'value',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/dict/dictGetByKey`,
            asyncParams: {
              dictkey: 'studentType'
            }
          },
          {
            type: 'select',
            key: 'clsId',
            label: '在读班级',
            optionValue: 'clsId',
            optionLabel: 'clsName',
            isAsync: true,
            url: `${window.SS_CRM}/cerp/cls/classGradeSummary`
          },
          {
            type: 'select',
            key: 'sellerName',
            label: '负责销售',
            optionValue: 'name',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          },
          {
            type: 'select',
            key: 'channel',
            label: this.$t('firstChannel.label'),
            optionValue: 'key',
            optionLabel: 'value',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/dict/dictGetByKey`,
            asyncParams: {
              dictkey: 'firstChannel'
            }
          },
          {
            type: 'select',
            key: 'secondChannel',
            label: this.$t('secondChannel.label'),
            optionValue: 'key',
            optionLabel: 'value',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/dict/dictGetByKey`,
            asyncParams: {
              dictkey: 'secondChannel'
            },
            onChange: this.secondChange,
            subKey: 'subSecondChannel'
          },
          {
            type: 'select',
            key: 'subSecondChannel',
            label: '二级渠道',
            placeholder: '请选择（请先选择市场渠道）',
            optionValue: 'id',
            optionLabel: 'value',
            options: []
          },
          {
            type: 'input',
            key: 'cardId',
            label: '学员账户'
          },
          {
            type: 'input',
            key: 'nickName',
            label: '昵称'
          },
          {
            type: 'inputRange',
            key: 'age',
            label: '年龄'
          },
          {
            type: 'inputRange',
            key: 'month',
            label: '月龄'
          },
          {
            type: 'datePicker',
            key: 'createTime',
            label: '创建日期',
            dateType: 'daterange'
          },
          {
            type: 'dateTimePicker',
            key: 'nextFollowTime',
            label: '下次跟进时间',
            dateType: 'datetime',
            defaultTime: ['00:00:00', '23:59:59'],
            isRange: true,
            format: 'yyyy-MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm'
          },
          {
            type: 'dateTimePicker',
            key: 'finalFollowTime',
            label: '最后跟进时间',
            defaultTime: ['00:00:00', '23:59:59'],
            isRange: true,
            format: 'yyyy-MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm'
          },
          {
            type: 'select',
            key: 'sex',
            label: '性别',
            optionValue: 'id',
            optionLabel: 'name',
            options: [{ id: '1', name: '男' }, { id: '2', name: '女' }]
          }, {
            type: 'input',
            key: 'otherChannel',
            label: '其他来源'
          }
        ] : [
          {
            type: 'select',
            key: 'isBindFace',
            label: '人脸绑定状态',
            optionValue: 'id',
            optionLabel: 'name',
            options: [{ id: '0', name: '未绑定' }, { id: '1', name: '已绑定' }]
          },
          {
            type: 'select',
            key: 'waiterId',
            label: '负责客服',
            optionValue: 'id',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          },
          {
            type: 'select',
            key: 'counselorName',
            label: '负责老师',
            optionValue: 'name',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          },
          {
            type: 'select',
            key: 'studentType',
            label: '学员类型',
            optionValue: 'key',
            optionLabel: 'value',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/dict/dictGetByKey`,
            asyncParams: {
              dictkey: 'studentType'
            }
          },
          {
            type: 'select',
            key: 'clsId',
            label: '在读班级',
            optionValue: 'clsId',
            optionLabel: 'clsName',
            isAsync: true,
            url: `${window.SS_CRM}/cerp/cls/classGradeSummary`
          },
          {
            type: 'select',
            key: 'sellerName',
            label: '负责销售',
            optionValue: 'name',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          },
          {
            type: 'select',
            key: 'channel',
            label: this.$t('firstChannel.label'),
            optionValue: 'key',
            optionLabel: 'value',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/dict/dictGetByKey`,
            asyncParams: {
              dictkey: 'firstChannel'
            }
          },
          {
            type: 'select',
            key: 'secondChannel',
            label: this.$t('secondChannel.label'),
            optionValue: 'key',
            optionLabel: 'value',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/dict/dictGetByKey`,
            asyncParams: {
              dictkey: 'secondChannel'
            }
          },
          {
            type: 'input',
            key: 'cardId',
            label: '学员账户'
          },
          {
            type: 'input',
            key: 'nickName',
            label: '昵称'
          },
          {
            type: 'inputRange',
            key: 'age',
            label: '年龄'
          },
          {
            type: 'inputRange',
            key: 'month',
            label: '月龄'
          },
          // {
          //   type: 'datePicker',
          //   key: 'birthday',
          //   label: '生日',
          //   dateType: 'daterange'
          // },
          {
            type: 'datePicker',
            key: 'createTime',
            label: '创建日期',
            dateType: 'daterange'
          },
          {
            type: 'dateTimePicker',
            key: 'nextFollowTime',
            label: '下次跟进时间',
            dateType: 'datetime',
            defaultTime: ['00:00:00', '23:59:59'],
            isRange: true,
            format: 'yyyy-MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm'
          },
          {
            type: 'dateTimePicker',
            key: 'finalFollowTime',
            label: '最后跟进时间',
            defaultTime: ['00:00:00', '23:59:59'],
            isRange: true,
            format: 'yyyy-MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm'
          },
          {
            type: 'select',
            key: 'sex',
            label: '性别',
            optionValue: 'id',
            optionLabel: 'name',
            options: [{ id: '1', name: '男' }, { id: '2', name: '女' }]
          }, {
            type: 'input',
            key: 'otherChannel',
            label: '其他来源'
          }
        ]
      },
      idObj: {},
      superValue: {}, // 高级搜索内容
      checkedData: '',
      commonDateOptions: {
        mainText: '学员生日:',
        defaultDate: [undefined, undefined],
        options: ['today', 'thisMonth'],
        markText: { today: '0', thisMonth: '0' },
        pickerDateArr: [],
        isBirthday: true
      },
      // 侧边内容详情
      detailProps: {
        btns: [
          {
            type: 'primary',
            label: '报名',
            clickHandle: this.clickOne.bind(this, '1')
          },
          {
            class: 'cancel_btn',
            label: '编辑',
            btnId: '402000003',
            clickHandle: this.clickOne.bind(this, '2')
          },
          {
            class: 'cancel_btn',
            label: '转给他人',
            clickHandle: this.clickOne.bind(this, '3')
          },
          {
            class: 'cancel_btn',
            label: '删除',
            btnId: '402000002',
            clickHandle: this.clickOne.bind(this, '4')
          }
        ],
        headerInfo: [{ label: '负责销售', key: 'saler' }, { label: '负责老师', key: 'counselorName' }],
        // 在读学员学员详情弹窗基础信息内容
        baseInfo: [
          { label: '姓名', key: 'name' },
          { label: '性别', key: 'sex' },
          { label: '生日', key: 'birthday' },
          { label: '年龄', key: 'age' },
          { label: '月龄', key: 'month' },
          { label: '年级', key: 'grade' },
          { label: '星座', key: 'constellation' },
          { label: '民族', key: 'nation' },

          { label: '人脸', key: 'isFaceBiding' },

          { label: '特长', key: 'speciality' },
          { label: '爱好', key: 'hobby' },
          { label: '血型', key: 'bloodType' },
          { label: '学校', key: 'schaddress' },
          { label: '社保号码', key: 'socialSecurityNum' },
          { label: '学员类型', key: 'stuReading' },
          { label: '联系地址', key: 'conaddress' },
          { label: this.$t('firstChannel.label'), key: 'first' },
          { label: this.$t('secondChannel.label'), key: 'second' },
          { label: '学员类型', key: 'intentionName' },
          { label: '备注', key: 'remark' },
          { label: '其他来源', key: 'otherChannel' }
        ],
        defaultTab: 'vipCard'
      },
      // 头部数据
      headerData: {
        last: '2018-01-01',
        next: null
      },
      // 基础信息数据
      baseData: {
        stuId: '111',
        name: '令狐冲',
        ageMonth: '10(1)'
      },
      parentData: [], // 家长信息
      studentName: '',
      detail: {},
      checkedRowlist: [],
      rowInfo: {},
      userBranchOptions: [],
      userBranchSelected: '0',
      operatorType: 0, // 操作类型, 0.全部,1.我的, 2.我的下属
      operatorUser: '', // 查询用户

      isDeleConShow: false,
      msg: '',

      loading: false,
      readingList: [],
      pageCount: 0,
      pageInfo: { pageSize: 10, pageIndex: 0 },
      listQuery: {
        show: true, // 是否显示
        sizeChange: this.sizeChange,
        indexChange: this.indexChange
      },
      studentTypeList: [], // 学员类型
      detailTabs: [
        'vipCard',
        'orderClass',
        'usedPeriods',
        'nursery',
        'parent',
        'leadsRecord',
        'visiteRecord',
        'listenRecord',
        'contract',
        'production'
      ]
    }
  },
  mounted() {
    // 根据路由默认查询
    const route = this.$router.history.current.params
    if (route.activeTab === 'readingStu') {
      if (route.action === 'thisMonthBirthday') {
        this.$refs.commonDatePicker.thisMonthClick()
        this.$refs.commonDatePicker.checkedIndex = 'thisMonth'
      }
    }
    // 在读学员首页机构数据跳转不筛选！
    // const routerDateType = route && route.routerDateType
    // if (routerDateType === 'today') {
    //   this.$refs.superSearch.ruleForm.createTime = [
    //     this.$moment().format('YYYY-MM-DD'),
    //     this.$moment().format('YYYY-MM-DD')
    //   ]
    // } else if (routerDateType === 'thisWeek') {
    //   const weekOfday = this.$moment().format('d') // 计算今天是这周第几天
    //   const monday = this.$moment()
    //     .subtract(weekOfday - 1, 'days')
    //     .format('YYYY-MM-DD')
    //   const sunday = this.$moment()
    //     .add(7 - weekOfday, 'days')
    //     .format('YYYY-MM-DD') // 周日日期
    //   this.$refs.superSearch.ruleForm.createTime = [monday, sunday]
    // } else if (routerDateType === 'thisMonth') {
    //   // 返回本月
    //   const start = this.$moment()
    //     .month(this.$moment().month())
    //     .startOf('month')
    //     .format('YYYY-MM-DD')
    //   const end = this.$moment()
    //     .month(this.$moment().month())
    //     .endOf('month')
    //     .format('YYYY-MM-DD')
    //   this.$refs.superSearch.ruleForm.createTime = [start, end]
    // }

    // this.$refs.superSearch.submitForm()

    this.querySubUser()

    const pageInfo = {
      pageIndex: 0,
      pageSize: 10
    }
    if (Object.keys(route).length > 0) {
      this.$refs.superSearch.submitForm()
    } else {
      this.getZjlCRMStuListFun({ pageInfo })
    }
  },
  methods: {

    // 市场渠道change获取二级渠道
    async secondChange(value) {
      const params = {
        itemKey: value
      }
      const { data } = await subSecondChannelQuery(params)
      if (data.errorCode === 0) {
        this.superSearch.fields[8].options = data.results || []
      } else {
        this.$message.error(data.errorMessage || '二级渠道获取失败')
      }
    },
    /** 查询下属 */
    querySubUser() {
      const userBranchOptions = [
        { id: '0', type: 0, name: '全部员工', children: [] },
        { id: '1', type: 1, name: '我的', children: [] }
      ]
      const children = []
      const self = this
      querySubName().then(res => {
        if (res.data.errorCode === 0) {
          const results = res.data.data
          if (results && results.length > 0) {
            results.map(item => {
              children.push({
                pid: '2',
                id: item.id,
                name: item.name,
                type: 2
              })
            })
            userBranchOptions.push({
              id: '2',
              type: 2,
              name: '我的下属',
              children: children
            })
            self.userBranchOptions = userBranchOptions
          }
        }
      })
      this.userBranchSelected = '0'
      this.userBranchOptions = userBranchOptions
    },
    /* 在读学员列表数据 */
    getZjlCRMStuListFun({ pageInfo, searchValue, superValue }) {
      const self = this
      // 用户权限选择
      const userBranchParams = {}
      if (this.userBranchSelected === '0' || this.userBranchSelected === '1') {
        // 全部、我的
        userBranchParams.operatorType = this.userBranchSelected
      } else if (parseFloat(this.userBranchSelected) > 1) {
        // 我的下属
        userBranchParams.operatorType = '2'
        if (this.userBranchSelected !== '2') {
          // 选择的下属
          userBranchParams.uids = this.userBranchSelected
        }
      }
      // 日期
      let dateValue = {}
      if (
        this.commonDateOptions.pickerDateArr &&
        this.commonDateOptions.pickerDateArr.length > 0
      ) {
        dateValue = {
          startBirthday: this.commonDateOptions.pickerDateArr[0],
          endBirthday: this.commonDateOptions.pickerDateArr[1]
        }
      }
      const payload = {
        ...pageInfo,
        ...searchValue,
        ...superValue,
        ...userBranchParams,
        ...dateValue,
        sourceType: '1'
      }
      // 判断是否有排序
      if (this.sortName && this.sortOrder) {
        payload[this.sortName] = this.sortOrder
      }
      if ((dateValue.startBirthday === undefined && dateValue.endBirthday === undefined) || (dateValue.startBirthday !== undefined && dateValue.endBirthday !== undefined)) {
        this.loading = true
        getZjlCRMStuList(payload).then(res => {
          if (res.data.errorCode === 0) {
            self.commonDateOptions.markText = {
              today: res.data.dayCount || 0,
              thisMonth: res.data.monthCount || 0
            }
            self.readingList = res.data.results || []
            self.pageCount = res.data.data && res.data.data.resultCount
            self.pageInfo = pageInfo || {}
            self.searchValue = searchValue || {}
            self.superValue = superValue || {}
          } else {
            this.$message.error(res.data.errorMessage)
          }
          this.loading = false
        })
      }
    },
    /** 页数改变 */
    indexChange(pageIndex) {
      const payload = {
        searchValue: this.searchValue,
        superValue: this.superValue,
        pageInfo: { pageIndex: pageIndex - 1, pageSize: this.pageInfo.pageSize }
      }
      this.getZjlCRMStuListFun(payload)
    },
    /** 每页条数改变 */
    sizeChange(pageSize) {
      const payload = {
        searchValue: this.searchValue,
        superValue: this.superValue,
        pageInfo: { pageSize, pageIndex: this.pageInfo.pageIndex }
      }
      this.getZjlCRMStuListFun(payload)
    },

    /* 侧边详情弹框 */
    openSideDetail(row) {
      this.rowInfo = row
      const params = {
        stuId: row.id
      }
      getStuMsg(params).then(res => {
        if (res.data.errorCode === 0) {
          this.detail = res.data.data
          this.idObj = {
            ...row,
            source: '1',
            stuId: row.id,
            stuName: this.detail.name
          }
          this.studentName = this.detail.name
          this.parentData = this.detail.list
          this.headerData = {
            saler: this.detail.sellerName,
            followStatus: this.detail.studentFollowStateName,
            counselorName: this.detail.counselorName
          }
          this.baseData = {
            name: this.detail.name,
            sex:
              // eslint-disable-next-line
              this.detail.sex == "1"
                ? '男'
                : this.detail.sex === '2'
                  ? '女'
                  : "", // eslint-disable-line
            birthday: this.detail.birthday,
            isFaceBiding:
              // eslint-disable-line
              this.detail.isFaceBiding === '0' || ''
                ? '未绑定'
                : this.detail.isFaceBiding === '1'
                  ? '已绑定'
                  : '未绑定',
            age: this.detail.age,
            month: this.detail.month,
            nation: this.detail.nation,
            hobby: this.detail.hobby,
            grade: this.detail.grade,
            constellation: this.detail.constellation,
            speciality: this.detail.speciality,
            bloodType: this.detail.bloodType,
            schaddress: this.detail.schaddress,
            socialSecurityNum: this.detail.socialSecurityNum,
            stuReading: '在读',
            remark: this.detail.remark,
            conaddress: this.detail.conaddress,
            first: this.detail.channelName,
            second: this.detail.secondChannelName,
            intentionName: this.detail.intentionName,
            otherChannel: this.detail.otherChannel

          }
          this.$refs.crmDetailModal.show('1')
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 在读学员导入弹框 */
    nameImportDialog() {
      this.$refs.nameImportDialog.showDialog()
    },
    /* 详情按钮 */
    clickOne(type) {
      // 学员报名弹框
      // eslint-disable-next-line
      if (type == "1") {
        this.$refs.applyDialog.showDialog('add', this.rowInfo)
      }
      // 编辑学员信息
      // eslint-disable-next-line
      if (type == "2") {
        this.$refs.addLantentStuDialog.showDialog('editRead', this.detail)
      }
      // 转给他人弹框
      // eslint-disable-next-line
      if (type == "3") {
        this.$refs.distributeDialog.showDialog('returnInfo', this.rowInfo)
      }
      // 删除在读学员
      if (type === '4') {
        const params = {
          stuId: this.rowInfo.id
        }
        this.$refs.deleteStuDialog.showDialog(params)
      }
    },
    /* 选择数据条数操作 */
    selectionChange(val) {
      this.checkedData = val.length
      this.checkedRowlist = val
    },
    /* 更新在读学员列表 */
    getReadingStuList() {
      // this.numI = this.$refs.tableCommon.pageIndex - 1
      this.$refs.crmDetailModal.visible = false
      // const params = {
      //   ...this.searchValue
      // }
      // this.searchHandle(params)
      const params = {
        ...this.searchValue
      }
      this.numI = this.$refs.tableCommon.pageIndex - 1
      this.searchHandle(params)
      setTimeout(() => {
        const numAll = this.$refs.tableCommon.$el.children[0].children[2]
          .textContent
        if (numAll === ' 暂无数据') {
          this.numI = this.$refs.tableCommon.pageIndex - 1
          this.searchHandle(params)
        }
      }, 650)
    },
    /* 导出 */
    exportReadingStu() {
      // 用户权限选择
      const userBranchParams = {}
      if (this.userBranchSelected === '0' || this.userBranchSelected === '1') {
        // 全部、我的
        userBranchParams.operatorType = this.userBranchSelected
      } else if (parseFloat(this.userBranchSelected) > 1) {
        // 我的下属
        userBranchParams.operatorType = '2'
        if (this.userBranchSelected !== '2') {
          // 选择的下属
          userBranchParams.uids = this.userBranchSelected
        }
      }
      // 日期
      let dateValue = {}
      if (
        this.commonDateOptions.pickerDateArr &&
        this.commonDateOptions.pickerDateArr.length > 0
      ) {
        dateValue = {
          startBirthday: this.commonDateOptions.pickerDateArr[0],
          endBirthday: this.commonDateOptions.pickerDateArr[1]
        }
      }
      const params = {
        ...this.searchValue,
        ...this.superValue,
        ...dateValue,
        ...userBranchParams,
        sourceType: 1

      }
      for (const key in params) {
        if (!params[key]) {
          delete params[key]
        }
      }
      if (this.pageCount > 0) {
        exportFile(
          `${window.SS_CRM_EXPORT}/crm/stuInfo/stu/exportCrmStudentInfo`,
          params
        )
      } else {
        this.$message.error('暂无数据导出')
      }
    },
    getUpdateTables(isturn) {
      this.$refs.crmDetailModal.visible = false
      if (isturn) {
        const params = {
          ...this.searchValue
        }
        this.numI = this.$refs.tableCommon.pageIndex - 1
        this.searchHandle(params)
        setTimeout(() => {
          const numAll = this.$refs.tableCommon.$el.children[0].children[2]
            .textContent
          if (numAll === ' 暂无数据') {
            this.numI = this.$refs.tableCommon.pageIndex - 1
            this.searchHandle(params)
          }
        }, 650)
      }
    },
    // 绑定人脸弹窗
    bindingFace(row) {
      this.$refs.bindingFace.showDialog(row)
    },

    /* 微信家长绑定弹框 */
    parentBindWX() {
      this.$refs.parentBindWX.showDialog()
    },
    /* 分配弹框 */
    distributeDialog(num) {
      this.$refs.distributeDialog.showDialog(num, this.checkedRowlist)
    },
    /* 老师分配学员 */
    teachDistributeDialog() {
      this.$refs.teachDistribute.showDialog(this.checkedRowlist)
    },

    // 分配客服
    serviceDistributeDialog() {
      this.$refs.serviceDistributeDialog.showDialog(this.checkedRowlist)
    },

    /* 清除多选 */
    getClearData() {
      this.$refs.tableCommon.clearSelection()
    },

    /* 到访弹框 */
    openVisitDialog(row) {
      this.$refs.visitDialog.showDialog(row, '1')
    },

    /* 试听弹框 */
    openListenDialog(row) {
      row.stuId = row.id
      row.source = '1'
      this.source = '1'
      this.$refs.listenDialog.showDialog('edit', row)
    },

    /* 更新表格数据 */
    getUpdateTable() {
      this.numI = this.$refs.tableCommon.pageIndex - 1
      const params = {
        ...this.searchValue
      }
      this.searchHandle(params)
    },

    /** 详情变动更新表格 */
    detailUpdateTable() {
      this.numI = this.$refs.tableCommon.pageIndex - 1
      const params = {
        ...this.searchValue
      }
      this.searchHandle(params)
    },

    /* 更新详情数据 */
    getUpdateDetailData(row) {
      this.openSideDetail(row)
    },

    /* 报名弹框 */
    openApplyDialog(row) {
      this.$refs.applyDialog.showDialog('add', row, '1')
    },

    /* 公用日期选择改变事件 */
    commonDatePickerChange(arr, reset) {
      const pageInfo = {
        pageIndex: 0,
        pageSize: this.pageInfo.pageSize || 10
      }
      const params = {
        pageInfo,
        searchValue: this.searchValue,
        superValue: this.superValue
      }
      if (reset === 'reset') {
        params.searchValue = {}
      }
      this.commonDateOptions.pickerDateArr = arr
      this.$refs.tableCommon.resetPageIndex()
      this.getZjlCRMStuListFun(params)
    },

    /** 公用日期选择重置事件 */
    commonDateReset() {
      this.$refs.commonDatePicker.commonDateReset()
    },

    /* 搜索时间处理 */
    getTimeSearch(params) {
      if (this.superValue.birthday && this.superValue.birthday.length > 0) {
        params.startBirthday = this.superValue.birthday[0]
        params.endBirthday = this.superValue.birthday[1]
      }
      if (
        this.superValue.nextFollowTime &&
        this.superValue.nextFollowTime.length > 0
      ) {
        params.startNextFollowTime = this.superValue.nextFollowTime[0]
        params.endNextFollowTime = this.superValue.nextFollowTime[1]
      }
      if (
        this.superValue.finalFollowTime &&
        this.superValue.finalFollowTime.length > 0
      ) {
        params.startLastFollowTime = this.superValue.finalFollowTime[0]
        params.endLastFollowTime = this.superValue.finalFollowTime[1]
      }
      if (this.superValue.createTime && this.superValue.createTime.length > 0) {
        params.startCreateTime = this.superValue.createTime[0]
        params.endCreateTime = this.superValue.createTime[1]
      }
      if (this.superValue.age && this.superValue.age.length > 0) {
        params.minAge = this.superValue.age[0]
        params.maxAge = this.superValue.age[1]
      }
      if (this.superValue.month && this.superValue.month.length > 0) {
        params.minMonth = this.superValue.month[0]
        params.maxMonth = this.superValue.month[1]
      }
      delete params.birthday
      delete params.createTime
      delete params.nextFollowTime
      delete params.finalFollowTime
      delete params.month
      delete params.age
      return params
    },
    // 排序
    handleSortChange(val) {
      let orderName = null
      let sortOrder = null
      if (val.order && val.prop) {
        if (val.prop === 'rangeTime') {
          orderName = 'startTimeOrder'
        } else {
          orderName = val.prop + 'Order'
        }
        if (val.order && val.order === 'ascending') { // 升序
          sortOrder = 2
        } else if (val.order && val.order === 'descending') { // 降序
          sortOrder = 1
        }
      }
      this.sortName = orderName
      this.sortOrder = sortOrder
      const params = {
        searchValue: this.searchValue,
        superValue: this.superValue,
        pageInfo: { pageIndex: this.numI, pageSize: this.pageInfo.pageSize }
      }
      this.getZjlCRMStuListFun(params)
    },
    /* 搜索 */
    searchHandle(formValue) {
      this.searchValue = formValue
      const searchValue = this.getTimeSearch(formValue)
      // 搜索的入参
      const params = {
        searchValue,
        superValue: this.superValue,
        pageInfo: { pageIndex: this.numI, pageSize: this.pageInfo.pageSize }
      }
      this.getZjlCRMStuListFun(params)
    },

    /* 搜索重置 */
    resetFieldHanle(formName) {
      this.userBranchSelected = '0'
      this.$refs.commonDatePicker.commonDateReset()
    },

    /** 高级搜索 */
    onSearch(superValue) {
      this.superValue = superValue
      const superSearch = this.getTimeSearch(superValue)
      const params = {
        superValue: superSearch,
        searchValue: this.searchValue,
        pageInfo: { pageIndex: 0, pageSize: this.pageInfo.pageSize }
      }
      this.getZjlCRMStuListFun(params)
    },

    /** 高级清除 */
    onClear() {
      this.onSearch({})
    },

    /** 导入后刷新列表 */
    refresh() {
      this.searchHandle(this.searchValue)
    }
  }
}
