<template>
  <div class="campusHomepage-container">
    <div class="campusHomepage-top">微官网设置</div>
    <div class="campusHomepage-body">
      <div class="campusHomepage-contBox">
        <div class="campusHomepage-cont">
          <div class="head">
            <img
              src="https://img.ishanshan.com/gimg/user/n///1557127683.png"
              alt="手机头部"
            >
          </div>
          <div class="cont">
            <div style="width:100%;height:150px">
              <el-carousel indicator-position="outside">
                <el-carousel-item
                  v-for="item in imgListArr"
                  :key="item.id"
                >
                  <video
                    v-if="item.picUrl.indexOf('mp4') !== -1"
                    :src="item.picUrl"
                    width="100%"
                    height="100%"
                    style="object-fit:cover;border-radius:5px"
                  />
                  <img
                    v-else
                    :src="item.picUrl"
                    width="100%"
                    height="100%"
                  >
                </el-carousel-item>
              </el-carousel>
            </div>
            <div class="nav">
              <ul ref="navList">
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
            <div v-if="nav.officialAccShow === 1" class="official_account">
              <div class="wx_logo">
                <img v-if="oaInfo.logo && oaInfo.logo !== ''" :src="oaInfo.logo">
              </div>
              <span class="wx_name">{{ oaInfo.name || '--' }}</span>
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
              v-if="nav.ageRangeShow === 1"
              class="orgItem"
            >
              <div class="tit"><i />适合年龄</div>
              <span class="age">
                {{ campusData.ageTag }}
              </span>
            </div>
            <div
              v-if="nav.busnessRangeShow === 1"
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
              v-if="nav.orgAlbumShow === 1"
              class="orgItem"
            >
              <div class="tit"><i />环境相册</div>
              <div style="display:flex;overflow-x:auto">
                <div
                  v-for="(item,index) in campusData.images"
                  :key="index"
                  class="album"
                >
                  <video
                    v-if="item.indexOf('mp4') !== -1"
                    :src="item"
                    width="120px"
                    height="80px"
                    style="object-fit:cover;border-radius:5px"
                  />
                  <div
                    v-else
                    :style="{backgroundImage: `url(${item})`, height: '80px', width: '120px',borderRadius:'5px',backgroundSize:'cover',backgroundPosition:'center center'}"
                  />
                </div>
              </div>
            </div>
            <div
              v-if="nav.orgIntroShow === 1"
              class="orgItem"
            >
              <div class="tit"><i />机构简介</div>
              <div class="intro">
                <div v-html="campusData.intro">{{ campusData.intro }}</div>
              </div>
            </div>
            <div
              v-if="nav.orgFacultyShow === 1"
              class="orgItem"
            >
              <div class="tit"><i />师资力量</div>
              <div style="display: flex;overflow-x: auto;">
                <div
                  v-for="(data,index) in campusData.teachers"
                  :key="index"
                  class="teachItem"
                >
                  <div :style="{backgroundImage: `url(${data.teacherImg})`, height: '80px', width: '80px',borderRadius:'5px',backgroundSize:'cover',backgroundPosition:'center center'}" />
                  <p class="teachName">{{ data.teacherName }}</p>
                  <p class="rank">{{ data.teacherIntro }}</p>
                </div>
              </div>
            </div>
            <div
              v-if="nav.orgFacilityShow === 1"
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
            <div style="width:200px;height:50px" />
          </div>
          <div class="foot">
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
      <div class="campusHomepage-right">
        <div style="display:flex">
          <el-button
            v-if="hasBtn('302000001')"
            type="primary"
            @click="addLessonShow()"
          >设置首页</el-button>
          <hoverBtn
            :org-home="orgHome"
            style="margin-left:10px"
          />
          <hoverBtn
            :org-home="orgHome"
            style="margin-left:10px"
            page="personCnter"
          />

        </div>
        <div class="table">
          <div class="table-top"><i />菜单设置</div>
          <CommonTable
            ref="tableCommon"
            :columns="columns"
            :options="options"
            :operation="operates"
            :is-border="isBorder"
            :data-source="dataSource"
            :loading="loading"
            :table-height="tableHeight"
          />
        </div>
      </div>

    </div>
    <menuSet ref="menuSetDialog" />
    <homePageSetting
      v-if="homePageSettingShow"
      ref="homePageSettingDialog"
      :visible.sync="homePageSettingShow"
      :imglist.sync="imgListArr"
      @refreshPage="refreshPage"
    />

    <LiveTip ref="liveTip" />
  </div>
</template>
<script>
import CommonTable from '@/components/CommonTable/CommonTable'
import { queryConfig, changeConfig, getOrgan, dictOrgan } from '@/api/microWeb/webPreview'
import { queryOrgBanner } from '@/api/microWeb/rotation.js'
import menuSet from './components/menuSet'
import hoverBtn from './components/hoverBtn'
import homePageSetting from './components/homePageSetting'
import LiveTip from './components/LiveTip'

