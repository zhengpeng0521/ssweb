<template>
  <div class="wrapWall">
    <div class="combo_mgr" style="padding:0 20px">
      <div class="page_title">系统续费</div>
      <CommonTable
        :columns="columns"
        :table-height="tableHeight"
        :options="optionsTab"
      />
    </div>
    <!-- 续费弹框 -->
    <el-dialog
      :visible.sync="centerDialogVisible"
      title="套餐续费"
      width="340px"
      center
    >
      <div style="text-align:center">
        <div class="sameWord">请联系客服续费</div>
        <img src="https://img.ishanshan.com/gimg/n/20190711/dc58ce8b397a0b39f3349b16f6f4db3c" width="80%">
        <div class="tel">客服热线: 400-600-5733</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getInfoList } from '@/api/home/home'
import CommonTable from '@/components/CommonTable/CommonTable'
export default {
  components: {
    CommonTable
  },
  data() {
    return {
      centerDialogVisible: false,
      columns: [
        {
          label: '套餐名称',
          prop: 'mealTitle'
        },
        {
          label: '开始日期',
          prop: 'startDay'
        },
        {
          label: '到期日期',
          prop: 'endDay'
        },
        {
          label: '操作',
          render: (h, params) => {
            return h(
              'div',
              {
                on: {
                  click: () => {
                    this.centerDialogVisible = true
                  }
                }
              },
              [
                h(
                  'div',
                  {
                    style: 'color:#1d9df2;cursor:pointer;'
                  },
                  '续费'
                )
              ]
            )
          }
        }
      ],
      tableHeight: 'calc(100vh - 231px)',
      optionsTab: {
        apiService: getInfoList, // 表格的数据请求接口
        params: { isHome: 0 }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapWall /deep/ .el-dialog__body{
  padding: 20px!important
}
.wrapWall /deep/ .common_table{
  padding-top: 20px
}
.page_title {
    width: 100%;
    padding-top: 20px;
    padding-bottom: 14px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
}
.tel{
  display:inline-block;
  color: #1d9df2;
  font-size: 16px;
  margin-top: 14px
}
.sameWord{
  font-size: 20px;
  color: #666;
  margin-bottom: 20px;
}
</style>
