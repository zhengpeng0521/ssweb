<template>
  <div class="newCourse">
    <el-dialog
      :visible.sync="newdialogVisible"
      :close-on-click-modal="false"
      title="班级信息"
      width="600px"
      @close="cancel"
    >
      <div class="form">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item
            label="所属课程："
            prop="courseId"
          >
            <el-select
              v-model="ruleForm.courseId"
              style="width:100%"
              placeholder="请选择所属课程"
              filterable
              @change="courseChange"
            >
              <el-option
                v-for="item of lessonDeptList"
                :key="item.id"
                :label="item.title"
                :value="item.id +','+item.couClassNum+','+item.title+','+item.groupName"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="所属课系："
            prop="courseLevel"
          >
            <el-input
              v-model="ruleForm.courseLevel"
              disabled
              style="width:100%"
            />
          </el-form-item>
          <el-form-item
            label="班级名称："
            prop="name"
          >
            <el-input
              v-model="ruleForm.name"
              placeholder="请输入班级名称"
              style="width:100%"
            />
          </el-form-item>
          <el-form-item
            label="主教："
            prop="mainTeacherIds"
          >
            <el-select
              v-model="ruleForm.mainTeacherIds"
              :clearable="true"
              style="width:100%"
              multiple
              filterable
              placeholder="请选择主教"
            >
              <el-option
                v-for="item in teachList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="助教："
            prop="assistantTeacherIds"
          >
            <el-select
              v-model="ruleForm.assistantTeacherIds"
              style="width:100%"
              multiple
              filterable
              placeholder="请选择助教"
            >
              <el-option
                v-for="item in teachList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="班主任："
            prop="topTeacher"
          >
            <el-select
              v-model="ruleForm.topTeacher"
              style="width:100%"
              placeholder="请选择班主任"
              filterable
            >
              <el-option
                v-for="item in teachList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="人数上限："
            prop="maxNum"
          >
            <el-input
              v-model="ruleForm.maxNum"
              style="width:100%"
              placeholder="请输入人数上限"
            />
          </el-form-item>
          <el-form-item
            label="备注"
            prop="remarks"
          >
            <el-input
              v-model="ruleForm.remarks"
              style="width:100%"
              type="textarea"
              placeholder="请输入备注"
            />
          </el-form-item>
        </el-form>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancel('ruleForm')"
        >取消</el-button>
        <el-button
          type="primary"
          @click="sure('ruleForm')"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { courseSummaryQuery, tenantUserSummaryQuery, addClassGrade } from '@/api/teachManage/grade'
export default {
  data() {
    /* 校验最大人数*/
    var checkMaxNum = (rule, value, callback) => {
      if (!(/^[1-9][0-9]*$/.test(value))) {
        callback('只能输入正整数')
      } else {
        callback()
      }
    }
    return {
      newdialogVisible: false, // 新增课程显示
      ruleForm: {
        courseId: '', // 所属课程
        courseLevel: '', // 所属课系
        name: '', // 班级名称
        mainTeacherIds: [], // 主教
        assistantTeacherIds: [], // 助教
        topTeacher: '', // 班主任
        maxNum: '', // 人数上限
        remarks: '' // 备注
      },
      rules: {
        courseId: [
          { required: true, message: '请选择所属课程', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入班级名称', trigger: 'change' }
        ],
        mainTeacherIds: [
          { required: true, message: '请选择主教', trigger: 'change' }
        ],
        maxNum: [
          { required: true, message: '请输入人数上限', trigger: 'change' },
          { validator: checkMaxNum }
        ]
      },
      isDisabled: false,
      lessonDeptList: [], // 所属课程列表
      teachList: [] // 员工列表
    }
  },
  methods: {
    show() {
      this.newdialogVisible = true
      this.getCourseList()
      this.getUserlist()
    },
    /* 获取课程列表 */
    getCourseList() {
      courseSummaryQuery().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.lessonDeptList = data.results
        } else {
          this.$message.error(data.errorMessage || '获取课程列表失败')
        }
      })
    },
    /* 获取员工列表 */
    getUserlist() {
      tenantUserSummaryQuery().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.teachList = data.results
        } else {
          this.$message.error(data.errorMessage || '获取员工列表失败')
        }
      })
    },
    courseChange(val) {
      if (val) {
        const data = val.split(',')
        const name = data[2]
        const num = Number(data[1])
        this.ruleForm.courseLevel = data[3]
        this.ruleForm.name = name + ' ' + Number(num + 1) + '班'
      }
    },
    cancel() {
      this.newdialogVisible = false
      this.$refs['ruleForm'].clearValidate() // 清除校验
      this.$refs['ruleForm'].resetFields()
    },
    sure(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const mainTeacherIds = this.ruleForm.mainTeacherIds ? this.ruleForm.mainTeacherIds.join(',') : ''
          const assistantTeacherIds = this.ruleForm.assistantTeacherIds ? this.ruleForm.assistantTeacherIds.join(',') : ''
          const courseId = this.ruleForm.courseId ? this.ruleForm.courseId.split(',')[0] : ''
          for (const i in this.ruleForm.mainTeacherIds) {
            for (const j in this.ruleForm.assistantTeacherIds) {
              if (this.ruleForm.mainTeacherIds[i] === this.ruleForm.assistantTeacherIds[j]) {
                this.$message.error('主教和助教不能包含同一人')
                return
              }
            }
          }
          const params = {
            courseId: courseId,
            name: this.ruleForm.name,
            mainTeacherIds: mainTeacherIds,
            assistantTeacherIds: assistantTeacherIds,
            maxNum: this.ruleForm.maxNum,
            remarks: this.ruleForm.remarks,
            topTeacher: this.ruleForm.topTeacher
          }
          addClassGrade(params).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.newdialogVisible = false
              this.$refs[formName].resetFields()
              this.$message.success(data.errorMessage)
              this.$emit('toAddGrade', true)
            } else {
              this.$message.success(data.errorMessage || '新增班级失败')
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.newCourse /deep/ {
  .explain {
    color: rgba(0, 0, 0, 0.43);
    font-size: 12px;
  }
  .el-radio + .el-radio {
    margin-right: 16px;
  }
  .tip_content {
    font-size: 12px;
    text-align: left;
  }
}
</style>