export default {
  components: {
    CommonTable,
    menuSet,
    hoverBtn,
    homePageSetting,
    LiveTip
  },
  data() {
    return {
      imgListArr: [],
      id: '',
      orgHome: '', // 微官网地址
      setObj: {},
      organCategory: [],
      utilityCategory: [],
      // 手机初始参数
      oaInfo: {}, // 关注公众号信息
      campusData: {
        name: '',
        serverTime: '周一至周日 09：00~21：00',
        ageTag: '0~8岁',
        addrColumn: [],
        address: '',
        province: '',
        city: '',
        area: '',
        categoryTag: [],
        utilityTag: [],
        images: ['https://img.ishanshan.com/gimg/n/20190320/e6ac78d3554f3d45833f6e6db62861f7',
          'https://img.ishanshan.com/gimg/n/20190320/407a2913b00b8682ef56dfd7e9f6edfd',
          'https://img.ishanshan.com/gimg/n/20190320/8a861bf1883567a46c6c556cbc09a278'],
        teachers: [{
          teacherName: 'Susan老师',
          teacherIntro: '欢动课、艺术课授课老师',
          teacherImg: 'https://img.ishanshan.com/gimg/n/20190320/104625eeeed854f0fad1516abe42129f'
        }, {
          teacherName: 'Sasa老师',
          teacherIntro: '音乐课老师',
          teacherImg: 'https://img.ishanshan.com/gimg/n/20190320/f6adbb17eff29a87478b2d02585bef3d'
        }, {
          teacherName: 'Tina老师',
          teacherIntro: '舞蹈老师',
          teacherImg: 'https://img.ishanshan.com/gimg/n/20190320/c2504bf62b74e6d5051c6db8eabe2cb7'
        }],

        intro: '闪闪早教，专业致力于给机构一套完整、系统、操作便捷的早教专业SAAS系统，全力打造“互联网+教育”平台，为教育机构提供专属智能化解决方案！我们相信，行业的深度决定自身的高度，期待您来进一步了解！'

      },
      // 首页设置
      homePageSettingShow: false,
      nav: {
        homeTab: '',
        courseTab: '',
        activityTab: '',
        gameTab: '',
        liveCfg: '',
        otherTab: '',
        ageRange: '1', // 适合年龄
        busnessRange: '1', // 业务范围
        orgAlbum: '1', // 环境相册
        orgIntro: '1', // 机构简介
        orgFaculty: '1', // 师资力量
        orgFacility: '1', // 机构设施
        officialAcc: '1' // 关注公众号
      },
      // 表格参数

      dataSource: [],
      loading: false,
      operates: {
        width: '200px',
        fixed: 'right',
        list: [
          {
            label_1: '隐藏',
            label_2: '显示',
            type: 'unnormal',
            prop: 'show',
            disabled: '9',
            method: (row) => {
              // 直播权限判断
              if (row.name === 'liveCfg' && !this.hasMenu('5100000')) {
                this.$refs.liveTip.show()
                return
              }

              if (row.show === 1) {
                row.show = 0
              } else {
                row.show = 1
              }
              const loading = this.$loading({
                lock: true,
                text: '拼命加载中。。。',
                spinner: 'el-icon-loading',
                fullscreen: true,
                target: document.querySelector('.campusHomepage-container')
              })
              changeConfig({ tabsAndStatus: JSON.stringify({ [row.name]: row.show }), id: this.id }).then(res => {
                if (res.data.errorCode === 0) {
                  this.openStopHandle(row)
                } else {
                  this.$message.error(res.errorMessage)
                }
                loading.close()
              })
            },
            popoverCon: [
              {
                contentText: '确认要隐藏吗？',
                status: '1'
              }, {
                contentText: '确认要显示吗？',
                status: '0'
              }
            ]
          },
          {
            label: '编辑',
            method: (row) => {
              // 直播权限判断
              if (row.name === 'liveCfg' && !this.hasMenu('5100000')) {
                this.$refs.liveTip.show()
                return
              }

              this.setObj = row
              if (row.type !== 1) {
                this.menuSetDialogShow(row)
                this.$refs.menuSetDialog.addressVisible = false
                this.$refs.menuSetDialog.menuSetForm.menuTitle = row.title
              } else {
                this.menuSetDialogShow(row)
                this.$refs.menuSetDialog.addressVisible = true
                this.$refs.menuSetDialog.menuSetForm.menuTitle = row.title
              }
            }
          }
        ]
      },
      columns: [
        {
          label: '菜单名称',
          prop: 'title',
          isShowSet: true,
          width: '150',
          isShowTooltip: true
        },
        {
          label: '状态',
          prop: 'show',
          isShowSet: true,
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.show === 0) {//eslint-disable-line
              return `<div >隐藏</div>`
            } else {
              return `<div >显示</div>`
            }
          }
        }
      ],
      options: {
        isSettingShow: true // 是否出现设置
        // apiService: queryConfig
        // 表格的数据请求接口
      },
      tableHeight: 'calc(100vh - 400px)',
      isBorder: true
    }
  },
  mounted() {
    this.getDictOrgan()
    this.queryConfig()
    this.getOrganList()
  },
  methods: {
    // 数组转换字符串
    typeChange(val) {
      const str = val.length > 0 ? val.join('') : ''
      return str
    },
    // 初始信息（左侧手机）
    getOrganList() {
      getOrgan().then(res => {
        if (res.data.errorCode === 0) {
          this.campusData = res.data
          this.campusData.teachers = Object.assign([], JSON.parse(res.data.teachers))
          this.campusData.addrColumn = Object.assign([], JSON.parse(res.data.addrColumn))
          if (res.data.categoryTag) {
            this.campusData.categoryTag = res.data.categoryTag.split(',')
          } else {
            this.campusData.categoryTag = []
          }
          if (res.data.utilityTag) {
            this.campusData.utilityTag = res.data.utilityTag.split(',')
          } else {
            this.campusData.utilityTag = []
          }
          if (!res.data.images) {
            this.campusData.images = []
          } else {
            this.campusData.images = Object.assign([], res.data.images.split(','))
          }
          // 关注公众号
          this.oaInfo = res.data.oaInfo && res.data.oaInfo !== '' ? JSON.parse(res.data.oaInfo) : {}
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    menuSetDialogShow(row) {
      this.$refs.menuSetDialog.menuSetShow = true
    },
    // 刷新页面
    refreshPage() {
      this.queryConfig()
      this.getOrganList()
    },
    // 首页设置
    addLessonShow() {
      this.homePageSettingShow = true
    },
    openStopHandle(row) {
      const name = row.name + 'Show'
      if (row.show === 1) {
        this.nav[name] = 1
      } else {
        this.nav[name] = 0
      }
      this.$forceUpdate()
    },
    // 初始化数据
    queryConfig() {
      queryConfig().then(res => {
        if (res.data.errorCode === 0) {
          const arr = []
          const sourceArr = []
          res.data.results.menuConfig.map((val) => {
            if (val.type !== 2) {
              sourceArr.push(val)
            }
            arr.push(val)
          })
          this.dataSource = sourceArr
          this.id = res.data.results.id
          this.orgHome = res.data.results.orgHome
          arr.map(val => {
            const name = val.name
            this.nav[name] = val.title
            this.nav[name + 'Show'] = val.show
          })
        } else {
          this.$message.error(res.errorMessage)
        }
      })

      queryOrgBanner().then(res => {
        if (res.data.errorCode === 0) {
          // console.log(res)
          // 轮播图渲染
          this.imgListArr = res.data.results
        } else {
          this.$message.error(res.errorMessage)
        }
      })
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
    }
  }
}
</script>
<style lang="scss" scoped>

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
      width: 32px;
      height: 32px;
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

.campusHomepage-container /deep/ {
  .el-table--border {
    border-bottom: 1px solid #ebeef5;
  }
}
.campusHomepage-container /deep/ .el-carousel__container {
  height: 150px;
}
.campusHomepage-container /deep/ .el-carousel__indicators--outside {
  display: none;
}
.campusHomepage-container {
  width: calc(100%);
  height: calc(100vh - -25px);
  padding: 0 20px;
  overflow-x: hidden;
  overflow-y: auto;
  .campusHomepage-top {
    width: 100%;
    padding-top: 20px;
    padding-bottom: 14px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
  }
  .campusHomepage-body {
    display: flex;
    margin-top: 20px;
    margin-bottom: 50px;
    height: calc(100vh - 142px);
    overflow: auto;
    .campusHomepage-contBox {
      width: 435px;
      padding: 0 30px;
    }
    .campusHomepage-cont {
      width: 100%;
      height: 667px;
      box-shadow: 0 2px 7px rgba(0, 0, 0, 0.2);
      margin-bottom: 20px;
      position: relative;
    }
    .head {
      width: 100%;
      height: 64px;
      display: flex;
      flex-direction: column;
      img {
        width: 100%;
      }
    }
    .cont {
      width: 100%;
      background: rgba(240, 242, 245, 0.6);
      overflow-x: hidden;
      overflow-y: auto;
      height: calc(100% - 114px);

      .topImg {
        width: 100%;
        height: 150px;
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
        .album {
          height: 85px;
          width: 120px;
          margin-right: 10px;
          display: inline-block;
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
          p {
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
          .facilityName {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
      }
    }
    .foot {
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
    .campusHomepage-right {
      margin-left: 20px;
      .table {
        margin-top: 50px;
        .table-top {
          margin-bottom: 15px;
          i {
            display: inline-block;
            vertical-align: top;
            margin-right: 10px;
            width: 8px;
            height: 14px;
            background: rgba(70, 182, 238, 1);
            border-radius: 3px;
          }
        }
      }
    }
  }
}
</style>
