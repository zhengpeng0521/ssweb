<template>
  <div class="addSuitStuDialog_container">
    <el-dialog
      :visible.sync="addSuitStuDialogShow"
      title="添加适用学员"
      width="400px"
      @close="cancelDialog('addSuitStuForm')"
    >
      <el-form
        ref="addSuitStuForm"
        :model="deductData"
        :rules="rules"
      >
        <!-- <div class="wrapAll">
          <div>请选择想添加的适用学员</div>
          <div><span style="background:#89C708" class="cirly"/>潜在学员</div>
          <div><span style="background:#1BAFE4" class="cirly" />在读学员</div>
        </div> -->
        <!-- <span style="display: inline-block;margin-bottom: 10px;">请选择想添加的适用学员</span> -->
        <el-form-item
          label=""
          prop="order"
        >

          <StuSelect v-model="deductData.order" type="all" no-month show-type @select="stuChange" />

        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('addSuitStuForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('addSuitStuForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 潜在和在读学员 -->
    <!-- <SuitStudentPage /> -->
    <CrmAndClueStu
      ref="crmAndClueStu"
      @toPartent="getNameAndId"
    />
  </div>
</template>

<script>
import { addStuByCardId } from '@/api/crm/stuAccount/stuAccount.js'
import CrmAndClueStu from './exactSearchDialog.vue'
import StuSelect from '@/components/StuSelect'
// import SuitStudentPage from './cardSide/suitStudentPage.vue'
export default {
  components: {
    StuSelect,
    CrmAndClueStu
    // SuitStudentPage
  },
  data() {
    return {
      addSuitStuDialogShow: false, // 扣课顺序弹框显隐
      // isFalse: false,
      selectName: '',
      deductData: {
        order: ''
      },
      rules: {
        order: [
          { required: true, message: '请选择想添加的适用学员', trigger: 'change' }
        ]
      },
      allStudents: [], // 获取学员下拉输入框数据
      cardRowData: {}, // 获取会员卡详情数据
      cardSourse: '' // 获取会员卡详情数据
    }
  },
  methods: {
    getNameAndId(name, id, source) {
      this.selectName = name
      this.deductData.order = id
      this.cardSourse = source
    },
    /* 精确查找 */
    // actSearch() {
    //   this.isShow = true
    //   this.$nextTick(() => {
    //     this.$refs.crmAndClueStu.showDialog()
    //   })
    // },
    // select触发change事件方法
    // Sourse(vId) {
    //   // 根据value 找出对应的sourse
    //   let obj = {}
    //   obj = this.allStudents.find((item) => {
    //     return item.stuId === vId
    //   })
    //   // console.log(obj.source)
    //   this.cardSourse = obj.source
    // },
    /* 显示扣课顺序弹框 */
    showDialog(rowValue, value) {
      this.cardRowData = rowValue
      this.allStudents = value
      this.selectName = ''
      // console.log('allStudent', this.allStudents)
      this.addSuitStuDialogShow = !this.addSuitStuDialogShow
    },

    stuChange(value, row) {
      this.cardSourse = row.source
    },
    /* 确定提交扣课顺序弹框 */
    submitForm(formName) {
      const params = {
        id: this.cardRowData.id,
        stuId: this.deductData.order,
        source: this.cardSourse
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          addStuByCardId(params).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success(res.data.errorMessage)
              this.addSuitStuDialogShow = false
              this.$emit('updateSuiteStudent')
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        }
      })
    },
    /* 关闭扣课顺序弹框 */
    cancelDialog(formName) {
      this.addSuitStuDialogShow = false
      this.$refs[formName].clearValidate() // 清除校验
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.addSuitStuDialog_container /deep/ {
  .el-dialog {
    width: 500px;
  }
}
.wrapAll{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px 10px 0
}
.cirly{
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50px;
  margin: 2px 4px;
}
 .selectname{
    display: inline-block;
    border:1px solid #dcdfe6;
    border-radius: 4px;
    min-width: 370px;
    height: auto;
    min-height: 28px;
    max-width: 247px;
    padding-left: 20px;
    margin-right:15px;
  }
  .search{
    height:28px !important;
  }
</style>

