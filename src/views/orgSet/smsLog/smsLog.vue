
<template>
  <div class="sms_log">
    <!-- 剩余短信提示框 -->
    <div class="smsTop">
      <div>剩余短信</div>
      <div>
        <span>{{ lastNumber || '0' }}</span>
        <span>条</span>
        <el-button
          type="primary"
          @click="recharge"
        >充值</el-button>
      </div>

      <div>
        <span class="el-icon-warning" />
        <span v-show="messageWarn === '1'">
          <span>剩余短信不足</span>
          <span>{{ smsData.minNumber }}</span>
          <span>条，则短信通知</span>
          <span>{{ smsData.remindTel }}</span>
        </span>
        <span v-show="messageWarn === '0'">请设置提醒避免短信不足情况发生</span>
        <el-button
          type="text"
          style="color:#1D9DF2"
          @click="smSet"
        >设置</el-button>
      </div>

    </div>

    <div class="sendRecord">
      <span class="nameHeadLeft" />
      <p class="nameHead">发送记录</p>
    </div>

    <CommonSearch
      :is-inline="true"
      :params="formInline"
      :forms="formInline"
      @toParent="resetFieldHanle"
    />

    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="optionsTab"
      table-key="orgSettings_smsLog_smsLog"
    />

    <!-- 设置短信的弹窗 -->
    <SmSet
      ref="smSet"
      @toParent="getRemainingFun"
    />

    <!-- 充值弹窗 -->
    <RechargeDialog ref="rechargeDialog" />

  </div>
</template>

<script>

// import { fetchList } from '@/api/course'
import {
  getSendHistory, // 查询短信记录
  getRemaining // 查询短信条数和电话
} from '@/api/orgSet/smsLog'
import {
  getMessagesLeft // 短信剩余条数
} from '@/api/orgSet/messageNotice.js'
import CommonTable from '@/components/CommonTable/CommonTable'
import CommonSearch from '@/components/CommonSearch/CommonSearch'
import SmSet from './components/smSet' // 设置短信的弹窗
import RechargeDialog from './components/rechargeDialog' // 充值弹窗

export default {
  components: {
    CommonSearch,
    CommonTable,
    SmSet,
    RechargeDialog
  },
  data() {
    return {
      lastNumber: '', // 短信剩余条数
      smsData: {}, // 设置短信的提醒条数和电话
      messageWarn: '0', // 0显示文字提示设置，1显示的是已经设置好的内容
      listQuery: {
        show: true // 是否显示
      },
      columns: [

        {
          label: '接收人手机号',
          prop: 'recepMobile',
          isShowTooltip: true,
          width: '80px'
        },
        {
          label: '姓名',
          prop: 'recepName',
          width: '40px'
        },
        {
          label: '短信内容',
          prop: 'content',
          width: '200px',
          render: (h, params) => {
            return h('span', { class: 'sms_content' }, [
              h('el-popover', {
                props: { placement: 'top', width: '400', trigger: 'hover', content: params.row.content }
              }, [
                h('span', { slot: 'reference' }, params.row.content)
              ])
            ])
          }
        },

        {
          label: '发送时间',
          prop: 'createTime',
          render: (h, params) => {
            return h('span', {}, [
              h('el-popover', {
                props: { placement: 'top', trigger: 'hover', content: params.row.createTime }
              }, [
                h('span', { slot: 'reference' }, params.row.createTime)
              ])
            ])
          }
        },
        {
          label: '校区',
          prop: 'orgName',
          isColShow: false
        }

      ],
      optionsTab: {
        apiService: getSendHistory, // 表格的数据请求接口
        isSettingShow: true // 是否出现设置
      },

      tableHeight: 'calc(100vh - 280px)',
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '手机号',
            modelValue: 'mobile',
            isClearable: true
          },
          {
            itemType: 'datePicker',
            datePickerType: 'daterange',
            rangeSeparator: '~',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'yyyy-MM-dd',
            modelValue: 'date'
          }

        ]
      }

    }
  },

  mounted() {
    this.getRemainingFun()
    this.getMessagesLeftFun()
  },

  methods: {
    // 短信剩余条数查询
    getMessagesLeftFun() {
      getMessagesLeft().then(res => {
        this.lastNumber = res.data.lastNumber
      })
    },
    // 设置短信提醒条数和电话
    getRemainingFun() {
      getRemaining().then(res => {
        if (res.data.errorCode === 100099) {
          this.messageWarn = '0'
        } else {
          this.messageWarn = '1'
          this.smsData = res.data
        }
      })
    },

    // 充值按钮弹窗
    recharge() {
      this.$refs.rechargeDialog.showDialog()
    },
    // 短信设置弹窗
    smSet() {
      this.$refs.smSet.showDialog(this.smsData)
    },

    searchHandle(formValue) {
      // 搜索的入参
      const params = {
        mobile: formValue.mobile

      }
      if (formValue.date) {
        params.startTime = formValue.date[0]
        params.endTime = formValue.date[1]
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        pageIndex: 0
      }
      this.$refs.tableCommon.getList(params)
    }

  }
}
</script>

<style lang="scss" scoped>
.sms_log /deep/ {
  .sms_content {
    flex-wrap: wrap;
    line-height: 20px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
}
.sms_log /deep/ {
  .el-table .cell {
    height: 60px;
  }
  .el-table th > .cell {
    height: 44px;
  }
}

.smsTop {
  width: 100%;
  margin-bottom: 40px;
  height: 144px;
  background: rgba(246, 247, 249, 1);
  padding: 20px;
  div:nth-of-type(1) {
    width: 64px;
    height: 22px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFangSC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 22px;
    margin-bottom: 20px;
  }
  div:nth-of-type(2) {
    span:nth-of-type(1) {
      width: 63px;
      height: 28px;
      font-size: 26px;
      font-family: PingFangSC-Regular, PingFangSC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 28px;
    }
    span:nth-of-type(2) {
      width: 14px;
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFangSC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 20px;
      margin-right: 14px;
    }
  }
  div:nth-of-type(3) {
    font-family: PingFangSC-Regular, PingFangSC;
    font-weight: 400;
    font-size: 14px;
    span:nth-of-type(1) {
      width: 16px;
      height: 16px;
      color: rgba(187, 187, 187, 1);
    }
    span:nth-of-type(2) {
      color: #666;
      span {
        font-style: normal;
      }
      span:nth-of-type(2) {
        color: #f56c6c;
      }
      span:nth-of-type(4) {
        color: #f56c6c;
      }
    }
    span:nth-of-type(3) {
      color: #666;
    }
  }
}

.sendRecord {
  margin-bottom: 20px;
  .nameHeadLeft {
    display: inline-block;
    width: 6px;
    height: 14px;
    background: rgba(70, 182, 238, 1);
    border-radius: 4px;
  }
  .nameHead {
    display: inline-block;
    text-align: center;
    width: 80px;
    height: 16px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFangSC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 16px;
  }
}
</style>
