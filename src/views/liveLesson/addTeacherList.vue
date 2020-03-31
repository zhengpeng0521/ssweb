<template>
  <div>
    <el-dialog
      :visible.sync="addTeacherDialogShow"
      :close-on-click-modal="false"
      title="添加老师"
      width="400px"
      @close="cancelDialog()"
    >
      <!-- :title="titleChangeDialog" -->
      <div>

        <div class="btn">
          <!-- <el-button
            type="primary"
            size="mini"
            @click="addTeacher()"
          >添加老师</el-button> -->
          <div class="addBtn">
            <img src="https://img.ishanshan.com/gimg/n/20190322/e6c073e90ca20cf3ec74d6e580c35efb" @click="addTeacher()">
            <span class="add_text" @click="addTeacher()">
              添加老师
            </span>
          </div>
          <div style="color:#F56C6C;font-size:12px; margin-top:10px;">注：需在该处添加老师后新建直播时可选择该列表内老师</div>
        </div>
        <div class="joinTableRow">
          <el-table
            :data="teacherList"
            style="width: 350px"
            border
          >
            <el-table-column
              label="老师姓名"
              prop="uname"

            >
              <template slot-scope="scope">
                <span>{{ scope.row.uname }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="操作"
            >
              <template slot-scope="scope">
                <!-- <el-button
                  type="text"
                  @click="deleteTableRow(scope.row)"
                >删除</el-button> -->
                <span style="color:#1D9DF2;font-size:14px;cursor:pointer;" @click="deleteTableRow(scope.$index,scope.row)">移除</span>
              </template>
            </el-table-column>
          </el-table>
          <!-- <span
            style="color: #5d9cec; cursor: pointer"
            @click="addReturnRow"
          >新增</span> -->

        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <!-- <el-button
          class="cancel_btn"
          @click="cancelDialog()"
        >取 消</el-button> -->

        <el-button
          type="primary"
          @click="save()"
        >关 闭</el-button>
      </span>
    </el-dialog>
    <ChooseTeacher
      ref="chooseTeacher"
      :teacher-list="teacherList"
      @addTeacherRow ="addTeacherRow"
    />
  </div>
</template>

<script>

import ChooseTeacher from './chooseTeacher'
import { queryTeacher, operateTeacher } from '../../api/online/liveLesson'
// import { mapMutations, mapState, mapActions } from 'vuex'
export default {
  components: {
    ChooseTeacher
  },
  props: {

  },
  data() {
    return {
      addTeacherDialogShow: false,
      addRowTable: [],
      teacherList: []
    }
  },
  // computed: {
  //   ...mapState('liveLessen', [
  //     'teacherList'
  //   ])

  // },
  methods: {
    // ...mapMutations('liveLessen', [
    //   'SHOW_LOADING',
    //   'HIDE_LOADING',
    //   'UPDATE_STATE'
    // ]),
    // ...mapActions('liveLesson', [
    //   'queryTeacher'
    // ]),
    /* 显示弹框 */
    showDialog() {
      // console.log('row', row)
      this.addTeacherDialogShow = true

      this.queryTeacherList()
    },
    queryTeacherList() {
      const params = {
        tenantId: this.$store.getters.tenantId,
        orgId: this.$store.getters.orgId,
        uid: this.$store.getters.id
      }
      queryTeacher(params).then(res => {
        // console.log('res', res)
        this.teacherList = res.data.results.map(item => {
          // item.qrCode = this.genQrCode(item.themeId, item.instId)
          return item
        })
      })
    },
    /* 关闭弹框 */
    cancelDialog() {
      this.addTeacherDialogShow = false
    },
    save() {
      this.addTeacherDialogShow = false
    },
    addTeacher() {
      this.$refs.chooseTeacher.showDialog()
    },
    deleteTableRow(index, row) {
      this.addRowTable.splice(index, 1)
      const params = {
        tid: row.uid,
        status: '0'
      }
      operateTeacher(params).then(res => {
        if (res && res.data.errorCode === 0) {
          this.$message.success('删除成功')
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
      this.queryTeacherList()
    },
    addTeacherRow(row) {
      // console.log('row', row)
      const rowData = {
        id: row.id, // 转入课程信息
        name: row.name // 转入课时总数量
      }
      this.addRowTable.push(rowData)
      const params = {
        tid: row.id,
        status: '1'
      }
      operateTeacher(params).then(res => {
        if (res && res.data.errorCode === 0) {
          this.$message.success('添加成功')
        } else {
          this.$message.error(res.data.errorMessage)
        }
        // this.teacherList = res.data.results.map(item => {
        //   // item.qrCode = this.genQrCode(item.themeId, item.instId)
        //   return item
        // })
      })
      this.queryTeacherList()
    }

  }
}
</script>

<style lang="scss" scoped>
.addBtn{
  display: flex;
  cursor: pointer;
  .add_text{
    font-size: 14px;
    color: #46B6EE;
    margin-left: 6px;
  }
}
.joinTableRow /deep/{
  margin-bottom: 20px;
.el-table__body-wrapper{
  max-height: 176px;
    overflow-y: auto;
    overflow-x: hidden;
}
  .el-table th.is-leaf{
       background-color: rgba(240, 242, 245, 0.6)
 }
.el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{
  border-right: none;
}
.el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell{
   padding-left: 60px;
}
  .cell{
        color: #666666;
    font-weight: 400;
    padding-left: 60px;
  }
}
</style>

