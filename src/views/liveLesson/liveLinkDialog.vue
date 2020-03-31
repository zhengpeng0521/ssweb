<template>
  <div class="bigBox">
    <el-dialog
      :visible.sync="liveLinkDialogShow"
      :close-on-click-modal="false"
      title="生成分享海报"
      width="500px"
      @close="cancelDialog()"
    >
      <div >
        <div class="imgBox">
          <div class="logoPic">
            <img
              :src="codeImg"
              style="width:100%;height:100%;"
            >
          </div>
          <div class="livename">{{ name }}</div>
          <div class="time">{{ startDate }}</div>
          <div class="time">直播老师：{{ liveTeacher }}</div>
          <div class="erweima">
            <qrcode
              id="qrCode"
              ref="qrCode"
              :value="link"
              :options="{ size: 30 }"
              style="transform: scale(1.0);height:40px;width:40px;"
            />
          </div>

        </div>
        <div class="box">
          <div id="imgbox" class="Bimg">
            <div class="logoPic">
              <img
                :src="codeImg"
                style="width:100%;height:100%;"
              >
            </div>
            <div class="livename">{{ name }}</div>
            <div class="time">{{ startDate }}</div>
            <div class="time">直播老师：{{ liveTeacher }}</div>
            <div class="erweima">
              <qrcode
                id="qrCode"
                ref="qrCode"
                :value="link"
                :options="{ size: 90 }"
                style="transform: scale(1.0);"
              />
            </div>
          </div>
        </div>
        <div class="openImg">
          <el-button
            plain
            class="cancel_btn"
            @click="openLook"
          >放大查看</el-button>

          <el-button
            plain
            @click="genImg()"
          >下载图片</el-button>
        </div>
      </div>
      <div class="footer">
        <span>直播间链接：</span>
        <el-input
          ref="url"
          v-model="message"
          :readonly="true"
          type="textarea"
          disabled
          style="width:280px;margin-right:5px;max-height: 93px;"
        />

        <el-button
          v-clipboard:copy="message"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          plain
        >复制</el-button>

      </div>
      <div v-if="isShow" class="footer">
        <span>直播邀请码：</span>
        <el-input
          ref="url"
          v-model="inviteCode"
          :readonly="true"
          disabled
          style="width:280px;margin-right:5px;"
        />

        <el-button
          v-clipboard:copy="inviteCode"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
          plain
        >复制</el-button>

      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >

        <el-button
          type="primary"
          @click="cancelDialog()"
        >关 闭</el-button>
      </span>
    </el-dialog>
    <div class="dialog">
      <el-dialog
        :visible.sync="imgDialogShow"
        class="imgDialog"
      >
        <div>
          <div class="BimgBox">
            <div class="logoPic">
              <img
                :src="codeImg"
                style="width:100%;height:100%;"
              >
            </div>
            <div class="livename">{{ name }}</div>
            <div class="time">{{ startDate }}</div>
            <div class="time">直播老师：{{ liveTeacher }}</div>
            <div class="erweima">
              <qrcode
                id="qrCode"
                ref="qrCode"
                :value="link"
                :options="{ size: 30 }"
                style="transform: scale(1.0);height:40px;width:40px;"
              />
            </div>
          </div>
      </div></el-dialog>
    </div>
  </div>
</template>

<script>

import moment from 'moment'
import Vue from 'vue'
// import qrcode from 'vue_qrcodes'
import qrcode from '@chenfengyuan/vue-qrcode'
Vue.component(qrcode.name, qrcode)
// 复制插件
import html2canvas from 'html2canvas'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

