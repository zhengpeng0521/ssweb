<template>
  <div class="addSubDialog_container">
    <el-dialog :visible.sync="addSubDialogShow" title="新建订金" @close="cancelDialog('addSubForm')">
      <el-form ref="addSubForm" :model="gatheringData" :rules="rules" label-width="90px">
        <el-form-item label="所属学员:" prop="stuId">
          <!-- <el-input
            v-model="gatheringData.stuName"
            placeholder="请选择所属学员"
            disabled
            style="width:80%"
          />
          <span class="exactSearch" @click="openSearchDialog">精确查找</span> -->

          <StuSelect
            v-model="gatheringData.stuId"
            :type ="studentType"
            placeholder="请选择学员"
            show-type
            width="340px"
            no-month />
        </el-form-item>
        <el-form-item label="订金金额:" prop="perMoney">
          <el-input
            v-model="gatheringData.perMoney"
            placeholder="请输入订金金额"
            clearable
            @input="perMoneyChange"
          />
        </el-form-item>
        <div class="from_con_fourth">
          <!-- 收款状态选择框 -->
          <div class="payRadio_style">
            <el-radio-group v-model="gatheringData.payRadio" size="small" @change="payRadioChange">
              <el-radio label="1">手填收款</el-radio>
              <el-radio label="2">在线收款</el-radio>
            </el-radio-group>
          </div>
          <!-- 在线收款 -->
          <div v-if="gatheringData.linePayHidden">
            <el-form-item label="待收金额:">
              <el-input
                v-model="gatheringData.perMoney"
                :disabled="true"
                placeholder="请输入金额"
                style="width: 120px"
              />
              <span style="margin-left: 10px;margin-right:170px">元</span>
              <el-button
                type="primary"
                @click="linePayFun('addSubForm',gatheringData.perMoney)"
              >在线收款</el-button>
            </el-form-item>
          </div>
          <!-- 手填收款 -->
          <div v-if="gatheringData.handPayShow" class="from_con_wrap">
            <div>
              <div class="from_con_body">
                <div class="from_con_body_left">
                  <div class="from_con_body_left_top">
                    <span>收款方式</span>
                    <span>收款金额(元)</span>
                    <span>手续费率</span>
                    <span>手续费</span>
                  </div>
                  <div class="from_con_body_left_bot">
                    <div class="from_con_main">
                      <el-form-item class="formContent">
                        <!-- 收款方式 -->
                        <span class="payTypeStyle">
                          <el-select
                            v-model="gatheringData.payType"
                            placeholder="请选择收款方式"
                            filterable
                            @input="payTypeChange(gatheringData.payType)"
                          >
                            <el-option
                              v-for="item in allOrderTypeData"
                              :key="item.id"
                              :label="item.paymentKey === 'xianjin' ? item.paymentKeyName : (item.paymentKeyName + '-' + item.name + '-' + item.acctNo)"
                              :value="item.id"
                            />
                          </el-select>
                        </span>
                      </el-form-item>
                      <!-- 收款金额 -->
                      <el-form-item class="formContent">
                        <span label prop="money" class="perMoneyStyle">
                          <el-input
                            v-model="gatheringData.perMoney"
                            :disabled="true"
                            style="width:100px"
                            @input="perMoneyChange"
                          />
                        </span>
                        <!-- 手续费率 -->
                        <span class="rateStyle">{{ (gatheringData.rate * 100).toFixed(2) + '%' }}</span>

                        <!-- 手续费 -->
                        <span
                          class="moneyStyle"
                        >{{ (gatheringData.rate *gatheringData.perMoney).toFixed(2) }}</span>
                      </el-form-item>
                    </div>
                    <el-form-item class="formNum">
                      <el-input
                        v-model="gatheringData.realSerialNumber"
                        style="width:400px;marginLeft:20px;"
                        placeholder="请输入流水号"
                      />
                    </el-form-item>
                  </div>
                </div>
                <div class="from_con_body_right">
                  <div class="from_con_body_right_top">操作</div>
                  <div
                    v-if="gatheringData.deleteHidden"
                    class="from_con_body_right_bot"
                    @click="deleteForm(index)"
                  >删除</div>
                </div>
              </div>
            </div>
            <!-- v-if="gatheringData.addbotHidden" -->
            <div class="formAdd">
              <div class="formAddR">
                <span style="marginRight: 14px;">实际到账:{{ gatheringData.realMoney || '0.00' }}元</span>
                <span>手续费合计:{{ gatheringData.perMoneyRateAll }}元</span>
              </div>
            </div>

            <div style="width:100%;height:1px;borderTop:1px solid #eee;margin:19px 0;" />
          </div>
          <el-form-item label="备注:" prop="remarks">
            <el-input
              v-model="gatheringData.remarks"
              type="textarea"
              clearable
              placeholder="请输入备注"
            />
          </el-form-item>
        </div>
      </el-form>
      <span v-if="caseHidden" slot="footer" class="dialog-footer">
        <el-button class="cancel_btn" size="mini" @click="cancelDialog('addSubForm')">取消</el-button>
        <el-button type="primary" size="mini" @click="submitForm('addSubForm')">确认</el-button>
      </span>
    </el-dialog>
    <!-- 精确查找弹框组件 -->
    <ExactSearchDialog v-if="exactVisible" ref="exactSearchDialog" @toStudentName="getStudentName" />
    <!-- 新建收款单弹框 -->
    <LinePayOpenDialog v-if="isLinePayOpenDialogShow" ref="linePayOpenDialog" />
    <!-- 订单收款单 -->
    <AddsubscriptionPayeeDialog
      v-if="isContractPayFromShow"
      ref="addsubscriptionPayeeDialog"
      @cancelDialog="cancelShow"
      @closeDialog="closeDialogFun"
    />
  </div>
