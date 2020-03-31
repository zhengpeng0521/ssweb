<template>
  <div
    ref="campusTitle"
    class="campus_set"
  >

    <div
      id="ID"
      class="campus_header"
    >
      <span>校区信息</span>
      <!-- <el-button
        type="primary"
        @click="saveForm('campusData')"
      >保存</el-button> -->
    </div>
    <div class="campus_content">

      <div class="title_box">
        <span class="form_txt" />
        <span>基本信息
        </span>
      </div>

      <el-form
        ref="campusData"
        :model="campusData"
        :rules="rules"
        label-width="100px"
      >
        <div class="form-width">
          <el-form-item
            label="校区名称:"
            prop="orgName"
          >
            <el-input
              v-model="campusData.orgName"
              clearable
              disabled
            />

          </el-form-item>
          <el-form-item
            label="联系人姓名:"
            prop="contacts"
          >
            <el-input
              v-model="campusData.contacts"
              clearable
              placeholder="限20字"
            />

          </el-form-item>
          <el-form-item
            label="联系方式:"
            prop="tel"
          >
            <el-input
              v-model="campusData.tel"
              maxlength="25"
              clearable
              placeholder="请填写联系方式"
            />

          </el-form-item>
          <el-form-item
            label="校区logo:"
            prop="schoolLogo"
          >

            <el-upload
              :class="{'disabled ': bgVisible}"
              :on-success="handleLogoAvatarSuccess"
              :on-preview="handleBackImgeAvatarPreview"
              :on-remove="handleBackImgeAvatarRemove"
              :on-change="handleBackImgeAvatarChange"
              :before-upload="beforeAvatarUpload"
              :limit="1"
              :file-list="bgFilelist"
              action="https://imgsrc.ishanshan.com/gimg/upload"
              list-type="picture-card"
            >
              <i class="el-icon-plus" />
              <div class="upload-text">上传照片</div>
            </el-upload>
            <el-dialog
              :visible.sync="bgDialogVisible"
              size="full"
              title="预览"
            >
              <img
                :src="campusData.schoolLogo"
                width="100%"
                alt=""
            ></el-dialog>

            <span class="logo_explain">支持png、jpg、jpeg、gif格式的图片, 建议宽高40×40px; 图片大小小于2M</span>
          </el-form-item>
        </div>

        <el-form-item
          label="校区介绍:"
          prop="intro"
          style="max-width:950px"
        >
          <RichTextEdit
            ref="richEdit"
            v-model="campusData.intro"
            :edit-style="{width: '500px', height: '500px'}"
            no-video
          />

          <!-- <el-input
            v-model="campusData.intro"
            placeholder="限2000字"
            rows="5"
            type="textarea"
          /> -->
        </el-form-item>
        <div class="title_box">
          <span class="form_txt" />
          <span>校区详情

          </span>
        </div>
        <div class="form-width">
          <el-form-item
            label="营业时间:"
            prop="serverTime"
          >
            <el-input
              v-model="campusData.serverTime"
              clearable
              placeholder="限30字"
            />

          </el-form-item>

          <el-form-item
            label="适用年龄:"
            prop="ageTag"
          >
            <el-input
              v-model="campusData.ageTag"
              placeholder="限40字"
            />

          </el-form-item>
        </div>
        <el-form-item
          label="业务范围:"
          prop="categoryTag"
          style="max-width:950px"
        >
          <el-checkbox-group v-model="campusData.categoryTag">
            <el-checkbox
              v-for="(item,index) in organCategory"
              :label="item.value"
              :key="index"
            >{{ item.text }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item
          label="环境相册:"
          prop="images"
        >
          <el-upload
            ref="videIMG"
            :before-upload="beforeAvatarVpload"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleCardPicSuccess"
            :file-list="imageFileList"
            :data="sendD"
            class="wrapsA"
            action="https://img.ishanshan.com/gimg/user/upload"
            list-type="picture-card"
          > <i class="el-icon-plus" />
            <span>上传照片</span>
          </el-upload>
          <div style="color:#999;font-size:12px">支持png、jpg、jpeg、gif格式的图片，不大于5M。支持mp4格式的视频，不大于80M。</div>
        </el-form-item>
        <el-form-item
          label="师资力量:"
          prop="teachers"
          checked
          class="teach_content"
        >

          <div
            v-for=" (item,index) in campusData.teachers"
            :key="index"
            class="teach_box"
          >
            <div class="teach_box_title">
              <span>老师信息</span>
              <el-button
                type="text"
                class="cp"
                @click="deleteTeachData(index)"
              >删除</el-button>
            </div>
            <div class="teach_box_body">
              <el-form-item
                :prop="'teachers.' + index + '.teacherName'"
                :rules="[{
                  required: true, message: '老师姓名不能为空', trigger: 'change'
                },{ max:10, message: '限10字', trigger: 'blur' }]"
                label="老师姓名："
              >
                <el-input
                  v-model="item.teacherName"
                  size="mini"
                />
              </el-form-item>
              <el-form-item
                :prop="'teachers.' + index + '.teacherIntro'"
                :rules="[{
                  required: true, message: '老师简介不能为空', trigger: 'change'
                },{ max:40, message: '限40字', trigger: 'blur' }]"
                label="老师简介："
              >
                <el-input
                  v-model="item.teacherIntro"
                  size="mini"
                />
              </el-form-item>
              <el-form-item
                :prop="'teachers.' + index + '.teacherImg'"
                label="老师图片："
              >
                <el-upload
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  class="avatar-uploader"
                  action="https://imgsrc.ishanshan.com/gimg/upload"
                  @click="getTeacherIndex(index)"
                >

                  <img
                    v-if="item.teacherImg"
                    :src="item.teacherImg"
                    class="avatar"
                    @click="getTeacherIndex(index)"
                  >
                  <i
                    v-else
                    class="el-icon-plus"
                    @click="getTeacherIndex(index)"
                  />
                  <span
                    v-if="!item.teacherImg"
                    style="color:#666"
                    @click="getTeacherIndex(index)"
                  >上传图片</span>
                </el-upload>
                <p>上传老师图片, 支持png、jpg、jpeg、gif格式的图片,图片大小小于2M!</p>
              </el-form-item>

            </div>
          </div>

        </el-form-item>
        <div style="padding-left: 49px;">
          <el-button
            type="primary"
            class="add_btn"
            style="display:block"
            @click="addTeachData()"
          >添加师资展示</el-button>
        </div>
        <el-form-item label="机构地址:">
          <div class="organ_box">

            <el-form-item
              label="门店地址"
              prop="addrColumn"
            >
              <el-cascader
                v-model="campusData.addrColumn"
                :options="areaList"
                :props="areaProp"
                style="width:200px"
                popper-class="store_address_style"
                clearable
                @change="handleItemChange"
              />
            </el-form-item>
            <el-form-item
              label="详细地址"
              prop="addr"
            >
              <el-input
                v-model="campusData.addr"
                clearable
                @blur="searchDetailAddress(campusData.addr)"
              />
            </el-form-item>

            <baiduMap
              :location-data="choiceLocation"
              @show-lng="lngData=$event"
            />
          </div>
        </el-form-item>
      </el-form>

    </div>

    <div class="campus_bottom">
      <el-button
        type="primary"
        @click="saveForm('campusData')"
      >保存</el-button>
    </div>
    <!-- 查看图片轮播详情 -->
    <Imgpreview v-if="dialogVisible" :list="listALL" @message="hiDcloe"/>
  </div>
