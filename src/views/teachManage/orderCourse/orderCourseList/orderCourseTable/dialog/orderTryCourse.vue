<template>
  <div class="updateSignType">
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      title="预约试听"
      width="400px"
      @close="resetForm('ruleForm')"
    >
      <div>
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="70px"
        >
          <el-form-item label="类型：">
            <el-radio-group
              v-model="ruleForm.orderType"
              @change="orderTypeChange"
            >
              <el-radio label="1">学员</el-radio>
              <el-radio label="2">名单</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="ruleForm.orderType == '1' || ruleForm.orderType == ''"
            prop="stuId"
            label="姓名："
          >

            <StuSelect v-model="ruleForm.stuId" width="200px" />

          </el-form-item>
          <el-form-item
            v-if="ruleForm.orderType == '2'"
            label="姓名："
            prop="list"
          >

            <StuSelect v-model="ruleForm.list" width="200px" type="latent" />

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
    <el-dialog
      :visible.sync="continueVisible"
      title="继续约课"
      width="400px"
      @close="continueVisible = false"
    >
      <div :style="{ marginBottom: '14px' }">{{ continueMessage }}</div>
      <span slot="footer">
        <el-button
          :loading="continueLoading"
          @click="continueVisible = false"
        >否</el-button>
        <el-button
          :loading="continueLoading"
          type="primary"
          @click="continueOrder"
        >是</el-button>
      </span>
    </el-dialog>

    <ContinueTry
      ref="continueTry"
      @toUpdateOnceOrder="getUpdateOnceOrder"
    />
  </div>
</template>
<script>
import ContinueTry from './continueTry'
// import { getStuChooseList } from '@/api/course'
import { stuSummaryQuery, getAvailableStatus, clueStuSummaryQuery, tryCreate } from '@/api/teachManage/orderCourse'
import StuSelect from '@/components/StuSelect'

