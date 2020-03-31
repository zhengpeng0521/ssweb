<template>
  <!-- 弹出框 -->
  <el-dialog
    :before-close="handleClose"
    :visible.sync="centerDialogVisible"
    :close-on-click-modal="false"
    title="上传视频"
    width="600px"
    center
    @close="canlecle"
  >
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
      <el-form-item label="视频名称:" prop="name">
        <el-input v-model="ruleForm.name" placeholder="最多不超过30个字" maxlength="30" style="width:230px" />
      </el-form-item>
      <el-form-item label="视频描述:">
        <el-input
          v-model="ruleForm.desc"
          type="textarea"
          placeholder="最多不超过100个字"
          maxlength="100"
          style="width:420px;height:110px"
          show-word-limit
          class="wrpallD"
        />
      </el-form-item>
      <el-form-item label="上传视频:" prop="payvideo">
        <div class="word">支持上传视频格式：MP4</div>
        <div class="word">支持单个视频最大上传：400M</div>
        <el-button :disabled="disabled || (!!ruleForm.payvideo && ruleForm.payvideo !== '')" type="primary" class="btnright">
          选择上传文件
          <input
            id="file"
            :disabled="disabled || (!!ruleForm.payvideo && ruleForm.payvideo !== '')"
            name="file"
            type="file"
            accept="video/*"
            @change="changeVideo"
          >
        </el-button>
        <div v-if="shoflas" class="bigBox">
          <!-- <div @click="canle"> -->

          <Popover
            style="display:initial"
            placement="top"
            popper-class="cancel_upload_popover"
            trigger="click"
            @method="canle()"
          >
            <div>
              <i class="el-icon-warning" style="color:#fa0;font-size:16px;"/>
              <div v-if="urlup && urlup !== ''" style="display:inline-block;color:#666;font-size:12px;margin:4px 4px 16px;text-align:left;">确认是否删除视频？</div>
              <div v-else style="display:inline-block;color:#666;font-size:12px;margin:4px 4px 16px;text-align:left;">确认是否取消上传？</div>
            </div>
            <svg-icon slot="reference" icon-class="delete" style="width: 20px;height: 20px;color:#666666;float: right;margin-top: -10px;margin-right: 15px;" />

          </Popover>
          <!-- </div> -->
          <div v-if="shoflas" style="height: 96px;background-color: rgba(240,242,245,0.6);margin-top:5px;width:420px">

            <!-- <Confirm v-else :confirm="canle" has-slot>
            <svg-icon icon-class="delete" style="width: 20px;height: 20px;color:#666666;position: absolute;right: 33px;top: 82px;"/>
          </Confirm> -->

            <div class="upusl">
              <svg-icon icon-class="play" style="width: 20px;height: 20px;color: #46B6EE" />
              <span style="color:#333;margin-left: 5px">{{ movename }}</span>

            </div>
            <div class="upusl" style="height:11px;position:relative;margin-top:15px;">
              <span v-if="requenum !== 100">上传中</span>
              <span v-if="requenum !== 100" class="lines" />
              <span v-if="requenum !== 100" :style="{ width:lefty + 'px' }" class="activel" />
              <span v-if="requenum !== 100" class="progress">{{ requenum }}%</span>
              <span v-else style="color:#666666;font-size:14px">上传完成</span>
            </div>
            <!-- <div v-if="requenum < 100" style="color:rgba(48, 0, 0, 1);font-size:12px;margin-left:14px;">正在转码{{ requenum }}%,请勿关闭窗口</div> -->

            <div class="word" style="padding:10px 10px 0px 10px">{{ totalty }}M/{{ total }}M</div>
          </div>
        </div>
      </el-form-item>
      <video id="videotail" style="display:none" />
      <el-form-item label="上架状态:">
        <el-radio v-model="ruleForm.status" label="1">上架</el-radio>
        <el-radio v-model="ruleForm.status" label="2">下架</el-radio>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="canlecle()">取 消</el-button>
      <el-button :disabled="disabled" type="primary" @click="submitUpload('ruleForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import Popover from '@/components/CommonTable/popover'
import Confirm from '@/components/MiniCommon/Confirm'
import { MultiUpload } from '@/utils/upload'