export default {
  components: {
    qrcode
  },
  props: {
    // addTeacherRow: {
    //   type: Function,
    //   default: undefined
    // }
  },
  data() {
    return {
      liveLinkDialogShow: false,
      isShow: false,
      message: '',
      inviteCode: '',
      link: '',
      name: '',
      codeImg: '',
      startDate: '',
      startTime: '',
      liveTeacher: '',
      imgDialogShow: false,
      bigSrc: ''
    }
  },
  mounted() {

  },
  methods: {

    /* 显示弹框 */
    showDialog(row) {
      console.log('row', row)
      this.codeImg = row.homePageUrl
      this.name = row.liveName
      if (row.type === '2') {
        this.isShow = true
        this.inviteCode = row.inviteCode
      } else {
        this.isShow = false
      }
      // const data1 = row.liveDate.substring(0, 10)
      // const time1 = row.startTime
      // var arr = [data1, time1]
      // var data2 = arr.join(' ')
      // this.startTime = data2
      this.startDate = moment(row.startTime).format('llll')
      this.liveTeacher = row.tname
      this.link = `https://ed.ishanshan.com/liveweb/mobile.html?id=${row.id}`
      this.message = `在吗，${row.tname}老师邀请你进入TA的直播间，等你呦https://ed.ishanshan.com/liveweb/mobile.html?id=${row.id}`
      // this.message = `在吗，${row.tname}老师邀请你进入TA的直播间，等你呦https://livetest.ishanshan.com/mobile.html?id=${row.id}`
      this.liveLinkDialogShow = true
      // this.genImg()
      // this.genEwm()
    },
    /* 关闭弹框 */
    cancelDialog() {
      this.liveLinkDialogShow = false
    },
    save() {
      this.liveLinkDialogShow = false
    //   this.$emit('addTeacherRow', this.teacherInfo)
    //   this.addTeacherRow(this.teacherInfo)
    },

    // 生成海报
    genImg() {
      const course_print = document.getElementById(
        'imgbox'
      )
      var w = course_print.offsetWidth
      var h = course_print.offsetHeight
      // 要将 canvas 的宽高设置成容器宽高的 2 倍
      var canvas = document.createElement('canvas')
      canvas.width = w * 3
      canvas.height = h * 3
      canvas.style.width = w * 3 + 'px'
      canvas.style.height = h * 3 + 'px'
      var context = canvas.getContext('2d')
      // 然后将画布缩放，将图像放大两倍画到画布上
      context.scale(3, 3)

      html2canvas(course_print, {
        useCORS: true,
        logging: true,
        canvas
      }).then(function(canvas) {
        const image_data = canvas.toDataURL('image/png')
        var a = document.createElement('a')
        var event = new MouseEvent('click')
        a.download = '直播海报' || 'photo'
        a.href = image_data
        a.dispatchEvent(event)
      })
    },
    // genBigImg() {
    //   const course_print = document.getElementById(
    //     'imgbox'
    //   )
    //   var w = course_print.offsetWidth
    //   var h = course_print.offsetHeight
    //   // 要将 canvas 的宽高设置成容器宽高的 2 倍
    //   var canvas = document.createElement('canvas')
    //   canvas.width = w * 6
    //   canvas.height = h * 6
    //   canvas.style.width = w * 6 + 'px'
    //   canvas.style.height = h * 6 + 'px'
    //   var context = canvas.getContext('2d')
    //   // 然后将画布缩放，将图像放大两倍画到画布上
    //   context.scale(6, 6)

    //   html2canvas(course_print, {
    //     useCORS: true,
    //     logging: true,
    //     canvas
    //   }).then(function(canvas) {
    //     const image_data = canvas.toDataURL('image/png')
    //     this.bigSrc = image_data
    //     // var a = document.createElement('a')
    //     // var event = new MouseEvent('click')
    //     // a.download = '直播海报' || 'photo'
    //     // a.href = image_data
    //     // a.dispatchEvent(event)
    //   })
    // },

    // 生成二维码
    // genEwm() {
    //   var oQrcode = document.querySelector('#qrCode')
    //   var imgSrc = oQrcode.toDataURL('image/png')
    //   var a = document.createElement('a')
    //   var event = new MouseEvent('click')
    //   // 下载图名字
    //   a.download = '二维码文件'
    //   // url
    //   a.href = imgSrc
    //   // 合成函数，执行下载
    //   // a.dispatchEvent(event)
    // },

    onCopy: function(e) {
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    },
    onError: function(e) {
      this.$message.error('复制失败')
    },
    openLook() {
      this.imgDialogShow = true
    }
    // downloadCodeImg() {
    //   var image = new Image()
    //   image.setAttribute('crossOrigin', 'anonymous')
    //   image.onload = function() {
    //     var canvas = document.createElement('canvas')
    //     canvas.width = image.width
    //     canvas.height = image.height
    //     var context = canvas.getContext('2d')
    //     context.drawImage(image, 0, 0, image.width, image.height)
    //     var url = canvas.toDataURL('image/png')
    //     var a = document.createElement('a')
    //     var event = new MouseEvent('click')
    //     a.download = '直播海报' || 'photo'
    //     a.href = url
    //     a.dispatchEvent(event)
    //   }

    //   image.src = this.codeImg
    // }

  }
}
</script>

