<template>
  <div class="accounts_mgr">

    <!-- 未开通 -->
    <div
      v-if="isOpenWx == '-1'"
      class="no_accounts"
    >

      <div class="banner">
        <img
          class="banner_img"
          src="https://img.ishanshan.com/gimg/n/20190422/cb1fca45aecb20c721dc53b507eeae62?p=image/format,jpg/quality,q_80"
        >
      </div>

      <div class="account_btn">
        <div>
          <p class="banner_title">绑定你的公众号</p>
          <p class="banner_item">
            <img
              src="https://img.ishanshan.com/gimg/n/20190422/11b52bfe5e39cf9aa01b9646dda488ac"
              class="banner_item_icon"
            >
            <span>公众号吸粉</span>
          </p>
          <p class="banner_item">
            <img
              src="https://img.ishanshan.com/gimg/n/20190422/11b52bfe5e39cf9aa01b9646dda488ac"
              class="banner_item_icon"
            >
            <span>提高公众号粘性</span>
          </p>
          <p class="banner_item">
            <img
              src="https://img.ishanshan.com/gimg/n/20190422/11b52bfe5e39cf9aa01b9646dda488ac"
              class="banner_item_icon"
            >
            <span>给家长发送微信模板消息</span>
          </p>
        </div>
        <img
          class="buy_img"
          src="https://img.ishanshan.com/gimg/n/20190422/e23bbd866cd8df4760d79d45d5d6475f"
          @click="openDialogd('buy')"
        >
      </div>
    </div>

    <!-- 未授权 -->
    <div
      v-if="isOpenWx=='0'"
      class="have_accounts"
    >
      <div class="wrapa">
        <img
          src="http://img.ishanshan.com/gimg/user/n///260966321812930561.png"
          alt=""
        >
        <div class="line" />
        <img
          src="http://img.ishanshan.com/gimg/user/n///260966379308449793.png"
          alt=""
        >
        <div class="line" />
        <img
          src="http://img.ishanshan.com/gimg/user/n///260966412846104577.png"
          alt=""
        >
      </div>
      <div class="wrapb">
        <div style="color:#333333;font-size:14px">绑定公众号</div>
        <div style="color:#999999;font-size:14px">审核</div>
        <div style="color:#999999;font-size:14px">绑定成功</div>
      </div>
      <div style="width: 528px;margin:0 auto">
        <p style="color:#19AD19;font-size:24px;margin-top:53px">绑定微信公众号，用自己的公众号给家长发送通知</p>
        <p style="color:#666666;font-size:16px;margin:17px 0 50px">您当前使用“{{ accountWeChat }}”公众号为家长发送通知</p>
        <div
          class="wxts"
          style="width:390px;margin-bottom:50px"
        >
          <div style="color:#333333;font-size:16px">温馨提示：</div>
          <div class="wordF">
            <span class="yuan" />
            <span class="con">为了正常使用，请使用认证服务号进行绑定</span>
          </div>
          <div class="wordF">
            <span class="yuan" />
            <span class="con">授权时请保持默认选择，把权限统一授权给闪闪</span>
          </div>
        </div>
        <div
          class="nowB"
          @click="openDialog('set')"
        >立即绑定公众号</div>
      </div>
      <!-- <p><span>您当前使用‘{{ accountWeChat }}’公众号为家长发送通知</span></p>
      <p style="color: #49C800;"><span>绑定微信公众号，用自己的公众号给家长发送通知</span></p>
      <p><span>温馨提示：</span><span style="color:#FF0000;" /></p>
      <p><span style="color:#FF0000;">·&nbsp; 为了正常使用，请使用认证服务号进行绑定</span></p>
      <p><span style="color:#FF0000;">·&nbsp; 授权时请保持默认选择，把权限统一授权给闪闪</span></p>
      <el-button
        type="primary"
        style="margin-top:30px"
        @click="openDialog('set')"
      >
        我有微信公众号，立即设置
      </el-button> -->
    </div>

    <!-- 绑定成功 -->
    <div v-if="isOpenWx=='1'">
      <div class="wrap">
        <img
          src="http://img.ishanshan.com/gimg/user/n///260964290427617281.png"
          alt=""
        >
        <div class="line" />
        <img
          src="http://img.ishanshan.com/gimg/user/n///260964290427617281.png"
          alt=""
        >
        <div class="line" />
        <img
          src="http://img.ishanshan.com/gimg/user/n///260964052325367809.png"
          alt=""
        >
      </div>
      <div class="wraps">
        <div>绑定公众号</div>
        <div>审核</div>
        <div>绑定成功</div>
      </div>
      <div
        v-loading="loading"
        element-loading-text="正在更新token状态,请稍后"
        element-loading-background="rgba(255, 255, 255, 0.6)"
        class="wrapMiddle"
      >
        <div class="middleSame">
          <div
            class="names"
            style="margin-left:16px"
          >公众号昵称</div>
          <div
            class="lines"
            style="display:flex;justify-content: space-between"
          >
            <span class="nameT">{{ weChatName }}</span>
            <span
              style="color:#1D9DF2;cursor:pointer"
              @click="openDialog('set')"
            >更换公众号</span>
          </div>
        </div>
        <div class="middleSame">
          <div
            class="names"
            style="margin-left:49px"
          >APPID</div>
          <div
            class="lines"
            style="color:#333"
          >{{ weChatId }}</div>
        </div>
        <div class="middleSame">
          <div class="names">微信账号类型</div>
          <div class="lines">
            {{ weChatType==2?'认证服务号':'订阅号' }}
          </div>
        </div>
        <p :style="{color: '#666666', marginBottom: '10px'}">
          服务授权状态
          <el-badge
            v-show="isOpenWx==='1'"
            is-dot
            type="success"
            class="dotItem"
          />
          <el-badge
            v-show="isOpenWx==='0'"
            is-dot
            type="danger"
            class="dotItem"
          />
          {{ isOpenWx==='1' ? '已授权' : '未授权  ' }}
          <el-button
            type="text"
            @click="openDialog('set')"
          >重新授权</el-button>
        </p>
        <p :style="{color: '#666666', marginBottom: '10px', marginLeft:'24px'}">
          token状态
          <el-badge
            v-show="tokenStatus==='1'"
            is-dot
            type="success"
            class="dotItem"
          />
          <el-badge
            v-show="tokenStatus==='0'"
            is-dot
            type="danger"
            class="dotItem"
          />
          {{ tokenStatus==='1' ? '生效中' : '已过期' }}
          <el-button
            :disabled="btn"
            type="text"
            @click="reFreshToken"
          >刷新</el-button>
          <span
            v-if="btn"
            class="timeOut"
          > ({{ countDown }}秒后可再次刷新)</span>
        </p>
        <div class="wxts">
          <div style="color:#333333;font-size:16px">温馨提示：</div>
          <div class="wordF">
            <span class="yuan" />
            <span class="con">您已获得该公众号所有接口权限，可以正常对接微信</span>
          </div>
          <div class="wordF">
            <span class="yuan" />
            <span class="con">如果使用过程中发现微信推送异常，请先刷新token状态，若依然存在问题请点击
              <span
                style="color:#1D9DF2;cursor:pointer"
                @click="openDialog('set')"
              >重新授权
              </span>试试
            </span>
          </div>
          <div class="wordF">
            <span class="yuan" />
            <span class="con">如果想换回“闪闪管家”公众号，请
              <span
                style="color:#1D9DF2;cursor:pointer"
                @click="openDialogd('buy')"
              >联系客服
              </span>
            </span>
          </div>
        </div>
      </div>
      <!-- <el-form>
        <el-form-item label="公众号昵称：">

          <span>{{ weChatName }}</span>
          <a
            class="text_btn"
            @click="openDialog('set')"
          >绑定到其他公众号</a>
        </el-form-item>
        <el-form-item label="APPID：">

          <span>{{ weChatId }}</span>

        </el-form-item>

        <el-form-item label="微信账号类型：">

          <span>{{ weChatType==2?'认证服务号':'订阅号' }}</span>

        </el-form-item>

        <el-form-item>
          <div>
            您已获得该公众号所有接口权限，可以正常对接微信

            如果使用过程中发现接口异常，请点击此<span
              class="text_color cp text_btn"
              @click="openDialog('set')"
            >
              重新授权
            </span>试试

            如果想换回“闪闪管家”公众号，请<span
              class="text_color cp text_btn"
              @click="openDialogd('buy')"
            >
              联系客服
            </span>

          </div>

        </el-form-item>

      </el-form> -->

    </div>

    <!-- 弹窗 -->
    <el-dialog
      :visible.sync="isOpent"
      :before-close="closeDialog"
      :custom-class="isClass"
      :title="switchOnOff === 'buy' ? '联系客服' : null"
      width="340px"
      class="wrapWLL"
    >
      <!-- 购买套餐 -->
      <div
        v-if="switchOnOff==='buy'"
        style="margin-bottom:10px;"
      >
        <img
          style="width:80%"
          class="connect_popover_img"
          src="https://img.ishanshan.com/gimg/n/20190711/dc58ce8b397a0b39f3349b16f6f4db3c"
        >
        <p class="connect_p">微信扫码，获取专属服务顾问</p>
        <p class="connect_mobile">客服热线：400-660-5733</p>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="isOpen"
      :before-close="closeDialog"
      :custom-class="isClass"
      :title="switchOnOff === 'buy' ? '联系客服' : null"
      width="400px"
      center
      class="wrapWLLA"
    >
      <!-- 警告 -->
      <div v-if="switchOnOff==='set'">
        <div v-if="isSmallGame">
          <p class="wrapALL">
            <img
              src="https://img.ishanshan.com/gimg/n/20190717/d82d61a4c73cfdd94140e6db60680b23"
              alt=""
            ><span class="titleS">警告</span>
          </p>
          <p class="set_content">
            检测到有微游戏正在进行，继续绑定公众号会导致用户数据丢失！请等微游戏结束后再设置！
          </p>
          <div style="margin-bottom:5px">

            <el-button
              class="cancel_btn"
              @click="continueSet('power')"
            >
              继续设置
            </el-button>
            <el-button
              type="primary"
              @click="closeDialog"
            >
              取消设置
            </el-button>

          </div>
        </div>
      </div>

      <!-- 授权 -->
      <div v-if="switchOnOff==='power'">
        <p class="wrapALL">
          <img
            src="https://img.ishanshan.com/gimg/n/20190717/d82d61a4c73cfdd94140e6db60680b23"
            alt=""
            style="margin-bottom:25px"
          ><span
            class="titleS"
            style="margin-bottom:25px"
          >请在新窗口完成微信授权</span>
        </p>
        <!-- <p class="set_content">
          检测到有微游戏正在进行，继续绑定公众号会导致用户数据丢失！请等微游戏结束后再设置！
        </p> -->
        <div style="margin-bottom:5px">

          <el-button
            class="cancel_btn"
            @click="continueSet('power')"
          >
            授权失败、请重试
          </el-button>
          <el-button
            type="primary"
            @click="queryStatus(closeDialog)"
          >
            确认
          </el-button>

        </div>
      </div>

      <!-- 授权失败 -->
      <div v-if="switchOnOff==='fail'">
        <!-- <p style="text-align: start;font-size: 18px; margin-bottom:50px">
          <span>{{ failText }}</span>
        </p> -->
        <p class="wrapALL">
          <img
            src="https://img.ishanshan.com/gimg/n/20190717/d82d61a4c73cfdd94140e6db60680b23"
            alt=""
            style="margin-bottom:25px"
          ><span
            class="titleS"
            style="margin-bottom:25px"
          >授权失败、请重试</span>
        </p>
        <div class="fail_btn">
          <el-button @click="closeDialog">取 消
          </el-button>
          <el-button
            type="primary"
            @click="closeDialog"
          >确 定
          </el-button>

        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import { queryWeChatAuth, queryQrCode } from '@/api/orgSet/weChatAccounts'//eslint-disable-line
