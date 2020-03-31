<template>
  <div class="teachComment">
    <el-dialog
      :visible.sync="dialogVisible"
      :title="title"
      width="600px"
      @close="resetForm"
    >
      <div>
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          label-width="90px"
        >
          <el-form-item label="课堂内容：">
            <el-input
              v-model="ruleForm.content"
              :autosize="{ minRows: 1, maxRows: 10}"
              type="textarea"
              maxlength="1500"
              placeholder="请填写课堂内容及课后作业（限1500字）"
            />
          </el-form-item>
          <!-- <el-form-item label="课后作业：">
            <el-input
              v-model="ruleForm.homework"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请填写老师点评（限300字）"
              type="textarea"
            />
          </el-form-item> -->
          <el-form-item label="课堂展示：">
            <div class="uoloads">
              <el-upload
                ref="imgVideo"
                :class="{'disabled ': imgVisible}"
                :on-preview="handlePreview"
                :on-success="handleSuccess"
                :on-remove="handleRemove"
                :before-upload="beforeAvatarUpload"
                :limit="9"
                :file-list="fileList"
                :data="sendD"
                action="https://img.ishanshan.com/gimg/user/upload"
                list-type="picture-card"
              >
                <i class="el-icon-plus" />
                <span>上传</span>
              </el-upload>
            </div>
            <div style="color:rgb(70,182,238);font-size:12px">最多9张(支持png、jpg、jpeg、gif格式的图片，不大于5M。支持mp4格式的视频，不大于50M)</div>
          </el-form-item>
        </el-form>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="resetForm"
        >取消</el-button>
        <el-button
          type="primary"
          @click="saveForm"
        >保存</el-button>
      </span>
    </el-dialog>
    <!-- 查看图片轮播详情 -->
    <Imgpreview v-if="dialogVisibles" :list="listALL" @message="hiDcloe"/>
  </div>
