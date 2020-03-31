<template>
  <div>
    <div class="camera_btns">
      <el-button
        v-if="liveStatus === 0"
        type="primary"
        class="cemera_switch"
        @click="startLiveVisible"
      ><i class="iconfont iconzhibo" />开始直播</el-button>
      <el-button
        v-else
        :disabled="liveStatus === 2"
        type="danger"
        class="cemera_switch"
        @click="endVisible = true"
      ><i class="iconfont iconjieshuzhibo" />结束直播</el-button>
      <el-button @click="openSet">设备设置</el-button>
    </div>
    <div id="video_wrap" class="cemera_content">
      <img v-if="!enableCamera" src="https://img.ishanshan.com/gimg/n/20200213/911d4fc5057e5348f63c54647b808833" alt="摄像头">
      <p v-if="cemeraDisabled" class="no_devices">系统未检测到摄像头</p>
      <p v-else-if="micDisabled" class="no_devices">系统未检测到麦克风</p>
    </div>
    <div class="cemera_ctrl">
      <el-button
        :disabled="cemeraDisabled"
        type="text"
        @click="switchCemera"><img :src="cemeraShow.url" class="btn_icon">摄像头{{ cemeraShow.text }}</el-button>
      <span>|</span>
      <el-button
        :disabled="micDisabled"
        type="text"
        @click="switchMic"><img :src="micShow.url" class="btn_icon">麦克风{{ micShow.text }}</el-button>
    </div>

    <!-- 设备设置 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      title="设备设置"
      width="550px"
      @open="onOpen"
      @close="onClose"
    >
      <div class="set_box">
        <div class="devices_wrap">
          <div>
            <span>摄像头：</span>
            <el-select v-model="cemeraId" placeholder="请选择摄像头" no-data-text="未检测到摄像头" @change="cemeraChange">
              <el-option
                v-for="(item, index) in cemeraList"
                :key="index"
                :label="item.label"
                :value="item.deviceId" />
            </el-select>
          </div>
          <div class="mic_select">
            <span>麦克风：</span>
            <el-select v-model="micId" placeholder="请选择麦克风" no-data-text="未检测到麦克风" @change="micChange">
              <el-option
                v-for="(item, index) in micList"
                :key="index"
                :label="item.label"
                :value="item.deviceId" />
            </el-select>
          </div>
          <div class="mic_select">
            <el-checkbox v-model="isMute" :disabled="vioceDisabled" @change="spikerOut">麦克风外放测试(开启后请说话)</el-checkbox>
          </div>
        </div>
        <div id="video_set" class="set_cemera">
          <img v-if="!hasCemera" src="https://img.ishanshan.com/gimg/n/20200213/911d4fc5057e5348f63c54647b808833" alt="摄像头">
          <p v-if="cemeraDisabled" class="no_devices">系统未检测到摄像头</p>
          <p v-else-if="micDisabled" class="no_devices">系统未检测到麦克风</p>
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 开始确认 -->
    <el-dialog
      :visible.sync="startVisible"
      :close-on-click-modal="false"
      title="提示"
      width="500px">
      <span>开始直播后，学员将可进入直播间观看，请确认是否开始直播</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="startVisible = false">取 消</el-button>
        <el-button type="primary" @click="startLive">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 结束确认 -->
    <el-dialog
      :visible.sync="endVisible"
      :close-on-click-modal="false"
      title="提示"
      width="500px">
      <span>直播结束后，该直播无法重新开始，您也不可再次进入该直播间，请确认是否结束直播</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="endVisible = false">取 消</el-button>
        <el-button type="primary" @click="endLive">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { queryAccount } from '../../../api/online/liveLesson'

