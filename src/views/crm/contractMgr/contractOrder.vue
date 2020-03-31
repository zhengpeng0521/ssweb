<template>
  <div class="contractOrder_container">
    <!-- 搜索栏 -->
    <div class="search">
      <div>
        <div class="subUserSelect">
          <SubUserSelect
            :options="userBranchOptions"
            v-model="userBranchSelected"
            width="120"
          />
        </div>
        <CommonSearch
          ref="CommonSearch"
          :is-inline="true"
          :params="formInline"
          :forms="formInline"
          @toParent="resetFieldHanle"
        />
        <advanced-search
          ref="superSearch"
          v-bind="superSearch"
        />
      </div>
      <div>
        <!-- <el-button
          v-if="hasBtn('406000003')"
          class="green_btn"
          size="mini"
          @click="importContractDialog()"
        >导入合同</el-button> -->

        <!-- v-if="tableExportStu == '0' && hasBtn('406000004') ? false : true" -->
        <el-button
          v-log="{compName:'合同订单',eventName:'web-【学员CRM】-合同管理-合同订单-导出合同'}"
          v-if="hasBtn('406000004')"
          class="green_btn"
          size="mini"
          @click="exportContract"
        >导出合同</el-button>
        <el-button
          v-log="{compName:'合同订单',eventName:'web-【学员CRM】-合同管理-合同订单-新建合同'}"
          v-if="hasBtn('406000001')"
          class="green_btn"
          size="mini"
          @click="contractOrderDialog()"
        >新建合同</el-button>
      </div>
    </div>
    <!-- 已选数据操作 -->
    <div class="checked_data">
      <span class="checked_text">已选<i>{{ checkedData || '0' }}</i>条数据</span>
      <el-button
        v-log="{compName:'在读学员',eventName:'web-【学员CRM】-学员信息-在读学员-分配销售'}"
        v-if="hasBtn('406000006')"
        size="mini"
        class="cancel_btn edit_btn"
        style="margin-right:5px"
        @click="batchCheck(checkedRowlist)"
      >批量审核</el-button>
      <el-button
        v-log="{compName:'在读学员',eventName:'web-【学员CRM】-学员信息-在读学员-分配老师'}"
        v-if="hasBtn('406000005')"
        size="mini"
        class="cancel_btn edit_btn"
        style="margin-left:0px"
        @click="batchCancell(checkedRowlist)"
      >批量作废</el-button>
    </div>
    <!-- 表格 -->
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      :operation="operates"
      table-key="crm_contract_order"
      @handleSelectionChange="selectionChange"
    />
    <!-- 合同订单侧边弹框 -->
    <ContractSideDialog
      ref="contractSideDialog"
      @toContractList="getContractList"
      @toEidtContract="editContractOrderDialog"
    />

    <!-- 合同批量导入弹框 -->
    <ImportContractDialog ref="importContractDialog" />
    <!-- 新建合同弹框 -->
    <ContractOrderDialog
      ref="contractOrderDialog"
      @toContractList="getContractList"
    />
    <!-- 审核合同弹框组件 -->
    <CheckContractDialog
      ref="checkContractDialog"
      @toContractList="getContractList"
    />
    <!-- 收款弹框 -->
    <GatheringDialog
      ref="gatheringDialog"
      @toContractList="getContractList"
    />
  </div>
</template>

