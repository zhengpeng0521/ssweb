<template>
  <div>
    <el-dialog
      :visible.sync="auditDialogShow"
      title="转校审核"
      width="500px"
      @close="cancelDialogAudit('auditForm')"
    >
      <el-form
        ref="auditForm"
        :model="auditData"
        :rules="rules"
        label-width="90px"
      >
        <el-form-item
          label="是否通过:"
          prop="radio"
        >
          <el-radio-group
            v-model="auditData.radio"
            @change="radioChange(auditData.radio)"
          >
            <el-radio label="0">通过</el-radio>
            <el-radio label="1">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="isShowStuInput"
          :style="{position: 'relative'}"
          label="转入学员:"
          prop="joinStu"
        >
          <!-- <el-select
            v-model="auditData.joinStu"
            placeholder="请选择转入学员"
            clearable
            filterable
            value-key="stuId"
          >
            <el-option
              v-for="item in allStuListData"
              :key="item.stuId"
              :label="item.stuName"
              :value="item"
            >
              <i
                :style="{background: item.source == '2' ? 'rgb(137, 199, 8)' : item.source == '1' ? 'rgb(27, 175, 228)' : ''}"
                class="stu_icon"
              />
              <span>{{ item.stuName }}</span>
            </el-option>
          </el-select>
          <div class="lant_box">
            <i
              :style="{background: 'rgb(137, 199, 8)'}"
              class="stu_icon"
            />
            <span>潜在学员</span>
          </div>
          <div class="reading_box">
            <i
              :style="{background: 'rgb(27, 175, 228)'}"
              class="stu_icon"
            />
            <span>在读学员</span>
          </div> -->

          <StuSelect
            v-model="auditData.joinStu"
            type="all"
            placeholder="请选择转入学员"
            no-month
            show-type
            @select="stuChange"
          />

        </el-form-item>
        <el-form-item
          label="审核结果:"
          prop="detail"
        >
          <el-input
            v-model="auditData.detail"
            clearable
            type="textarea"
            placeholder="请输入审核结果"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :loading="loading"
          class="cancel_btn"
          @click="cancelDialogAudit('auditForm')"
        >取 消</el-button>
        <el-button
          :loading="loading"
          type="primary"
          @click="submitFormAudit('auditForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import StuSelect from '@/components/StuSelect'
import { passTransSchool, rejectTransSchool } from '@/api/crm/stuAccount/stuAccount.js'
import { leadsSummary, summaryQueryRead } from '@/api/crm/auditionMgr/auditionMgr'

export default {
  components: {
    StuSelect
  },

  data() {
    return {
      auditDialogShow: false, // 是否审核弹框显示
      isShowStuInput: true, // 是否显示转入学员输入框
      auditData: {
        radio: '0',
        joinStu: '',
        detail: ''
      },
      selectStu: {}, // 选中学员
      rules: {
        radio: [{ required: true }],
        joinStu: [{ required: true, message: '请选择转入学员', trigger: ['blur', 'change'] }]
      },
      loading: false,
      changeSchoolList: {}, // 转校列表数据单条
      allStuListData: [] // 转入学员下拉列表数据
    }
  },
  methods: {
    /* 获取学员下拉列表数据 */
    queryCRMStuListFun() {
      Promise.all([leadsSummary(), summaryQueryRead()]).then(res => {
        const lant = res[0]
        const reading = res[1]
        const allStuListData = []
        if (lant.data.errorCode === 0) {
          lant.data.results && lant.data.results.length > 0 && lant.data.results.forEach(item => {
            allStuListData.push(item)
          })
        } else {
          this.$message.error(lant.data.errorMessage)
        }
        if (reading.data.errorCode === 0) {
          reading.data.results && reading.data.results.length > 0 && reading.data.results.forEach(item => {
            allStuListData.push(item)
          })
        } else {
          this.$message.error(reading.data.errorMessage)
        }
        this.allStuListData = allStuListData
      }).catch(err => {
        console.log(err)
        this.$message.error('学员下拉获取失败')
      })
    },
    /* 单选框值改变 */
    radioChange(value) {
      if (value === '0') {
        this.isShowStuInput = true
        this.auditData = {
          radio: '0',
          joinStu: '',
          detail: ''
        }
        this.rules = {
          radio: [{ required: true }],
          joinStu: [
            { required: true, message: '请选择转入学员', trigger: 'change' }
          ]
        }
      }
      if (value === '1') {
        this.auditData = {
          radio: '1',
          joinStu: '',
          detail: ''
        }
        this.isShowStuInput = false
        this.rules = {
          radio: [{ required: true }]
        }
      }
    },
    /* 显示弹框 */
    auditDialog(row) {
      this.changeSchoolList = row
      // this.queryCRMStuListFun(row)
      this.auditDialogShow = !this.auditDialogShow
      this.isShowStuInput = true
    },
    /* 关闭审核弹框 */
    cancelDialogAudit(formName) {
      this.auditDialogShow = false
      this.$refs[formName].resetFields()
    },

    /** 学员选择 */
    stuChange(value, option) {
      this.selectStu = option
    },

    /* 提交审核弹框 */
    submitFormAudit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.auditData.radio == '0') { //eslint-disable-line
            const params = {
              transId: this.changeSchoolList.id,
              inStuId: this.selectStu.id,
              source: this.selectStu.source,
              checkResult: this.auditData.detail || ''
            }
            this.loading = true
            passTransSchool(params).then(res => {
              if (res.data.errorCode === 0) {
                this.auditDialogShow = false
                this.$message.success(res.data.errorMessage)
                this.$emit('changeStuStatue')
              } else {
                this.$message.error(res.data.errorMessage)
              }
              this.loading = false
            })
          } else {
            const params = {
              transId: this.changeSchoolList.id,
              checkResult: this.auditData.detail || ''
            }
            rejectTransSchool(params).then(res => {
              const data = res.data
              if (data.errorCode === 0) {
                this.auditDialogShow = false
                this.$message.success(data.errorMessage)
                this.$emit('changeStuStatue')
              } else {
                this.$message.error(data.errorMessage)
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.lant_box {
  position: absolute;
  top: 0;
  left: 200px;
  display: flex;
  align-items: center;
}
.reading_box {
  position: absolute;
  top: 0;
  left: 290px;
  display: flex;
  align-items: center;
}
.stu_icon {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50px;
  margin: 2px 4px;
}
</style>

