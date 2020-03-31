<template>
  <div class="content_box">
    <div class="tabs">
      <div class="tab_item tab_active">课件模式</div>

      <!-- 倒计时 -->
      <VueCountdown v-if="liveStatus === 0" :time="countTime" :transform="transform" class="count_down">
        <div slot-scope="props" class="count_down_text">直播倒计时：{{ props.days }}天 {{ props.hours }}: {{ props.minutes }}: {{ props.seconds }}</div>
      </VueCountdown>
      <div v-else-if="liveStatus === 1" class="living"><i/>直播中</div>
      <div v-else-if="liveStatus === 2" class="live_end"><i/>已结束</div>
      <TimeCount v-if="liveStatus !== 0" ref="timeCount" />
    </div>
    <!-- 课件 -->
    <div class="content_area">
      <div v-show="fileInfoList && fileInfoList.length > 1 && (thumbUrls && thumbUrls.length> 0)" id="paint_box" class="real_content" />
      <div v-show="!(fileInfoList && fileInfoList.length > 1 && (thumbUrls && thumbUrls.length> 0))" class="real_content_null">请选择课件使用</div>
      <div v-if="thumbUrls && thumbUrls.length> 1" class="print_left" @click="preBoard"><i class="el-icon-arrow-left"/></div>
      <div v-if="thumbUrls && thumbUrls.length> 1" class="print_right" @click="nextBoard"><i class="el-icon-arrow-right"/></div>
    </div>
    <!-- 缩略图 -->
    <div v-if="thumbUrls && thumbUrls.length> 0" class="preview_box">
      <ul id="scroll_move" class="preview_list">
        <li v-for="(item, index) in thumbUrls" :key="'pic'+index" class="scroll_item">
          <div :style="boardData.current === index + 1 ? {borderColor: '#46B6EE'} : {}">
            <img :src="item" alt="缩略图" @click="() => onThumbClick(index)">
          </div>
          <p class="preview_index">{{ index+1 }}</p>
        </li>
      </ul>
      <div class="preview_left" @click="preBoard"><i class="el-icon-arrow-left"/></div>
      <div class="preview_right" @click="nextBoard"><i class="el-icon-arrow-right"/></div>
    </div>
    <!-- 缩略图空数据 -->
    <div v-else class="preview_box_null">请选择课件使用</div>

    <div class="copyright">
      <p><img src="http://img.ishanshan.com/gimg/n/20200213/f1c105c330e1e81786bec5416265f71b" alt="logo">闪宝科技提供技术支持</p>
      <p>www.ishanshan.com</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import VueCountdown from '@chenfengyuan/vue-countdown'
import TimeCount from './TimeCount'

export default {
  components: {
    VueCountdown,
    TimeCount
  },

  props: {
    thumbUrls: {
      type: null,
      required: true
    },
    teduBoard: {
      type: null,
      required: true
    },
    boardData: {
      type: null,
      required: true
    },
    fileInfoList: {
      type: null,
      required: true
    }
  },

  data() {
    return {
      transform(props) {
        Object.entries(props).forEach(([key, value]) => {
        // Adds leading zero
          const digits = value < 10 ? `0${value}` : value

          props[key] = `${digits}`
        })

        return props
      }
    }
  },

  computed: {
    ...mapState('liveLesson', [
      'currentRow',
      'liveStatus'
    ]),

    countTime() {
      const startTime = this.currentRow.startTime
      const time = moment(startTime).valueOf() - moment().valueOf()
      if (time > 0) {
        return time
      } else {
        return 0
      }
    }
  },

  watch: {
    liveStatus(newProp) {
      this.$nextTick(() => {
        if (newProp === 1) {
          this.$refs.timeCount.start()
        } else if (newProp === 2) {
          this.$refs.timeCount.stop()
        }
      })
    }
  },

  mounted() {
    if (this.liveStatus === 1) {
      this.$refs.timeCount.start()
    }
  },

  methods: {

    /** 切换缩略图 */
    onThumbClick(index) {
      const fileId = this.teduBoard.getCurrentFile()
      const boardList = this.teduBoard.getFileBoardList(fileId)
      const boardId = boardList[index]
      this.teduBoard.gotoBoard(boardId)
    },

    /** 向前翻页 */
    preBoard() {
      this.teduBoard.prevBoard()
    },

    /** 向后翻页 */
    nextBoard() {
      this.teduBoard.nextBoard()
    }
  }
}
</script>

<style lang="scss" scoped>
.content_box{
  height: 100%;
  padding: 20px 20px 0;
  background: #F6F7F9;
  position: relative;
}

.tabs{
  display: flex;
  position: relative;
  .count_down{
    position: absolute;
    right: 0;
    top: 12px;
  }
  .count_down_text{
    color: #46B6EE;
  }
  .living{
    position: absolute;
    right: 65px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    i{
      display: block;
      width: 8px;
      height: 8px;
      background: #67C23A;
      border-radius: 50%;
      margin-right: 6px;
    }
  }
  .live_end{
    position: absolute;
    right: 65px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    i{
      display: block;
      width: 8px;
      height: 8px;
      background: #F56C6C;
      border-radius: 50%;
      margin-right: 6px;
    }
  }
}

.tab_item{
  width: 105px;
  line-height: 35px;
  background: #EBEDF0;
  border: 1px solid #eee;
  text-align: center;
  color: #999;
  border-top-left-radius: 5px;
  border-top-right-radius: 15px 37px;
}
.tab_active{
  background: #fff;
  color: #1D9DF2;
}

.content_area{
  position: relative;
  width: 100%;
  height: calc(100vh - 352px);
  background: rgba(0, 0, 0, 0.8);
  overflow: hidden;
  box-sizing: border-box;
  .print_left{
    display: none;
    position: absolute;
    width:40px;
    height:90px;
    background: rgba(0, 0, 0, 0.3);
    border-radius:0px 5px 5px 0px;
    color: #fff;
    font-size: 40px;
    line-height: 90px;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  .print_right{
    display: none;
    position: absolute;
    width:40px;
    height:90px;
    background: rgba(0, 0, 0, 0.3);
    border-radius:5px 0px 0px 5px;
    color: #fff;
    font-size: 40px;
    line-height: 90px;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  &:hover{
    .print_left, .print_right{
      display: block;
    }
  }
  .real_content{
    height: 100%;
  }
  .real_content_null{
    height: 100%;
    color: #fff;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.preview_box_null{
  height: 130px;
  background: #fff;
  box-sizing: border-box;
  position: relative;
  text-align: center;
  line-height: 130px;
  color: #999;
}
.preview_box{
  height: 130px;
  padding: 14px 56px;
  background: #fff;
  box-sizing: border-box;
  position: relative;
  .preview_left{
    font-size: 40px;
    color: #666;
    position: absolute;
    left: 10px;
    top: 36px;
  }
  .preview_right{
    font-size: 40px;
    color: #666;
    position: absolute;
    right: 10px;
    top: 36px;
  }
}
.preview_list{
  width: calc(100vw - 700px);
  overflow: auto;
  display: flex;
  li{
    text-align: center;
    flex: 0 0 145px;
    div{
      height: 82px;
      background: rgba(0, 0, 0, 0.8);
      border: 2px solid #fff;
    }
    img{
      height: 78px;
    }
    &+li{
      margin-left: 10px;
    }
  }
  .preview_index{
    color: #999;
  }
}

.copyright{
  position: absolute;
  bottom: 10px;
  width: calc(100% - 40px);
  text-align: center;
  p{
    font-size: 12px;
    color: #999;
    margin-bottom: 4px;
    &:last-child{
      font-size: 10px;
    }
  }
}
</style>
