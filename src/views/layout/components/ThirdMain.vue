<template>
  <section class="third-main">
    <div class="wrapWI" @mouseover="indexn = 0" @mouseleave="indexn = 1" @click="maskE">
      <div
        v-show="maskS"
        class="maskE"
      >使用教程</div>
      <img
        v-show="maskS"
        :src="img[indexn]"
        class="maskI"
      >
    </div>
    <el-tabs
      ref="thirdMain"
      v-model="activeName"
      :tab-position="tabPosition"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="item in subMenus"
        :key="item.name"
        :label="item.meta.title"
        :name="item.name"
      >
        <tm-view
          v-if="item.name === activeName"
          :info="item"
        />
      </el-tab-pane>
    </el-tabs>
    <!-- 视频弹框 -->
    <div
      v-if="showV"
      class="videoW"
      @click.self="cloce"
    >
      <div class="videoA">
        <img src="http://img.ishanshan.com/gimg/user/n///265013833225994241.png" class="closeI" alt="" @click.self="cloce">
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import TmView from './tm.js'
export default {
  components: {
    TmView
  },
  data() {
    return {
      indexn: 1,
      subMenus: [],
      activeName: '',
      tabPosition: 'top',
      maskS: false,
      showV: false,
      img: ['http://img.ishanshan.com/gimg/user/n///265321467506327553.png', 'http://img.ishanshan.com/gimg/user/n///265000186051297281.png']
    }
  },

  computed: {
    ...mapState('changeThirdMain', ['tabsName', 'isChange'])
  },
  watch: {
    tabsName(nweval) {
      if (this.isChange) {
        this.activeName = nweval
        setTimeout(() => {
          this.CHANGE_SWITCH()
        }, 1000)
      }
    },
    activeName() {
      if (this.activeName === 'roleMgr' || this.activeName === 'staffMgr' || this.activeName === 'lantentStu' || this.activeName === 'contractSetmeal' || this.activeName === 'readingStu' || this.activeName === 'contractOrder' || this.activeName === 'gatheringMgr' || this.activeName === 'classRoomMgr' || this.activeName === 'classRecords' || this.activeName === 'orderCourseTable' || this.activeName === 'stuAttendance') {
        this.maskS = true
      } else {
        this.maskS = false
      }
    }
  },

  // updated() {
  //   if (this.isChange) {
  //     this.activeName = this.tabsName
  //     console.log('触发三级菜单的跳转this.activeName', this.activeName)
  //   }
  // },
  mounted() {
    const url = window.location.href
    if (url.includes('ContractRule')) {
      this.$router.push({ name: 'ruleSet', params: { activeTab: 'ContractRule' }})
    }
    if (url.includes('bizParamSet')) {
      this.$router.push({ name: 'ruleSet', params: { activeTab: 'bizParamSet', fromTab: 'microWeb' }})
    }
    if (url.includes('roleMgr')) {
      this.$router.push({ name: 'staffMgr', params: { activeTab: 'roleMgr' }})
    }
    if (url.includes('contractSetmeal')) {
      this.$router.push({ name: 'ContractMgr', params: { activeTab: 'contractSetmeal' }})
    }
    if (url.includes('readingStu')) {
      this.$router.push({ name: 'StudentMgr', params: { activeTab: 'readingStu' }})
    }
    if (this.$route.path.indexOf('report') > -1) {
      this.tabPosition = 'left'
    } else {
      this.tabPosition = 'top'
    }
    // 跳转路由后跳转三级菜单
    if (
      this.$router.history.current.params &&
      this.$router.history.current.params.activeTab
    ) {
      this.changeTabs(this.$router.history.current.params.activeTab)
    }

    this.subMenus = this.$route.meta.cn
    if (this.subMenus.length > 0) {
      this.activeName = this.subMenus[0].name
    }
  },
  destroyed() {
    this.activeName = ''
    this.CHANGE_SWITCH()
  },
  methods: {
    ...mapActions('changeThirdMain', ['changeTabs']),

    ...mapMutations('changeThirdMain', ['CHANGE_SWITCH']),

    handleClick(tab) {
      this.changeTabs(this.activeName)
      window.__ml &&
        window.__ml.api &&
        window.__ml.api(tab.label, true, 0, 200, '三级菜单模块')
    },
    maskE() {
      console.log(this.activeName)
      const url = this.activeName
      switch (url) {
        case 'roleMgr':
          window.open('https://saas.ishanshan.com/thinknode/web/offical/help/1169166514318675968')
          break
        case 'staffMgr':
          window.open('https://saas.ishanshan.com/thinknode/web/offical/help/1169169424632975360')
          break
        case 'lantentStu':
          window.open('https://saas.ishanshan.com/thinknode/web/offical/help/1169176066585989120')
          break
        case 'contractSetmeal':
          window.open('https://saas.ishanshan.com/thinknode/web/offical/help/1169174247352766464')
          break
        case 'readingStu':
          window.open('https://saas.ishanshan.com/thinknode/web/offical/help/1169176688207007744')
          break
        case 'contractOrder':
          window.open('https://saas.ishanshan.com/thinknode/web/offical/help/1169177843616124928')
          break
        case 'gatheringMgr':
          window.open('https://saas.ishanshan.com/thinknode/web/offical/help/1169180211560779776')
          break
        case 'classRoomMgr':
          window.open('https://saas.ishanshan.com/thinknode/web/offical/help/1169180518395088896')
          break
        case 'classRecords':
          window.open('https://saas.ishanshan.com/thinknode/web/offical/help/1169195850434285568')
          break
        case 'orderCourseTable':
          window.open('https://saas.ishanshan.com/thinknode/web/offical/help/1169197021639151616')
          break
        case 'stuAttendance':
          window.open('https://saas.ishanshan.com/thinknode/web/offical/help/1169199003280019456')
          break
      }
    },
    cloce() {
      this.showV = false
    }
  }
}
</script>

