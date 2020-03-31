<template>
  <div>
    <full-Screen
      :type="type"
      :visible.sync="sideDialogShow"
      class="rechargeDialog_container"
    >
      <div class="wrapAll">
        <div v-if="saast">
          <div
            class="topmain"
            style="padding:0 15px"
          >
            <span class="active">1</span>
            <div class="line" />
            <span>2</span>
            <div class="line" />
            <span>3</span>
          </div>
          <div
            class="topmain"
            style="margin-top:6px"
          >
            <div class="actives">确认订单</div>
            <div>确认付款</div>
            <div>完成订购</div>
          </div>
        </div>
        <div
          v-if="arrlist.status == 0"
          class="payWall payflex"
        >
          <div class="payLeft">
            <span
              style="color:#FF9436"
              class="sameT"
            >待支付</span>
            <span
              class="bottomt"
              style="color:#999"
            >请在{{ timeAll }}前完成支付，否则订单会被自动取消</span>
          </div>
          <div class="payRight">
            <div class="orders">订单号：{{ arrlist.orderNo }}</div>
            <div style="display:flex">
              <span
                class="orderw"
                style="margin-right:10px"
                @click="submitn(arrlist.orderNo,arrlist.sumAmount,arrlist.smsInfos)"
              >立即支付</span>
              <span
                class="orderc"
                @click="orderc(arrlist.orderNo,arrlist.sumAmount,arrlist.smsInfos)"
              >取消订单</span>
            </div>
          </div>
        </div>
        <!-- 订单已取消 -->
        <div
          v-if="arrlist.status == 1"
          class="payWall payflex"
        >
          <div
            style="color:#999"
            class="sameT"
          >
            订单已取消
          </div>
          <div class="payRight">
            <span class="orders">订单号：{{ arrlist.orderNo }}</span>
            <span
              class="orderw"
              @click="orderw(arrlist.sumAmount,arrlist.smsInfos)"
            >重新订购</span>
          </div>
        </div>
        <!-- 订单已过期 -->
        <div
          v-if="arrlist.status == 2"
          class="payWall payflex"
        >
          <div class="payLeft">
            <span
              style="color:#999"
              class="sameT"
            >订单已过期</span>
            <span
              class="bottomt"
              style="color:#999"
            >过期时间：{{ realOvertime }}</span>
          </div>
          <div class="payRight">
            <span class="orders">订单号：{{ arrlist.orderNo }}</span>
            <span
              class="orderw"
              @click="orderw(arrlist.sumAmount,arrlist.smsInfos)"
            >重新订购</span>
          </div>
        </div>
        <!-- 审核中 -->
        <div
          v-if="arrlist.status == 3"
          class="payWall payflex"
        >
          <div class="payLeft">
            <span
              style="color:#46B6EE;"
              class="sameT"
            >审核中</span>
            <span
              class="bottomt"
              style="display:flex"
            ><span style="color:#999">我们会在3个工作日内审核并开通服务，若有疑问</span>
              <el-popover
                placement="top-start"
                width="260"
                trigger="hover"
                popper-class="popover_help"
              >
                <div>
                  <img
                    style="width:100%"
                    class="connect_popover_img"
                    src="https://img.ishanshan.com/gimg/n/20190711/dc58ce8b397a0b39f3349b16f6f4db3c"
                  >
                  <p class="connect_p">微信扫码，获取专属服务顾问</p>
                  <p class="connect_mobile">客服热线：400-660-5733</p>
                </div>
                <div
                  slot="reference"
                  class="customer"
                >
                  <!-- <img src="https://img.ishanshan.com/gimg/n/20190402/7f9a502a9b4b3aefcdbbfdce485f930c"> -->
                  <span style="color:#1D9DF2;cursor:pointer">请联系客服</span>
                </div>
              </el-popover>
            </span>
          </div>
          <div class="payRight">
            <span class="orders">订单号：{{ arrlist.orderNo }}</span>
            <span
              class="orderw"
              @click="orderw(arrlist.sumAmount,arrlist.smsInfos)"
            >重新订购</span>
          </div>
        </div>
        <!-- 审核未通过 -->
        <div
          v-if="arrlist.status == 4"
          class="payWall payflex"
        >
          <div
            style="color:#999"
            class="sameT"
          >
            审核未通过
          </div>
          <div class="payRight">
            <span class="orders">订单号：{{ arrlist.orderNo }}</span>
            <span
              class="orderw"
              @click="orderw(arrlist.sumAmount,arrlist.smsInfos)"
            >重新订购</span>
          </div>
        </div>
        <!-- 订购成功 -->
        <div
          v-if="arrlist.status == 5"
          class="payWall payflex"
        >
          <div
            style="color:#46B6EE"
            class="sameT"
          >
            订购成功
          </div>
          <div style=" color: #666;">
            订单号：{{ arrlist.orderNo }}
          </div>
        </div>
        <div class="wrapTitle">订购校区：{{ orgName }}</div>
        <div class="wrapC">
          <div class="wrapCa wrapCat">
            <span
              v-for="(item,index) in listT"
              :key="index"
            >{{ item }}</span>
          </div>
          <div class="wrapCa wrapCab">
            <span>短信充值{{ numbers }}条</span>
            <span>¥{{ price }}</span>
            <!-- 暂时没有选择的个数默认1 -->
            <span style="margin-left:22px">x1</span>
            <span>¥{{ price }}</span>
          </div>
        </div>
        <div v-if="saast">
          <el-checkbox
            v-model="checked"
            class="bottC"
          >我已阅读并同意</el-checkbox>
          <span
            style="color:#1D9DF2;cursor: pointer;"
            @click="openUrl"
          >《短信充值协议》</span>
        </div>
        <div
          v-if="saast"
          class="bottomW"
        >
          <div>合计：¥{{ price }}</div>
          <div style="margin:16px 0">应付金额：<span style="color:#F56C6C;font-size:22px">¥{{ price }}</span></div>
          <div
            class="submitq"
            @click="submitq"
          >提交订单</div>
        </div>
        <div
          v-if="!saast"
          class="bottomS"
        >
          <div>合计：¥{{ price }}</div>
          <div style="margin:16px 0">应付金额：<span style="color:#F56C6C;font-size:22px">¥{{ price }}</span></div>
        </div>
      </div>
    </full-Screen>
    <!-- 付款弹框 -->
    <PayMoney
      ref="PayMoneyALL"
      @message="message"
    />
  </div>
