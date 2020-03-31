<template>
  <div class="addGatheringDialog_container">
    <el-dialog
      :visible.sync="addGatheringDialogShow"
      :close-on-click-modal="false"
      title="合同收款单"
      @close="cancelDialog('addGatheringForm')"
    >
      <el-form
        ref="addGatheringForm"
        :model="addGatheringData"
        label-width="90px"
      >
        <div style="padding: 0 25px; box-sizing: border-box;">
          <el-form-item
            label="学员姓名:"
            prop="stuId"
          >
            <!-- <el-select
              v-model="addGatheringData.stuId"
              placeholder="请选择学员姓名"
              filterable
              style="width:80%"
              @change="selectStuChange"
            >
              <el-option
                v-for="item in stuList"
                :key="item.stuId"
                :label="item.stuName"
                :value="item.stuId"
              />
            </el-select>
            <span
              style="color:#46b6ee; margin-left: 10px;cursor: pointer;"
              @click="openSearchDialog()"
            >精确查找</span> -->
            <!-- <div style="display:flex;">
              <div class="selectname"> {{ selectName }} </div>
              <div
                class="search"
                @click="openSearchDialog"
              >查找
              </div>
            </div> -->

            <StuSelect
              v-model="addGatheringData.stuId"
              placeholder="请选择学员姓名"
              type="allReading"
              width="340px"
              no-month
              @select="selectStuChange" />

          </el-form-item>
          <el-form-item
            label="合同编号:"
            prop="contractNum"
          >
            <el-select
              v-model="addGatheringData.contractNum"
              placeholder="请选择合同编号"
              filterable
              style="width:100%"
              @change="contractNumChange"
            >
              <el-option
                v-for="(item,index) in contractList"
                :key="index"
                :label="item.orderNumber"
                :value="item.orderNumber"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="合同金额:"
            prop="price"
          >
            <div>{{ addGatheringData.orderMoney || 0.00 }} 元</div>
          </el-form-item>

          <el-form-item
            label="合同清单:"
            prop="price"
          >
            <div>{{ addGatheringData.conOrder || '课程名称 × 课程数量' }}</div>
          </el-form-item>

        </div>
        <div class="online_box_wrap">
          <div class="online_box_body">
            <!-- 订金信息 -->
            <!-- 订金已经绑定该合同-->
            <div
              v-if="depositChecked && depositSelect && depositSelect.id"
              class="online_body_first"
            >
              <div class="body_first_text">
                <span>
                  订金金额:
                  <i>{{ depositSelect.money }}</i>
                </span>
                <span>
                  方式:
                  <i>{{ depositSelect.paName }}</i>
                </span>
                <span>
                  时间:
                  <i>{{ depositSelect.createTime }}</i>
                </span>
              </div>
              <div class="body_first_btn">
                <a style="color: rgb(0, 134, 28)">已确认</a>
              </div>
            </div>
            <!-- 有订金,并选择其中的一条 -->
            <div
              v-else-if="depositList && depositList.length > 0 && depositSelect && depositSelect.id && addGatheringData.contractNum"
              class="online_body_first"
            >
              <div class="body_first_text">
                <span>
                  订金金额:
                  <i>{{ depositSelect.money }}</i>
                </span>
                <span>
                  方式:
                  <i>{{ depositSelect.paName }}</i>
                </span>
                <span>
                  时间:
                  <i>{{ depositSelect.createTime }}</i>
                </span>
              </div>
              <div class="body_first_btn">
                <el-popover
                  v-model="moneyVisible"
                  placement="top"
                  trigger="click"
                >
                  <div>
                    <i class="el-icon-warning confirm-icon" />
                    <p style="margin:4px 4px 16px 0;display:inline-block">确定收款？</p>
                  </div>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      size="mini"
                      class="cancel_btn edit_btn"
                      @click="moneyVisible = false"
                    >取消</el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      class="edit_btn"
                      @click="sureBindDeposit(depositSelect)"
                    >确定</el-button>
                  </div>
                  <a slot="reference">确认</a>
                </el-popover>
                <el-popover
                  placement="bottom"
                  style="min-width: 50px !important;"
                  trigger="click"
                >
                  <div>
                    <div
                      v-for="(item, index) of depositList"
                      :key="index + '_allPurchaseID'"
                      style="cursor: pointer;display:flex;margin-bottom:10px"
                      @click="selectShowOk(item)"
                    >
                      <div class="pop_item">{{ item.id }}</div>
                      <div class="pop_item">￥: {{ item.money }}</div>
                      <div>{{ item.createTime }}</div>
                    </div>
                    <div
                      style="cursor: pointer;text-align:end;"
                      @click="selectNothing"
                    >不关联</div>
                  </div>
                  <a
                    slot="reference"
                    style="padding-right: 20px;color: #46b6ee;"
                  >选择</a>
                </el-popover>
              </div>
            </div>
            <!-- 其他订金行为处理 -->
            <div
              v-else
              class="online_body_first"
              style="height: 36px;line-height: 36px"
            >
              <div style="display: flex; justify-content: space-between;">
                <span>未关联订金</span>
                <el-popover
                  placement="bottom"
                  style="min-width: 50px !important;"
                  trigger="click"
                >
                  <div>
                    <div
                      v-for="(item, index) of depositList"
                      :key="index + '_allPurchaseID'"
                      style="cursor: pointer;display:flex;margin-bottom:10px"
                      @click="selectShowOk(item)"
                    >
                      <div class="pop_item">{{ item.id }}</div>
                      <div class="pop_item">￥: {{ item.money }}</div>
                      <div>{{ item.createTime }}</div>
                    </div>
                    <div
                      style="cursor: pointer;text-align:end;"
                      @click="selectNothing"
                    >不关联</div>
                  </div>
                  <a
                    slot="reference"
                    style="color: #46b6ee;"
                  >选择</a>
                </el-popover>
              </div>
            </div>

            <!-- 收款信息  -->
            <div class="from_con_second">
              <el-collapse v-model="activeNames">
                <el-collapse-item name="1">
                  <template slot="title">
                    已收金额:<i>￥{{ allPayMoneyList.allMoneyNum || '0' }}</i>
                  </template>
                  <div
                    v-for="(item, index) of allPayMoneyList"
                    :key="index + '_paymoney'"
                  >
                    <div v-if="item.status !== '3'">
                      <span style="margin-right: 15px;">
                        金额: {{ item.money }}元
                      </span>
                      <span style="margin-right: 15px;">
                        方式: {{ item.paymentName || item.typeName }}
                      </span>
                      <span style="margin-right: 15px;">
                        收款状态: {{ item.statusName }}
                      </span>
                      <span>
                        时间: {{ item.createTime }}
                      </span>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
            <div
              v-if="addGatheringData.needPayMoney > 0 && addGatheringData.contractNum"
              class="from_con_fourth"
            >

              <!-- 收款状态选择框 -->
              <div class="payRadio_style">
                <el-radio-group
                  v-model="addGatheringData.payRadio"
                  size="small"
                  @change="payRadioChange(addGatheringData.payRadio)"
                >
                  <el-radio label="1">手填收款</el-radio>
                  <el-radio label="2">在线收款</el-radio>
                </el-radio-group>
              </div>

              <!-- 在线收款 -->
              <div v-if="addGatheringData.linePayHidden">
                <el-form-item
                  label="待收金额："
                  prop="perMoney"
                >
                  <el-input
                    v-model="addGatheringData.linePerMoney"
                    placeholder="请输入金额"
                    style="width: 120px"
                  />
                  <span style="margin-left: 10px;margin-right:120px">元</span>
                  <el-button
                    type="primary"
                    @click="linePayFun"
                  >在线收款</el-button>
                </el-form-item>
              </div>

              <!-- 手填收款 -->
              <div
                v-if="addGatheringData.handPayShow"
                class="from_con_wrap"
              >
                <div
                  v-for="(item, index) in addGatDataList"
                  :key="index"
                >
                  <div class="from_con_body">
                    <div class="from_con_body_left">
                      <div class="from_con_body_left_top">
                        <span>收款方式</span>
                        <span>收款金额(元)</span>
                        <span>手续费率</span>
                        <span>手续费</span>
                      </div>
                      <div class="from_con_body_left_bot">
                        <div class="formContent">
                          <!-- 收款方式 -->
                          <span
                            prop="payType"
                            class="payTypeStyle"
                          >
                            <el-select
                              v-model="item.payType"
                              placeholder="请选择收款方式"
                              filterable
                              @input="payTypeChange(item.payType, index)"
                            >
                              <el-option
                                v-for="item in allPaymentList"
                                :key="item.id"
                                :label="item.paymentKey === 'xianjin' ? item.paymentKeyName : (item.paymentKeyName + '-' + item.name + '-' + item.acctNo)"
                                :value="item.id"
                              />
                            </el-select>
                          </span>

                          <!-- 收款金额 -->
                          <span
                            label=""
                            prop="perMoney"
                            class="perMoneyStyle"
                          >
                            <el-input
                              v-model="item.perMoney"
                              style="width:100px;"
                              @input="perMoneyChange"
                            />
                          </span>

                          <!-- 手续费率 -->
                          <span class="rateStyle">{{ (item.rate * 100).toFixed(2) + '%' }}</span>

                          <!-- 手续费 -->
                          <span class="moneyStyle">{{ (item.rate * item.perMoney).toFixed(2) }}</span>
                        </div>

                        <div class="formNum">
                          <el-input
                            v-model="item.orderId"
                            style="width:400px;marginLeft:20px;"
                            placeholder="请输入流水号"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="from_con_body_right">
                      <div class="from_con_body_right_top">
                        操作
                      </div>
                      <div
                        v-if="addGatheringData.deleteHidden"
                        class="from_con_body_right_bot"
                        @click="deleteForm(index)"
                      >
                        删除
                      </div>
                    </div>
                  </div>
                </div>

                <div class="formAdd">
                  <div
                    v-if="addbotHidden"
                    class="formAddL"
                    @click="addForm"
                  >
                    <img src="https://img.ishanshan.com/gimg/n/20190322/e6c073e90ca20cf3ec74d6e580c35efb">
                    <span class="add_text">
                      新增
                    </span>
                  </div>

                  <div class="formAddR">
                    <span style="marginRight: 14px;">
                      实际到账: {{ addGatheringData.realMoney || '0.00' }}元
                    </span>
                    <span>
                      手续费合计：{{ addGatheringData.perMoneyRateAll }}
                    </span>
                  </div>
                </div>

                <div style="width:100%;height:1px;borderTop:1px solid #eee;margin:19px 0;" />

                <div class="from_fourth_bottom">
                  <div>
                    <span>剩余应收: <i>{{ addGatheringData.needPayMoney || '0.00' }}元</i></span>
                  </div>

                  <div>
                    <el-button
                      class="cancel_btn"
                      size="mini"
                      @click="cancelDialog()"
                    >取消</el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="payOrderSure()"
                    >确认</el-button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </el-form>
    </el-dialog>
    <!-- 在线收款弹框 -->
    <!-- <el-dialog
      :visible.sync="onlineMoneyDialogShow"
      title="在线收款"
      @close="closeOnlineDialog()"
    >
      <div class="right_bot_wrap">
        <div class="bottom_img">
          <img src="https://img.ishanshan.com/gimg/img/f4033ff0ece7e09ee302c7927d84edc3">
        </div>
        <div class="bottom_text_box">
          <p>电脑端收银</p>
          <p>合同在线收款，支持支付宝微信，费率低至<br>0.4%</p>
          <div class="open_btn">
            <el-button
              class="cancel_btn"
              @click="noPassBtn()"
            >暂不开通</el-button>
            <el-button
              type="primary"
              size="mini"
            >免费开通</el-button>
          </div>
        </div>
      </div>
    </el-dialog> -->
    <!-- 精确查找弹框组件 -->
    <ExactSearchDialog
      v-if="exactVisible"
      ref="exactSearchDialog"
      @toStudentName="getStudentName"
    />

    <!-- 新建收款单弹框 -->
    <LinePayOpenDialog
      v-if="isLinePayOpenDialogShow"
      ref="linePayOpenDialog"
    />

    <!-- 合同收款单 -->
    <ContractPayFromDialog
      v-if="isContractPayFromShow"
      ref="contractPayFromDialog"
      @cancelDialog="cancelShow"
      @closeDialog="closeDialogFun"
    />
  </div>