import axios from 'axios'
export default {

  data() {
    return {
      tokenStatus: '',
      countDown: 5,
      tryNum: 0,
      loadingCount: 10,
      loading: false,
      btnTimer: null,
      timer: '',
      btn: false,
      isOpent: false,
      isOpen: false,
      accountWeChat: '闪闪早教',
      switchOnOff: '',
      isOpenWx: '',
      isGame: '',
      weChatId: '',
      weChatName: '',
      weChatType: '',
      failText: ''
    }
  },
  computed: {
    // 进行微游戏判定方案
    isSmallGame: function() {
      return this.isGame == '1'//eslint-disable-line
    },

    isClass: function() {
      if (this.switchOnOff === 'buy') {
        return ''
      } else {
        return 'set_hearder'
      }
    }

  },
  mounted() {
    this.queryStatus()
  },
  methods: {
    reFreshToken() {
      if (this.btnTimer) {
        clearInterval(this.btnTimer)
      }
      console.log(this.loadingCount)
      this.btn = true
      this.loading = true
      this.btnTimer = setInterval(this.btnTimeOut, 1000)
      axios.get(`http://www.ishanshan.com/wxapp/api/refreshtoken/wxe5bd129decc89caf/${this.weChatId}`).then(res => {
        this.timer = setInterval(this.timeOut, 1000)
        console.log(res.data.errcode)
        if (res.data.errcode === 0) {
          this.tryNum = 0
          this.loading = false
          this.loadingCount = 10
          this.$message.success('token状态更新成功!')
          this.tokenStatus = '1'
          clearInterval(this.timer)
        } else {
          this.tryNum++
          this.loading = false
          this.tokenStatus = '0'
          this.loadingCount = 10
          clearInterval(this.timer)
          if (this.tryNum < 3) {
            this.$message.error('服务授权更新失败，请重试')
          } else {
            this.$message.error('token状态更新失败，可尝试重新授权或联系客服获取帮助')
          }
        }
      })
    },
    btnTimeOut() {
      this.countDown--
      if (this.countDown === 0) {
        this.countDown = 5
        this.btn = false
      }
    },
    timeOut() {
      this.loadingCount--
      if (this.loadingCount === 0) {
        this.loading = false
        this.loadingCount = 10
        clearInterval(this.timer)
        this.$message.error('token更新失败,请重试')
      }
    },
    queryStatus(callback) {
      queryWeChatAuth().then(res => {
        if (res.data.errorCode === 0) {
          // 未开通
          this.isOpenWx = res.data.data.weChatStatus
          this.isGame = res.data.data.isGameExit
          this.weChatName = res.data.data.weChatAppName
          this.weChatId = res.data.data.weChatAppId
          this.weChatType = res.data.data.weChatType
          this.tokenStatus = res.data.data.tokenStatus
          if (res.data.data.weChatStatus + '' === '1' && res.data.data.weChatType + '' === '2') {
            this.$message.success('绑定成功')
            callback && callback()
          } else if (res.data.data.weChatStatus + '' !== '1') {
            this.switchOnOff = 'fail'
            this.failText = '授权失败、请重试！'
          } else if (res.data.data.weChatType + '' !== '2') {
            this.switchOnOff = 'fail'
            this.failText = '授权失败，请使用认证服务号进行绑定！'
          }
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    /** 授权 */
    openDialog(val) {
      console.log(val)
      if (!this.isSmallGame && val === 'set') {
        queryQrCode().then(res => {
          if (res.data.errorCode === 0) {
            this.isOpen = false
            window.open(`${res.data.data.authUrl}`, '_blank', 'height=644, width=644,toolbar=no,scrollbars=no,menubar=no,status=no')
            // this.switchOnOff = 'power'
          } else {
            this.isOpen = true
            this.$message.error(res.data.errorMessage)
            this.switchOnOff = val
          }
        })
      } else {
        this.isOpen = true
        this.switchOnOff = val
      }

      // this.isOpen = true
    },
    openDialogd(val) {
      if (!this.isSmallGame && val === 'set') {
        queryQrCode().then(res => {
          if (res.data.errorCode === 0) {
            window.open(`${res.data.data.authUrl}`, '_blank', 'height=644, width=644,toolbar=no,scrollbars=no,menubar=no,status=no')
            this.switchOnOff = 'power'
          } else {
            this.$message.error(res.data.errorMessage)
            this.switchOnOff = val
          }
        })
      } else {
        this.switchOnOff = val
      }

      this.isOpent = true
    },

    /** 关闭 */
    closeDialog() {
      this.isOpen = false
      this.isOpent = false
    },

    /** 购买套餐 */
    openWindow() {
      window.open('http://wpa.qq.com/msgrd?v=3&uin=3519232593&site=qq&menu=yes', '_blank', 'height=502, width=644,toolbar=no,scrollbars=no,menubar=no,status=no')
    },

    /** 继续设置 */
    continueSet(val) {
      queryQrCode().then(res => {
        if (res.data.errorCode === 0) {
          // this.switchOnOff = val
          this.isOpen = false
          window.open(`${res.data.data.authUrl}`, '_blank', 'height=644, width=644,toolbar=no,scrollbars=no,menubar=no,status=no')
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    }

  }
}
</script>
<style lang="scss" scoped>
.wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}
.wrap img {
  width: 28px;
  height: 29px;
}
.wrap div {
  height: 1px;
  background: #46b6ee;
  width: 42%;
}
.wrapa {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}
.wrapa img {
  width: 28px;
  height: 29px;
}
.wrapa div {
  height: 1px;
  background: #dddddd;
  width: 42%;
}
.wraps {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 9px;
}
.wraps div {
  width: 75px;
  text-align: center;
  color: #333333;
  font-size: 14px;
  display: block;
}
.wrapb {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 9px;
}
.wrapb div {
  width: 75px;
  text-align: center;
}
.wrapMiddle {
  width: 454px;
  margin: 53px auto;
  font-size: 16px;
}
.middleSame {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}
.middleSame .lines {
  padding-bottom: 3px;
  width: 328px;
  border-bottom: 1px solid #dddddd;
}
.middleSame .names {
  color: #666666;
  margin-right: 15px;
}
.dotItem {
  margin-left: 8px;
  height: 10px;
}
.timeOut {
  color: #ff0000;
  font-size: 14px;
}
.nameT {
  color: #333;
  width: 240px;
  white-space: nowrap; //强制文本在一行内输出
  overflow: hidden; //隐藏溢出部分
  text-overflow: ellipsis; //对溢出部分加上...
}
.wxts {
  padding: 12px 20px 14px;
  background: #f0f2f5;
  border-radius: 5px;
  opacity: 0.8;
}
.wordF {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.wordF .yuan {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #dddddd;
}
.wordF .con {
  color: #666666;
  font-size: 16px;
  margin-left: 8px;
}
.nowB {
  width: 166px;
  height: 50px;
  background: rgba(30, 186, 29, 1);
  border-radius: 5px;
  line-height: 50px;
  text-align: center;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
}
.accounts_mgr /deep/ {
  // padding: 20px;
  .banner {
    min-width: 1366;
    width: 100%;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    // background-image: url("https://img.ishanshan.com/gimg/n/20190422/2423db644fab158ba4f50abdaa6f8377?p=image/format,jpg/quality,q_80");
  }
  .banner_title {
    font-size: 80px;
    color: #333333;
    padding: 160px 0 40px 0;
  }
  .banner_item {
    font-size: 25px;
    color: #333333;
    margin-top: 16px;
    line-height: 34px;
    vertical-align: middle;
    .banner_item_icon {
      width: 30px;
      line-height: 34px;
      vertical-align: middle;
    }
    span {
      line-height: 34px;
      margin-left: 20px;
      vertical-align: middle;
    }
  }
  .banner_img {
    min-width: 1366px;
    width: 100%;
    height: auto;
  }

  .account_btn {
    position: absolute;
    top: 0%;
    left: 40px;
    text-align: left;
  }

  .buy_img {
    width: 200px;
    height: 70px;
    margin-top: 70px;
  }

  .wrapWLLA .el-dialog__body {
    text-align: right;
    padding: 40px 20px 20px 40px !important;
  }
  .wrapWLL .el-dialog__body {
    text-align: center;
    padding: 20px 20px 10px 20px !important;
  }
  .fail_btn {
    margin: 20px 0 0 0;
    text-align: right;
  }
  .text_btn {
    color: #46b6ee;
    &:hover {
      opacity: 0.8;
    }
  }

  .set_content {
    text-align: start;
    line-height: 20px;
    margin: 15px 0 20px 40px;
  }
  .set_hearder {
    .el-dialog__header {
      display: none;
    }
  }

  .have_accounts {
    p {
      line-height: 30px;
    }
  }
}
.dialog_footer {
  text-align: center;
}
.connect_p {
  margin: 14px 0 10px 0;
  color: #666;
}
.connect_mobile {
  color: #1d9df2;
}
.wrapALL {
  display: flex;
  align-items: center;
}
.titleS {
  font-size: 14px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(102, 102, 102, 1);
  margin-left: 16px;
}
.titleW {
  font-size: 14px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
}
</style>
