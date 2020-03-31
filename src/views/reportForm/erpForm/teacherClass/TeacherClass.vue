<template>
  <div class="teacher_class">
    <FormSearch
      ref="formSearch"
      v-bind="formSearchProps"
      :loading="loading"
    />
    <div class="tables_box">
      <CommonTable
        ref="sourceType"
        :columns="columns"
        :is-border="true"
        :table-height="'100px'"
        :table-loading="loading"
        :data-source="total"
      />

      <div
        v-for="(subject, index) in monthList"
        :key="'subject'+index"
      >
        <CommonTable
          :columns="subjectCols"
          :is-border="true"
          :table-loading="loading"
          :data-source="subject.teacherItems"
          :stripe="false"
          :span-method="spanMethod"
          class="table_top"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import moment from 'moment'
import FormSearch from '@/components/ReportForm/FormSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import FormTable from '@/components/ReportForm/FormTable'

export default {
  components: {
    FormSearch,
    CommonTable,
    FormTable
  },

  data() {
    const now = moment()
    const params = {
      date: now.format('YYYY-MM')
    }

    return {
      formSearchProps: {
        mediaWidth: 980,
        DateType: 'month',
        searchHandle: this.makeForm
      },
      columns: [
        {
          label: '统计类型',
          prop: 'countType',
          isShowTooltip: true
        }, {
          label: '带班数',
          prop: 'clsNum',
          isShowTooltip: true
        }, {
          label: '班级人数',
          prop: 'stuNum',
          isShowTooltip: true
        }, {
          label: '满班数',
          prop: 'fullClsNum',
          isShowTooltip: true
        }, {
          label: '满班率',
          prop: 'fullClsPercent',
          isShowTooltip: true
        }, {
          label: '班容率',
          prop: 'clsPercent',
          isShowTooltip: true
        }, {
          label: '一人班',
          prop: 'oneFullCls',
          isShowTooltip: true
        }, {
          label: '学员出勤率',
          prop: 'stuSignPer',
          width: '120px',
          isShowTooltip: true
        }
      ],
      subjectCols: [
        {
          label: '科目',
          prop: 'courseName',
          isShowTooltip: true
        }, {
          label: '带班老师',
          prop: 'username',
          isShowTooltip: true
        }, {
          label: '带班数',
          prop: 'clsNum',
          isShowTooltip: true
        }, {
          label: '班级人数',
          prop: 'stuNum',
          isShowTooltip: true
        }, {
          label: '满班数',
          prop: 'fullClsNum',
          isShowTooltip: true
        }, {
          label: '满班率',
          prop: 'fullClsPercent',
          isShowTooltip: true
        }, {
          label: '班容率',
          prop: 'clsPercent',
          isShowTooltip: true
        }, {
          label: '一人班',
          prop: 'oneFullCls',
          isShowTooltip: true
        }, {
          label: '学员出勤率',
          prop: 'stuSignPer',
          width: '120px',
          isShowTooltip: true
        }
      ],
      searchValue: params
    }
  },

  computed: {
    ...mapState('teacherClass', [
      'loading',
      'total',
      'monthList'
    ])
  },

  mounted() {
    this.getTeacherClassList(this.searchValue)
  },

  methods: {
    ...mapActions('teacherClass', ['getTeacherClassList']),

    /** 生成报表 */
    makeForm(values) {
      this.searchValue = values
      this.getTeacherClassList(values)
    },

    /** 合并列 */
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.userId + '' === '0' && row.username === '总计') {
        if (columnIndex === 0) {
          return [1, 2]
        } else if (columnIndex === 1) {
          return [0, 0]
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table_top /deep/ {
  margin-top: 20px;
  .el-table td {
    border-bottom: 1px solid #ebeef5;
  }
}
.tables_box {
  height: calc(100vh - 130px);
  overflow: auto;
  margin-right: -10px;
  padding-right: 10px;
}
.teacher_class /deep/ {
  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background-color: #ebeef5;
  }
}
</style>
