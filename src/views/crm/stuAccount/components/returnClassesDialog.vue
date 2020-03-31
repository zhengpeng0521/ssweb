<template>
  <div
    v-if="returnClassesDialogShow"
    class="returnClassesDialog_container"
  >
    <el-dialog
      :visible.sync="returnClassesDialogShow"
      class="contractOrderDialog_container_shy"
      title="转移课时"
      @close="cancelDialog()"
    >
      <div class="chooseLable">
        <span style="margin-left:50px;margin-right:10px;">转课时:</span>
        <el-radio-group v-model="radio">
          <el-radio :label="3">单学员转课时</el-radio>
          <el-radio :label="6">学员间转课时</el-radio>
        </el-radio-group>
      </div>
      <template v-show="radio==3">
        <el-form
          ref="returnClassesForm"
          :model="returnClassesData"
          :rules="rules"
          label-width="100px"
        >
          <div v-show="!isShowright">
            <el-form-item
              label="学员账户号:"
              prop="auth"
            >
              <span>{{ stuAccountId }}</span>
            </el-form-item>

            <el-form-item
              label="合同编号:"
              prop="purchaseId"
            >
              <div class="option">
                <el-select
                  v-model="returnClassesData.purchaseId"
                  clearable
                  filterable
                  placeholder="请选择合同编号"
                  style="width:280px"
                  @change="contractNoChange"
                >
                  <el-option
                    v-for="item in contractListSingleData"
                    :key="item.id"
                    :label="item.orderNum"
                    :value="item.id"
                  />
                </el-select>
              </div>
            </el-form-item>
          </div>
          <div v-show="dialogConShow">
            <span style="margin-bottom: 10px; display: inline-block;">转出课程</span>
            <el-table
              :data="outClassData"
              style="width: 100%"
              border
            >
              <el-table-column
                label="课时名称"
                prop="outCourseName"
                width="115"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.outCourseName"
                    size="small"
                    clearable
                    filterable
                    placeholder="课时名称"
                    @change="outClassChange"
                  >
                    <el-option
                      v-for="item in allPurListData"
                      :key="item.courseId"
                      :label="item.courseName"
                      :value="item.courseId"
                      :disabled="inClassData[0].inCourseId == item.courseId"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="剩余课时"
                prop="periodLeft"
                width="100"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.periodLeft || '0' }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="可转数量"
                prop="periodAvailable"
                width="110"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.periodAvailable || '0' }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="转出数量"
                prop="outNum"
                width="110"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.outNum"
                    class="out_class_price"
                    style="color: #333"
                    size="small"
                    clearable
                    placeholder="转出数量"
                    @keyup.native="outClassNumChange"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="转出金额"
                prop="price"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.totalPrice"
                    size="small"
                    clearable
                    placeholder="转出金额"
                    disabled
                  />
                </template>
              </el-table-column>
            </el-table>
            <span style="margin-top: 10px;margin-bottom: 10px; display: inline-block;">转进课程</span>
            <el-table
              ref="returnColForm"
              :data="inClassData"
              style="width: 100%"
              border
            >
              <el-table-column
                label="课时名称"
                prop="inCourseName"
                width="185"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.inCourseName"
                    size="small"
                    clearable
                    filterable
                    placeholder="课时名称"
                    @change="inClassChange"
                  >
                    <el-option
                      v-for="item in allCardClassList"
                      :key="item.courseId"
                      :label="item.courseName"
                      :value="item.courseId"
                      :disabled="outClassData[0].outCourseId == item.courseId"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="剩余课时"
                prop="periodLeft"
                width="180"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.periodLeft }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="转进数量"
                prop="inNum"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.inNum"
                    class="in_class_price"
                    size="small"
                    clearable
                    placeholder="转进数量"
                    @keyup.native="inClassNumChange"
                  />
                </template>
              </el-table-column>
            </el-table>
            <el-form-item
              label="处理方式:"
              prop="type"
              style="margin-top: 10px;"
            >
              <el-radio-group
                v-model="returnClassesData.type"
                @change="radioValueChange(returnClassesData.type)"
              >
                <el-radio :label="1">平价</el-radio>
                <el-radio :label="2">补缴</el-radio>
                <el-radio :label="3">退费</el-radio>
              </el-radio-group>
            </el-form-item>
            <div v-show="payInputShow">
              <el-form-item
                label="补缴金额:"
                prop="money"
              >
                <el-input
                  v-model="returnClassesData.money"
                  clearable
                  placeholder="请输入补缴金额"
                />
              </el-form-item>
            </div>
            <div v-show="backInputShow">
              <el-form-item
                label="退费金额:"
                prop="money"
              >
                <el-input
                  v-model="returnClassesData.money"
                  clearable
                  placeholder="请输入退费金额"
                />
              </el-form-item>
            </div>
          </div>
        </el-form>
      </template>
      <template v-show="radio==6">
        <el-form
          ref="returnForm"
          :model="returnClassesBetweenData"
          :rules="rulesOther"
          label-width="100px"
        >
          <div v-show="isShowright" class="betweenStu">
            <el-form-item
              label="学员账户号:"
              prop="auth"
            >
              <span>{{ stuAccountId }}</span>
            </el-form-item>
            <el-form-item
              label="合同编号:"
              prop="purchaseId"
            >
              <el-select
                v-model="returnClassesBetweenData.purchaseId"
                clearable
                filterable
                placeholder="请选择合同编号"
                style="width:280px"
                @change="contractChange"
              >
                <el-option
                  v-for="item in contractListData"
                  :key="item.id"
                  :label="item.orderNum"
                  :value="item.id"
                />
              </el-select>
              <el-tooltip content="已去除赠送合同与过期作废合同" placement="top">
                <!-- <i class="el-icon-warning confirm-icon" style="color:#999;margin-left:10px;transform: rotate(180deg);" /> -->
                <svg-icon icon-class="warnning" style="margin-left:10px; width:16px; height:16px;transform: rotate(180deg);" />
              </el-tooltip>
            </el-form-item>
          </div>
          <div v-show="dialogClassShow">
            <div class="titleClass"> <div class="classIcon"/> <div class="titleText">转出课程</div></div>
            <div
              class="shop_box_top shop_table_margin"
            >
              <ul class="shop_table_head">
                <li>课包名称</li>
                <li>剩余课时</li>
                <li>可转数量</li>
                <li>转出数量</li>
                <li>转出金额</li>
                <li>操作</li>
              </ul>
            </div>
            <div class="shop_table_margin">
              <ul
                v-for="(child,index) in outClassData"
                :key="'list'+index"
                class="shop_table_row"
              >
                <li class="selectChoose">
                  <el-form-item
                    :prop="index +'outCourseId'"
                  >
                    <el-select
                      v-model="child.outCourseName"
                      size="small"
                      clearable
                      filterable
                      placeholder="课时名称"
                      @change="(value) => {outClassOtherChange(value, index)}"
                    >
                      <el-option
                        v-for="item in allPurListData"
                        :key="item.courseId"
                        :label="item.courseName"
                        :value="item.courseId"
                        :disabled="item.isDisabled"
                      />
                    </el-select>
                  </el-form-item>
                </li>
                <li>
                  <el-form-item
                    prop="periodLeft"
                    width="80"
                  >
                    <span>{{ child.periodLeft || '0' }}</span>
                  </el-form-item>
                </li>
                <li>
                  <el-form-item
                    prop="periodAvailable"
                  >
                    <span>{{ child.periodAvailable || '0' }}</span>
                  </el-form-item>
                </li>
                <li class="selectChoose">
                  <el-form-item
                    :prop="index + 'outNum'"
                    :rules="[
                      { type: 'number', min: 0.01, message: '请输正整数', trigger: 'change' },
                      { pattern: /^[+]{0,1}(\d+)$/, message: '请输正整数', trigger: 'change' }
                    ]"
                  >
                    <el-input
                      v-model="child.outNum"
                      class="out_class_price"
                      style="color: #333"
                      size="small"
                      clearable
                      placeholder="转出数量"
                      @input="outClassOtherNumChange(child.outNum, index,child)"
                    />
                  </el-form-item>
                </li>
                <li class="selectChoose">
                  <el-form-item
                    prop="price"
                  >
                    <el-input
                      v-model="child.totalPrice"
                      size="small"
                      clearable
                      placeholder="转出金额"
                      disabled
                    />
                  </el-form-item>
                </li>
                <li>
                  <el-form-item
                  >
                    <span style="color:#46b6ee; cursor:pointer" @click="itemDelete(index)">删除</span>
                  </el-form-item>
                </li>
            </ul></div>
            <div class="add" style="width:60px;cursor:pointer;" @click="addRow">
              <img src="https://img.ishanshan.com/gimg/n/20190322/e6c073e90ca20cf3ec74d6e580c35efb">  <span style="color:#46b6ee; cursor:pointer;">新增</span>
            </div>
            <hr style="color:#EEEEEE;border:solid 1px #EEEEEE;margin-top:14px;margin-bottom:20px;">
            <div class="pushout">
              <div class="pushoutItem">  <span>¥{{ classPriceTotal || '0.0' }}</span><label>转入合同金额</label> </div>
              <div class="pushoutItem"> <span>{{ classTotal }}</span><label>转入总课时数</label></div>
            </div>
            <el-form-item
              label="转入学员:"
              prop="stuId"
            >
              <!-- <div class="name">
                <span style="margin-left:10px;">{{ name }}</span>
                <span class="span" @click="searchStu">查找</span>
              </div> -->
              <div class="stu_box">
                <StuSelect v-model="stuId" type="vipReading" width="180px" show-type no-month @select="stuSelect" />

                <div class="parName">
                  <span>学员家长:</span>
                  <span style="margin-left:10px;">{{ parentsName }}</span>
                </div>
              </div>

            </el-form-item>
            <el-form-item
              label="合同编号:"
              prop="purchaseId"
            >
              <el-select
                v-model="returnClassesBetweenData.purchaseOtherId"
                filterable
                placeholder="请选择合同编号"
                style="width:250px"
                @change="contractOtherChange"
              >
                <el-option
                  v-for="item in contractOtherListData"
                  :key="item.id"
                  :label="item.orderNum"
                  :value="item.id"
                />
              </el-select>
              <el-tooltip content="已去除赠送合同与过期作废合同" placement="top">
                <!-- <i class="el-icon-warning confirm-icon" style="color:#999;margin-left:10px;transform: rotate(180deg);" /> -->
                <svg-icon icon-class="warnning" style="margin-left:10px; width:16px; height:16px;transform: rotate(180deg);" />
              </el-tooltip>
            </el-form-item>
            <div class="date">
              <el-form-item
                label="合同期限:"
              >
                <el-date-picker
                  v-model="value1"
                  :clearable="false"
                  :disabled="true"
                  type="daterange"
                  format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"/>
              </el-form-item>
            </div>
            <el-form-item
              label="合同剩余课时:"
              prop="kehsi"
            >
              <div class="table_con">
                <table border="0" style="border:1px #F0F2F5 solid">
                  <tr style="background: #F0F2F5">
                    <th>课时名称</th>
                    <th>当前剩余课时</th>
                    <th>转入后剩余课时</th>
                  </tr>
                  <tr
                    v-for="(item,index) of classList"
                    :key="index + '_basicInfo'"
                  >
                    <td>{{ item.courseName }}</td>
                    <td>{{ item.periodSurplus }}</td>
                    <td>{{ item.intSurplus }}</td>
                  </tr>
                </table>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </template>
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
          @click="submitForm()"
        >确 定</el-button>
      </span>
    </el-dialog>
    <searchStu ref="searchStu" @getName="getName"/>
  </div>
