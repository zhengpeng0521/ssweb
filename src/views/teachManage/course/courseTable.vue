<template>
  <div class="course">
    <el-dialog
      :visible.sync="newdialogVisibleouter"
      title="课程下架失败"
      width="600px"
    >
      <div>如下套餐包含该课程，请修改套餐后再试：</div>
      <div
        v-for="(item, index) of text"
        :key="index"
        class="page_text_text"
      >{{ item.proName }}</div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelContract"
        >取消</el-button>
        <el-button
          type="primary"
          @click="contract"
        >前去处理</el-button>
      </span>
    </el-dialog>
    <div
      class="wrapWI"
      @click="maskE"
      @mouseover="indexn = 0"
      @mouseleave="indexn = 1"
    >
      <div class="maskE">使用教程</div>
      <img
        :src="img[indexn]"
        class="maskI"
      >
    </div>
    <div class="page_title_text">课程管理</div>
    <common-search
      :is-inline="true"
      :params="formInline"
      :forms="formInline"
      @toParent="resetFieldHanle"
    />

    <div class="add">
      <el-button
        type="primary"
        size="mini"
        @click="lessonManangeFunc"
      >课系管理</el-button>
      <el-button
        v-if="hasBtn('502000001')"
        type="primary"
        size="mini"
        @click="newCourse"
      >新增课程</el-button>
    </div>
    <common-table
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="pagination"
      :options="options"
      :operation="operates"
      :table-key="'teachManage_course_courseTable'"
    />
    <!-- 新增课程 -->
    <AddNewCourse
      ref="addNewCourse"
      @toAddNewCourse="getNewCourse"
    />
    <ThemeManage ref="theme" />
    <LessonManage ref="lesson" />
    <DeleteCourse
      ref="deleteCourse"
      @toDeleteSure="getDeleteSure"
    />
    <CourseName
      ref="side"
      @toParent="getData"
      @toDelete="deleteData"
    />
    <!-- 编辑 -->
    <EditNewCourse ref="editCourse" />
    <!-- 视频弹框 -->
    <div
      v-if="showV"
      class="videoW"
      @click.self="cloce"
    >
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
import AddNewCourse from './dialog/addNewCourse'
import {
  queryCourseList,
  statusUpdateCourse,
  queryCoursegroup
} from '@/api/teachManage/course'
// import { fetchList } from '@/api/course' // mock
import ThemeManage from './dialog/classThemeManage'
import LessonManage from './dialog/lessonManage'
import CourseName from './side/courseNameSide'
import DeleteCourse from './dialog/deleteCourseSure'
import EditNewCourse from './dialog/editNewCourse'
export default {
  components: {
    CommonSearch,
    CommonTable,
    AddNewCourse,
    ThemeManage,
    LessonManage,
    CourseName,
    DeleteCourse,
    EditNewCourse
  },
  data() {
    return {
      newdialogVisibleouter: false,
      text: [],
      showV: false,
      indexn: 1,
      img: [
        'http://img.ishanshan.com/gimg/user/n///265321467506327553.png',
        'http://img.ishanshan.com/gimg/user/n///265000186051297281.png'
      ],
      formInline: {
        status: '1',
        searchMethod: formValue => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '课程名称',
            modelValue: 'courseName',
            isClearable: true
          },
          {
            itemType: 'select',
            placeholder: '课系',
            modelValue: 'courseGroupId',
            isClearable: true,
            apiService: queryCoursegroup,
            params: {
              pageSize: 99999,
              pageIndex: 0
            },
            labelKey: 'name',
            valueKey: 'id',
            isVisibleList: true
          },
          {
            itemType: 'select',
            placeholder: '状态',
            modelValue: 'status',
            isClearable: true,
            itemStyle: 'width:140px',
            defaultFirst: true,
            default: true,
            allowEmpty: true,
            isVisibleList: true,
            selectOption: [
              {
                label: '已上架',
                value: '1'
              },
              {
                label: '已下架',
                value: '0'
              },
              {
                label: '全部状态',
                value: ''
              }
            ]
          }
        ]
      },

      columns: [
        {
          label: '课程名称',
          prop: 'title',
          formatter: (row, column, cellValue) => {
            return `<div style="color:#1D9DF2;text-overflow:ellipsis;overflow:hidden">${row.title}</div>`
          },
          methods: row => {
            this.openSideDialog(row)
          },
          isShowTooltip: true
        },
        {
          label: '课系',
          prop: 'groupName',
          isShowTooltip: true
        },
        {
          label: '课程状态',
          prop: 'status',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.status && row.status === '1') {//eslint-disable-line
              return `<div>已上架</div>`
            } else{//eslint-disable-line
              return `<div>已下架</div>`
            }
          }
        },
        {
          label: '每节消耗',
          prop: 'cost',
          isShowTooltip: true
        },
        {
          label: '上课月龄/年龄',
          prop: 'age',
          width: '150',
          formatter: (row, column, cellValue) => {
            if (row.ageType === '1') {//eslint-disable-line
              return `<div>${row.minMa} ~ ${row.maxMa}月</div>`
            } else {
              return `<div>${Math.floor(row.minMa / 12)} ~ ${Math.ceil(
                row.maxMa / 12
              )}岁</div>`
            }
          },
          isShowTooltip: true
        },
        {
          label: '消耗类型',
          prop: 'cutTypeStr',
          isShowTooltip: true
        },
        {
          label: '课程介绍',
          prop: 'intro',
          isShowTooltip: true
        },
        {
          label: '创建时间',
          prop: 'createTime',
          isShowTooltip: true
        },
        {
          label: '所属校区',
          prop: 'orgName',
          isShowTooltip: true,
          width: 120
        }
      ], // 表格列
      tableHeight: 'calc(100vh - 235px)', // 表格高度
      pagination: {
        show: true,
        sizes: true
      },
      operates: {
        width: '180',
        fixed: 'right',
        list: [
          {
            label_1: '上架',
            label_2: '下架',
            type: 'unnormal',
            conProp: 'title',
            method: row => {
              var status = ''
              row.status === '1' ? (status = '0') : (status = '1')
              const params = {
                ids: row.id,
                status: status
              }
              statusUpdateCourse(params).then(res => {
                if (res.data.errorCode === 0) {
                  this.$refs.tableCommon.getList()
                  this.$message.success('成功')
                } else if (res.data.proErrorMsgs) {
                  this.text = res.data.proErrorMsgs
                  this.newdialogVisibleouter = true
                } else {
                  this.newdialogVisibleouter = false
                  this.$message.error(res.data.errorMessage)
                }
              })
            },
            popoverCon: [
              {
                contentText: `确认要上架`,
                status: '0'
              },
              {
                contentText: '确认要下架',
                status: '1'
              }
            ],
            isDyData: true
          },
          {
            label: '主题管理',
            type: 'normal',
            method: row => {
              this.themeManageDialog(row)
            }
          }
        ]
      },
      options: {
        apiService: queryCourseList,
        isSettingShow: true,
        params: {
          status: '1'
        }
      },
      courseGroupList: []
    }
  },
  methods: {
    /* 取消处理*/
    cancelContract() {
      this.newdialogVisibleouter = false
    },
    /* 跳合同*/
    contract() {
      this.$router.push({
        name: 'ContractMgr',
        params: { activeTab: 'contractSetmeal' }
      })
      this.newdialogVisibleouter = false
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      const params = {
        title: formValue.courseName,
        courseGroupId: formValue.courseGroupId,
        status: formValue.status
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle() {
      // 重置的入参
      const params = {
        pageIndex: 0,
        status: this.formInline.status
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 新增课程 */
    newCourse() {
      this.$refs.addNewCourse.show()
    },
    /* 打开侧边 */
    openSideDialog(row) {
      this.$refs.side.show(row)
    },
    /* 删除课程 */
    deleteHandle(row) {
      const params = {
        ids: row.id,
        status: '0'
      }
      statusUpdateCourse(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.$message.success(data.errorMessage)
          // this.$refs.tableCommon.getList({ pageIndex: 0 })
          this.$refs.tableCommon.getList()
          setTimeout(() => {
            const numAll = this.$refs.tableCommon.$el.children[0].children[2]
              .textContent
            if (numAll === ' 暂无数据') {
              this.$refs.tableCommon.getList()
            }
          }, 500)
        } else {
          this.$message.error(data.errorMessage || '删除课程失败')
        }
      })
    },
    /* 主题管理 */
    themeManageDialog(row) {
      this.$refs.theme.show(row)
    },
    /* 管理课系 */
    lessonManangeFunc() {
      this.$refs.lesson.show()
    },
    /* 编辑课程 */
    getData(val) {
      this.$refs.editCourse.show(val)
    },
    /* 删除课程 */
    deleteData(val) {
      this.$refs.tableCommon.getList()
      setTimeout(() => {
        const numAll = this.$refs.tableCommon.$el.children[0].children[2]
          .textContent
        if (numAll === ' 暂无数据') {
          this.$refs.tableCommon.getList()
        }
      }, 650)
      this.$refs.deleteCourse.show(val)
    },
    /* 删除更新 */
    getDeleteSure() {
      this.$refs.tableCommon.getList()
      setTimeout(() => {
        const numAll = this.$refs.tableCommon.$el.children[0].children[2]
          .textContent
        if (numAll === ' 暂无数据') {
          this.$refs.tableCommon.getList()
        }
      }, 650)
      this.$refs.side.cancel()
    },
    /* 新增课程 */
    getNewCourse() {
      this.$refs.tableCommon.getList({ pageIndex: 0 })
    },
    maskE() {
      window.open(
        'https://saas.ishanshan.com/thinknode/web/offical/help/1169181616216412160'
      )
    },
    cloce() {
      this.showV = false
    }
  }
}
</script>
<style lang="scss">
.course {
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
  .wrapWI:hover.maskE {
    cursor: pointer;
    color: rgba(29, 157, 242, 0.8);
  }
  .maskI {
    position: absolute;
    top: 21px;
    right: 26px;
    width: 12px;
    height: 12px;
    z-index: 99;
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
  .page_text_text {
    margin: 20px 0;
  }
  .add {
    float: right;
  }
  .styleDelete {
    margin-right: 10px;
    margin-left: -3px;
  }
}
</style>