</template>

<script>
import {
  queryPaymentAccountList,
  purchaseDepositCreate,
  queryAuditStatus // 是够开通在线收款
} from '@/api/crm/financeMgr/financeMgr.js'
import ExactSearchDialog from './exactSearchDialog.vue'
import LinePayOpenDialog from './linePayOpenDialog'
import AddsubscriptionPayeeDialog from './addsubscriptionPayeeDialog.vue'
import StuSelect from '@/components/StuSelect'

export default {
  components: {
    LinePayOpenDialog,
    ExactSearchDialog,
    StuSelect,
    AddsubscriptionPayeeDialog
  },
  props: {
    studentType: {
      type: String,
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      isContractPayFromShow: false, // 订单收款单显隐
      // showAll: false,
      caseHidden: true, // 判断在线收款时取消和确认的消失
      rowListData: '', // 弹窗打开后传过来的数据
      isLinePayOpenDialogShow: false, // 开通收款单弹窗显隐
      addSubDialogShow: false,
      gatheringData: {
        payType: '', // 收款方式
        perMoney: '', // 待收金额
        rate: 0, // 手续费率
        orderId: '', // 交易流水号
        linePerMoney: '', // 在线收款金额
        perMoneyAll: 0, // 填写的收款金额总计
        perMoneyRateAll: 0, // 手续费合计
        needPayMoney: 0, // 未收款金额
        realMoney: '', // 实际到账
        deleteHidden: false, // 删除按钮的显隐
        contractOrderId: '', // 打开在线支付弹框出现的收款编号
        handPayShow: true, // 手填收款默认显示
        linePayHidden: false, // 在线收款默认不显示
        orderStuNames: '', // 学员姓名
        totalMoney: '', // 合同金额
        stuName: '', // 学员名字
        stuId: '', // 学员编号
        money: '', // 定金
        paId: '', // 收款账号
        realSerialNumber: '', // 流水号
        receiverId: '', // 收款人id
        remarks: '', // 备注
        payRadio: '1' // 选择收款方式
      },
      allStuListData: [], // 所有学员下拉列表
      allOrderTypeData: [], // 收款方式下拉列表
      rules: {
        stuId: [
          { required: true, message: '请输入所属学员', trigger: 'change' }
        ],
        perMoney: [
          { required: true, message: '请输入订金金额', trigger: 'change' },
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: '正数，可精确到小数点后2位',
            trigger: 'change'
          }
        ],
        paId: [
          { required: true, message: '请输入收款方式', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        realSerialNumber: [
          { required: true, message: '请输入流水号', trigger: 'change' }
        ],
        payeeAmount: [
          { required: true, message: '请输入收款金额', trigger: 'change' }
        ]
      },
      exactVisible: false, // 精确查找显隐
      selectStu: {} // 选中的学员信息
    }
  },
  mounted() {
    console.log('this.type', this.type)
  },
  methods: {
    payTypeChange(value) {
      // 切换收款方式，置空流水号
      if (value !== this.valueBefore) {
        this.gatheringData.orderId = ''
      }
      if (value) {
        // 展示
        this.allOrderTypeData &&
          this.allOrderTypeData.forEach(item => {
            if (item.id == value) {//eslint-disable-line
              this.gatheringData.rate = item.rate
              this.perMoneyChange()
            }
          })
      }
      this.valueBefore = value
    },
    // 关闭订单付款弹窗的回调
    closeDialogFun() {
      this.isContractPayFromShow = false
    },
    // 关闭当前弹窗
    cancelShow() {
      this.addSubDialogShow = false
    },
    // 订单收款单弹窗
    addsubscriptionPayeeDialog(value) {
      this.isContractPayFromShow = true
      this.$nextTick(() => {
        this.$refs.addsubscriptionPayeeDialog.showDialog('saveAndPay', value)
      })
    },
    // 开通在线支付弹框
    linePayOpenDialog() {
      this.isLinePayOpenDialogShow = true
      this.$nextTick(() => {
        this.$refs.linePayOpenDialog.showDialog()
      })
    },
    /** 更新待收款金额 */
    updateGatheringPerMoney() {
      // 收款金额
      this.gatheringData.perMoney = (
        this.contractOrderDetail.totalMoney -
        this.contractOrderDetail.receivedMoney -
        parseFloat((this.depositSelect && this.depositSelect.money) || 0)
      ).toFixed(2)

      // 未收款金额
      this.gatheringData.needPayMoney = (
        this.contractOrderDetail.totalMoney -
        this.contractOrderDetail.receivedMoney -
        parseFloat((this.depositSelect && this.depositSelect.money) || 0)
      ).toFixed(2)

      this.gatheringData.linePerMoney = this.gatheringData.needPayMoney

      // 实际到账金额
      // this.gatheringData.realMoney = (this.contractOrderDetail.totalMoney - this.contractOrderDetail.receivedMoney - parseFloat(this.depositSelect && this.depositSelect.money || 0)).toFixed(2)

      // 手续费合计
      this.perMoneyRateAll()
    },
    // 手续费合计
    perMoneyRateAll() {
      let result = 0
      result +=
        Number(this.gatheringData.perMoney) * Number(this.gatheringData.rate)
      this.gatheringData.perMoneyRateAll = result.toFixed(2)
    },
    /** 待收款金额判断 */
    perMoneyChange() {
      let s = 0
      s += Number(this.gatheringData.perMoney)
      this.gatheringData.perMoneyAll = s
      // 手续费合计
      this.perMoneyRateAll()
      // 计算实际到账金额
      this.gatheringData.realMoney =
        this.gatheringData.perMoneyAll - this.gatheringData.perMoneyRateAll
    },
    // 保证有一种支付方式
    addFormOne() {
      if (this.gatheringData.length <= 1) {
        this.gatheringData.deleteHidden = false
      } else {
        this.gatheringData.deleteHidden = true
      }
    },
    // 删除当前支付方式
    deleteForm(index) {
      this.gatheringData.splice(index, 1)
      this.perMoneyChange()
      this.addFormOne()
    },
    // 在线收款
    linePayFun(formName, perMoney) {
      this.gatheringData.perMoney = perMoney
      if (!this.gatheringData.perMoney) {
        this.$message.error('订金金额不能为空')
      } else if (isNaN(this.gatheringData.perMoney) === true) {
        this.$message.error('订金金额输入有误')
      } else if (this.gatheringData.perMoney < 0) {
        this.$message.error('订金金额不能小于0')
      } else {
        this.$refs[formName].validate(valid => {
          if (valid) {
            queryAuditStatus().then(res => {
              if (res.data.errorCode === 0) {
                // this.gatheringData.contractOrderId = this.rowListData.orderNumber
                this.addsubscriptionPayeeDialog(this.gatheringData) // 订单收款单弹窗
              } else {
                this.linePayOpenDialog() // 开通在线收款功能
              }
            })
          }
        })
      }
    },

    // 收款状态切换
    payRadioChange(value) {
      if (value === '1') {
        // 手填收款
        this.gatheringData.handPayShow = true
        this.gatheringData.linePayHidden = false
        this.caseHidden = true
      } else if (value === '2') {
        // 在线收款
        this.gatheringData.handPayShow = false
        this.gatheringData.linePayHidden = true
        this.gatheringData.linePerMoney = this.gatheringData.needPayMoney
        this.caseHidden = false
      }
    },
    /* 显示弹框 */
    showDialog() {
      this.queryPaymentAccountListFun()
      this.addSubDialogShow = !this.addSubDialogShow
      this.gatheringData.handPayShow = true
      this.gatheringData.linePayHidden = false
      // this.rowListData = rowlist
    },
    /* 精确查找弹框 */
    openSearchDialog() {
      this.exactVisible = true
      this.$nextTick(() => {
        this.$refs.exactSearchDialog.showDialog(this.selectStu)
      })
    },
    /* 获取精确查找传的学员信息 */
    getStudentName(value, stuId) {
      this.gatheringData.stuId = stuId
      this.gatheringData.stuName = value
      this.selectStu = {
        id: stuId,
        name: value
      }
    },
    /* 获取定金收款方式下拉列表 */
    queryPaymentAccountListFun() {
      queryPaymentAccountList().then(res => {
        if (res.data.errorCode === 0) {
          this.allOrderTypeData = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.caseHidden = true
      this.addSubDialogShow = false
      this.exactVisible = false
      this.gatheringData.stuName = ''
      this.gatheringData.realMoney = ''
      this.selectStu = {}
      this.$refs[formName].resetFields()
      this.gatheringData = {
        payType: '', // 收款方式
        perMoney: '', // 待收金额
        rate: 0, // 手续费率
        orderId: '', // 交易流水号
        stuName: '', // 学员名字
        stuId: '', // 学员编号
        money: '', // 定金
        paId: '', // 收款账号
        realSerialNumber: '', // 流水号
        receiverId: '', // 收款人id
        remarks: '', // 备注
        payRadio: '1' // 选择收款方式
      }
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            bextMoney: 0,
            money: this.gatheringData.perMoney,
            paId: this.gatheringData.payType,
            payType: '1',
            realSerialNumber: this.gatheringData.realSerialNumber || '',
            stuId: this.gatheringData.stuId,
            remarks: this.gatheringData.remarks || ''
          }
          if (!this.gatheringData.payType) {
            this.$message.error('收款方式不能为空')
          } else if (!this.gatheringData.perMoney) {
            this.$message.error('订金金额不能为空')
          } else if (this.gatheringData.perMoney < 0) {
            this.$message.error('订金金额不能小于0')
          } else if (isNaN(this.gatheringData.perMoney) === true) {
            this.$message.error('订金金额输入有误')
          } else {
            purchaseDepositCreate(params).then(res => {
              if (res.data.errorCode === 0) {
                this.addSubDialogShow = false
                this.$emit('toParentEarnest', true)
              } else {
                this.$message.error(res.data.errorMessage)
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
.addSubDialog_container /deep/ {
  .el-dialog {
    width: 600px;
     margin-top: 8vh !important;
  }
  .wrapAll{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 0 10px 0;
    .readStu {
      margin-left: 50px;
    }
  }
  .exactSearch {
    cursor: pointer;
    color: #46b6ee;
    margin-left: 10px;
  }
   .from_con_fourth {
          width: 100%;
          height: auto;
          overflow: hidden;
          background: #fff;
          margin-top: 20px;
          padding: 10px;
          border-radius: 5px;
          .payRadio_style {
            // 选择收款方式
            margin-top: 10px;
            margin-bottom: 14px;
          }
          .from_con_wrap {
            position: relative;
            width: 100%;
            .from_con_body {
              margin-top: 14px;
              border: 1px solid rgba(221, 221, 221, 1);
              border-radius: 2px;
              display: flex;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: rgba(102, 102, 102, 1);
              font-size: 14px;
              .from_con_body_left {
                width: 444px;
                height: 160px;
                .from_con_body_left_top {
                  height: 44px;
                  width: 460px;
                  background: #f0f2f5;
                  line-height: 44px;
                  span:nth-of-type(1) {
                    margin: 0 97px 0 20px;
                  }
                  span:nth-of-type(3) {
                    margin: 0 20px 0 36px;
                  }
                }
                .from_con_body_left_bot {
                   .formContent /deep/.el-form-item__error{
                        left: 20px !important;
                      }
                      .formContent /deep/.el-form-item__content{
                        margin-left: 0 !important;
                        margin-top: 10px;
                      }
                      .from_con_main{
                        height: 44px;
                    width: 444px;
                    line-height: 44px;
                    display: flex;
                      }
                  .formContent {
                    span {
                      display: inline-block;
                    }
                    .payTypeStyle {
                      margin-left: 20px;
                      width: 145px;
                    }
                    .perMoneyStyle {
                      margin-left: 10px;
                    }
                    .rateStyle {
                      margin-left: 15px;
                    }
                    .moneyStyle {
                      margin-left: 35px;
                    }
                  }
                  .formNum /deep/.el-form-item__error{
                        left: 20px !important;
                      }
                      .formNum /deep/.el-form-item__content{
                        margin-left: 0 !important;
                        margin-top: 15px;
                      }
                  .formNum {
                    height: 44px;
                    width: 444px;
                    line-height: 44px;
                  }
                }
              }
              .from_con_body_right {
                width: 94px;
                height: 160px;
                border-left: 1px solid #ddd;
                .from_con_body_right_top {
                  height: 44px;
                  width:100%;
                  background: #f0f2f5;
                  border-left: 1px solid #eee;
                  line-height: 44px;
                  text-align: center;
                }
                .from_con_body_right_bot {
                  cursor: pointer;
                  color: #46b6ee;
                  line-height: 88px;
                  text-align: center;
                }
              }
            }
            .formAdd {
              margin-top: 14px;
              justify-content: space-between;
              overflow: hidden;
              .formAddL {
                float: left;
                display: flex;
                color: #46b6ee;
                cursor: pointer;
                img {
                  margin-right: 4px;
                }
              }
              .formAddR {
                float: right;
                color: #f56c6c;
              }
            }
            .from_fourth_bottom {
              display: flex;
              height: 28px;
              margin-top: 10px;
              justify-content: space-between;
              -webkit-box-align: center;
              align-items: center;
              color: #f56c6c;
            }
          }
        }
}
</style>