export default {
  props: {
    // 摄像头开关
    enableCamera: {
      type: Boolean,
      required: true
    },
    // 麦克风开关
    enableMic: {
      type: Boolean,
      required: true
    },
    localStream: {
      type: null,
      required: true
    }
  },

  data() {
    return {
      dialogVisible: false,

      startVisible: false, // 开始直播确认dialog
      endVisible: false, // 结束直播dialog

      cemeraList: [], // 摄像头列表
      micList: [], // 麦克风列表
      cemeraId: '',
      micId: '',
      isMute: false, // 声音外放
      vioceDisabled: false,

      hasCemera: false
    }
  },

  computed: {
    ...mapState('liveLesson', [
      'currentRow',
      'liveStatus',
      'cemeraDisabled',
      'micDisabled'
    ]),

    // 摄像头icon
    cemeraShow() {
      if (this.cemeraDisabled) {
        return {
          text: '已禁用',
          url: 'https://img.ishanshan.com/gimg/n/20200219/d791ac5659ce13868f64c12ea3df52f2'
        }
      } else if (this.enableCamera) {
        return {
          text: '已开启',
          url: 'https://img.ishanshan.com/gimg/n/20200214/43e19c4f9f971022c0e9ec182b6859ec'
        }
      } else {
        return {
          text: '已关闭',
          url: 'https://img.ishanshan.com/gimg/n/20200214/d2594fff1ef6b378cd48308142fe496d'
        }
      }
    },

    // 麦克风icon
    micShow() {
      if (this.cemeraDisabled) {
        return {
          text: '已禁用',
          url: 'https://img.ishanshan.com/gimg/n/20200219/63fcd4c9729025e10ed978d44445fb96'
        }
      } else if (this.enableMic) {
        return {
          text: '已开启',
          url: 'https://img.ishanshan.com/gimg/n/20200214/4922221f774b7d4fc5d94cf780be1e5a'
        }
      } else {
        return {
          text: '已关闭',
          url: 'https://img.ishanshan.com/gimg/n/20200214/9725215494bd671243f10796d9fc6c5a'
        }
      }
    }
  },

  watch: {
    cemeraDisabled(newProp) {
      const outside = document.getElementById('local_video')
      const inside = document.getElementById('local_video_set')
      if (newProp) {
        if (outside) {
          outside.style.height = '0'
        }
        if (inside) {
          inside.style.height = '0'
        }
      } else {
        if (outside) {
          outside.style.height = '100%'
        }
        if (inside) {
          inside.style.height = '100%'
        }
      }
    }
  },

  methods: {
    ...mapMutations('liveLesson', [
      'UPDATE_STATE'
    ]),
    ...mapActions('liveLesson', [
      'changeRTC',
      'saveLivePeople',
      'setHeartbeat',
      'saveHeartbeat'
    ]),

    async startLiveVisible() {
      const res = await queryAccount()
      const { errorCode, duration, errorMessage } = res.data
      if (errorCode === 0) {
        if (duration <= 0) {
          this.$message.error('已无可用直播时长，请先充值时长')
          return
        }
        const time = (new Date(this.currentRow.endTime) - new Date(this.currentRow.startTime)) / 1000 / 60
        if (time > duration) {
          this.$message.error('剩余直播时长不足，无法开始直播')
          return
        }
        this.startVisible = true
      } else {
        this.$message.error(errorMessage)
      }
    },

    /** 摄像头开关 */
    switchCemera() {
      this.$emit('toggleCamera')
    },

    /** 麦克风开关 */
    switchMic() {
      this.$emit('toggleMic')
    },

    /** 外放开关 */
    spikerOut(value) {
      console.log(value)
      this.vioceDisabled = true
      if (value) {
        this.localStream.stop()
        this.playVideo(false, () => { this.vioceDisabled = false })
      } else {
        this.localStream.stop()
        this.playVideo(true, () => { this.vioceDisabled = false })
      }
    },

    /** 打开设备设置 */
    openSet() {
      this.dialogVisible = true
      // eslint-disable-next-line no-undef
      TRTC.getCameras().then(devices => {
        console.log('摄像头列表=========', devices)
        if (devices && devices.length > 0) {
          this.cemeraList = [...devices]
          this.hasCemera = true
          this.UPDATE_STATE({ cemeraDisabled: false })
        } else {
          this.cemeraList = []
          this.$message.error('系统未检测到摄像头设备')
          this.hasCemera = false
          this.UPDATE_STATE({ cemeraDisabled: true })
        }
      })
      // eslint-disable-next-line no-undef
      TRTC.getMicrophones().then(devices => {
        console.log('麦克风列表=========', devices)
        if (devices && devices.length > 0) {
          this.micList = [...devices]
          this.UPDATE_STATE({ micDisabled: false })
        } else {
          this.micList = []
          if (this.liveStatus === 1) {
            this.$message.error('系统未检测到麦克风设备，观看者无法听到声音')
          } else if (this.liveStatus === 0) {
            this.$message.error('系统未检测到麦克风设备，请至少保证麦克风设备可用后开始直播')
          }
          this.UPDATE_STATE({ micDisabled: true })
        }
      })
    },

    /** 播放本地视频 */
    playVideo(mute = true, cb) {
      let cemeraEl = document.getElementById('local_video_set')
      if (!cemeraEl) {
        cemeraEl = document.createElement('div')
        cemeraEl.id = 'local_video_set'
        document.querySelector('#video_set').insertBefore(cemeraEl, null)
      }
      // 本地流播放
      this.localStream.play(cemeraEl, {
        muted: mute
      }).then(() => {
        cb && cb()
      })
    },

    /** 打开回调 */
    onOpen() {
      this.localStream.stop()

      this.$nextTick(() => {
        if (this.enableCamera) {
          this.playVideo(!this.isMute)
        } else {
          // eslint-disable-next-line no-undef
          const videoStream = TRTC.createStream({
            audio: false,
            video: true
          })
          // 设置视频分辨率等参数
          videoStream.setVideoProfile('720p')
          videoStream.initialize().then(() => {
            // 增加视频通话
            this.localStream.addTrack(videoStream.getVideoTrack()).then(() => {
              console.log('开启新视频')
              this.playVideo(!this.isMute)
            })
          })
        }
      })
    },

    /** 关闭回调 */
    onClose() {
      this.localStream.stop()

      if (this.enableCamera) {
        let localVideoWrapEl = document.getElementById('local_video')
        if (!localVideoWrapEl) {
          localVideoWrapEl = document.createElement('div')
          localVideoWrapEl.id = 'local_video'
          document.querySelector('#video_wrap').insertBefore(localVideoWrapEl, null)
        }
        // 本地流播放
        this.localStream.play(localVideoWrapEl, {
          muted: true
        })
      } else {
        const videoTrack = this.localStream.getVideoTrack()
        if (videoTrack) {
          this.localStream.removeTrack(videoTrack).then(() => {
            console.log('关闭视频')
            // 关闭摄像头
            videoTrack.stop()
          })
        }
      }
    },

    /** 切换摄像头 */
    cemeraChange(value) {
      this.localStream.switchDevice('video', value).then(() => {
        this.$message.success('摄像头切换成功')
      })
    },

    /** 切换麦克风 */
    micChange(value) {
      this.localStream.switchDevice('audio', value).then(() => {
        this.$message.success('麦克风切换成功')
      })
    },

    closeStart() {
      this.startVisible = false
    },

    closeEnd() {
      // 保存人数
      this.saveLivePeople()
      this.endVisible = false
      this.$emit('leaveRoom')
    },

    /** 开始直播 */
    startLive() {
      if (this.micDisabled) {
        this.$message.error('系统未检测到麦克风设备，请至少保证麦克风设备可用后开始直播')
        return
      }
      const params = {
        id: this.currentRow.id,
        status: '2'
      }
      this.changeRTC({ params, callback: this.closeStart })
      this.saveHeartbeat()
    },

    /** 结束直播 */
    endLive() {
      const params = {
        id: this.currentRow.id,
        status: '3'
      }
      this.changeRTC({ params, callback: this.closeEnd })
      this.saveHeartbeat()
      this.setHeartbeat()
    }
  }
}
</script>

