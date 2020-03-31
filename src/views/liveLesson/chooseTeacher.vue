<template>
  <div >
    <el-dialog
      :visible.sync="chooseTeacherDialogShow"
      :close-on-click-modal="false"
      title="选择老师"
      width="400px"
      @close="cancelDialog()"
    >
      <el-form label-width="100px">
        <el-form-item
          label="选择老师："
          prop="teacher"
          label-width="100px"
        >
          <el-select
            v-model="id"
            placeholder="请选择"
            clearable
            filterable
            style="width:100%"
            @change="turnChange(id)"
          >
            <el-option
              v-for="item in userList"
              :key="item.id"
              :disabled="isHasChoose(item)"
              :label="item.name"
              :value="item.id"
              item
            >
              <template v-if="isHasChoose(item)">
                {{ item.name }}
                <span style="margin-left:10px;color:#F56C6C">已添加</span>
              </template>
              <template v-else>
                {{ item.name }}
              </template>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog()"
        >取 消</el-button>

        <el-button
          type="primary"
          style="float:right"
          @click="save()"
        >保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import {
  tenantUserSummaryQuery
} from '@/api/nurseryClass/gradeManage'
// import {
//   // summaryQueryUsers,
//   createStu,
//   getStuMsg // 学员详情
// } from '@/api/crm/studentInfo/readingStu.js'
export default {
  components: {

  },
  props: {
    teacherList: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      chooseTeacherDialogShow: false,
      userList: [],
      id: '',
      teacherInfo: {

      }

    }
  },
  methods: {

    /* 显示弹框 */
    showDialog() {
      this.id = ''
      this.chooseTeacherDialogShow = true
      this.getTeacherList()
    },
    // 是否可选
    isHasChoose(val) {
      return this.teacherList.some(item => {
        if (item.uid === val.id) {
          return true
        }
      })
    },
    // 加载列表
    getTeacherList() {
      tenantUserSummaryQuery().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.userList = data.results
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 关闭弹框 */
    cancelDialog() {
      this.chooseTeacherDialogShow = false
    },
    save() {
      this.chooseTeacherDialogShow = false
      this.$emit('addTeacherRow', this.teacherInfo)
    //   this.addTeacherRow(this.teacherInfo)
    },

    turnChange(val) {
      this.teacherInfo = {
        id: val,
        name: ''
      }
      this.userList.forEach((item) => {
        if (item.id === val) {
          this.teacherInfo.name = item.name
        }
      })
    }

  }
}
</script>
