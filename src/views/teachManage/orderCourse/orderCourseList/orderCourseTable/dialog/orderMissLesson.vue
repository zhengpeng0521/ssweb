<template>
  <div class="updateSignType">
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      title="预约补课"
      width="400px"
      @close="resetForm"
    >
      <div>
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
        >
          <el-form-item prop="stuId">

            <StuSelect v-model="ruleForm.stuId" />

          </el-form-item>
        </el-form>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="resetForm('ruleForm')"
        >取消</el-button>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >确定</el-button>
      </span>
    </el-dialog>

    <!-- 是否继续约课 -->
    <OrderCourseContinue
      ref="orderCourseContinue"
      @toContinueOrder="getContinueOrder"
    />
  </div>
</template>
<script>
import StuSelect from '@/components/StuSelect'
import { stuSummaryQuery, stuMulCreate, stuCheckBirthday } from '@/api/teachManage/orderCourse'
import OrderCourseContinue from './orderCourseContinue'
export default {
  components: {
    StuSelect,
    OrderCourseContinue
  },
  data() {
    return {
      dialogVisible: false,
      ruleForm: {
        stuId: '' // 学员
      },
      rules: {
        stuId: [
          { required: true, message: '请选择学员', trigger: 'blur' }
        ]
      },
      newStuList: [], // 学员列表
      isShow: false,
      rowInfo: {}, // 该条详细信息
      detailList: {} // 详情
    }
  },
  methods: {
    show(val, detail) {
      this.rowInfo = val
      this.detailList = detail
      this.dialogVisible = true
      this.ruleForm.stuId = ''
      this.selectName = ''
      if (this.detailList) {
        this.getStuList()
      }
    },
    /* 学员列表 */
    getStuList() {
      this.newStuList = []
      stuSummaryQuery({ type: '2' }).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          const stuList = data.results
          stuList.map((item, index) => {
            const stuObj = {}
            let name = ''
            if (this.detailList.courseAgeType == '1') { //eslint-disable-line
              name = item.stuName + '(' + item.month + '月)'
            } else {
              name = item.stuName + '(' + Math.floor(item.month / 12) + '岁)'
            }
            stuObj.stuName = name
            stuObj.stuId = item.stuId
            this.newStuList.push(stuObj)
            this.newStuList.forEach((item) => {
              if (item.stuId === this.ruleForm.stuId) {
                this.selectName = item.stuName
              }
            })
          })
        } else {
          this.$message.error(data.errorMessage || '获取学员摘要列表失败')
        }
      })
    },
    /* 预约补课 */
    getCreateStu() {
      const params = {
        cpdIds: this.detailList.cpdId,
        cpmId: this.detailList.cpmId,
        stuId: this.ruleForm.stuId
      }
      stuMulCreate(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.dialogVisible = false
          this.$message.success(data.errorMessage)
          this.$emit('toUpdateOnceOrder', this.detailList)
        } else {
          this.$message.error(data.errorMessage || '预约补课失败')
        }
      })
    },
    /* 继续约课 */
    getContinueOrder() {
      this.getCreateStu()
      this.dialogVisible = false
    },
    /* 确定 */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const payload = {
            cpmId: this.detailList.cpmId,
            stuId: this.ruleForm.stuId
          }
          stuCheckBirthday(payload).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.getCreateStu()
            } else if (data.errorCode > 0) {
              this.$refs.orderCourseContinue.show(data.errorMessage)
            } else {
              this.$message.error(data.errorMessage || '学员年龄校验失败')
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.dialogVisible = false
      this.ruleForm.stuId = ''
    }

  }
}
</script>
<style lang="scss" scoped>
// .search {
//   color: #46b6ee;
//   cursor: pointer;
//   float: right;
// }
 .selectname{
    display: inline-block;
    border:1px solid #dcdfe6;
    border-radius: 4px;
    width: 293px;
    height: auto;
    min-height: 28px;
    padding-left: 20px;
  }
.search {
      color: #46b6ee;
    cursor: pointer;
    margin-left: 10px;
    display: inline-block;
    position: absolute;
    top: 0px;
    right: 75px
}
</style>
