<template>
  <div
    v-loading="wareLoading"
    element-loading-text="拼命加载中"
  >
    <h3 class="ware_title">课件</h3>
    <div class="ware_tip">
      <p><el-button type="text" class="ware_refresh" @click="refreshUpload">刷新</el-button>查看课件最新状态</p>
      <p v-show="addInfo.title" class="ware_warn">文件正在上传中，请勿关闭窗口</p>
      <p v-show="!addInfo.title" class="ware_no_upload"/>
    </div>
    <ul class="ware_list">
      <li v-if="addInfo.uploading" class="ware_item">
        <img :src="uploadType" alt="文件">
        <div>
          <p class="file_name">{{ addInfo.title }}</p>
          <p class="file_info">
            <span v-if="addInfo.status === 'upload'" class="file_uploading">上传中{{ addInfo.progress || '0' }}%</span>
            <span v-else class="file_uploading">转码中{{ addInfo.progress || '0' }}%</span>
          </p>
        </div>
        <el-button type="primary" class="file_btn" disabled>使用</el-button>
        <!-- <Confirm :confirm="() => {}" has-slot class="file_close_box" content="确认是否删除该课件?">
          <div class="file_close">
            <i class="el-icon-close"/>
          </div>
        </Confirm> -->
      </li>
      <!-- 已转码列表 -->
      <li v-for="(file, index) in newFileList" :key="'file'+index" class="ware_item">
        <img :src="fileType(file)" alt="文件">
        <div>
          <p class="file_name">{{ file.title }}</p>
          <p class="file_info">
            <span v-if="currentFileId === file.fid" class="file_using">使用中</span>
            <i v-else class="file_not_use" />
          </p>
        </div>
        <el-button
          v-if="currentFileId === file.fid"
          type="primary"
          class="file_btn"
          @click="() => switchFile('#DEFAULT')">取消使用</el-button>
        <el-button
          v-else
          type="primary"
          class="file_btn"
          @click="() => switchFile(file.fid)">使用</el-button>
        <Confirm :confirm="() => deleteFile(file.fid)" has-slot class="file_close_box" content="确认是否删除该课件?">
          <div class="file_close">
            <i class="el-icon-close"/>
          </div>
        </Confirm>
      </li>
    </ul>
    <div class="ware_btn">
      <el-button :loading="uploadLoading" type="primary" class="ware_add" @click="addFile">添加课件</el-button>
      <input
        id="file_input"
        ref="fileInput"
        style="display:none;"
        type="file"
        accept="image/*, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.ms-powerpoint, application/vnd.ms-excel"
        @change="uploadFile"
      >
      <p class="upload_tip">支持上传pdf，ppt，word格式文件</p>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
import { mapState, mapMutations } from 'vuex'
import Confirm from '@/components/MiniCommon/Confirm'

