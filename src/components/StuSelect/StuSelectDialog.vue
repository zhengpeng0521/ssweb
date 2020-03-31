<template>
  <el-dialog
    :visible.sync="findDialogShow"
    :close-on-click-modal="false"
    custom-class="student_select_dialog"
    title="精确查找"
    width="800px"
    append-to-body
    @close="cancelFindDialog()"
  >
    <!-- 精确查找搜索框 -->
    <div class="student_search">
      <CommonSearch
        :is-inline="true"
        :params="formInline"
        :forms="formInline"
        @toParent="resetFieldHanle"
      />
      <div v-if="showType" class="student_type">
        <span v-if="type === 'latent' || type=== 'realAll' || type=== 'all'"><i class="select_stu_type" />潜在学员</span>
        <span
          v-if="type === 'reading' || type=== 'realAll' || type=== 'all' || type==='readAndWangStu'"
          :style="{marginLeft: '10px'}"><i class="select_stu_type reading_type" />在读学员</span>
        <span
          v-if="type === 'wangStu' || type=== 'realAll' || type==='readAndWangStu'"
          :style="{marginLeft: '10px'}"><i class="select_stu_type previous_type" />往期学员</span>
        <template v-if="type==='vipReading'">
          <span :style="{marginLeft: '10px'}"><i class="select_stu_type" />可选</span>
          <span :style="{marginLeft: '10px'}"><i class="select_stu_type previous_type" />不可选</span>
        </template>
      </div>
    </div>
    <!-- 精确查找表格 -->
    <CommonTable
      ref="commonTable"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="pagination"
      :options="options"
      :no-select-ids="clsStuIdArr"
      :row-style="rowStyle"
      page-size-key="studentSelect"
      @onSelect="onSelect"
      @onSelectAll="onSelectAll"
      @handleSelectionChange="selectionChange"
      @handleRowSelect="rowClick"
    />
    <!-- 多选 -->
    <div v-if="multiple" class="checkList">
      <span>已选({{ checkNum || '0' }}) :</span>
      <span
        v-for="(item, index) of lastCheckList"
        :key="index"
        class="select_block"
      >
        {{ type === 'useClass' ? item.stuName : item.name }}
        <img
          src="//img.ishanshan.com/gimg/img/0b36a9ecb8febdd5e9fad8689a512428"
          @click="delName(item)"
        >
      </span>
    </div>
    <!-- 单选 -->
    <div v-else class="checkList">
      <span>已选 :</span>
      <span
        v-for="(item, index) of lastCheckList"
        :key="index"
        class="select_block"
      >
        {{ item.name }}
      </span>
    </div>

    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        class="cancel_btn"
        @click="cancelFindDialog()"
      >取消</el-button>
      <el-button
        type="primary"
        @click="submitFindForm()"
      >确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import { queryCRMStuList } from '@/api/teachManage/grade'
