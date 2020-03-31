<template>
  <div>
    <full-Screen
      :type="type"
      :visible.sync="sideDialogShows"
      class="rechargeDialog_container"
    >
      <div class="rechargeSmsSty">
        <div class="surplusMs">
          <div style="color:#666">剩余短信</div>
          <div style="margin:20px 0;display:flex">
            <span style="color:#333;font-size:26px">{{ lastNumber }}</span>
            <span style="color：#333;margin:9px 0 0 4px">条</span>
          </div>
          <div class="wrapnum">
            <div
              v-for="(item,index) in messArr"
              :key="index"
              class="wrapcon"
            >
              <div
                v-if="item.rebate != 0"
                class="wrapconDiscount"
              >{{ item.rebate + '折' }}</div>
              <span style="color:#666;margin-bottom:14px;font-size:16px">{{ item.number }}条</span>
              <span style="color:#F56C6C;font-size:26px">¥{{ item.rebatePrice }}</span>
              <span
                v-if="item.rebate != 0"
                class="rebeatp"
              >
                ¥{{ item.realPrice }}
              </span>
              <span
                class="bottomP"
                @click="Recharge(item.rebatePrice, item.number, item.id)"
              >充值</span>
            </div>
          </div>
        </div>
        <div class="rechargeRecord">
          <span />
          <span>充值记录</span>
        </div>
        <!-- 表格 -->
        <CommonTable
          ref="tableCommon"
          :columns="columns"
          :table-height="tableHeight"
          :pagination="listQuery"
          :options="options"
          table-key="crm_finance_gathering"
        />
      </div>
      <ServserBuy
        ref="servserDialog"
        @messagetype="messagetype"
      />
    </full-Screen>

  </div>
</template>

<script>
import FullScreen from '@/components/messageNotice/fullScreen' // 右侧弹出框样式
import CommonTable from '@/components/CommonTable/CommonTable'
import ServserBuy from './components/ServserBuy'
import { getMessagesLeft, querySmsPackage, queryRechargeLog } from '@/api/orgSet/message.js'

export default {
  components: {
    FullScreen,
    CommonTable,
    ServserBuy
  },
  data() {
    return {
      paramsa: {
        pageIndex: 0,
        pageSize: 10
      },
      lastNumber: '',
      type: '短信充值',
      typec: '服务订购',
      sideDialogShows: false,
      messArr: [],
      value: true,
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '订购时间',
          prop: 'createTime'
        },
        {
          label: '充值条数',
          prop: 'number'
        },
        {
          label: '花费金额',
          prop: 'sumAmount',
          render: (h, params) => {
            return h(
              'span',
              {
                style: 'margin-left:28px'
              }, params.row.sumAmount
            )
          }
        },
        {
          label: '充值来源',
          prop: 'source',
          formatter: (row, column, cellValue) => {
            if (row.source == '0') { //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        ${'用户充值'}
                      </div>`
            }
            if (row.source == '1') { //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        ${'系统赠送'}
                      </div>`
            }
          }
        },
        {
          label: '状态',
          prop: 'status',
          render: (h, params) => {
            if (params.row.status == '0') {//eslint-disable-line
              return h('div', {}, [
                h(
                  'span',
                  {
                    style: 'color:#FF9436'
                  }, params.row.statusStr
                ),
                h(
                  'span',
                  {
                    style: 'color:#1D9DF2;margin-left:55px;cursor: pointer;',
                    on: {
                      click: () => {
                        this.messagesou(params.row)
                      }
                    }
                  }, '去付款'
                )
              ]
              )
            }
            if (params.row.status == '1') {//eslint-disable-line
              return h('div', {}, [
                h(
                  'span',
                  {
                    style: 'color:#999'
                  }, params.row.statusStr
                ),
                h(
                  'span',
                  {
                    style: 'color:#1D9DF2;margin-left:30px;cursor: pointer;',
                    on: {
                      click: () => {
                        this.messagesou(params.row)
                      }
                    }
                  }, '查看'
                )
              ]
              )
            }
            if (params.row.status == '2') {//eslint-disable-line
              return h('div', {}, [
                h(
                  'span',
                  {
                    style: 'color:#999'
                  }, params.row.statusStr
                ),
                h(
                  'span',
                  {
                    style: 'color:#1D9DF2;margin-left:30px;cursor: pointer;',
                    on: {
                      click: () => {
                        this.messagesou(params.row)
                      }
                    }
                  }, '查看'
                )
              ]
              )
            }
            if (params.row.status == '3') {//eslint-disable-line
              return h('div', {}, [
                h(
                  'span',
                  {
                    style: 'color:#999'
                  }, params.row.statusStr
                ),
                h(
                  'span',
                  {
                    style: 'color:#1D9DF2;margin-left:57px;cursor: pointer;',
                    on: {
                      click: () => {
                        this.messagesou(params.row)
                      }
                    }
                  }, '查看'
                )
              ]
              )
            }
            if (params.row.status == '4') {//eslint-disable-line
              return h('div', {}, [
                h(
                  'span',
                  {
                    style: 'color:#999'
                  }, params.row.statusStr
                ),
                h(
                  'span',
                  {
                    style: 'color:#1D9DF2;margin-left:30px;cursor: pointer;',
                    on: {
                      click: () => {
                        this.messagesou(params.row)
                      }
                    }
                  }, '查看'
                )
              ]
              )
            }
            if (params.row.status == '5') {//eslint-disable-line
              return h('div', {}, [
                h(
                  'span',
                  {
                    style: 'color:#999'
                  }, params.row.statusStr
                ),
                h(
                  'span',
                  {
                    style: 'color:#1D9DF2;margin-left:44px;cursor: pointer;',
                    on: {
                      click: () => {
                        this.messagesou(params.row)
                      }
                    }
                  }, '查看'
                )
              ]
              )
            }
          }
        }
      ],
      options: {
        apiService: queryRechargeLog, // 表格的数据请求接口
        isSettingShow: true // 是否出现设置
      },
      tableHeight: 'calc(100vh - 227px)'
    }
  },
  methods: {
    showDialog() {
      this.sideDialogShows = true
      this.querySmsPackage()
      this.getMessagesLeft()
      this.$nextTick(() => {
        this.$refs.tableCommon.getList(this.paramsa)
      })
    },
    Recharge(price, numbers, id) {
      this.$refs.servserDialog.showDialog(this.typec, price, numbers, id)
    },
    messagetype(istue) {
      // 执行套餐列表更新
      this.getMessagesLeft()
      if (istue) {
        const type = {
          pageIndex: istue,
          pageSize: 10
        }
        this.$refs.tableCommon.getList(type)
      } else {
        this.$refs.tableCommon.getList(this.paramsa)
      }
    },
    getMessagesLeft() {
      getMessagesLeft().then(res => {
        if (res.data.errorMessage === '成功') {
          this.lastNumber = res.data.lastNumber
        }
      })
    },
    querySmsPackage() {
      querySmsPackage().then(res => {
        if (res.data.errorMessage === '成功') {
          this.messArr = res.data.results.reverse()
        }
      })
    },
    messagesou(type) {
      // console.log(this.$refs.tableCommon.pageIndex)
      const pageIndex = this.$refs.tableCommon.pageIndex
      this.$refs.servserDialog.showTable(this.typec, type, pageIndex)
    }
  }
}
</script>

