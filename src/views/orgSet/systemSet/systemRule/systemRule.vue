<template>
  <div>

    <div
      v-if="page === 'contract'"
      class="contract_rules"
    >
      <OrgSetBlock class="title">合同规则</OrgSetBlock>
      <p>
        <el-switch
          v-model="packageSta"
          active-color="#46b6ee"
          inactive-color="#dcdfe6"
          active-value="1"
          inactive-value="0"
          @change="switchOff('first',packageSta)"
        />
        <span>
          开合同时允许修改课时包实收规则
        </span>
      </p>
      <p>
        <el-switch
          v-model="materialSta"
          active-color="#46b6ee"
          inactive-color="#dcdfe6"
          active-value="1"
          inactive-value="0"
          @change="switchOff('second')"
        />
        <span>
          开合同时允许修改物资实收规则
        </span>
      </p>
      <p>

        <el-switch
          v-model="exportSta"
          active-color="#46b6ee"
          inactive-color="#dcdfe6"
          active-value="1"
          inactive-value="0"
          @change="switchOff('third')"
        />
        <span>
          合同列表页允许导出合同
        </span>
      </p>
      <p>

        <el-switch
          v-model="splitSta"
          active-color="#46b6ee"
          inactive-color="#dcdfe6"
          active-value="1"
          inactive-value="0"
          @change="switchOff('fourth')"
        />
        <span>
          拆分赠送合同
        </span>
      </p>

    </div>
    <div
      v-if="page === 'follow'"
      class="contract_rules"
    >

      <OrgSetBlock class="title">拥有学员规则</OrgSetBlock>
      <p>

        <el-switch
          v-model="backToClouePool[0].status"
          active-value="1"
          inactive-value="0"
          active-color="#46b6ee"
          inactive-color="#dcdfe6"
          @change="switchOff('backToClouePool',backToClouePool)"
        />
        <span>

          潜在学员超过
          <el-input
            :disabled="backToClouePool[0].status === '0'"
            v-model="backToClouePool[0].key"
            placeholder="请输入天数"
            type="Number"
            min="1"
            max="9999"
            @blur="blurFunc('backToClouePool')"
          >

            <!-- <span
              v-show="backToClouePool[0].key"
              slot="suffix"
              class="save_icon cp transition-box"
              @click="saveInputData('backToClouePool',backToClouePool)"
            /> -->
            <span
              v-show="backToClouePool[0].key"
              slot="suffix"
              class="delete_icon cp transition-box"
              @click="clearInput('backToClouePool',backToClouePool)"
            />

          </el-input>
          天没有新增跟进记录，该学员自动退回公海池
          <el-button v-show="backToClouePool[0].key && backToClouePool[0].status === '1'" :style="{ marginLeft: '10px' }" type="text" @click="saveInputData('backToClouePool',backToClouePool)">保存</el-button>
        </span>
      </p>

      <!-- <p>

        <el-switch
          v-model="value5"
          active-color="#46b6ee"
          inactive-color="#dcdfe6"
        />
        <span>

          <el-input
            v-model="input22"
            placeholder="请输入天数"
          >

            <span
              v-show="input22"
              slot="suffix"
              class="save_icon cp transition-box"
              @click="saveInputData(input22)"
            />
            <span
              v-show="input22"
              slot="suffix"
              class="delete_icon cp transition-box"
              @click="clearInput(input22)"
            />

          </el-input>
          天没有新增跟进记录，该学员自动退回公海池
        </span>
      </p> -->
      <p>

        <el-switch
          v-model="sellMaxNum[0].status"
          active-color="#46b6ee"
          inactive-color="#dcdfe6"
          active-value="1"
          inactive-value="0"
          @change="switchOff('sellMaxNum',sellMaxNum)"
        />
        <span>
          每个销售拥有的最大潜在学员数为
          <el-input
            :disabled="sellMaxNum[0].status === '0'"
            v-model="sellMaxNum[0].key"
            placeholder="请输入"
            type="Number"
            min="1"
            max="9999"
            @blur="blurFunc('sellMaxNum')"
          >

            <!-- <span
              v-show="sellMaxNum[0].key"
              slot="suffix"
              class="save_icon cp transition-box"
              @click="saveInputData('sellMaxNum',sellMaxNum)"
            /> -->
            <span
              v-show="sellMaxNum[0].key"
              slot="suffix"
              class="delete_icon cp transition-box"
              @click="clearInput('sellMaxNum',sellMaxNum)"
            />
          </el-input>
          <el-button v-show="sellMaxNum[0].key && sellMaxNum[0].status === '1'" :style="{ marginLeft: '10px' }" type="text" @click="saveInputData('sellMaxNum',sellMaxNum)">保存</el-button>
        </span>
      </p>

    </div>

    <div
      v-if="page === 'contract'"
      class="contract_rules"
    >

      <OrgSetBlock class="title">续费提醒</OrgSetBlock>

      <!-- 合同有效期 -->
      <p>
        <span class="stystemRuleInput">
          合同有效期小于（包括）

          <el-input
            v-model="validDate[0].key"
            placeholder="请输入"
            type="Number"
            min="1"
            max="9999"
            @blur="blurFunc('validDate')"
          >

            <!-- <span
              v-show="validDate[0].key"
              slot="suffix"
              class="save_icon cp transition-box"
              @click="saveInputData('purExpireRemind',validDate)"
            /> -->
            <span
              v-show="validDate[0].key"
              slot="suffix"
              class="delete_icon cp transition-box"
              @click="clearInput('purExpireRemind',validDate)"
            />
          </el-input>
          天进行提醒
          <el-button v-show="validDate[0].key" :style="{ marginLeft: '10px' }" type="text" @click="saveInputData('purExpireRemind',validDate)">保存</el-button>
        </span>
      </p>

      <!-- 课时小于 -->
      <p>
        <span class="stystemRuleInput">
          课时小于（包括）
          <el-input
            v-model="courseHour[0].key"
            placeholder="请输入"
            type="Number"
            min="1"
            max="9999"
            @blur="blurFunc('courseHour')"
          >

            <!-- <span
              v-show="courseHour[0].key"
              slot="suffix"
              class="save_icon cp transition-box"
              @click="saveInputData('PERIODNUMREMIND',courseHour)"
            /> -->
            <span
              v-show="courseHour[0].key"
              slot="suffix"
              class="delete_icon cp transition-box"
              @click="clearInput('PERIODNUMREMIND',courseHour)"
            />

          </el-input>
          进行提醒
          <el-button v-show="courseHour[0].key" :style="{ marginLeft: '10px' }" type="text" @click="saveInputData('PERIODNUMREMIND',courseHour)">保存</el-button>
        </span>
      </p>

      <!--  账户课时更变 -->
      <p>
        <span>
          <el-switch
            v-model="classChangeStatus"
            active-color="#46b6ee"
            inactive-color="#dcdfe6"
            active-value="1"
            inactive-value="0"
            @change="switchOff('sixth')"
          />
          <span class="stystemRuleInput">
            账户课时变更为0超过（包括）
            <el-input
              :disabled="classChangeStatus === '0'"
              v-model="classChange[0].value"
              placeholder="请输入"
              type="Number"
              min="1"
              max="9999"
              @blur="blurFunc('classChange')"
            >
              <!-- <span
                v-show="classChange[0].value && classChange[0].status === '1'"
                slot="suffix"
                class="save_icon cp transition-box"
                @click="saveInputData('RENEWALTIMEOUT',classChange)"
              /> -->
              <span
                v-show="classChange[0].value && classChange[0].status === '1'"
                slot="suffix"
                class="delete_icon cp transition-box"
                @click="clearInput('RENEWALTIMEOUT',classChange)"
              />
            </el-input>
            天不提醒
            <el-button v-show="classChange[0].value && classChange[0].status === '1'" :style="{ marginLeft: '10px' }" type="text" @click="saveInputData('RENEWALTIMEOUT',classChange)">保存</el-button>
          </span>
        </span>
      </p>

    </div>
    <div
      v-if="page === 'contract'"
      class="contract_rules"
    >
      <OrgSetBlock class="title">续费规则</OrgSetBlock>
      <p>
        <el-switch
          v-model="renewalStatus"
          active-color="#46b6ee"
          inactive-color="#dcdfe6"
          active-value="1"
          inactive-value="0"
          @change="switchOff('fifth')"
        />
        <span class="stystemRuleInput">
          未退费学员付清合同金额超过
          <el-input
            :disabled="renewalStatus === '0'"
            v-model="renewalDate[0].value"
            placeholder="请输入"
            type="Number"
            min="1"
            max="9999"
            @blur="blurFunc('renewalDate')"
          >
            <!-- <span
              v-show="renewalDate[0].value && renewalStatus === '1'"
              slot="suffix"
              class="save_icon cp transition-box"
              @click="saveInputData('RENEWDAYAFTERPAYOFFF',renewalDate)"
            /> -->
            <span
              v-show="renewalDate[0].value && renewalStatus === '1'"
              slot="suffix"
              class="delete_icon cp transition-box"
              @click="clearInput('RENEWDAYAFTERPAYOFFF',renewalDate)"
            />
          </el-input>
          天
          <el-button v-show="renewalDate[0].value && renewalStatus === '1'" :style="{ marginLeft: '10px' }" type="text" @click="saveInputData('RENEWDAYAFTERPAYOFFF',renewalDate)">保存</el-button>
        </span>
      </p>
    </div>
    <div
      v-if="page==='contract'"
      class="contract_rules"
    >
      <OrgSetBlock class="title">开始提醒</OrgSetBlock>
      <p>
        <span class="stystemRuleInput">
          距离合同开始的时间
          <el-input
            v-model="startRemind[0].key"
            placeholder="请输入"
            type="Number"
            min="1"
            max="9999"
            @blur="blurFunc('startRemind')"
          >

            <!-- <span
              v-show="startRemind[0].key"
              slot="suffix"
              class="save_icon cp transition-box"
              @click="saveInputData('purStartRemind',startRemind)"
            /> -->
            <span
              v-show="startRemind[0].key"
              slot="suffix"
              class="delete_icon cp transition-box"
              @click="clearInput('purStartRemind',startRemind)"
            />

          </el-input>
          天进行提醒
          <el-button v-show="startRemind[0].key" :style="{ marginLeft: '10px' }" type="text" @click="saveInputData('purStartRemind',startRemind)">保存</el-button>
        </span>
      </p>
    </div>
    <div
      v-if="page==='contract'"
      class="contract_rules"
    >
      <OrgSetBlock class="title">已预约课时不足提醒</OrgSetBlock>
      <p>
        <span class="stystemRuleInput">
          已预约课时小于（包括）
          <el-input
            v-model="periodLess[0].key"
            placeholder="请输入"
            type="Number"
            min="1"
            max="9999"
            @blur="blurFunc('periodLess')"
          >
            <!-- <span
              v-show="periodLess[0].key"
              slot="suffix"
              class="save_icon cp transition-box"
              @click="saveInputData('subscribePeriodLess',periodLess)"
            /> -->
            <span
              v-show="periodLess[0].key"
              slot="suffix"
              class="delete_icon cp transition-box"
              @click="clearInput('subscribePeriodLess',periodLess)"
            />
          </el-input>
          进行提醒
          <el-button v-show="periodLess[0].key" :style="{ marginLeft: '10px' }" type="text" @click="saveInputData('subscribePeriodLess',periodLess)">保存</el-button>
        </span>
      </p>
    </div>
    <el-dialog
      :visible.sync="isOpen"
      title="合同规则设置"
      @close="cancelDialog"
    >

      <div v-if="first">
        <p>
          确认{{ packageSta==='1'?'开启':'禁用' }}修改课时包实收规则吗？
        </p>
        <p class="warn_text">
          {{ packageSta==='1'?'开启':'禁用' }}后，在签订合同时，员工{{ packageSta==='1'?'可':'不可' }}更改课时包实收价格
        </p>
      </div>
      <div v-if="second">
        <p>
          确认{{ materialSta==='1'?'开启':'禁用' }}修改物资实收规则吗？
        </p>
        <p class="warn_text">
          {{ materialSta==='1'?'开启':'禁用' }}后，在签订合同时，员工{{ materialSta==='1'?'可':'不可' }}更改物资实收价格
        </p>
      </div>
      <div v-if="third">
        <p>
          确认 {{ exportSta==='1'?'启用':'禁用' }}允许合同列表导出合同吗？
        </p>
        <p class="warn_text">
          {{ exportSta==='1'?'开启':'禁用' }}后，合同列表页面将显示导出按钮，员工{{ exportSta==='1'?'可':'不可' }}导出合同信息
        </p>
      </div>
      <div v-if="fourth">
        <p>
          确认 {{ splitSta==='1'?'启用允许':'禁用' }} 拆分赠送合同吗？
        </p>
        <p class="warn_text">
          {{ splitSta==='1'?'开启':'禁用' }}后，{{ splitSta==='1'?'赠送合同需要分开审核':'赠送内容和原合同统一审核' }}
        </p>
      </div>
      <div v-if="fifth">
        <p>
          确认 {{ renewalStatus==='1'?'启用允许':'禁用' }} 该续费规则吗？
        </p>
        <p class="warn_text">
          {{ renewalStatus==='1'?'开启':'禁用' }}后，{{ renewalStatus==='1'?'学员可续费条件须满足您设定的时间及合同状态':'学员续费条件不受该规则束缚' }}
        </p>
      </div>

      <div v-if="sixth">
        <p>
          确认 {{ classChangeStatus==='1'?'启用允许':'禁用' }} 该账户课时变更吗？
        </p>
        <p class="warn_text">
          {{ classChangeStatus==='1'?'开启':'禁用' }}后，{{ classChangeStatus==='1'?'将对设定时长内课时为0的学员进行提示':'将对所有课时为0的学员数进行提示' }}
        </p>
      </div>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog()"
        >取消</el-button>
        <el-button
          type="primary"
          @click="submit()"
        >确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import OrgSetBlock from '@/components/MiniCommon/OrgSetBlock'
