<template>
  <div class="stuAccount_container">
    <!-- 搜索栏 -->
    <div class="search">
      <div>
        <CommonSearch
          :is-inline="true"
          :params="formInline"
          :forms="formInline"
          @toParent="resetFieldHanle"
        />
        <AdvancedSearch ref="advanced" v-bind="superSearch" />
      </div>
      <div>
        <el-button
          v-log="{compName:'学员账户',eventName:'web-【学员CRM】-学员账户-批量手动消课'}"
          v-if="hasBtn('408000001')"
          type="primary"
          size="mini"
          @click="batchHandCurDialog()"
        >批量手动消课</el-button>
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
      table-key="crm_account_student"
    />
    <!-- 学员详情弹框组件 -->
    <!-- <StudentDetailSide ref="studentDetailSide" /> -->
    <CrmDetailModal
      ref="crmDetailModal"
      v-bind="detailProps"
      :name="studentName"
      :params="idObj"
      :student-type ="studentType"
      :source ="'1'"
      :header-data="headerData"
      :base-data="baseData"
      :parent-data="parentData"
      @toUpdateLeadsTable="detailUpdateTable"
    />
    <!-- 新增消课弹框组件 -->
    <AddCancelClassDialog ref="addCancelClassDialog" />
    <!-- 新增赠送课时弹框组件 -->
    <AddGiveClassDialog ref="addGiveClassDialog" />
    <!-- 会员卡侧边滑弹框 -->
    <CardVipSideDialog ref="cardVipSideDialog" />

    <!-- 批量手动消课弹窗 -->
    <BatchHandCurDialog ref="batchHandCurDialog" />
    <!-- 冻结/解冻弹窗 -->
    <AddFreezeAccountDialog
      ref="addFreezeAccountDialog"
      @refreshTableList="refreshList"
    />

  </div>
</template>