</template>

<script>
import {
  summaryQuery, // 订金管理---新建订金弹框---学员下拉列表
  queryOrder, // 新建收款单---合同列表
  queryAuditStatus // 是够开通在线收款
} from '@/api/crm/financeMgr/financeMgr'
import ExactSearchDialog from './../../integralMgr/components/exactSearchDialog.vue'
import {
  getOrderDetailById, payInfoList, queryPurchaseDeposit, payOrder, queryPaymentAccountList, bindDeposit // 收款方式列表查询
  // 合同详情
} from '@/api/crm/contract/contract.js'
import LinePayOpenDialog from './linePayOpenDialog' // 在线支付开通弹窗
import ContractPayFromDialog from './contractPayFromDialog' // 合同收款单
import StuSelect from '@/components/StuSelect'

export default {
  components: {
    StuSelect,
    ExactSearchDialog,
    LinePayOpenDialog, // 在线支付开通弹窗
    ContractPayFromDialog // 合同收款单
  },
  data() {
    return {
      selectName: '',
      addGatheringDialogShow: false, // 收款单弹窗显隐
      isLinePayOpenDialogShow: false, // 开通收款单弹窗显隐
      isContractPayFromShow: false, // 合同收款单显隐
      addbotHidden: true, // 新增按钮
      valueBefore: '', // 收款方式前面选的数据
      addGatheringData: {
        linePerMoney: '', // 在线收款金额
        perMoneyAll: 0, // 填写的收款金额总计
        perMoneyRateAll: 0, // 手续费合计
        needPayMoney: '', // 未收款金额
        realMoney: '', // 实际到账
        deleteHidden: false, // 删除按钮的显隐
        contractOrderId: '', // 打开在线支付弹框出现的收款编号
        checkStudent: '', // 选中的学员
        handPayShow: true, // 手填收款默认显示
        linePayHidden: false, // 在线收款默认不显示
        payRadio: '1', // 选择收款方式
        stuId: '',
        contractNum: '',
        orderMoney: '', // 合同金额
        conOrder: '', // 课程
        conMoney: '', // 收款金额
        rateInfo: ''
      },
      // 手动收款数据
      addGatDataList: [
        {
          payType: '', // 收款方式
          perMoney: 0, // 待收金额
          rate: 0, // 手续费率
          orderId: '' // 交易流水号
        }
      ],
      moneyVisible: false, // 确定收款气泡
      activeNames: [],
      onlineMoneyDialogShow: false,
      stuList: [], // 学员下拉列表
      selectStu: {},
      exactVisible: false, // 精确查找弹窗
      contractList: [], // 合同下拉列表
      allPayMoneyList: [], // 已收金额数据
      allPaymentList: [], // 收款方式列表查询
      depositList: [], // 订金详情数据
      depositSelect: {}, // 订金选中的选项
      depositChecked: false, // 订金是否已经关联
      contractOrderDetail: {} // 合同收款详情数据
    }
  },
  methods: {
    // 关闭合同付款弹窗的回调
    closeDialogFun() {
      this.isContractPayFromShow = false
    },

    // 关闭当前弹窗
    cancelShow() {
      this.addGatheringDialogShow = false
    },

    // 合同收款单
    contractPayFromDialog(value) {
      this.isContractPayFromShow = true
      this.$nextTick(() => {
        this.$refs.contractPayFromDialog.showDialog('newAndPay', value)
      })
    },

    // 开通在线支付弹框
    linePayOpenDialog() {
      this.isLinePayOpenDialogShow = true
      this.$nextTick(() => {
        this.$refs.linePayOpenDialog.showDialog()
      })
    },

    // 在线收款
    linePayFun() {
      queryAuditStatus().then(res => {
        if (res.data.errorCode === 0) {
          this.addGatheringData.contractOrderId = this.contractOrderDetail.orderNum
          this.contractPayFromDialog(this.addGatheringData) // 合同收款单弹窗
        } else {
          this.linePayOpenDialog() // 开通在线收款功能
        }
      })
    },

    // 收款状态切换
    payRadioChange(value) {
      if (value === '1') { // 手填收款
        this.addGatheringData.handPayShow = true
        this.addGatheringData.linePayHidden = false
      } else if (value === '2') { // 在线收款
        this.addGatheringData.handPayShow = false
        this.addGatheringData.linePayHidden = true
        this.addGatheringData.linePerMoney = this.addGatheringData.needPayMoney
      }
    },
    /* 显示弹框 */
    showDialog() {
      this.getStuList()
      this.queryPaymentAccountListFun()
      this.depositSelect = {}// 订金选中的选项
      this.depositChecked = false// 订金是否已经关联
      this.addbotHidden = true // 新增按钮
      this.addGatheringData.contractNum = ''
      this.addGatheringData.orderMoney = '0.00'
      this.addGatheringData.conOrder = ''
      this.addGatheringData.payType = ''
      this.addGatheringData.orderId = ''
      this.addGatheringDialogShow = true
      this.selectName = ''
    },
    /* 获取所有在读学员的列表 */
    getStuList() {
      summaryQuery().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.stuList = data.results
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.addGatheringData.orderMoney = 0.00
      this.addGatheringData.conOrder = ''
      this.$nextTick(() => {
        this.addGatheringDialogShow = false
      })
      if (formName) {
        this.$refs[formName].resetFields()
      }
      this.$emit('close')

      this.addGatheringData.rate = '手续费率: 0.00%'
      this.addGatheringData.rateInfo = ''
      this.addGatheringData.orderId = ''
      this.addGatheringData.payType = ''
      this.addGatheringData.realMoney = this.addGatheringData.needPayMoney
      this.addGatheringData.perMoney = this.addGatheringData.needPayMoney
      this.addGatDataList = [
        {
          payType: '', // 收款方式
          perMoney: 0, // 待收金额
          rate: 0, // 手续费率
          orderId: '' // 交易流水号
        }
      ]
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addGatheringDialogShow = false
        }
      })
    },
    /* 在线收款弹框 */
    openOnlineDialog() {
      this.onlineMoneyDialogShow = !this.onlineMoneyDialogShow
    },
    /* 关闭在线收款弹框 */
    closeOnlineDialog() {
      this.onlineMoneyDialogShow = false
    },
    /* 暂不通过 */
    noPassBtn() {
      this.onlineMoneyDialogShow = false
    },
    /* 获取精确查找传的学员信息 */
    getStudentName(value, stuId) {
      // console.log('value', value)
      this.selectName = value
      this.addGatheringData.stuId = stuId
      this.selectStuChange(stuId)
    },
    /* 学员值改变 */
    selectStuChange(value) {
      this.stuList.map(item => {
        if (value == item.stuId) { //eslint-disable-line
          this.addGatheringData.checkStudent = item
          item.name = item.stuName
          this.selectStu = item
        }
      })
      this.depositSelect = {}// 订金选中的选项
      this.depositChecked = false// 订金是否已经关联
      this.addGatheringData.contractNum = ''
      this.addGatheringData.orderMoney = '0.00'
      this.addGatheringData.conOrder = ''
      this.addGatheringData.payType = ''
      this.addGatheringData.orderId = ''
      queryOrder({ stuId: value }).then(res => { // 查询合同编号
        const data = res.data
        if (data.errorCode === 0) {
          this.contractList = data.results
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 合同编号改变 */
    contractNumChange(val) {
      this.contractList && this.contractList.map(item => {
        if (item.orderNumber == this.addGatheringData.contractNum) { //eslint-disable-line
          this.addGatheringData.orderMoney = item.orderMoney
          getOrderDetailById({ id: val }).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.contractOrderDetail = data.data
              this.contractOrderDetail.classpkg.map(item => {
                this.addGatheringData.conOrder = item.name + ' X ' + item.amount
              })
              this.queryPurchaseDepositFun(this.contractOrderDetail, this.addGatheringData.stuId)
              this.updateGatheringPerMoney()
            }
          })
          this.payInfoListFun(val)
        }
      })
    },
    /* 订金详情列表数据 */
    queryPurchaseDepositFun(rowlist, stuIdNum) {
      const params = {
        stuId: stuIdNum,
        orderNumber: rowlist.orderNumber,
        pageSize: 99999
      }
      queryPurchaseDeposit(params).then(res => {
        if (res.data.errorCode === 0) {
          // this.depositList = res.data.results
          this.queryMoneyList(res.data.results)
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 订金列表逻辑处理 */
    queryMoneyList(depositList) {
      if (depositList && depositList.length > 0) {
        const dataDepositList = []
        let dataDepositSelect = {}
        let dataDepositChecked = false
        depositList.map((item, index) => {
          if (item.status == '2' && item.purchaseId == this.addGatheringData.contractNum) { //eslint-disable-line
            dataDepositSelect = item
            dataDepositChecked = true
          } else if (item.status == '1') { //eslint-disable-line
            dataDepositList.push(item)
          }
        })
        this.depositList = dataDepositList
        this.depositSelect = dataDepositSelect
        this.depositChecked = dataDepositChecked
        this.updateGatheringPerMoney()
      }
    },
    /** 更新待收款金额 */
    updateGatheringPerMoney() {
      // 填写的付款金额
      this.addGatDataList[0].perMoney = (this.contractOrderDetail.totalMoney - this.contractOrderDetail.receivedMoney - parseFloat(this.depositSelect && this.depositSelect.money || 0)).toFixed(2)

      // 未收款金额
      this.addGatheringData.needPayMoney = (this.contractOrderDetail.totalMoney - this.contractOrderDetail.receivedMoney - parseFloat(this.depositSelect && this.depositSelect.money || 0)).toFixed(2)

      this.addGatheringData.linePerMoney = this.addGatheringData.needPayMoney

      // 实际到账的金额
      // this.addGatheringData.realMoney = (this.contractOrderDetail.totalMoney - this.contractOrderDetail.receivedMoney - parseFloat(this.depositSelect && this.depositSelect.money || 0)).toFixed(2)

      // 手续费合计
      this.perMoneyRateAll()
    },
    /* 选择不关联 */
    selectNothing() {
      this.depositSelect = {}
    },

    /* 确定支付合同 */
    payOrderSure() {
      let paywayList = this.addGatDataList
      paywayList = JSON.parse(JSON.stringify(paywayList).replace(/payType/g, 'payid'))
      paywayList = JSON.parse(JSON.stringify(paywayList).replace(/perMoney/g, 'money'))
      paywayList = JSON.parse(JSON.stringify(paywayList).replace(/orderId/g, 'realSerialNumber'))
      const params = {
        orderId: this.addGatheringData.contractNum,
        bextMoney: 0,
        payway: JSON.stringify(paywayList),
        receiverId: '',
        depositId: '',
        payType: '1'
      }
      const paywayListPayid = []
      const paywayListMoney = []
      paywayList.map(item => {
        return paywayListPayid.push(item.payid)
      })

      paywayList.map(item => {
        return paywayListMoney.push(item.money)
      })

      const payidtf = paywayListPayid.some(value => {
        // eslint-disable-next-line eqeqeq
        return value == ''
      })

      const moneytf = paywayListMoney.some(value => {
        // eslint-disable-next-line eqeqeq
        return value == ''
      })

      const moneyThen = paywayListMoney.every(value => {
        return (Number(value) > 0)
      })

      if (payidtf === true) {
        this.$message.error('收款方式不能为空')
      } else if (moneytf === true) {
        this.$message.error('收款金额不能为空')
      } else if (moneyThen === false) {
        this.$message.error('收款金额不能小于0')
      } else {
        payOrder(params).then(res => {
          if (res.data.errorCode === 0) {
            this.$message.success(res.data.errorMessage)
            this.addGatheringDialogShow = false
            this.$emit('toPayInfoList')
          } else {
            this.$message.error(res.data.errorMessage)
          }
        })
      }
    },

    /* 精确查找弹框 */
    openSearchDialog() {
      this.exactVisible = true
      this.$nextTick(() => {
        this.$refs.exactSearchDialog.showDialog(this.selectStu)
      })
    },
    /* 已收款金额数据 */
    payInfoListFun(val) {
      const params = {
        purchaseId: val
      }
      payInfoList(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allPayMoneyList = res.data.results
          let allMoneyNum = 0
          if (this.allPayMoneyList && this.allPayMoneyList.length > 0) {
            this.allPayMoneyList.map(item => {
              if (item.status !== '3') {
                allMoneyNum += Number(item.money)
              }
            })
            this.allPayMoneyList.allMoneyNum = allMoneyNum
          }
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    /* 收款方式列表查询 */
    queryPaymentAccountListFun() {
      const params = {
        pageSize: 99999
      }
      queryPaymentAccountList(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allPaymentList = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 确认合同绑定订金 */
    sureBindDeposit(itemSelect) {
      const params = {
        purchaseId: this.addGatheringData.contractNum,
        depositId: itemSelect.id
      }
      bindDeposit(params).then(res => {
        if (res.data.errorCode === 0) {
          this.moneyVisible = false
          this.$message.success(res.data.errorMessage)
          // this.getOrderDetailByIdFun(this.rowListData)
          this.updateGatheringPerMoney()
          this.depositChecked = true
          this.$forceUpdate()
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 可选订金列表数据 */
    selectShowOk(item) {
      this.depositSelect = item
      this.isSelectNothing = false
      this.$forceUpdate()
    },
    /* 收款方式值改变 */
    payTypeChange(value, index) {
      // 切换收款方式，置空流水号
      if (value !== this.valueBefore) {
        this.addGatDataList[index].orderId = ''
      }

      if (value) {
        this.allPaymentList && this.allPaymentList.map(item => {
          if (item.id == value) { //eslint-disable-line
            this.addGatDataList[index].rate = item.rate
            this.perMoneyChange()
          }
        })
      }
      this.valueBefore = value
    },

    /** 待收款金额判断 */
    perMoneyChange() {
      let s = 0
      this.addGatDataList.forEach(item => {
        s += Number(item.perMoney)
      })
      this.addGatheringData.perMoneyAll = s
      // 手续费合计
      this.perMoneyRateAll()
      // 计算实际到账金额
      this.addGatheringData.realMoney = this.addGatheringData.perMoneyAll - this.addGatheringData.perMoneyRateAll
    },

    // 手续费合计
    perMoneyRateAll() {
      let result = 0
      this.addGatDataList.forEach(item => {
        result += (Number(item.perMoney) * Number(item.rate))
      })
      this.addGatheringData.perMoneyRateAll = result.toFixed(2)
    },

    // 删除当前支付方式
    deleteForm(index) {
      this.addGatDataList.splice(index, 1)
      this.addbotHidden = true
      this.perMoneyChange()
      this.addFormOne()
    },

    // 增加一种支付方式
    addForm() {
      const tempData = {
        payType: '', // 收款方式
        perMoney: '', // 待收金额
        rate: '', // 手续费率
        orderId: '' // 交易流水号
      }
      if (this.addGatDataList.length === 4) {
        this.addGatDataList.push(tempData)
        this.addbotHidden = false
      } else if (this.addGatDataList.length < 4) {
        this.addGatDataList.push(tempData)
      } else {
        this.addbotHidden = false
      }
      this.addFormOne()
    },

    // 保证有一种支付方式
    addFormOne() {
      if (this.addGatDataList.length <= 1) {
        this.addGatheringData.deleteHidden = false
      } else {
        this.addGatheringData.deleteHidden = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pop_item {
  margin-right: 40px;
}
.addGatheringDialog_container /deep/ {
  .textStyle {
    color: #46b6ee;
  }
  .el-dialog {
    width: 600px;
  }
  .el-dialog__body {
    padding: 25px 0px 6px 0px !important;
    max-height: 460px;
  }
  .from_con_bg {
    width: 100%;
    padding: 1px 25px;
    background: #f0f0f4;
    padding-top: 20px;
    .from_con_box {
      i {
        font-style: normal;
        color: #666;
      }
      .from_con_first {
        width: 100%;
        margin-bottom: 20px;
        font-size: 14px;
        height: 66px;
        background: #fff;
        border-radius: 5px;
        padding: 0 10px;
        .con_first_top {
          width: 100%;
          height: 26px;
          padding-top: 12px;
          font-size: 14px;
          color: #999;
          span:nth-child(2) {
            padding-left: 60px;
          }
          span:nth-child(3) {
            display: inline-block;
            float: right;
          }
        }
        .con_first_bottom {
          width: 100%;
          height: 40px;
          line-height: 40px;
          float: right;
          span {
            font-size: 12px;
            display: inline-block;
            float: right;
            color: #46b6ee;
            cursor: pointer;
          }
        }
      }
      .from_con_second /deep/ {
        margin-bottom: 10px;
        i {
          line-height: 48px;
        }
        .el-collapse-item__header {
          color: #999;
          padding-left: 10px;
          border-radius: 5px 5px 0 0;
          border-bottom: 1px solid #ebeef5;
        }
        .el-collapse-item__wrap {
          margin-bottom: 10px;
          padding: 10px;
          box-sizing: border-box;
        }
        .el-collapse-item__content {
          padding: 0;
          color: #999;
        }
      }
      .from_con_third {
        height: 40px;
        line-height: 40px;
        width: 100%;
        margin-bottom: 20px;
        margin-top: 20px;
        font-size: 14px;
        background: #fff;
        border-radius: 5px;
        padding: 0 10px;
        color: #999;
        .con_third_left {
          width: 50%;
          height: 40px;
          line-height: 40px;
          float: left;
          /deep/ .el-form-item--mini.el-form-item,
          .el-form-item--small.el-form-item {
            margin-bottom: 0;
            margin-top: 5px;
          }
          /deep/ .el-form-item__label {
            width: auto !important;
            font-weight: 400;
          }
        }
        .con_third_right {
          span {
            display: block;
            float: right;
            color: #46b6ee;
            cursor: pointer;
          }
        }
      }
    }
  }
  .online_box_wrap {
    width: 100%;
    background: #f0f0f4;
    padding-top: 20px;
    padding-bottom: 20px;
    .online_box_body {
      width: 100%;
      padding: 0 20px;
      overflow: auto;
      i {
        font-style: normal;
      }
      .online_body_first {
        width: 100%;
        margin-bottom: 20px;
        height: 66px;
        background: #fff;
        border-radius: 5px;
        padding: 0 10px;
        .body_first_text {
          width: 100%;
          height: 26px;
          padding-top: 12px;
          font-size: 14px;
          color: #666;
          font-weight: 400;
          i {
            font-style: normal;
          }
          span:nth-child(2) {
            padding-left: 55px;
            padding-right: 55px;
            box-sizing: border-box;
          }
          span:nth-child(3) {
            display: inline-block;
            float: right;
          }
        }
        .body_first_btn {
          width: 100%;
          height: 40px;
          line-height: 40px;
          float: right;
          a {
            color: rgb(70, 182, 238);
            display: inline-block;
            float: right;
          }
        }
      }
      .from_con_second {
        margin-bottom: 10px;
        .el-collapse-item__header {
          color: #666;
          padding-left: 10px;
          border-radius: 5px 5px 0 0;
          border-bottom: 1px solid #ebeef5;
          font-weight: 400;
        }
        .el-collapse-item__wrap {
          margin-bottom: 10px;
          padding: 10px;
          box-sizing: border-box;
        }
        .el-collapse-item__content {
          padding: 0;
          color: #666;
        }
      }
      .from_con_second /deep/ {
        i {
          line-height: 48px;
        }
      }
      .from_con_third {
        height: 40px;
        line-height: 40px;
        width: 100%;
        margin-bottom: 20px;
        margin-top: 20px;
        font-size: 14px;
        background: #fff;
        border-radius: 5px;
        padding: 0 10px;
        color: #666;
        font-weight: 400;
        .con_third_left {
          width: 50%;
          height: 40px;
          line-height: 40px;
          float: left;
          /deep/ .el-form-item--mini.el-form-item,
          .el-form-item--small.el-form-item {
            margin-bottom: 0;
            margin-top: 5px;
          }
          /deep/ .el-form-item__label {
            width: auto !important;
            font-weight: 400;
          }
        }
        .con_third_right {
          span {
            display: block;
            float: right;
            color: #5d9cec;
            cursor: pointer;
          }
        }
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
          margin-bottom: 15px;
          margin-top: 10px;
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
              height: 132px;
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
                .formContent {
                  height: 44px;
                  width: 444px;
                  line-height: 44px;
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
                .formNum {
                  height: 44px;
                  width: 444px;
                  line-height: 44px;
                }
              }
            }
            .from_con_body_right {
              width: 76px;
              height: 132px;
              border-left: 1px solid #ddd;
              .from_con_body_right_top {
                height: 44px;
                width: 76px;
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
              color: #46b6ee;
              cursor: pointer;
              display: flex;
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
  }
  .right_bot_wrap {
    display: flex;
    margin-top: 20px;
    margin-left: 60px;
    position: relative;
    margin-bottom: 20px;
    .bottom_img {
      width: 140px;
      height: 140px;
      margin-right: 35px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .bottom_text_box {
      p:nth-child(1) {
        width: 100%;
        font-size: 20px;
        color: #333;
        line-height: 20px;
      }
      p:nth-child(2) {
        width: 100%;
        margin-top: 23px;
        font-size: 12px;
        color: #666;
      }
      .open_btn {
        position: absolute;
        right: 20px;
        bottom: 10px;
      }
    }
  }
}
 .selectname{
    display: inline-block;
    border:1px solid #dcdfe6;
    border-radius: 4px;
    width: 178px;
    height: auto;
    min-height: 28px;
    padding-left: 20px;
    color: #333333;
  }
    .search {
    color: #46b6ee;
    cursor: pointer;
    margin-left: 10px;
    display: inline-block;
    position: absolute;
    top: 0px;
    right: 290px;
}

</style>

