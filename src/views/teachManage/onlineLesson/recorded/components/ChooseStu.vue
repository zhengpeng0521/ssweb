<template>
  <div>
    <div class="tabBox">
      <div class="stepBox">
        <div v-if="type==='add'" class="name">
          课件名称:{{ courseName }}

        </div>
        <div v-if="type==='edit'" class="name">
          课件名称:{{ name }}

        </div>
        <!-- <div class="tips">
          注：课件类型为“会员课”的课件在该页面设置观看学员，课件类型为“公开课”的课件可跳过该步骤
        </div> -->
        <div style="margin-top:15px;">
          <el-button type="primary" @click="addStu">添加学员</el-button>
        </div>
        <div class="common_block">
          <div class="title_block" />
          <div class="title_content">观看学员列表</div>
        </div>

      </div>
      <div class="tableBox">
        <CommonSearch
          ref="CommonSearch"
          :is-inline="true"
          :params="formInline"
          :forms="formInline"
          @toParent="resetFieldHanle"
        />
        <!-- 已选数据操作 -->
        <div class="checked_data">
          <span class="checked_text">已选<i>{{ checkNum || '0' }}</i>条数据</span>
          <el-button
            size="mini"
            class="cancel_btn edit_btn"
            style="margin-right:5px"
            @click="changeDateDialog()"
          >修改有效期</el-button>
        </div>
        <div class="tableStu">
          <CommonTable
            ref="tableCommon"
            :columns="columns"
            :table-height="tableHeight"
            :pagination="listQuery"
            :options="options"
            :operation="operates"
            @handleSelectionChange="selectionChange"
          />
        </div>

      </div>

      <!--添加学员弹窗 -->
      <AddStu
        ref="addStu"
        :get-table="() => getTable({ cwId: courseId })"
      />
      <!-- 修改到期日期 -->
      <changeDateDialog
        ref="changeDateDialog"
        :get-table="() => getTable({ cwId: courseId })"
      />
    </div>
    <div class="submitBtn">
      <el-button v-if="type==='add'" @click="returnFirst">上一步</el-button>
      <el-button type="primary" @click="submitBtn">确定并退出</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import CommonTable from '@/components/CommonTable/CommonTable'
