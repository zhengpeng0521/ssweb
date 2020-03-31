
<template>
  <div class="message_notice">
    <div
      v-if="lastNumber == '0'"
      class="messageHint"
    >
      <div class="messageHintInside">
        当前机构的短信剩余条数为0，赶紧去充值吧！
        <span @click="recharge">立即充值</span>
        <i class="el-icon-arrow-right" />
      </div>
    </div>
    <el-tabs
      v-model="activeName2"
      type="card"
      @tab-click="changeFourth"
    >
      <el-tab-pane
        label="消息通知"
        name="notice"
      />
      <el-tab-pane
        label="短信记录"
        name="sms"
      />
    </el-tabs>

    <!-- 菜单改动！！！--通知设置start -->
    <div v-if="fourthRoute === 'notice'">
      <!-- 关注微信公众号 -->
      <div class="noticeweixin">
        <div class="noticeweixinLeft">
          <div class="weixinPublic">
            <el-popover
              placement="bottom-start"
              width="210"
              trigger="hover"
            >
              <div class="popoverAll">
                <div>
                  <img
                    slot="reference"
                    :src="qrcodeUrl"
                    style=" width: 180px; height: 180px;"
                  >
                </div>
                <div style="marginTop: 10px;text-align:center;">
                  <el-button
                    type="text"
                    @click="downloadImage()"
                  >
                    <i class="el-icon-download" />下载二维码
                  </el-button>
                </div>
                <!-- <div style="position:absolute;top:80px;left:80px;">
                  <img
                    :src="imageUrl"
                    style="width: 40px;height:40px;"
                  >
                </div> -->
              </div>
              <img
                slot="reference"
                :src="qrcodeUrl"
                style=" width: 70px; height: 70px;"
              >
              <!-- <div
                slot="reference"
                style="position:relative;"
              >
                <img
                  :src="qrcodeUrl"
                  style=" width: 70px; height: 70px;"
                >
                <span>
                  <img
                    :src="imageUrl"
                    style="position:absolute;width: 16px;height:16px;top:27px;left:27px;"
                  >
                </span>
              </div> -->

            </el-popover>
          </div>
          <span>
            <span>
              <strong>老师</strong>扫码绑定「闪闪云校」公众号，及时获取机构最新动态
            </span>

            <span>
              <div>1.微信扫码</div>
              <img src="http://img.ishanshan.com/gimg/n/20190923/f310675b35b4a52b6ba251844c5a2dd1">
              <div>2.验证手机号</div>
              <img src="http://img.ishanshan.com/gimg/n/20190923/f310675b35b4a52b6ba251844c5a2dd1">
              <div>3.绑定成功则可接收如下微信模板消息</div>
            </span>
          </span>
        </div>
        <!-- 右边关注公众号 -->
        <div class="noticeweixinright">
          <div class="weixinPublic">
            <el-popover
              placement="bottom"
              width="210"
              trigger="hover"
            >
              <div class="popoverAll">
                <div>
                  <img
                    style="width: 180px; height: 180px;"
                    src="http://img.ishanshan.com/gimg/n/20190926/d28cad617e10824a41f09e470e94de02"
                  >
                </div>
                <div style="marginTop: 10px;text-align:center;">
                  <el-button
                    type="text"
                    @click="downloadImage('parent')"
                  >
                    <i class="el-icon-download" />下载二维码
                  </el-button>
                </div>
              </div>
              <img
                slot="reference"
                style=" width: 70px; height: 70px;"
                src="http://img.ishanshan.com/gimg/n/20190926/d28cad617e10824a41f09e470e94de02"
              >
            </el-popover>
          </div>
          <span>
            <span>
              引导<strong>家长</strong>关注「闪闪亲子」公众号，及时推送学院动态
              <el-button
                type="text"
                @click="switchNum"
              >换成机构公众号</el-button>
            </span>

            <span>
              <div>1.微信扫码</div>
              <img src="http://img.ishanshan.com/gimg/n/20190923/f310675b35b4a52b6ba251844c5a2dd1">
              <div>2.关注公众号</div>
              <img src="http://img.ishanshan.com/gimg/n/20190923/f310675b35b4a52b6ba251844c5a2dd1">
              <div>3.验证手机号则可接收如下微信模板消息</div>
            </span>
          </span>
        </div>
      </div>

      <!-- 招生宝通知 -->
      <div class="inform">
        <span class="nameHeadLeft" />
        <p class="nameHead">招生宝通知</p>
        <div>
          <div
            v-for="(item, index) in messageCardZsb"
            :key="index"
            class="messCardData"
            @click="openMessageDetail(item)"
          >
            <el-card
              class="box-card"
              shadow="hover"
            >
              <div
                slot="header"
                class="clearfix"
              >
                <span style="display: inline-block;padding: 6px 0px">{{ item.tplTitle }}</span>
                <span v-show="item.target === '0'">通知老师</span>
                <span v-show="item.target === '1'">通知家长</span>
              </div>
              <div>
                <div>{{ item.sendTime }}</div>
                <div class="bindingMessage">
                  <p v-if="item.wxSwitch === '2' ? false : true">
                    <i
                      v-show="item.wxSwitch === '0' || item.wxSwitch === null"
                      class="el-icon-check"
                    />
                    <i
                      v-show="item.wxSwitch === '1'"
                      class="el-icon-check"
                    />
                    微信模板消息</p>
                  <p v-if="item.smsSwitch === '2' ? false : true">
                    <i
                      v-show="item.smsSwitch === '0' || item.smsSwitch === null"
                      class="el-icon-check"
                    />
                    <i
                      v-show="item.smsSwitch === '1'"
                      class="el-icon-check"
                    />
                    短信
                  </p>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>

      <!-- 微官网通知 -->
      <div class="inform">
        <span class="nameHeadLeft" />
        <p class="nameHead">微官网通知</p>
        <div>
          <div
            v-for="(item, index) in messageCardWebsite"
            :key="index"
            class="messCardData"
            @click="openMessageDetail(item)"
          >
            <el-card
              class="box-card"
              shadow="hover"
            >
              <div
                slot="header"
                class="clearfix"
              >
                <span style="display: inline-block;padding: 6px 0px">{{ item.tplTitle }}</span>
                <span v-show="item.target === '0'">通知老师</span>
                <span v-show="item.target === '1'">通知家长</span>
              </div>
              <div>
                <div>{{ item.sendTime }}</div>
                <div class="bindingMessage">
                  <p v-if="item.wxSwitch === '2' ? false : true">
                    <i
                      v-show="item.wxSwitch === '0' || item.wxSwitch === null"
                      class="el-icon-check"
                    />
                    <i
                      v-show="item.wxSwitch === '1'"
                      class="el-icon-check"
                    />
                    微信模板消息</p>
                  <p v-if="item.smsSwitch === '2' ? false : true">
                    <i
                      v-show="item.smsSwitch === '0' || item.smsSwitch === null"
                      class="el-icon-check"
                    />
                    <i
                      v-show="item.smsSwitch === '1'"
                      class="el-icon-check"
                    />
                    短信
                  </p>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>

      <!-- 教务通知 -->
      <div class="inform">
        <span class="nameHeadLeft" />
        <p class="nameHead">教务通知</p>
        <div>
          <div
            v-for="(item, index) in messageCardCrm"
            :key="index"
            class="messCardData"
            @click="openMessageDetail(item)"
          >
            <el-card
              class="box-card"
              shadow="hover"
            >
              <div
                slot="header"
                class="clearfix"
              >
                <span style="display: inline-block;padding: 6px 0px">{{ item.tplTitle }}</span>
                <span v-show="item.target === '0'">通知老师</span>
                <span v-show="item.target === '1'">通知家长</span>
              </div>
              <div>
                <div>{{ item.sendTime }}</div>
                <div class="bindingMessage">
                  <p v-if="item.wxSwitch === '2' ? false : true">
                    <i
                      v-show="item.wxSwitch === '0' || item.wxSwitch === null"
                      class="el-icon-check"
                    />
                    <i
                      v-show="item.wxSwitch === '1'"
                      class="el-icon-check"
                    />
                    微信模板消息</p>
                  <p v-if="item.smsSwitch === '2' ? false : true">
                    <i
                      v-show="item.smsSwitch === '0' || item.smsSwitch === null"
                      class="el-icon-check"
                    />
                    <i
                      v-show="item.smsSwitch === '1'"
                      class="el-icon-check"
                    />
                    短信
                  </p>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>

    </div>

    <!-- 菜单改动！！！--短信消息start -->
    <SmsLog v-if="fourthRoute === 'sms'" />

    <MessageDetail
      ref="messageDetail"
      @toNotice="getlist"
    />

    <!-- 充值弹窗 -->
    <RechargeDialog ref="rechargeDialog" />

  </div>