export default {
  components: {
    Confirm,
    Popover
  },

  props: {
    getTable: {
      type: Function,
      required: true
    }
  },

  data() {
    return {
      mu: null,
      disabled: false,
      shoflas: false,
      jobId: '',
      urlup: '',
      tid: 99,
      oid: 99,
      chunkSize: 5 * 1024 * 1024,
      duration: '',
      requenum: 0,
      lefty: 0,
      total: '',
      centerDialogVisible: false,
      totalty: 0,
      fileList: [],
      movename: '',
      show: true,
      timer: null,
      ruleForm: {
        name: '',
        desc: '',
        payvideo: '',
        status: '1'
      },
      rules: {
        name: [{ required: true, message: '请输入课件名字', trigger: 'change' }],
        payvideo: [
          { required: true, message: '请上传课件视频', trigger: 'change' }
        ]
      }
    }
  },

  computed: {
    ...mapState('recorded', [
      'uploadLoading',
      'courseId',
      'currentItem',
      'wareInfo'
    ])
  },

  watch: {
    'ruleForm.payvideo'(newProp) {
      if (newProp && newProp !== '') {
        this.$refs.ruleForm.clearValidate(['payvideo'])
      }
    }
  },

  methods: {
    ...mapActions('recorded', [
      'addVideo'
    ]),

    changeVideo() {
      // console.log('00000000')
      const fileAll = document.getElementById('file')
      var file = fileAll.files[0]
      if (file.size / 1048576 > 400) {
        this.$message.error('只能上传小于400兆的视频')
        return
      }
      this.shoflas = true
      var url = null
      if (window.createObjectURL !== undefined) {
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) {
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) {
        url = window.webkitURL.createObjectURL(file)
      }
      var videos = document.getElementById('videotail')
      this.url = url
      this.videos = videos
      videos.src = url
      this.disabled = true
      videos.ondurationchange = () => {
        console.log('videos.readyState', videos.duration)
        if (videos.readyState > 0) {
          console.log(file)
          this.duration = videos.duration
          const mu = new MultiUpload({
            tid: this.tid,
            oid: this.oid,
            chunkSize: this.chunkSize,
            action: 'https://img.ishanshan.com/gimg/user/multi',
            axios: axios
          })
          this.mu = mu
          this.movename = file.name
          const nums = Math.round(file.size / 1048576 / 5)
          this.total = Math.floor((file.size / 1048576) * 100) / 100
          const numup = Math.round(100 / nums)
          this.timer = setInterval(() => {
            this.requenum += numup
            if (this.requenum >= 100) {
              this.requenum = 99
              this.lefty = 300 * 0.99
            }
            this.totalty = Math.floor(this.requenum * this.total) / 100
            this.lefty = 290 * (this.requenum / 100)
          }, 1000)
          mu.upload(file).then(res => {
            console.log(res, 'res')
            if (res && res.state === 'success') {
              this.disabled = false
              this.ruleForm.payvideo = res.url
              this.requenum = 100
              this.totalty = this.total
              this.lefty = 290
              this.urlup = res.url
              this.jobId = res.data.jobId

              // console.log('mu', mu)
              clearInterval(this.timer)
              // 避免上传相同的视频冲突
              fileAll.value = null
            } else {
              !!this.timer && clearInterval(this.timer)
              fileAll.value = null
              this.lefty = 0
              this.requenum = 0
              this.disabled = false
              this.ruleForm.payvideo = ''
              this.totalty = 0
            }
          }).catch(err => {
            console.log('upload取消上传', err)
            !!this.timer && clearInterval(this.timer)
            fileAll.value = null
            this.lefty = 0
            this.requenum = 0
            this.disabled = false
            this.ruleForm.payvideo = ''
            this.totalty = 0
          })
        }
      }
    },
    showDialog() {
      this.centerDialogVisible = true
    },
    handleClose() {
      this.centerDialogVisible = false
    },

    /** 回调 */
    refresh() {
      this.ruleForm = {
        name: '',
        desc: '',
        status: '1'
      }
      this.$refs.ruleForm.resetFields()
      this.centerDialogVisible = false
      this.getTable()
    },

    submitUpload() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const now = moment().format('YYYY-MM-DD HH:mm:ss')
          const params = {
            timeLenth: Number(this.duration.toFixed(2)),
            size: this.total, // 兆数
            url: this.urlup, // 视频连接
            uploadTime: now,
            name: this.ruleForm.name,
            desc: this.ruleForm.desc,
            status: this.ruleForm.status,
            cwId: this.courseId, // 课程id
            cwItemId: this.currentItem.id, // 课程章节id
            homePageUrl: this.wareInfo.homePageUrl, // 首页url地址
            jobId: this.jobId
          }
          console.log('params', params)
          this.addVideo({ params, refresh: this.refresh })
        } else {
          return false
        }
      })
    },
    // 取消
    canle() {
      this.shoflas = false
      this.lefty = 0
      this.requenum = 0
      this.disabled = false
      this.ruleForm.payvideo = ''
      this.totalty = 0
      clearInterval(this.timer)
      console.log('触发取消')
      // window.cancelAxios()
      this.mu.source.cancel('取消上传>>')
    },
    canlecle() {
      clearInterval(this.timer)
      console.log('直接关闭弹窗')
      // window.cancelAxios && window.cancelAxios()
      if (this.mu && this.mu.source) {
        this.mu.source.cancel('取消上传<<')
      }

      this.centerDialogVisible = false
      this.$refs.ruleForm.resetFields()
      this.shoflas = false
      this.lefty = 0
      this.requenum = 0
      this.totalty = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.wrpallD /deep/ .el-textarea__inner {
  height: 100%;
}
.upload-demo /deep/ .el-form-item__content {
  display: flex;
}
.bigBox{
    width: 442px;
    height: 128px;
}
.btnright {
  width: 110px;
  position: relative;
  #file {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}
.word {
  font-size: 12px;
  color: #999;
}
.lines {
  width: 290px;
  height: 4px;
  background: #cccccc;
  margin-left: 5px;
  margin-right: 5px;
}
.upusl {
  display: flex;
  align-items: center;
  width: 420px;
  padding: 0 10px;
  // justify-content: space-between;
}
.cnase {
  color: rgba(70, 182, 238, 1);
}
.cnase:hover {
  color: rgba(70, 182, 238, 0.7);
  cursor: pointer;
}
.activel {
  width: 20px;
  height: 4px;
  position: absolute;
  top: 3px;
  left: 56px;
  background: #46b6ee;
}
.progress{
  margin-left: 4px;
}

</style>

<style lang="scss">
.cancel_upload_popover{
  z-index: 5000 !important;
}
</style>