import CommonSearch from '@/components/CommonSearch/CommonSearch'
import changeDateDialog from './changeDateDialog'
import { coursewareStuQuery } from '@/api/teachManage/onlineLesson'
import AddStu from './addStu'
export default {
  components: {
    CommonTable,
    CommonSearch,
    AddStu,
    changeDateDialog
  },
  props: {
    type: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      formInline: {
        searchMethod: formValue => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '输入学员姓名/手机号',
            modelValue: 'nameOrMobile',
            isFilterable: true,
            isClearable: true
          },
          {
            itemType: 'input',
            placeholder: '输入在读班级',
            modelValue: 'clsName',
            isFilterable: true,
            isClearable: true
          },
          {
            itemType: 'datePicker',
            datePickerType: 'daterange',
            valueFormat: 'yyyy-MM-dd',
            modelValue: 'date',
            rangeSeparator: '~',
            startPlaceholder: '有效开始时间',
            endPlaceholder: '有效结束时间',
            itemStyle: 'width:230px',
            isClearable: true,
            default: true
            // toChange: this.timeChange
          }
        ]
      },
      columns: [
        {
          label: '学员姓名',
          prop: 'stuName',
          width: '80px',
          formatter: (row) => {
            return `${row.stuName}`
          },
          isShowTooltip: true
        },
        {
          label: '家长手机号',
          prop: 'parents',
          isShowTooltip: true,
          width: '80px',
          render: (h, params) => {
            return h('span', {}, [
              params.row.parents && params.row.parents.length > 0
                ? h(
                  'el-popover',
                  {
                    props: { placement: 'top', trigger: 'hover' }
                  },
                  [
                    h(
                      'div',
                      [
                        params.row.parents.map(item => {
                          return h('div', [
                            h(
                              'span', item.name + '：' + item.mobile
                            )

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
          label: '在读班级',
          prop: 'clsNames',
          isShowTooltip: true,
          width: '120px'
          // render: (h, params) => {
          //   return h('span', {}, [
          //     params.row.clsList && params.row.clsList.length > 0
          //       ? h(
          //         'div', { style: { textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }},
          //         [

          //           params.row.clsList.map(item => {
          //             return h('span',
          //               item.name + ','
          //             )
          //           })
          //           // console.log('pp', )

          //         ]
          //       )

          //       : '无'
          //   ])
          // }
        },
        {
          label: '观看有效期',
          prop: 'validTime',
          isShowTooltip: true,
          width: '100px'
        }

      ],
      listQuery: {
        indexChange: this.indexChange,
        sizeChange: this.sizeChange
      },
      tableHeight: 'calc(100vh - 1000px)',
      options: {
        mutiSelect: true, // 是否多选
        apiService: coursewareStuQuery, // 表格的数据请求接口
        params: {
          pageIndex: 0,
          cwId: this.courseId
        },
        isSettingShow: true // 是否出现设置
      },
      operates: {
        width: '180',
        fixed: 'right',
        list: [
          {
            label: '移除',
            type: 'normal',
            method: (row) => {
              this.deleteHandle(row)
            },
            popoverCon: [
              {
                contentText: '该学员移除后将不能观看本课件，是否继续移除？'
              }
            ]
          },
          {
            label: '修改有效期',
            type: 'normal',
            method: (row) => {
              this.changeDateDialog(row)
            }
          }
        ]
      },
      checkNum: 0,
      checkedData: [],
      name: ''
    }
  },

  computed: {
    ...mapState('recorded', [
      'chapters',
      'courseId',
      'courseName',
      'addLoading',
      'courseType'
    ])
  },
  mounted() {
    console.log('type', this.type)
    if (this.type === 'edit') {
      this.getDetail()
    } else {
      this.getTable()
    }
  },
  methods: {
    ...mapActions('recorded', [
      'addChapter',
      'updateChapter',
      'deleteStu',
      'getCourseInfo'

    ]),
    ...mapMutations('recorded', [
      'UPDATE_STATE'
    ]),
    // 添加学员
    addStu() {
      this.$refs.addStu.show()
    },
    getDetail() {
      if (this.courseId) {
        const params = {
          id: this.courseId
        }
        this.getCourseInfo({ params, mapForm: this.mapForm, refresh: this.getTable, mark: true })
      } else {
        this.$router.push({ name: 'recorded' })
      }
    },
    /** 返回上一步 */
    returnFirst() {
      this.UPDATE_STATE({ currentStep: 1 })
    },
    /** 编辑时信息注入 */
    mapForm(info) {
      this.name = info.name
    },
    // 获取列表信息
    getTable(params) {
      const search = {
        ...params,
        cwId: this.courseId,
        pageIndex: 0
      }
      console.log('search', search)
      this.$refs.tableCommon.getList(search)
    },
    changeDateDialog(row) {
      // console.log('row', row)
      // if()
      if (row) {
        this.$refs.changeDateDialog.show(row)
      } else {
        if (row === undefined && this.checkedData.length === 0) {
          this.$message.error('请先选择学员')
        } else {
          this.$refs.changeDateDialog.show(this.checkedData)
        }
      }
    },
    // 移除学员
    deleteHandle(row) {
      const params = {
        id: row.id
      }
      console.log('row', row)
      this.deleteStu({ params })
      setTimeout(() => {
        this.$refs.tableCommon.getList()
      }, 500)
    },
    submitBtn() {
      console.log('type', this.courseType)
      this.$router.push({ name: 'recorded' })
      this.UPDATE_STATE({ currentStep: 0 })
      // if (this.courseType === '1') {
      //   this.$router.push({ name: 'recorded' })
      //   this.UPDATE_STATE({ currentStep: 0 })
      //   console.log('this.55', this.$refs.addStu.selStuId)
      // } else {
      //   console.log('this.55', this.$refs.addStu.selStuId)
      //   if (this.$refs.addStu.selStuId && this.$refs.addStu.selStuId.length > 0) {
      //     this.$router.push({ name: 'recorded' })
      //     this.UPDATE_STATE({ currentStep: 0 })
      //   } else {
      //     this.$message.error('会员课必须选择学员')
      //   }
      // }
    },
    /* 选择数据条数操作 */
    selectionChange(val) {
      console.log('val', val)
      this.checkedData = val
      this.checkNum = val.length
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      this.searchHandle({ pageIndex: 0, cwId: this.courseId })
    },
    searchHandle(formName) {
      // const params = {
      //   ...this.formValue,
      //   ...this.superValue,
      //   pageIndex: 0
      // }
      this.formValue = formName
      console.log('formName', formName)
      // 搜索的入参
      let startTime
      let endTime
      if (formName.date) {
        startTime = formName.date[0]
        endTime = formName.date[1]
      } else {
        startTime = ''
        endTime = ''
      }
      const params = {
        nameOrMobile: this.formValue.nameOrMobile,
        clsName: this.formValue.clsName,
        startTime: startTime,
        endTime: endTime,
        pageIndex: 0,
        cwId: this.courseId
      }
      // console.log('formName', params)

      this.$refs.tableCommon.getList(params)
    },
    // 改变条数
    sizeChange(pageSize) {
      // this.formValue
      // // 搜索的入参
      // let startTime
      // let endTime
      // if (this.formValue.date) {
      //   startTime = this.formValue.date[0]
      //   endTime = this.formValue.date[1]
      // } else {
      //   startTime = ''
      //   endTime = ''
      // }
      // const params = {
      //   nameOrMobile: this.formValue.nameOrMobile,
      //   clsName: this.formValue.clsName,
      //   startTime: startTime,
      //   endTime: endTime,
      //   pageIndex: 0,
      //   cwId: this.courseId,
      //   pageSize
      // }
      const params = {
        pageIndex: this.pageIndex,
        cwId: this.courseId,
        ...this.formValue,
        pageSize
      }
      this.$refs.tableCommon.getList(params)
    },
    // 改变页数
    indexChange(pageIndex) {
      const params = {
        ...this.formValue,
        cwId: this.courseId,
        pageIndex: pageIndex - 1
      }
      console.log('params', params)
      this.$refs.tableCommon.getList(params)
    }
  }
}
</script>

<style lang="scss">
.tabBox{
  max-height: calc(100vh - 250px);
  overflow-y: auto;
}
.submitBtn{
  text-align: center;
  width: 100%;
  height: 48px;
  border-top: 1px solid #eeeeee;
  padding-top: 16px;
  padding-bottom: 10px;

}
  .tableBox{
    // max-height: 280px;
    // overflow-y: auto;
    padding: 0 0 0 20px;

    }
  .tableStu{
    margin-top: 10px;
  }
  .checked_data {
    margin: 0px 0 16px 0;
    .checked_text {
      margin-right: 10px;
    }
    i {
      font-style: normal;
      color: #46b6ee;
      padding: 0 5px;
    }
  }

.stepBox{
  padding: 0px 20px;
  // max-height: calc(100vh - 190px);
  // overflow-y: auto;
  .name{
    font-size: 14px;
    color: #333333;
  }
  .tips{
    margin-top: 10px;
    color: #F56C6C;
    font-size: 12px;
  }
  .common_block {
      margin-top: 20px;
      overflow: hidden;
      height: 25px;
      display: flex;
      flex-wrap: nowrap;
      flex-direction: row;
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      -webkit-box-pack: start;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 10px;
      .title_block {
        height: 14px;
        width: 6px;
        background: #46b6ee;
        margin-right: 10px;
        border-radius: 3px;
      }
      .title_content {
        // line-height: 25px;
        font-size: 14px;
        color: #333333;
      }
  }
}
</style>