</template>

<script>
// eslint-disable-next-line
import {
  queryTemp, // 消息通知 ~ 消息设置信息
  getMessagesLeft // 短信剩余条数
  // addReceiver, // 消息 ~ 接收人~ 添加接收人
  // updateMsgTemp, // 消息 ~ 推送配置-开启关闭
  // removeReceiver, // 消息 ~ 接收人~ 移除接收人
  // tenantUserSummaryQuery // // 员工摘要查询
} from '@/api/orgSet/messageNotice.js'

import { getQrCode } from '@/api/orgSet/messageNotice.js'

import CommonTable from '@/components/CommonTable/CommonTable'
import WeChat from '@/components/WeChat/WeChat'
import SmsLog from '@/views/orgSet/smsLog/smsLog'
import MessageDetail from './components/messageDetail'
import RechargeDialog from '../smsLog/components/rechargeDialog' // 充值弹窗

export default {
  components: {
    MessageDetail,
    CommonTable,
    WeChat,
    SmsLog,
    RechargeDialog
  },
  data() {
    return {
      qrcodeUrl: '',
      url: '',
      imageUrl: 'http://img.ishanshan.com/gimg/user/n///268474000848453633.png',
      activeName2: 'notice',
      fourthRoute: 'notice',
      messageCardZsb: [], // 招生宝通知数据
      messageCardWebsite: [], // 微官网通知数据
      messageCardCrm: [], // 教务通知数据
      lastNumber: '' // 短信条数剩余
    }
  },

  mounted() {
    this.queryTempFun()
    this.getMessagesLeftFun()
    this.qrcodeFun()
    const path = this.$router.history.current.fullPath
    if (path) {
      const params = path.split('?')
      // const curr = new Date().getTime()
      if (params && params.length > 0) {
        if (params[1] === 'sms') {
          this.activeName2 = 'sms'
          this.fourthRoute = 'sms'
        }
      }
    }
  },

  methods: {
    // 二维码地址
    qrcodeFun() {
      const { tenantId, orgId } = this.$store.getters
      const data = {
        identity: `tenantId=${tenantId},orgId=${orgId}`,
        expire: 2592000,
        forever: false,
        weChatType: 'manage'
      }
      getQrCode(data).then(res => {
        if (res.data.errorCode === 0) {
          this.$nextTick(() => {
            this.url = res.data.data.url
            this.qrcodeUrl = res.data.data.codeUrl
          })
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    getlist() {
      this.queryTempFun()
    },
    // 短信剩余条数查询
    getMessagesLeftFun() {
      getMessagesLeft().then(res => {
        this.lastNumber = res.data.lastNumber
      })
    },

    // 查询通知数据
    queryTempFun() {
      const params = {
        fromSms: '1'
      }
      queryTemp(params).then(res => {
        const results = res.data.results
        // 招生宝数据
        let messageCardZsbSort = []
        messageCardZsbSort = results.filter(item => {
          return (item.model === 'zsb')
        })

        this.messageCardZsb = messageCardZsbSort.sort(this.cradSort('sort'))

        // 微官网通知数据
        let messageCardWebsiteSort = []
        messageCardWebsiteSort = results.filter(item => {
          return (item.model === 'website')
        })
        this.messageCardWebsite = messageCardWebsiteSort.sort(this.cradSort('sort'))

        // 教务通知数据
        let messageCardCrmSort = []
        messageCardCrmSort = results.filter(item => {
          return (item.model === 'crm')
        })
        this.messageCardCrm = messageCardCrmSort.sort(this.cradSort('sort'))
      })
    },

    // 卡片顺序重排
    cradSort(p) { // 这是比较函数
      return function(m, n) {
        const a = m[p]
        const b = n[p]
        return a - b // 升序
      }
    },

    // 充值按钮弹窗
    recharge() {
      this.$refs.rechargeDialog.showDialog()
    },

    // 卡片详情页
    openMessageDetail(value) {
      this.$refs.messageDetail.showDialog(value)
    },

    // 下载闪闪亲子二维码
    downloadImage(value) {
      var image = new Image()
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function() {
        var canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        var context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        var url = canvas.toDataURL('image/png')
        var a = document.createElement('a')
        var event = new MouseEvent('click')
        if (value === 'parent') {
          a.download = '闪闪亲子' || 'photo'
        } else {
          a.download = '闪闪云校' || 'photo'
        }
        a.href = url
        a.dispatchEvent(event)
      }
      if (value === 'parent') {
        image.src = 'http://img.ishanshan.com/gimg/n/20190926/d28cad617e10824a41f09e470e94de02'
      } else {
        image.src = 'http://img.ishanshan.com/gimg/n/20190926/336c8905342aec1381c136a264160025'
      }
    },

    // 切换公众号
    switchNum() {
      this.$router.push({ name: 'baseSet', params: { activeTab: 'wxOpen' }})
    },

    /** 改变4级菜单 */
    changeFourth(tab) {
      const route = tab.name
      this.fourthRoute = route
    }
  }
}
</script>

<style lang="scss" scoped>
.messageHint {
  width: 100%;
  height: 40px;
  background: rgba(247, 176, 70, 0.2);
  padding: 10px 20px;
  margin-bottom: 14px;
  font-size: 14px;
  font-family: PingFang-SC-Regular, PingFang-SC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 20px;
  .messageHintInside {
    span {
      width: 56px;
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFangSC;
      font-weight: 600;
      color: rgba(29, 157, 242, 1);
      line-height: 20px;
      cursor: pointer;
    }
    i {
      width: 7px;
      height: 12px;
      color: #1d9df2;
    }
  }
}
.notice_bind_btn {
  float: right;
}
.noticeweixin {
  width: 1120px;
  height: 110px;
  background: rgba(246, 247, 249, 1);
  padding: 20px;
  display: flex;
  .noticeweixinLeft {
    width: 525px;
    height: 70px;
    display: flex;
    .weixinPublic {
      width: 70px;
      height: 70px;
      float: left;
      margin-right: 10px;
      .popoverAll {
        padding: 20px;
      }
    }
    span:nth-of-type(1) {
      width: 440px;
      height: 70px;
      display: flex;
      display: block;
      font-family: PingFangSC-Medium, PingFangSC;
      font-weight: 500;
      span:nth-of-type(1) {
        line-height: 35px;
        display: block;
        font-style: normal;
        font-size: 14px;
        width: 440px;
        height: 35px;
        font-family: PingFangSC-Medium, PingFangSC;
        font-weight: 500;
        color: #666;
        strong {
          display: inlin-block;
          font-style: normal;
          font-weight: 500;
          color: #f7b046;
        }
      }
      span:nth-of-type(2) {
        display: block;
        font-style: normal;
        width: 440px;
        height: 35px;
        font-size: 12px;
        line-height: 20px;
        padding-top: 5px;
        div:nth-of-type(1) {
          display: block;
          padding-left: 7px;
          height: 20px;
          float: left;
          background: #e3e5e8;
          opacity: 0.6;
        }
        div:nth-of-type(2) {
          display: block;
          height: 20px;
          float: left;
          background: #e3e5e8;
          opacity: 0.6;
        }
        div:nth-of-type(3) {
          display: block;
          height: 20px;
          float: left;
          background: #e3e5e8;
          opacity: 0.6;
          padding-right: 5px;
        }
        img:nth-of-type(1) {
          display: block;
          float: left;
          width: 21px;
          height: 21px;
          margin-top: -1px;
        }
        img:nth-of-type(2) {
          display: block;
          float: left;
          width: 21px;
          height: 21px;
          margin-top: -1px;
        }
      }
    }
  }
  .noticeweixinright {
    width: 525px;
    height: 70px;
    display: flex;
    margin-left: 30px;
    .weixinPublic {
      width: 70px;
      height: 70px;
      float: left;
      margin-right: 10px;
      .popoverAll {
        padding: 20px;
      }
    }
    span:nth-of-type(1) {
      width: 450px;
      height: 70px;
      float: left;
      display: block;
      font-family: PingFangSC-Medium, PingFangSC;
      font-weight: 500;
      span:nth-of-type(1) {
        line-height: 35px;
        display: block;
        font-style: normal;
        font-size: 14px;
        width: 450px;
        height: 35px;
        font-family: PingFangSC-Medium, PingFangSC;
        font-weight: 500;
        color: #666;
        strong {
          display: inlin-block;
          font-weight: 500;
          font-style: normal;
          color: #67c23a;
        }
      }
      span:nth-of-type(2) {
        display: inline-block;
        font-style: normal;
        width: 440px;
        height: 35px;
        font-size: 12px;
        line-height: 20px;
        padding-top: 5px;
        div:nth-of-type(1) {
          display: block;
          padding-left: 7px;
          height: 20px;
          float: left;
          background: #e3e5e8;
          opacity: 0.6;
        }
        div:nth-of-type(2) {
          display: block;
          height: 20px;
          float: left;
          background: #e3e5e8;
          opacity: 0.6;
        }
        div:nth-of-type(3) {
          display: block;
          height: 20px;
          padding-right: 5px;
          float: left;
          background: #e3e5e8;
          opacity: 0.6;
        }
        img:nth-of-type(1) {
          display: block;
          float: left;
          width: 21px;
          height: 21px;
          margin-top: -1px;
        }
        img:nth-of-type(2) {
          display: block;
          float: left;
          width: 21px;
          height: 21px;
          margin-top: -1px;
        }
      }
    }
  }
}

.active_btn {
  border-color: #46b6ee;
  color: #46b6ee;
}

.inform {
  overflow: hidden;
}

.nameHeadLeft {
  display: inline-block;
  width: 6px;
  height: 14px;
  background: rgba(70, 182, 238, 1);
  border-radius: 4px;
}
.nameHead {
  display: inline-block;
  margin-top: 40px;
  margin-bottom: 20px;
  text-align: center;

  width: 80px;
  height: 16px;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFangSC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 16px;
}
</style>

<style lang="scss">
.messCardData {
  float: left;
}
.box-card {
  width: 230px;
  height: 192px;
  background: rgba(251, 251, 251, 1);
  border: 1px solid rgba(221, 221, 221, 1);
  border-radius: 0;
  margin-right: 20px;
  margin-bottom: 20px;
  cursor: pointer;
  .clearfix {
    span:nth-of-type(2) {
      margin-top: 5px;
      float: right;
      width: 64px;
      padding-left: 7px;
      height: 18px;
      border-radius: 2px;
      border: 1px solid rgba(255, 148, 54, 1);
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFangSC;
      font-weight: 400;
      color: rgba(255, 148, 54, 1);
      line-height: 16px;
    }
    span:nth-of-type(3) {
      margin-top: 5px;
      float: right;
      width: 64px;
      padding-left: 7px;
      height: 18px;
      border-radius: 2px;
      border: 1px solid rgba(103, 194, 58, 1);
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFangSC;
      font-weight: 400;
      color: rgba(103, 194, 58, 1);
      line-height: 16px;
    }
  }
  .bindingMessage {
    margin-top: 20px;
    p:nth-of-type(1) {
      display: inline-block;
      width: 100%;
      i:nth-of-type(1) {
        font-weight: 900;
        color: #ddd;
      }
      i:nth-of-type(2) {
        font-weight: 900;
        color: #46b6ee;
      }
    }
    p:nth-of-type(2) {
      display: inline-block;
      width: 100%;
      margin-top: 10px;
      i:nth-of-type(1) {
        font-weight: 900;
        color: #ddd;
      }
      i:nth-of-type(2) {
        font-weight: 900;
        color: #46b6ee;
      }
    }
  }
}

.message_notice {
  box-sizing: border-box;
}

.message_notice /deep/ #tab-sms {
  padding: 0 25px;
}
.nowx {
  color: #46b6ee;
}
</style>
