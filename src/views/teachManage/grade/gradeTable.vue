<template>
  <div class="grade">
    <div
      v-if="!isArrangeCourse"
      class="wrapWI"
      @click="maskE"
      @mouseover="indexn = 0"
      @mouseleave="indexn = 1"
    >
      <div class="maskE">使用教程</div>
      <img :src="img[indexn]" class="maskI" >
    </div>
    <div v-if="!isArrangeCourse">
      <div class="page_title_text">班级管理</div>
      <common-search
        :is-inline="true"
        :params="formInline"
        :forms="formInline"
        @toParent="resetFieldHanle"
      />
      <advanced-search v-bind="superSearch" />
      <div class="add">
        <el-button v-if="hasBtn('503000001')" type="primary" size="mini" @click="addNewGrade">新增班级</el-button>
      </div>

      <common-table
        ref="tableCommon"
        :columns="columns"
        :table-height="tableHeight"
        :pagination="pagination"
        :options="options"
        :operation="operates"
        :table-key="'teachManage_grade_gradeTable'"
      />
      <!-- 新增班级 -->
      <NewGrade ref="newGrade" @toAddGrade="getAddGrade" />
      <!-- 编辑班级 -->
      <EditNewGrade ref="editGrade" @toAddGrade="getEditGrade" />
    </div>
    <!-- 班级排课 -->
    <ClassArrange
      v-if="isArrangeCourse"
      :grade-info="gradeInfo"
      @toCloseClassArrange="getCloseClassArrange"
    />
    <GradeInfo
      ref="side"
      :side-info="sideInfo"
      @toParent="getEditData"
      @toDelete="getDeleteData"
      @toShowOrderDetail="getOrderDetail"
      @toUpdateInfo="getUpdateInfo"
      @toDeleteSchedule="getDeleteSchedule"
      @toAddNewStu="getAddNewStu"
      @toUpdateStuList="getUpdateStuList"
    />
    <DeleteGrade ref="delGrade" @toDeleteGrade="getDeleteGradeData" />
    <StuOrder ref="stuOrderDetail" />
    <UpdateInfo ref="update" @refreshCourse="refreshCourse" />
    <DeleteSchedule ref="deleteSchedule" @toDeleteSchedule="getDeleteScheduleData" />
    <AddStudent ref="addStu" @toUpdateStuList="getUpdateStuList" />
    <!-- 视频弹框 -->
    <div v-if="showV" class="videoW" @click.self="cloce">
      <div class="videoA">
        <img
          src="http://img.ishanshan.com/gimg/user/n///265013833225994241.png"
          class="closeI"
          alt
          @click.self="cloce"
        >
      </div>
    </div>
  </div>
</template>
<script>
import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import StuOrder from './dialog/stuOrderCourseDetail'
import NewGrade from './dialog/addNewGrade'
import EditNewGrade from './dialog/editNewGrade'
import DeleteGrade from './dialog/deleteGradeSure'
import UpdateInfo from './dialog/updateInfo'
import DeleteSchedule from './dialog/deleteSchedule'
import AddStudent from './dialog/addStudent'

