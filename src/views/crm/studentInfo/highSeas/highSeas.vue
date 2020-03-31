<template>
  <div class="highSeas_container">
    <!-- 搜索栏 -->
    <div class="search">
      <div>
        <CommonSearch
          :is-inline="true"
          :params="formInline"
          :forms="formInline"
          @toParent="resetFieldHanle"
        />
        <advanced-search v-bind="superSearch" />
      </div>
      <div>
        <el-button
          v-log="{compName:'公海池',eventName:'web-【学员CRM】-学员信息-公海池-新建名单'}"
          v-if="hasBtn('402000001')"
          type="primary"
          size="mini"
          @click="addLantentDialog()"
        >新建名单</el-button>
        <el-button
          v-log="{compName:'公海池',eventName:'web-【学员CRM】-学员信息-公海池-批量分配'}"
          v-if="hasBtn('402000006')"
          class="cancel_btn"
          size="mini"
          @click="openBatchAllotDialog()"
        >批量分配</el-button>
      </div>
    </div>
    <!-- 已选数据操作 -->
    <div class="checked_data">
      <span class="checked_text">已选<i>{{ checkNum || '0' }}</i>条数据</span>
      <el-button
        v-log="{compName:'公海池',eventName:'web-【学员CRM】-学员信息-公海池-分配'}"
        v-if="hasBtn('402000006')"
        size="mini"
        class="cancel_btn edit_btn"
        @click="openDistributeDialog(checkedData)"
      >分配</el-button>
      <el-button
        v-log="{compName:'公海池',eventName:'web-【学员CRM】-学员信息-公海池-捞取'}"
        v-if="hasBtn('402000012')"
        size="mini"
        class="cancel_btn edit_btn"
        style="margin:0 5px"
        @click="openFetchNameDialog(checkedData)"
      >捞取</el-button>
      <Confirm
        v-log="{compName:'公海池',eventName:'web-【学员CRM】-学员信息-公海池-放入回收站'}"
        v-if="hasBtn('402000009')"
        :text="'放入回收站'"
        :placement="'top'"
        :content="'确定要放入回收站吗'"
        :confirm="()=>{putRecycleBtn()}"
        :select-data="checkNum"
        :is-visible-fun="true"
        :is-button="true"
        :btn-class="'cancel_btn edit_btn'"
      />
      <Confirm
        v-log="{compName:'公海池',eventName:'web-【学员CRM】-学员信息-公海池-退回总部'}"
        v-if="hasBtn('402000011')"
        :text="'退回总部'"
        :placement="'top'"
        :content="'确定要退回总部吗'"
        :confirm="()=>{backHeadBtn()}"
        :select-data="checkNum"
        :is-visible-fun="true"
        :is-button="true"
        :btn-class="'cancel_btn edit_btn'"
      />
    </div>
    <!-- 表格 -->
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      table-key="crm_studentInfo_highSeas"
      @handleSelectionChange="selectionChange"
    />
    <!-- 分配弹框 -->
    <DistributeDialog
      ref="distributeDialog"
      @toParent="getFetchData"
      @toUpdateTable="getUpdateTable(true)"
    />
    <!-- 捞取名单弹框 -->
    <FetchNameDialog
      ref="fetchNameDialog"
      @toParent="getFetchData"
      @toUpdateTable="getUpdateTable(true)"
    />
    <!-- 批量分配弹框 -->
    <BatchAllotDialog
      v-if="isBatchShow"
      ref="batchAllotDialog"
      @toClose="closeBatch"
      @toUpdateTable="getUpdateTable(true)"
    />
    <!-- 编辑名单 -->
    <AddLantentStuDialog
      ref="addLantentStuDialog"
      :lead-source="'lead_sea'"
      @toUpdateFollow="getUpdateFollow"
      @toUpdateTable="getUpdateTable()"
    />
    <!-- 删除学员 -->
    <DeleteStuDialog
      ref="deleteStuDialog"
      @toUpdateTable="getUpdateTable(true)"
      @toCloseSidePage="closeSidePage"
    />
    <!-- 侧边详情 -->
    <CrmDetailModal
      ref="crmDetailModal"
      v-bind="detailProps"
      :header-data="headerData"
      :student-type ="studentType"
      :source ="'2'"
      :base-data="baseData"
      :params="paramsObj"
      :name="stuName"
      :parent-data="parentData"
      class="side_follow_dialog"
      @toUpdateLeadsTable="getUpdateSideAndTable"
    />
  </div>