</template>

<script>
import FullScreen from '@/components/messageNotice/fullScreen' // 右侧弹出框样
import PayMoney from '@/components/payMoney/payMoney'
// import moment from 'moment'
import { addSmsPack, smsPackCancel } from '@/api/orgSet/message.js'
export default {
  components: {
    FullScreen,
    PayMoney
  },
  data() {
    return {
      // table
      arrlist: {},
      timeAll: '',
      realOvertime: '',
      // 套餐判断
      saast: false,
      checked: false,
      sideDialogShow: false,
      type: '',
      price: '',
      numbers: '',
      smsId: '',
      pageIndex: '',
      orgName: this.$store.getters.orgName,
      listT: ['服务名称', '服务单价', '数量', '小计'],
      url: 'http://wx.ishanshan.com/paygateway/payGateway/payhtml?orderNo=1177395118424145920&appId=100003&sign=eba184228f6f6a5b227c9fef1b698bc1&mchId=1054932682368098304&payChannel=1569547845832',
      imageUrl: 'http://img.ishanshan.com/gimg/user/n///268474000848453633.png'
    }
  },
  mounted() {
    // console.log(this.$store)
  },
  methods: {
    message(val) {
      setTimeout(() => {
        if (val) {
          this.saast = false
          this.arrlist.status = val.statu
          this.arrlist.orderNo = val.order
          this.checked = false
          this.$emit('messagetype')
        } else {
          this.$emit('messagetype')
        }
      }, 280)
    },
    openUrl() {
      window.open('https://saas.ishanshan.com/thinknode/web/offical/help/1176793984077299712')
    },
    showDialog(type, price, num, smsId) {
      this.sideDialogShow = true
      this.type = type
      this.saast = true
      this.checked = false
      this.arrlist = {}
      this.numbers = num
      this.smsId = smsId
      this.price = price
      // if (price === 0) {
      //   this.price = 100
      // } else {
      //   this.price = price
      // }
    },
    showTable(type, arr, pageIndex) {
      this.pageIndex = pageIndex
      this.sideDialogShow = true
      this.type = type
      this.arrlist = arr
      this.saast = false
      this.numbers = arr.number
      this.price = arr.sumAmount
      // console.log(arr)
      if (arr.status === '0') {
        this.timeAll = arr.overtime
      }
      if (arr.status === '2') {
        this.realOvertime = arr.realOvertime
      }
      // const newTime = arr.createTime + 7 * 24 * 3600 * 1000
      // const time = moment(newTime).format().split('+')[0].split('T')
      // this.timeAll = {
      //   year: time[0],
      //   timer: time[1]
      // }
    },
    // getLocalTime(nS) {
    //   return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, '-').replace(/日/g, '')
    // },
    submitn(orderNo, sumAmount, smsInfos) {
      this.price = sumAmount
      const type = {
        orderNo: orderNo,
        sumPrice: sumAmount,
        smsInfos: smsInfos
      }
      // const types = JSON.stringify(type.smsInfo)
      // type.smsInfo = types
      // console.log(type)
      this.addSmsPack(type)
    },
    orderw(sumAmount, smsInfos) {
      this.checked = false
      // this.saast = true
      this.arrlist = {}
      this.sideDialogShow = false
      this.$emit('messagetype', this.pageIndex - 1)
    },
    submitq() {
      if (this.checked === false) {
        this.$message({
          message: '请阅读并同意相关协议',
          type: 'warning'
        })
      } else {
        const type = {
          sumPrice: this.price,
          smsInfos: [{ smsId: this.smsId, price: this.price, number: 1 }]
        }
        const types = JSON.stringify(type.smsInfo)
        type.smsInfo = types
        // console.log(type)
        this.addSmsPack(type)
      }
    },
    addSmsPack(type) {
      addSmsPack(type).then(res => {
        // console.log(res)
        if (res.data.errorCode === 0) {
          // 订单号和金额传餐
          this.$refs.PayMoneyALL.showDialog(res.data.data, res.data.orderNo, this.price)
        } else {
          this.$confirm('请先订购系统套餐后再进行购买', {
            confirmButtonText: '确定',
            cancelButtonText: '',
            type: 'warning',
            showClose: false,
            showCancelButton: false,
            customClass: 'wrapallTl'
          })
        }
        // this.url = res.data.data
        // const qrcode = new QRCode('qrcode', {
        //   width: 169,
        //   height: 169,
        //   text: res.data.data, // 二维码地址
        //   colorDark: '#000',
        //   colorLight: '#fff',
        //   correctLevel: QRCode.CorrectLevel.H
        // })
        // console.log(qrcode)
      })
    },
    // 取消订单
    orderc(data, list, arr) {
      this.$confirm('确定要取消订单吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
        customClass: 'wrapallTl'
      }).then(() => {
        console.log(list, arr)
        const datas = {
          orderNo: data
        }
        smsPackCancel(datas).then(res => {
          // console.log(res)
          if (res.data.errorCode === 0) {
            this.$message({
              type: 'success',
              message: '取消成功',
              center: true
            })
            // this.sideDialogShow = false
            this.arrlist.status = 1
            this.saast = false
            this.$emit('messagetype', this.pageIndex - 1)
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapAll {
  margin-top: 20px;
  padding: 0 20px;
  .wrapTitle {
    margin-top: 42px;
    color: #333;
  }
  .wrapC {
    margin-top: 14px;
    .wrapCa {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .wrapCat {
      height: 44px;
      background: rgba(240, 242, 245, 0.6);
      padding: 0 120px 0 90px;
    }
    .wrapCab {
      height: 100px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(238, 238, 238, 1);
      padding: 0 116px 0 90px;
      color: #666;
    }
  }
  .bottC {
    margin: 20px 0 15px 0;
  }
  .bottomW {
    height: 152px;
    background: rgba(240, 242, 245, 0.6);
    padding: 20px;
    text-align: right;
    overflow: hidden;
  }
  .bottomS {
    height: 96px;
    background: rgba(240, 242, 245, 0.6);
    padding: 20px;
    text-align: right;
    overflow: hidden;
    margin-top: 40px;
  }
  .submitq {
    width: 140px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: rgba(238, 86, 78, 1);
    border-radius: 5px;
    font-size: 16px;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    float: right;
    cursor: pointer;
  }
}
.payflex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sameT {
    font-size: 22px;
    font-weight: 500;
  }
  .payRight {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    height: 100%;
    justify-content: space-between;
    .orders {
      color: #666;
    }
    .orderw {
      padding: 9px 38px;
      background: rgba(245, 108, 108, 1);
      border-radius: 5px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFangSC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      cursor: pointer;
    }
    .orderc {
      padding: 9px 38px;
      background: rgba(255, 255, 255, 1);
      border-radius: 5px;
      border: 1px solid rgba(221, 221, 221, 1);
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFangSC;
      font-weight: 500;
      color: rgba(102, 102, 102, 1);
      cursor: pointer;
    }
  }
  .payLeft {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
    .bottomt {
      margin-bottom: 8px;
    }
  }
}
.payWall {
  height: 110px;
  border: 1px solid rgba(238, 238, 238, 1);
  padding: 20px;
}
.topmain {
  display: flex;
  align-items: center;
  justify-content: space-between;
  span {
    width: 28px;
    height: 28px;
    text-align: center;
    line-height: 28px;
    border: 1px solid rgba(188, 188, 188, 1);
    border-radius: 50%;
    color: #ccc;
  }
  .line {
    width: 45%;
    height: 2px;
    background: #e9e9e9;
  }
  .active {
    background: #46b6ee;
    color: #fff;
    border: none;
  }
  .actives {
    color: #46b6ee;
  }
}
</style>

