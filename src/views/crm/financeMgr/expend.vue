/**
 * 支出管理
 */
<template>
  <div class="earnestMgr_container">
    <div class="expend_box">
      <div class="expendMoney">
        <p>支出总计：
          <span>{{ countAmount }}</span>
          <span>元</span>

        </p>
      </div>
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

        <!-- 表头右侧按钮 -->
        <div>
          <!-- 选择导入导出数据 -->
          <el-select
            slot="prepend"
            v-model="channelSelect"
            placeholder="更多操作"
            style="width: 100px;"
          >
            <el-option
              label="导出数据"
              value="1"
            >
              <el-button
                v-if="hasBtn('407000012')"
                type="text"
                @click="exportContent"
              >导出数据</el-button>
            </el-option>
            <el-option
              label="导入数据"
              value="2"
            >
              <el-button
                v-if="hasBtn('407000013')"
                type="text"
                @click="expendImportDialog()"
              >导入数据</el-button>
            </el-option>
          </el-select>

          <!-- 添加支出按钮 -->
          <el-button
            v-if="hasBtn('407000009')"
            class="green_btn"
            @click="addExpendDialogFun()"
          >添加支出</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <CommonTable
        ref="tableCommon"
        :columns="columns"
        :table-height="tableHeight"
        :pagination="listQuery"
        :options="options"
        :operation="operates"
        table-key="crm_finance_earnest"
      />
      <!-- 添加支出弹窗 -->
      <addExpendDialog
        ref="addExpendDialog"
        :project-list="projectList"
        @toParentEarnest="toUpdateList"
        @updataPayProject="updataPayProjectList"
      />

      <!-- 名单批量导入弹框 -->
      <expendImportDialog
        ref="expendImportDialog"
        :refresh="refresh"
        @toParentEarnest="toUpdateList"
      />
    </div>
  </div>
</template>

<script>
import {
  expendQuery, // 支出列表查询
  queryProject, // 支出项目列表查询
  expendDelete // 删除支出记录操作
} from '@/api/crm/financeMgr/expend.js'

import CommonTable from './../../../components/CommonTable/CommonTable' // 表格
import CommonSearch from './../../../components/CommonSearch/CommonSearch' // 搜索栏
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch' // 高级搜索
import addExpendDialog from './components/addExpendDialog.vue' // 添加支出弹窗
import expendImportDialog from './components/expendImportDialog.vue' // 导入步骤样式