<script>
import { stuCardListByCon, getStuMsg } from '@/api/crm/stuAccount/stuAccount.js'
import CommonTable from '../../../components/CommonTable/CommonTable'
import CommonSearch from '../../../components/CommonSearch/CommonSearch'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import StudentDetailSide from './components/studentDetailSide.vue'
import AddCancelClassDialog from './components/addCancelClassDialog.vue'
import AddFreezeAccountDialog from './components/addFreezeAccount.vue'
import AddGiveClassDialog from './components/addGiveClassDialog.vue'
import CardVipSideDialog from './components/cardVipSideDialog.vue'
import BatchHandCurDialog from './components/batchHandCurDialog.vue'
import CrmDetailModal from '@/components/CrmDetailModal'
export default {
  components: {
    CommonTable,
    CommonSearch,
    AdvancedSearch,
    StudentDetailSide, // 学员详情侧边弹框组件
    AddCancelClassDialog, // 新增消课弹框组件
    AddGiveClassDialog, // 新增赠送课时弹框组件
    CardVipSideDialog, // 会员卡侧边滑弹框组件
    BatchHandCurDialog, // 批量手动消课弹窗
    AddFreezeAccountDialog, // 冻结 or 解冻弹窗组件
    CrmDetailModal // 替换学员详情侧边栏
  },
  data() {
    return {
      studentType: 'reading',
      listQuery: {
        show: true, // 是否显示
        sizes: true
      },
      columns: [
        {
          label: '学员账户号',
          prop: 'id',
          isShowSet: false,
          isShowTooltip: true,
          width: '120',
          render: (h, params) => {
            return h(
              'div',
              {
                class: 'stuId',
                on: {
                  click: () => {
                    this.cardVipSide(params.row)
                  }
                }
              }, params.row.id
            )
          }
        },
        {
          label: '适用学员',
          prop: 'stuName',
          isShowTooltip: true,
          width: '120',
          render: (h, params) => {
            return h('span', {}, [
              h(
                'div',
                params.row.applicableStu.map((item, index) => {
                  return h('a', {
                    on: {
                      click: () => {
                        this.stuDetailDialog(item)
                      }
                    }
                  }, item.stuName)
                })
              )
            ])
          }
        },
        {
          label: '生日',
          prop: 'pageviews',
          isShowTooltip: true,
          width: '120px',
          render: (h, params) => {
            return h('span', {}, [
              h(
                'span',
                params.row.applicableStu.map((item, index) => {
                  return h('span', item.stuBirthday)
                })
              )
            ])
          }
        },
        {
          label: '适用家长',
          prop: 'applicableParent',
          isShowTooltip: true,
          width: '165px;',
          render: (h, params) => {
            return h('span', {}, [
              h(
                'span',
                params.row.applicableParent && params.row.applicableParent.length > 1
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
                  : params.row.applicableParent && params.row.applicableParent.map((item, index) => {
                    return h('span', item.name)
                  })
              )
            ])
          }
        },
        {
          label: '手机号',
          prop: 'mobile',
          render: (h, params) => {
            return h('span', {}, [
              h(
                'el-popover',
                {
                  props: { placement: 'top', trigger: 'hover' }
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
          label: '总课时(赠送)',
          prop: 'periodAll',
          isShowTooltip: true,
          width: '110px',
          render: (h, params) => {
            return h('span', {}, [
              h(
                'span', { slot: 'reference' }, params.row.periodAll + ' (' + params.row.periodExt + ')'
              )
            ])
          }
        },
        {
          label: '总课时金额',
          prop: 'dicMoney',
          isShowTooltip: true,
          width: '120px'
        },
        {
          label: '剩余课时',
          prop: 'periodLeft',
          isShowTooltip: true
        },
        {
          label: '剩余课时金额',
          prop: 'periodLeftMoney',
          isShowTooltip: true,
          width: '120px'
        },
        {
          label: '可预约课时',
          prop: 'periodAvailable',
          isShowTooltip: true,
          width: '110px'
        },
        {
          label: '已预约课时',
          prop: 'periodForward',
          isShowTooltip: true,
          width: '110px'
        },
        {
          label: '已消耗课时',
          prop: 'periodExpend',
          isShowTooltip: true,
          width: '110px'
        },
        {
          label: '已退课时',
          prop: 'periodRefund',
          isShowTooltip: true
        },
        {
          label: '创建时间',
          prop: 'createTime',
          isShowTooltip: true,
          hasSort: 'custom',
          width: '165px'
        },
        {
          label: '冻结状态',
          prop: 'status',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.status == '1') { //eslint-disable-line
              return `<div>未冻结</div>`
            }
            if (row.status == '2') { //eslint-disable-line
              return `<div>已冻结</div>`
            }
          }
        }
        // {
        //   label: '所属校区',
        //   prop: 'orgName',
        //   isShowTooltip: true
        // }
      ],
      options: {
        noMount: true,
        apiService: stuCardListByCon, // 表格的数据请求接口
        isSettingShow: true, // 是否出现设置
        params: {
          sourceType: '1'
        }
      },
      formValue: {},
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
          }, {
            itemType: 'input',
            placeholder: '学员账户号',
            modelValue: 'id',
            isClearable: true
          }, {
            itemType: 'select',
            placeholder: '冻结状态',
            modelValue: 'status',
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              {
                label: '未冻结',
                value: '1'
              }, {
                label: '已冻结',
                value: '2'
              }
            ]
          }
        ]
      },
      superSearch: {
        onClear: () => { this.onClear() },
        onSearch: (superValue) => { this.onSearch(superValue) },
        fields: [
          {
            type: 'select',
            key: 'sourceType',
            label: '学员类型',
            clearable: false,
            optionValue: 'id',
            optionLabel: 'name',
            options: [
              { id: '1', name: '在读学员' },
              { id: '2', name: '往期学员' }
            ]
          }
        ]
      },
      operates: {
        width: '210',
        fixed: 'right',
        list: [
          {
            label: '手动消课',
            type: 'normal',
            btnId: '408000001',
            prop: 'sourceType',
            disabled: 1,
            method: (row) => {
              this.addCancelClass(row)
            }
          },
          {
            label: '赠课',
            type: 'normal',
            class: 'styleStuAccount',
            btnId: '408000002',
            prop: 'sourceType',
            disabled: 1,
            method: (row) => {
              this.addGiveClass(row)
            }
          },
          {
            label_1: '冻结',
            label_2: '解冻',
            type: 'unnormal',
            btnId: '408000006',
            propType: 'sourceType',
            disabled: 1,
            popoverCon: [
              {
                contentText: '冻结',
                status: '1'
              }, {
                contentText: '解冻',
                status: '2'
              }
            ],
            method: (row) => {
              this.addIfFreeze(row)
            }
          }
        ]
      },
      cardInfoData: {},
      superValue: {},
      // 侧边内容详情
      detailProps: {
        tabs: [
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
      studentName: '',
      idObj: {},
      parentData: []
    }
  },
  mounted() {
    this.$refs.advanced.ruleForm.sourceType = '1'
    const route = this.$router.history.current.params
    if (route.activeTab === 'stuAccount') {
      if (route.action === 'periodLess') {
        this.options.params = { queryType: 'lessen' }
        const params1 = {
          queryType: 'lessen',
          sourceType: '1'
        }
        this.searchHandle(params1)
      }
      if (route.action === 'less') {
        const params = {
          queryType: 'less',
          pageIndex: 0,
          pageSize: 10,
          sourceType: '1'
        }
        this.searchHandle(params)
      }
    } else {
      this.$nextTick(() => {
        this.$refs.tableCommon.getList()
      })
    }
  },
  methods: {
    /* 学员详情弹框显示 */
    stuDetailDialog(row) {
      this.cardInfoData = row
      const params = {
        stuId: row.stuId
      }
      getStuMsg(params).then(res => {
        if (res.data.errorCode === 0) {
          this.detail = res.data.data
          this.idObj = {
            name: row.stuName,
            id: row.stuId,
            source: '1',
            stuId: row.stuId,
            stuName: this.detail.name
          }
          this.parentData = this.detail.list
          this.studentName = this.detail.name
          this.headerData = {
            saler: this.detail.sellerName,
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
          this.$refs.crmDetailModal.show()
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
      // this.$refs.studentDetailSide.showSideDialog(row)
    },
    /** 详情变动更新表格 */
    detailUpdateTable() {
      this.numI = this.$refs.tableCommon.pageIndex - 1
      const params = {
        ...this.formValue
      }
      this.searchHandle(params)
    },
    /* 新增消课弹框显示 */
    addCancelClass(row) {
      this.$refs.addCancelClassDialog.showDialog(row)
    },
    /* 新增赠送课时弹框 */
    addGiveClass(row) {
      this.$refs.addGiveClassDialog.showDialog(row)
    },
    /* 会员卡侧边滑弹框 */
    cardVipSide(row) {
      this.$refs.cardVipSideDialog.showSideDialog(row)
    },
    /* 新增预约试听弹框 */
    batchHandCurDialog() {
      this.$refs.batchHandCurDialog.showDialog()
    },
    /*  冻结或者解冻弹窗  */
    addIfFreeze(row) {
      this.$refs.addFreezeAccountDialog.showDialog(row)
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
    // 刷新列表
    refreshList() {
      this.$refs.tableCommon.getList()
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
      this.$refs.tableCommon.getList(params)
    },
    /** 高级清除 */
    onClear() {
      this.onSearch({ sourceType: '1' })
    }
  }
}
</script>

<style lang="scss" scoped>
.manyParent {
  padding: 0 5px;
  box-sizing: border-box;
}
</style>
<style lang="scss">
.stuAccount_container {
  .stuId {
    color: #1d9df2;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
    &:hover {
      color: #56c0f5;
    }
  }
  .search {
    height: 48px;
    display: flex;
    justify-content: space-between;
  }
  .styleStuAccount {
    margin-right: 10px !important;
  }
}
</style>