</template>

<script>
// eslint-disable-next-line
import { queryOrganList, dictOrgan, getOrgan, queryOrgList, updateOrgan } from '@/api/orgSet/campusSet'
import { Loading } from 'element-ui'
import area from '@/utils/area'
import baiduMap from './baiduMap'
import Imgpreview from '@/components/ImgPreview/imgpre'
import RichTextEdit from '@/components/RichTextEdit/RichTextEdit'

export default {

  components: {
    baiduMap,
    Imgpreview,
    RichTextEdit
  },

  data() {
    return {
      listALL: {},
      windowH: '',
      sendD: { oid: this.$store.getters.orgId, tid: this.$store.getters.tenantId },
      lngData: '',
      choiceLocation: '浙江省杭州市滨江区滨康路101号海威大厦18楼',
      areaList: area,
      areaProp: {
        value: 'name',
        label: 'name'
      },
      saveLocation: '',
      dialogVisible: false,
      organCategory: [],
      pictureCard: '',
      teachersIndex: '',
      imageFileList: [],
      officialAcc: '1',
      oaInfo: '',

      campusData: {
        name: '',
        serverTime: '周一至周日 09：00~21：00',
        ageTag: '0~8岁',
        addrColumn: [],
        address: '',
        province: '',
        city: '',
        area: '',
        schoolLogo: '',
        categoryTag: [],
        images: [],
        teachers: [{
          teacherName: '',
          teacherIntro: '',
          teacherImg: ''
        }],

        intro: '<p>闪闪早教，专业致力于给机构一套完整、系统、操作便捷的早教专业SAAS系统，全力打造“互联网+教育”平台，为教育机构提供专属智能化解决方案！我们相信，行业的深度决定自身的高度，期待您来进一步了解！</p>'

      },
      rules: {
        name: [
          { required: true, message: '请输入员工姓名', trigger: 'change' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        contacts: [
          { required: true, message: '请输入联系人姓名', trigger: 'change' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'change' }
        ],
        schoolLogo: [{ required: true, message: '未上传图片：请上传图片', trigger: 'change' }],
        intro: [{ required: true, message: '请填写校区介绍', trigger: 'blur' }],
        tel: [
          { required: true, message: '请输入座机号或者手机号', trigger: 'blur' },
          { pattern: /^[0-9]*$/, message: '输入格式错误', trigger: 'blur' }
          // { pattern: /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|166|198|199|(147))+\d{8})$/, message: '手机号格式错误', trigger: 'blur' }
        ],
        serverTime: [
          { required: true, message: '请填写营业时间', trigger: 'change' },
          { max: 30, message: '限制30个字符', trigger: 'change' }
        ],
        ageTag: [
          {
            required: true,
            message: '请输入适用年龄',
            trigger: 'blur'
          }
          // {
          //   pattern: /^(?!(0[0-9]{1,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/,
          //   message: '年龄不允许小于零'
          // }
        ],
        categoryTag: [{ required: true, message: '请选择业务范围', trigger: 'change' }],
        images: [{ required: true, message: '未上传图片：请上传图片', trigger: 'change' }],
        addrColumn: [{ required: true, message: '请选择机构地址', trigger: 'change' }],
        addr: [{ required: true, message: '请输入详细机构地址', trigger: 'change' }]
      },
      bgDialogVisible: false,
      bgVisible: false,
      bgFilelist: [] // 背景图片列表

    }
  },

  mounted() {
    this.windowH = document.body.clientHeight + 'px'
    this.getOrgList()
    this.getDictOrgan()
    this.$nextTick(() => {
      this.$refs.campusTitle.addEventListener('scroll', this.handleScroll)
    })

    this.getOrganList()
  },

  destroyed() {
    window.removeEventListener('scroll', this.handleScroll, true)
  },

  methods: {

    getOrganList() {
      getOrgan().then(res => {
        if (res.data.errorCode === 0) {
          this.campusData = res.data
          if (res.data.intro && res.data.intro.indexOf('<') === -1) {
            const intro = `<p>${res.data.intro}</p>`
            this.campusData.iptCont = intro
          } else {
            this.campusData.iptCont = res.data.intro
          }
          this.officialAcc = res.data.officialAcc
          this.oaInfo = res.data.oaInfo
          // eslint-disable-next-line
          if (res.data.schoolLogo != undefined && res.data.schoolLogo != '' && res.data.schoolLogo != null) {
            this.bgFilelist.push({ url: res.data.schoolLogo })
          }
          if (this.bgFilelist && this.bgFilelist.length > 0) {
            this.bgVisible = true
          }
          this.campusData.teachers = Object.assign([], JSON.parse(res.data.teachers))
          this.campusData.addrColumn = Object.assign([], JSON.parse(res.data.addrColumn))
          // eslint-disable-next-line
          if (res.data.categoryTag != null && res.data.categoryTag != undefined && res.data.categoryTag != '') {
            this.campusData.categoryTag = res.data.categoryTag && res.data.categoryTag.split(',')
          } else {
            this.campusData.categoryTag = []
          }
          if (!res.data.images) {
            this.campusData.images = []
          } else {
            this.imageFileList = []
            this.campusData.images = Object.assign([], res.data.images.split(','))

            this.campusData.images.forEach((v, index) => {
              const data = {
                name: index,
                url: v,
                response: { url: v }
              }
              this.imageFileList.push(data)
              this.$nextTick(function() {
                setTimeout(() => {
                  const liIMG = this.$refs.videIMG.$children[0].$el.childNodes
                  if (v.indexOf('mp4') !== -1) {
                    liIMG[index].children[0].remove()
                    const video = document.createElement('video')
                    video.src = v
                    video.className = 'el-upload-list__item-thumbnail'
                    video.style.objectFit = 'cover'
                    video.style.height = 100 + '%'
                    liIMG[index].insertBefore(video, liIMG[index].children[0])
                  } else {
                    // console.log(liIMG[index].children[0].height)
                    if (liIMG[index].children[0].height < 88) {
                      liIMG[index].children[0].style.height = 100 + '%'
                    }
                  }
                }, 1000)
              })
            })
          }

          if (res.data.addrColumn && res.data.addr) {
            this.choiceLocation = res.data.addrColumn.join(',') + res.data.addr
          }
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    getOrgList() {
      queryOrgList().then(res => {
        if (res.data.errorCode !== 0) {
          this.$message.success(res.data.errorMessage)
        }
      })
    },
    getDictOrgan() {
      dictOrgan().then(res => {
        if (res.data.errorCode === 0) {
          res.data.dictItemList.forEach(v => {
            if (v.code === 'organcategory') {
              this.organCategory = Object.assign([], v.items)
            }
          })
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    handleScroll() {
      // var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      // console.log('333333333333----scrollTop>', scrollTop)
      // console.log('11111111111----offsetTop>', window.scrollX)
      // console.log('22222222222---->', this.$refs.campusTitle.getBoundingClientRect().top)
      // if (this.$refs.campusTitle.offsetTop < -79) {
      //   console.log('此时高度小于79-------------')
      // }
    },
    hiDcloe(val) {
      this.dialogVisible = val
    },
    beforeAvatarVpload(file) {
      const typeAll = file.type.split('/')
      if (typeAll[0] === 'video') {
        // 视频
        const isLt80M = file.size / 1024 / 1024 < 80
        if (['video/mp4'].indexOf(file.type) === -1) {
          this.$message.error('上传的视频只能是mp4格式!')
          return false
        }
        if (!isLt80M) {
          this.$message.error('上传视频大小不能超过80MB哦!')
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
          this.$message.error('上传的图片大小不能超过5M!')
          return false
        }
      }
      Loading.service({ lock: true, text: '上传中', background: 'rgba(0, 0, 0, .6)' })
    },
    // 上传图片删除
    handleRemove(file, fileList) {
      this.campusData.images.map((val, index) => {
        if (val === file.url) {
          this.campusData.images.splice(index, 1)
          // 解决视频和图片混搭删除bug
          setTimeout(() => {
            this.changeV(fileList)
          }, 1500)
        }
      })
    },
    changeV(fileList) {
      const liIMG = this.$refs.videIMG.$children[0].$el.children
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
    // 预览
    // handlePictureCardPreview(file) {
    //   this.pictureCard = file.url
    //   this.dialogVisible = true
    // },
    handlePictureCardPreview(file) {
      console.log(file)
      const index = this.campusData.images.indexOf(file.url)
      this.dialogVisible = true
      this.listALL = {
        arr: this.campusData.images,
        index: index,
        heights: this.windowH
      }
    },

    handleCardPicSuccess(res, file) {
      if (res.url !== '') {
        this.$message({
          message: '上传成功',
          type: 'success',
          center: true
        })
      } else {
        this.$message.error('上传失败')
      }
      Loading.service({ lock: true, text: '上传中', background: 'rgba(0, 0, 0, .6)' }).close()
      const lengths = this.$refs.videIMG.$children[0].$el.children.length
      const liIMG = this.$refs.videIMG.$children[0].$el.children
      // console.log(liIMG)
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
      this.campusData.images.push(res.url)
    },
    getTeacherIndex(index) {
      this.teachersIndex = index
    },
    handleAvatarSuccess(index, res, file) {
      this.campusData.teachers[this.teachersIndex].teacherImg = res.response.url
      if (res.url !== '') {
        this.$message({
          message: '上传成功',
          type: 'success',
          center: true
        })
      }
    },
    // 校区logo
    handleLogoAvatarSuccess(res, file) {
      this.campusData.schoolLogo = res.url
      if (res.url !== '') {
        this.$message({
          message: '上传成功',
          type: 'success',
          center: true
        })
      }
    },

    /* 背景图片查看 */
    handleBackImgeAvatarPreview(file) {
      this.campusData.schoolLogo = file.url
      this.bgDialogVisible = true
    },

    /* 背景图片移除 */
    handleBackImgeAvatarRemove(file, fileList) {
      if (file.status == 'success') { //eslint-disable-line
        if (fileList.length < 1) {
          this.bgVisible = false
          this.campusData.schoolLogo = []
        } else {
          this.bgVisible = true
        }
      }
    },
    /* 背景图片改变 */
    handleBackImgeAvatarChange(file, fileList) {
      if (file.status == 'success') { //eslint-disable-line
        if (fileList.length === 1) {
          this.bgVisible = true
        }
      }
    },
    beforeAvatarUpload(file) {
      // 图片
      const isLt2M = file.size / 1024 / 1024 < 2
      if (['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].indexOf(file.type) === -1) {
        this.$message.error('上传的图片只能是 png、jpg、jpeg、gif格式的图片!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过2M!')
        return false
      }
    },

    addTeachData() {
      const data = {
        teacherName: '',
        teacherIntro: '',
        teacherImg: ''
      }
      this.campusData.teachers.push(data)
    },
    deleteTeachData(val) {
      if (this.campusData.teachers.length === 1) {
        this.$message.warning('教师消息至少保留一条')
      } else {
        this.campusData.teachers.splice(val, 1)
      }
    },

    handleItemChange(val) {
      if (val && val.length > 0) {
        this.campusData.province = val[0]
        this.campusData.city = val[1]
        this.campusData.area = val[2]
      }
      this.saveLocation = val.join('')
      this.choiceLocation = val.join('')
    },
    searchDetailAddress(val) {
      this.choiceLocation = this.saveLocation + val
    },

    saveForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.campusData.images.length < 3) {
            this.$message.warning('环境相册请上传三张以上图片')
          } else {
            const data = {
              id: this.campusData.id,
              tel: this.campusData.tel,
              intro: this.campusData.intro,

              serverTime: this.campusData.serverTime,
              ageTag: this.campusData.ageTag,
              addrColumn: JSON.stringify(this.campusData.addrColumn),
              contacts: this.campusData.contacts,
              province: this.campusData.province,
              city: this.campusData.city,
              area: this.campusData.area,
              addr: this.campusData.addr,
              schoolLogo: this.campusData.schoolLogo,
              categoryTag: this.campusData.categoryTag.join(','),
              images: this.campusData.images.join(','),
              teachers: JSON.stringify(this.campusData.teachers),
              log: this.lngData.lng,
              lat: this.lngData.lat,
              officialAcc: this.officialAcc,
              oaInfo: this.oaInfo
            }
            updateOrgan(data).then(res => {
              if (res.data.errorCode === 0) {
                this.$message.success('保存成功')
                this.bgFilelist = []
                this.getOrganList()
                this.$router.go(0)
              } else {
                this.$message.error(res.data.errorMessage)
              }
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapsA /deep/ .el-upload-list--picture-card .el-upload-list__item-thumbnail{
  height: auto;
}
.campus_set /deep/ {
  margin-left: 20px;
  height: 100%;
  // overflow: auto;
  min-width: 800px;
  .avatar-uploader .el-upload {
    width: 90px;
    height: 90px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .el-icon-plus {
    font-size: 26px;
    color: #666;
  }
  .el-checkbox + .el-checkbox {
    margin-left: 0px;
  }
  .el-checkbox__label {
    padding-right: 10px;
  }
}

.logo_explain {
  font-size: 12px;
  color: #999;
  line-height: 20px;
  margin-top: 6px;
}
.campus_header {
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
  margin-right: 20px;
  z-index: 999;
  line-height: 39px;
}

.upload-text {
  line-height: 14px;
  color: #666;
  margin-top: 9px;
}
.teach_box {
  width: 400px;
  margin-right: 14px;
  overflow: hidden;
  margin-bottom: 14px;
  border-radius: 5px;
  border: 1px solid #f0f2f5;
  padding-top: 0px;
  position: relative;
  background: #fff;
  .teach_box_title {
    height: 32px;
    width: 400px;
    line-height: 32px;
    background: #f0f2f5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    span {
      height: 12px;
      font-size: 14px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: #333333;
      line-height: 12px;
    }
  }
  .teach_box_body {
    padding: 20px;
  }
  p {
    font-size: 12px;
    color: #999;
    line-height: 20px;
    margin-top: 6px;
  }
  .el-input--mini {
    width: 200px;
  }
}

.organ_box {
  width: 400px;
  // margin-left: 50px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #f0f2f5;
  padding: 20px;
  background: #fff;
}
.add_btn {
  margin: 0 0 20px 50px;
}

.campus_content {
  margin-right: 20px;
  height: calc(100% - 148px);
  overflow: auto;
  border-bottom: 1px solid #ddd;
}

.el-form-item {
  margin-bottom: 20px;
}

.disabled /deep/ .el-upload--picture-card {
  display: none;
}

.teach_content /deep/ {
  margin-bottom: 0px;
  .el-form-item__content {
    display: flex;
    flex-wrap: wrap;
  }
}
.title_box {
  margin-bottom: 14px;
}
.form-width {
  width: 500px;
}

.campus_bottom {
  padding: 20px;
}
</style>
