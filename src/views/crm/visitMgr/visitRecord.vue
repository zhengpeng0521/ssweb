<template>
  <div class="visitRecord_container app-container">
    <div class="page_title_text">
      到访管理
    </div>
    <!-- 搜索栏 -->
    <div class="search">
      <div style="height:48px;">
        <div class="subUserSelect">
          <SubUserSelect
            :options="userBranchOptions"
            v-model="userBranchSelected"
            width="120"
          />
        </div>
        <CommonSearch
          :is-inline="true"
          :params="formInline"
          :forms="formInline"
          @toParent="resetFieldHanle"
        />
        <!-- <advanced-search v-bind="superSearch" /> -->
        <advanced-search
          ref="advanced"
          v-bind="superSearch"
        />
      </div>
      <div class="date_search">
        <CommonDateSearch
          ref="commonDatePicker"
          :common-date-options="commonDateOptions"
          @datePickerChange="commonDatePickerChange"
        />
        <div>
          <el-button
            v-log="{compName:'到访管理',eventName:'web-【学员CRM】-到访管理-新建到访'}"
            v-if="hasBtn('404000001')"
            type="primary"
            size="mini"
            @click="addVisitDialog()"
          >
            新建到访
          </el-button>
        </div>
      </div>
    </div>
    <div class="visit_content">
      <VisitContent ref="visitCon" :source="source"/>
    </div>
    <AddVisitDialog
      ref="addVisitDialog"
      :source ="source"
      :source-type ="sourceType"
      :student-type="studentType"
      @toUpdateTable="getUpdateTable"
    />
  </div>
</template>