import { queryClueStuList } from '@/api/teachManage/orderCourse'
import { queryCRMStuAndClueList } from '@/api/crm/financeMgr/financeMgr'
import { batchStuList } from '@/api/crm/stuAccount/stuAccount'
import { coursewareStuQuery } from '@/api/teachManage/onlineLesson'
import { mapState } from 'vuex'
export default {
  components: {
    CommonSearch,
    CommonTable
  },

  props: {
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },

    type: {
      type: String,
      required: true
    },
    showType: {
      type: Boolean,
      default: false
    },
    showAll: {
      type: Boolean,
      default: false
    },

    params: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    const sellerKey = this.type === 'latent' ? 'sellerName' : 'seller'
    const mobileKey = this.type === 'latent' ? 'parentMobile' : 'mobile'

    return {
      clsStuIdArr: [], // 已在班级中的学员
      findDialogShow: false, // 弹窗显示
      formValue: {},
      formInline: {
        searchMethod: this.searchHandle,
        forms: this.type === 'useClass' ? [
          {
            itemType: 'input',
            placeholder: '学员姓名/家长电话',
            modelValue: 'nameOrTel',
            isClearable: true,
            itemStyle: 'width:120px'
          },
          {
            itemType: 'input',
            placeholder: '学员账户',
            modelValue: 'cardId',
            isClearable: true,
            itemStyle: 'width:120px'
          }
        ] : [
          {
            itemType: 'input',
            placeholder: '学员姓名',
            modelValue: 'name',
            isClearable: true,
            itemStyle: 'width:120px'
          },
          {
            itemType: 'input',
            placeholder: '昵称',
            modelValue: 'nickName',
            isClearable: true,
            itemStyle: 'width:120px'
          },
          {
            itemType: 'input',
            placeholder: '家长手机号',
            modelValue: 'mobile',
            isClearable: true,
            itemStyle: 'width:140px'
          }
        ]
      },
      columns: this.type === 'useClass' ? [
        {
          label: '学员姓名',
          prop: 'stuName',
          width: '120',
          isShowTooltip: true
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
                    params.row.tel
                  ),
                  h('a', { slot: 'reference' }, '查看')
                ]
              )
            ])
          }
        },
        {
          label: '学员账户',
          prop: 'cardId',
          isShowSet: false,
          width: '140px'
        },
        {
          label: '总课时(赠送)',
          prop: 'periodAll',
          isShowTooltip: true,
          width: '110px;',
          render: (h, params) => {
            return h('span', {}, [
              h(
                'span', { slot: 'reference' }, parseInt(params.row.periodAll) + ' (' + (parseInt(params.row.periodExt) || 0) + ')'
              )
            ])
          }
        },
        {
          label: '剩余课时',
          prop: 'periodLeft',
          isShowTooltip: true
        }
      ] : [
        {
          label: '姓名',
          prop: 'name',
          isShowTooltip: true,
          render: (h, params) => {
            if (this.showType) {
              if (this.type === 'reading') {
                return h('span', {}, [
                  h('i', { style: {
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    marginRight: '5px',
                    background: '#46b6ee'
                  }}),
                  h('span', params.row.name)
                ])
              } else if (this.type === 'latent') {
                return h('span', {}, [
                  h('i', { style: {
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    marginRight: '5px',
                    background: 'rgb(137, 199, 8)'
                  }}),
                  h('span', params.row.name)
                ])
              } else if (this.type === 'wangStu') {
                return h('span', {}, [
                  h('i', { style: {
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    marginRight: '5px',
                    background: 'rgb(255, 103, 2)'
                  }}),
                  h('span', params.row.name)
                ])
              } else if (this.type === 'realAll') {
                return h('span', {}, [
                  h('i', { style: {
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    marginRight: '5px',
                    background: params.row.sourceType === 1 ? '#46b6ee' : params.row.sourceType === 0 ? 'rgb(137, 199, 8)' : 'rgb(255, 103, 2)'
                  }}),
                  h('span', params.row.name)
                ])
              } else if (this.type === 'vipReading') {
                return h('span', {}, [
                  h('i', { style: {
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    marginRight: '5px',
                    background: !params.row.stuCardId || params.row.stuCardId === '' ? 'rgb(255, 103, 52)' : 'rgb(137, 199, 8)'
                  }}),
                  h('span', params.row.name)
                ])
              } else if (params.row.source) {
                return h('span', {}, [
                  h('i', { style: {
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    marginRight: '5px',
                    background: params.row.source === '1' ? '#46b6ee' : 'rgb(255, 103, 2)'
                  }}),
                  h('span', params.row.name)
                ])
              } else if (params.row.sourceType) {
                return h('span', {}, [
                  h('i', { style: {
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    marginRight: '5px',
                    background: params.row.sourceType === 1 ? '#46b6ee' : 'rgb(255, 103, 2)'
                  }}),
                  h('span', params.row.name)
                ])
              }
            } else {
              return h('span', params.row.name)
            }
          }
        }, {
          label: '昵称',
          prop: 'nickName',
          isShowTooltip: true
        }, {
          label: '性别',
          prop: 'sex',
          formatter: (row, column, cellValue) => {//eslint-disable-line
            if (row.sex == '1') {//eslint-disable-line
              return `<div>男</div>`
            } else {
              return `<div>女</div>`
            }
          }
        }, {
          label: '生日',
          prop: 'birthday'
        }, {
          label: '适用家长',
          prop: 'parentList',
          render: (h, params) => {
            return h('span', {}, [
              h('el-popover', {
                props: { placement: 'top', width: '200', trigger: 'hover'
                }
              }, [
                h('div', { style: 'text-align:center' }, params.row.parentList && params.row.parentList.length > 0 ? params.row.parentList.map((item, index) => {
                  return h('div', item.parentName + ':' + item[mobileKey])
                }) : '--'),
                h('a',
                  { slot: 'reference' }, '查看')
              ])
            ])
          }
        }, {
          label: '销售',
          prop: sellerKey,
          isShowTooltip: true
        }
      ],
      tableHeight: '250px',
      pagination: {
        show: true,
        sizeChange: this.sizeChange,
        indexChange: this.indexChange
      },
      options: this.multiple ? {
        mutiSelect: true,
        selectableFunc: (row, index) => {
          if (this.clsStuIdArr.indexOf(row.id) >= 0) {
            return 0
          } else {
            return 1
          }
        }
      } : {},
      checkNum: '', // 选中的个数
      checkList: [],
      checkedInfo: [],
      lastCheckList: [],
      arrNew: []
    }
  },
  computed: {
    ...mapState('recorded', [
      'courseId'
    ])
  },
  mounted() {
    // console.log('showAll', this.showAll)
    console.log('this.sourceType-------------', this.type)
  },
  methods: {
    show(val, clsStuIdArr, alllist) {
      this.checkList = val
      this.checkNum = alllist.length
      this.lastCheckList = alllist
      // console.log('this.lastCheckList', this.lastCheckList)
      if (this.type === 'reading') {
        // 早教在读
        this.options.apiService = queryCRMStuList
        this.options.params = {
          type: '2',
          sourceType: 1
        }
      } else if (this.type === 'latent') {
        // 潜在
        this.options.apiService = queryClueStuList
      } else if (this.type === 'all') {
        // 所有学员
        this.options.apiService = queryCRMStuAndClueList
      } else if (this.type === 'useClass') {
        // 消课专用
        this.options.params = {
          ...this.params
        }
        this.options.apiService = batchStuList
      } else if (this.type === 'vipReading' || this.type === 'allReading') {
        // 所有在读
        this.options.params = {
          sourceType: 1
        }
        this.options.apiService = queryCRMStuList
      } else if (this.type === 'nursery') {
        // 托班在读
        this.options.apiService = queryCRMStuList
        this.options.params = {
          type: '1'
        }
      } else if (this.type === 'realAll') {
        // 包括往期学员在读学员和潜在
        this.options.apiService = queryCRMStuAndClueList
        this.options.params = {
          sourceType: -1
        }
      } else if (this.type === 'wangStu') {
        this.options.apiService = queryCRMStuList
        this.options.params = {
          sourceType: 2
        }
      } else if (this.type === 'commonalityLeads') {
        // 潜在
        this.options.apiService = queryClueStuList
        this.options.params = {
          commonalityLeads: '1'
        }
      } else if (this.type === 'readAndWangStu') {
        this.options.apiService = queryCRMStuList
        this.arrNew = []
        coursewareStuQuery({ cwId: this.courseId }).then(res => {
        // console.log('res', res.data.results)
          res.data.results.forEach(item => {
            this.arrNew.push(
              item.stuId
            )
          })
        })
        // this.options.params = {
        //   sourceType:
        // }
      }
      this.options.selected = val
      this.findDialogShow = true
      this.clsStuIdArr = clsStuIdArr
    },

    /** 页数改变 */
    indexChange(pageIndex) {
      const payload = this.type === 'reading' ? {
        ...this.formValue,
        type: '2',
        pageIndex: pageIndex - 1
      } : {
        ...this.formValue,
        pageIndex: pageIndex - 1
      }
      this.options.selected = this.lastCheckList
      this.$refs.commonTable.getList(payload)
    },

    /** 每页条数改变 */
    sizeChange(pageSize) {
      const payload = this.type === 'reading' ? {
        ...this.formValue,
        type: '2',
        pageSize
      } : {
        ...this.formValue,
        pageSize
      }
      this.options.selected = this.lastCheckList
      this.$refs.commonTable.getList(payload)
    },

    /* 搜索 */
    searchHandle(formValue) {
      this.formValue = formValue
      // 搜索的入参
      const params = this.type === 'reading' ? {
        ...formValue,
        pageIndex: 0,
        type: '2'
      } : {
        ...formValue,
        pageIndex: 0
      }
      this.options.selected = this.lastCheckList
      this.$refs.commonTable.getList(params)
    },

    /* 搜索重置 */
    resetFieldHanle(formName) {
      this.formValue = {}
      // 重置的入参
      const params = this.type === 'reading' ? {
        pageIndex: 0,
        type: '2'
      } : {
        pageIndex: 0
      }
      this.$refs.commonTable.getList(params)
    },

    /* 单选选中高亮 */
    rowStyle({ row }) {
      if (this.multiple) {
        return {}
      } else {
        if (this.lastCheckList.length > 0 && row.id === this.lastCheckList[0].id) {
          return { background: '#ecf7fd' }
        }
      }
    },

    /* 取消 */
    cancelFindDialog() {
      this.findDialogShow = false
      this.lastCheckList = []
      this.$refs.commonTable.clearSelection()
      this.$emit('toclose', false)
    },
    /* 确定 */
    submitFindForm() {
      const checkArr = []
      this.findDialogShow = false
      this.lastCheckList.map(item => {
        checkArr.push(item.id)
      })
      this.$emit('toParent', checkArr, this.lastCheckList)
    },

    /** 勾选 */
    onSelect(selection, row) {
      const lastCheckList = [...this.lastCheckList]
      let isPush = false

      if (selection.length === 0) {
        lastCheckList.forEach((item, index) => {
          if (item.id === row.id) {
            lastCheckList.splice(index, 1)
          }
        })
      } else {
        selection.forEach(item => {
          if (item.id === row.id) {
            isPush = true
          }
        })
        if (isPush) {
          lastCheckList.push(row)
        } else {
          lastCheckList.forEach((item, index) => {
            if (item.id === row.id) {
              lastCheckList.splice(index, 1)
            }
          })
        }
      }

      this.lastCheckList = lastCheckList
      this.checkNum = lastCheckList.length
    },

    /** 全选 */
    onSelectAll(selection) {
      let lastCheckList = [...this.lastCheckList]
      if (selection.length > 0) {
        lastCheckList = this.distinct(lastCheckList, selection)
      } else {
        this.$refs.commonTable.tableData.forEach(data => {
          lastCheckList.forEach((item, index) => {
            if (item.id === data.id) {
              lastCheckList.splice(index, 1)
            }
          })
        })
      }

      this.lastCheckList = lastCheckList
      this.checkNum = lastCheckList.length
    },

    /** 去重 */
    distinct(a, b) {
      const arr = a.concat(b)
      const result = []

      var obj = {}
      for (var i = 0; i < arr.length; i++) {
        if (!obj[arr[i].id]) {
          result.push(arr[i])
          obj[arr[i].id] = true
        }
      }

      return result
    },

    /* 多选 */
    selectionChange(val) {
      if (val) {
        this.checkList = val
      }
    },
    /* 删除个别 */
    delName(val) {
      const lastCheckList = [...this.lastCheckList]
      const checkArr = []

      lastCheckList.forEach((item, index) => {
        if (item.id == val.id) { //eslint-disable-line
          lastCheckList.splice(index, 1)
        }
      })
      this.lastCheckList = lastCheckList
      this.checkNum = lastCheckList.length

      this.$refs.commonTable.tableData.forEach(item => {
        lastCheckList.forEach(check => {
          if (item.id === check.id) {
            checkArr.push(item)
          }
        })
      })

      this.$refs.commonTable.clearSelection()
      this.$refs.commonTable.toggleRowSelectionHandle(checkArr)
    },

    /** 选择当前行 */
    rowClick(row) {
      if (this.multiple) {
        // 多选
        // console.log('999999999999999999999999999')
        if (this.type === 'readAndWangStu' && this.arrNew.indexOf(row.id) > -1) {
          // console.log('999999999999999999999999999')
          return
        }
        const lastCheckList = [...this.lastCheckList]
        let hasRow = false // 是否已选择
        let isStu = false // 是否已是学员
        if (lastCheckList.length > 0) {
          lastCheckList.forEach((item, index) => {
            if (item.id === row.id) {
              hasRow = true
              lastCheckList.splice(index, 1)
            }
          })
        }
        this.clsStuIdArr.forEach(stu => {
          if (stu === row.id) {
            isStu = true
          }
        })
        !isStu && !hasRow && lastCheckList.push(row)

        this.lastCheckList = lastCheckList
        this.checkNum = lastCheckList.length
        this.$refs.commonTable.clearSelection()
        this.$refs.commonTable.toggleRowSelectionHandle(lastCheckList)
      } else {
        if (this.type === 'vipReading' && (!row.stuCardId || row.stuCardId === '')) {
          // 非会员不可选
          return
        }

        // 单选
        this.lastCheckList = [row]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.checkList {
  margin-bottom: 14px;
  .select_block {
    padding: 2px 8px;
    display: inline-block;
    border-radius: 3px;
    background: #eef7ff;
    position: relative;
    margin-left: 10px;
    color: #666;
    img {
      position: absolute;
      right: -7px;
      top: -5px;
      cursor: pointer;
    }
  }
}
.select_stu_type{
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
  background: rgb(137, 199, 8);
}

.reading_type{
  background: #46b6ee;
}

.red_type{
  background: rgb(255, 103, 52);
}

.previous_type{
  background: rgb(255, 103, 2);
}
.student_search{
  display: flex;
  justify-content: space-between;
}
.student_type span{
  line-height: 28px;
}
</style>
<style lang="scss">
// 分页去掉不知道哪里添加的清空icon
.student_select_dialog .el-pagination .el-input__validateIcon{
  display: none;
}
</style>
