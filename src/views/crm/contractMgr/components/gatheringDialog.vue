<template>
  <div
    :isloading="isloading"
    class="gatheringDialog_container"
  >
    <el-dialog
      :visible.sync="gatheringDialogShow"
      :close-on-click-modal="false"
      title="合同收款单"
      @close="cancelDialog('gatheringForm')"
    >
      <el-form
        ref="gatheringForm"
        :model="gatheringData"
        class="form_wrap"
      >
        <!-- :rules="rules" -->
        <div class="right_box">
          <div class="left_box">
            <img src="https://img.ishanshan.com/gimg/img/76b4f9887dbe6d49f80218c85901a0ca">
          </div>
          <div style="width: 100%">
            <el-form-item
              label="学员姓名:"
              prop="orderStuNames"
            >
              <span>{{ gatheringData.orderStuNames }}</span>
              <span
                :model="isSetGathering"
                class="set_btn"
                @click="setGatherBtn()"
              >{{ setGatherText }}</span>
            </el-form-item>
            <el-form-item
              label="合同编号:"
              prop="orderNum"
            >
              <span>{{ gatheringData.orderNum }}</span>
            </el-form-item>
            <el-form-item
              label="合同金额:"
              prop="totalMoney"
            >
              <span>{{ gatheringData.totalMoney }}</span>
            </el-form-item>
            <el-form-item
              label="合同清单:"
              prop="conOrder"
            >
              <span>{{ gatheringData.conOrder }}</span>
            </el-form-item>
          </div>
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
              v-else-if="depositList && depositList.length > 0 && depositSelect && depositSelect.id"
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
                  <p>确定收款？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      size="mini"
                      class="cancel_btn"
                      @click="moneyVisible = false"
                    >取消</el-button>
                    <el-button
                      type="primary"
                      size="mini"
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
                      :style="depositList && depositList.length > 0 ? 'cursor: pointer;text-align:end' : 'cursor: pointer'"
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
                      :style="depositList && depositList.length > 0 ? 'cursor: pointer;text-align:end' : 'cursor: pointer'"
                      @click="selectNothing"
                    >
                      不关联
                    </div>
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
                    <div
                      v-if="item.status !== '3'"
                      class="listStyle"
                    >
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

            <!-- 收款选择 -->
            <!--
            <div
              v-show="isTrueHand"
              class="from_con_third"
            >
              <div>
                <div class="con_third_left">
                  <el-form-item
                    label="待收金额:"
                    prop="perMoney"
                  >
                    <el-input
                      v-model="gatheringData.perMoney"
                      style="width: 100px;"
                    />
                    <span>元</span>
                  </el-form-item>
                </div>
                <div class="con_third_left con_third_right">
                  <span @click="handsFromShow()">手填收款</span>
                  <span
                    style="padding-right: 10px;"
                    @click="openOnlineDialog()"
                  >在线收款</span>
                </div>
              </div>
            </div>
            -->
            <!-- 手动收款  v-show="isHandsFromShow" -->

            <div
              v-if="gatheringData.needPayMoney > 0"
              class="from_con_fourth"
            >

              <!-- 收款状态选择框 -->
              <div class="payRadio_style">
                <el-radio-group
                  v-model="gatheringData.payRadio"
                  size="small"
                  @change="payRadioChange"
                >
                  <el-radio label="1">手填收款</el-radio>
                  <el-radio label="2">在线收款</el-radio>
                </el-radio-group>
              </div>

              <!-- 在线收款 -->
              <div v-if="gatheringData.linePayHidden">
                <el-form-item
                  label="待收金额："
                  prop="perMoney"
                >
                  <el-input
                    v-model="gatheringData.linePerMoney"
                    placeholder="请输入金额"
                    style="width: 120px"
                  />
                  <span style="margin-left: 10px;margin-right:170px">元</span>
                  <el-button
                    type="primary"
                    @click="linePayFun"
                  >在线收款</el-button>
                </el-form-item>
              </div>

              <!-- 手填收款 -->
              <div
                v-if="gatheringData.handPayShow"
                class="from_con_wrap"
              >
                <div
                  v-for="(item, index) in gatDataList"
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
                        v-if="gatheringData.deleteHidden"
                        class="from_con_body_right_bot"
                        @click="deleteForm(index)"
                      >
                        删除
                      </div>
                    </div>
                  </div>
                </div>

                <!-- v-if="gatheringData.addbotHidden" -->
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
                      实际到账: {{ gatheringData.realMoney || '0.00' }}元
                    </span>
                    <span>
                      手续费合计：{{ gatheringData.perMoneyRateAll }}元
                    </span>
                  </div>
                </div>

                <div style="width:100%;height:1px;borderTop:1px solid #eee;margin:19px 0;" />

                <div class="from_fourth_bottom">
                  <div>
                    <span>剩余应收: <i>{{ gatheringData.needPayMoney || '0.00' }}元</i></span>
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
                      @click="payOrderSure('gatheringForm')"
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
    <!--
    <el-dialog
      :visible.sync="onlineMoneyDialogShow"
      title="在线收款"
      style="margin-top: 10vh;"
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
    </el-dialog>
    -->

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
  getOrderDetailById, // 合同详情
  queryPurchaseDeposit, // 订金详情列表
  bindDeposit, // 合同绑定订金
  payInfoList, // 已收款单数据
  queryPaymentAccountList, // 收款方式列表查询
  payOrder // 支付合同
} from '@/api/crm/contract/contract.js'