<script>
import CommonSearch from '../../../components/CommonSearch/CommonSearch'
import CommonDateSearch from '../../../components/CommonDateSearch/CommonDateSearch'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import VisitContent from './components/visitRecordCon'
import AddVisitDialog from './components/addVisitRecord'
import { querySubName } from '@/api/crm/followRecord/followRecord'
import { subSecondChannelQuery } from '@/api/crm/studentInfo/highSeas'
import SubUserSelect from './../../../components/SubUserSelect/SubUserSelect.vue'
export default {
  components: {
    CommonSearch,
    CommonDateSearch,
    AdvancedSearch,
    VisitContent,
    AddVisitDialog,
    SubUserSelect // 用户下拉树
  },
  data() {
    return {
      source: '2',
      sourceType: '',
      commonDateOptions: {
        mainText: '到访时间:',
        defaultDate: [],
        options: ['today', 'tomorrow', 'thisWeek', 'nextWeek'],
        markText: {},
        pickerDateArr: []
      },
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '学员姓名/电话号码',
            modelValue: 'stuName',
            isClearable: true
          }, {
            itemType: 'select',
            placeholder: '到访状态',
            modelValue: 'status',
            isClearable: true,
            selectOption: [
              {
                label: '已关闭',
                value: '0'
              }, {
                label: '已到访',
                value: '1'
              }, {
                label: '待跟进',
                value: '2'
              }
            ]
          }
        ]
      },
      superSearch: {
        onClear: () => { this.onClear() },
        onSearch: (superValue) => { this.onSearch(superValue) },
        fields: window.language === 'dsf' ? [
          {
            type: 'select',
            key: 'uidName',
            label: '跟进人',
            optionValue: 'name',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          }, {
            type: 'select',
            key: 'sourceType',
            label: '学员类型',
            optionValue: 'id',
            clearable: false,
            optionLabel: 'name',
            options: [
              { id: '0', name: '潜在学员' },
              { id: '1', name: '在读学员' },
              { id: '2', name: '往期学员' }
            ]
          }, {
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
          }
        ] : [
          {
            type: 'select',
            key: 'uidName',
            label: '跟进人',
            optionValue: 'name',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          }, {
            type: 'select',
            key: 'sourceType',
            label: '学员类型',
            optionValue: 'id',
            optionLabel: 'name',
            options: [
              { id: '0', name: '潜在学员' },
              { id: '1', name: '在读学员' },
              { id: '2', name: '往期学员' }
            ]
          }
        ]
      },
      superValue: {},
      searchObj: {},
      userBranchOptions: [],
      userBranchSelected: '0',
      operatorType: 0, // 操作类型, 0.全部,1.我的, 2.我的下属
      operatorUser: '', // 查询用户
      studentType: ''
    }
  },
  mounted() {
    this.$refs.advanced.ruleForm.sourceType = '0'
    this.onSearch({ sourceType: this.$refs.advanced.ruleForm.sourceType })
    const route = this.$router.history.current.params
    const action = route && route.action
    if (action === 'addVisit') { // 打开新建窗口
      this.addVisitDialog()
    }

    this.querySubUser()
  },
  methods: {
    // 市场渠道change获取二级渠道
    async secondChange(value) {
      const params = {
        itemKey: value
      }
      const { data } = await subSecondChannelQuery(params)
      if (data.errorCode === 0) {
        this.superSearch.fields[4].options = data.results || []
      } else {
        this.$message.error(data.errorMessage || '二级渠道获取失败')
      }
    },
    /** 打开新增框 */
    addVisitDialog() {
      this.$refs.addVisitDialog.showDialog()
    },
    /* 公用日期选择改变事件 */
    commonDatePickerChange(arr) {
      const params = {
        ...this.formValue,
        ...this.superValue
      }
      this.commonDateOptions.pickerDateArr = arr
      if (this.commonDateOptions.pickerDateArr && this.commonDateOptions.pickerDateArr.length > 0) {
        params.startVisitTime = this.commonDateOptions.pickerDateArr[0]
        params.endVisitTime = this.commonDateOptions.pickerDateArr[1]
      }

      this.searchHandle(params)
    },
    /** 公用日期选择重置事件 */
    commonDateReset() {
      this.$refs.commonDatePicker.commonDateReset()
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
          userBranchParams.uids = this.userBranchSelected
        }
      }
      // 搜索的入参
      this.formValue = formValue
      const params = {
        ...this.formValue,
        ...this.superValue,
        ...userBranchParams
      }
      const dateArr = this.commonDateOptions.pickerDateArr || []
      if (dateArr && dateArr.length > 0) {
        params.startVisitTime = dateArr[0]
        params.endVisitTime = dateArr[1]
      }
      for (const i in params) {
        if (!params[i]) {
          delete params[i]
        }
      }
      this.$refs.visitCon.queryVisitRecord(params)
    },
    /** 高级清除 */
    onClear() {
      // console.log('0000000')
      this.onSearch({ sourceType: '0' })
      // this.$refs.advanced.ruleForm.sourceType === '0'
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      this.operatorType = '0'
      this.userBranchSelected = '0'
      this.formValue = {}
      this.commonDateReset()
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
          userBranchParams.uids = this.userBranchSelected
        }
      }

      this.superValue = superValue
      const params = {
        ...this.formValue,
        ...this.superValue,
        ...userBranchParams
      }
      const dateArr = this.commonDateOptions.pickerDateArr || []
      if (dateArr && dateArr.length > 0) {
        params.startVisitTime = dateArr[0]
        params.endVisitTime = dateArr[1]
      }
      for (const i in params) {
        if (!params[i]) {
          delete params[i]
        }
      }
      if (this.$refs.advanced.ruleForm.sourceType === '0') {
        this.source = '2'
        this.studentType = 'latent'
        this.sourceType = '0'
      } else if (this.$refs.advanced.ruleForm.sourceType === '1') {
        this.source = '1'
        this.studentType = 'reading'
        this.sourceType = '1'
      } else if (this.$refs.advanced.ruleForm.sourceType === '2') {
        this.source = '1'
        this.sourceType = '2'
        this.studentType = 'wangStu'
      } else {
        this.sourceType = ''
      }
      this.$refs.visitCon.queryVisitRecord(params)
    },
    getUpdateTable() {
      const params = {
        pageIndex: 0,
        sourceType: this.sourceType
      }
      this.$refs.visitCon.queryVisitRecord(params)
    },
    /** 查询下属 */
    querySubUser() {
      const userBranchOptions = [{ id: '0', type: 0, name: '全部', children: [] }, { id: '1', type: 1, name: '我的', children: [] }]
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
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .page_title_text {
    font-weight: 500;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(238, 238, 238, 1);
    margin-bottom: 20px;
    padding-left: 0;
  }
}
.visitRecord_container {
  .search {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding-bottom: 20px;
    // height: 48px;
  }
  .date_search {
    display: flex;
    justify-content: space-between;
  }
  .visit_content {
    border-top: 1px solid rgba(238, 238, 238, 1);
    height: calc(100vh - 230px);
  }
  .subUserSelect {
    vertical-align: top;
    float: left;
    margin-right: 10px;
  }
}
</style>