import { exportFile } from '@/utils/exportFile'
export default {
  components: {
    CommonTable,
    CommonSearch,
    AdvancedSearch,
    expendImportDialog, // 名单批量导入弹框
    addExpendDialog // 新建订金弹框组件
  },
  data() {
    return {
      channelSelect: '',
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '录入时间',
          prop: 'createTime',
          isShowTooltip: true
        },
        {
          label: '支出时间',
          prop: 'spendTime',
          isShowTooltip: true
        },
        {
          label: '支出类别',
          prop: 'projectName',
          isShowTooltip: true
        },
        {
          label: '支出项目',
          prop: 'projectItemName',
          isShowTooltip: true
        },
        {
          label: '支出金额',
          prop: 'amount',
          isShowTooltip: true
        },
        {
          label: '支付方式',
          prop: 'payWayName',
          isShowTooltip: true
        },
        {
          label: '收款人（企业）',
          prop: 'agentName',
          isShowTooltip: true,
          width: '130px;'
        },
        {
          label: '经办人',
          prop: 'collectName',
          isShowTooltip: true
        },
        {
          label: '有无发票',
          prop: 'isInvoice',
          isShowTooltip: true,
          render: (h, params) => {
            if (params.row.isInvoice === '1') {
              return h(
                'div',
                [
                  h(
                    'div',
                    {
                      style: 'float:left;',
                      class: 'isInvoice'
                    },
                    '有'
                  )
                ]
              )
            } else {
              return h(
                'div',
                [
                  h(
                    'div',
                    {
                      style: 'float:left;',
                      class: 'isInvoice'
                    },
                    '无'
                  )
                ]
              )
            }
          }
        },
        {
          label: '操作账号',
          prop: 'operatorName',
          isShowTooltip: true
        },
        {
          label: '支出来源',
          prop: 'isInvoice',
          isShowTooltip: true,
          render: (h, params) => {
            if (params.row.source === '1') {
              return h(
                'div',
                [
                  h(
                    'div',
                    {
                      style: 'float:left;',
                      class: 'isInvoice'
                    },
                    '总部来源'
                  )
                ]
              )
            } else if (params.row.source === '2') {
              return h(
                'div',
                [
                  h(
                    'div',
                    {
                      style: 'float:left;',
                      class: 'isInvoice'
                    },
                    '校区来源'
                  )
                ]
              )
            } else {
              return h(
                'div',
                [
                  h(
                    'div',
                    {
                      style: 'float:left;',
                      class: 'isInvoice'
                    },
                    ' '
                  )
                ]
              )
            }
          }
        },
        {
          label: '备注',
          prop: 'remark',
          isShowTooltip: true
        }
        // {
        //   label: '所属校区',
        //   prop: 'orgName',
        //   isShowTooltip: true
        // }
      ],
      options: {
        apiService: expendQuery, // 表格的数据请求接口
        isSettingShow: true, // 是否出现设置
        index: 'true'
      },
      tableHeight: 'calc(100vh - 284px)',
      operates: {
        width: '160',
        fixed: 'right',
        list: [
          {
            class: 'styleeditor',
            label: '编辑',
            type: 'normal',
            prop: 'source',
            disabled: '2',
            btnId: '407000010',
            method: (row) => {
              if (row.source === '2' || row.source === null) {
                this.editorExpendFun(row)
              } else if (row.source === '1') {
                this.$message.error('总部来源数据，不能编辑')
              }
            }
            // popoverCon: [
            //   {
            //     contentText: '确定要退款吗？'
            //   }
            // ]
          },
          {
            label: '删除',
            type: 'normal',
            prop: 'source',
            disabled: '2',
            btnId: '407000011',
            method: (row) => {
              if (row.source === '2' || row.source === null) {
                this.deleteHandle(row)
              } else if (row.source === '1') {
                this.$message.error('总部来源数据，不能编辑')
              }
            },
            popoverCon: [
              {
                contentText: '删除支出项后将无法恢复，确定要删除吗？'
              }
            ]
          }
        ]
      },
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'datePicker',
            datePickerType: 'daterange',
            valueFormat: 'yyyy-MM-dd',
            modelValue: 'createTime',
            startPlaceholder: '录入时间',
            rangeSeparator: ' ',
            endPlaceholder: '',
            itemStyle: 'width:230px',
            isClearable: true,
            default: true,
            toChange: this.timeChange
          }, {
            itemType: 'datePicker',
            datePickerType: 'daterange',
            startPlaceholder: '支出时间',
            rangeSeparator: ' ',
            endPlaceholder: '',
            valueFormat: 'yyyy-MM-dd',
            modelValue: 'spendTime',
            itemStyle: 'width:230px',
            isClearable: true,
            default: true,
            toChange: this.timeChange
          }, {
            itemType: 'select',
            placeholder: '支出类别',
            modelValue: 'projectId',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [], // 是否从接口中获取
            onSelect: this.onSelect,
            labelKey: 'name',
            valueKey: 'id'
          }, {
            itemType: 'select',
            placeholder: '支出项目',
            modelValue: 'projectItemId',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [], // 是否从接口中获取
            labelKey: 'name',
            valueKey: 'id'
          }
        ]
      },
      superSearch: {
        onClear: () => { this.onClear() },
        onSearch: (superValue) => { this.onSearch(superValue) },
        fields: [
          {
            type: 'select',
            key: 'payWayId',
            label: '支出方式',
            optionValue: 'id',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SS_CRM}/crm/hq/spend/payWay/queryPayWay`
          }, {
            type: 'select',
            key: 'isInvoice',
            label: '有无发票',
            optionValue: 'id',
            optionLabel: 'name',
            options: [{ id: '0', name: '无发票' }, { id: '1', name: '有发票' }]
          }
        ]
      },
      superValue: {},
      formValue: {},
      pageSize: '', // 支出管理返回的煤业数据个数
      resultCount: '', // 支出管理一共有多少数据
      countAmount: '0',
      projectList: [] // 支出项目下拉
    }
  },

  mounted() {
    this.expendQueryFun()
    this.queryProjectFun()
  },
  methods: {
    /** 搜索框支出类别change */
    onSelect(val) {
      this.projectList.forEach(item => {
        if (val + '' === item.id + '') {
          this.formInline.forms[3].selectOption = item.items
        }
      })
    },

    // 赋值给支付项目
    queryProjectFun() {
      queryProject().then(res => {
        if (res.data.errorCode === 0) {
          this.formInline.forms[2].selectOption = res.data.results
          this.projectList = res.data.results
        } else {
          this.$message.error(res.data && res.data.errorMessage || '支付项目获取失败')
        }
      })
    },

    // 传过来之后更新支付项目
    updataPayProjectList() {
      this.$nextTick(() => {
        this.queryProjectFun()
      })
    },
    // 查询列表
    expendQueryFun(params) {
      expendQuery(params).then(res => {
        this.countAmount = res.data.countAmount
        this.pageSize = res.data.data.pageSize
        this.resultCount = res.data.data.resultCount
      })
    },
    /* 导出 */
    exportContent() {
      const url = `${window.SS_CRM_EXPORT}/crm/org/spend/record/export`
      const params = {
        ...this.formValue,
        ...this.superValue
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

    /* 名单导入弹框 */
    expendImportDialog() {
      this.$refs.expendImportDialog.showDialog()
    },

    /* 编辑弹窗操作 */
    editorExpendFun(row) {
      this.$refs.addExpendDialog.showDialog(row)
    },

    /* 删除操作 */
    deleteHandle(row) {
      const params = {
        id: row.id,
        tenantId: row.orgId
      }
      expendDelete(params).then(res => {
        if (res.data.errorCode === 0) {
          this.expendQueryFun() // 总金额进行从新刷新
          this.toUpdateList() // 更新数据
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    /** 导入后刷新列表 */
    refresh() {
      this.searchHandle(this.formValue)
    },
    /* 新建订金弹框 */
    addExpendDialogFun() {
      this.$refs.addExpendDialog.showDialog()
    },
    /* 更新列表数据 */
    toUpdateList(isInit) {
      if (isInit) {
        const params = {
          pageIndex: 0
        }
        this.$refs.tableCommon.getList(params)
      } else {
        this.$refs.tableCommon.getList()
        setTimeout(() => {
          const numAll = this.$refs.tableCommon.$el.children[0].children[2].textContent
          if (numAll === ' 暂无数据') {
            this.$refs.tableCommon.getList()
          }
        }, 500)
      }
      this.expendQueryFun() // 总支出变化
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      if (formValue.createTime) { // 搜索的是录入时间
        this.formValue = {
          createTimeStart: formValue.createTime[0],
          createTimeEnd: formValue.createTime[1]
        }
      } else if (formValue.spendTime) { // 搜索支出时间
        this.formValue = {
          spendTimeStart: formValue.spendTime[0],
          spendTimeEnd: formValue.spendTime[1]
        }
      } else { // 搜索支出项目
        this.formValue = formValue
      }
      const params = {
        ...this.formValue,
        ...this.superValue
      }
      this.expendQueryFun(params) // 总支出变化
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        pageIndex: 0,
        ...this.superValue
      }
      this.formValue = {}
      this.expendQueryFun(params) // 总支出变化
      this.$refs.tableCommon.getList(params)
    },
    /** 高级搜索 */
    onSearch(superValue) {
      this.superValue = superValue
      const params = {
        ...this.superValue,
        ...this.formValue
        // paId: superValue.paName,
        // receiverName: superValue.receiverName
      }
      this.expendQueryFun(params) // 总支出变化
      this.$refs.tableCommon.getList(params)
    },
    /** 高级清除 */
    onClear() {
      const params = {
        pageIndex: 0,
        ...this.formValue
      }
      this.superValue = {}
      this.expendQueryFun(params) // 总支出变化
      this.$refs.tableCommon.getList(params)
    }
  }
}
</script>

<style lang="scss">
.earnestMgr_container {
  height: calc(100vh - 140px);
  overflow: auto;
  .expend_box {
    min-width: 1150px;
  }

  .expendMoney {
    margin-bottom: 12px;
    span:nth-of-type(1) {
      color: black;
      font-size: 22px;
    }
  }
  .search {
    display: flex;
    justify-content: space-between;
    height: 48px;
  }
  .styleeditor {
    margin-right: 10px !important;
  }
}
</style>

