<template>
  <div>
    <full-screen
      :type="messageData.tplTitle"
      :visible.sync="sideDialogShow"
      class="messageDetailDialog_container"
    >
      <div class="fullBottom">

        <!-- 发送场景 -->
        <div class="scene">
          <div class="sceneLeft">
            <img
              style="width: 40px; height: 40px;"
              src="http://img.ishanshan.com/gimg/n/20190923/5bdf4ec8e5dbfd3dd5124a81feaf2cdd"
            >
          </div>

          <div class="sceneRight">
            <span>发送场景</span>
            <span>{{ messageData.details }}</span>
          </div>
        </div>

        <!-- 发送时间 -->
        <div class="scene">
          <div class="sceneLeft">
            <img
              style="width: 40px; height: 40px;"
              src="http://img.ishanshan.com/gimg/n/20190923/16d912e0ce45113c9070b9b01f7adbf7"
            >
          </div>

          <div class="sceneRight">
            <span>发送时间</span>
            <span>{{ messageData.sendTime }}</span>
          </div>
        </div>

        <!-- 发送对象 -->
        <div class="scene">
          <div class="sceneLeft">
            <img
              style="width: 40px; height: 40px;"
              src="http://img.ishanshan.com/gimg/n/20190923/127ddb0e8b1e08da3a852a5c33be4065"
            >
          </div>

          <div class="sceneRight">
            <span>发送对象</span>

            <!-- 通知家长 -->
            <div
              v-if="messageData.target === '1'"
              class="sceneRightCon"
            >家长</div>

            <!-- 通知老师 -->
            <div
              v-if="messageData.target === '0'"
              class="sceneRightCon"
            >
              <div
                v-if="messageData.deptList.length === 0 && messageData.userList.length === 0 ? false : true"
                class="sceneRightConHave"
              >
                <span
                  v-for="(item) in messageData.deptList"
                  :key="item.id"
                >
                  <i style=" background: rgba(70, 182, 238, 0.2);border-radius: 12px;color: rgba(29, 157, 242,1);padding: 0 10px;">{{ item.userName }}</i>
                </span>

                <span
                  v-for="(item) in messageData.userList"
                  :key="item.id"
                  class="sendUserList"
                >
                  <i style="color:#666;">
                    {{ item.userName }}
                    <el-tooltip
                      v-if="item.flag === '0' ? true : false"
                      content="未绑定微信"
                      placement="top"
                    >
                      <span
                        class="el-icon-warning"
                        style="color:#FBB323;margin-left:-2px;"
                      />
                    </el-tooltip>
                  </i>
                </span>
                <i
                  class="el-icon-edit"
                  style="color:#46B6EE;"
                  @click="selectStaffDialogFun"
                />
              </div>

              <div
                v-if="messageData.deptList.length === 0 && messageData.userList.length === 0 ? true : false"
                class="sceneRightConNone"
              >
                <span style="display:inline;">请选择员工</span>
                <i
                  class="el-icon-edit"
                  style="color:#46B6EE;"
                  @click="selectStaffDialogFun"

                />
              </div>
            </div>
          </div>
        </div>

        <!-- 发送方式 -->
        <div class="sceneWey">
          <div class="sceneLeft">
            <img
              style="width: 40px; height: 40px;"
              src="http://img.ishanshan.com/gimg/n/20190923/9d1e4d917db31558a28d62821c59aa81"
            >
          </div>

          <div class="sceneRight">
            <div class="sceneRightTop">发送方式</div>
            <div class="sceneRightBottom">
              <span v-if="messageData.wxSwitch === '2' ? false : true">
                <span>微信模板消息（发送免费）
                  <el-switch v-model="wxValue" />
                </span>
                <img src="http://img.ishanshan.com/gimg/n/20190923/fd057b0e3c731bc46db2aa35a6162331">
                <div class="messageDetail">
                  <p>{{ messageData.tplTitle }}</p>
                  <p>10月1日</p>
                  <p style="white-space:pre-line;">{{ messageData.tplContent }}</p>
                  <p>详情</p>
                </div>
              </span>
              <span v-if="messageData.smsSwitch === '2' ? false : true">
                <span>短信（发送计费）
                  <el-switch v-model="smsValue" />
                </span>
                <img src="http://img.ishanshan.com/gimg/n/20190924/5d3527908914c343afad1b4025c577c5">
                <div class="messageDetail">
                  <p>{{ messageData.smsContent }}</p>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- 页脚固定 -->
      <div class="fixMessage">
        <div class="">
          <el-button @click="close">取消</el-button>
          <el-button
            type="primary"
            @click="submitStyle"
          >保存</el-button>
        </div>
      </div>

    </full-screen>

    <!-- 选择员工弹窗 -->
    <SelectStaffDialog
      ref="selectStaffDialog"
      @toParent="getlist"
    />
  </div>