import { queryPurchaseConf, setPurchaseConf, saveConf, queryByKey } from '@/api/orgSet/systemSet'
export default {
  components: { OrgSetBlock },

  props: {
    page: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      contractAll: {}, // 合同规则初始值
      packageSta: '',
      materialSta: '',
      exportSta: '',
      splitSta: '', //  拆分赠送合同状态
      renewalStatus: '', // 续费规则
      sellMaxNum: [{ status: '', key: '' }], // 每个销售拥有的最大潜在学员数
      isSellMaxNum: '',
      backToClouePool: [{ status: '', key: '' }], // 潜在学员超过X天没有新增跟进记录
      courseHour: [{ status: '', key: '' }], // 续费提醒课时
      validDate: [{ status: '', key: '' }], // 合同有效期提醒
      startRemind: [{ status: '', key: '1' }], // 合同开始提醒
      periodLess: [{ status: '', key: '1' }],
      renewalDate: [{ status: '', key: 'renew', text: '续费规则' }], // 续费规则时间
      splitContract: [{ status: '', key: 'add' }], // 拆分赠送合同
      classChange: [{ status: '' }], // 账户课时变更
      classChangeStatus: '', // 账户课时变更状态
      isBackToClouePool: '',
      value4: false,
      value5: false,
      value6: false,
      isOpen: false,
      input22: '',
      switchName: '',
      saveId: '',
      studentRules: ['BACKTOCLUEPOOLDAY', 'SELLMAXLISTNUM', 'PERIODNUMREMIND', 'purExpireRemind', 'EXTPURCHASESET', 'RENEWDAYAFTERPAYOFFF', 'RENEWALTIMEOUT', 'purStartRemind', 'subscribePeriodLess']
    }
  },
  computed: {
    first: function() {
      if (this.switchName === 'first') {
        return true
      } else {
        return false
      }
    },
    second: function() {
      if (this.switchName === 'second') {
        return true
      } else {
        return false
      }
    },
    third: function() {
      if (this.switchName === 'third') {
        return true
      } else {
        return false
      }
    },
    fourth: function() {
      if (this.switchName === 'fourth') {
        return true
      } else {
        return false
      }
    },
    fifth: function() {
      if (this.switchName === 'fifth') {
        return true
      } else {
        return false
      }
    },
    sixth: function() {
      if (this.switchName === 'sixth') {
        return true
      } else {
        return false
      }
    }
  },
  mounted() {
    this.getPurchase()
    this.getSpu()
  },
  methods: {
    blurFunc(val) {
      if (val === 'backToClouePool') {
        if (!isNaN(parseInt(this[val][0].key))) {
          this[val][0].key = parseInt(this[val][0].key)
        }
        this[val][0].key < 1 ? this[val][0].key = 1 : this[val][0].key > 9999 ? this[val][0].key = 9999 : ''
      }
      if (val === 'sellMaxNum') {
        if (!isNaN(parseInt(this[val][0].key))) {
          this[val][0].key = parseInt(this[val][0].key)
        }
        this[val][0].key < 1 ? this[val][0].key = 1 : this[val][0].key > 9999 ? this[val][0].key = 9999 : ''
      }
      if (val === 'validDate') {
        if (!isNaN(parseInt(this[val][0].key))) {
          this[val][0].key = parseInt(this[val][0].key)
        }
        this[val][0].key < 1 ? this[val][0].key = 1 : this[val][0].key > 9999 ? this[val][0].key = 9999 : ''
      }
      if (val === 'courseHour') {
        if (!isNaN(parseInt(this[val][0].key))) {
          this[val][0].key = parseInt(this[val][0].key)
        }
        this[val][0].key < 1 ? this[val][0].key = 1 : this[val][0].key > 9999 ? this[val][0].key = 9999 : ''
      }
      if (val === 'classChange') {
        if (!isNaN(parseInt(this[val][0].value))) {
          this[val][0].value = parseInt(this[val][0].value)
        }
        this[val][0].value < 1 ? this[val][0].value = 1 : this[val][0].value > 9999 ? this[val][0].value = 9999 : ''
      }
      if (val === 'renewalDate') {
        if (!isNaN(parseInt(this[val][0].value))) {
          this[val][0].value = parseInt(this[val][0].value)
        }
        this[val][0].value < 1 ? this[val][0].value = 1 : this[val][0].value > 9999 ? this[val][0].value = 9999 : ''
      }
      if (val === 'startRemind') {
        if (!isNaN(parseInt(this[val][0].key))) {
          this[val][0].key = parseInt(this[val][0].key)
        }
        this[val][0].key < 1 ? this[val][0].key = 1 : this[val][0].key > 9999 ? this[val][0].key = 9999 : ''
      }
      if (val === 'periodLess') {
        if (!isNaN(parseInt(this[val][0].key))) {
          this[val][0].key = parseInt(this[val][0].key)
        }
        this[val][0].key < 1 ? this[val][0].key = 1 : this[val][0].key > 9999 ? this[val][0].key = 9999 : ''
      }
    },
    // 获取规则们
    getSpu() {
      this.studentRules.forEach(v => {
        const data = {
          confKey: v
        }
        queryByKey(data).then(res => {
          if (res.data.errorCode === 0) {
            if (res.data.data.confKey === 'SELLMAXLISTNUM') {
              this.sellMaxNum = res.data.data.results
            }
            if (res.data.data.confKey === 'BACKTOCLUEPOOLDAY') {
              this.backToClouePool = res.data.data.results
            }
            if (res.data.data.confKey === 'PERIODNUMREMIND') {
              this.courseHour = res.data.data.results
            }
            if (res.data.data.confKey === 'purExpireRemind') {
              this.validDate = res.data.data.results
            }
            if (res.data.data.confKey === 'EXTPURCHASESET') {
              this.splitContract = res.data.data.results
              this.splitSta = this.splitContract && this.splitContract[0].status
            }
            if (res.data.data.confKey === 'RENEWDAYAFTERPAYOFFF') { // 为退费学员
              this.renewalDate = res.data.data.results
              this.renewalStatus = this.renewalDate && this.renewalDate[0].status
            }
            // 合同开始提醒
            if (res.data.data.confKey === 'purStartRemind') {
              this.startRemind = res.data.data.results
              console.log('合同开始提醒', this.startRemind)
            }
            // 课时不足提醒
            if (res.data.data.confKey === 'subscribePeriodLess') {
              this.periodLess = res.data.data.results
              console.log('课时不足提醒', this.periodLess)
            }
            // 账户课时更变
            if (res.data.data.confKey === 'RENEWALTIMEOUT') {
              this.classChange = res.data.data.results
              this.classChangeStatus = this.classChange && this.classChange[0].status
            }
          } else {
            this.$message.error(res.data.errorMessage)
          }
        })
      })
    },
    saveInputData(val, value) {
      this.switchOff(val, value)
    },

    // 清空填写的天数
    clearInput(val, value) {
      if (val === 'backToClouePool') {
        this.backToClouePool[0].key = ''
      } else if (val === 'sellMaxNum') {
        this.sellMaxNum[0].key = ''
      } else if (val === 'PERIODNUMREMIND') {
        this.courseHour[0].key = ''
      } else if (val === 'purExpireRemind') {
        this.validDate[0].key = ''
      } else if (val === 'RENEWDAYAFTERPAYOFFF') {
        this.renewalDate[0].value = ''
      } else if (val === 'RENEWALTIMEOUT') {
        this.classChange[0].value = ''
      } else if (val === 'purStartRemind') {
        this.startRemind[0].key = ''
      } else if (val === 'subscribePeriodLess') {
        this.periodLess[0].key = ''
      }
    },
    // 获取合同规则
    getPurchase() {
      queryPurchaseConf().then(res => {
        if (res.data.errorCode === 0) {
          this.contractAll = res.data
          this.packageSta = res.data.packageSta
          this.materialSta = res.data.materialSta
          this.exportSta = res.data.exportSta
          this.saveId = res.data.id
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    switchOff(val, value) {
      console.log('99999999999', val)
      if (val === 'sellMaxNum' || val === 'backToClouePool' || val === 'purExpireRemind' || val === 'PERIODNUMREMIND' || val === 'RENEWDAYAFTERPAYOFFF' || val === 'RENEWALTIMEOUT' || val === 'purStartRemind' || val === 'subscribePeriodLess') {
        this.isOpen = false
        console.log('------------')
        var numData = {}
        // 账户课时变更弹出信息
        if (val === 'RENEWALTIMEOUT') {
          numData.value = JSON.stringify(this.classChange)
          numData.confKey = 'RENEWALTIMEOUT'
        }

        // 续费规则
        if (val === 'RENEWDAYAFTERPAYOFFF') {
          numData.value = JSON.stringify(this.renewalDate)
          numData.confKey = 'RENEWDAYAFTERPAYOFFF'
        }

        if (val === 'sellMaxNum') {
          numData.value = JSON.stringify(this.sellMaxNum)
          numData.confKey = 'SELLMAXLISTNUM'
        }

        if (val === 'backToClouePool') {
          numData.value = JSON.stringify(this.backToClouePool)
          numData.confKey = 'BACKTOCLUEPOOLDAY'
        }

        if (val === 'purExpireRemind') {
          numData.value = JSON.stringify(this.validDate)
          numData.confKey = 'purExpireRemind'
        }

        if (val === 'PERIODNUMREMIND') {
          numData.value = JSON.stringify(this.courseHour)
          numData.confKey = 'PERIODNUMREMIND'
        }
        // 保存合同开始提醒时间
        if (val === 'purStartRemind') {
          numData.value = JSON.stringify(this.startRemind)
          numData.confKey = 'purStartRemind'
        }
        // 保存课时不足提醒
        if (val === 'subscribePeriodLess') {
          numData.value = JSON.stringify(this.periodLess)
          numData.confKey = 'subscribePeriodLess'
        }
        saveConf(numData).then(res => {
          if (res.data.errorCode === 0) {
            console.log('---')
            this.getSpu()
            this.$message.success(res.data.errorMessage)
          } else {
            this.$message.error(res.data.errorMessage)
          }
        })
      } else {
        this.isOpen = true
        this.switchName = val
      }
    },
    cancelDialog() {
      this.isOpen = false
      if (this.first) {
        this.packageSta = this.contractAll.packageSta
      }
      if (this.second) {
        this.materialSta = this.contractAll.materialSta
      }
      if (this.third) {
        this.exportSta = this.contractAll.exportSta
      }
      if (this.fourth) {
        // this.renewalDate
        this.splitSta = this.splitContract && this.splitContract[0].status
      }
      if (this.fifth) {
        this.renewalStatus = this.renewalDate && this.renewalDate[0].status
      }
      if (this.sixth) {
        this.classChangeStatus = this.classChange && this.classChange[0].status
      }
    },
    submit() {
      this.isOpen = false
      if (this.switchName === 'fourth' || this.switchName === 'fifth' || this.switchName === 'sixth') {
        var postData = {}
        if (this.switchName === 'fourth') {
          this.splitContract[0].status = this.splitSta
          postData.value = JSON.stringify(this.splitContract)
          postData.confKey = 'EXTPURCHASESET'
        } else if (this.switchName === 'fifth') {
          this.renewalDate[0].status = this.renewalStatus
          this.renewalDate[0].text = '续费规则'
          this.renewalDate[0].key = 'renew'
          postData.value = JSON.stringify(this.renewalDate)
          postData.confKey = 'RENEWDAYAFTERPAYOFFF'
        } else if (this.switchName === 'sixth') { // 账户课时变更提交
          this.classChange[0].status = this.classChangeStatus
          this.classChange[0].text = '账户课时更变为0超过某值不提醒'
          this.classChange[0].key = 'timeout'
          postData.value = JSON.stringify(this.classChange)
          postData.confKey = 'RENEWALTIMEOUT'
        }
        saveConf(postData).then(res => {
          if (res.data.errorCode === 0) {
            this.getSpu()
            this.$message.success(res.data.errorMessage)
          } else {
            this.$message.error(res.data.errorMessage)
          }
        })
      } else {
        const data = {
          id: this.saveId,
          packageSta: this.packageSta,
          materialSta: this.materialSta,
          exportSta: this.exportSta
        }
        setPurchaseConf(data).then(res => {
          if (res.data.errorCode === 0) {
            this.getPurchase()
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
.title {
  margin-bottom: 14px;
}
.el-input--mini {
  width: 120px;
}

.warn_text {
  margin: 10px 0 14px;
  color: #d0021b;
}

.save_icon {
  width: 14px;
  height: 13px;
  transition: all 0.3s;

  margin-right: 5px;
  /* background-color: aliceblue; */
  display: inline-block;
  background-image: url("../../../../../static/systemSet/save_icon.png");
  background-repeat: no-repeat;
  &:active {
    background-image: url("../../../../../static/systemSet/blue_save.png");
    background-repeat: no-repeat;
  }
}

.delete_icon {
  width: 14px;
  height: 13px;
  /* background-color: aliceblue; */
  display: inline-block;
  background-image: url("../../../../../static/systemSet/delete_icon.png");
  background-repeat: no-repeat;
  &:active {
    background-image: url("../../../../../static/systemSet/blue_delete.png");
    background-repeat: no-repeat;
  }
}
.contract_rules {
  margin-bottom: 20px;

  p {
    margin-bottom: 14px;
    color: #666;
    span {
      margin-right: 2px;
    }
  }
}
.contract_rules /deep/ {
  .el-input__suffix-inner {
    line-height: 32px;
  }
  .save_icon {
    margin-right: 5px;
  }
}

.stystemRuleInput /deep/ {
  .el-input--suffix .el-input__inner {
    padding-right: 40px;
  }
}
</style>
