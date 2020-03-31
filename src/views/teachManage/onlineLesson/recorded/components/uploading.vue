<template>
  <!-- 弹出框 -->
  <el-dialog :visible.sync="centerDialogVisible" title="上传进度" width="600px" center>
    <!-- 表格 -->
    <common-table
      ref="tableCommon"
      :columns="column"
      :options="options"
    />
    <div slot="footer" class="dialog-footer">
      <el-button type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import CommonTable from '@/components/CommonTable/CommonTable' // 右侧弹出框样式

export default {
  components: {
    CommonTable
  },
  data() {
    return {
      centerDialogVisible: false,
      column: [
        {
          label: '视频名称',
          prop: 'name',
          isShowTooltip: true
        },
        {
          label: '视频大小',
          prop: 'desc',
          isShowTooltip: true
        },
        {
          label: '所属课件',
          prop: 'vedioNum',
          isShowTooltip: true
        },
        {
          label: '所属章节',
          prop: 'status',
          isShowTooltip: true
        },
        {
          label: '上传进度',
          prop: 'uname',
          isShowTooltip: true
        },
        {
          label: '操作',
          render: (h, params) => {
            return h(
              'div',
              {
                on: {
                  click: () => {
                    // this.centerDialogVisible = true
                  }
                }
              },
              [
                h(
                  'div',
                  {
                    style: 'color:#46B6EE;cursor:pointer;'
                  },
                  '取消上传'
                )
              ]
            )
          }
        }
      ],
      options: {
        apiService: ''
      },
      idx: '',
      type: '新增课件',
      study: '新增课件',
      sideDialogShows: false,
      list: [
        {
          title: '第一',
          con: [
            '01.色彩的构成1',
            '01.色彩的构成1',
            '01.色彩的构成1',
            '01.色彩的构成1'
          ],
          showcont: true
        },
        { title: '第二', con: ['789', '111'], showcont: false }
      ]
    }
  },
  methods: {
    showDialog() {
      this.centerDialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

