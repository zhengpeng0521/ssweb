<template>
  <section class="turnClass_container">
    <el-tabs :tab-position="tabPosition" v-model="activeName" @tab-click="handleClick(activeName)">
      <el-tab-pane label="单学员转课" name="first">
        <div class="!isShow">
          <div class="search">
            <!-- 搜索栏 -->
            <CommonSearch
              :is-inline="true"
              :params="formInline"
              :forms="formInline"
              @toParent="resetFieldHanle"
            />
            <advanced-search v-bind="superSearch" />
          </div>
          <!-- 表格 -->
          <CommonTable
            ref="tableCommon"
            :columns="columns"
            :table-height="tableHeight"
            :pagination="listQuery"
            :options="options"
            table-key="crm_account_turnClass"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="学员间转课" name="two">
        <div v-if="isShow" class="tabTwo">
          <div class="search">
            <!-- 搜索栏 -->
            <CommonSearch
              :is-inline="true"
              :params="formInlineBetween"
              :forms="formInlineBetween"
              @toParent="resetFieldHanle_"
            />
            <advanced-search v-bind="superSearch_" />
          </div>
          <!-- 表格 -->
          <CommonTable
            ref="tableCommonListBetween"
            :columns="columnsList"
            :table-height="tableHeight_"
            :pagination="listQuery"
            :options="optionsList"
            table-key="crm_account_turnClass_between"
          />
        </div>
      </el-tab-pane>
    </el-tabs>

  </section>
</template>