<style lang="scss" scoped>
.rechargeDialog_container {
  overflow: auto;
  .rechargeSmsSty {
    width: calc(100vw - 150px - 3%);
    margin-left: 1.5%;
    margin-top: 20px;
    .surplusMs {
      height: 313px;
      background: #f6f7f9;
      padding: 20px;
    }
    .rechargeRecord {
      display: flex;
      align-items: center;
      margin: 40px 0 20px 0;
      span:nth-child(1) {
        width: 6px;
        height: 14px;
        background: rgba(70, 182, 238, 1);
        border-radius: 4px;
      }
      span:nth-child(2) {
        font-size: 16px;
        color: #333;
        margin-left: 8px;
      }
    }
    .wrapnum {
      display: flex;
      justify-content: space-between;
      align-content: center;
      .wrapcon {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 23%;
        height: 185px;
        background: rgba(255, 255, 255, 1);
        padding: 30px 0 0 0;
        position: relative;
        border-radius: 6px;
        .rebeatp {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFangSC;
          font-weight: 400;
          color: rgba(204, 204, 204, 1);
          text-decoration: line-through;
          margin-top: 5px;
        }
        .wrapconDiscount {
          position: absolute;
          top: 9px;
          left: -22px;
          -webkit-transform: rotate(-45deg);
          transform: rotate(-45deg);
          width: 85px;
          height: 0;
          border-left: 25px solid transparent;
          border-right: 25px solid transparent;
          border-bottom: 25px solid #fd5202;
          line-height: 25px;
          text-align: center;
          font-size: 13px;
          font-family: PingFangSC-Medium, PingFangSC;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
        }
        .bottomP {
          position: absolute;
          bottom: 20px;
          left: 8%;
          width: 84%;
          height: 40px;
          background: rgba(70, 182, 238, 1);
          border-radius: 5px;
          color: #fff;
          font-size: 16px;
          text-align: center;
          line-height: 40px;
          cursor: pointer;
        }
        .bottomP:hover {
          background: rgba(70, 182, 238, 0.9);
        }
      }
    }
  }
}
</style>

