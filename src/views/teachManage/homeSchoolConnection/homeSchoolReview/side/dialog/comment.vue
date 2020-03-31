<template>
  <div class="smaeWall">
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :title="attendanceList.courseName"
      width="600px"
      @close="clseALL"
    >
      <div style="margin-bottom:14px">
        <el-form label-width="100px">
          <div class="teacher_area">
            <el-form-item label="主教：">
              <el-select
                v-model="mtids"
                multiple
                disabled
                filterable
              >
                <el-option
                  v-for="item in teacherList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="助教：">
              <el-select
                v-model="atids"
                multiple
                disabled
                filterable
              >
                <el-option
                  v-for="item in teacherList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="上课时间：">
            <el-input
              v-model="studyTime"
              placeholder="请填写上课时间"
              disabled
            />
          </el-form-item>
          <el-form-item label="课堂内容：">
            <el-input
              v-model="content"
              :autosize="{ minRows: 1, maxRows: 10}"
              type="textarea"
              maxlength="1500"
              placeholder="请填写课堂内容及课后作业（限1500字）"
            />
          </el-form-item>
          <!-- <el-form-item label="课后作业：">
            <el-input
              v-model="homework"
              placeholder="请填写课后作业（限300字）"
            />
          </el-form-item> -->
          <el-form-item
            label="课堂展示："
            class="wrapA"
          >
            <div class="uoloads">
              <el-upload
                ref="imgVideo"
                :class="{'disabled ': classPhotoVisible}"
                :on-success="handleSuccess"
                :on-remove="classPhotoRemove"
                :before-upload="beforeAvatarUpload"
                :on-preview="handlePreview"
                :limit="9"
                :file-list="classPhotoList"
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
          <div class="stuDataList">
            <div
              v-for="(item, index) of attendanceList.stuList"
              :key="index"
              class="stuData_item"
            >
              <div class="stuData_item_top">
                <el-form-item
                  :label="item.name+'：'"
                  style="margin-bottom:5px"
                >
                  <div
                    v-if="item.stu_type=='1'"
                    class="courseType"
                  >
                    <div class="stuClass" />
                    <div>上课</div>
                  </div>
                  <div
                    v-else
                    class="courseType"
                  >
                    <div class="missClass" />
                    <div>补课</div>
                  </div>

                  <el-radio-group
                    v-model="item.courseType"
                    :disabled="!isCurrentDay || (item.sign_type !='1'? true:false)"
                    @change="courseTypeChange"
                  >
                    <el-radio label="3">出勤</el-radio>
                    <el-radio label="4">请假</el-radio>
                    <el-radio label="5">旷课</el-radio>
                  </el-radio-group>
                </el-form-item>
                <div class="course_spend">
                  <div>消耗课时：</div>
                  <span v-if="costConf && costConf.length>0 && costConf[0] == '1' && item.courseType=='3'">{{ attendanceList.cost }}</span>
                  <span v-else-if="costConf && costConf.length>0 && costConf[1] == '1' && item.courseType=='4'">{{ attendanceList.cost }}</span>
                  <span v-else-if="costConf && costConf.length>0 && costConf[2] == '1' && item.courseType=='5'">{{ attendanceList.cost }}</span>
                  <span v-else>0</span>
                </div>
              </div>
              <div
                v-show="item.courseType == '3' || item.courseType == '4' || item.courseType == '5'"
                class="stuData_item_bottom"
              >
                <el-form-item label="综合评分：">
                  <el-rate
                    v-model="item.scoreNum"
                    :disabled="((item.sign_type!='1') && (parseInt(item.score)>=0)) ? true: false"
                    @change="stuScoreChange"
                  />
                </el-form-item>
                <el-form-item label="老师点评：">
                  <el-input
                    v-model="item.comment"
                    :autosize="{ minRows: 1, maxRows: 10}"
                    type="textarea"
                    maxlength="1500"
                    placeholder="请填写老师点评（限1500字）"
                  />
                </el-form-item>
                <el-form-item label="学员表现：">
                  <div class="uoloads">
                    <el-upload
                      ref="videIMG"
                      :class="{'disabled ': item.classStuVisible}"
                      :on-remove="(file, fileList) => {stuClassImgRemove(file, fileList, item, index)}"
                      :on-success="(response,file, fileList) => {stuClassImgSuccess(response, file, fileList, item, index)}"
                      :before-upload="beforeAvatarUpload"
                      :on-preview="(file) => { handlePictureClassImg(file,index)}"
                      :limit="9"
                      :data="sendD"
                      :file-list="item.classStuList"
                      action="https://img.ishanshan.com/gimg/user/upload"
                      list-type="picture-card"
                    >
                      <i class="el-icon-plus" />
                      <span>上传</span>
                    </el-upload>
                  </div>
                  <div style="color:rgb(70,182,238);font-size:12px">最多9张(支持png、jpg、jpeg、gif格式的图片，不大于5M。支持mp4格式的视频，不大于50M)</div>
                </el-form-item>
              </div>
            </div>
            <div
              v-for="(item, index) of attendanceList.tryStuList"
              :key="index+'_1'"
              class="stuData_item"
            >
              <div class="stuData_item_top">
                <el-form-item
                  :label="item.name+'：'"
                  style="margin-bottom:5px"
                >
                  <div class="courseType">
                    <div class="tryClass" />
                    <div>试听</div>
                  </div>

                  <el-radio-group
                    v-model="item.tryClassType"
                    :disabled="!isCurrentDay || (item.sign_type && item.sign_type != '1' ? true : false)"
                    @change="tryClassTypeChange"
                  >
                    <el-radio label="2">试听</el-radio>
                    <el-radio label="3">旷课</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div
                v-show="item.tryClassType"
                class="stuData_item_bottom"
              >
                <el-form-item label="综合评分：">
                  <el-rate
                    v-model="item.scoreNum"
                    :disabled="((item.sign_type!='1') && (parseInt(item.score)>=0)) ? true: false"
                    @change="tryClassTypeChange"
                  />
                </el-form-item>
                <el-form-item label="老师点评：">
                  <el-input
                    v-model="item.comment"
                    :autosize="{ minRows: 1, maxRows: 10}"
                    type="textarea"
                    maxlength="1500"
                    placeholder="请填写老师点评（限1500字）"
                  />
                </el-form-item>
                <el-form-item label="学员表现：">
                  <div class="uoloads">
                    <el-upload
                      ref="videLMG"
                      :class="{'disabled ': item.tryStuVisible}"
                      :on-remove="(file, fileList) =>{stryClassRemove(file, fileList,item,index)}"
                      :on-success="(response,file, fileList) => {stryClassSuccess(response, file, fileList, item, index)}"
                      :before-upload="beforeAvatarUpload"
                      :on-preview="(file) => { handlePictureStry(file,index)}"
                      :limit="9"
                      :data="sendD"
                      :file-list="item.tryClassList"
                      action="https://img.ishanshan.com/gimg/user/upload"
                      list-type="picture-card"
                    >
                      <i class="el-icon-plus" />
                      <span>上传</span>
                    </el-upload>
                  </div>
                  <div style="color:rgb(70,182,238);font-size:12px">最多9张(支持png、jpg、jpeg、gif格式的图片，不大于5M。支持mp4格式的视频，不大于50M)</div>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-form
          style="display:inline-block;margin-right:20px"
          label-width="100px"
        >
          <el-form-item style="margin-bottom:0">
            <el-checkbox v-model="isPrint">打印小票</el-checkbox>
            <el-popover
              placement="right"
              width="400"
              trigger="hover"
            >
              <div>
                <div>1.如果连接了打印机设备并且勾选，则在考勤时会打印小票</div>
                <div>2.只会对出勤的学员打印小票</div>
                <div>3.已考勤过的的学员不会打印小票</div>
              </div>
              <i
                slot="reference"
                class="el-icon-question"
              />
            </el-popover>
          </el-form-item>
        </el-form>
        <el-button
          class="cancel_btn"
          @click="cancel"
        >取消</el-button>
        <el-button
          type="primary"
          @click="submit"
        >确定</el-button>
      </div>
    </el-dialog>
    <!-- 查看图片轮播详情 -->
    <Imgpreview v-if="dialogVisibleImg" :list="listALL" @message="hiDcloe"/>
  </div>