<style lang="scss" scoped>
.bigBox /deep/{
  .el-dialog__body{
    max-height: 600px;
  }
}

.BimgBox{
    height: 700px;
    width: 400px;
    background: url('http://img.ishanshan.com/gimg/n/20200225/0940cdfd6bdde0409b2099859b903f74') no-repeat;
    // text-align: center;
    background-size: 100%;
    margin: 0 auto;
    margin-bottom: 15px;
    position: relative;
    padding: 10px;
    .logoPic{
             width: 300px;
            height: 200px;
            margin-top: 40px;
            margin-left: 40px;
            margin-bottom: 10px;
      }
       .livename{
        font-size: 22px;
        font-weight:500;
        color:rgba(51,51,51,1);
        margin-bottom: 10px;
        margin-top: 5px;
        padding: 0 20px;
        height: 48px;
      }
        .time{
          font-size: 16px;
          color: #999999;
          float: right;
          margin-right: 20px;
          margin-bottom: 10px;
          padding-left: 30px
        }
        .erweima /deep/{
         width: 140px;
        height: 140px;
        padding-top: 3px;
        /* text-align: center; */
        padding-left: 3px;
        margin-top: 75px;
        margin-left: 230px;
          canvas{
            width: 130px !important;
            height: 130px !important;
          }
        }

     }
.Bimg{
  height: 1206px;
    width: 750px;
    background: url('http://img.ishanshan.com/gimg/n/20200225/0940cdfd6bdde0409b2099859b903f74') no-repeat;
    // text-align: center;
    background-size: 100%;
    margin: 0 auto;
    margin-bottom: 15px;
    position: relative;
    padding: 30px;
    .logoPic{
             width: 628px;
            height: 354px;
            margin-top: 60px;
            margin-left: 30px;
            margin-bottom: 20px
      }
       .livename{
        font-size: 36px;
        font-weight:500;
        color:rgba(51,51,51,1);
        margin-bottom: 40px;
        // margin-top: 5px;
        padding: 0 30px;
        height: 48px;
      }
        .time{
          font-size: 24px;
          color: #999999;
          float: right;
          margin-right: 30px;
          margin-bottom: 20px;
          padding-left: 100px
        }
        .erweima /deep/{
          width: 220px;
          height: 220px;
          text-align: center;
          padding-left: 4px;
          margin-top: 225px;
          margin-left: 450px;
          canvas{
            width: 220px !important;
            height: 220px !important;
          }
        }
     }
    .box{
      opacity: 0;
      overflow: hidden;
      max-height: 1px;
     }
.imgBox{
  height: 353px;
    width: 220px;
    background: url('http://img.ishanshan.com/gimg/n/20200225/0940cdfd6bdde0409b2099859b903f74') no-repeat;
    // text-align: center;
    background-size: 100%;
    margin: 0 auto;
    margin-bottom: 15px;
    position: relative;
    padding: 10px;
    .logoPic{
             width: 186px;
            height: 105px;
            margin-top: 20px;
            margin-left: 8px;
            margin-bottom: 5px;
      }
       .livename{
        font-size: 11px;
        font-weight:550;
        color:rgba(51,51,51,1);
        margin-bottom: 5px;
        margin-top: 5px;
        padding: 0 10px;
        height: 24px;
      }
        .time{
          font-size: 7px;
          color: #999999;
          float:right;
          margin-right: 5px;
          margin-bottom: 5px;
        }
        .erweima /deep/{
          width: 75px;
          height: 75px;
          padding-top: 3px;
          /* text-align: center; */
          padding-left: 3px;
          // background: #ffffff;
          margin-top: 46px;
          margin-left: 120px;
          canvas{
            width: 70px !important;
            height: 70px !important;
          }
        }

     }
.openImg{
  text-align: center;
  margin-bottom: 15px;
}
.footer /deep/{
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  textarea{
    max-height: 93px;
    min-height: 93px !important;
  }
}

// .imgDialog  /deep/{
// .el-dialog {
//   width: 800px !important;
//   // height: 496px;
// //   display: flex;
// //   justify-content: center;
// }
// }
.dialog /deep/{
  .el-dialog__header{
    padding: 20px;
  }
  .el-dialog__headerbtn{
  top: 12px;
  }
}
</style>

