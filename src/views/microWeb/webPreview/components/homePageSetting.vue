<template>
  <transition name="slide-fade">
    <div
      v-show="isVisible"
      class="side-zhezhao"
    >
      <div
        v-show="isVisible"
        class="side-dialog"
      >
        <div class="top">
          <div class="top-left">
            <span>{{ addLessonDialogTitlt }}</span>
          </div>
          <div class="top-right">
            <Confirm
              :text="'关闭'"
              :placement="'top'"
              :content="'确认关闭么?'"
              :confirm="close"
              :is-button="true"
              :btn-type="'plain'"
              style="margin-right:5px;"
            />
            <Confirm
              :text="'保存'"
              :placement="'top'"
              :content="'确认保存么?'"
              :confirm="()=>{submitForm('campusData')}"
              :is-button="true"
              :btn-type="'primary'"
              style="margin-right:15px;"
            />
          </div>
        </div>
        <div class="body">
          <div class="body-leftBox">
            <div class="body-left">
              <div class="body-left-header">
                <img src="https://img.ishanshan.com/gimg/user/n///1557127683.png">
              </div>
              <div class="body-left-cont">
                <div style="width:100%;height:150px">
                  <el-carousel indicator-position="outside">
                    <el-carousel-item v-for="item in imglist" :key="item.id">
                      <video v-if="item.picUrl.indexOf('mp4') !== -1" :src="item.picUrl" width="100%" height="100%" style="object-fit:cover;border-radius:5px"/>
                      <img v-else :src="item.picUrl" width="100%" height="100%">
                    </el-carousel-item>
                  </el-carousel>
                </div>
                <div class="nav">
                  <ul>
                    <li
                      v-if="nav.homeTabShow === 1"
                      class="firstNav"
                    >{{ nav.homeTab }}</li>
                    <li v-show="nav.courseTabShow === 1">{{ nav.courseTab }}</li>
                    <li v-show="nav.activityTabShow === 1">{{ nav.activityTab }}</li>
                    <li v-show="nav.gameTabShow === 1">{{ nav.gameTab }}</li>
                    <li v-show="nav.liveCfgShow === 1">{{ nav.liveCfg }}</li>
                    <li v-show="nav.otherTabShow === 1">{{ nav.otherTab }}</li>
                  </ul>
                </div>

                <!-- 公众号控制 -->
                <div v-if="radioData.officialAcc === '1'" class="official_account">
                  <div class="wx_logo">
                    <img v-if="wxLogo && wxLogo !== ''" :src="wxLogo">
                  </div>
                  <span class="wx_name">{{ campusData.officialName || '--' }}</span>
                  <span class="wx_focus">立即关注</span>
                </div>

                <div class="orgInfo">
                  <div class="orgAddress">
                    <i class="el-icon-location" />{{ typeChange(campusData.addrColumn) }}
                  </div>
                  <div class="orgTime">
                    <div> <i class="el-icon-time" /><span>营业时间：{{ campusData.serverTime }}</span></div>
                    <!-- <i class="el-icon-phone" /> -->
                  </div>
                </div>
                <div
                  v-show="radioData.ageRange === '1'"
                  class="orgItem"
                >
                  <div class="tit"><i />适合年龄</div>
                  <span class="age">
                    {{ campusData.ageTag }}
                  </span>
                </div>
                <div
                  v-show="radioData.busnessRange === '1'"
                  class="orgItem"
                >
                  <div class="tit"><i />业务范围</div>
                  <span
                    v-for="(item,index) in typeLabel(campusData.categoryTag)"
                    :key="index"
                    class="workType"
                    style="margin:5px 2px;line-height:20px"
                  >
                    {{ item }}
                  </span>
                </div>
                <div
                  v-if="radioData.orgAlbum === '1'"
                  class="orgItem"
                >
                  <div class="tit"><i />环境相册</div>
                  <div class="albumBox">
                    <div
                      v-for="(item,index) in campusData.images"
                      :key="index"
                      class="album"
                    >
                      <video v-if="item.indexOf('mp4') !== -1" :src="item" width="120px" height="80px" style="object-fit:cover;border-radius:5px"/>
                      <!-- <img v-else :src="item"> -->
                      <div v-else :style="{backgroundImage: `url(${item})`, height: '80px', width: '120px',borderRadius:'5px',backgroundSize:'cover',backgroundPosition:'center center'}"/>
                    </div>
                  </div>
                </div>
                <div
                  v-if="radioData.orgIntro === '1'"
                  class="orgItem"
                >
                  <div class="tit"><i />机构简介</div>
                  <div class="intro">
                    <div v-html="iptCont">{{ iptCont }}</div>
                  </div>
                </div>
                <div
                  v-if="radioData.orgFaculty === '1'"
                  class="orgItem"
                >
                  <div class="tit"><i />师资力量</div>
                  <div style="display: flex;overflow-x: auto;">
                    <div
                      v-for="(data,index) in campusData.teachers"
                      :key="index"
                      class="teachItem"
                    >
                      <div :style="{backgroundImage: `url(${data.teacherImg})`, height: '80px', width: '80px',borderRadius:'5px',backgroundSize:'cover',backgroundPosition:'center center'}"/>
                      <div class="teachName">{{ data.teacherName }}</div>
                      <div class="rank">{{ data.teacherIntro }}</div>
                    </div>
                  </div>
                </div>

                <div
                  v-if="radioData.orgFacility === '1'"
                  class="orgItem"
                >
                  <div class="tit"><i />机构设施
                  </div>
                  <span
                    v-for="(item,index) in utilityLabel(campusData.utilityTag)"
                    :key="index"
                    class="facility"
                  >
                    <div class="facilityBacground"><img :src="item.img"></div>
                    <div class="facilityName">{{ item.text }}</div>
                  </span>
                </div>

              </div>
              <div class="body-left-foot">
                <div class="foot_item">
                  <svg-icon class="foot_item_icon" icon-class="mapGuide"/>
                  <p class="foot_item_title">地图导航</p>
                </div>
                <div class="foot_item">
                  <svg-icon class="foot_item_icon" icon-class="tel"/>
                  <p class="foot_item_title">机构联系</p>
                </div>
                <div class="foot_item">
                  <svg-icon class="foot_item_icon" icon-class="order"/>
                  <p class="foot_item_title">在线预约</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 表单区 -->
          <div class="body-right">
            <el-form
              ref="campusData"
              :model="campusData"
              :rules="rules"
              label-width="100px"
            >
              <el-form-item
                label="关注公众号:"
                prop="officialAcc"
              >
                <span slot="label"><i class="fake_require">*</i>关注公众号:</span>
                <el-radio-group v-model="radioData.officialAcc">
                  <el-radio label="1">显示</el-radio>
                  <el-radio label="0">隐藏</el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- 公众号表单 -->
              <div v-if="radioData.officialAcc === '1'" class="offical_account_form">
                <el-form-item
                  label="公众号logo:"
                  prop="wxLogo"
                  label-width="110px"
                >
                  <span slot="label"><i class="fake_require">*</i>公众号logo:</span>
                  <el-upload
                    :file-list="logoFileList"
                    :on-preview="logoPreview"
                    :on-remove="logoRemove"
                    :on-success="wxLogoSuccess"
                    :before-upload="beforeAvatarUpload"
                    list-type="picture-card"
                    class="logo_uploader"
                    action="https://imgsrc.ishanshan.com/gimg/upload"
                  >
                    <i class="el-icon-plus" />
                    <span style="color:#666">上传图片</span>
                  </el-upload>
                  <p class="logo_tip">支持png、jpg、jpeg、gif格式的图片,图片大小小于2M!</p>
                </el-form-item>

                <el-form-item
                  label="公众号名称:"
                  prop="officialName"
                  label-width="110px"
                >
                  <el-input
                    v-model="campusData.officialName"
                    clearable
                    placeholder="限15字"
                  />
                </el-form-item>

                <el-form-item
                  label="公众号二维码:"
                  prop="qrCode"
                  label-width="110px"
                >
                  <span slot="label"><i class="fake_require">*</i>公众号二维码:</span>
                  <el-upload
                    :file-list="qrcodeFileList"
                    :on-preview="logoPreview"
                    :on-remove="qrcodeRemove"
                    :on-success="qrcodeSuccess"
                    :before-upload="beforeAvatarUpload"
                    list-type="picture-card"
                    class="qrcode_uploader"
                    action="https://imgsrc.ishanshan.com/gimg/upload"
                  >
                    <i class="el-icon-plus" />
                    <span style="color:#666">上传图片</span>

                  </el-upload>
                  <p class="logo_tip">支持png、jpg、jpeg、gif格式的图片,图片大小小于2M!</p>
                </el-form-item>
              </div>

              <el-form-item
                label="营业时间:"
                prop="serverTime"
              >
                <el-input
                  v-model="campusData.serverTime"
                  clearable
                  placeholder="限100字"
                />
              </el-form-item>
              <el-form-item
                label="适用年龄:"
                prop="ageTag"
              >
                <el-radio-group v-model="radioData.ageRange">
                  <el-radio label="1">显示</el-radio>
                  <el-radio label="0">隐藏</el-radio>
                </el-radio-group>
                <el-input
                  v-model="campusData.ageTag"
                  clearable
                  placeholder="限40字"
                />
              </el-form-item>
              <el-form-item
                label="业务范围:"
                prop="categoryTag"
                class="categoryTag"
                label-width="100px"
              >
                <el-radio-group v-model="radioData.busnessRange">
                  <el-radio label="1">显示</el-radio>
                  <el-radio label="0">隐藏</el-radio>
                </el-radio-group>
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
                <el-radio-group v-model="radioData.orgAlbum">
                  <el-radio label="1">显示</el-radio>
                  <el-radio label="0">隐藏</el-radio>
                </el-radio-group>
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
                  <span>上传</span>
                </el-upload>
                <div style="color:#999;font-size:12px">支持png、jpg、jpeg、gif格式的图片，不大于5M。支持mp4格式的视频，不大于80M。</div>
              </el-form-item>
              <el-form-item
                label="机构简介:"
                prop="intro"
              >
                <span slot="label"><i class="fake_require">*</i>机构简介:</span>
                <el-radio-group v-model="radioData.orgIntro">
                  <el-radio label="1">显示</el-radio>
                  <el-radio label="0">隐藏</el-radio>
                </el-radio-group>

                <RichTextEdit
                  ref="richEdit"
                  v-model="iptCont"
                  :edit-style="{width: '100%', height: '500px'}"
                  no-video
                />
                <!-- <el-input
                  v-model="campusData.intro"
                  :rows="5"
                  type="textarea"
                  clearable
                  placeholder="限2000字"
                /> -->
              </el-form-item>
              <el-form-item
                label="师资力量:"
                prop="teachers"
                checked
              >
                <el-radio-group v-model="radioData.orgFaculty">
                  <el-radio label="1">显示</el-radio>
                  <el-radio label="0">隐藏</el-radio>
                </el-radio-group>
                <div v-if="radioData.orgFaculty === '1'">
                  <div
                    v-for=" (item,index) in campusData.teachers"
                    :key="index"
                    class="teach_box"
                  >
                    <div class="teach_box_title">
                      <span>老师信息</span>
                      <el-button
                        type="text"
                        class="delete_icon"
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
                        },{ max:500, message: '最多可输入500字', trigger: 'blur' }]"
                        label="老师简介："
                      >
                        <el-input
                          :autosize="{ minRows: 2, maxRows: 4}"
                          v-model="item.teacherIntro"
                          type="textarea"
                          size="mini"
                          placeholder="限500字"
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
                      <!-- <i
                      class="el-icon-remove-outline delete_icon"
                      @click="deleteTeachData(index)"
                    /> -->
                    </div>
                  </div>
                  <el-button
                    type="primary"
                    class="add_btn"
                    style="display:block"
                    @click="addTeachData()"
                  >添加师资展示</el-button>
                </div>
              </el-form-item>
              <el-form-item
                label="机构设施:"
                prop="utilityTag"
                class="categoryTag"
                label-width="100px"
              >
                <el-radio-group v-model="radioData.orgFacility">
                  <el-radio label="1">显示</el-radio>
                  <el-radio label="0">隐藏</el-radio>
                </el-radio-group>
                <el-checkbox-group
                  v-if="radioData.orgFacility === '1'"
                  v-model="campusData.utilityTag"
                >
                  <el-checkbox
                    v-for="(item,index) in utilityCategory"
                    :label="item.value"
                    :key="index"
                  >{{ item.text }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
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
              <el-form-item
                label="联系电话:"
                prop="tel"
                checked
              >
                <el-input
                  v-model="campusData.tel"
                  maxlength="25"
                  size="mini"
                  clearable
                  placeholder="请填写联系方式"
                  checked
                />
              </el-form-item>
            </el-form>

          </div>
        </div>
      </div>
      <!-- 查看图片轮播详情 -->
      <Imgpreview v-if="dialogVisible" :list="listALL" @message="hiDcloe"/>

      <el-dialog
        :visible.sync="preVisible"
        title="预览"
        append-to-body
        width="500px"
        custom-class="preview_img"
      >
        <div style="width:100%;height:100%;text-align:center">
          <img
            :src="previewPic"
            style="height: 450px;"
            alt="预览"
          >
        </div>
      </el-dialog>
    </div>
  </transition>
</template>
<script>
import { getOrgan, dictOrgan, updateOrgan, queryConfig, changeConfig } from '@/api/microWeb/webPreview'
import { Loading } from 'element-ui'
import area from '@/utils/area'
import baiduMap from '@/views/orgSet/campusSet/baiduMap'
import Confirm from '@/components/MiniCommon/Confirm'
import Imgpreview from '@/components/ImgPreview/imgpre'
import RichTextEdit from '@/components/RichTextEdit/RichTextEdit'

export default {
  components: {
    baiduMap,
    Confirm,
    Imgpreview,
    RichTextEdit
  },
  props: {
    'visible': {
      type: Boolean,
      default: true
    },
    'imglist': {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      listALL: {},
      windowH: '',
      sendD: { oid: this.$store.getters.orgId, tid: this.$store.getters.tenantId },
      showN: true,
      videoForm: '',
      previewImg: '',
      visible2: false,
      visible3: false,
      isVisible: this.visible,
      img: 'https://img.ishanshan.com/gimg/n/20190116/e8a4dcec601a9f23ef2c97826cee671a',
      nav: { homeTab: '',
        courseTab: '',
        activityTab: '',
        gameTab: '',
        liveCfg: '',
        otherTab: '' },
      addLessonDialogTitlt: '设置首页',
      radioData: {
        officialAcc: '0', // 是否展示关注公众号
        ageRange: '1',
        busnessRange: '1',
        orgAlbum: '1',
        orgIntro: '1',
        orgFaculty: '1',
        orgFacility: '1'
      },

      lngData: '',
      choiceLocation: '北京',
      areaList: area,
      // cities: cityOptions,
      areaProp: {
        value: 'name',
        label: 'name'
      },
      saveLocation: '',
      dialogVisible: false,
      pictureCard: '',
      organCategory: [], // 业务范围
      utilityCategory: [], // 机构设施
      teachersIndex: '',
      imageFileList: [],
      wxLogo: '',
      logoFileList: [],
      qrcodeFileList: [],

      preVisible: false, // 预览
      previewPic: '', // 预览图

      iptCont: '', // 内容简介富文本
      orgInfo: {}, // 机构信息
      campusData: {
        wxLogo: '', // 公众号logo
        officialName: '', // 公众号名称
        qrCode: '', // 公众号二维码
        name: '',
        serverTime: '周一至周日 09:00~21:00',
        ageTag: '',
        addrColumn: [],
        addr: '',
        province: '',
        city: '',
        area: '',
        categoryTag: [],
        utilityTag: [],
        images: [],
        teachers: [],
        intro: '',
        tel: ''
      },
      rules: {
        officialName: [
          { required: true, message: '请输入公众号名称', trigger: 'change' },
          { max: 15, message: '最多可输入15字', trigger: 'change' }
        ],
        serverTime: [
          { required: true, message: '请填写营业时间' },
          { max: 100, message: '限100字', trigger: 'blur' }
        ],
        images: [
          { required: true, message: '未上传图片：请上传图片', trigger: 'change' }
        ],
        addrColumn: [{ required: true, message: '请选择机构地址', trigger: 'change' }],
        addr: [{ required: true, message: '请输入详细机构地址', trigger: 'change' }],
        // picDetail: [
        //   { required: true, message: '支持png、jpeg、gif格式的图片，建议宽高 750*400px，图片大小不大于2M！', trigger: 'change' }
        // ],
        categoryTag: [{ required: true, message: '请勾选业务范围', trigger: ['blur', 'change'] }],
        utilityTag: [{ required: true, message: '请勾选机构设施', trigger: ['blur', 'change'] }],
        ageTag: [{ max: 40, message: '限40字', trigger: 'change' },
          { required: true, message: '请输入适用年龄', trigger: 'blur' }],
        // intro: [{ required: true, max: 2000, message: '不能超过2000字', trigger: 'blur' }],
        teachers: [{ required: true, trigger: 'change', message: '请添加师资展示' }],
        tel: [
          { required: true, message: '请输入座机号或者手机号', trigger: 'blur' },
          // { pattern: /^1[3456789]\d{9}$/, message: '输入格式错误', trigger: 'blur' }
          { pattern: /^[0-9]*$/, message: '输入格式错误', trigger: 'blur' }
        ]
      }
    }
  },

  watch: {
    'visible'(val) {
      this.isVisible = val
    },
    'isVisible'(val) {
      this.$emit('update:visible', val)
    },

    'radioData.officialAcc'(val) {
      if (val === '1') {
        this.$nextTick(() => {
          const uploadBox = document.querySelector('.logo_uploader .el-upload--picture-card')
          if (this.logoFileList && this.logoFileList.length > 0) {
            uploadBox.style.display = 'none'
          } else {
            uploadBox.style.display = 'inline-block'
          }

          const qrcodeBox = document.querySelector('.qrcode_uploader .el-upload--picture-card')
          if (this.qrcodeFileList && this.qrcodeFileList.length > 0) {
            qrcodeBox.style.display = 'none'
          } else {
            qrcodeBox.style.display = 'inline-block'
          }
        })
      }
    }
  },
  mounted() {
    this.getDictOrgan()
    this.getOrganList()
    this.queryConfig()
    this.windowH = document.body.clientHeight + 'px'
  },
  methods: {
    hiDcloe(val) {
      this.dialogVisible = val
    },
    // 业务范围
    getDictOrgan() {
      dictOrgan().then(res => {
        if (res.data.errorCode === 0) {
          let organCategory = []
          let utilityCategory = []
          res.data.dictItemList.forEach(v => {
            if (v.code === 'organcategory') {
              organCategory = v.items
            }
            if (v.code === 'utilitytag') {
              utilityCategory = v.items
            }
          })
          this.organCategory = organCategory
          this.utilityCategory = utilityCategory
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    // 初始化信息
    getOrganList() {
      getOrgan().then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.intro && res.data.intro.indexOf('<') === -1) {
            const intro = `<p>${res.data.intro}</p>`
            this.iptCont = intro
          } else {
            this.iptCont = res.data.intro
          }
          // this.campusData = res.data
          const { data } = res
          this.orgInfo = { ...data }
          this.campusData.ageTag = data.ageTag || ''
          this.campusData.tel = data.tel || ''
          this.campusData.addr = data.addr || ''
          this.campusData.province = data.privince || ''
          this.campusData.city = data.city || ''
          this.campusData.area = data.area || ''
          this.campusData.serverTime = res.data.serverTime || ''
          // this.campusData.teachers = Object.assign([], JSON.parse(res.data.teachers))
          const teacherData = JSON.parse(res.data.teachers)
          this.campusData.teachers = teacherData ? Object.assign([], teacherData) : Object.assign([], [{ teacherName: '', teacherImg: '', teacherIntro: '' }])
          this.campusData.addrColumn = Object.assign([], JSON.parse(res.data.addrColumn))
          this.campusData.categoryTag = res.data.categoryTag ? res.data.categoryTag.split(',') : []
          this.campusData.utilityTag = data.utilityTag ? data.utilityTag.split(',') : []
          if (!res.data.images) {
            this.campusData.images = []
          } else {
            this.campusData.images = Object.assign([], res.data.images.split(','))
            this.campusData.images.forEach((v, index) => {
              const data = {
                name: index,
                url: v,
                response: { url: v }
              }
              this.imageFileList.push(data)
              this.$nextTick(function() {
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
              })
            })
          }
          this.choiceLocation = this.campusData.addrColumn.join(',') + data.addr
          // 关注公众号
          const oaInfo = res.data.oaInfo && res.data.oaInfo !== '' ? JSON.parse(res.data.oaInfo) : {}
          this.campusData.officialName = oaInfo.name
          this.wxLogo = oaInfo.logo
          this.logoFileList = oaInfo.logo && oaInfo.logo !== '' ? [{ name: `${oaInfo.name}.jpg`, url: oaInfo.logo }] : []
          this.qrcodeFileList = oaInfo.qrcode && oaInfo.qrcode !== '' ? [{ name: `${oaInfo.name}code.jpg`, url: oaInfo.qrcode }] : []
          this.campusData.wxLogo = oaInfo.logo
          this.campusData.qrCode = oaInfo.qrcode
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    // 初始化隐藏与否数据
    queryConfig() {
      queryConfig().then(res => {
        if (res.data.errorCode === 0) {
          res.data.results.menuConfig.map((val) => {
            this.radioData[val.name] = String(val.show)
            for (var index in this.nav) {
              if (index === val.name) {
                this.nav[val.name] = val.title
                this.nav[val.name + 'Show'] = val.show
              }
            }
          })
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    close() {
      this.isVisible = false
      this.visible2 = false
      this.visible3 = false
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.radioData.officialAcc === '1') {
            if (!this.wxLogo || this.wxLogo === '') {
              this.$message.error('请上传公众号logo')
              return
            }
            if (!this.campusData.qrCode || this.campusData.qrCode === '') {
              this.$message.error('请上传公众号二维码')
              return
            }
          }
          if (this.radioData.orgIntro === '1' && !(this.iptCont && this.iptCont !== '')) {
            this.$message.error('请输入机构简介')
            return
          }

          const oaInfo = {
            name: this.campusData.officialName,
            logo: this.wxLogo,
            qrcode: this.campusData.qrCode
          }

          const data = {
            id: this.orgInfo.id,
            orgName: this.orgInfo.orgName,
            tel: this.campusData.tel,
            intro: this.iptCont,
            serverTime: this.campusData.serverTime,
            ageTag: this.campusData.ageTag,
            addrColumn: JSON.stringify(this.campusData.addrColumn),

            privince: this.campusData.province,
            city: this.campusData.city,
            area: this.campusData.area,
            addr: this.campusData.addr,

            categoryTag: this.campusData.categoryTag.join(','),
            utilityTag: this.campusData.utilityTag.join(','),
            images: this.campusData.images.join(','),
            teachers: JSON.stringify(this.campusData.teachers),
            lng: this.lngData.lng,
            lat: this.lngData.lat,

            contacts: this.orgInfo.contacts,
            schoolLogo: this.orgInfo.schoolLogo,
            oaInfo: JSON.stringify(oaInfo),
            officialAcc: this.radioData.officialAcc
          }
          console.log('data', data)
          updateOrgan(data).then(res => {
            if (res.data.errorCode === 0) {
              this.visible3 = false
              this.isVisible = false
              // this.getOrganList()
              this.$emit('refreshPage')
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
          const radioObj = { ...this.radioData }
          delete radioObj.officialAcc
          console.log('radioObj', radioObj)
          changeConfig({ tabsAndStatus: JSON.stringify(radioObj), id: this.$parent.id }).then(res => {
            if (res.data.errorCode === 0) {
              // this.queryConfig()
              this.$message.success('保存成功')
            } else {
              this.$message.error(res.errorMessage)
            }
          })
        } else {
          return false
        }
      })
    },

    // logo预览
    logoPreview(file) {
      this.preVisible = true
      this.previewPic = file.url
    },

    // logo删除
    logoRemove() {
      this.logoFileList = []
      this.wxLogo = ''
      this.campusData.wxLogo = ''
      const uploadBox = document.querySelector('.logo_uploader .el-upload--picture-card')
      uploadBox.style.display = 'inline-block'
    },

    /** 公众号logo上传成功 */
    wxLogoSuccess(response, file, fileList) {
      this.logoFileList = [...fileList]
      this.campusData.wxLogo = response.url
      this.wxLogo = response.url
      this.$forceUpdate()
      if (response.url && response.url !== '') {
        this.$message.success('上传成功')
        const uploadBox = document.querySelector('.logo_uploader .el-upload--picture-card')
        uploadBox.style.display = 'none'
      }
    },

    // 二维码删除
    qrcodeRemove() {
      this.qrcodeFileList = []
      this.campusData.qrCode = ''
      const uploadBox = document.querySelector('.qrcode_uploader .el-upload--picture-card')
      uploadBox.style.display = 'inline-block'
    },

    /** 公众号二维码上传成功 */
    qrcodeSuccess(response, file, fileList) {
      this.campusData.qrCode = response.url
      this.$forceUpdate()
      if (response.url && response.url !== '') {
        this.$message.success('上传成功')
        const uploadBox = document.querySelector('.qrcode_uploader .el-upload--picture-card')
        uploadBox.style.display = 'none'
      }
    },

    // 上传图片
    handleAvatarSuccess(index, res, file) {
      this.campusData.teachers[this.teachersIndex].teacherImg = res.response.url
      // console.log(res)
      if (res.url !== '') {
        this.$message({
          message: '上传成功',
          type: 'success',
          center: true
        })
      }
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
    beforeAvatarUpload(file) {
      // 图片
      // const isAccept = file.type === 'image/jpeg' || 'image/jpg' || 'image/png' || 'image/gif'
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
    // 预览
    handlePictureCardPreview(file) {
      const index = this.campusData.images.indexOf(file.response.url)
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
    changeV(fileList) {
      const liIMG = this.$refs.videIMG.$children[0].$el.children
      // console.log(liIMG, 'liIMG')
      // console.log(fileList, 'fileList')
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
    // 添加详情
    addTeachData() {
      // if (this.campusData.teachers.length > 9) {
      //   this.$message.warning('教师消息至多十条')
      // } else {
      // const deleBtnArr = document.querySelectorAll('.delete_icon')
      // deleBtnArr[0].style.display = 'inline-block'
      const data = {
        teacherName: '',
        teacherIntro: '',
        teacherImg: ''
      }
      this.campusData.teachers.push(data)
      // }
    },
    // 删除详情
    deleteTeachData(val) {
      if (this.campusData.teachers.length <= 1) {
        // const deleBtn = document.querySelector('.delete_icon')
        // deleBtn.style.display = 'none'
        this.$message.warning('教师消息至少保留一条')
      } else {
        this.campusData.teachers.splice(val, 1)
      }
      // this.campusData.teachers.splice(val, 1)
    },
    // 地图
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
    // 机构设施处理处理
    utilityLabel(values) {
      const items = []
      this.utilityCategory.forEach(item => {
        if (values.indexOf(item.value) > -1) {
          switch (item.value) {
            case '101':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/6c1735716d135a51f7d5472c1d3c41c6'
              break
            case '102':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/f2e7d2e414bfa11d1619f68799ca39bc'
              break
            case '103':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/2128bf4b593cd125480ee36728fcf206'
              break
            case '104':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/2349ceb503ad2256627c0d8ec178bee7'
              break
            case '105':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/2e93d8aaef852f00c06e7b313f72114d'
              break
            case '106':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/cbea5c12d83e76c9393a669f285bcced'
              break
            case '107':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/db145dae09819d8c4193f423da1e4cf4'
              break
            case '108':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/8584d4c9e5474c212dec463d3c7aaded'
              break
            case '109':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/351ebb07a76dc5a8f9200e124af3f70c'
              break
            case '110':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/30d13c63d90cd251e992cd0338f8ea16'
              break
            case '111':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/2b54b4f601f66d3446cb0a98f68c3e94'
              break
            case '112':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/61a60e294b9662b130904123458b5c2c'
              break
            case '113':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/cfa4cbbff5a207a9466047a005ad96b6'
              break
            case '114':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/04edca4320cf1160a1073ddaea70a391'
              break
            case '115':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/085367478a5825d4d0891077f4181727'
              break
            case '116':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/8621a39fedc4b245b01fb397227079e3'
              break
            case '117':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/5fe7a0e7c8928f483a7dcd98490b32cf'
              break
            default:
              item.img = ''
              break
          }

          items.push(item)
        }
      })
      return items
    },
    // 业务范围label显示处理
    typeLabel(values) {
      const labels = []
      this.organCategory.forEach(item => {
        const index = values.indexOf(item.value)
        if (index > -1) {
          labels.push(item.text)
        }
      })
      return labels
    },
    typeChange(val) {
      const str = val.length > 0 ? val.join('') : ''
      return str
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

.fake_require{
  color: #f56c6c;
  margin-right: 4px;
}
.logo_tip{
  color: rgb(153, 153, 153);
  font-size: 12px;
}
.offical_account_form{
  margin-left: 80px;
}
.official_account{
  margin: 20px 10px 10px;
  background: #c4d4e9;
  border-radius: 5px;
  height: 44px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  .wx_logo{
    width: 34px;
    height: 34px;
    background: #eee;
    border: 1px solid #3C71B7;
    border-radius: 50%;
    margin-right: 10px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    img{
      width: 32px !important;
      height: 32px !important;
    }
  }
  .wx_name{
    flex: 1;
    color: #3C71B7;
  }
  .wx_focus{
    margin-left: 10px;
    background: #3C71B7;
    line-height: 27px;
    padding: 0 10px;
    border-radius: 14px;
    color: #fff;
    font-size: 12px;
  }
}

.wrapsA /deep/ .el-upload-list--picture-card .el-upload-list__item-thumbnail{
  height: auto;
}
.side-zhezhao {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0px;
  right: 0px;
  z-index: 2000;
  // z-index: 10000;
}

.side-dialog {
  top: 0px;
  right: 0px;
  z-index: 1000;
  width: calc(100% - 150px);
  position: fixed;
  // margin-left: -20px;
  height: 100%;
  background-color: rgba(255, 255, 255, 1);
  -moz-box-shadow: 2px 2px 5px #333333;
  -webkit-box-shadow: 2px 2px 5px #333333;
  box-shadow: 2px 2px 5px #333333;
  // padding: 0 20px;
  // overflow-x: hidden;
  // overflow-y: auto;
  .top {
    // width: calc(100vw - 180px) !important;
    min-height: 40px;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    padding: 20px 0 14px 0;
    margin-left: 20px;
    .top-left {
      display: flex;
      font-size: 16px;
      // margin-top: 10px;
    }
    .top-right {
      display: flex;
      .el-button {
        margin-left: 10px;
        // margin-bottom: 10px;
      }
    }
  }
  .body {
    display: flex;
    padding: 20px 0;
    height: calc(100vh - 64px);
    overflow: auto;

    // -------------左侧手机预览 start----------------------------------------
    .body-leftBox {
      min-width: 436px;
      padding: 30px 30px 0;
      background: rgba(240, 242, 245, 0.8);
      margin-left: 20px;
      overflow-y: auto;
    }
    .body-left {
      width: 375px;
      height: 667px;
      margin-bottom: 30px;
      position: relative;
      box-shadow: 0 2px 7px rgba(0, 0, 0, 0.2);

      .body-left-header {
        width: 100%;
        height: 64px;
        display: flex;
        flex-direction: column;
        img {
          width: 100%;
        }
      }
      .body-left-cont {
        background: rgba(240, 242, 245, 0.6);
        height: calc(100% - 114px);
        overflow: auto;
        -ms-overflow-style: none;
        &::-webkit-scrollbar {
          display: none;
        }
        .nav {
          width: 100%;
          height: 35px;

          ul {
            background: #3b71b7;
            white-space: nowrap;
            text-align: center;
            overflow: auto;
            // overflow-y: hidden;
            display: flex;
            flex-wrap: nowrap;
          }
          li {
            // color: #fdee03;
            // float: left;
            // width: 70px;
            padding: 0 30px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            color: #fff;
            font-size: 14px;
            background: #3b71b7;
          }
          .firstNav {
            border-bottom: 3px solid #fdee03;
            color: #fdee03;
          }
        }
        .orgInfo {
          background: #fff;
          margin: 10px 0 0 0;
          padding: 0 20px;
          .orgAddress {
            border-bottom: 1px solid #ddd;
            height: 35px;
            line-height: 35px;
            .el-icon-location {
              margin-right: 2px;
              font-size: 16px;
              color: rgb(229, 70, 111);
            }
          }
          .orgTime {
            // height: 35px;
            line-height: 15px;
            padding: 10px 0;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            div span {
              // border-right: 1px solid #ccc;
              padding-right: 10px;
              padding-left: 2px;
            }
            .el-icon-time {
              font-size: 16px;
              color: #3f479b;
            }
            .el-icon-phone {
              font-size: 16px;
              color: #3b72b7;
              margin-left: 10px;
            }
          }
        }
        .orgItem {
          background: #fff;
          margin: 10px 0 0 0;
          padding: 10px 20px;
          .tit {
            height: 25px;
            i {
              display: inline-block;
              vertical-align: top;
              width: 10px;
              height: 18px;
              margin-right: 10px;
              background: #3b72b7;
              margin-left: -20px;
            }
          }
          .workType {
            display: inline-block;
            padding: 2px 15px;
            background: #c4d4e9;
            color: #fff;
            margin-right: 10px;
            border-radius: 4px;
          }
          .age {
            color: #3b72b7;
            margin-right: 10px;
          }
          .albumBox {
            display: flex;
            overflow-x: auto
            // flex-wrap: wrap;
          }
          .album {
            height: 85px;
            width: 120px;
            margin-right: 10px;
            margin-top: 3px;
            img {
              width: 100%;
              height: 100%;
              border-radius: 5px;
            }
          }
          .teachItem {
            display: inline-block;
            // height: 140px;
            width: 80px;
            margin-right: 10px;
            div {
              width: 78px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .teachImg {
              width: 80px;
              height: 80px;
              img {
                width: 100%;
                height: 100%;
                border-radius: 5px;
              }
            }
            .teachName {
              text-align: center;
              font-size: 14px;
            }
            .rank {
              text-align: center;
              color: rgb(153, 153, 153);
            }
          }
          .facility {
            display: inline-block;
            text-align: center;
            // margin-right: 12px;
            width: calc(100% / 6);
            .facilityBacground {
              border-radius: 50%;
              background: #c4d4e9;
              overflow: hidden;
              width: 36px;
              height: 36px;
              margin: 0 auto 4px;
              img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
        img {
          width: 100%;
          height: 150px;
        }
        .tubiao {
          display: inline-block;
          width: 10px;
          height: 18px;
          background: #3b72b7;
          margin-right: 3px;
        }
        .course-title {
          margin-top: 10px;
          min-height: 30px;
          line-height: 20px;
          font-size: 16px;
          padding-bottom: 5px;
          word-break: break-all;
          background: #fff;
        }
        .orgDetail {
          background: #fff;
          margin-top: 10px;
          padding: 0 15px;
          .orgName {
            height: 35px;
            line-height: 35px;
            border-bottom: 1px solid #ddd;
          }
          .orgAdd {
            height: 35px;
            line-height: 35px;
            .el-icon-location {
              color: #e5466f;
              font-size: 24px;
              vertical-align: middle;
            }
            .el-icon-phone {
              font-size: 24px;
              color: #3b72b7;
              text-align: center;
              vertical-align: middle;
              display: inline-block;
              width: 15%;
            }
            span {
              display: inline-block;
              width: 70%;
              border-right: 1px solid #ddd;
              height: 24px;
              line-height: 24px;
            }
          }
        }
        .lessonDetail {
          background: #fff;
          margin-top: 10px;
          padding: 5px 0;
          .detailCont {
            padding: 0 15px;
            .detailCont-item {
              margin-top: 10px;
              font-size: 14px;
              .detailCont-item-title {
                .dian {
                  border-radius: 50%;
                  background: #3b72b7;
                  display: inline-block;
                  height: 7px;
                  margin-right: 7px;
                  width: 7px;
                }
              }
              .detailCont-item-cont {
                font-size: 12px;
                margin-top: 3px;
                margin-left: 14px;
              }
            }
          }
        }
      }
      .body-left-foot {
        position: absolute;
        height: 50px;
        background: #fff;
        width: 100%;
        box-shadow: 0 0px 20px 0px rgba(0, 0, 0, 0.2);
        .foot_item {
          width: 33.3333%;
          float: left;
          height: 100%;
          text-align: center;
          padding-top: 5px;
          .foot_item_icon {
            height: 25px;
            width: 25px;
          }
          .foot_item_title {
            color:#3b72b7;
            font-size: 10px;
            margin-top:5px;
          }
        }
      }
    }
    .facilityName {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    // -------------左侧手机预览 end----------------------------------------

    // -------------右侧表单 start----------------------------------------
    .body-right {
      width: calc(100% - 436px);
      min-width: 508px;
      margin: 0 20px;
      overflow: auto;
      padding-right: 20px;

      .el-form {
        margin-top: 10px;
      }
      .tubiao {
        display: inline-block;
        vertical-align: middle;
        background: #5d9cec;
        width: 12px;
        height: 28px;
        margin: 20px 10px 20px 20px;
      }
      .body-right-header {
        font-size: 14px;
      }
      .el-form-item__content .el-checkbox {
        margin-left: 0px !important;
        width: 100px;
      }
      .box-container {
        margin-top: 10px;
        display: flex;
        align-items: center;
        .el-icon-remove-outline {
          margin-left: 10px;
          font-size: 20px;
          color: #ccc;
          cursor: pointer;
        }
      }
      .box {
        width: 500px;
        border: 1px solid #ddd;
        padding: 20px 20px 20px 0px;
      }
      .organ_box {
        width: 400px;
        margin-bottom: 20px;
        border-radius: 5px;
        border: 1px solid rgba(221, 221, 221, 1);
        padding: 20px;
        background: #fff;
      }
      .teach_box {
        width: 400px;
        margin-bottom: 20px;
        border-radius: 5px;
        border: 1px solid rgba(221, 221, 221, 1);
        padding-top: 0;
        position: relative;
        background: #fff;
        .teach_box_title {
          height: 32px;
          width: 400px;
          line-height: 32px;
          background: rgba(240, 242, 245, 1);
          border-radius: 5px 5px 0px 0px;
          border: 1px solid rgba(221, 221, 221, 1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
          span {
            height: 12px;
            font-size: 14px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
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
      .delete_icon {
        cursor: pointer;
      }
    }
    // -------------右侧表单 end----------------------------------------
  }
}

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
<style lang="scss">
.teach_box .el-form-item .el-form-item__label {
  width: 97px !important;
}
.previewImg {
  width: 600px;
  .el-dialog__body {
    padding: 20px 20px !important;
  }
  .el-dialog__header {
    padding-bottom: 37px;
  }
}
.wrapIMall{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    width: 100%;
    height: 100%;
    z-index: 9999;
    background: rgba(0,0,0,.5)
}
.wrapIMall /deep/ .el-carousel{
  text-align: center
}
.wrapIMall /deep/ .el-carousel__indicators--outside{
  display: none
}
.wrapIMall /deep/ .el-carousel__item.is-animating{
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<style lang="scss">
.preview_img {
  .el-dialog__body{
    padding: 20px !important;
  }
}
</style>
