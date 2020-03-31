<template>
  <div class="pic-container">
    <div
      v-if="data.length>0"
      class="pic-box"
    >
      <div
        v-for="(item,index) of data"
        :key="index"
        class="pic"
        @click="outerDialog(item)"
      >
        <div
          v-if="item.isH5 === 1"
          class="hotIcon"
        >
          <img
            src="http://img.ishanshan.com/gimg/n/20190902/632cddb694a40376a151fcac0dec951f"
            alt=""
          >
        </div>
        <!-- <div class="zhezhao">
          <div class="erweimaBox">
            <qrcode
              :value="item.demoUrl"
              :options="{ width: 132,height:132,margin:0 }"
              class="erweima"
            />
          </div>
        </div> -->
        <div class="main">
          <div v-if="item.isH5 === 1" class="mainImg">
            <img
              :src="item.icon"
              class="mainImg_default"
              alt=""
            >
            <template v-if="item.moveImg">
              <img
                :src="item.moveImg"
                class="mainImg_hover"
                alt=""
              >
            </template>
            <template v-else>
              <img
                :src="item.icon"
                class="mainImg_hover"
                alt=""
              >
            </template>
          </div>
          <div v-else class="mainImg">
            <img
              :src="item.icon"
              class="mainImg_default"
              alt=""
            >
            <img
              :src="item.icon"
              class="mainImg_hover"
              alt=""
            >
          </div>
          <div class="tit">{{ item.gameTitle }}</div>
          <!-- <div class="main-bottom">
            <div class="box">
              <svg-icon
                icon-class="icon_sy_ck"
                style="color:#999;font-size:26px;padding-top:6px"
              />
              <span>{{ item.allUsers }}</span>
            </div>
            <el-button
              v-if="item.btnType === 'ON'"
              type="primary"
              @click="outerDialog(item)"
            >创建</el-button>
            <el-button
              v-else
              type="primary"
              @click="outerDialog(item)"
            >{{ '￥'+item.price+ ' 购买' }}</el-button>
          </div> -->
        </div>
      </div>
      <!-- 弹出框 -->
      <el-dialog
        :visible.sync="outerVisible"
        :append-to-body="true"
        custom-class="creatGameDialog"
      >
        <div class="box">
          <div class="left-arrow" @click="stepPre">
            <img class="img_default" src="http://img.ishanshan.com/gimg/n/20190902/3026b5ef1acd6cb63c7897fa8e3fdcdb">
            <img class="img_hover" src="http://img.ishanshan.com/gimg/n/20190902/003c0019499c3f8f6bfdd262bac6573d">
          </div>
          <div class="right-arrow" @click="stepNext">
            <img class="img_default" src="http://img.ishanshan.com/gimg/n/20190902/08d217234b5c275dc969666966b7c7b7">
            <img class="img_hover" src="http://img.ishanshan.com/gimg/n/20190902/3afb6a575f66b41517c1fa921a146607">
          </div>
          <div v-loading="modalLoading" class="box-left-all">
            <div class="box-left">
              <img
                :src="leftImg"
                alt=""
                @load="handleLoad"
              >
            </div>
          </div>
          <div class="box-right">
            <div class= "box-right-title">
              <div class="gameName">
                <div v-if="obj.isH5 === 1" class="gameImg">
                  <img src="http://img.ishanshan.com/gimg/n/20190902/b2d502bd3549eddc16100a03e0d229a4" style= "width:47px">
                </div>
                <span>{{ tit }}</span>
              </div>
            </div>
            <!-- <div class="modelType">
              <span class="dian" />
              <span class="tit">模板类型:</span>
              <div class="modelTypeCont">
                <div
                  v-if="modelType.length<1"
                  class="btn"
                >其他</div>
                <div
                  v-if="modelType.length>0"
                  class="btnBox"
                >
                  <div
                    v-for="(item,index) of modelType"
                    :key="index"
                    class="btn"
                  >{{ item.label_name }}</div>
                </div>
              </div>
            </div> -->
            <!-- <el-popover placement="bottom"> -->
            <div class="modelIntro">
              <!-- <span class="dian" /> -->
              <span class="tit">模板介绍:</span>
              <el-popover
                :content="gameIntro"
                placement="bottom-start"
                trigger="hover"
              >
                <div slot="reference">{{ gameIntro }}</div>
              </el-popover>
            </div>
            <div class="modelType">
              <!-- <span class="dian" /> -->
              <!-- <span class="tit">模板类型:</span> -->
              <div class="modelTypeCont">
                <div
                  v-if="modelType.length<1"
                  class="btn"
                >其他</div>
                <div
                  v-if="modelType.length>0"
                  class="btnBox"
                >
                  <div
                    v-for="(item,index) of modelType"
                    :key="index"
                    class="btn"
                  >{{ item.label_name }}</div>
                </div>
              </div>
            </div>
            <!-- </el-popover> -->
            <!-- <div class="otherIntro">
              <span class="dian" />
              <span class="tit">其他推荐:</span>
              <div class="introBtn">
                <img
                  v-for="(itm,index) in otherIntro"
                  :key="index"
                  :src="itm.icon"
                  alt=""
                  @click="imgBtn(itm.gameId)"
                >
              </div>
            </div> -->
            <div class="code">
              <div class="erweima">
                <qrcode
                  :options="{ width: 84,height:84,margin:0 }"
                  :value="erweima"
                />
              </div>
              <div class="text">扫码试玩</div>
              <div class="btn_">
                <el-button
                  v-if="obj.btnType === 'ON'"
                  type="primary"
                  size="medium"
                  @click="picDetailBtn()"
                >立即创建</el-button>
                <el-button
                  v-else
                  type="primary"
                  size="medium"
                  @click="buyDialogShow(true)"
                >
                  {{ '￥'+obj.price+ ' 购买' }}
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>

    </div>
    <div
      v-if="data.length === 0"
      class="pic-box"
    >
      <div class="zhanwei">
        <img
          style="width:51px;height:51px;"
          src="https://img.ishanshan.com/gimg/n/20190327/88826c90471a228009be72f913981612"
          alt=""
        >
        <p>抱歉 没有符合相应条件的模板</p>
      </div>
    </div>
    <GameDetail
      v-if="picDetailShow"
      :visible.sync="picDetailShow"
      @openPreviewDialog="openPreviewDialog"
    />
    <!-- h5 游戏编辑器页 -->
    <CreateH5Game
      v-if="h5GameShow"
      :visible.sync="h5GameShow"
      :inst-id="instId"
      @openPreviewDialog="openPreviewDialog"
    />
    <!-- 游戏保存成功后的弹框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      title="保存成功"
      width="400px"
      append-to-body
      @close="closeDialog"
    >
      <div>
        <p class="game_top"><i class="el-icon-circle-check icon_success" />微游戏已保存成功</p>
        <div class="game_qrcode">
          <transition name="el-zoom-in-bottom">
            <Qrcode
              v-if="dialogData.qrcodeUrl"
              :value="dialogData.qrcodeUrl"
              :options="{ width: 190,height:190,margin: 0 }"
            />
          </transition>
        </div>
        <div class="copy_box">
          <el-input
            ref="url"
            v-model="dialogData.qrcodeUrl"
            :readonly="true"
            :style="{marginRight: '20px'}"
          />
          <el-button
            v-clipboard:copy="dialogData.qrcodeUrl"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
            type="primary"
          >复制</el-button>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="goMyGame('edit')">再次编辑</el-button>
        <el-button
          type="primary"
          @click="goMyGame"
        >立即查看</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="buyDialogVisible"
      title="游戏开通"
      width="300px"
      append-to-body
    >
      <div style="text-align: center">
        <img
          class="connect_popover_img"
          src="https://img.ishanshan.com/gimg/user/n///1557308283.png"
        >
        <p class="connect_p">微信扫码，获取专属服务顾问</p>
        <p class="connect_mobile">客服热线：400-660-5733</p>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="buyDialogShow(false)">知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Qrcode from '@chenfengyuan/vue-qrcode'
