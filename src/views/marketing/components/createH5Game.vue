<template>
  <transition name="slide-fade">
    <div
      v-show="isVisible"
      ref="sideModal"
      class="side-zhezhao"
    >
      <div
        v-show="isVisible"
        class="side-dialog"
      >
        <div :class="topShow===true? 'contBox':'contBox1'">
          <IframeCom :out-url="url" @openPreviewDialog="openPreviewDialog"/>
        </div>
      </div>
      <!-- 保存成功 -->
      <el-dialog
        :visible.sync="dialogVisible"
        title="保存成功"
        width="400px"
        append-to-body
        @close="closeSuccess"
      >
        <div>
          <p class="game_top"><i class="el-icon-circle-check icon_success" />微游戏已保存成功</p>
          <div class="game_qrcode">
            <transition name="el-zoom-in-bottom">
              <VueQrcode
                v-if="qrcodeUrl"
                :value="qrcodeUrl"
                :options="{ width: 190,height:190,margin: 0 }"
              />
            </transition>
          </div>
          <div class="copy_box">
            <el-input
              ref="url"
              v-model="qrcodeUrl"
              :readonly="true"
              :style="{marginRight: '20px'}"
            />
            <el-button
              v-clipboard:copy="qrcodeUrl"
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
    </div>
  </transition>
</template>
<script>
import Vue from 'vue'
import { mapMutations } from 'vuex'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import Confirm from '@/components/MiniCommon/Confirm'
import { mapState, mapActions } from 'vuex'
import IframeCom from '@/components/IframeCom/iframeCom'
// 复制插件
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
export default {
  components: { Confirm, VueQrcode, IframeCom },
  props: {
    'visible': {
      type: Boolean,
      default: true
    },
    'instId': {
      type: String,
      default: null
    }
  },
  data() {
    return {
      isVisible: this.visible,
      url: '',
      topShow: true,
      dialogVisible: false,
      qrcodeUrl: undefined
    }
  },
  computed: {
    ...mapState('changeThirdMain', [
      'tabsName',
      'cTabName'
    ])
  },
  watch: {
    'visible'(val) {
      this.isVisible = val
    },
    'isVisible'(val) {
      this.$emit('update:visible', val)
    }
  },
  mounted() {
    const side = this.$refs.sideModal
    document.body.appendChild(side)
    if (this.$parent.obj.isH5 === 1) {
      const token = this.$store.getters.token.slice(7)
      if (this.instId) {
        this.url = process.env.H5CREATER_BASE + `/saas.html?action=createInst&instId=` + this.instId + `&token=` + token
      }
    }
    const self = this
    window.addEventListener('message', function(e) {
      if (e.data === 'closeGame') {
        self.close()
        setTimeout(() => {
          self.setBlankCard()
        }, 10)
      } else if (e.data === 'jumpToMessage') {
        // const t = new Date().getTime()
        const url = window.location.href.split('#')[0] + '#/org_settings/rule_set?sms'
        window.open(url)
      }
    }, false)
  },
  methods: {
    ...mapMutations('microGame', [
      'GET_EDIT_URL'
    ]),
    openPreviewDialog(data) {
      this.$emit('openPreviewDialog', data)
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

    /** 成功弹窗关闭 */
    closeSuccess() {
      this.dialogVisible = false
      this.close()
    },

    /** 跳转我的 */
    goMyGame(type) {
      if (type && type === 'edit') {
        this.dialogVisible = false
        this.close()
        this.$nextTick(() => {
          this.setBlankCard()
        })
      } else {
        this.dialogVisible = false
        this.GET_EDIT_URL({ editUrl: '', isEdit: false })
        this.close()
        this.$nextTick(() => {
          // this.setBlankCard()
          this.$router.push({ path: '/newGame/ifr' })
        })
      }
    },
    close() {
      this.isVisible = false
    },
    save() {
      const ifr = document.getElementById('ifr')
      ifr.contentWindow.postMessage({
        type: 'game'
      }, '*')
    },
    ...mapActions('changeThirdMain', [
      'changeTabs'
    ]),
    setBlankCard() {
      this.changeTabs('myGame_1')
    }
  }
}
</script>
<style lang="scss" scoped>
.side-zhezhao {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0px;
  right: 0px;
  z-index: 2000;
}

.side-dialog {
  top: 0px;
  right: 0px;
  z-index: 1000;
  width: calc(100% - 0px);
  position: fixed;
  margin-left: -20px;
  height: 100%;
  background-color: rgba(255, 255, 255, 1);
  -moz-box-shadow: 2px 2px 5px #333333;
  -webkit-box-shadow: 2px 2px 5px #333333;
  box-shadow: 2px 2px 5px #333333;
  .top {
    width: calc(100vw - 180px) !important;
    min-height: 40px;
    justify-content: space-between;
    border-bottom: 4px solid #5d9cec;
    display: flex;
    justify-content: space-between;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-left: 20px;
    .lan {
      background-color: #5d9cec;
      width: 8px;
      height: 14px;
      border-radius: 3px;
      display: inline-block;
      margin-right: 5px;
    }
    .top-left {
      display: flex;
      font-size: 16px;
      margin-top: 10px;
    }
    .top-right {
      display: flex;
      .el-button {
        margin-left: 10px;
        margin-bottom: 10px;
      }
    }
  }
  .contBox {
    width: calc(100vw - 0px);
    height: calc(100vh - 0px);
    .cont {
      width: 100%;
      height: 100%;
      border: 0;
    }
  }
  .contBox1 {
    width: calc(100vw - 150px);
    height: calc(100vh);
    .cont {
      width: 99%;
      height: 100%;
      border: 0;
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

.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(1000px);
  opacity: 0;
}
</style>
<style lang="scss" >
.tanchukuang {
  z-index: 20000 !important;
  p {
    font-size: 12px;
    color: #666;
  }
}
</style>