</template>

<script>
import { queryClueStuList, dictGetByKey, recycle, recyle2Home, subSecondChannelQuery } from '@/api/crm/studentInfo/highSeas'
import CommonTable from './../../../../components/CommonTable/CommonTable'
import CommonSearch from './../../../../components/CommonSearch/CommonSearch'
import Confirm from '@/components/MiniCommon/Confirm'
import CrmDetailModal from '@/components/CrmDetailModal'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import DistributeDialog from './../lantentStu/components/distributeDialog.vue'
import AddLantentStuDialog from './../lantentStu/components/addLantentStuDialog.vue'
import DeleteStuDialog from './../lantentStu/components/deleteStuDialog.vue'
import FetchNameDialog from './components/fetchNameDialog.vue'
import BatchAllotDialog from './components/batchAllotDialog.vue'
export default {
  components: {
    CommonTable,
    CommonSearch,
    Confirm,
    CrmDetailModal,
    AdvancedSearch,
    DistributeDialog, // 分配弹框
    FetchNameDialog, // 捞取名单弹框
    BatchAllotDialog, // 批量分配弹框
    AddLantentStuDialog, // 编辑名单
    DeleteStuDialog // 删除学员
  },
  data() {
    return {
      studentType: 'commonalityLeads',
      batchParams: {}, // 传到批量分配页面的筛选参数
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '名单姓名',
          prop: 'name',
          isShowTooltip: true,
          render: (h, params) => {
            return h(
              'div',
              {
                class: 'stuName',
                on: {
                  click: () => {
                    this.openSideDialog(params.row)
                  }
                }
              }, params.row.name
            )
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
                params.row.list && params.row.list.length > 1
                  ? [
                    h(
                      'el-popover',
                      {
                        props: { placement: 'top', trigger: 'hover' }
                      },
                      [
                        h(
                          'div',
                          params.row.list &&
                          params.row.list.map(item => {
                            return h('span', { style: 'margin-right:10px' }, item.parentName)
                          })
                        ),
                        h(
                          'span', { slot: 'reference' }, [
                            h(
                              'span', { style: 'margin-right:5px' },
                              params.row.list[0].parentName + ' '
                            ),
                            h(
                              'a',
                              { style: 'margin: 0 0 0 5px' },
                              '共' + params.row.list.length + '人'
                            )
                          ]
                        )
                      ]
                    )
                  ]
                  : params.row.list &&
                  params.row.list.map((item, index) => {
                    return h('span', item.parentName)
                  })
              )
            ])
          }
        },
        {
          label: '家长手机号',
          prop: 'parentMobile',
          isShowTooltip: true,
          width: 110,
          render: (h, params) => {
            return h('span', {}, [
              params.row.list && params.row.list.length > 0
                ? h(
                  'el-popover',
                  {
                    props: { placement: 'top', trigger: 'hover' }
                  },
                  [
                    h(
                      'div',
                      [
                        params.row.list.map(item => {
                          return h('div', [
                            h(
                              'span', item.parentName + '：' + item.parentMobile
                            ),
                            h('a', { style: 'margin:0 0 0 10px' }, '拨打')
                          ])
                        })
                      ]
                    ),
                    h('a', { slot: 'reference' }, '查看')
                  ]
                )
                : ''
            ])
          }
        },
        {
          label: '跟进处理',
          prop: 'commRecordStatus',
          isShowTooltip: true,
          width: 150,
          renderHeader: (h, { columns, $index }) => {
            return h('div', { style: { padding: '0' }}, [
              h('span', '跟进处理'),
              h('el-tooltip', { props: { effect: 'dark', content: '若学员有跟进记录标记为“已跟进”,若学员无任何跟进记录标记为“未跟进”', placement: 'top' }}, [
                h('i', { class: 'el-icon-question', style: { marginLeft: '5px' }})
              ])
            ])
          }
        },
        {
          label: '跟进状态',
          prop: 'studentFollowStateName',
          isShowTooltip: true
        },
        {
          label: '重要程度',
          prop: 'importance',
          isShowTooltip: true
        },
        {
          label: '性别',
          prop: 'sex',
          isShowTooltip: true,
          formatter: (row) => {
            if (row.sex == '2') { //eslint-disable-line
              return `<img src="https://img.ishanshan.com/gimg/n/20190318/03fdc2ea05f27c74f5d8c706ef4f03c0">`
            } else if (row.sex == '1') { //eslint-disable-line
              return `<img src="https://img.ishanshan.com/gimg/n/20190318/d56924830405313c7dc47fbc1763f10e">`
            }
          }
        },
        {
          label: '前负责人',
          prop: 'preSellerName',
          isShowTooltip: true
        },
        {
          label: '生日',
          prop: 'birthday',
          hasSort: 'custom',
          isShowTooltip: true,
          width: 120,
          isColShow: false
        },
        {
          label: '年龄(月龄)',
          prop: 'age',
          isShowTooltip: true,
          isColShow: false,
          formatter: (row) => {
            if (row.age != null || row.month != null) {
              return `${row.age}(${row.month})`
            } else {
              return ``
            }
          }
        },
        {
          label: '创建时间',
          prop: 'createTime',
          isShowTooltip: true,
          hasSort: 'custom',
          width: 120,
          isColShow: false
        },
        {
          label: '最后跟进时间',
          prop: 'followRecordTime',
          hasSort: 'custom',
          isShowTooltip: true,
          width: 150
        },
        {
          label: '下次跟进时间',
          prop: 'nextFollowTime',
          hasSort: 'custom',
          isShowTooltip: true,
          width: 150
        },
        {
          label: this.$t('firstChannel.label'),
          prop: 'channelName',
          isShowTooltip: true,
          width: 140
        },
        {
          label: this.$t('secondChannel.label'),
          prop: 'secondChannelName',
          isShowTooltip: true,
          width: 140
        },
        {
          label: this.$t('thirdChannel.label'),
          prop: 'subSecondChannelStr',
          isShowTooltip: true,
          isColShow: false
        },
        {
          label: '到访状态',
          prop: 'visitRecordStatus',
          isShowTooltip: true,
          width: 150,
          renderHeader: (h, { columns, $index }) => {
            return h('div', { style: { padding: '0' }}, [
              h('span', '到访状态'),
              h('el-tooltip', { props: { effect: 'dark', content: '若学员有“确认到访”记录，标记为“已到访”；若学员无“确认到访”记录，标记为“未到访”', placement: 'top' }}, [
                h('i', { class: 'el-icon-question', style: { marginLeft: '5px' }})
              ])
            ])
          }
        },
        {
          label: '试听状态',
          prop: 'subAuditionStatus',
          width: 150,
          isShowSet: true,
          renderHeader: (h, { columns, $index }) => {
            return h('div', { style: { padding: '0' }}, [
              h('span', '试听状态'),
              h('el-tooltip', { props: { effect: 'dark', placement: 'top' }}, [
                h('div', { slot: 'content' }, [
                  h('p', '无试听记录：学员没有关联任何试听记录'),
                  h('p', '已试听：学员有关联至少一条“已试听”状态试听记录，标记为“已试听”'),
                  h('p', '未试听：学员有关联试听记录但无任何“已试听”状态的试听记录，标记为“未试听”')
                ]),
                h('i', { class: 'el-icon-question', style: { marginLeft: '5px' }})
              ])
            ])
          },
          formatter: (row) => {
            if (row.subAuditionStatus === '0') {
              return '无试听记录'
            }
            if (row.subAuditionStatus === '1') {
              return '已试听'
            }
            if (row.subAuditionStatus === '2') {
              return '未试听'
            }
          }
        },
        {
          label: '负责销售',
          prop: 'sellerName',
          isShowTooltip: true,
          width: 140
        },
        {
          label: '收集者',
          prop: 'collecterName',
          isShowTooltip: true,
          isColShow: false,
          width: 140

        },
        {
          label: '创建人',
          prop: 'createName',
          isShowTooltip: true,
          width: 160,
          isColShow: false
        },
        {
          label: '推荐人',
          prop: 'recommenderName',
          isShowTooltip: true,
          width: 160,
          isColShow: false
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
        mutiSelect: true, // 是否多选
        apiService: queryClueStuList, // 表格的数据请求接口
        params: {
          commonalityLeads: '1'
        },
        isSettingShow: true // 是否出现设置
      },
      tableHeight: 'calc(100vh - 265px)',
      formInline: {
        searchMethod: formValue => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '名单姓名/家长手机号',
            modelValue: 'nameOrMobile',
            itemStyle: 'width:180px',
            isFilterable: true,
            isClearable: true
          }, {
            itemType: 'select',
            placeholder: this.$t('firstChannel.label'),
            modelValue: 'firstChannel',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            valueKey: 'key',
            labelKey: 'value',
            apiService: dictGetByKey,
            params: {
              dictkey: 'firstChannel'
            }
          }, {
            itemType: 'select',
            placeholder: '跟进状态',
            modelValue: 'studentFollowState',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            valueKey: 'key',
            labelKey: 'value',
            apiService: dictGetByKey,
            params: {
              dictkey: 'studentFollowState'
            }
          }
        ]
      },
      superSearch: {
        onClear: () => { this.onClear() },
        onSearch: (superValue) => { this.onSearch(superValue) },
        fields: window.language === 'dsf' ? [
          {
            type: 'select',
            key: 'importance',
            label: '重要程度',
            optionValue: 'key',
            optionLabel: 'value',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/dict/dictGetByKey`,
            asyncParams: {
              dictkey: 'importance'
            }
          }, {
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
          }, {
            type: 'select',
            key: 'subSecondChannel',
            label: '二级渠道',
            placeholder: '请选择（请先选择市场渠道）',
            optionValue: 'id',
            optionLabel: 'value',
            options: []
          }, {
            type: 'input',
            key: 'parentName',
            label: '家长姓名'
          }, {
            type: 'select',
            key: 'sex',
            label: '性别',
            optionValue: 'id',
            optionLabel: 'name',
            options: [
              { id: '1', name: '男' },
              { id: '2', name: '女' }
            ]
          }, {
            type: 'inputRange',
            key: 'age',
            label: '年龄'
          }, {
            type: 'inputRange',
            key: 'month',
            label: '月龄'
          }, {
            type: 'dateCascader',
            key: 'birthday',
            label: '生日'
          }, {
            type: 'datePicker',
            key: 'createTime',
            label: '创建日期',
            dateType: 'daterange'
          }, {
            type: 'dateTimePicker',
            key: 'nextFollowTime',
            label: '下次跟进时间',
            isRange: true,
            defaultTime: ['00:00:00', '23:59:59'],
            format: 'yyyy-MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm'
          }, {
            type: 'dateTimePicker',
            key: 'finalFollowTime',
            label: '最后跟进时间',
            isRange: true,
            defaultTime: ['00:00:00', '23:59:59'],
            format: 'yyyy-MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm'
          }, {
            type: 'select',
            key: 'commRecordStatus',
            label: '跟进处理',
            optionValue: 'id',
            optionLabel: 'name',
            options: [
              { id: '1', name: '已跟进' },
              { id: '0', name: '未跟进' }
            ]
          },
          {
            type: 'select',
            key: 'visitRecordStatus',
            label: '到访状态',
            optionValue: 'id',
            optionLabel: 'name',
            options: [
              { id: '1', name: '已到访' },
              { id: '0', name: '未到访' }
            ]
          }, {
            type: 'select',
            key: 'subAuditionStatus',
            label: '试听状态',
            optionValue: 'id',
            optionLabel: 'name',
            options: [
              { id: '0', name: '无试听记录' },
              { id: '1', name: '已试听' },
              { id: '2', name: '未试听' }
            ]
          }, {
            type: 'select',
            key: 'collecterName',
            label: '收集者',
            optionValue: 'name',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          }, {
            type: 'select',
            key: 'recommenderName',
            label: '推荐人',
            optionValue: 'name',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          }, {
            type: 'select',
            key: 'createName',
            label: '创建人',
            optionValue: 'name',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          }, {
            type: 'select',
            key: 'preSellerName',
            label: '前负责人',
            optionValue: 'name',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          }, {
            type: 'select',
            key: 'clsId',
            label: '在读班级',
            optionValue: 'clsId',
            optionLabel: 'clsName',
            isAsync: true,
            url: `${window.SS_CRM}/cerp/cls/classGradeSummary`
          }, {
            type: 'input',
            key: 'remarks',
            label: '备注'
          }, {
            type: 'input',
            key: 'otherChannel',
            label: '其他来源'
          }
        ] : [
          {
            type: 'select',
            key: 'importance',
            label: '重要程度',
            optionValue: 'key',
            optionLabel: 'value',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/dict/dictGetByKey`,
            asyncParams: {
              dictkey: 'importance'
            }
          }, {
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
            onChange: this.secondChange
          }, {
            type: 'input',
            key: 'parentName',
            label: '家长姓名'
          }, {
            type: 'select',
            key: 'sex',
            label: '性别',
            optionValue: 'id',
            optionLabel: 'name',
            options: [
              { id: '1', name: '男' },
              { id: '2', name: '女' }
            ]
          }, {
            type: 'inputRange',
            key: 'age',
            label: '年龄'
          }, {
            type: 'inputRange',
            key: 'month',
            label: '月龄'
          }, {
            type: 'dateCascader',
            key: 'birthday',
            label: '生日'
          }, {
            type: 'datePicker',
            key: 'createTime',
            label: '创建日期',
            dateType: 'daterange'
          }, {
            type: 'dateTimePicker',
            key: 'nextFollowTime',
            label: '下次跟进时间',
            isRange: true,
            defaultTime: ['00:00:00', '23:59:59'],
            format: 'yyyy-MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm'
          }, {
            type: 'dateTimePicker',
            key: 'finalFollowTime',
            label: '最后跟进时间',
            isRange: true,
            defaultTime: ['00:00:00', '23:59:59'],
            format: 'yyyy-MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm'
          }, {
            type: 'select',
            key: 'commRecordStatus',
            label: '跟进处理',
            optionValue: 'id',
            optionLabel: 'name',
            options: [
              { id: '1', name: '已跟进' },
              { id: '0', name: '未跟进' }
            ]
          },
          {
            type: 'select',
            key: 'visitRecordStatus',
            label: '到访状态',
            optionValue: 'id',
            optionLabel: 'name',
            options: [
              { id: '1', name: '已到访' },
              { id: '0', name: '未到访' }
            ]
          }, {
            type: 'select',
            key: 'subAuditionStatus',
            label: '试听状态',
            optionValue: 'id',
            optionLabel: 'name',
            options: [
              { id: '0', name: '无试听记录' },
              { id: '1', name: '已试听' },
              { id: '2', name: '未试听' }
            ]
          }, {
            type: 'select',
            key: 'collecterName',
            label: '收集者',
            optionValue: 'name',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          }, {
            type: 'select',
            key: 'recommenderName',
            label: '推荐人',
            optionValue: 'name',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          }, {
            type: 'select',
            key: 'createName',
            label: '创建人',
            optionValue: 'name',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          }, {
            type: 'select',
            key: 'preSellerName',
            label: '前负责人',
            optionValue: 'name',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          }, {
            type: 'input',
            key: 'remarks',
            label: '备注'
          }, {
            type: 'input',
            key: 'otherChannel',
            label: '其他来源'
          }
        ]
      },
      superValue: {}, // 高级搜索内容
      formValue: {},
      checkedData: [], // 选中的数据
      checkNum: 0, // 选中的数据条数
      isBatchShow: false, // 弹窗是否显示
      // 详情
      detailProps: {
        btns: [
          {
            type: 'primary',
            label: '编辑',
            btnId: '402000003',
            clickHandle: this.editLeads
          },
          {
            class: 'cancel_btn',
            label: '放入回收站',
            btnId: '402000009',
            clickHandle: this.deleteLeads
          }
        ],
        headerInfo: [
          { label: '最后跟进时间', key: 'finalTime' },
          { label: '下次跟进时间', key: 'nextTime' },
          { label: '负责销售', key: 'saler' },
          { label: '跟进状态', key: 'followStatus' }
        ],
        baseInfo: [
          { label: '姓名', key: 'name' },
          { label: '昵称', key: 'nickName' },
          { label: '性别', key: 'sex' },
          { label: '生日', key: 'birthday' },
          { label: '年龄(月龄)', key: 'month' },
          { label: '民族', key: 'nation' },
          { label: '爱好', key: 'hobby' },
          { label: '年级', key: 'grade' },
          { label: '特长', key: 'speciality' },
          { label: '血型', key: 'bloodType' },
          { label: '学校', key: 'schaddress' },
          { label: '社保号码', key: 'socialSecurityNum' },
          { label: '备注', key: 'remark' },
          { label: '联系地址', key: 'conaddress' },
          { label: this.$t('firstChannel.label'), key: 'first' },
          { label: this.$t('secondChannel.label'), key: 'second' },
          { label: '其他来源', key: 'otherChannel' }
        ],
        defaultTab: 'leadsRecord',
        tabs: ['parent', 'leadsRecord', 'visiteRecord', 'listenRecord']
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
      stuName: '',
      paramsObj: {}, // 侧边栏参数
      detail: {}, // 侧边栏详情
      rowInfo: {}
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
        this.superSearch.fields[2].options = data.results || []
      } else {
        this.$message.error(data.errorMessage || '二级渠道获取失败')
      }
    },
    /* 获取侧边详情 */
    openSideDialog(row) {
      this.rowInfo = row
      const params = {
        pageIndex: 0,
        commonalityLeads: '1',
        id: this.rowInfo.id
      }
      let parentId = ''
      let parentName = ''
      let ageMonth = ''
      queryClueStuList(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.detail = data.results && data.results[0]
          if (this.detail.list && this.detail.list.length > 0) {
            parentId = this.detail.list[0].parentId
            parentName = this.detail.list[0].parentName
          }
          if (this.detail.month != null || this.detail.age != null) {
            ageMonth = this.detail.age + '(' + this.detail.month + ')'
          } else {
            ageMonth = '--'
          }
          this.paramsObj = {
            stuId: this.detail.id,
            stuName: this.detail.name,
            source: '2',
            parentId: parentId,
            parentName: parentName,
            studentFollowState: this.detail.studentFollowState,
            ...this.detail
          }
          this.stuName = this.detail.name
          this.parentData = this.detail.list
          this.headerData = {
            finalTime: this.detail.followRecordTime,
            nextTime: this.detail.nextFollowTime,
            saler: this.detail.sellerName,
            followStatus: this.detail.studentFollowStateName
          }
          this.baseData = {
            name: this.detail.name,
            nickName: this.detail.nickName,
            sex: this.detail.sex == '1' ? '男' : this.detail.sex == '2' ? '女' : '', //eslint-disable-line
            birthday: this.detail.birthday,
            month: ageMonth,
            nation: this.detail.nation,
            hobby: this.detail.hobby,
            grade: this.detail.grade,
            speciality: this.detail.speciality,
            bloodType: this.detail.bloodType,
            schaddress: this.detail.schaddress,
            socialSecurityNum: this.detail.socialSecurityNum,
            remark: this.detail.remark,
            conaddress: this.detail.conaddress,
            first: this.detail.channelName,
            second: this.detail.secondChannelName,
            otherChannel: this.detail.otherChannel
          }
          this.$refs.crmDetailModal.show()
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 名单编辑 */
    editLeads() {
      this.$refs.addLantentStuDialog.showDialog('editSea', this.detail)
    },
    /* 新建名单弹框 */
    addLantentDialog() {
      this.$refs.addLantentStuDialog.showDialog('addSea')
    },
    /* 编辑刷新跟进 */
    getUpdateFollow(row) {
      // 刷新当前页面
      this.$refs.tableCommon.getList()
      this.$refs.crmDetailModal.getLeadsRecord()
      this.openSideDialog(row)
    },
    /* 删除 */
    deleteLeads() {
      this.$refs.deleteStuDialog.showDialog(this.detail)
    },
    /* 放入回收站 */
    putRecycleBtn() {
      let stuIds = ''
      const stuArr = []
      this.checkedData && this.checkedData.map(item => {
        stuArr.push(item.id)
      })
      stuIds = stuArr.join(',')
      const params = {
        stauts: '3',
        stuIds: stuIds
      }
      recycle(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.$message.success(data.errorMessage)
          this.getUpdateTable(true)
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 退回总部 */
    backHeadBtn() {
      let stuIds = ''
      const stuArr = []
      this.checkedData && this.checkedData.map(item => {
        stuArr.push(item.id)
      })
      stuIds = stuArr.join(',')
      const params = {
        id: stuIds
      }
      recyle2Home(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.$message.success(data.errorMessage)
          this.getUpdateTable(true)
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 捞取的取消 */
    getFetchData() {
      this.$refs.tableCommon.clearSelection()
    },
    getListById() {
      const payload = {
        pageIndex: 0,
        commonalityLeads: '1',
        id: this.paramsObj.id
      }
      this.$refs.tableCommon.getList(payload)
    },
    /* 更新表格和侧边栏数据 */
    getUpdateSideAndTable(row) {
      this.getUpdateTable(true)
      this.openSideDialog(row)
    },
    /* 表格数据的更新 */
    getUpdateTable(istrue) {
      if (istrue) {
        this.$refs.tableCommon.getList()
        setTimeout(() => {
          const numAll = this.$refs.tableCommon.$el.children[0].children[2].textContent
          if (numAll === ' 暂无数据') {
            this.$refs.tableCommon.getList()
          }
        }, 650)
      } else {
        const payload = {
          pageIndex: 0,
          commonalityLeads: '1'
        }
        this.$refs.tableCommon.getList(payload)
      }
    },
    /* 关闭侧边弹框 */
    closeSidePage() {
      this.$refs.crmDetailModal.visible = false
    },
    /* 选择数据条数操作 */
    selectionChange(val) {
      this.checkNum = val.length
      this.checkedData = val
    },
    /* 分配弹框 */
    openDistributeDialog(checkedData) {
      this.$refs.distributeDialog.showDialog(checkedData)
    },
    /* 捞取名单弹框 */
    openFetchNameDialog(checkedData) {
      this.$refs.fetchNameDialog.showDialog(checkedData)
    },
    /* 批量分配弹框 */
    openBatchAllotDialog() {
      this.isBatchShow = true
      this.$nextTick(() => {
        this.$refs.batchAllotDialog.showDialog(this.batchParams)
      })
    },
    /* 关闭弹窗 */
    closeBatch() {
      this.isBatchShow = false
    },
    /* 时间处理 */
    getTimeSearch(params) {
      if (this.superValue.birthday && this.superValue.birthday.length > 0) {
        params.startBirthday = this.superValue.birthday[0]
        params.endBirthday = this.superValue.birthday[1]
      }
      if (this.superValue.createTime && this.superValue.createTime.length > 0) {
        params.startCreateTime = this.superValue.createTime[0]
        params.endCreateTime = this.superValue.createTime[1]
      }
      if (this.superValue.nextFollowTime && this.superValue.nextFollowTime.length > 0) {
        params.startNextFollowTime = this.superValue.nextFollowTime[0]
        params.endNextFollowTime = this.superValue.nextFollowTime[1]
      }
      if (this.superValue.finalFollowTime && this.superValue.finalFollowTime.length > 0) {
        params.startFinalFollowTime = this.superValue.finalFollowTime[0]
        params.endFinalFollowTime = this.superValue.finalFollowTime[1]
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
      delete params.age
      delete params.month
    },
    /* 搜索 */
    searchHandle(formValue) {
      this.formValue = formValue
      // 搜索的入参
      const params = {
        commonalityLeads: '1',
        ...this.formValue,
        ...this.superValue
      }
      for (const i in params) {
        if (!params[i]) {
          delete params[i]
        }
      }
      this.batchParams = params // 把给后端的搜索入参赋值
      this.getTimeSearch(params)
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        pageIndex: 0,
        commonalityLeads: '1',
        ...this.superValue
      }
      // for (const i in params) {
      //   if (!params[i]) {
      //     delete params[i]
      //   }
      // }
      this.formValue = {}
      this.batchParams = {}
      this.getTimeSearch(params)
      this.$refs.tableCommon.getList(params)
    },
    /** 高级搜索 */
    onSearch(superValue) {
      this.superValue = superValue
      const params = {
        commonalityLeads: '1',
        ...this.formValue,
        ...this.superValue
      }
      for (const i in params) {
        if (!params[i]) {
          delete params[i]
        }
      }
      this.getTimeSearch(params)
      this.$refs.tableCommon.getList(params)
    },
    /** 高级清除 */
    onClear() {
      const params = {
        pageIndex: 0,
        commonalityLeads: '1',
        ...this.formValue
      }
      for (const i in params) {
        if (!params[i]) {
          delete params[i]
        }
      }
      this.superValue = {}
      this.getTimeSearch(params)
      this.$refs.tableCommon.getList(params)
    }
  }
}
</script>

<style lang="scss" scoped>
.highSeas_container {
  .search {
    display: flex;
    justify-content: space-between;
    height: 48px;
  }
  .checked_data {
    margin: 0px 0 16px;
    .checked_text {
      margin-right: 10px;
    }
    i {
      font-style: normal;
      color: #46b6ee;
      padding: 0 5px;
    }
  }
  .btn-text {
    margin-left: 10px;
  }
}
</style>
<style lang="scss">
.highSeas_container {
  .stuName {
    color: #1d9df2;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
    &:hover {
      color: #56c0f5;
    }
  }
}
</style>