import GameDetail from './creatGame'
import CreateH5Game from './createH5Game'
import { queryThemeInst, createThemeInst } from '@/api/marketing/microGame.js'
import { mapState, mapActions } from 'vuex'
export default {
  components: {
    GameDetail,
    Qrcode,
    CreateH5Game
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      buyDialogVisible: false, // 开通弹框
      picDetailShow: false,
      // 弹出框参数
      outerVisible: false,
      innerVisible: false,
      // 外层弹窗参数
      tit: '',
      gameIntro: '',
      modelType: [],
      leftImg: '',
      erweima: '',
      otherIntro: [],
      obj: {},
      dialogVisible: false, // 游戏保存后预览弹框显示
      dialogData: {}, // 游戏保存后预览弹框显示数据
      showIndex: 0, // 显示列表的index
      instId: '', // iframe h5编辑器使用
      h5GameShow: false, // h5编辑器设计页显示
      themeInfo: {},
      modalLoading: false // 弹窗切换loading
    }
  },
  computed: {
    ...mapState('changeThirdMain', [
      'tabsName'
    ])
  },
  watch: {
    outerVisible(val) {
      if (!val) {
        this.leftImg = ''
      }
    }
  },
  methods: {
    handleLoad(e) {
      this.modalLoading = false
    },
    /* 上一步 */
    stepPre() {
      // this.modalLoading = true
      if (this.showIndex > 0) {
        this.showIndex--
        this.showItem()
      } else {
        this.showIndex = Number(this.data && this.data.length - 1)
        this.showItem()
      }
    },
    // 下一步
    stepNext() {
      // this.modalLoading = true
      if (Number(this.showIndex) < Number(this.data.length - 1)) {
        this.showIndex++
        this.showItem()
      } else {
        this.showIndex = 0
        this.showItem()
      }
    },
    // 弹窗显示内容
    showItem() {
      this.leftImg = ''
      this.modalLoading = true
      this.obj = this.data && this.data[this.showIndex]
      this.tit = this.obj.gameTitle
      this.modelType = this.obj.labels || []
      this.erweima = this.obj.demoUrl
      this.gameIntro = this.obj.gameIntro
      setTimeout(() => {
        this.leftImg = this.obj.showImg
      }, 500)
      if (this.obj.isH5 === 1) {
        this.queryThemeInfo()
      }
    },
    // 购买游戏显示
    buyDialogShow(val) {
      this.buyDialogVisible = val || false
      this.outerVisible = false
    },
    // 打开游戏保存后的预览弹框, gameUrl: 游戏链接, data: iframe传递的信息
    openPreviewDialog(data) {
      this.dialogVisible = true
      this.dialogData = {
        qrcodeUrl: data.instH5Url
      }
      this.obj = {
        ...this.obj,
        dataId: data.instId
      }
    },
    // 关闭游戏保存后的预览弹框
    closeDialog() {
      this.dialogVisible = false
    },
    onCopy: function(e) {
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    },
    onError: function(e) {
      this.$message.error('复制失败')
    },
    ...mapActions('changeThirdMain', [
      'changeTabs'
    ]),
    /** 跳转我的 */
    goMyGame(type) {
      if (type && type === 'edit') {
        this.dialogVisible = false
        if (this.obj.isH5 === 1) {
          this.h5GameShow = true
        } else {
          this.picDetailShow = true
        }
      } else {
        this.dialogVisible = false
        this.$nextTick(() => {
          this.changeTabs('myGame_2')
        })
      }
    },
    picDetailBtn() {
      if (this.obj.isH5 === 1) {
        if (JSON.stringify(this.themeInfo) !== '{}') {
          var t = new Date()
          var iToDay = t.getDate()
          var iToMon = t.getMonth()
          var iToYear = t.getFullYear()
          var newDay = new Date(iToYear, iToMon, (iToDay + 31))
          const startDate = new Date(t)
          const endDate = new Date(newDay)
          this.themeInfo.startTime = startDate.getTime()
          this.themeInfo.endTime = endDate.getTime()
          createThemeInst({ ...this.themeInfo, sources: '0' }).then(res => {
            this.instId = res.data.data.instId
            this.h5GameShow = true
          })
        }
      } else {
        this.picDetailShow = true
      }
      this.outerVisible = false
    },
    // 查询模板内容
    queryThemeInfo() {
      queryThemeInst({ themeId: this.obj.themeId }).then(res => {
        if (res.data.errorCode === 0) {
          this.themeInfo = res.data.data
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    // 弹框方法
    outerDialog(e) {
      this.modalLoading = true
      this.obj = e
      this.tit = e.gameTitle
      this.modelType = e.labels || []
      this.leftImg = e.showImg
      this.erweima = e.demoUrl
      this.gameIntro = e.gameIntro
      this.outerVisible = true
      // const params = { gameId: e.gameId }
      this.showIndex = this.data.indexOf(this.obj)
      if (this.obj.isH5 === 1) {
        this.queryThemeInfo()
      }
      // gameChoose(params).then((res) => {
      //   if (res.data.errorCode === 0) {
      //     this.otherIntro = res.data.gameList
      //   } else {
      //     this.$message.error(res.errorMessage)
      //   }
      // })
    },
    imgBtn(gid) {
      this.outerVisible = false
      this.data.map((val) => {
        if (val.gameId === gid) {
          setTimeout(() => { this.outerDialog(val) }, 300)
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.code /deep/{
  margin-top: 20px;
  position:absolute;
  bottom:30px;
  .erweima{
    margin-bottom: 10px;
  }
  .text{
    margin-left: 15px;
    color: #666666;
    font-size: 14px;
    margin-bottom: 30px;
  }
  .btn_ {
    button{
      width:300px;
      height:44px;
      border-radius: 5px;
      span{
        font-size:14px;
      }
    }
  }
}
.pic-container {
  min-height: calc(100vh - 328px);
  background: rgba(240, 242, 245, 0.8);
}
.pic-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 15px 0 0 15px;
  .zhanwei {
    height: 200px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 20px;
    p {
      font-size: 14px;
      line-height: 14px;
      color: #666;
      margin-top: 10px;
    }
  }
}
.pic {
  height: 100%;
  min-width: 240px;
  padding: 10px 10px 14px 10px;
  position: relative;
  transition: all 0.5s;
  border-radius: 5px;
  text-align: left;
  background: rgba(255, 255, 255, 1);
  margin: 10px;
  cursor: pointer;
  .hotIcon {
    position: absolute;
    top: 2px;
    right: 7px;
    z-index: 1000;
    img {
      width: 100%;
    }
  }
  .zhezhao {
    width: 223px;
    height: 223px;
    position: absolute;
    background: rgba(0, 0, 0, 0);
    transition: background 1s;
    display: flex;
    justify-content: center;
    align-items: center;
    .erweimaBox {
      width: 140px;
      height: 140px;
      padding: 4px;
      background: #fff;
      opacity: 0;
      transition: opacity 1s;
    }
    .erweima {
      opacity: 0;
      transition: opacity 1s;
    }
  }

  .main {
    .mainImg {
      img {
        width: 223px;
        height: 223px;
        border-radius: 5px;
      }
      .mainImg_hover {
        display: none
      }
      &:hover {
        .mainImg_hover {
          display: inline-block
        }
        .mainImg_default {
          display: none;
        }
      }
    }
    .tit {
      font-size: 16px;
      color: #333;
      text-align: left;
      white-space: nowrap;
      margin: 10px 0 0 0;
      line-height:22px;
    }

    .main-bottom {
      display: flex;
      justify-content: space-between;
    }

    .box span {
      margin-left: 3px;
      display: inline-block;
      line-height: 25px;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      font-size: 12px;
    }
  }
}
.pic:hover .zhezhao {
  background: rgba(0, 0, 0, 0.5);
}
.pic:hover .erweima {
  opacity: 1;
}
.pic:hover .erweimaBox {
  opacity: 1;
}
.pic:hover {
  box-shadow: 0 0 15px #999;
}
.left-arrow,.right-arrow {
  position: absolute;
  top: 40%;
  width: 70px;
  cursor: pointer;
  &:hover {
    .img_hover {
      display: inline-block
    }
    .img_default {
      display: none
    }
  }
  .img_hover {
    display: none
  }
  .img_default {
    display: inline-block
  }
  img {
    width: 100%;
  }
}
.left-arrow {
  left:-130px;
}
.right-arrow {
  right:-130px;
}
</style>
<style lang="scss">
.creatGameDialog {
  width: 660px;
  height: 500px;
  position: relative;

  .el-dialog__header {
    margin: 0;
    padding: 0 !important;
    border-bottom: 0;
    .el-dialog__headerbtn {
      z-index: 999;
    }
  }
  .el-dialog__body {
    max-height: 560px !important;
    overflow: hidden;
    padding:0 !important;
    .box {
      width: 100%;
      height: 500px;
      // padding-top: 15px;
      display: flex;
      position: initial !important;
      .box-left-all {
        padding: 20px;
        height: 500px;
        background: #f0f0f0;
      }
      .box-left {
        width: 258px;
        overflow: hidden;
        overflow-y: scroll;
        height: 460px;
        img {
          width: 100%;
          min-height: 1000px;
        }
      }
      .box-right {
        display: flex;
        flex-direction: column;
        width: 362px;
        // margin-left: 30px;
        position: relative;
        padding: 40px 30px 30px 30px;
        .box-right-title {
          margin-bottom: 24px;
          .gameName {
            font-size: 20px;
            color: #333333;
            // letter-spacing: 2px;
            font-weight: 500;
            margin-top: 0;
            // margin-right: 10px;
            max-height: 56px;
            line-height: 28px;
            display: -webkit-box;
            overflow: hidden;
            /* white-space: nowrap; */
            text-overflow: ellipsis;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            .gameImg {
              display: inline-block;
              vertical-align: middle;
            }
          }
        }
        .dian {
          width: 6px;
          height: 6px;
          background: #5d9cec;
          display: inline-block;
          border-radius: 50%;
        }
        .tit {
          font-size: 14px;
          color: #333333;
          display: inline-block;
          // letter-spacing: 1px;
          margin-bottom: 10px;
        }
        .modelType {
          font-size: 12px;
          color: #333;
          letter-spacing: 1px;
          margin-top: 10px;

          .modelTypeCont {
            font-size: 14px;
            color: #5d9cec;
            // padding-left: 13px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            // margin-top: 8px;
            .btn {
              background: rgba(242,242,242,1);
              color: #999999;
              -webkit-box-sizing: border-box;
              box-sizing: border-box;
              // width: 80px;
              margin-bottom: 10px;
              height: 26px;
              font-size: 14px;
              border-radius: 15px;
              line-height: 20px;
              padding: 3px 25px;
              display: inline-block;
              margin-right: 10px;
              // margin-bottom: 8px;
            }
          }
        }
        .modelIntro {
          font-size: 14px;
          color: #666666;
          box-sizing: border-box;
          display: -webkit-box;
          div {
            font-size: 14px;
            color: #333;
            // padding-left: 13px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
            line-height: 20px;
            max-height: 60px;
            word-break:break-all;
          }
        }
        .otherIntro .introBtn {
          margin-bottom: 20px;
          // padding-left: 13px;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          img {
            width: 70px;
            height: 70px;
            background: #ddd;
            display: inline-block;
            margin-right: 10px;
          }
        }
        .footer {
          padding-left: 13px;
          display: flex;
          justify-content: space-between;
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          .erweima {
            display: flex;
            flex-direction: column;
            span {
              margin-left: 43px;
              margin-top: 10px;
            }
          }
          .el-button {
            position: absolute;
            bottom: 0;
            right: 0;
          }
        }
      }
    }
  }
}
//---------------------- 保存成功 start---------------------------
.game_top {
  text-align: center;
  font-size: 20px;
  margin-bottom: 20px;
  .icon_success {
    color: #87d068;
    margin-right: 5px;
  }
}

.game_qrcode {
  text-align: center;
}

.copy_box {
  display: flex;
  margin-top: 20px;
  margin-bottom: 14px;
}
//---------------------- 保存成功 end---------------------------

.connect_p {
  margin: 14px 0 10px 0;
  color: #666;
}
.connect_mobile {
  color: #1d9df2;
}
</style>