<style lang="scss" scoped>
.third-main /deep/ {
  /*84 = navbar + tags-view = 50 +34 */
  width: 100%;
  height: calc(100vh - 67px);
  position: relative;
  overflow: auto;
  padding: 8px 0 0 20px;
  .el-tabs__header {
    padding-right: 20px;
    margin: 0;
    margin-bottom: 20px;
  }
  .el-tabs--left .el-tabs__header {
    padding-right: 20px;
  }
  .el-tabs__nav-scroll {
    border-bottom: 0;
    padding-left: 0;
  }
  .el-tabs__item {
    padding: 0 25px;
  }
}
</style>
<style lang="scss">
.videoW {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.videoA {
  width: 600px;
  height: 450px;
  position: relative;
  background: #fff;
  box-shadow: 0px 1px 7px 0px rgba(0, 0, 0, 0.2)
}
.closeI{
  position: absolute;
  top: -4px;
  right: -29px;
  width:25px;
  height: 25px
}
.maskE {
  position: absolute;
  top: 20px;
  right: 40px;
  color: #999;
  font-size: 12px;
  z-index: 99;
}
.wrapWI:hover .maskE {
  cursor: pointer;
  color:rgba(29,157,242,.8);
}
.maskI {
  position: absolute;
  top: 21px;
  right: 26px;
  width: 12px;
  height: 12px;
  z-index: 99;
}
.maskI:hover {
  cursor: pointer;
}
.el-tabs__content {
  padding-right: 20px;
}
.el-tabs--left {
  height: 100%;
  .is-left {
    height: 100%;
    .el-tabs__nav-scroll {
      padding-left: 10px;
    }
    .el-tabs__nav-wrap {
      padding-right: 10px;
    }
  }
}
.el-tabs--left .el-tabs__nav-scroll {
  height: auto;
}
.el-tabs--left .el-tabs__active-bar.is-left {
  width: 0;
}
.el-tabs--left .el-tabs__item.is-left {
  color: #666 !important;
  transition: all 0.5s;
}
.el-tabs--left .el-tabs__item.is-active {
  background: rgba(70, 182, 238, 0.2);
}
.el-tabs--left .el-tabs__item:hover {
  color: #46b6ee !important;
}
</style>