</template>
<script>
import { signQuery,batchStuSign,tenantUserSummaryQuery } from '@/api/teachManage/attendance' //eslint-disable-line
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
      sendD: { oid: this.$store.getters.orgId, tid: this.$store.getters.tenantId },
      dialogVisible: false,
      isPrint: false, // 打印小票
      mtids: [], // 主教
      atids: [], // 助教
      studyTime: '', // 上课时间
      content: '', // 课堂内容
      homework: '', // 课后作业
      classPhoto: [], // 课堂图片
      classImgVisible: false, // 课堂图片显示
      classImg: [], // 上课图片
      stuList: [],
      isCurrentDay: false, // 是否是当天
      costConf: [], // 消耗课时
      attendanceList: [],
      classPhotoVisible: false, // 课堂图片
      classPhotoList: [], // 课堂图片的列表
      teacherList: [], // 员工列表
      dialogVisibleImg: false,
      showN: true,
      videoForm: '',
      previewImg: '',
      classLead: [], // 课堂图片
      classTerachImg: [], // 上课图片
      classTerachtryStu: []// 试听图片
    }
  },
  mounted() { this.windowH = document.body.clientHeight + 'px' },
  methods: {
    /* 上课状态改变 */
    courseTypeChange(val) {
      this.$forceUpdate()
    },
    /* 试听 */
    tryClassTypeChange(val) {
      this.$forceUpdate()
    },
    /* 上课的打分改变 */
    stuScoreChange(val) {
      this.$forceUpdate()
    },
    /* 试听打分改变 */
    tryScoreChange(val) {
      this.$forceUpdate()
    },
    /* 获取员工列表 */
    getUserlist() {
      tenantUserSummaryQuery().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.teacherList = data.results
        } else {
          this.$message.error(data.errorMessage || '获取员工列表失败')
        }
      })
    },
    show(row) {
      // this.isCurrentDay = val
      this.getUserlist()
      const params = {
        cpmId: row.cpmId,
        cpdId: row.cpdId
      }
      signQuery(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.attendanceList = data
          this.content = data.content
          // this.homework = data.homework
          if (this.attendanceList) {
            this.dialogVisible = true
            /* 主教处理 */
            this.mtids = []
            if (this.attendanceList.mtids && this.attendanceList.mtnames) {
              const mtids = this.attendanceList.mtids && this.attendanceList.mtids.split(',')
              for (var i = 0; i < mtids.length; i++) {
                mtids[i] = mtids[i]
              }
              this.mtids = mtids
            }
            /* 助教处理 */
            this.atids = []
            if (this.attendanceList.atids && this.attendanceList.atnames) {
              const atids = this.attendanceList.atids && this.attendanceList.atids.split(',')
              for (var j = 0; j < atids.length; j++) {
                atids[j] = atids[j]
              }
              this.atids = atids
            }
            if (this.attendanceList.startTime && this.attendanceList.endTime) {
              this.studyTime = this.attendanceList.startTime + '~' + this.attendanceList.endTime
            }
            this.attendanceList.stuList.map((item, index) => {
              item.courseType = item.sign_type
              item.scoreNum = item.score
            })
            this.attendanceList.tryStuList.map((item, index) => {
              item.tryClassType = item.sign_type
              item.scoreNum = item.score
            })
            // 出勤，请假，旷课判断数组
            if (this.attendanceList.costConf != null) {
              this.costConf = this.attendanceList.costConf.split(',')
            }
            /* 课堂图片回显 */
            this.classLead = this.attendanceList.picList
            this.classPhotoList = []
            if (this.attendanceList.picList && this.attendanceList.picList.length > 0) {
              this.attendanceList.picList.map((item, index) => {
                const obj = {
                  url: item,
                  response: { url: item }
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
                this.classPhotoList.push(obj)
              })
            }
            // 解决 点评价图片的预览问题
            if (this.classPhotoList && this.classPhotoList.length === 9) {
              this.classPhotoVisible = true
            } else {
              this.classPhotoVisible = false
            }
            /* 上课的上课图片回显 */
            this.classTerachImg = this.attendanceList.stuList
            let stuPicList = []
            if (this.attendanceList.stuList && this.attendanceList.stuList.length > 0) {
              this.attendanceList.stuList.map((item, indexs) => {
                if (item.pictures != null) { //eslint-disable-line
                  const stuArr = []
                  stuPicList = JSON.parse(item.pictures)
                  stuPicList && stuPicList.map((stuItem, index) => {
                    const stuObj = {
                      url: stuItem,
                      response: { url: stuItem }
                    }
                    stuArr.push(stuObj)
                    if (stuItem.indexOf('mp4') !== -1) {
                      setTimeout(() => {
                        const itemD = this.$refs.videIMG[indexs].$children[0].$el.children[index]
                        itemD.children[0].remove()
                        const video = document.createElement('video')
                        video.src = stuItem
                        video.className = 'el-upload-list__item-thumbnail'
                        video.style.objectFit = 'cover'
                        video.style.height = 100 + '%'
                        itemD.insertBefore(video, itemD.children[0])
                      }, 1800)
                    } else {
                      setTimeout(() => {
                        const itemD = this.$refs.videIMG[indexs].$children[0].$el.children[index]
                        if (itemD.children[0].height < 88) {
                          itemD.children[0].style.height = 100 + '%'
                        }
                      }, 600)
                    }
                  })
                  item.classStuList = stuArr
                  if (item.classStuList.length === 9) {
                    item.classStuVisible = true
                  } else {
                    item.classStuVisible = false
                  }
                } else {
                  item.classStuList = []
                }
              })
            }
            /* 试听的上课图片的回显 */
            this.classTerachtryStu = this.attendanceList.tryStuList
            let tryPicList = []
            if (this.attendanceList.tryStuList && this.attendanceList.tryStuList.length > 0) {
              this.attendanceList.tryStuList.map((item, indexs) => {
                if (item.pictures != null) { //eslint-disable-line
                  const tryArr = []
                  tryPicList = JSON.parse(item.pictures)
                  tryPicList && tryPicList.map((tryItem, index) => {
                    const tryObj = {
                      url: tryItem,
                      response: { url: tryItem }
                    }
                    tryArr.push(tryObj)
                    if (tryItem.indexOf('mp4') !== -1) {
                      setTimeout(() => {
                        const itemD = this.$refs.videLMG[indexs].$children[0].$el.children[index]
                        itemD.children[0].remove()
                        const video = document.createElement('video')
                        video.src = tryItem
                        video.className = 'el-upload-list__item-thumbnail'
                        video.style.objectFit = 'cover'
                        video.style.height = 100 + '%'
                        itemD.insertBefore(video, itemD.children[0])
                      }, 1800)
                    } else {
                      setTimeout(() => {
                        const itemD = this.$refs.videLMG[indexs].$children[0].$el.children[index]
                        if (itemD.children[0].height < 88) {
                          itemD.children[0].style.height = 100 + '%'
                        }
                      }, 600)
                    }
                  })
                  item.tryClassList = tryArr
                  if (item.tryClassList.length === 9) {
                    item.tryStuVisible = true
                  } else {
                    item.tryStuVisible = false
                  }
                } else {
                  item.tryClassList = []
                }
              })
            }
          }
        } else {
          this.$message.error(data.errorMessage || '查询考勤详情失败')
        }
      })
    },
    // 课堂上传图片视频成功回调
    handleSuccess(res, file) {
      const lengths = this.$refs.imgVideo.$children[0].$el.children.length
      const liIMG = this.$refs.imgVideo.$children[0].$el.children
      if (res.url.indexOf('mp4') !== -1) {
        liIMG[lengths - 1].children[0].remove()
        const video = document.createElement('video')
        video.src = res.url
        video.className = 'el-upload-list__item-thumbnail'
        video.style.objectFit = 'cover'
        video.style.height = 100 + '%'
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
        this.classLead.push(res.url)
      } else {
        this.$message.error('上传失败')
      }
      if (this.classLead.length === 9) {
        this.classPhotoVisible = true
      }
    },
    /* 课堂图片视频移除事件 */
    classPhotoRemove(file, fileList) {
      if (file.status == 'success') { //eslint-disable-line
        this.classLead.map((val, index) => {
          if (val === file.response.url) {
            this.classLead.splice(index, 1)
          }
        })
        if (this.classLead.length < 9) {
          this.classPhotoVisible = false
        }
      }
      // 解决视频和图片混搭删除bug
      setTimeout(() => {
        this.changeV(fileList)
      }, 1500)
    },
    // 课堂图片视频预览功能
    handlePreview(file) {
      const index = this.classLead.indexOf(file.response.url)
      this.dialogVisibleImg = true
      this.listALL = {
        arr: this.classLead,
        index: index,
        heights: this.windowH
      }
    },
    // 上课图片视频上传成功事件
    stuClassImgSuccess(response, file, fileList, item, index) {
      const itemI = this.$refs.videIMG
      const liIMG = itemI[index].$children[0].$el.children
      const lengths = itemI[index].$children[0].$el.children.length
      if (file.response.url.indexOf('mp4') !== -1) {
        liIMG[lengths - 1].children[0].remove()
        const video = document.createElement('video')
        video.src = file.response.url
        video.className = 'el-upload-list__item-thumbnail'
        video.style.objectFit = 'cover'
        video.style.height = 100 + '%'
        liIMG[lengths - 1].insertBefore(video, liIMG[lengths - 1].children[0])
      } else {
        if (liIMG[lengths - 1].children[0].height < 88) {
          liIMG[lengths - 1].children[0].style.height = 100 + '%'
        }
      }
      if (response.url !== '') {
        this.$message({
          message: '上传成功',
          type: 'success',
          center: true
        })
        Loading.service({ lock: true, text: '上传中', background: 'rgba(0, 0, 0, .6)' }).close()
        this.classTerachImg[index].classStuList.push({ url: file.response.url })
      } else {
        this.$message.error('上传失败')
      }
      if (this.classTerachImg[index].classStuList.length === 9) {
        this.$forceUpdate()
        item.classStuVisible = true
      }
    },
    // 上课图片视频移除事件
    stuClassImgRemove(file, fileList, item, index) {
      if (file.status == 'success') { //eslint-disable-line
        this.classTerachImg[index].classStuList.map((val, indexs) => {
          if (val.url === file.url) {
            this.classTerachImg[index].classStuList.splice(indexs, 1)
          }
        })
        if (this.classTerachImg[index].classStuList.length < 9) {
          this.$forceUpdate()
          item.classStuVisible = false
        }
      }
      setTimeout(() => {
        this.stuchangeV(fileList, index)
      }, 1500)
    },
    // 上课的图片视频预览
    handlePictureClassImg(file, index) {
      const firList = this.classTerachImg[index].classStuList
      const arr = []
      firList.map((val, index) => {
        arr.push(val.url)
      })
      const indexnum = arr.indexOf(file.response.url)
      this.dialogVisibleImg = true
      this.listALL = {
        arr: arr,
        index: indexnum,
        heights: this.windowH
      }
    },
    // 试听的图片视频上传成功事件
    stryClassSuccess(response, file, fileList, item, index) {
      const itemI = this.$refs.videLMG
      const liIMG = itemI[index].$children[0].$el.children
      const lengths = itemI[index].$children[0].$el.children.length
      if (file.response.url.indexOf('mp4') !== -1) {
        liIMG[lengths - 1].children[0].remove()
        const video = document.createElement('video')
        video.src = file.response.url
        video.className = 'el-upload-list__item-thumbnail'
        video.style.objectFit = 'cover'
        video.style.height = 100 + '%'
        liIMG[lengths - 1].insertBefore(video, liIMG[lengths - 1].children[0])
      } else {
        if (liIMG[lengths - 1].children[0].height < 88) {
          liIMG[lengths - 1].children[0].style.height = 100 + '%'
        }
      }
      if (response.url !== '') {
        this.$message({
          message: '上传成功',
          type: 'success',
          center: true
        })
        Loading.service({ lock: true, text: '上传中', background: 'rgba(0, 0, 0, .6)' }).close()
        this.classTerachtryStu[index].tryClassList.push({ url: file.response.url })
      } else {
        this.$message.error('上传失败')
      }
      if (this.classTerachtryStu[index].tryClassList.length === 9) {
        this.$forceUpdate()
        item.classStuVisible = true
      }
    },
    /* 试听的图片视频移除事件 */
    stryClassRemove(file, fileList, item, index) {
      if (file.status == 'success') { //eslint-disable-line
        this.classTerachtryStu[index].tryClassList.map((val, indexs) => {
          if (val.url === file.url) {
            this.classTerachtryStu[index].tryClassList.splice(indexs, 1)
          }
        })
        if (this.classTerachtryStu[index].tryClassList.length < 9) {
          this.$forceUpdate()
          item.tryStuVisible = false
        }
      }
      // 解决视频和图片混搭删除bug
      setTimeout(() => {
        this.strychangeV(fileList, index)
      }, 1500)
    },
    // 试听的图片视频预览
    handlePictureStry(file, index) {
      const firList = this.classTerachtryStu[index].tryClassList
      const arr = []
      firList.map((val, index) => {
        arr.push(val.url)
      })
      const indexnum = arr.indexOf(file.response.url)
      this.dialogVisibleImg = true
      this.listALL = {
        arr: arr,
        index: indexnum,
        heights: this.windowH
      }
    },
    // 公用的上传图片视频判断类型和大小
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
    // 关闭查看图片视频
    hiDcloe(val) {
      this.dialogVisibleImg = val
    },
    strychangeV(fileList, index) {
      const liIMG = this.$refs.videLMG[index].$children[0].$el.children
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
    stuchangeV(fileList, index) {
      const liIMG = this.$refs.videIMG[index].$children[0].$el.children
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
    // 弹出层关闭事件
    clseALL() {
      this.classPhotoList = []
      this.attendanceList = []
    },
    /* 取消 */
    cancel() {
      this.dialogVisible = false
      this.classPhotoVisible = false
    },
    /* 确定 */
    submit() {
      // let imgArr = []
      const signStuList = []
      const tryList = []
      // let picNum = 0
      /* 课堂图片 */
      // if (this.classPhoto && this.classPhoto.length > 0) {
      //   picNum = this.classPhoto && this.classPhoto.length
      //   imgArr = this.classPhoto
      // } else {
      //   picNum = this.classPhotoList && this.classPhotoList.length
      //   this.classPhotoList && this.classPhotoList.map(pic => {
      //     imgArr.push(pic.url)
      //   })
      // }

      /* 上课图片 */
      this.attendanceList && this.attendanceList.stuList.map(item => {
        let stuPicNum = 0
        let stuPicArr = []
        if (item.classStuArr && item.classStuArr.length > 0) {
          stuPicNum = item.classStuArr && item.classStuArr.length
          stuPicArr = item.classStuArr
        } else {
          stuPicNum = item.classStuList && item.classStuList.length
          item.classStuList && item.classStuList.map(pic => {
            stuPicArr.push(pic.url)
          })
        }
        const stuObj = {
          cpStuId: item.id,
          signType: item.courseType,
          checkStatus: item.status,
          picNum: stuPicNum,
          score: item.scoreNum || null,
          comment: item.comment,
          picture: stuPicArr
        }
        signStuList.push(stuObj)
      })
      /* 试听图片 */
      let checkStatus = ''
      this.attendanceList && this.attendanceList.tryStuList.map(item => {
        let tryPicNum = 0
        let tryPicArr = []
        if (item.tryStuArr && item.tryStuArr.length > 0) {
          tryPicNum = item.tryStuArr && item.tryStuArr.length
          tryPicArr = item.tryStuArr
        } else {
          tryPicNum = item.tryClassList && item.tryClassList.length
          item.tryClassList && item.tryClassList.map(pic => {
            tryPicArr.push(pic.url)
          })
        }

        if (item.sign_type == '1') { //eslint-disable-line
          checkStatus = '1'
        } else {
          checkStatus = '2'
        }
        const stuObj = {
          id: item.audition_id,
          status: item.tryClassType,
          checkStatus: checkStatus,
          picNum: tryPicNum,
          score: item.scoreNum || null,
          comment: item.comment,
          picture: tryPicArr
        }
        tryList.push(stuObj)
      })
      const params = {
        cpmId: this.attendanceList.cpmId,
        cpdId: this.attendanceList.cpdId,
        content: this.content,
        // homework: this.homework,
        pictures: this.classLead,
        picNum: this.classLead.length,
        signStuList: signStuList,
        tryList: tryList
      }
      batchStuSign(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.dialogVisible = false
          this.$emit('toUpdateTable')
          this.$message.success(data.errorMessage)
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.teacher_area {
  display: flex;
  flex-wrap: nowrap;
}
.disabled /deep/ .el-upload--picture-card {
  display: none;
}
.wrapALL /deep/ .el-dialog__headerbtn {
    top: 17px;
    right: 17px;
}
.wrapALL /deep/ .el-dialog__header{
  padding:26px;
}
.wrapALL /deep/ .el-dialog__body {
  padding: 20px !important;
}
.smaeWall /deep/ .el-radio{
  margin-bottom: 0;
  display: inline-block;
  margin-right: 30px
}
.smaeWall /deep/ .el-radio + .el-radio{
  margin-bottom:0
}
.smaeWall /deep/ .el-upload-list--picture-card .el-upload-list__item-thumbnail{
  height: auto;
}
.stuDataList {
  .stuData_item {
    padding-top: 20px;
    margin-top: 20px;
    border-top: 1px solid #ddd;
    .stuData_item_top {
      display: flex;
      flex-wrap: nowrap;
      -webkit-box-pack: justify;
      justify-content: space-between;
      -webkit-box-align: center;
      align-items: center;
      .courseType {
        display: inline-block;
        margin-right: 10px;
        .stuClass,
        .missClass,
        .tryClass {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #46b6ee;
        }
        .missClass {
          background: #87d068;
        }
        .tryClass {
          background: #f5a623;
        }
        div {
          display: inline-block;
        }
      }
      .course_spend {
        display: flex;
        flex-wrap: nowrap;
      }
    }
  }
}
.uoloads{
  width: 300px;
}
</style>