import ClassArrange from './classArrange'
import {
  queryClassGradeList,
  deleteClassGrade,
  closeGrade
} from '@/api/teachManage/grade'
import GradeInfo from './side/gradeInfoSide'
export default {
  components: {
    CommonSearch,
    CommonTable,
    AdvancedSearch,
    NewGrade,
    EditNewGrade,
    ClassArrange,
    GradeInfo,
    DeleteGrade,
    StuOrder,
    UpdateInfo,
    DeleteSchedule,
    AddStudent
  },
  data() {
    return {
      showV: false,
      indexn: 1,
      img: [
        'http://img.ishanshan.com/gimg/user/n///265321467506327553.png',
        'http://img.ishanshan.com/gimg/user/n///265000186051297281.png'
      ],
      formInline: {
        type: '1',
        searchMethod: formValue => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '班级名称',
            modelValue: 'name',
            isClearable: true,
            itemStyle: 'width:140px'
          },
          {
            itemType: 'input',
            placeholder: '课程名称',
            modelValue: 'courseName',
            isClearable: true,
            itemStyle: 'width:140px'
          },
          {
            itemType: 'select',
            placeholder: '班级状态',
            modelValue: 'type',
            isClearable: true,
            itemStyle: 'width:140px',
            defaultFirst: true,
            default: true,
            selectOption: [
              {
                label: '正常',
                value: '1'
              },
              {
                label: '结业',
                value: '0'
              }
            ]
          }
        ]
      },
      columns: [
        {
          label: '班级名称',
          prop: 'name',
          formatter: (row, column, cellValue) => {
            if (row.type === '1') {
              return `<div style="color:#1D9DF2;text-overflow:ellipsis;overflow:hidden">${row.name}</div>`
            } else {
              return `<div style="color:#666;text-overflow:ellipsis;overflow:hidden;cursor:auto;">${row.name}</div>`
            }
          },
          isShowTooltip: true,
          methods: row => {
            if (row.type === '1') {
              this.openSideDialog(row)
              // this.openSideDialog(row)
            }
          }
        },
        {
          label: '所属课程',
          prop: 'courseName',
          isShowTooltip: true
        },
        {
          label: '所属课系',
          prop: 'courseGroupName',
          isShowTooltip: true
        },
        {
          label: '班级人数',
          prop: 'num',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            return `<div>${row.classStuNum}/${row.maxNum}</div>`
          }
        },
        {
          label: '班级进度',
          prop: 'cpd',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            return `<div>${row.overdueCpdNum}/${row.totalCpdNum}</div>`
          }
        },
        {
          label: '开班日期',
          prop: 'beginTime',
          isShowTooltip: true
        },
        {
          label: '结课日期',
          prop: 'endTime',
          isShowTooltip: true
        },
        {
          label: '主教',
          prop: 'mainTeacherNames',
          isShowTooltip: true
        },
        {
          label: '助教',
          prop: 'assistanTeacherNames',
          isShowTooltip: true
        },
        {
          label: '班主任',
          prop: 'topTeacherName',
          isShowTooltip: true
        },
        {
          label: '班级状态',
          prop: 'type',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.type === '1') {
              //eslint-disable-line
              return `<div>正常</div>`
            } else {
              return `<div>结课</div>`
            }
          }
        }
      ],
      tableHeight: 'calc(100vh - 235px)', // 表格高度
      pagination: {
        show: true,
        sizes: true
      },
      visible: false,
      operates: {
        width: '230',
        fixed: 'right',
        list: [
          {
            label: '删除',
            type: 'normal',
            prop: 'type',
            disabled: '1',
            popoverName: 'selfPop',
            class: 'styleDelete',
            btnId: '503000003',
            method: row => {
              this.deleteHandle(row)
            },
            popoverCon: [
              {
                contentText: '删除班级后将会删除班级所有关联信息数据，请确认是否删除？'
              }
            ]
          },
          {
            label: '结业',
            type: 'normal1',
            prop: 'type',
            disabled: '1',
            class: 'styleNormal1',
            btnId: '503000004',
            method: row => {
              if (row.type === '1') {
                this.finishHandle(row)
              } else {
                this.$message.error('该班级已结业')
              }
            },
            popoverCon: [
              {
                contentText: '确定要结业吗？'
              }
            ]
          },
          {
            label: '班级排课',
            btnId: '503000005',
            prop: 'type',
            disabled: '1',
            method: row => {
              if (row.type === '1') {
                this.gradeSchedule(row)
              } else {
                this.$message.error('该班级已结业,不能排课')
              }
            }
          }
        ]
      },
      options: {
        apiService: queryClassGradeList,
        params: {
          type: '1'
        },
        isSettingShow: true
      },
      superSearch: {
        onClear: () => {
          this.onClear()
        },
        onSearch: superValue => {
          this.onSearch(superValue)
        },
        fields: [
          {
            type: 'select',
            key: 'fullClass',
            label: '是否满班',
            options: [
              { value: '1', label: '满班' },
              { value: '2', label: '未满班' }
            ]
          },
          {
            type: 'select',
            key: 'courseGroupId',
            label: '课系',
            optionValue: 'id',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SS_CRM}/cerp/coursegroup/query`
          },
          {
            type: 'input',
            key: 'mainTeacherName',
            label: '主教'
          },
          {
            type: 'input',
            key: 'assistantTeacherName',
            label: '助教'
          }
        ]
      },
      isArrangeCourse: false, // 是否显示班级排课
      gradeInfo: {}, // 班级信息
      sideDialogShow: false, // 是否打开侧边栏
      sideInfo: {}, // 点击某行信息
      superValue: {}, // 高级搜索数据
      formValue: {
        type: '1'
      } // 搜索栏的数据
    }
  },
  methods: {
    /* 搜索 */
    searchHandle(formValue) {
      this.formValue = formValue
      // 搜索的入参
      const params = {
        ...formValue,
        ...this.superValue
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle() {
      // 重置的入参
      const params = {
        pageIndex: 0,
        type: this.formInline.type,
        ...this.superValue
      }
      this.formValue = {}
      this.$refs.tableCommon.getList(params)
    },
    /* 新增班级 */
    addNewGrade() {
      this.$refs.newGrade.show()
    },
    /* 新增班级刷新 */
    getAddGrade(istrue) {
      if (istrue) {
        const params = {
          pageIndex: 0
        }
        this.$refs.tableCommon.getList(params)
      } else {
        this.$refs.tableCommon.getList()
      }
    },
    /* 编辑班级刷新 */
    getEditGrade(row) {
      this.$refs.tableCommon.getList()
      this.$refs.side.show(row)
    },
    /* 删除*/
    deleteHandle(row) {
      const params = {
        clsId: row.clsId
      }
      deleteClassGrade(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.$message.success(data.errorMessage)
          this.$refs.tableCommon.getList()
          setTimeout(() => {
            const numAll = this.$refs.tableCommon.$el.children[0].children[2]
              .textContent
            if (numAll === ' 暂无数据') {
              this.$refs.tableCommon.getList()
            }
          }, 500)
        } else {
          this.$message.error(data.errorMessage || '删除班级失败')
        }
      })
    },
    /* 结业 */
    finishHandle(row) {
      const params = {
        classId: row.clsId,
        type: '0'
      }
      closeGrade(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.$message.success(data.errorMessage)
          this.$refs.tableCommon.getList()
          setTimeout(() => {
            const numAll = this.$refs.tableCommon.$el.children[0].children[2]
              .textContent
            if (numAll === ' 暂无数据') {
              this.$refs.tableCommon.getList()
            }
          }, 700)
        } else {
          this.$message.error(data.errorMessage || '结业班级失败')
        }
      })
    },
    /* 班级排课*/
    gradeSchedule(row) {
      const numIndex = this.$refs.tableCommon.pageIndex
      this.isArrangeCourse = true
      this.gradeInfo = { row, numIndex }
    },
    /* 关闭班级排课 */
    getCloseClassArrange(index) {
      this.isArrangeCourse = false
      setTimeout(() => {
        this.$refs.tableCommon.getList({ pageIndex: index - 1 })
      }, 500)
    },

    refreshCourse() {
      this.$refs.side.refuseGradeInfo()
    },

    /* 打开侧边栏 */
    openSideDialog(row) {
      this.$refs.side.show(row)
    },
    /** 高级搜索 */
    onSearch(superValue) {
      const params = {
        ...superValue,
        ...this.formValue
      }
      this.superValue = superValue
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
    /* 获取编辑信息 */
    getEditData(val, row) {
      this.$refs.editGrade.show(val, row)
    },
    /* 获取删除信息 */
    getDeleteData(val) {
      this.$refs.delGrade.show(val)
      this.$refs.tableCommon.getList()
      setTimeout(() => {
        const numAll = this.$refs.tableCommon.$el.children[0].children[2]
          .textContent
        if (numAll === ' 暂无数据') {
          this.$refs.tableCommon.getList()
        }
      }, 700)
    },
    /* 获取新增学员 */
    getAddNewStu(row, list) {
      this.$refs.addStu.show(row, list)
    },
    /* 获取学员约课详情 */
    getOrderDetail(row, id) {
      this.$refs.stuOrderDetail.show(row, id)
    },
    /* 获取学员修改信息 */
    getUpdateInfo(row) {
      this.$refs.update.show(row)
    },
    /* 获取学员删除日程 */
    getDeleteSchedule(row, id) {
      this.$refs.deleteSchedule.show(row, id)
    },
    /* 侧边栏删除班级 */
    getDeleteGradeData() {
      this.$refs.tableCommon.getList()
      this.$refs.side.cancel()
    },
    getDeleteScheduleData(id) {
      this.$refs.side.updateArrange(id)
    },
    /* 更新学员列表 */
    getUpdateStuList(row) {
      this.$refs.side.updateStuList(row.clsId)
      this.$refs.tableCommon.getList()
      this.$refs.side.show(row)
    },
    maskE() {
      window.open(
        'https://saas.ishanshan.com/thinknode/web/offical/help/1169194895227686912'
      )
    },
    cloce() {
      this.showV = false
    }
  }
}
</script>
<style lang="scss" scoped>
.grade /deep/ {
  position: relative;
  padding: 20px 20px 0;
  .videoW {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    width: 100%;
    height: 100%;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .videoA {
    width: 600px;
    height: 450px;
    position: relative;
    background: #fff;
    box-shadow: 0px 1px 7px 0px rgba(0, 0, 0, 0.2);
  }
  .closeI {
    position: absolute;
    top: -4px;
    right: -29px;
    width: 25px;
    height: 25px;
  }
  .maskE {
    position: absolute;
    top: 20px;
    right: 40px;
    color: #999;
    font-size: 12px;
    z-index: 99;
  }
  .maskI {
    position: absolute;
    top: 21px;
    right: 26px;
    width: 12px;
    height: 12px;
    z-index: 99;
  }
  .wrapWI:hover .maskE {
    cursor: pointer;
    color: rgba(29, 157, 242, 0.8);
  }
  .wrapWI:hover .maskI {
    cursor: pointer;
  }
  .page_title_text {
    font-weight: 500;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(238, 238, 238, 1);
    margin-bottom: 20px;
    padding-left: 0;
    color: #333;
  }
  .side-dialog {
    height: calc(100vh - 68px);
  }
  .add {
    float: right;
  }
}
</style>

<style lang="scss">
.styleNormal1 {
  margin-right: 10px;
}
.styleDelete {
  margin-right: 10px;
}
</style>