export default {
  components: {
    Confirm
  },

  props: {
    // 白板实例
    teduBoard: {
      type: null,
      required: true
    },
    wareLoading: {
      type: Boolean,
      required: true
    },
    // 文件列表
    fileInfoList: {
      type: null,
      required: true
    },
    currentFileId: {
      type: null,
      required: true
    }
  },

  data() {
    return {
      pTime: null
    }
  },

  computed: {
    ...mapState('liveLesson', [
      'uploadLoading',
      'addInfo'
    ]),

    // 去掉default
    newFileList() {
      const newList = []
      this.fileInfoList && this.fileInfoList.forEach(item => {
        if (item.fid !== '#DEFAULT') {
          newList.push({
            ...item
          })
        }
      })
      console.log('可见列表-----', newList)
      return newList
    },

    /** 文件类型 */
    uploadType() {
      const title = this.addInfo.title
      let src = 'https://img.ishanshan.com/gimg/n/20200213/77d7c472cdc5d0afe86e7fb61bfcb38b'
      if (title.indexOf('.jpg') > -1 || title.indexOf('.jpeg') > -1) {
        src = 'https://img.ishanshan.com/gimg/n/20200219/8372e62751f88e0255b9014f91876c0e'
      } else if (title.indexOf('.png') > -1) {
        src = 'https://img.ishanshan.com/gimg/n/20200219/170ffa31499bbd419966ea6a2927ccb7'
      } else if (title.indexOf('.pdf') > -1) {
        src = 'https://img.ishanshan.com/gimg/n/20200219/c42befbc5ce4057a3f34a2d6b00bfef4'
      } else if (title.indexOf('.doc') > -1) {
        src = 'https://img.ishanshan.com/gimg/n/20200224/16e4fffb4fc128c4504de918cd2da693'
      }

      return src
    }
  },

  methods: {
    ...mapMutations('liveLesson', [
      'UPDATE_STATE'
    ]),

    /** 文件类型 */
    fileType(file) {
      let src = 'https://img.ishanshan.com/gimg/n/20200213/77d7c472cdc5d0afe86e7fb61bfcb38b'
      if (file.type === 'image/jpeg') {
        src = 'https://img.ishanshan.com/gimg/n/20200219/8372e62751f88e0255b9014f91876c0e'
      } else if (file.type === 'image/png') {
        src = 'https://img.ishanshan.com/gimg/n/20200219/170ffa31499bbd419966ea6a2927ccb7'
      } else if (file.title.indexOf('.pdf') > -1) {
        src = 'https://img.ishanshan.com/gimg/n/20200219/c42befbc5ce4057a3f34a2d6b00bfef4'
      } else if (file.title.indexOf('.doc') > -1) {
        src = 'https://img.ishanshan.com/gimg/n/20200224/16e4fffb4fc128c4504de918cd2da693'
      }

      return src
    },

    /** 刷新进度 */
    refreshUpload() {
      if (this.addInfo.taskId) {
        this.$message.success('刷新成功')
        this.teduBoard.getFileTranscodeProgress({ taskId: this.addInfo.taskId })
      } else if (this.addInfo.title) {
        this.$message.success('刷新成功')
      } else {
        this.$message.warning('当前没有文件上传')
      }
    },

    /** 触发上传 */
    addFile() {
      this.$refs.fileInput.click()
    },

    /**
     * 上传文件
     */
    uploadFile(e) {
      // 超过10个报错
      if (this.newFileList && this.newFileList.length >= 10) {
        this.$message.error('文件上传最多不超过10个，请删除部分文件后再试')
        return
      }

      const file = e.target.files[0]
      // this.UPDATE_STATE({
      //   uploadLoading: true,
      //   addInfo: { title: file.name, uploading: true, status: 'upload', progress: 0 }
      // })

      if (/\.(bmp|jpg|jpeg|png|gif|webp|svg|psd|ai)/i.test(file.name)) {
        console.log(file, 'img-----------------') // 图片需要白板功能
        this.$message.error('请上传ppt或pdf或word文件')
        // const that = this
        // const data = new FormData()
        // data.append('file', file)
        // axios.post('https://imgsrc.ishanshan.com/gimg/upload', data, {
        //   headers: {
        //     'Content-Type': 'multipart/form-data'
        //   }
        // }).then(res => {
        //   console.log(res)
        //   const url = res.data.url
        //   that.teduBoard.addBoard(url)
        // }).catch(err => {
        //   console.log(err)
        //   that.$message.error('上传失败')
        // })
      } else {
        this.UPDATE_STATE({
          uploadLoading: true,
          addInfo: { title: file.name, uploading: true, status: 'upload', progress: 0 }
        })

        this.teduBoard.applyFileTranscode({
          data: file,
          userData: 'transcode'
        }, {
          minResolution: '960x540',
          isStaticPPT: false,
          thumbnailResolution: '200x200'
        })

        // 假进度
        this.pTime = setInterval(() => {
          const progress = this.addInfo.progress + 1
          console.log('假进度', progress)
          this.UPDATE_STATE({ addInfo: { ...this.addInfo, progress: progress }})
          if (progress >= 99) {
            clearInterval(this.pTime)
          }
        }, 50)
      }
    },

    /** 切换展示文件 */
    switchFile(fid) {
      this.UPDATE_STATE({ showFileId: fid })
      this.teduBoard.switchFile(fid)
    },

    /** 删除文件 */
    deleteFile(fid) {
      // 删除会跳转默认白板，无法停留在原先文件
      if (fid === this.currentFileId && this.fileInfoList.length > 1) {
        this.UPDATE_STATE({ showFileId: this.fileInfoList[1].fid })
      } else {
        this.UPDATE_STATE({ showFileId: this.fileInfoList[0].fid })
      }
      this.teduBoard.deleteFile(fid)
    }
  }
}
</script>

<style lang="scss" scoped>
.ware_title{
  background: #F8F8F8;
  text-align: center;
  line-height: 40px;
  font-size: 16px;
  color: #333;
}

.ware_tip{
  text-align: center;
  padding: 20px 0;
  p{
    color: #666;
  }
  .ware_warn{
    color: #F56C6C;
    font-size: 12px;
    margin-top: 4px;
  }
  .ware_refresh{
    color: #46b6ee;
  }
  .ware_no_upload{
    height: 18px;
  }
}

.ware_list{
  padding: 0 20px;
  height: calc(100vh - 494px);
  overflow: auto;
  li+li{
    margin-top: 14px;
  }
}
.ware_item{
  height: 66px;
  border-radius:5px;
  padding: 10px;
  background: #F6F7F9;
  display: flex;
  align-items: center;
  position: relative;
  img{
    height: 32px;
    margin-right: 12px;
  }
  .file_name{
    color: #333;
    margin-bottom: 10px;
    width: 150px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .file_info{
    font-size: 12px;
    color: #999;
  }
  .file_btn{
    position: absolute;
    bottom: 10px;
    right: 10px;
    font-size: 12px;
    padding: 4px 10px;
    height: 22px;
  }
  .file_close_box{
    position: absolute;
    right: 10px;
    top: 5px;
  }
  .file_close{
    width: 16px;
    height: 16px;
    border-radius: 50%;
    text-align: center;
    i{
      font-size: 10px;
    }
    &:hover{
      background: #E1E2E6;
    }
  }
}

.file_uploading{
  color: #F56C6C;
}
.file_using{
  color: #67C23A;
}
.file_not_use{
  display: block;
  width: 36px;
  height: 14px;
}

.ware_btn{
  border-top: 1px solid #eee;
  padding: 14px 20px;
  position: relative;
  .ware_add{
    width: 100%;
    height: 36px;
    padding: 11px 15px;
  }
  .upload_tip{
    margin-top: 6px;
    font-size: 12px;
    text-align: center;
    color: #666;
  }
}
</style>