<script>
import {
  queryOrder,
  querySubName,
  batchPassOrder, // 批量审核合同
  batchInvalidOrder // 批量作废合同
} from '@/api/crm/contract/contract.js'
import CommonTable from './../../../components/CommonTable/CommonTable'
import CommonSearch from './../../../components/CommonSearch/CommonSearch'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import ContractSideDialog from './side/contractSideDialog.vue' // 普通合同详情弹框
import ImportContractDialog from './components/importContractDialog.vue'
import ContractOrderDialog from './components/contractOrderDialog.vue'
import CheckContractDialog from './components/checkContractDialog.vue'
import GatheringDialog from './components/gatheringDialog.vue'
import SubUserSelect from './../../../components/SubUserSelect/SubUserSelect.vue'
import { exportFile } from '@/utils/exportFile'
import { mapState } from 'vuex'
import moment from 'moment'
export default {
  components: {
    CommonTable,
    CommonSearch,
    AdvancedSearch,
    ContractSideDialog, // 合同订单侧边弹框
    ImportContractDialog, // 合同批量导入弹框
    ContractOrderDialog, // 合同订单弹框
    CheckContractDialog, // 审核合同弹框组件
    GatheringDialog, // 收款弹框
    SubUserSelect // 用户下拉树
  },
  data() {
    return {
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '合同编号',
          prop: 'orderNum',
          isShowSet: false,
          hasSort: 'custom',
          width: 120,
          isShowTooltip: true,
          render: (h, params) => {
            return h(
              'div',
              {
                class: 'orderNum',
                on: {
                  click: () => {
                    this.openSideDialog(params.row)
                  }
                }
              }, params.row.orderNum
            )
          }
          // formatter: (row, column, cellValue) => {
          //   return `<div style="color:#1D9DF2;text-overflow:ellipsis;overflow:hidden">${row.orderNum}</div>`
          // },
          // methods: (row) => {
          //   this.openSideDialog(row)
          // }
        },
        {
          label: '学员姓名',
          prop: 'orderStuNames',
          width: 120,
          isShowTooltip: true
        },
        {
          label: '学员类型',
          prop: 'orderNewOldstuName',
          width: 120,
          hasSort: 'custom',
          isShowTooltip: true
        },
        {
          label: '签约类型',
          prop: 'signTypeName',
          hasSort: 'custom',
          width: 120,
          isShowTooltip: true
        },

        // 合同类型添加！
        {
          label: '合同类型',
          prop: 'purchaseType',
          width: 120,
          isShowTooltip: true,
          // eslint-disable-next-line no-unused-vars
          formatter: (row, column, cellValue) => { // 1代表的是正式合同和赠送合同相加，2代表赠送合同，3代表正式合同
            if (row.purchaseType == '1') { //eslint-disable-line
              return `<div>${'正式合同'}</div>`
            }
            if (row.purchaseType == '2') { //eslint-disable-line
              return `<div>${'赠送合同'}</div>`
            }
            if (row.purchaseType == '3') { //eslint-disable-line
              return `<div>${'正式合同'}</div>`
            }
          }
        },

        {
          label: '购买类型',
          prop: 'orderType',
          width: 120,
          isShowTooltip: true,
          // eslint-disable-next-line no-unused-vars
          formatter: (row, column, cellValue) => {
            if (row.orderType == '2') { //eslint-disable-line
              return `<div>${'课时套餐'}</div>`
            }
            if (row.orderType == '3') { //eslint-disable-line
              return `<div>${'托班套餐'}</div>`
            }
          }
        },
        {
          label: '会员卡号',
          prop: 'stuCardId',
          hasSort: 'custom',
          width: 120,
          isShowTooltip: true
        },
        {
          label: '签约家长',
          prop: 'parentName',
          width: 120,
          isShowTooltip: true
        },
        {
          label: '家长手机号',
          prop: 'mobile',
          isShowTooltip: true,
          width: '110px',
          render: (h, params) => {
            return h('span', {}, [
              h('el-popover', {
                props: { placement: 'top', trigger: 'hover', content: params.row.mobile }
              }, [
                h('a',
                  { slot: 'reference' }, '查看')
              ])
            ])
          }
        },
        {
          label: '审核状态',
          prop: 'orderStateName',
          width: 120,
          isShowTooltip: true,
          // eslint-disable-next-line no-unused-vars
          formatter: (row, column, cellValue) => {
            if (row.orderState == '0') { //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: #D0021B;border-radius: 50px;margin-right: 5px;"></span>
                        ${'无效'}
                      </div>`
            } else if (row.orderState == '1') { //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(93, 156, 236);border-radius: 50px;margin-right: 5px;"></span>
                        ${'待审核'}
                      </div>`
            } else if (row.orderState == '3') { //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(204, 67, 66);border-radius: 50px;margin-right: 5px;"></span>
                        ${'已驳回'}
                      </div>`
            } else if (row.orderState == '4') { //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(136, 199, 10);border-radius: 50px;margin-right: 5px;"></span>
                        ${'已通过'}
                      </div>`
            } else {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(252, 192, 71);border-radius: 50px;margin-right: 5px;"></span>
                        ${'已作废'}
                      </div>`
            }
          }
        },
        {
          label: '收款状态',
          prop: 'receiptStatusName',
          width: 120,
          isShowTooltip: true,
          // eslint-disable-next-line no-unused-vars
          formatter: (row, column, cellValue) => {
            if (row.orderState === '5') { // 为保证之前的数据显示已作废，这里前后端逻辑保持一致
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                          <span style="display: inline-block;width:8px;height:8px;background-color: rgb(252, 192, 71);border-radius: 50px;margin-right: 5px;"></span>
                          ${'已作废'}
                        </div>`
            } else {
              if (row.receiptStatus == '0') { //eslint-disable-line
                return `<div style="text-overflow:ellipsis;overflow:hidden">
                          <span style="display: inline-block;width:8px;height:8px;background-color: rgb(255, 127, 117);border-radius: 50px;margin-right: 5px;"></span>
                          ${'待收款'}
                        </div>`
              } else if (row.receiptStatus == '1') { //eslint-disable-line
                return `<div style="text-overflow:ellipsis;overflow:hidden">
                          <span style="display: inline-block;width:8px;height:8px;background-color: rgb(136, 199, 10);border-radius: 50px;margin-right: 5px;"></span>
                          ${'收款完成'}
                        </div>`
              } else if (row.receiptStatus === '2') {
                return `<div style="text-overflow:ellipsis;overflow:hidden">
                          <span style="display: inline-block;width:8px;height:8px;background-color: rgb(255, 127, 117);border-radius: 50px;margin-right: 5px;"></span>
                          ${'部分收款'}
                        </div>`
              } else if (row.receiptStatus === '3') {
                return `<div style="text-overflow:ellipsis;overflow:hidden">
                            <span style="display: inline-block;width:8px;height:8px;background-color: rgb(252, 192, 71);border-radius: 50px;margin-right: 5px;"></span>
                            ${'已作废'}
                          </div>`
              }
            }
          }
        },
        {
          label: '合同期限',
          prop: 'startEndTime',
          hasSort: 'custom',
          width: 120,
          isShowTooltip: true
        },
        {
          label: '过期作废',
          prop: 'expireInvalid',
          hasSort: 'custom',
          width: 120,
          isShowTooltip: true,
          // eslint-disable-next-line no-unused-vars
          formatter: (row, column, cellValue) => {
            if (row.expireInvalid == '0') { //eslint-disable-line
              return `<div>${'否'}</div>`
            }
            if (row.expireInvalid == '1') { //eslint-disable-line
              return `<div>${'是'}</div>`
            }
          }
        },
        {
          label: '合同金额',
          prop: 'orderMoney',
          hasSort: 'custom',
          align: 'right',
          width: 120,
          isShowTooltip: true
        },
        {
          label: '已收金额',
          prop: 'payMoney',
          align: 'right',
          width: 120,
          isShowTooltip: true
        },
        {
          label: '常规课时',
          prop: 'period',
          align: 'right',
          hasSort: 'custom',
          isShowTooltip: true,
          width: 150
        },
        {
          label: '赠送课时',
          prop: 'extPeriod',
          align: 'right',
          hasSort: 'custom',
          width: 120,
          isShowTooltip: true
        },
        {
          label: '付清时间',
          prop: 'payOffTime',
          hasSort: 'custom',
          width: 120,
          align: 'right',
          isShowTooltip: true
        },
        {
          label: '合同来源',
          prop: 'sourceName',
          width: 120,
          hasSort: 'custom',
          isShowTooltip: true
        },
        {
          label: '审核人',
          prop: 'checkUserName',
          width: 120,
          isShowTooltip: true
        },
        {
          label: '签订日期',
          prop: 'signTime',
          hasSort: 'custom',
          width: 120,
          isShowTooltip: true
        },
        {
          label: '关联销售',
          prop: 'sellerName',
          width: 120,
          isShowTooltip: true
        },
        {
          label: '创建人',
          prop: 'orderCreatePerson',
          width: 120,
          isShowTooltip: true
        },
        {
          label: '创建时间',
          prop: 'orderCreateTime',
          hasSort: 'custom',
          width: 120,
          isShowTooltip: true
        },
        {
          label: '备注',
          prop: 'orderRemark',
          isShowTooltip: true,
          width: '160px'
        }
      ],
      options: {
        noMount: true,
        apiService: queryOrder, // 表格的数据请求接口
        isSettingShow: true, // 是否出现设置
        mutiSelect: true // 多选框
      },
      tableHeight: 'calc(100vh - 264px)',
      operates: {
        width: '140',
        fixed: 'right',
        list: [
          {
            label: '审核',
            type: 'normal',
            btnId: '406000006',
            prop: 'orderState',
            disabled: '1',
            method: (row) => {
              this.checkContractDialog(row)
            }
          },
          {
            label: '收款',
            type: 'normal',
            btnId: '406000007',
            prop: 'receiptStatusOne',
            disabled: '1',
            method: (row) => {
              this.gatheringDialog(row)
            }
          }
        ]
      },
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'select',
            placeholder: '审核状态',
            modelValue: 'orderState',
            isClearable: true,
            itemStyle: 'width: 140px',
            selectOption: [
              {
                label: '无效',
                value: '0'
              },
              {
                label: '待审核',
                value: '1'
              },
              {
                label: '已作废',
                value: '5'
              },
              {
                label: '已驳回',
                value: '3'
              },
              {
                label: '已通过',
                value: '4'
              }
            ]
          }, {
            itemType: 'input',
            placeholder: '学员姓名/家长手机号',
            modelValue: 'stuNameOrMobile',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:160px'
          }
        ]
      },
      superSearch: {
        onClear: () => { this.onClear() },
        onSearch: (superValue) => { this.onSearch(superValue) },
        fields: [
          {
            type: 'input',
            key: 'stuCardId',
            label: '会员卡号'
          }, {
            type: 'input',
            key: 'orderNum',
            label: '合同编号'
          }, {
            type: 'select',
            key: 'purchaseType',
            label: '合同类型',
            optionValue: 'id',
            optionLabel: 'name',
            options: [
              { id: '1', name: '正式合同' }, // 1代表的是正式合同和赠送合同相加，2代表赠送合同，3代表正式合同
              { id: '2', name: '赠送合同' }
            ]
          }, {
            type: 'select',
            key: 'signType',
            label: '签约类型',
            optionValue: 'id',
            optionLabel: 'name',
            options: [
              { id: '0', name: '新签约' },
              { id: '1', name: '续约' },
              { id: '2', name: '新签-转介绍' }
            ]
          }, {
            type: 'select',
            key: 'type',
            label: '购买类型',
            optionValue: 'id',
            optionLabel: 'name',
            options: [
              { id: '2', name: '课时套餐' },
              { id: '3', name: '托班套餐' }
            ]
          }, {
            type: 'input',
            key: 'parentName',
            label: '签约家长'
          }, {
            type: 'select',
            key: 'orderState',
            label: '审核状态',
            optionValue: 'id',
            optionLabel: 'name',
            options: [
              { id: '1', name: '待审核' },
              { id: '3', name: '已驳回' },
              { id: '4', name: '已通过' },
              { id: '5', name: '已作废' }
            ]
          }, {
            type: 'select',
            key: 'receiptStatus',
            label: '收款状态',
            optionValue: 'id',
            optionLabel: 'name',
            options: [
              { id: '0', name: '待收款' },
              { id: '1', name: '收款完成' },
              { id: '2', name: '部分收款' },
              { id: '3', name: '已作废' }
            ]
          },
          {
            type: 'input',
            key: 'sellerName',
            label: '关联销售'
          },
          {
            type: 'datePicker',
            key: 'firstDate',
            dateType: 'daterange',
            label: '付清日期',
            name: ['startPayOffTime', 'endPayOffTime']
          }, {
            type: 'datePicker',
            key: 'signDate',
            dateType: 'daterange',
            label: '签订日期',
            name: ['startTime', 'endTime']
          }, {
            type: 'datePicker',
            key: 'secondData',
            dateType: 'daterange',
            label: '到期日期',
            name: ['estartTime', 'eendTime']
          },
          {
            type: 'datePicker',
            key: 'startData',
            dateType: 'daterange',
            label: '开始日期',
            name: ['sstartTime', 'sendTime']
          },
          {
            type: 'select',
            key: 'expireInvalid',
            label: '过期作废',
            optionValue: 'id',
            optionLabel: 'name',
            options: [
              { id: '0', name: '否' },
              { id: '1', name: '是' }
            ]
          }, {
            type: 'datePicker',
            key: 'createTime',
            dateType: 'daterange',
            label: '创建时间',
            name: ['cstartTime', 'cendTime']
          }, {
            type: 'input',
            key: 'createPersonName',
            label: '创建人'
          }
        ]
      },
      tableExportStu: '', // 获取合同是否可以导出
      userBranchOptions: [],
      userBranchSelected: '0',
      operatorType: '0', // 操作类型, 0.全部,1.我的, 2.我的下属
      operatorUser: '', // 查询用户
      checkedData: '', // 多选数据
      checkedRowlist: [] // 选择数据条数
    }
  },
  computed: {
    ...mapState('home', [
      'contractExpire'])
  },
  mounted() {
    // 查询下属
    this.querySubUser()
    const params = {}
    // 根据路由参数进行默认查询
    const route = this.$router.history.current.params
    if (route.activeTab === 'contractOrder') {
      const action = route && route.action
      // params: { queryType: 'lessen' }
      // this.$refs.CommonSearch.formValue.orderState = '4'
      if (route.action === 'start') {
        console.log('-------')
        const params = {
          pageIndex: 0,
          pageSize: 10,
          queryType: 'start'
        }
        this.searchHandle(params)
      }
      if (route.action === 'willExpire') {
        const startTime = moment().add(0, 'days').format('YYYY-MM-DD')
        let endTime = startTime
        if (this.contractExpire <= 1) {
          endTime = moment().add(0, 'days').format('YYYY-MM-DD')
        } else {
          endTime = moment().add(this.contractExpire, 'days').format('YYYY-MM-DD')
        }
        this.options.params = { queryType: 'lessen' }
        this.$refs.superSearch.ruleForm.secondData = [startTime, endTime]
        this.$refs.superSearch.ruleForm.orderState = '4'
        this.$refs.CommonSearch.formValue.orderState = '4'
        params.pageIndex = 0
        params.pageSize = 10

        const params1 = {
          ...this.$refs.CommonSearch.formValue,
          ...params
        }
        //    pageSize: 10, // 当前页的页数
        // pageIndex: 1, // 当前页
        this.searchHandle(params1)
      }
      // 待审核
      if (action === 'waitCheck') {
        this.$refs.superSearch.ruleForm.orderState = '1'
        this.$refs.CommonSearch.formValue.orderState = '1'
      }
      // 打开新建窗口
      if (action === 'addContract' && this.hasBtn('406000001')) {
        this.contractOrderDialog()
      }
      // this.onSearch(this.superValue)
    }
    // 时间范围内的合同数
    const routerDateType = route && route.routerDateType
    if (routerDateType === 'today') {
      this.$refs.superSearch.ruleForm.createTime = [this.$moment().format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')]
    } else if (routerDateType === 'thisWeek') {
      const weekOfday = this.$moment().format('d') // 计算今天是这周第几天
      const monday = this.$moment()
        .subtract(weekOfday - 1, 'days')
        .format('YYYY-MM-DD')
      const sunday = this.$moment()
        .add(7 - weekOfday, 'days')
        .format('YYYY-MM-DD') // 周日日期
      this.$refs.superSearch.ruleForm.createTime = [monday, sunday]
    } else if (routerDateType === 'thisMonth') {
      // 返回本月
      const start = this.$moment()
        .month(this.$moment().month())
        .startOf('month')
        .format('YYYY-MM-DD')
      const end = this.$moment()
        .month(this.$moment().month())
        .endOf('month')
        .format('YYYY-MM-DD')
      this.$refs.superSearch.ruleForm.createTime = [start, end]
    }
    this.$refs.superSearch.submitForm()

    // 查询列表
    // this.searchHandle()
  },

  methods: {
    /* 选择多条数据数据操作 */
    selectionChange(val) {
      this.checkedData = val.length
      this.checkedRowlist = val
    },

    // 批量审核操作
    batchCheck(checkedRowlist) {
      const orderIdList = [] // 批量审核id集合
      checkedRowlist.map(item => {
        orderIdList.push(item.orderNumber)
      })
      const params = {
        orderId: orderIdList.toString()
      }
      const orderStateOne = checkedRowlist.every(item => { // 待审核
        return item.orderState === '1'
      })

      const orderStateThree = checkedRowlist.some(item => { // 已驳回
        return item.orderState === '3'
      })

      const orderStateFour = checkedRowlist.some(item => { // 已审核
        return item.orderState === '4'
      })

      const orderStateFive = checkedRowlist.some(item => { // 已作废
        return item.orderState === '5'
      })

      if (orderStateOne === true) { // 待审核
        this.batchPassOrderFun(params)
      } else if (orderStateThree === true) { // 已驳回
        this.$message.error('存在 已驳回 合同')
      } else if (orderStateFive === true) { // 已作废
        this.$message.error('存在 已作废 合同')
      } else if (orderStateFour === true) { // 已审核
        this.$message.error('存在 已通过 合同')
      }
    },

    // 批量审核合同接口
    batchPassOrderFun(params) {
      batchPassOrder(params).then(res => { // 接口数据传递
        if (res.data.errorCode === 0) {
          this.$message.success('审核成功')
          this.$refs.tableCommon.getList() // 刷新页面，仍在当前页面
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    // 批量作废操作
    batchCancell(checkedRowlist) {
      const purchaseIdList = [] // 批量作废id集合
      checkedRowlist.map(item => {
        purchaseIdList.push(item.orderNumber)
      })
      const params = {
        purchaseId: purchaseIdList.toString()
      }

      const orderStateOne = checkedRowlist.some(item => { // 待审核
        return item.orderState === '1'
      })

      const orderStateThree = checkedRowlist.some(item => { // 已驳回
        return item.orderState === '3'
      })

      const orderStateFour = checkedRowlist.every(item => { // 已审核
        return item.orderState === '4'
      })

      const orderStateFive = checkedRowlist.some(item => { // 已作废
        return item.orderState === '5'
      })

      if (orderStateOne === true) { // 待审核
        this.$message.error('存在 待审核 合同')
      } else if (orderStateThree === true) { // 已驳回
        this.$message.error('存在 已驳回 合同')
      } else if (orderStateFive === true) { // 已作废
        this.$message.error('存在 已作废 合同')
      } else if (orderStateFour === true) { // 已审核
        this.batchInvalidOrderFun(params)
      }
    },

    // 批量作废合同接口
    batchInvalidOrderFun(params) {
      batchInvalidOrder(params).then(res => {
        if (res.data.errorCode === 0) {
          this.$refs.tableCommon.getList() // 刷新页面
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    /* 合同列表 */
    // eslint-disable-next-line no-unused-vars
    queryOrderFun(params) {
      // // 我的下属数据
      // queryOrderFun().then(res => {
      //   if (res.data.errorCode === 0) {
      //     this.options.apiService = queryOrder
      //     // 获取合同是否可以导出
      //     this.tableExportStu = this.$refs.tableCommon.tableAllData.exportSta
      //     this.$refs.tableCommon.getList({ ...params, pageIndex: 0 })
      //   } else {
      //     this.$message.error(res.data.errorMessage)
      //   }
      // })
    },
    /** 查询下属 */
    querySubUser() {
      const userBranchOptions = [{ id: '0', type: '0', name: '全部', children: [] }, { id: '1', type: 1, name: '我的', children: [] }]
      const children = []
      const self = this
      querySubName().then(res => {
        if (res.data.errorCode === 0) {
          const results = res.data.data
          if (results && results.length > 0) {
            results.map((item) => {
              children.push({
                pid: '2',
                id: item.id,
                name: item.name,
                type: 2
              })
            })
            userBranchOptions.push({ id: '2', type: 2, name: '我的下属', children: children })
            self.userBranchOptions = userBranchOptions
          }
        }
      })
      this.userBranchSelected = '0'
      this.userBranchOptions = userBranchOptions
    },
    /* 刷新合同列表 */
    getContractList(isInit) {
      if (isInit) { // 有的话就编辑后展示到第一页
        const params = {
          pageIndex: 0
        }
        this.$refs.tableCommon.getList(params)
      } else { // 反之没有就展示到当前页
        this.$refs.tableCommon.getList()
        setTimeout(() => {
          const numAll = this.$refs.tableCommon.$el.children[0].children[2].textContent
          if (numAll === ' 暂无数据') {
            this.$refs.tableCommon.getList()
          }
        }, 500)
      }

      this.$refs.contractSideDialog.sideDialogShow = false
    },
    /* 打开合同订单侧边弹框 */
    openSideDialog(row) {
      this.$refs.contractSideDialog.showSideDialog(row)
    },
    /* 合同批量导入弹框 */
    importContractDialog() {
      this.$refs.importContractDialog.showDialog()
    },

    /* 合同导出 */
    exportContract() {
      // 用户权限选择
      const userBranchParams = {}
      if (this.userBranchSelected === '0' || this.userBranchSelected === '1') { // 全部、我的
        userBranchParams.operatorType = this.userBranchSelected
      } else if (parseFloat(this.userBranchSelected) > 1) { // 我的下属
        userBranchParams.operatorType = '2'
        if (this.userBranchSelected !== '2') { // 选择的下属
          userBranchParams.uids = this.userBranchSelected
        }
      }

      const route = this.$router.history.current.params
      const url = `${window.SS_CRM_EXPORT}/crm/contract/exportOrder`
      let params
      if (route.action === 'willExpire') {
        params = {
          ...this.superValue,
          ...this.formValue,
          condition: 'all',
          queryType: 'lessen',
          ...userBranchParams
        }
      } else {
        params = {
          ...this.superValue,
          ...this.formValue,
          condition: 'all',
          ...userBranchParams
        }
      }
      for (const key in params) {
        if (!params[key]) {
          delete params[key]
        }
      }
      if (this.$refs.tableCommon.totalCount > 0) {
        exportFile(url, params)
      } else {
        this.$message.error('暂无数据导出')
      }
    },

    /* 合同订单弹框 */
    contractOrderDialog() {
      this.$refs.contractOrderDialog.showDialog('add')
    },
    /* 编辑合同订单弹框 */
    editContractOrderDialog(rowEidt, isGathering) {
      this.$refs.contractOrderDialog.showDialog(rowEidt, undefined, '1', isGathering)
    },

    /* 编辑赠送合同订单弹框 */
    editContractOrderGiveDialog(rowEidt) {
      this.$refs.contractOrderDialog.showDialog(rowEidt)
    },
    /* 审核合同弹框 */
    checkContractDialog(row) {
      this.$refs.checkContractDialog.showDialog(row)
    },
    /* 收款弹框 */
    gatheringDialog(row) {
      if (row.orderState == '5') { //eslint-disable-line
        this.$message.error('该合同已作废')
      } else {
        this.$refs.gatheringDialog.showDialog(row)
      }
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 用户权限选择
      const userBranchParams = {}
      if (this.userBranchSelected === '0' || this.userBranchSelected === '1') { // 全部、我的
        userBranchParams.operatorType = this.userBranchSelected
      } else if (parseFloat(this.userBranchSelected) > 1) { // 我的下属
        userBranchParams.operatorType = '2'
        if (this.userBranchSelected !== '2') { // 选择的下属
          userBranchParams.orderSellerPerson = this.userBranchSelected
        }
      }
      // const route = this.$router.history.current.params
      // console.log('routerouterouteroute', route)
      // if (route.activeTab === 'contractOrder') {
      //   userBranchParams.operatorType = '2'
      // }
      // 搜索的入参
      this.formValue = formValue
      const params = {
        ...this.formValue,
        ...this.superValue,
        // orderNum: this.formInline.orderNum,
        // stuNameOrMobile: this.formInline.stuNameOrMobile
        ...userBranchParams
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    // eslint-disable-next-line no-unused-vars
    resetFieldHanle(formName) {
      // 重置的入参
      this.userBranchSelected = '0'
      this.searchHandle({})
    },
    /** 高级搜索 */
    onSearch(superValue) {
      // 用户权限选择
      const userBranchParams = {}
      if (this.userBranchSelected === '0' || this.userBranchSelected === '1') { // 全部、我的
        userBranchParams.operatorType = this.userBranchSelected
      } else if (parseFloat(this.userBranchSelected) > 1) { // 我的下属
        userBranchParams.operatorType = '2'
        if (this.userBranchSelected !== '2') { // 选择的下属
          userBranchParams.orderSellerPerson = this.userBranchSelected
        }
      }

      this.superValue = superValue
      const params = {
        ...this.superValue,
        ...this.formValue,
        ...userBranchParams
        // stuCardId: superValue.stuCardId, // 会员卡号
        // signType: superValue.signType, // 签约类型
        // type: superValue.type, // 购买类型
        // parentName: superValue.parentName, // 签约家长
        // orderState: superValue.orderState, // 审核状态
        // receiptStatus: superValue.receiptStatus, // 收款状态
        // sellerName: superValue.sellerName, // 销售姓名
        // startTime: superValue.firstDate && superValue.firstDate[0], // 签约日期开始
        // endTime: superValue.firstDate && superValue.firstDate[1], // 签约日期结束
        // estartTime: superValue.secondData && superValue.secondData[0], // 到期日期开始
        // eendTime: superValue.secondData && superValue.secondData[1], // 到期日期结束
        // expireInvalid: superValue.expireInvalid, // 过期是否作废
        // cstartTime: superValue.createTime && superValue.createTime[0], // 创建时间开始
        // cendTime: superValue.createTime && superValue.createTime[1], // 创建时间结束
        // createPersonName: superValue.createPersonName // 创建人
      }
      this.$refs.tableCommon.getList(params)
    },
    /** 高级清除 */
    onClear() {
      this.onSearch({})
    }
  }
}
</script>

<style lang="scss" scoped>
.contractOrder_container {
  min-width: 1060px;
  .search {
    display: flex;
    justify-content: space-between;
    height: 48px;
  }
}
.subUserSelect {
  vertical-align: top;
  float: left;
  margin-right: 10px;
}
</style>
<style lang="scss">
.contractOrder_container {
  .orderNum {
    color: #1d9df2;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
    &:hover {
      color: #56c0f5;
    }
  }
  .checked_data {
    margin-bottom: 16px;
    .checked_text {
      margin-right: 5px;
    }
    i {
      font-style: normal;
      color: #46b6ee;
      padding: 0 5px;
    }
  }
}
</style>