<style lang="scss" scoped>
.camera_btns{
  display: flex;
  border-bottom: 1px solid #eee;
  padding: 14px 20px;
  .cemera_switch{
    width: 130px;
    padding: 5px 15px;
  }
}
.camera_btns /deep/{
  // 危险按钮
  .el-button--danger {
    color: #fff;
    background-color: #F56C6C;
    border-color: #F56C6C;
    i{
      color: #fff;
    }
    &:hover, &:focus, &:active {
      background: #e5001c;
      border-color: #e5001c;
      i{
        color: #fff;
      }
    }
  }
  .el-button--danger.is-disabled,
  .el-button--danger.is-disabled:active,
  .el-button--danger.is-disabled:focus,
  .el-button--danger.is-disabled:hover{
    color: #fff;
    background-color: #fab6b6 !important;
    border-color: #fab6b6 !important;
  }
}

.cemera_content{
  height: 129px;
  margin: 14px 20px 0;
  background: #F0F2F5;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  img{
    height: 48px;
  }
}

.no_devices{
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  background: #FEF0F0;
  color: #F56C6C;
  z-index: 99;
  text-align: center;
  line-height: 32px;
}

.cemera_ctrl /deep/{
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  .el-button--text{
    color: #666;
  }
}
.cemera_ctrl span{
  color: #eee;
}
.btn_icon{
  height: 14px;
  vertical-align: bottom;
  margin-right: 4px;
}

// 设备设置
.set_box{
  display: flex;
  align-items: center;
  .devices_wrap{
    width: 280px;
  }
  .mic_select{
    margin-top: 20px;
  }
  .set_cemera{
    width: 230px;
    height: 129px;
    background: #F0F2F5;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    img{
      height: 48px;
    }
  }
}
</style>

<style lang="scss">
#local_video{
  width: 100%;
  height: 100%;
}

#local_video_set{
  width: 100%;
  height: 100%;
}
</style>
