<template>
  <div
    class="searchStuDialog_container"
  >
    <el-dialog
      :visible.sync="searchStuDialogShow"
      :append-to-body="true"
      :close-on-click-modal="false"
      title="精确查找(在读学员)"
      width="700px"
      @close="close"
    >
      <div class="search">
        <CommonSearch
          :is-inline="true"
          :params="formInline"
          :forms="formInline"
          @toParent="resetFieldHanle"
        />
        <div style="display:inline-block;">
          <span style="display: inline-block;width:8px;height:8px;background-color:#89c708;border-radius: 50px;margin-right: 5px;"/>
          可选
          <el-tooltip placement="top">
            <div slot="content">在读学员未关联会员卡则不可选</div>
            <div style="display: inline-block;margin-left:10px;cursor:pointer">
              <span style="display: inline-block;width:8px;height:8px;background-color: #ff6734;border-radius: 50px;margin-right: 5px;"/>
              <span>不可选</span>
            </div>
          </el-tooltip>
        </div>
      </div>
      <div class="searchTable">
        <!-- 表格 -->
        <CommonTable
          ref="tableCommon"
          :columns="columns"
          :table-height="tableHeight"
          :pagination="listQuery"
          :options="options"
          table-key="readring_account_student"
          @handleRowSelect="stuTableSelect"
        />
      </div>
      <div class="footer">
        已选：<span>{{ selectName }}</span>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          size="mini"
          style="font-size:12px;border-radius:5px;"
          @click="closeSearch"
        >取消</el-button>
        <el-button
          type="primary"
          style="font-size:12px;border-radius:5px;background-color:#46b6ee;border-color:#46b6ee;"
          size="mini"
          class="normal_btn"
          @click="Search"
        >确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import CommonSearch from '../../../../components/CommonSearch/CommonSearch'
import { getZjlCRMStuList } from '../../../../../src/api/crm/studentInfo/readingStu'
import CommonTable from '../../../../components/CommonTable/CommonTable'
export default {
  components: {
    CommonSearch,
    CommonTable
  },
  data() {
    return {
      listQuery: {
        show: true // 是否显示
      },
      options: {
        // noMount: true,
        apiService: getZjlCRMStuList, // 表格的数据请求接口
        isSettingShow: true, // 是否出现设置
        params: {
          sourceType: '1'
        }
      },
      searchStuDialogShow: false,
      columns: [
        {
          label: '姓名',
          prop: 'name',
          isShowTooltip: true,
          width: '120px',
          formatter: (row, column) => {
            // console.log('row', row, column)
            if (row.stuCardId !== '') {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color:#89c708;border-radius: 50px;margin-right: 5px;"></span>
                        ${row.name}
                      </div>`
            } else {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color:#ff6734;border-radius: 50px;margin-right: 5px;"></span>
                        ${row.name}
                      </div>`
            }
          }
        },
        // {
        //   label: '状态',
        //   prop: 'status',
        //   isShowTooltip: true,
        //   formatter: (row, column, cellValue) => {
        //     if (row.status === '0') {//eslint-disable-line
        //       return `<div style="text-overflow:ellipsis;overflow:hidden">
        //                 <span style="display: inline-block;width:8px;height:8px;background-color: rgb(255, 127, 117);border-radius: 50px;margin-right: 5px;"></span>
        //                 ${'待审核'}
        //               </div>`
        //     }
        //     if (row.status === '1') {
        //       return `<div style="text-overflow:ellipsis;overflow:hidden">
        //                 <span style="display: inline-block;width:8px;height:8px;background-color: #87D068;border-radius: 50px;margin-right: 5px;"></span>
        //                 ${'已通过'}
        //               </div>`
        //     }
        //     if (row.status === '2') {
        //       return `<div style="text-overflow:ellipsis;overflow:hidden">
        //                 <span style="display: inline-block;width:8px;height:8px;background-color: rgb(204, 67, 66);border-radius: 50px;margin-right: 5px;"></span>
        //                 ${'已驳回'}
        //               </div>`
        //     }
        //   }
        // },
        {
          label: '昵称',
          prop: 'nickName',
          isShowTooltip: true,
          width: '80px'
        },
        {
          label: '性别',
          prop: 'sex',
          isShowTooltip: true,
          width: '80px',
          formatter: (row, column) => {
            if (row.sex === '1') {
              return `<span>男</sapn>`
            }
            if (row.sex === '2') {
              return `<span>女</sapn>`
            }
          }
        },
        {
          label: '生日',
          prop: 'birthday',
          isShowTooltip: true
        },
        {
          label: '家长姓名',
          prop: 'parentName',
          isShowTooltip: true,
          render: (h, params) => {
            return h('span', {}, [
              h(
                'span',
                params.row.parents &&
                params.row.parents.map((item, index) => {
                  return h('span', item.name + ' ')
                })
              )
            ])
          }
        },
        {
          label: '手机号',
          prop: 'title',
          isShowTooltip: true,
          render: (h, params) => {
            return h('span', {}, [
              h(
                'el-popover',
                {
                  props: { placement: 'top', trigger: 'hover' }
                },
                [
                  h(
                    'span',
                    params.row.parents &&
                    params.row.parents.length > 0 &&
                    params.row.parents.map(item => {
                      return h(
                        'span',
                        item.name + ':' + item.mobile + ' ' + ','
                      )
                    })
                  ),
                  h('a', ' ' + '拨打'),
                  h('a', { slot: 'reference' }, '查看')
                ]
              )
            ])
          }
        }
      ],
      tableHeight: '300px',
      selectName: '',
      selectParentsName: '',
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '学员名称',
            modelValue: 'name',
            isClearable: true
          },
          {
            itemType: 'input',
            placeholder: '昵称',
            modelValue: 'nickName',
            isClearable: true
          },
          {
            itemType: 'input',
            placeholder: '家长手机号',
            modelValue: 'mobile',
            isClearable: true
          }
        ]
      },
      formValue: {},
      row: {}
    }
  },
  methods: {
    stuTableSelect(row) {
      if (row.stuCardId !== '') {
        this.selectName = row.name
        this.row = row
        if (row.parents.length > 0) {
          this.parentsName = row.parents[0].name
        } else {
          this.parentsName = ''
        }
      }
    },
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      const params = {
        ...this.formValue
        // outStuName: this.formInline.outStuName,
        // outParentMobile: this.formInline.outParentMobile,
        // status: this.formInline.status
      }
      this.$refs.tableCommon.getList(params)
    },
    showDialog() {
      this.searchStuDialogShow = true
    },
    Search() {
      this.searchStuDialogShow = false
      this.$emit('getName', this.selectName, this.parentsName, this.row)
    },
    close() {
      this.searchStuDialogShow = false
    },
    closeSearch() {
      this.searchStuDialogShow = false
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        pageIndex: 0
      }
      this.formValue = {}
      this.$refs.tableCommon.getList(params)
    }

  }
}
</script>
<style scoped  lang="scss">
//搜索栏样式
.search /deep/{
  display: flex;
  justify-content: space-between;
  .el-input--mini .el-input__inner{
    width:110px;
  }
  .el-input--suffix .el-input__inner{
    padding-right:0px;
  }
  .el-button--mini, .el-button--mini.is-round{
    padding: 6px 12px;
  }
  .el-button--mini, .el-button--small{
    border-radius:5px;
  }
  .el-button--primary{
    background-color:#46b6ee;
    border-color: #46b6ee;
  }

}
</style>