</template>

<script>
import {
  queryOrderSummary, // 获取合同编号列表
  getCourseInfoByPurId, // 获取课时信息
  getCourseInfoByCardId, // 获取课程信息
  createTransferCourse, // 确定转课记录
  getStuInfo,
  getBaseInfoByPurId,
  transferStudentCourse
} from '@/api/crm/stuAccount/stuAccount.js'
import CommonDateSearch from '../../../../components/CommonDateSearch/CommonDateSearch'
import searchStu from './searchStu.vue'
import moment from 'moment'
import StuSelect from '@/components/StuSelect'

export default {
  components: {
    searchStu,
    CommonDateSearch,
    StuSelect
  },
  data() {
    return {
      temp: '',
      isShowright: false,
      // isDis: true,
      chooseClassTableListId: [],
      classList: [],
      radio: 3,
      dialogClassShow: false,
      returnClassesDialogShow: false, // 扣课顺序弹框显隐
      returnClassesData: {
        purchaseId: '', // 合同编号
        cardId: '', // 会员卡号
        type: '', // 类型 1.平价 2.补缴 3.退费
        money: '', // 补缴/退费金额
        creatorId: '' // 审核人id
      },
      returnClassesBetweenData: {
        purchaseId: '', // 合同编号
        purchaseOtherId: '' // 转入学员合同编号

      },
      outClassData: [
        {
          outCourseId: '', // 转出课程 id
          outCourseName: '', // 转出课程名字
          outNum: '', // 转出数量
          periodLeft: '', // 剩余课时
          periodAvailable: '', // 可转数量
          price: '', // 价格
          totalPrice: '',
          totalPriceSum: ''
        }
      ],
      inClassData: [
        {
          inCourseId: '', // 转进课程id
          inCourseName: '', // 转进课程名字
          inNum: '', // 转进数量
          periodLeft: '', // 剩余课时
          periodAvailable: '' // 可转数量
        }
      ],
      // shopTableListRules: {
      //   shopTableListAmount:
      // },
      rulesOther: {
        purchaseId: [
          { required: true, message: '请输入合同编号' }
        ]
      },
      rules: {
        purchaseId: [
          { required: true, message: '请输入合同编号' }
        ]
      },
      contractListSingleData: [], // 单学员转课获取列表
      contractListData: [], // 学员见转课获取合同编号列表
      contractOtherListData: [],
      allPurListData: [], // 获取课时信息列表
      allCardClassList: [], // 获取课程信息列表
      cardInfoData: {}, // 会员卡信息数据
      stuAccountId: '', // 学员账户号
      dialogConShow: false, // 弹框主要内容显隐
      payInputShow: false, // 补缴金额输入框显隐
      backInputShow: false, // 退费金额输入框显隐
      intSurplus: '',
      stuId: '', // 选中学员
      name: '',
      parentsName: '',
      paramsList: {},
      value1: [],
      lastPeriodLeft: 0, // 转入后剩余课时
      classPriceTotal: 0, // 总金额
      classTotal: 0, // 总数量
      outStuId: '',
      outPurchaseId: '',
      inCardId: '',
      inPurchaseId: '',
      coPurchaseId: '',
      courseInfo: [],
      newclassList: [],
      rowlist: {}
    }
  },
  watch: {
    radio(val) {
      // console.info('222', val)
      if (val === 3) {
        this.dialogConShow = false
        this.returnClassesData.purchaseId = ''
        this.isShowright = false
        this.dialogClassShow = false
        // this.$nextTick(() => {
        //   this.$refs.returnClassesForm.clearValidate()
        //   this.$refs.returnClassesForm.resetFields()
        // })
        // this.$refs.returnClassesForm.clearValidate()
        // this.$refs.returnClassesForm.resetFields()
      }
      if (val === 6) {
        // this.$nextTick(() => {
        //   this.$refs.returnForm.clearValidate()
        //   this.$refs.returnForm.resetFields()
        // })
        this.isShowright = true
        // this.isDis = true
        this.returnClassesBetweenData.purchaseId = ''
        this.dialogClassShow = false
        this.dialogConShow = false
        // this.getQueryOrderSummary()
        this.getQueryOrderSummaryL()
        const params = {
          cardId: this.stuAccountId
        }
        getStuInfo(params).then(res => {
          this.outStuId = res.data.results[0].stuId
        })
        // 切换时置空下面数据
        this.name = ''
        this.parentsName = ''
        this.paramsList = {}
        this.value1 = []
        this.classList = []
        this.returnClassesBetweenData.purchaseOtherId = ''
        this.classPriceTotal = 0// 总金额
        this.classTotal = 0 // 总数量
        this.$nextTick(() => {
          this.$refs.returnForm.clearValidate()
          this.$refs.returnForm.resetFields()
        })
      }
    },
    name(val) {
      // console.log('7777')
      this.getQueryOtherOrderSummary()
      // if (val === '') {
      //   console.log('111')
      //   this.classList = []
      // }
    },
    outClassData: {
      // console.log(val)
      handler(newName, oldName) {
        // console.log('newName', newName, oldName)
        // this.returnClassesBetweenData.purchaseOtherId = ''
        if (this.returnClassesBetweenData.purchaseOtherId !== '') {
          // console.log('7777777---')
          this.getNewList(this.inPurchaseId)
        }
        // if()
        // console.log('newName', newName)
      },
      // 开启深度监听
      deep: true
    },
    'returnClassesBetweenData.purchaseId'(val) {
      // console.log('----------')
      this.classPriceTotal = 0
      this.classTotal = 0
      this.name = ''
      this.parentsName = ''
      this.returnClassesBetweenData.purchaseOtherId = ''
      // this.returnClassesBetweenData.purchaseOtherId === ''
      // 切换时置空下面数据
      this.value1 = []
      // this.classList = ''
      // this.getName()
      this.classList = []
      // this.inPurchaseId = ''
      // console.log('======', this.classList)
    },
    'returnClassesBetweenData.purchaseOtherId'(val) {
      if (val === '') {
        this.value1 = []
        this.classList = []
      }
    }
  },
  methods: {
    // commonDatePickerChange(arr) {
    //   console.log('arr', arr)
    //   this.commonDateOptions.pickerDateArr = arr
    // },

    /** 选择学员 */
    stuSelect(value, row) {
      this.name = row.name
      this.parentsName = row.parentList && row.parentList[0].parentName
      this.paramsList = row
      this.inCardId = row.stuCardId
      this.returnClassesBetweenData.purchaseOtherId = ''
      this.value1 = []
      this.classList = []
    },

    // 获取namae
    getName(val1, val2, val3) {
      this.name = val1
      this.parentsName = val2
      this.paramsList = val3
      // console.log('val3', val3)
      this.inCardId = val3.stuCardId
      this.returnClassesBetweenData.purchaseOtherId = ''
      this.value1 = []
      this.classList = []
      // console.log('this.inCardId', this.inCardId)
    },
    // 点击搜索转入学员
    searchStu() {
      this.$refs.searchStu.showDialog()
    },
    classTotalSum() {
      this.classTotal = 0
      this.outClassData &&
        this.outClassData.length > 0 &&
        this.outClassData.map(item => {
          // console.log('item', item)
          this.classTotal += Number(item.outNum)
        })
      // console.log('this.classTotal', this.classTotal)
    },
    classTotalPriceChange() {
      // outClassData.totalPriceSum
      this.classPriceTotal = 0
      this.outClassData &&
        this.outClassData.length > 0 &&
        this.outClassData.map(item => {
          this.classPriceTotal += Number(item.totalPrice)
          // this.classRealPriceTotal += Number(item.money)
        })
      // console.log('this.classPriceTotal', this.classPriceTotal.toFixed(2))
      this.classPriceTotal = this.classPriceTotal.toFixed(2)
      // this.contractOrderData.atotalPrice = (
      //   this.classPriceTotal + this.materialPriceAll
      // ).toFixed(2)
      // this.contractOrderData.atotalRealPrice = (
      //   this.classRealPriceTotal + this.materialRealPriceAll
      // ).toFixed(2)
    },
    /* 合同编号下拉框列表数据 */
    getQueryOtherOrderSummary() {
      const params = {
        cardId: this.paramsList.stuCardId,
        type: '2',
        purchaseType: '2',
        overEndTime: '0'
      }
      queryOrderSummary(params).then(res => {
        if (res.data.errorCode === 0) {
          this.contractOtherListData = res.data.results
          this.coPurchaseId = res.data.results.length > 0 && res.data.results[0].id
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 合同编号下拉框列表数据 */
    getQueryOrderSummaryL() {
      // console.log('00000000', val)
      this.returnClassesBetweenData.purchaseId = ''
      const params = {
        cardId: this.rowlist.id,
        type: '2',
        purchaseType: '2',
        overEndTime: '0'
      }
      this.cardInfoData = this.rowlist
      queryOrderSummary(params).then(res => {
        // console.log('111111')
        if (res.data.errorCode === 0) {
          this.contractListData = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    getQueryOrderSummary(rowlist) {
      this.rowlist = rowlist
      const params = {
        cardId: rowlist.id,
        type: '2'
      }
      this.cardInfoData = rowlist
      queryOrderSummary(params).then(res => {
        // console.log('111111')
        if (res.data.errorCode === 0) {
          this.contractListSingleData = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    // 学员之间的转出合同编号的值的改变
    contractOtherChange(value) {
      // console.log('--------', value)
      // this.isDis = false
      this.inPurchaseId = value
      // console.log('this.contractOtherListData', this.contractOtherListData)
      this.contractOtherListData.forEach(item => {
        if (item.id === value) {
          const arr = [item.startTime, item.endTime]
          this.value1 = arr
        }
      })
      this.getNewList(value)
    },
    // 渲染列表
    getNewList(value) {
      // console.log('value', value)

      const para = {
        cardId: this.paramsList.stuCardId
      }
      getStuInfo(para).then(res => {
        let params = {}
        if (res.data.results.length > 0) {
          params = {
            cardId: res.data.results[0].cardId,
            stuId: res.data.results[0].stuId,
            purchaseId: value
          }
        }
        getBaseInfoByPurId(params).then(result => {
          if (this.name !== '') {
            this.classList = result.data.results
          }
          const commArr = []
          this.outClassData.map(item => {
            this.classList.map(ele => {
              // console.info('item',item, ele)
              if (ele.courseId === item.outCourseId) {
                // console.info('item---', item)
                commArr.push(item)
              }
            })
          })
          // console.log('hasname',commArr)
          const allArr = [...commArr, ...this.outClassData]
          const filterNonUnique = arr => arr.filter(i => arr.indexOf(i) === arr.lastIndexOf(i))
          const itemClass = filterNonUnique(allArr)
          // console.log('itemClass', itemClass)
          if (itemClass.length > 0) {
            if (itemClass[0].outCourseId === '') {
              // return
            } else {
              itemClass.forEach(item => {
                this.classList.push({
                  courseId: item.outCourseId,
                  courseName: item.outCourseName,
                  periodSurplus: 0,
                  intSurplus: Number(item.outNum)
                })
              })
            }
          } else {
            // return
          }
          // let obj = {}
          this.classList.forEach((item, index) => {
            // console.log('this.outClassData',this.outClassData)
            // this.$set(item, 'intSurplus', )

            this.outClassData.forEach(element => {
              // this.$set(item, 'intSurplus', Number(element.outNum) + Number(item.periodSurplus))

              // console.log(element,item)
              if (element.outCourseId === item.courseId) {
                // this.newclassList = []
                const obj = {
                  courseId: item.courseId,
                  courseName: item.courseName,
                  periodSurplus: Number(item.periodSurplus),
                  intSurplus: Number(element.outNum) + Number(item.periodSurplus)
                }
                this.classList.splice(index, 1, obj)
                // this.newclassList.push(obj)
              } else {
                this.$set(item, 'intSurplus', item.periodSurplus)
              }
              // this.newclassList.push(obj)
            })
          })
          // console.log('newclassList', this.newclassList, this.classList)
        })
      })
    },
    // 学员之间的合同编号的值的改变
    contractChange(value) {
      // console.log('value',value)
      if (this.radio === 6 && value === '') {
        this.name = ''
        this.parentsName = ''
        this.paramsList = {}
        this.value1 = []
        this.classList = []
        this.returnClassesBetweenData.purchaseOtherId = ''
        this.classPriceTotal = 0// 总金额
        this.classTotal = 0 // 总数量
      }
      if (this.radio === 6) {
        // console.log('0000000000000', this.chooseClassTableListId)
        this.chooseClassTableListId = []
        // this.allPurListData.map((item) => {
        //   // console.log('item', item)
        //   item.isDisabled = false
        //   this.chooseClassTableListId.map((itemShop) => {
        //     // console.log('chooseClassTableListId', itemShop)
        //     if (item.courseId === itemShop) {
        //       item.isDisabled = true
        //     }
        //   })
        // })
      }
      // this.isDis = true
      this.outPurchaseId = value
      this.dialogClassShow = true
      this.outClassData = [
        {
          outCourseId: '', // 转出课程 id
          outCourseName: '', // 转出课程名字
          outNum: '', // 转出数量
          periodLeft: '', // 剩余课时
          periodAvailable: '', // 可转数量
          price: '', // 价格
          totalPrice: ''
        }
      ]
      const params = {
        purchaseId: value,
        cardId: this.cardInfoData.id
      }
      getCourseInfoByPurId(params).then(res => {
        if (res.data.errorCode === 0) {
          this.dialogClassShow = true
          this.allPurListData = res.data.results
          // console.log('allPurListData', this.allPurListData)
        } else {
          this.dialogClassShow = false
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    // 新增
    addRow() {
      const rowData = {
        outCourseId: '', // 转出课程 id
        outCourseName: '', // 转出课程名字
        outNum: '', // 转出数量
        periodLeft: '', // 剩余课时
        periodAvailable: '', // 可转数量
        price: '', // 价格
        totalPrice: ''
      }
      if (this.outClassData.length < this.allPurListData.length) {
        this.outClassData.push(rowData)
      }
    },
    // 删除当前转课课程
    itemDelete(index, row) {
      if (this.outClassData.length > 1) {
        this.outClassData.splice(index, 1)
        this.classTotalPriceChange()
        this.classTotalSum()
        this.chooseClassTableListId.splice(index, 1)
        this.allPurListData.map((item) => {
          // console.log('item', item)
          item.isDisabled = false
          this.chooseClassTableListId.map((itemShop) => {
            // console.log('chooseClassTableListId', itemShop)
            if (item.courseId === itemShop) {
              item.isDisabled = true
            }
          })
        })
      }
    },
    /* 单学员合同编号的值改变 */
    contractNoChange(value) {
      // console.log('-------->')
      this.outClassData = [
        {
          outCourseId: '', // 转出课程 id
          outCourseName: '', // 转出课程名字
          outNum: '', // 转出数量
          periodLeft: '', // 剩余课时
          periodAvailable: '', // 可转数量
          price: '', // 价格
          totalPrice: ''
        }
      ]
      this.inClassData = [
        {
          inCourseId: '', // 转进课程id
          inCourseName: '', // 转进课程名字
          inNum: '', // 转进数量
          periodLeft: '', // 剩余课时
          periodAvailable: '' // 可转数量
        }
      ]
      const params = {
        purchaseId: value,
        cardId: this.cardInfoData.id
      }
      getCourseInfoByPurId(params).then(res => {
        if (res.data.errorCode === 0) {
          this.dialogConShow = true
          this.allPurListData = res.data.results
        } else {
          this.dialogConShow = false
          this.$message.error(res.data.errorMessage)
        }
      })
      getCourseInfoByCardId(params).then(res => {
        if (res.data.errorCode === 0) {
          this.dialogConShow = true
          this.allCardClassList = res.data.results
        } else {
          this.dialogConShow = false
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    outClassOtherChange(value, index) {
      console.log('value', value, index)
      if (value === '') {
        // console.log('--------------', this.outClassData[index])
        this.outClassData[index].outNum = ''
        this.outClassData[index].periodAvailable = ''
        this.outClassData[index].periodLeft = ''
        this.outClassData[index].totalPrice = ''
      }
      this.chooseClassTableListId.splice(index, 1, value)
      this.allPurListData.map((item) => {
        console.log('item', item)
        item.isDisabled = false
        this.chooseClassTableListId.map((itemShop) => {
          // console.log('chooseClassTableListId', itemShop)
          if (item.courseId === itemShop) {
            item.isDisabled = true
          }
        })
      })
      this.allPurListData && this.allPurListData.length > 0 &&
      this.allPurListData.map((item) => {
        if (item.courseId === value) {
          this.selectedOutClass = item
          // console.log('this.outClassData', this.outClassData)
          this.outClassData.map(itemClass => {
            // console.log('itemClass', itemClass)
            if (itemClass.outCourseName === item.courseId) {
              // console.log('3333')
              // eslint-disable-next-line no-sequences
              itemClass.outCourseId = item.courseId
              // eslint-disable-next-line no-sequences
              itemClass.outCourseName = item.courseName,
              itemClass.outNum = '',
              itemClass.periodLeft = item.periodLeft,
              itemClass.periodAvailable = item.periodAvailable,
              itemClass.price = item.price,
              itemClass.totalPrice = 0
            }
          })
        }
      })
      this.classTotalPriceChange()
      this.classTotalSum()
    },
    /* 转出课时下拉框值改变 */
    outClassChange(value, index) {
      this.allPurListData.map((item, index) => {
        if (item.courseId === value) {
          // this.contractOrderData.shopTableList.map(itemClass => {
          //   // eslint-disable-next-line
          //     if (itemClass.pid == item.id) {
          //     itemClass.price = item.price
          //     itemClass.singleMoney = item.realPrice
          //     itemClass.money = item.realPrice
          //     itemClass.aTotalPrice = item.price
          //     itemClass.downPrice = (
          //       Number(itemClass.aTotalPrice) - Number(itemClass.money)
          //     ).toFixed(2)
          //     itemClass.prePrice = (
          //       (Number(itemClass.money) * 10) /
          //         Number(itemClass.aTotalPrice)
          //     ).toFixed(2)
          //     itemClass.preferentialPrice =
          //         itemClass.downPrice + '元' + '/' + itemClass.prePrice + '折'
          //     itemClass.unitType = item.unitType
          //   }
          // })
          this.outClassData = [
            {
              outCourseId: item.courseId, // 转出课程 id
              outCourseName: item.courseName, // 转出课程名字
              outNum: '', // 转出数量
              periodLeft: item.periodLeft, // 剩余课时
              periodAvailable: item.periodAvailable, // 可转数量
              price: item.price, // 价格
              totalPrice: 0
            }
          ]
        }
      })
    },
    /* 转入课时下拉框值改变 */
    inClassChange(value) {
      this.allCardClassList.map((item, index) => {
        if (item.courseId === value) {
          this.inClassData = [
            {
              inCourseId: item.courseId, // 转进课程id
              inCourseName: item.courseName, // 转进课程名字
              inNum: '', // 转进数量
              periodLeft: item.periodLeft, // 剩余课时
              periodAvailable: item.periodAvailable // 可转数量
            }
          ]
        }
      })
    },
    /* 学员间转出数量值改变*/
    outClassOtherNumChange(value, index, child) {
      // console.log(value, child, index)
      // if()
      if (value > child.periodAvailable) {
        document.getElementsByClassName('out_class_price')[index].children[0].style.color = 'red'
        this.$message.error('转出数量不可超过可选数量')
      } else {
        document.getElementsByClassName('out_class_price')[index].children[0].style.color = 'black'
        child.totalPrice = (value * child.price).toFixed(2)
        this.classTotalPriceChange()
        this.classTotalSum()
      }
    },
    /* 转出数量输入框值改变 */
    outClassNumChange(value, child) {
      // child.totalPrice = (value * child.price).toFixed(2)
      // if(value>child.)
      // child.aTotalPrice = (value * child.price).toFixed(1)
      if (this.outClassData[0].outNum) {
        this.outClassData[0].totalPrice = parseFloat(this.outClassData[0].outNum * this.outClassData[0].price)
      }
      if (this.outClassData[0].outNum > this.outClassData[0].periodAvailable) {
        document.getElementsByClassName('out_class_price')[0].children[0].style.color = 'red'
      } else {
        document.getElementsByClassName('out_class_price')[0].children[0].style.color = 'black'
      }
    },
    /* 转进数量输入框值改变 */
    inClassNumChange() {
      if (this.inClassData[0].inNum > this.inClassData[0].periodLeft) {
        document.getElementsByClassName('in_class_price')[0].children[0].style.color = 'red'
      }
    },
    /* 转课弹框单选框值改变 */
    radioValueChange(value) {
      if (value === 1) {
        this.backInputShow = false
        this.payInputShow = false
        this.rules = {
          purchaseId: [
            { required: true, message: '请输入合同编号', trigger: 'change' }
          ]
        }
      }
      if (value === 2) {
        this.payInputShow = true
        this.backInputShow = false
        this.rules = {
          purchaseId: [
            { required: true, message: '请输入合同编号', trigger: 'change' }
          ],
          money: [
            { required: true, message: '请输入金额', trigger: 'change' }
          ]
        }
      }
      if (value === 3) {
        this.backInputShow = true
        this.payInputShow = false
        this.rules = {
          purchaseId: [
            { required: true, message: '请输入合同编号', trigger: 'change' }
          ],
          money: [
            { required: true, message: '请输入金额', trigger: 'change' }
          ]
        }
      }
    },
    /* 显示转移课时弹框 */
    showDialog(rowlist) {
      this.stuAccountId = rowlist.id
      this.returnClassesDialogShow = true
      this.dialogConShow = false
      this.payInputShow = false
      this.backInputShow = false
      this.radio = 3
      this.getQueryOrderSummary(rowlist)
    },
    /* 确定提交扣课顺序弹框 */
    submitForm() {
      if (this.radio === 3) {
        const params = {
          purchaseId: this.returnClassesData.purchaseId || '', // 合同编号
          cardId: this.cardInfoData.id, // 会员卡号
          outCourseId: this.outClassData[0].outCourseId, // 转出课程 id
          outCourseName: this.outClassData[0].outCourseName, // 转出课程名字
          outNum: this.outClassData[0].outNum, // 转出数量
          inCourseId: this.inClassData[0].inCourseId, // 转进课程id
          inCourseName: this.inClassData[0].inCourseName, // 转进课程名字
          inNum: this.inClassData[0].inNum, // 转进数量
          type: this.returnClassesData.type, // 类型 1.平价 2.补缴 3.退费
          money: this.returnClassesData.money || '', // 补缴/退费金额
          creatorId: '' // 审核人id
        }
        this.$refs.returnClassesForm.validate(valid => {
          if (valid) {
            createTransferCourse(params).then(res => {
              if (res.data.errorCode === 0) {
                this.returnClassesDialogShow = false
                this.stuId = ''
                this.$refs.returnClassesForm.resetFields()
                this.$message.success(res.data.errorMessage)
              } else {
                this.$message.error(res.data.errorMessage)
              }
            })
          }
        })
      } else {
        this.$refs.returnForm.validate(valid => {
          if (valid) {
            if (this.outClassData.length > 0 && this.outClassData[0].outNum !== '') {
              this.courseInfo = []
              this.outClassData.forEach(item => {
                console.log('item', item)
                if (item.periodAvailable >= item.outNum) {
                  this.courseInfo.push({
                    courseId: item.outCourseId,
                    courseNum: item.outNum,
                    courseName: item.outCourseName,
                    money: item.price.toFixed(2) * item.outNum
                  })
                } else {
                  this.$message.error('所选课程' + item.outCourseName + '转出数量大于可选数量')
                }
              })
              const course = JSON.stringify(this.courseInfo)
              if (this.inPurchaseId !== '') {
                const params = {
                  outPurchaseId: this.outPurchaseId,
                  outStuId: this.outStuId,
                  outCardId: this.stuAccountId,
                  courseInfo: course,
                  inCardId: this.inCardId,
                  inPurchaseId: this.inPurchaseId,
                  purStartTime: moment(this.value1[0]).format('YYYY-MM-DD HH:mm:ss'),
                  purEndTime: moment(this.value1[1]).format('YYYY-MM-DD HH:mm:ss')
                  // money: this.classPriceTotal
                }
                if (this.outPurchaseId !== this.inPurchaseId) {
                  // this.$refs.returnForm.validate(valid => {
                  //   if (valid) {
                  transferStudentCourse(params).then(res => {
                    // console.log('res-----------------------', params)
                    if (res.data.errorCode === 0) {
                      this.returnClassesDialogShow = false
                      this.stuId = ''
                      this.$refs.returnForm.resetFields()
                      this.$message.success(res.data.errorMessage)
                    } else {
                      this.$message.error(res.data.errorMessage)
                    }
                  })
                  // }
                  // })
                } else {
                  this.$message.error('不能转出给自己')
                }
              } else {
                this.$message.error('转入学员合同编号未选')
              }
            } else {
              this.$message.error('转出课程必选且转出数量不为空')
            }
          }
        })
        // this.courseInfo

        // const params = {
        //   purchaseId: this.returnClassesData.purchaseId || '', // 合同编号
        //   cardId: this.cardInfoData.id, // 会员卡号
        //   outCourseId: this.outClassData[0].outCourseId, // 转出课程 id
        //   outCourseName: this.outClassData[0].outCourseName, // 转出课程名字
        //   outNum: this.outClassData[0].outNum, // 转出数量
        //   inCourseId: this.inClassData[0].inCourseId, // 转进课程id
        //   inCourseName: this.inClassData[0].inCourseName, // 转进课程名字
        //   inNum: this.inClassData[0].inNum, // 转进数量
        //   type: this.returnClassesData.type, // 类型 1.平价 2.补缴 3.退费
        //   money: this.returnClassesData.money || '', // 补缴/退费金额
        //   creatorId: '' // 审核人id
        // }
        // this.$refs.returnForm.validate(valid => {
        //   if (valid) {
        //     createTransferCourse(params).then(res => {
        //       if (res.data.errorCode === 0) {
        //         this.returnClassesDialogShow = false
        //         // this.$refs.returnForm.resetFields()
        //         this.$message.success(res.data.errorMessage)
        //       } else {
        //         this.$message.error(res.data.errorMessage)
        //       }
        //     })
        //   }
        // })
      }
    },
    /* 关闭扣课顺序弹框 */
    cancelDialog(formName) {
      this.returnClassesDialogShow = false
      // if(this.radio=)
      if (this.radio === 3) {
        this.stuId = ''
        this.$refs.returnClassesForm.clearValidate() // 清除校验
        this.$refs.returnClassesForm.resetFields()
      } else {
        this.stuId = ''
        this.$refs.returnForm.clearValidate()
        this.$refs.returnForm.resetFields()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.returnClassesDialog_container /deep/ {
  .chooseLable{
    margin-bottom: 10px;
  }
  .selectChoose /deep/{
    .el-input__inner{
      width: 86px;
    }
  }
  .titleClass{
    display: flex;
    align-content: center;
    margin-bottom: 14px;
    .classIcon{
      display: inline-block;
      width:6px;
      height:14px;
      background:#46B6EE;
      border-radius:2px;
      margin-right: 6px;
    }
    .titleText{
       display: inline-block;
       font-size:16px;
       color: #333333;
    }
  }
  .add{
    display: flex;
    align-items: center;
    margin: 10px 0px;
    img{
      margin-right: 5px;
    }
  }
  .name{
    width: 250px;
    height: 28px;
    background:rgba(255,255,255,1);
    border-radius:5px;
    border:1px solid rgba(221,221,221,1);
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
    display: inline-block;
    position: relative;
    .span{
      position: absolute;
      color:#46b6ee;
       cursor:pointer;
       right: 10px;
    }
  }
    // span{
  .parName{
    margin-left: 50px;
    display: inline-block;
  }
    // }
  .contractOrderDialog_container_shy .shop_table_head li:first-child{
    width: 140px;
  }
  .contractOrderDialog_container_shy .shop_table_head li{
     width: 115px;
  }
  .contractOrderDialog_container_shy .shop_table_row li:first-child{
    width: 140px;
  }
  .contractOrderDialog_container_shy .shop_table_row li{
    width: 116px;
  }
  .contractOrderDialog_container_shy .shop_table_margin{
    margin-left: 0px !important;
    width:643px !important;
  }
  // .option /deep/{
  // .el-select .el-select--mini{
  //   width: 280px;
  // }
  // }
  .pushout{
    widows: 100%;
    display: flex;
    justify-content: space-between;
    align-content: center;
    margin-bottom: 20px;
     span{
        color: #F56C6C;
        font-size: 22px;
      }
      label{
        color: #666666;
      }
    .pushoutItem{
      width: 316px;
      height:70px;
      background-color: #F0F2F5;
      border-radius:5px;
      // opacity:0.6;
      text-align: center;
      // line-height:70px;
      display: flex;
      flex-direction:column;
      justify-content: center;
      align-items: center;
    }

  }
  .el-dialog {
    width: 700px;
  }
  .el-table th {
    background: #f0f2f5;
  }
  .el-table--border th {
    border-right: 0;
  }
  .el-table--border td {
    border-right: 0;
  }
  .el-input__inner {
    padding: 0 7px;
  }
  .date /deep/{
    margin-left:25px;
  .el-range-editor--mini.el-input__inner{
     width: 250px !important;
   }
   .el-range-editor--mini .el-range-separator{
     width: 20px;
     line-height: 27px;
   }
  }
   .table_con {
    color: #666;
    // margin-top: 20px;
    table {
      border-collapse: collapse;
    }
    table,
    td,
    th {
      border: none;
    }
    table {
      width: 540px;
    }
    th {
      height: 32px;
      font-weight: 500;
    }
    td {
      height: 32px;
      text-align: center;
    }
  }
}
.betweenStu /deep/{
  .el-form-item__content{
    display: flex;
    align-items: center
  }
}

.stu_box{
  display: flex;
}
</style>