export default {
  components: {
    ContinueTry,
    StuSelect
  },
  data() {
    return {
      dialogVisible: false,
      selectListName: '',
      ruleForm: {
        orderType: '1', // 类型
        stuId: '', // 学员
        list: '' // 名单
      },
      rules: {
        orderType: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ]
      },
      newStuList: [],
      list: [],
      detailList: {}, // 详细信息
      isSingleSelect: false,
      isSingleList: false,

      continueVisible: false, // 继续约课
      continueLoading: false,
      continueMessage: '',
      continuePayload: {}
    }
  },
  watch: {
    'ruleForm.orderType'(val) {
      if (val === '1') {
        this.selectName = ''
      } else if (val === '2') {
        this.selectListName = ''
      }
    }
  },
  methods: {
    show(val, detail) {
      this.dialogVisible = true
      this.ruleForm.orderType = '1'
      this.selectName = ''
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
      this.detailList = detail
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
    /* 名单列表摘要 */
    clueStuSummaryQuery() {
      this.list = []
      clueStuSummaryQuery().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          const list = data.list
          list.map((item, index) => {
            const stuObj = {}
            let name = ''
            if (this.detailList.courseAgeType == '1') { //eslint-disable-line
              name = item.clueName + '(' + item.month + '月)'
            } else {
              name = item.clueName + '(' + Math.floor(item.month / 12) + '岁)'
            }
            stuObj.name = name
            stuObj.id = item.clueId
            this.list.push(stuObj)
          })
        } else {
          this.$message.error(data.errorMessage || '学员名单失败')
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.orderType == '1') { //eslint-disable-line
            if (this.ruleForm.stuId) {
              const params = {
                cpmId: this.detailList.cpmId,
                cpdId: this.detailList.cpdId
              }
              getAvailableStatus(params).then(res => {
                const data = res.data
                const startDate = this.detailList.studyDate + ' ' + this.detailList.startTime
                const endDate = this.detailList.studyDate + ' ' + this.detailList.endTime
                const payload = {
                  stuId: this.ruleForm.stuId,
                  auditionTime: startDate,
                  auditionEndTime: endDate,
                  courseName: this.detailList.courseName,
                  source: '1',
                  cpmId: this.detailList.cpmId,
                  cpdId: this.detailList.cpdId,
                  subscribeCreateType: '1'
                }
                if (data.errorCode === 0) {
                  if (data.availableTryNumStatus) {
                    this.$refs.continueTry.show(this.detailList, this.ruleForm.stuId, '1')
                  } else {
                    tryCreate(payload).then(res => {
                      const data = res.data
                      if (data.errorCode === 0) {
                        this.dialogVisible = false
                        this.$message.success(data.errorMessage)
                        this.$emit('toUpdateOnceOrder', this.detailList)
                      } else {
                        this.$message.error(data.errorMessage || '预约试听失败')
                      }
                    })
                  }
                } else if (data.errorCode !== 0 && data.availableTryNumStatus) {
                  this.continueVisible = true
                  this.continueMessage = data.message
                  this.continuePayload = payload
                } else {
                  this.$message.error(data.errorMessage)
                }
              })
            } else {
              this.$message.error('请选择学员')
            }
          } else if (this.ruleForm.orderType == '2') { //eslint-disable-line
            if (this.ruleForm.list) {
              const params = {
                cpmId: this.detailList.cpmId,
                cpdId: this.detailList.cpdId
              }
              getAvailableStatus(params).then(res => {
                const data = res.data
                const startDate = this.detailList.studyDate + ' ' + this.detailList.startTime
                const endDate = this.detailList.studyDate + ' ' + this.detailList.endTime
                const payload = {
                  stuId: this.ruleForm.list,
                  auditionTime: startDate,
                  auditionEndTime: endDate,
                  courseName: this.detailList.courseName,
                  source: '2',
                  cpmId: this.detailList.cpmId,
                  cpdId: this.detailList.cpdId,
                  subscribeCreateType: '1'
                }
                if (data.errorCode === 0) {
                  if (data.availableTryNumStatus) {
                    this.$refs.continueTry.show(this.detailList, this.ruleForm.list, '2')
                  } else {
                    tryCreate(payload).then(res => {
                      const data = res.data
                      if (data.errorCode === 0) {
                        this.dialogVisible = false
                        this.$message.success(data.errorMessage)
                        this.$emit('toUpdateOnceOrder', this.detailList)
                      } else {
                        this.$message.error(data.errorMessage || '预约试听失败')
                      }
                    })
                  }
                } else if (data.errorCode !== 0 && data.availableTryNumStatus) {
                  this.continueVisible = true
                  this.continueMessage = data.message
                  this.continuePayload = payload
                } else {
                  this.$message.error(data.errorMessage)
                }
              })
            } else {
              this.$message.error('请选择名单')
            }
          }
        } else {
          return false
        }
      })
    },

    /** 继续预约 */
    continueOrder() {
      this.continueLoading = true
      tryCreate(this.continuePayload).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.continueVisible = false
          this.dialogVisible = false
          this.$message.success(data.errorMessage)
          this.$emit('toUpdateOnceOrder', this.detailList)
        } else {
          this.$message.error(data.errorMessage || '预约试听失败')
        }
        this.continueLoading = false
      })
    },

    resetForm(formName) {
      this.dialogVisible = false
      this.ruleForm.stuId = ''
      this.ruleForm.list = ''
      this.$refs['ruleForm'].clearValidate()
    },
    /* 类型切换 */
    orderTypeChange(val) {
      this.ruleForm.stuId = ''
      this.ruleForm.list = ''
      this.$refs['ruleForm'].clearValidate()
    },

    getUpdateOnceOrder(detail) {
      this.$emit('toUpdateOnceOrder', detail)
    }
  }
}
</script>
<style lang="scss" scoped>
 .selectname{
    display: inline-block;
    border:1px solid #dcdfe6;
    border-radius: 4px;
    width: 245px;
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
    right: 57px;
}
</style>
