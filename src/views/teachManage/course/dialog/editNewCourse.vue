<template>
  <div class="newCourse">
    <el-dialog
      :visible.sync="newdialogVisibleTow"
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
          @click="cancelCompact"
        >取消</el-button>
        <el-button
          type="primary"
          @click="compact"
        >前去处理</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="newdialogVisible"
      title="课程信息"
      width="600px"
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
            label="课程名称："
            prop="title"
          >
            <el-input
              v-model="ruleForm.title"
              placeholder="请输入课程名称"
            />
          </el-form-item>
          <el-form-item
            label="课程课系："
            prop="groupName"
          >
            <el-select
              v-model="ruleForm.groupName"
              placeholder="请选择课系"
              filterable
            >
              <el-option
                v-for="item of groupList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="学员大小："
            prop="ageType"
          >
            <el-radio-group
              v-model="ruleForm.ageType"
              @change="ageTypeChange"
            >
              <el-radio label="1">月龄</el-radio>
              <el-radio label="2">年龄</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="ruleForm.ageType == '1'">
            <el-form-item
              label="最小月龄："
              prop="minMonth"
            >
              <el-input
                :min="0"
                v-model="ruleForm.minMonth"
                type="number"
                placeholder="最小上课月龄"
                style="width:178px"
              />
            </el-form-item>
            <el-form-item
              label="最大月龄："
              prop="maxMonth"
            >
              <el-input
                :min="ruleForm.minMonth"
                v-model="ruleForm.maxMonth"
                placeholder="最大上课月龄"
                type="number"
                style="width:178px"
              />
            </el-form-item>
          </div>
          <div v-if="ruleForm.ageType == '2'">
            <el-form-item
              label="最小年龄："
              prop="minYear"
            >
              <el-input
                :min="0"
                v-model="ruleForm.minYear"
                type="number"
                placeholder="最小上课年龄"
                style="width:178px"
              />
            </el-form-item>
            <el-form-item
              label="最大年龄："
              prop="maxYear"
            >
              <el-input
                :min="1"
                v-model="ruleForm.maxYear"
                placeholder="最大上课年龄"
                type="number"
                style="width:178px"
              />
            </el-form-item>
          </div>
          <el-form-item
            label="每节消耗："
            prop="cost"
          >
            <el-input
              :min="0"
              v-model="ruleForm.cost"
              disabled
              type="number"
              placeholder="填写每节课程所需的课时数"
              style="width:178px"
            />
            <div class="explain">非负数，可精确到小数后2位，一旦保存不可修改</div>
          </el-form-item>
          <el-form-item
            label="耗课类型："
            prop="costType"
          >
            <el-radio-group
              v-model="ruleForm.costType"
              disabled
            >
              <el-radio label="0">可消耗专用课时，也可消耗通用课时</el-radio>
              <el-radio label="1">只消耗专用课时</el-radio>
            </el-radio-group>
            <el-popover
              placement="right"
              trigger="hover"
            >
              <div class="tip_content">
                <div>1.第一种方式，适用于当前课程消课先扣减专用课时，再扣减通用课时的情况</div>
                <div>2.第二种方式，适用于该课程消课时候仅扣减专用课时</div>
              </div>
              <i
                slot="reference"
                class="iconfont icon_ym_ts"
                style="color:#666;"
              />
            </el-popover>
            <div class="explain">一旦保存不可修改</div>
          </el-form-item>
          <el-form-item label="课程状态：">
            <el-radio-group
              v-model="ruleForm.status"
              @change="upDownTypeChange"
            >
              <el-radio label="1">上架</el-radio>
              <el-radio label="0">下架</el-radio>
            </el-radio-group>
            <el-popover
              placement="right"
              trigger="hover"
            >
              <div class="tip_content">
                <div>课程处于“下架”状态时，添加/编辑合同套餐、</div>
                <div>添加班级、新建排课约课不可选择该课程，</div>
                <div>新建合同时不能选择含该课程的合同套餐，</div>
                <div>学员账户不可赠课该课程，转校不可选择该课程；</div>
                <div>可正常考勤已排课程，学员账户可正常转课该课程</div>
              </div>
              <i
                slot="reference"
                class="iconfont icon_ym_ts"
                style="color:#666;"
              />
            </el-popover>
          </el-form-item>
          <el-form-item
            label="课程介绍："
            prop="intro"
          >
            <el-input
              v-model="ruleForm.intro"
              placeholder="填写课程相对应的介绍信息..."
              type="textarea"
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
import {
  getEditInfo,
  queryCoursegroup,
  updateCourse
} from '@/api/teachManage/course'
export default {
  data() {
    /* 整数校验 */
    var checkNum = (rule, value, callback) => {
      if (!/^(0|[1-9][0-9]*)$/.test(value)) {
        callback('请输入整数')
      } else {
        callback()
      }
    }
    /* 校验最大与最小月龄的比较 */
    var checkMaxMonth = (rule, value, callback) => {
      if (!/^(0|[1-9][0-9]*)$/.test(value)) {
        callback('请输入整数')
      } else if (Number(value) <= Number(this.ruleForm.minMonth)) {
        callback('最大月龄不能小于或等于最小月龄')
      } else {
        callback()
      }
    }
    /* 校验最大与最小年龄的比较 */
    var checkMaxYear = (rule, value, callback) => {
      if (!/^(0|[1-9][0-9]*)$/.test(value)) {
        callback('请输入整数')
      } else if (Number(value) <= Number(this.ruleForm.minYear)) {
        callback('最大年龄不能小于或等于最小年龄')
      } else {
        callback()
      }
    }
    var checkCourseNum = (rule, value, callback) => {
      if (value == '' || value == undefined || value == null) {//eslint-disable-line
        callback()
      } else if (!/^[0-9]+(.[0-9]{1,2})?$/.test(value)) {
        callback(new Error('数字格式不正确'))
      } else {
        callback()
      }
    }
    return {
      text: [],
      newdialogVisibleTow: false,
      newdialogVisible: false, // 新增课程显示
      ruleForm: {
        title: '', // 课程名称
        groupName: '', // 课系
        ageType: '1', // 学员大小
        minMonth: '', // 最小月龄
        maxMonth: '', // 最大月龄
        minYear: '', // 最小月龄
        maxYear: '', // 最大月龄
        cost: '', // 每节消耗
        costType: '', // 消耗类型
        intro: '', // 课程介绍
        status: '1'
      },
      rules: {
        title: [
          { required: true, message: '请输入课程名称', trigger: 'change' }
        ],
        groupName: [
          { required: true, message: '请选择课系', trigger: 'change' }
        ],
        ageType: [
          { required: true, message: '请选择学员大小', trigger: 'change' }
        ],
        minMonth: [
          { required: true, message: '请输入最小上课月龄', trigger: 'change' },
          { validator: checkNum }
        ],
        maxMonth: [
          { required: true, message: '请输入最大上课月龄', trigger: 'change' },
          { validator: checkMaxMonth }
        ],
        minYear: [
          { required: true, message: '请输入最小上课年龄', trigger: 'change' },
          { validator: checkNum }
        ],
        maxYear: [
          { required: true, message: '请输入最大上课年龄', trigger: 'change' },
          { validator: checkMaxYear }
        ],
        cost: [
          {
            required: true,
            message: '填写每节课程所需的课时数',
            trigger: 'change'
          },
          { validator: checkCourseNum }
        ],
        costType: [
          { required: true, message: '请选择耗课类型', trigger: 'change' }
        ]
      },
      editInfo: {}, // 编辑信息
      groupList: [], // 课系列表
      id: '' // 课程id
    }
  },
  methods: {
    /* 取消跳转*/
    cancelCompact() {
      this.newdialogVisibleTow = false
    },
    /* 跳合同套餐*/
    compact() {
      this.$router.push({ name: 'ContractMgr', params: { activeTab: 'contractSetmeal' }})
      this.newdialogVisibleTow = false
      this.newdialogVisible = false
    },
    /* 上下架 */
    upDownTypeChange(value) {
      if (value == '1') {//eslint-disable-line
        this.ruleForm.status = '1'
      } else if (value == '0') {//eslint-disable-line
        this.ruleForm.status = '0'
      }
    },
    show(val) {
      this.getCourseGroup()
      this.id = val.id
      const params = {
        id: val.id
      }
      getEditInfo(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.editInfo = data
          this.ruleForm.title = this.editInfo.title
          this.ruleForm.groupName = this.editInfo.groupId
          this.ruleForm.ageType = this.editInfo.ageType + ''
          if (this.editInfo.ageType == '1') {//eslint-disable-line
            this.ruleForm.minMonth = this.editInfo.minMa + ''
            this.ruleForm.maxMonth = this.editInfo.maxMa + ''
          } else if (this.editInfo.ageType == '2') {//eslint-disable-line
            this.ruleForm.minYear = Math.floor(this.editInfo.minMa / 12) + ''
            this.ruleForm.maxYear = Math.ceil(this.editInfo.maxMa / 12) + ''
          }
          this.ruleForm.cost = this.editInfo.cost
          this.ruleForm.costType = this.editInfo.cutType
          this.ruleForm.intro = this.editInfo.intro
          this.ruleForm.status = this.editInfo.status
          this.newdialogVisible = true
        } else {
          this.$message.error(data.errorMessage || '编辑信息获取失败')
        }
      })
    },
    /* 课系列表 */
    getCourseGroup() {
      const params = {
        pageSize: 99999,
        pageIndex: 0
      }
      queryCoursegroup(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.groupList = res.data.results
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    ageTypeChange(val) {
      if (val == '1') {//eslint-disable-line
        this.ruleForm.minMonth = this.editInfo.minMa + ''
        this.ruleForm.maxMonth = this.editInfo.maxMa + ''
      } else if (val == '2') {//eslint-disable-line
        this.ruleForm.minYear = Math.floor(this.editInfo.minMa / 12) + ''
        this.ruleForm.maxYear = Math.ceil(this.editInfo.maxMa / 12) + ''
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    cancel(formName) {
      this.newdialogVisible = false
      this.$refs[formName].clearValidate() // 清除校验
      this.$refs[formName].resetFields()
    },
    sure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let min = ''
          let max = ''
          if (this.ruleForm.ageType === '1') {
            min = this.ruleForm.minMonth + ''
            max = this.ruleForm.maxMonth + ''
          } else if (this.ruleForm.ageType === '2') {
            min = this.ruleForm.minYear * 12 + ''
            max = this.ruleForm.maxYear * 12 + ''
          }
          const params = {
            id: this.id,
            cost: this.ruleForm.cost,
            intro: this.ruleForm.intro,
            title: this.ruleForm.title,
            ageType: this.ruleForm.ageType,
            minMa: min,
            maxMa: max,
            groupId: this.ruleForm.groupName,
            cutType: this.ruleForm.costType,
            status: this.ruleForm.status
          }
          updateCourse(params).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.newdialogVisible = false
              this.$message.success(data.errorMessage)
              this.$refs[formName].resetFields()
              this.$emit('toAddNewCourse')
            } else if (data.proErrorMsgs) {
              this.text = data.proErrorMsgs
              this.newdialogVisibleTow = true
            } else {
              this.newdialogVisibleTow = false
              this.$message.error(data.errorMessage)
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
  .page_text_text {
    margin: 20px 0;
  }
}
</style>
