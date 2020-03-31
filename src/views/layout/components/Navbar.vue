<template>
  <div class="navbar">
    <!-- <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/> -->

    <!-- <breadcrumb class="breadcrumb-container"/>  -->
    <!-- <div class="left-menu">{{ orgName }}</div> -->
    <div class="right-menu">
      <el-dropdown
        trigger="hover"
        size="medium"
      >
        <div class="userName">
          <img src="https://img.ishanshan.com/gimg/n/20190109/ca0a26277b5a7def2d874ce5d43d32e9">
          <span> {{ userName || '欧阳校长' }} </span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span
              style="display:block;"
              @click="updatePassFun"
            >修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span
              style="display:block;"
              @click="logout"
            >{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- <div class="upgrade_renew">
      <el-button
        type="warning"
        size="mini"
      >升级/续费</el-button>
    </div> -->
    <!-- <div class="current_day">
      <span>{{ title }}:</span>
      <span>剩下{{ zsb }}天</span>
    </div> -->
    <div class="right-menu">
      {{ orgName }}
      <el-popover
        v-model="visible1"
        class="changeArea"
        placement="bottom"
        width="330"
        trigger="click"
      >
        <el-input
          v-model="searchVal"
          style="width:100%; margin-bottom:10px"
          placeholder="请输入要查询的校区"
        />
        <div class="serchArea">
          <ul class="AreaBox">
            <p style="padding-bottom:8px">总部</p>
            <el-radio-group v-model="radio1">

              <div
                v-for="(item,index) in search"
                :key="'z'+index"
                class="bbox"
              >
                <template v-if="item.type==1">
                  <div class="lbox">
                    <el-radio
                      :label="item.userId"
                      @change="online(item)"
                    >{{ item.orgName }}</el-radio>
                  </div>
                  <div
                    v-if="orgId == item.orgId"
                    class="rbox"
                    style="width:20px;height:20px;float:right;margin-bottom:8px;"
                    @click="defaultJump(item)"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="设置默认登录页"
                      placement="top-end"
                    >
                      <img
                        src="../../../assets/navbar/lock.png"
                        style="width:100%;height: 100%;"
                      >
                    </el-tooltip>
                  </div>
                </template>
              </div>

            </el-radio-group>

            <p style="padding-bottom:8px">校区</p>
            <el-radio-group v-model="radio1">
              <div
                v-for="(item,index) in search"
                :key="'x'+index"
                class="bbox"
              >
                <template v-if="item.type==2">
                  <div class="lbox">
                    <el-radio
                      :label="item.userId"
                      @change="online(item) "
                    >{{ item.orgName }}</el-radio>
                  </div>
                  <div
                    v-if="orgId == item.orgId"
                    class="rbox"
                    style="width:20px;height:20px;float:right;margin-bottom:8px;"
                    @click="defaultJump(item)"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="设置默认登录页"
                      placement="top-end"
                    >
                      <img
                        src="../../../assets/navbar/lock.png"
                        style="width:100%;height: 100%;"
                      >
                    </el-tooltip>
                  </div>
                </template>
              </div>

            </el-radio-group>
          </ul>
        </div>
        <div style="text-align:right; margin: 0">
          <el-button
            class="delete_btn"
            @click="visible1 = false"
          >取消</el-button>
          <el-button
            type="primary"
            class="edit_btn"
            @click="change"
          >确定</el-button>
        </div>
        <span
          slot="reference"
          value="true"
          style="cursor:pointer;"
          @click="changeArea"
        >切换校区</span>
      </el-popover>
    </div>
    <div class="right-menu">
      <el-popover
        placement="bottom-end"
        width="260"
        trigger="hover"
        popper-class="popover_help"
      >
        <div>
          <img
            style="width:100%"
            class="connect_popover_img"
            src="https://img.ishanshan.com/gimg/n/20190711/dc58ce8b397a0b39f3349b16f6f4db3c"
          >
          <p class="connect_p">微信扫码，获取专属服务顾问</p>
          <p class="connect_mobile">客服热线：400-660-5733</p>
        </div>
        <div
          slot="reference"
          class="customer"
        >
          <img src="https://img.ishanshan.com/gimg/n/20190402/7f9a502a9b4b3aefcdbbfdce485f930c">
          <span> 帮助中心 </span>
        </div>
      </el-popover>
    </div>
    <div class="right-menu">
      <el-popover
        placement="bottom-end"
        width="260"
        trigger="hover"
        popper-class="popover_help"
      >
        <div>
          <img
            style="width:100%"
            class="connect_popover_img"
            src="http://img.ishanshan.com/gimg/n/20200104/2f9df82336bfc3247dcc2b5e86f0dd1a"
          >
          <p class="connect_p">使用闪闪云校小程序</p>
          <p>随时随地管理机构动态</p>
        </div>
        <div
          slot="reference"
          class="customer"
        >
          <img src="http://img.ishanshan.com/gimg/n/20200108/6f70a8abff7229ad685d92b17bacc11f">
          <span> 云校小程序 </span>
        </div>
      </el-popover>
    </div>
    <ChangePwd
      v-if="visible"
      :visible.sync="visible"
      @close="close"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
// import Hamburger from '@/components/Hamburger'
// import ErrorLog from '@/components/ErrorLog'
// import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import ChangePwd from './ChangePwd/ChangePwd'
import { queryMealOpening } from '@/api/orgSet/comboMgr'
import { queryOrgListBySysUid, queryYqCode, setDefaultLoginOrg } from '@/api/layout/navbar'
export default {
  components: {
    // Breadcrumb,
    // Hamburger,
    // ErrorLog,
    // Screenfull,
    SizeSelect,
    LangSelect,
    ThemePicker,
    ChangePwd
  },
  data() {
    return {
      visible: false,
      visible1: false,
      userName: '', // 用户名
      title: '',
      zsb: '',
      searchVal: '',
      items: [],
      radio1: '',
      label: '',
      areaInfo: {}

      // orgName: '' // 校区名
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar'
      // 'device'
    ]),
    orgId() {
      return this.$store.getters.orgId
    },
    orgName() {
      return this.$store.getters.orgName
    },
    search() {
      var item = this.items.filter(ele => {
        if (ele.orgName.match(this.searchVal)) {
          return ele
        }
      })
      return item
    }
  },
  mounted() {
    this.userName = this.$store.getters.name
    this.radio1 = this.$store.getters.id
    this.getArea()
    // this.orgName = this.$store.getters.orgName
    // this.getDate()
  },
  methods: {
    // toggleSideBar() {
    //   this.$store.dispatch('toggleSideBar')
    // },
    // 设置默认校区
    defaultJump(item) {
      setDefaultLoginOrg().then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success(res.data.errorMessage)
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    // 获取校区
    getArea() {
      queryOrgListBySysUid().then(res => {
        const data = res.data.results
        if (res.data.errorCode === 0) {
          this.items = data
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    // 选中校区
    online(data) {
      console.log('data', data)
      this.areaInfo = data
    },
    change() {
      const paramas = { userId: this.areaInfo.userId, type: 'CQ' }
      this.visible1 = false
      queryYqCode(paramas).then(res => {
        const data = res.data.data
        console.log('code', data)
        if (res.data.errorCode === 0) {
          this.$store.dispatch('LogOut').then(() => {
            window.location.href = `${process.env.BASE_LOCATION}/cas/logout?service=${process.env.BASE_LOCATION}/cas/login?jwtToken=${data}`
          })
        }
      })
    },
    //
    changeArea() {
    },
    /* 获取剩余天数 */
    getDate() {
      queryMealOpening().then(res => {
        const data = res.data
        if (res.data.errorCode === 0) {
          this.title = data.data && data.data.saasMealTitle
          this.zsb = data.data && data.data.zsbExpireDays
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 打开修改密码弹窗 */
    updatePassFun() {
      this.visible = true
    },
    /** 关闭 */
    close() {
      this.visible = false
    },

    /* 退出登录 */
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  }
}
</script>

<style lang="scss">
.popover_help {
  padding: 20px;
  text-align: center;
}
</style>

<style lang="scss" scoped>
.el-radio {
  margin-left: 0px;
  margin-bottom: 8px;
  display: block;
}
.el-radio + .el-radio {
  margin-left: 0px;
  margin-bottom: 5px;
}
.bbox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.AreaBox {
  overflow-y: auto;
  max-height: 180px;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.moren {
  color: #1d9df2;
}
.connect_p {
  margin: 14px 0 10px 0;
  color: #666;
}
.connect_mobile {
  color: #1d9df2;
}

.navbar {
  height: 40px;
  line-height: 40px;
  border-radius: 0px !important;
  border-bottom: 1px solid #ddd;
  padding-right: 20px;
  .hamburger-container {
    line-height: 40px;
    height: 40px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .left-menu {
    float: left;
    margin-left: 20px;
    color: #333;
    font-size: 14px;
    font-weight: 500;
  }
  .right-menu {
    float: right;
    height: 100%;
    font-size: 14px;
    margin-left: 30px;
    .changeArea {
      color: #1d9df2;
    }
    &:focus {
      outline: none;
    }
    //  img{
    //    float: right;
    //  }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .userName {
      float: right;
      color: #b3c1c8;
      cursor: pointer;
      img {
        vertical-align: middle;
      }
      span {
        vertical-align: middle;
        color: #333;
        margin: 0 2px 0 6px;
      }
    }
    .customer {
      float: right;
      color: #b3c1c8;
      cursor: pointer;
      img {
        vertical-align: middle;
      }
      span {
        vertical-align: middle;
        color: #333;
        margin-left: 5px;
      }
    }
  }
  .upgrade_renew {
    float: right;
    .el-button--warning {
      padding: 4px 12px;
      border-radius: 4px;
    }
  }
  .current_day {
    margin-right: 10px;
    color: #333;
    font-size: 14px;
    float: right;
  }
}
</style>