</template>
<script>
import { cpContentUpdate } from '@/api/teachManage/homeSchoolConnect'
import { Loading } from 'element-ui'
import Imgpreview from '@/components/ImgPreview/imgpre'
export default {
  components: {
    Imgpreview
  },
  data() {
    return {
      listALL: {},
      windowH: '',
      dialogVisible: false,
      title: '',
      ruleForm: {
        content: '', // 课堂内容
        homework: '', // 课后作业
        classImg: [] // 上课图片
      },
      classImgVisible: false,
      imgVisible: false,
      fileList: [], // 图片显示列表
      rowInfo: {},
      dialogVisibles: false,
      sendD: { oid: this.$store.getters.orgId, tid: this.$store.getters.tenantId },
      showN: true, // 切换视频图片
      imgSame: []
    }
  },
  mounted() {
    this.windowH = document.body.clientHeight + 'px'
  },
  methods: {
    hiDcloe(val) {
      this.dialogVisibles = val
    },
    show(row) {
      this.rowInfo = row
      this.dialogVisible = true
      this.ruleForm.content = row.content
      // this.ruleForm.homework = row.homework
      this.fileList = []
      this.imgSame = row.picList
      if (row.picList && row.picList.length > 0) {
        row.picList.map((item, index) => {
          const obj = {
            url: item,
            response: { url: item }
          }
          this.fileList.push(obj)
          if (this.fileList && this.fileList.length === 9) {
            this.imgVisible = true
          }
          if (item.indexOf('mp4') !== -1) {
            setTimeout(() => {
              const liIMG = this.$refs.imgVideo.$children[0].$el.childNodes
              liIMG[index].children[0].remove()
              const video = document.createElement('video')
              video.src = item
              video.className = 'el-upload-list__item-thumbnail'
              video.style.objectFit = 'cover'
              video.style.height = 100 + '%'
              liIMG[index].insertBefore(video, liIMG[index].children[0])
            }, 1800)
          } else {
            setTimeout(() => {
              const liIMG = this.$refs.imgVideo.$children[0].$el.childNodes
              if (liIMG[index].children[0].height < 88) {
                liIMG[index].children[0].style.height = 100 + '%'
              }
            }, 500)
          }
        })
      }
      this.title = row.title
    },
    // onChange(file, fileList) {
    //   const newFileList = []
    //   if (file.status == 'success') { //eslint-disable-line
    //     if (fileList && fileList.length > 0) {
    //       fileList.map(item => {
    //         if (item.response) {
    //           const obj = {
    //             url: item.response.url,
    //             status: 'success'
    //           }
    //           newFileList.push(obj)
    //         } else {
    //           newFileList.push(item)
    //         }
    //       })
    //     }
    //     this.ruleForm.classImg = newFileList
    //     if (fileList.length === 3) {
    //       this.imgVisible = true
    //     }
    //   }
    // },
    handleRemove(file, fileList) {
      // const newFileList = []
      if (file.status == 'success') { //eslint-disable-line
        // if (fileList && fileList.length > 0) {
        //   fileList.map((item, index) => {
        //     if (item.response) {
        //       const obj = {
        //         url: item.response.url,
        //         status: 'success'
        //       }
        //       newFileList.push(obj)
        //     } else {
        //       newFileList.push(item)
        //     }
        //   })
        // }
        this.imgSame.map((val, index) => {
          if (val === file.url) {
            this.imgSame.splice(index, 1)
          }
        })
        if (this.imgSame.length < 9) {
          this.imgVisible = false
        }
        // this.ruleForm.classImg = newFileList
        // if (fileList.length < 3) {
        //   this.imgVisible = false
        // } else {
        //   this.imgVisible = true
        // }
      }
      // 解决视频和图片混搭删除bug
      setTimeout(() => {
        this.changeV(fileList)
      }, 1500)
    },
    beforeAvatarUpload(file) {
      const typeAll = file.type.split('/')
      if (typeAll[0] === 'video') {
        // 视频
        const isLt80M = file.size / 1024 / 1024 < 50
        if (['video/mp4'].indexOf(file.type) === -1) {
          this.$message.error('上传的视频只能是mp4格式!')
          return false
        }
        if (!isLt80M) {
          this.$message.error('上传视频大小不能超过50MB哦!')
          return false
        }
      } else {
        // 图片
        // const isAccept = 'image/jpeg' || 'image/jpg' || 'image/png' || 'image/gif'
        const isLt10M = file.size / 1024 / 1024 < 5
        if (['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].indexOf(file.type) === -1) {
          this.$message.error('上传的图片只能是 png、jpg、jpeg、gif格式的图片!')
          return false
        }
        if (!isLt10M) {
          this.$message.error('上传的图片大小不能超过5MB!')
          return false
        }
      }
      Loading.service({ lock: true, text: '上传中', background: 'rgba(0, 0, 0, .6)' })
    },
    changeV(fileList) {
      const liIMG = this.$refs.imgVideo.$children[0].$el.children
      for (var i = 0; i < fileList.length; i++) {
        if (fileList[i].response.url.indexOf('mp4') !== -1) {
          liIMG[i].children[0].remove()
          const video = document.createElement('video')
          video.src = fileList[i].response.url
          video.className = 'el-upload-list__item-thumbnail'
          video.style.objectFit = 'cover'
          video.style.height = 100 + '%'
          liIMG[i].insertBefore(video, liIMG[i].children[0])
        } else {
          liIMG[i].children[0].remove()
          const img = document.createElement('img')
          img.src = fileList[i].response.url
          img.className = 'el-upload-list__item-thumbnail'
          liIMG[i].insertBefore(img, liIMG[i].children[0])
          if (liIMG[i].children[0].height < 88) {
            liIMG[i].children[0].style.height = 100 + '%'
          }
        }
      }
    },
    resetForm() {
      this.dialogVisible = false
      this.imgVisible = false
      this.fileList = []
      this.$refs['ruleForm'].resetFields()
    },
    saveForm() {
      // const imgArr = []
      // let picNum = 0
      // this.ruleForm.classImg.map(item => {
      //   imgArr.push(item.url)
      //   picNum = imgArr && imgArr.length
      // })
      // console.log(this.imgSame)
      // console.log(this.ruleForm.classImg)
      const params = {
        cpdId: this.rowInfo.cpdId,
        cpmId: this.rowInfo.cpmId,
        content: this.ruleForm.content,
        // homework: this.ruleForm.homework,
        pictures: this.imgSame,
        picNum: this.imgSame.length
      }
      cpContentUpdate(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.dialogVisible = false
          // this.rowInfo.homework = this.ruleForm.homework
          this.rowInfo.content = this.ruleForm.content
          this.rowInfo.picList = this.imgSame
          this.$emit('toUpdateTable', this.rowInfo)
          this.$message.success(data.errorMessage)
        } else {
          this.$message.error(data.errorMessage || '老师评价编辑失败')
        }
      })
    },
    handleSuccess(res, file) {
      const lengths = this.$refs.imgVideo.$children[0].$el.children.length
      const liIMG = this.$refs.imgVideo.$children[0].$el.children
      // console.log(liIMG)
      if (res.url.indexOf('mp4') !== -1) {
        liIMG[lengths - 1].children[0].remove()
        const video = document.createElement('video')
        video.src = res.url
        video.className = 'el-upload-list__item-thumbnail'
        video.style.objectFit = 'cover'
        liIMG[lengths - 1].insertBefore(video, liIMG[lengths - 1].children[0])
      } else {
        if (liIMG[lengths - 1].children[0].height < 88) {
          liIMG[lengths - 1].children[0].style.height = 100 + '%'
        }
      }
      if (res.url !== '') {
        this.$message({
          message: '上传成功',
          type: 'success',
          center: true
        })
        Loading.service({ lock: true, text: '上传中', background: 'rgba(0, 0, 0, .6)' }).close()
        this.imgSame.push(res.url)
      } else {
        this.$message.error('上传失败')
      }
      if (this.imgSame.length >= 9) {
        this.imgVisible = true
      }
    },
    handlePreview(file) {
      // console.log(this.imgSame)
      const index = this.imgSame.indexOf(file.response.url)
      this.dialogVisibles = true
      this.listALL = {
        arr: this.imgSame,
        index: index,
        heights: this.windowH
      }
    },
    closeDialog() {
      if (this.showN === false) {
        this.$refs.videoOFF.pause()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.disabled /deep/ .el-upload--picture-card {
  display: none;
}
.teachComment /deep/ .el-upload-list--picture-card .el-upload-list__item-thumbnail{
  height: auto;
}
.uoloads{
  width: 300px;
}
</style>
>
