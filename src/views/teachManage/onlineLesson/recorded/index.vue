<template>
  <div class="page_box">
    <!-- 页面标题 -->
    <div class="page_title">
      录播课程
    </div>

    <!-- 提示 -->
    <el-alert
      class="recorded_tip"
      title="温馨提示：学员可在闪闪时光宝——“我的”页面内查看上传课件"
      type="warning"/>
    <div class="btnOperate">
      <el-button type="primary" class="add_btn" @click="goAdd">新增课件</el-button>

      <CommonSearch
        :is-inline="true"
        :params="formInline"
        :forms="formInline"
        @toParent="resetFieldHanle"
      />

    </div>
    <!-- 表格 -->
    <common-table
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="pagination"
      :options="options"
      :operation="operates"
    />
    <!--  课件详情 -->
    <LessonDialog ref="lessonDialog" />
  </div>

</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { tenantUserSummaryQuery } from '@/api/nurseryClass/gradeManage'
import CommonTable from '@/components/CommonTable/CommonTable'
import CommonSearch from '@/components/CommonSearch/CommonSearch'
import LessonDialog from './components/lessonDialog' // 课件详情
import {
  queryCourseWare
} from '@/api/teachManage/onlineLesson'

export default {
  components: {
    CommonTable,
    LessonDialog,
    CommonSearch
  },

  data() {
    return {
      formInline: {
        searchMethod: formValue => {
          this.searchHandle(formValue)
        },
        date: [
          this.$moment().format('YYYY-MM-DD'),
          this.$moment().format('YYYY-MM-DD')
        ],
        forms: [
          {
            itemType: 'input',
            placeholder: '请输入课件名称',
            modelValue: 'name',
            isClearable: true,
            itemStyle: 'width:140px'
          },
          {
            itemType: 'select',
            placeholder: '请选择课件类型',
            modelValue: 'type',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              // { value: '', label: '全部' },
              { value: '1', label: '公开课' },
              { value: '2', label: '会员课' }

            ]
          },
          {
            itemType: 'select',
            placeholder: '请选择上架状态',
            modelValue: 'status',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              // { value: '', label: '全部' },
              { value: '1', label: '上架' },
              { value: '2', label: '下架' }

            ]
          },
          {
            itemType: 'select',
            placeholder: '请选择创建人',
            modelValue: 'userId',
            isFilterable: true,
            isClearable: true,
            apiService: tenantUserSummaryQuery,
            itemStyle: 'width:140px',
            labelKey: 'name',
            valueKey: 'id'
          }
        ]
      },
      columns: [
        {
          label: '课件名称',
          prop: 'name',
          formatter: (row) => {
            return `<div style="color:#1D9DF2;text-overflow:ellipsis;overflow:hidden">${row.name}</div>`
          },
          methods: row => {
            this.$refs.lessonDialog.showDialog(row)
          },
          isShowTooltip: true
        },
        {
          label: '课件描述',
          prop: 'desc',
          isShowTooltip: true,
          width: '160px'
        },
        {
          label: '课件类型',
          prop: 'type',
          isShowTooltip: true,
          width: '120px',
          formatter: (row) => {
            if (row.type === 1) {
              return `<div>公开课</div>`
            } else {
              return `<div>会员课</div>`
            }
          }
        },
        {
          label: '视频数',
          prop: 'vedioNum',
          isShowTooltip: true,
          formatter: (row) => {
            if (row.vedioNum) {
              return `<div>${row.vedioNum}</div>`
            } else {
              return `<div>0</div>`
            }
          }
        },
        {
          label: '上架状态',
          prop: 'status',
          isShowTooltip: true,
          formatter: (row) => {
            if (row.status === '1') {
              return `<div>上架</div>`
            } else {
              return `<div>下架</div>`
            }
          }
        },
        {
          label: '创建人',
          prop: 'uname',
          isShowTooltip: true
        },
        {
          label: '创建时间',
          prop: 'createTime',
          isShowTooltip: true,
          width: '180px'
        }
      ], // 表格列
      tableHeight: 'calc(100vh - 285px)', // 表格高度
      pagination: {
        show: true,
        sizes: true
      },
      operates: {
        width: '180',
        fixed: 'right',
        list: [
          {
            label: '编辑',
            type: 'normal',
            method: this.goEdit
          },
          {
            label_1: '上架',
            label_2: '下架',
            type: 'unnormal',
            conProp: 'title',
            method: this.showOrHide,
            popoverCon: [
              {
                contentText: `确认要上架`,
                status: '2'
              },
              {
                contentText: '确认要下架',
                status: '1'
              }
            ],
            isDyData: true
          },
          {
            label: '删除',
            type: 'normal',
            class: 'styleDelete',
            method: this.onRemove,
            popoverCon: [
              {
                contentText: '确定要删除？'
              }
            ]
          }
        ]
      },
      options: {
        apiService: queryCourseWare
      }
    }
  },

  methods: {
    ...mapMutations('recorded', [
      'UPDATE_STATE'
    ]),
    ...mapActions('recorded', [
      'updateCourseWare'
    ]),
    /* 搜索 */
    searchHandle(formValue) {
      this.formValue = formValue
      console.log('formValue', formValue)
      // 搜索的入参

      const params = {
        name: this.formValue.name,
        type: Number(this.formValue.type),
        status: this.formValue.status,
        userId: this.formValue.userId
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        pageIndex: 0

      }
      this.formValue = {}
      this.$refs.tableCommon.getList(params)
    },

    // 跳转新增页面
    goAdd() {
      this.$router.push('/addCourseWare')
    },

    // 跳转编辑页面
    goEdit(row) {
      this.UPDATE_STATE({ editItem: row, courseId: row.id })
      this.$router.push('/editCourseWare')
    },

    /** 刷新列表 */
    refresh() {
      this.$refs.tableCommon.getList()
    },

    /** 删除课件 */
    onRemove(row) {
      const params = {
        id: row.id,
        name: row.name,
        desc: row.desc,
        url: row.url,
        status: '0'
      }

      this.updateCourseWare({ params, refresh: this.refresh })
    },

    /** 上下架 */
    showOrHide(row) {
      const status = row.status === '1' ? '2' : '1'
      const params = {
        id: row.id,
        name: row.name,
        desc: row.desc,
        url: row.url,
        status
      }

      this.updateCourseWare({ params, refresh: this.refresh })
    }
  }
}
</script>

<style lang="scss" scoped>
.page_box {
  padding: 20px 20px 0;
  .page_title {
    font-weight: 500;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(238, 238, 238, 1);
    margin-bottom: 10px;
    padding-left: 0;
    color: #333;
  }
  .btnOperate{
    display: flex;
    align-items: center;
  }
  .commonSearch {
    // display: inline-block;
    margin-left: 20px;
    margin-top: 21px;
  }
}

.recorded_tip /deep/{
  color: #666;
  background: rgba(247, 176, 70, 0.2);
  border: none;
  line-height: 24px;
  font-weight: 400;
  color: #333333;

  .el-alert__title{
    font-size: 14px;
  }
}

// .add_btn{
//   margin: 20px 0 17px 0;
// }
</style>