import {
  queryAuditStatus // 是够开通在线收款
} from '@/api/crm/financeMgr/financeMgr'

import LinePayOpenDialog from '../../financeMgr/components/linePayOpenDialog'
import ContractPayFromDialog from '../../financeMgr/components/contractPayFromDialog'
export default {
  components: {
    LinePayOpenDialog,
    ContractPayFromDialog
  },
  data() {
    return {
      rowListData: '', // 弹窗打开后传过来的数据
      gatheringDialogShow: false,
      isLinePayOpenDialogShow: false, // 开通收款单弹窗显隐
      isContractPayFromShow: false, // 合同收款单显隐
      addbotHidden: true, // 新增按钮显隐
      valueBefore: '', // 收款方式前面选的数据
      gatheringData: {
        linePerMoney: '', // 在线收款金额
        perMoneyAll: 0, // 填写的收款金额总计
        perMoneyRateAll: 0, // 手续费合计
        needPayMoney: 0, // 未收款金额
        realMoney: '', // 实际到账
        deleteHidden: false, // 删除按钮的显隐
        contractOrderId: '', // 打开在线支付弹框出现的收款编号
        payRadio: '1', // 选择收款方式
        handPayShow: true, // 手填收款默认显示
        linePayHidden: false, // 在线收款默认不显示
        orderStuNames: '', // 学员姓名
        orderNum: '', // 合同编号
        totalMoney: '', // 合同金额
        conOrder: '', // 合同清单
        conMoney: '' // 收款金额
      },
      gatDataList: [
        {
          payType: '', // 收款方式
          perMoney: 0, // 待收金额
          rate: 0, // 手续费率
          orderId: '' // 交易流水号
        }
      ],

      depositList: [], // 订金详情数据
      depositSelect: {}, // 订金选中的选项
      depositChecked: false, // 订金是否已经关联
      allShops: [
        {
          value: 'yizhi',
          label: '一致'
        },
        {
          value: 'fankui',
          label: '反馈'
        },
        {
          value: 'xiaolv',
          label: '效率'
        },
        {
          value: 'kekong',
          label: '可控'
        }
      ],
      isSetGathering: false,
      isloading: false,
      setGatherText: '',
      moneyVisible: false, // 确定收款气泡
      contractOrderDetail: {}, // 合同收款详情数据
      isPurListShow: false, // 订金详情显隐
      isSelectNothing: false, // 选择不关联 有数据切换
      activeNames: '',
      onlineMoneyDialogShow: false, // 在线收款弹框显隐
      isTrueHand: true, // 在线收款和手动填款显示
      isHandsFromShow: false, // 手动填款显隐
      allPayMoneyList: [], // 已收金额数据
      allPaymentList: [] // 收款方式列表查询
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog(rowlist) {
      this.gatheringData.payRadio = '1'
      this.gatheringData.handPayShow = true
      this.gatheringData.linePayHidden = false
      this.addbotHidden = true // 新增按钮
      this.rowListData = rowlist
      this.activeNames = ''
      this.isHandsFromShow = false
      this.isTrueHand = true
      this.getOrderDetailByIdFun(rowlist)
      this.payInfoListFun(rowlist)
      this.queryPaymentAccountListFun()
      this.depositSelect = {}
      this.depositChecked = false
      this.gatheringDialogShow = !this.gatheringDialogShow
    },

    /* 获取合同详情数据 */
    getOrderDetailByIdFun(rowlist) {
      const params = {
        id: rowlist.orderNumber
      }
      this.isloading = true
      getOrderDetailById(params).then(res => {
        if (res.data.errorCode === 0) {
          this.contractOrderDetail = res.data.data
          let stuIdNum = ''
          this.contractOrderDetail.stuInfo.map(item => {
            this.gatheringData.orderStuNames = item.stuName
            stuIdNum = item.stuId
          })
          this.queryPurchaseDepositFun(rowlist, stuIdNum)
          this.contractOrderDetail.classpkg.map(item => {
            this.gatheringData.conOrder = item.name + 'X' + item.amount
          })
          this.gatheringData = {
            payRadio: this.gatheringData.payRadio,
            handPayShow: this.gatheringData.handPayShow,
            linePayHidden: this.gatheringData.linePayHidden,
            orderStuNames: this.gatheringData.orderStuNames,
            orderNum: this.contractOrderDetail.orderNum,
            totalMoney: this.contractOrderDetail.totalMoney,
            conOrder: this.gatheringData.conOrder,
            needPayMoney: this.contractOrderDetail.totalMoney - this.contractOrderDetail.receivedMoney - parseFloat(this.depositSelect.money || 0)
          }
          this.updateGatheringPerMoney()
        } else {
          this.$message.error(res.data.errorMessage)
        }
        this.isloading = false
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
          if (item.status == '2' && item.purchaseId == this.rowListData.orderNumber) { //eslint-disable-line
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
      } else {
        this.depositList = []
      }
    },

    /* 可选订金列表数据 */
    selectShowOk(item) {
      this.depositSelect = item
      this.isSelectNothing = false
      this.$forceUpdate()
    },
    /* 选择不关联 */
    selectNothing() {
      this.depositSelect = {}
    },

    // 关闭合同付款弹窗的回调
    closeDialogFun() {
      this.isContractPayFromShow = false
    },

    // 关闭当前弹窗
    cancelShow() {
      this.gatheringDialogShow = false
    },

    // 合同收款单弹窗
    contractPayFromDialog(value) {
      this.isContractPayFromShow = true
      this.$nextTick(() => {
        this.$refs.contractPayFromDialog.showDialog('saveAndPay', value)
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
          this.gatheringData.contractOrderId = this.rowListData.orderNumber
          this.contractPayFromDialog(this.gatheringData) // 合同收款单弹窗
        } else {
          this.linePayOpenDialog() // 开通在线收款功能
        }
      })
    },

    // 收款状态切换
    payRadioChange(value) {
      if (value === '1') { // 手填收款
        this.gatheringData.handPayShow = true
        this.gatheringData.linePayHidden = false
      } else if (value === '2') { // 在线收款
        this.gatheringData.handPayShow = false
        this.gatheringData.linePayHidden = true
        this.gatheringData.linePerMoney = this.gatheringData.needPayMoney
      }
    },

    /* 关闭弹框 */
    cancelDialog(formName) {
      this.$nextTick(() => {
        this.gatheringDialogShow = false
        this.isSetGathering = false
      })
      if (formName) {
        // this.isSetPcShow = true
        this.$refs[formName].resetFields()
      }

      this.isHandsFromShow = false
      this.isTrueHand = true
      if (this.gatheringData.orderId && this.gatheringData.payType) {
        this.gatheringData.orderId = ''
        this.gatheringData.payType = ''
      } else if (this.gatheringData.orderId) {
        this.gatheringData.orderId = ''
      } else if (this.gatheringData.payType) {
        this.gatheringData.payType = ''
      }
      this.gatheringData.rate = '手续费率: 0.00%'
      this.gatDataList = [
        {
          payType: '', // 收款方式
          perMoney: 0, // 待收金额
          rate: 0, // 手续费率
          orderId: '' // 交易流水号
        }
      ]
    },

    /** 更新待收款金额 */
    updateGatheringPerMoney() {
      // 收款金额
      this.gatDataList[0].perMoney = (this.contractOrderDetail.totalMoney - this.contractOrderDetail.receivedMoney - parseFloat(this.depositSelect && this.depositSelect.money || 0)).toFixed(2)

      // 未收款金额
      this.gatheringData.needPayMoney = (this.contractOrderDetail.totalMoney - this.contractOrderDetail.receivedMoney - parseFloat(this.depositSelect && this.depositSelect.money || 0)).toFixed(2)

      this.gatheringData.linePerMoney = this.gatheringData.needPayMoney

      // 实际到账金额
      // this.gatheringData.realMoney = (this.contractOrderDetail.totalMoney - this.contractOrderDetail.receivedMoney - parseFloat(this.depositSelect && this.depositSelect.money || 0)).toFixed(2)

      // 手续费合计
      this.perMoneyRateAll()
    },

    /* 收款方式值改变 */
    payTypeChange(value, index) {
      // 切换收款方式，置空流水号
      if (value !== this.valueBefore) {
        this.gatDataList[index].orderId = ''
      }

      if (value) {
        // 展示
        this.allPaymentList && this.allPaymentList.forEach(item => {
          if (item.id == value) { //eslint-disable-line
            this.gatDataList[index].rate = item.rate
            this.perMoneyChange()
          }
        })
      }
      this.valueBefore = value
    },

    /** 待收款金额判断 */
    perMoneyChange() {
      let s = 0
      this.gatDataList.forEach(item => {
        s += Number(item.perMoney)
      })
      this.gatheringData.perMoneyAll = s
      // 手续费合计
      this.perMoneyRateAll()
      // 计算实际到账金额
      this.gatheringData.realMoney = this.gatheringData.perMoneyAll - this.gatheringData.perMoneyRateAll
    },

    // 手续费合计
    perMoneyRateAll() {
      let result = 0
      this.gatDataList.forEach(item => {
        result += (Number(item.perMoney) * Number(item.rate))
      })
      this.gatheringData.perMoneyRateAll = result.toFixed(2)
    },

    // 删除当前支付方式
    deleteForm(index) {
      this.gatDataList.splice(index, 1)
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
      if (this.gatDataList.length === 4) {
        this.gatDataList.push(tempData)
        this.addbotHidden = false
      } else if (this.gatDataList.length < 4) {
        this.gatDataList.push(tempData)
      } else {
        this.addbotHidden = false
      }
      this.addFormOne()
    },

    // 保证有一种支付方式
    addFormOne() {
      if (this.gatDataList.length <= 1) {
        this.gatheringData.deleteHidden = false
      } else {
        this.gatheringData.deleteHidden = true
      }
    },

    /* 确认合同绑定订金 */
    sureBindDeposit(itemSelect) {
      const params = {
        purchaseId: this.rowListData.orderNumber,
        depositId: itemSelect.id
      }
      bindDeposit(params).then(res => {
        if (res.data.errorCode === 0) {
          this.moneyVisible = false
          this.$message.success(res.data.errorMessage)
          this.getOrderDetailByIdFun(this.rowListData)
          this.$forceUpdate()
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    /* 已收款金额数据 */
    payInfoListFun(rowlist) {
      const params = {
        purchaseId: rowlist.orderNumber
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
            this.allPayMoneyList.allMoneyNum = allMoneyNum.toFixed(2)
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

    /* 创建收款单按钮 */
    setGatherBtn() {
      this.isSetGathering = !this.isSetGathering
      if (this.isSetGathering === true) {
        // this.setGatherText = '开通在线收款'
        // this.isSetPcShow = false
      } else {
        // this.setGatherText = '创建收款单'
        // this.isSetPcShow = true
      }
    },
    /* 在线收款弹框 */
    openOnlineDialog() {
      this.onlineMoneyDialogShow = !this.onlineMoneyDialogShow
    },
    /* 手动填款 */
    handsFromShow() {
      this.isHandsFromShow = true
      this.isTrueHand = false
    },
    /* 暂不通过 */
    noPassBtn() {
      this.onlineMoneyDialogShow = false
    },

    /* 确定支付合同 */
    payOrderSure() {
      this.payOrderFun()
      this.$emit('toContractList')
    },

    // 改变对象的名称
    convertKeyFun(arr, key) {
      const newArr = []
      arr.forEach((item, index) => {
        const newObj = {}
        for (var i = 0; i < key.length; i++) {
          newObj[key[i]] = item[Object.keys(item)[i]]
        }
        newArr.push(newObj)
      })
      return newArr
    },

    /* 确定支付合同 */
    payOrderFun() {
      let paywayList = this.gatDataList
      paywayList = JSON.parse(JSON.stringify(paywayList).replace(/payType/g, 'payid'))
      paywayList = JSON.parse(JSON.stringify(paywayList).replace(/perMoney/g, 'money'))
      paywayList = JSON.parse(JSON.stringify(paywayList).replace(/orderId/g, 'realSerialNumber'))

      const params = {
        orderId: this.rowListData.orderNumber,
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
            this.gatheringDialogShow = false
            this.$emit('toContractList')
          } else {
            this.$message.error(res.data.errorMessage)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pop_item {
  margin-right: 40px;
}
.gatheringDialog_container /deep/ {
  .el-dialog {
    width: 600px !important;
  }
  .el-dialog__body {
    padding: 25px 0px 6px 0px !important;
  }
  .form_wrap {
    .left_box {
      margin-right: 10px;
    }
    .right_box {
      width: 100%;
      position: relative;
      display: flex;
      padding: 0 25px;
      box-sizing: border-box;
    }
    .right_box {
      width: 100%;
      .el-form-item--mini.el-form-item,
      .el-form-item--small.el-form-item {
        margin-bottom: 0;
      }
      .set_btn {
        color: #5d9cec;
        position: absolute;
        right: 0;
        cursor: pointer;
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
              padding-right: 70px;
              box-sizing: border-box;
            }
            span:nth-child(3) {
              // display: inline-block;
              float: right;
            }
          }
          .body_first_btn {
            width: 100%;
            height: 40px;
            line-height: 40px;
            float: right;
            a {
              color: #5d9cec;
              // display: inline-block;
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
          .listStyle {
            span:nth-of-type(1) {
              display: inline-block;
              width: 90px;
            }
            span:nth-of-type(2) {
              display: inline-block;
              width: 90px;
            }
            span:nth-of-type(3) {
              display: inline-block;
              width: 110px;
            }
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
              width: 0px;
            }
            /deep/ .el-form-item__content {
              margin-left: 0px;
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
</style>