<script>
import { transferPeriodList, transferStudentCourseList } from '@/api/crm/stuAccount/stuAccount.js'
import CommonTable from '../../../components/CommonTable/CommonTable'
import CommonSearch from '../../../components/CommonSearch/CommonSearch'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
export default {
  components: {
    CommonTable,
    CommonSearch,
    AdvancedSearch
  },
  data() {
    return {
      activeName: 'first',
      isShow: false,
      tabPosition: 'left',
      listQuery: {
        show: true // 是否显示
      },
      columnsList: [
        {
          label: '转出方账户号',
          prop: 'outCardId',
          isShowTooltip: true,
          width: '120px'
        },
        {
          label: '转出方适用学员',
          prop: 'outStuName',
          isShowTooltip: true,
          width: '140px'
        },
        {
          label: '转出合同编号',
          prop: 'outPurchaseId',
          isShowTooltip: true,
          width: '120px'
        },
        {
          label: '转入方账户号',
          prop: 'inCardId',
          isShowTooltip: true,
          width: '120px'
        },
        {
          label: '转入方适用学员',
          prop: 'inStuName',
          isShowTooltip: true,
          width: '140px'
        },
        {
          label: '转入合同编号',
          prop: 'inPurchaseId',
          isShowTooltip: true,
          width: '120px'
        },
        {
          label: '转入课程',
          prop: 'inCourseName',
          isShowTooltip: true,
          width: 160
        },
        {
          label: '转入课时数',
          prop: 'inNum',
          isShowTooltip: true,
          hasSort: 'custom',
          width: '150px'
        },
        {
          label: '转入金额',
          hasSort: 'custom',
          prop: 'money',
          isShowTooltip: true,
          width: 150
        },
        {
          label: '创建人',
          prop: 'creatorName',
          isShowTooltip: true
        },
        {
          label: '创建时间',
          prop: 'createTime',
          hasSort: 'custom',
          isShowTooltip: true,
          width: '160'
        }
      ],
      columns: [
        {
          label: '学员账户号',
          prop: 'cardId',
          isShowTooltip: true,
          isShowSet: false,
          width: '120px'
        },
        {
          label: '适用学员',
          prop: 'stuName',
          isShowTooltip: true
        },
        {
          label: '合同编号',
          prop: 'purchaseId',
          isShowTooltip: true
        },
        {
          label: '转出课程',
          prop: 'outCourseName',
          isShowTooltip: true
        },
        {
          label: '转出数量',
          prop: 'outNum',
          hasSort: 'custom',
          isShowTooltip: true,
          width: 150
        },
        {
          label: '转进课程',
          prop: 'inCourseName',
          isShowTooltip: true
        },
        {
          label: '转进数量',
          prop: 'inNum',
          hasSort: 'custom',
          isShowTooltip: true,
          width: 150
        },
        {
          label: '类型',
          prop: 'type',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.type === '1') {//eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(93, 156, 236);border-radius: 50px;margin-right: 5px;"></span>
                        ${'平价'}
                      </div>`
            }
            if (row.type === '2') {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(136, 199, 10);border-radius: 50px;margin-right: 5px;"></span>
                        ${'补缴'}
                      </div>`
            }
            if (row.type === '3') {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(204, 67, 66);border-radius: 50px;margin-right: 5px;"></span>
                        ${'退费'}
                      </div>`
            }
          }
        },
        {
          label: '变动金额',
          prop: 'changeAmount',
          hasSort: 'custom',
          align: 'right',
          isShowTooltip: true,
          width: 150
        },
        {
          label: '创建人',
          prop: 'creatorName',
          isShowTooltip: true
        },
        {
          label: '创建时间',
          prop: 'createTime',
          hasSort: 'custom',
          isShowTooltip: true,
          width: '160'
        }
        // {
        //   label: '所属校区',
        //   prop: 'orgName',
        //   isShowTooltip: true,
        //   width: '140px;'
        // }
      ],
      options: {
        apiService: transferPeriodList, // 表格的数据请求接口
        isSettingShow: true // 是否出现设置
      },
      optionsList: {
        apiService: transferStudentCourseList, // 表格的数据请求接口
        isSettingShow: true // 是否出现设置
      },
      tableHeight: 'calc(100vh - 227px)',
      tableHeight_: 'calc(100vh - 227px)',
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '学员账户号',
            modelValue: 'cardId',
            isClearable: true,
            itemStyle: 'width:140px'
          }, {
            itemType: 'select',
            placeholder: '请选择状态',
            modelValue: 'type',
            // isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              {
                label: '平价',
                value: '1'
              }, {
                label: '补缴',
                value: '2'
              }, {
                label: '退费',
                value: '3'
              }
            ]
          },
          {
            itemType: 'input',
            placeholder: '适用学员',
            modelValue: 'stuName',
            isClearable: true,
            itemStyle: 'width:140px'
          }
        ]
      },
      formInlineBetween: {
        searchMethod: (formValue) => {
          this.searchHandleBetween(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '转出适用学员',
            modelValue: 'outStuName',
            isClearable: true,
            itemStyle: 'width:140px'
          },
          {
            itemType: 'input',
            placeholder: '转出合同编号',
            modelValue: 'outPurchaseId',
            isClearable: true,
            itemStyle: 'width:140px'
          },
          {
            itemType: 'input',
            placeholder: '转入适用学员',
            modelValue: 'inStuName',
            isClearable: true,
            itemStyle: 'width:140px'
          },
          {
            itemType: 'input',
            placeholder: '转入合同编号',
            modelValue: 'inPurchaseId',
            isClearable: true,
            itemStyle: 'width:140px'
          }

        ]
      },
      superSearch_: {
        onClear: () => { this.onClearList() },
        onSearch: (superValue) => { this.onSearchList(superValue) },
        fields: [
          {
            type: 'input',
            key: 'outCardId',
            label: '转出方账户号'
          },
          {
            type: 'input',
            key: 'inCardId',
            label: '转入方账户号'
          },
          {
            type: 'input',
            key: 'creatorName',
            label: '创建人'
          },
          {
            type: 'datePicker',
            key: 'createTime',
            dateType: 'daterange',
            label: '创建时间',
            name: ['createStartTime', 'createEndTime']
          }
        ]
      },
      superSearch: {
        onClear: () => { this.onClear() },
        onSearch: (superValue) => { this.onSearch(superValue) },
        fields: [
          {
            type: 'input',
            key: 'creatorName',
            label: '创建人'
          }
        ]
      },
      superValue: {},
      formValue: {}
    }
  },
  methods: {
    handleClick(val) {
      if (val === 'two') {
        this.isShow = true
      } else {
        this.isShow = false
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
        // cardId: this.formInline.cardId,
        // type: this.formInline.type,
        // stuName: this.formInline.stuName
      }
      this.$refs.tableCommon.getList(params)
    },
    searchHandleBetween(formValue) {
      this.formValue = formValue
      const params = {
        ...this.formValue,
        ...this.superValue,
        pageIndex: 0
        // cardId: this.formInline.cardId,
        // type: this.formInline.type,
        // stuName: this.formInline.stuName
      }
      // console.log('111111111111111111111', params)
      this.$refs.tableCommonListBetween.getList(params)
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
    resetFieldHanle_(formName) {
      // 重置的入参
      const params = {
        pageIndex: 0,
        ...this.superValue
      }
      this.formValue = {}
      this.$refs.tableCommonListBetween.getList(params)
    },
    /** 高级搜索 */
    onSearch(superValue) {
      this.superValue = superValue
      const params = {
        ...this.superValue,
        ...this.formValue,
        pageIndex: 0
        // creatorName: superValue.creatorName
      }
      this.$refs.tableCommon.getList(params)
    },
    onSearchList(superValue) {
      this.superValue = superValue
      const params = {
        ...this.superValue,
        ...this.formValue,
        pageIndex: 0
        // creatorName: superValue.creatorName
      }
      this.$refs.tableCommonListBetween.getList(params)
    },
    onClearList() {
      const params = {
        pageIndex: 0,
        ...this.formValue
      }
      this.superValue = {}
      this.$refs.tableCommonListBetween.getList(params)
    },
    /** 高级清除 */
    onClear() {
      // 重置的入参
      const params = {
        pageIndex: 0,
        ...this.formValue
      }
      this.superValue = {}
      this.$refs.tableCommon.getList(params)
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  height: 48px;

}
.turnClass_container /deep/{
  height: calc(100vh - 140px)
//   .el-tabs__nav-wrap .is-left{
//   height:calc(100vh-100);
// }
}

</style>