</template>

<script>
import FullScreen from '@/components/messageNotice/fullScreen' // 右侧弹出框样式
import SelectStaffDialog from './selectStaffDialog' // 选择员工弹窗
import {
  queryTemp, // 消息通知 ~ 消息设置信息
  updateMsgTemp // 消息 ~ 推送配置-开启关闭
} from '@/api/orgSet/messageNotice.js'
export default {
  components: {
    FullScreen,
    SelectStaffDialog
  },
  data() {
    return {
      messageData: {}, // 父类传过来的数据
      messageUpdata: {},
      sideDialogShow: false,
      paramsNum: {},
      wxSwitchNum: '',
      smsSwitchNum: '',
      wxValue: '',
      smsValue: ''
    }
  },

  methods: {
    // 查询通知数据
    queryTempFun() {
      const params = {
        fromSms: '1'
      }
      queryTemp(params).then(res => {
        const results = res.data.results
        results.map(item => {
          if (item.type === this.messageData.type) {
            this.messageData = item
          }
        })
      })
    },

    getlist() {
      this.$emit('toNotice')
      this.queryTempFun()
    },
    // 保存发送方式
    submitStyle() {
      if (this.messageData.wxSwitch === '2') { // 判断是否有微信
        this.paramsNum = {
          wxSwitch: '2',
          smsSwitch: this.smsValue === true ? '1' : '0',
          id: this.messageData.id
        }
      } else if (this.messageData.smsSwitch === '2') { // 判断是否有短信
        this.paramsNum = {
          wxSwitch: this.wxValue === true ? '1' : '0',
          smsSwitch: '2',
          id: this.messageData.id
        }
      } else {
        this.paramsNum = {
          wxSwitch: this.wxValue === true ? '1' : '0',
          smsSwitch: this.smsValue === true ? '1' : '0',
          id: this.messageData.id
        }
      }

      updateMsgTemp(this.paramsNum).then(res => {
        if (res.data.errorCode === 0) {
          // this.$message.success(res.data.errorMessage)
          this.getlist()
          this.sideDialogShow = false
          this.$message.success('保存成功！')
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    /* 打开侧边弹框 */
    showDialog(value) {
      this.wxSwitchNum = value.wxSwitch
      this.smsSwitchNum = value.smsSwitch

      this.messageData = value
      this.sideDialogShow = true

      if (this.messageData.wxSwitch === '0' || this.messageData.wxSwitch === null) {
        this.wxValue = false
      } else {
        this.wxValue = true
      }

      if (this.messageData.smsSwitch === '0' || this.messageData.smsSwitch === null) {
        this.smsValue = false
      } else {
        this.smsValue = true
      }
    },

    close() {
      this.sideDialogShow = false
    },

    // 选择员工弹窗
    selectStaffDialogFun() {
      this.$refs.selectStaffDialog.showDialog(this.messageData)
    }
  }
}
</script>

<style lang="scss" scoped>
.messageDetailDialog_container {
  .fixMessage {
    background: #fff;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-top: 1px solid rgba(238, 238, 238, 1);
  }
  .fullBottom {
    padding-bottom: 20px;
    margin-left: 1.5%;
    overflow: auto;
    height: calc(100vh - 170px);
    position: relative;

    .scene {
      display: inline-block;
      width: 720px;
      margin-top: 20px;
      padding: 20px;
      display: flex;
      background: rgba(246, 247, 249, 1);
      .sceneLeft {
        width: 40px;
        height: 40px;
        margin-top: 4px;
      }
      .sceneRight {
        margin-left: 20px;
        width: 400px;
        font-family: PingFangSC-Regular, PingFangSC;
        font-weight: 400;
        span:nth-of-type(1) {
          display: inline-block;
          width: 100%;
          color: rgba(51, 51, 51, 1);
          line-height: 22px;
        }
        span:nth-of-type(2) {
          display: inline-block;
          color: #666666;
          margin-top: 5px;
        }
        .sceneRightCon {
          display: inline-block;
          margin-top: 6px;
          width: 640px;
          color: rgba(102, 102, 102, 1);
          line-height: 20px;
          .sceneRightConHave {
            span {
              display: inline;
              i {
                font-style: normal;
                display: inline-block;
                height: 24px;
                font-size: 14px;
                margin-right: 5px;
                line-height: 24px;
                text-align: center;
              }
            }
          }
        }
      }
    }
    // 发送方式
    .sceneWey {
      display: inline-block;
      width: 720px;
      margin-top: 20px;
      padding: 20px;
      display: flex;
      background: rgba(246, 247, 249, 1);
      .sceneLeft {
        width: 40px;
        height: 40px;
        margin-top: 4px;
      }
      .sceneRight {
        margin-left: 20px;
        width: 100%;
        font-family: PingFangSC-Regular, PingFangSC;
        font-weight: 400;
        clear: left;
        .sceneRightTop {
          width: 100%;
          color: #333;
          line-height: 22px;
          float: left;
        }
        .sceneRightBottom {
          width: 100%;
          float: left;
          span:nth-of-type(1) {
            display: block;
            margin-top: 6px;
            width: 295px;
            color: rgba(102, 102, 102, 1);
            line-height: 20px;
            float: left;
            font-size: 14px;
            position: relative;
            span {
              margin-bottom: 14px;
            }
            img {
              display: block;
              width: 294px;
              height: 522px;
              margin-left: -3px;
            }
            .messageDetail {
              position: absolute;
              top: 135px;
              left: 11px;
              padding: 12px;
              width: 270px;
              background: rgba(255, 255, 255, 1);
              font-weight: 400;
              border-radius: 4px;
              p:nth-of-type(1) {
                font-size: 13px;
                color: rgba(51, 51, 51, 1);
                line-height: 17px;
              }
              p:nth-of-type(2) {
                font-size: 9px;
                color: rgba(153, 153, 153, 1);
                line-height: 13px;
                margin: 4px 0 13px 0;
              }
              p:nth-of-type(3) {
                font-size: 11px;
                color: rgba(102, 102, 102, 1);
                line-height: 16px;
              }
              p:nth-of-type(4) {
                font-size: 11px;
                color: rgba(94, 112, 171, 1);
                line-height: 16px;
                margin-top: 27px;
              }
            }
          }
          span:nth-of-type(2) {
            display: block;
            margin-left: 20px;
            margin-top: 6px;
            width: 295px;
            color: rgba(102, 102, 102, 1);
            line-height: 20px;
            float: left;
            font-size: 14px;
            position: relative;
            span {
              margin-bottom: 14px;
            }
            img {
              display: block;
              width: 294px;
              height: 522px;
              margin-left: -3px;
            }
            .messageDetail {
              position: absolute;
              top: 135px;
              left: 11px;
              padding: 10px;
              width: 223px;
              font-weight: 400;
              background: rgba(242, 242, 243, 1);
              border-radius: 9px;
              p {
                font-size: 11px;
                line-height: 17px;
                color: rgba(51, 51, 51, 1);
              }
            }
          }
        }
      }
    }
  }
}
</style>

