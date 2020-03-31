<template>
  <div class="cancelClass_container">
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
          v-log="{compName:'跟进记录',eventName:'web-【学员CRM】-手动消课记录-导出'}"
          class="cancel_btn"
          size="mini"
          style="float:right"
          @click="exportCancelClass"
        >导出</el-button>
      </div>
    </div>
    <div class="operation">
      <span style="margin-right:10px">已选 <span style="color:#46B6EE">{{ checkNum || '0' }}</span> 条数据</span>
      <Confirm
        :text="'撤销'"
        :placement="'top'"
        :content="'确定要撤销吗?'"
        :confirm="()=>{deleteSureFunc()}"
        :is-button="true"
        :btn-class="'cancel_btn edit_btn'"
        :is-visible-fun="true"
        :select-data="checkNum"
      />
    </div>
    <!-- 表格 -->
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      table-key="crm_account_cancelClass"
      @handleSelectionChange="selectionChange"
    />
  </div>
</template>

<script>
import { queryRepealCourseInfo, queryRepealCourseRevoke } from '@/api/crm/stuAccount/stuAccount.js'
import CommonTable from '../../../components/CommonTable/CommonTable'
import CommonSearch from '../../../components/CommonSearch/CommonSearch'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import { exportFile } from '@/utils/exportFile'
import Confirm from '@/components/MiniCommon/Confirm'
export default {
  components: {
    CommonTable,
    CommonSearch,
    AdvancedSearch,
    Confirm
  },
  data() {
    return {
      delVisible: false, // 是否删除的气泡
      checkNum: 0, // 选中的数据条数
      checkList: [], // 选中的列表
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '学员账户号',
          prop: 'cardId',
          isShowTooltip: true,
          isShowSet: false
        },
        {
          label: '适用学员',
          prop: 'applicableStu',
          isShowTooltip: true,
          render: (h, params) => {
            return h('span', {}, [
              h(
                'span',
                params.row.applicableStu.map((item, index) => {
                  return h('span', item.stuName)
                })
              )
            ])
          }
        },
        {
          label: '适用家长',
          prop: 'applicableParent',
          isShowTooltip: true,
          width: '155',
          render: (h, params) => {
            return h('span', {}, [
              h(
                'span',
                params.row.applicableParent.length > 1
                  ? [
                    h('span', params.row.applicableParent[0].name + ' '),
                    h('el-popover', {
                      props: { placement: 'top', trigger: 'hover' }
                    },
                    [
                      h('div',
                        params.row.applicableParent.map(item => {
                          return h('span', { class: 'manyParent' }, item.name + '  ')
                        })
                      ),
                      h('a',
                        { slot: 'reference' }, '共' + params.row.applicableParent.length + '人')
                    ])
                  ]
                  : params.row.applicableParent.map((item, index) => {
                    return h('span', item.name)
                  })
              )
            ])
          }
        },
        {
          label: '手机号',
          prop: 'content_short',
          isShowTooltip: true,
          render: (h, params) => {
            return h('span', {}, [
              h(
                'el-popover',
                {
                  props: { placement: 'top', width: 'auto', trigger: 'hover' }
                },
                [
                  h('div',
                    params.row.applicableParent.map(item => {
                      return h('span', item.name + ':' + item.mobile + ' ')
                    })
                  ),
                  h('a', { slot: 'reference' }, '查看')
                ]
              )
            ])
          }
        },
        {
          label: '消课课程',
          prop: 'courseName',
          isShowTooltip: true
        },
        {
          label: '消课数量',
          prop: 'courseNum',
          hasSort: 'custom',
          isShowTooltip: true,
          width: 120
        },
        {
          label: '消课日期',
          prop: 'createTime',
          hasSort: 'custom',
          isShowTooltip: true,
          width: 120
        },
        {
          label: '消课原因',
          prop: 'reason',
          isShowTooltip: true
        },
        {
          label: '创建人',
          prop: 'userName',
          isShowTooltip: true
        },
        {
          label: '状态',
          prop: 'status',
          width: '130px;',
          isShowTooltip: true,
          isShowSet: true,
          formatter: (row) => {
            if (row.status === '已撤销') {
              return `<div style="display:flex">
                      <div style="margin-right:5px;margin-top:8px;width:8px;height:8px;background:rgba(208,2,27,1);border-radius:50px"></div>
                      <span>已撤销</span>
                    </div>`
            } else if (row.status === '正常') {
              return `<div style="display:flex">
                      <div style="margin-top:8px;margin-right:5px;width:8px;height:8px;background:rgba(135,208,104,1);border-radius:50px"></div>
                      <span>正常</span>
                    </div>`
            }
          }
        }
        // {
        //   label: '所属校区',
        //   prop: 'orgName',
        //   isShowTooltip: true,
        //   width: '130px;'
        // }
      ],
      options: {
        mutiSelect: true, // 是否多选
        apiService: queryRepealCourseInfo, // 表格的数据请求接口
        isSettingShow: true, // 是否出现设置
        selectableFunc: this.selectionChanges
      },
      tableHeight: 'calc(100vh - 227px)',
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '学员姓名/家长电话',
            modelValue: 'nameOrMobile',
            isClearable: true
          },
          {
            itemType: 'input',
            placeholder: '请输入学员账户号',
            modelValue: 'cardId',
            isClearable: true
          }, {
            itemType: 'input',
            placeholder: '创建人',
            modelValue: 'userName',
            isClearable: true,
            itemStyle: 'width:140px'
          }
        ]
      },
      superSearch: {
        onClear: () => { this.onClear() },
        onSearch: (superValue) => { this.onSearch(superValue) },
        fields: [
          {
            type: 'input',
            key: 'parentName',
            label: '家长姓名'
          },
          {
            type: 'select',
            key: 'status',
            label: '状态',
            optionValue: 'id',
            optionLabel: 'name',
            options: [
              { id: '1', name: '正常' },
              { id: '2', name: '已撤销' }
            ]
          },
          {
            type: 'datePicker',
            key: 'createTime',
            label: '消课日期',
            dateType: 'daterange',
            name: ['startTime', 'endTime']
          }
        ]
      },
      formValue: {},
      superValue: {}
    }
  },
  methods: {
    // 导出
    exportCancelClass() {
      const url = `${window.SS_CRM_EXPORT}/crm/student/RepealCourseInfoExport`
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

    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      const params = {
        ...this.formValue,
        ...this.superValue,
        pageIndex: 0
      }
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
      this.$refs.tableCommon.getList(params)
    },
    /** 高级搜索 */
    onSearch(superValue) {
      this.superValue = superValue
      const params = {
        ...this.superValue,
        ...this.formValue,
        pageIndex: 0
      }
      console.log(params)
      this.$refs.tableCommon.getList(params)
    },
    /** 高级清除 */
    onClear() {
      const params = {
        pageIndex: 0,
        ...this.formValue
      }
      this.superValue = {}
      this.$refs.tableCommon.getList(params)
    },
    /* 多选 */
    selectionChange(val) {
      this.checkNum = val.length
      this.checkList = val
    },
    /* 是否撤销 */
    deleteSureFunc() {
      this.delVisible = false
      let workIds = ''
      const workIdArr = []
      this.checkList.map(item => {
        workIdArr.push(item.id)
      })
      workIds = workIdArr && workIdArr.join(',')
      // console.log(workIdArr)
      const params = {
        crcIds: workIds
      }
      queryRepealCourseRevoke(params).then(res => {
        const data = res.data
        console.log(data)
        if (data.errorCode === 0) {
          this.$message.success(data.errorMessage)
          this.$refs.tableCommon.getList()
        } else {
          this.$message.error(data.errorMessage || '撤销失败')
        }
      })
    },
    selectionChanges(row) {
      if (row.status === '已撤销') {
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  justify-content: space-between;
  height: 48px;
}
  .operation {
    margin: 0px 0 16px;
  }
</style>
