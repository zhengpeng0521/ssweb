<template>
  <div class="wrapWall">
    <div class="titltop">新手引导</div>
    <div style="display:flex;align-items:center;justify-content: space-between;cursor: pointer;">
      <div
        v-for="(itme,index) in dataName"
        :key="index"
        :class="{ 'active': isActive == index }"
        class="title"
        @click="enter(index)"
      >{{ itme }}</div>
    </div>
    <div
      v-show="isActive == 0"
      class="wrap"
    >
      <div class="word">打造机构信息化管理第一步</div>
      <div class="leftw">
        <span class="yuan" />
        <el-tooltip
          :hide-after="4000"
          popper-class="teststle"
          placement="bottom-start"
          effect="light"
        >
          <div
            slot="content"
            class="wracon"
          >
            <div class="hittitle">为机构员工创建不同的角色权限</div>
            <a href="https://saas.ishanshan.com/thinknode/web/offical/help/1169166514318675968" target="_blank" rel="noopener noreferrer">
              <div class="hitword">查看教程</div>
            </a>
          </div>
          <div
            class="wordt hoverA"
            @click="orgSet(isActive)"
          >添加角色</div>
        </el-tooltip>
        <img
          class="jian"
          src="http://img.ishanshan.com/gimg/user/n///265316694388375553.png"
          alt=""
        >
        <el-tooltip
          :hide-after="4000"
          popper-class="teststle"
          placement="bottom-start"
          effect="light"
        >
          <div
            slot="content"
            class="wracon"
          >
            <div class="hittitle">添加机构员工账号，员工可使用自己的账号登录</div>
            <a href="https://saas.ishanshan.com/thinknode/web/offical/help/1169169424632975360" target="_blank" rel="noopener noreferrer">
              <div class="hitword">查看教程</div>
            </a>
          </div>
          <div
            class="wordt hoverA"
            @click="orgSetnext"
          >添加员工</div>
        </el-tooltip>
      </div>
      <img
        class="rightI"
        src="http://img.ishanshan.com/gimg/user/n///264843157265448961.png"
        width="230px"
        height="117px"
        alt=""
      >
    </div>
    <div
      v-show="isActive == 1"
      class="wrap"
    >
      <div class="word">高效管理学员的整个生命周期</div>
      <div class="leftw">
        <span class="yuan" />
        <div
          class="wordt"
          style="color:#666"
        >有潜在学员：</div>
        <el-tooltip
          :hide-after="4000"
          popper-class="teststle"
          placement="bottom-start"
          effect="light"
        >
          <div
            slot="content"
            class="wracon"
          >
            <div class="hittitle">导入机构未签约的非正式学员</div>
            <a href="https://saas.ishanshan.com/thinknode/web/offical/help/1169173544236421120" target="_blank" rel="noopener noreferrer">
              <div class="hitword">查看教程</div>
            </a>
          </div>
          <div
            class="wordt hoverA"
            @click="CRMs"
          >导入潜在学员</div>
        </el-tooltip>
      </div>
      <div
        class="leftw"
        style="margin-top:20px"
      >
        <span class="yuan" />
        <div
          class="wordt"
          style="color:#666"
        >有在读学员：</div>
        <el-tooltip
          :hide-after="4000"
          popper-class="teststle"
          placement="bottom-start"
          effect="light"
        >
          <div
            slot="content"
            class="wracon"
          >
            <div class="hittitle">设置与学员签约时的合同套餐</div>
            <a href="https://saas.ishanshan.com/thinknode/web/offical/help/1169174247352766464" target="_blank" rel="noopener noreferrer"><div class="hitword">查看教程</div></a>
          </div>
          <div
            class="wordt hoverA"
            @click="CRMht"
          >设置合同套餐</div>
        </el-tooltip>
        <img
          class="jian"
          src="http://img.ishanshan.com/gimg/user/n///265316694388375553.png"
          alt=""
        >
        <el-tooltip
          :hide-after="4000"
          popper-class="teststle"
          placement="bottom-start"
          effect="light"
        >
          <div
            slot="content"
            class="wracon"
          >
            <div class="hittitle">导入机构在读的正式学员</div>
            <a href="https://saas.ishanshan.com/thinknode/web/offical/help/1169174962661953536" target="_blank" rel="noopener noreferrer">
              <div class="hitword">查看教程</div>
            </a>
          </div>
          <div
            class="wordt hoverA"
            @click="CRMzd"
          >导入在读学员</div>
        </el-tooltip>
      </div>
      <img
        class="rightI"
        src="http://img.ishanshan.com/gimg/user/n///264843251536625665.png"
        width="175px"
        height="108px"
        alt=""
      >
    </div>
    <div
      v-show="isActive == 2"
      class="wrap"
    >
      <div class="word">倍速提升学员管理效率</div>
      <div class="leftw">
        <div>
          <div style="display:flex;align-items: center;">
            <span class="yuan" />
            <el-tooltip
              :hide-after="4000"
              popper-class="teststle"
              placement="bottom-start"
              effect="light"
            >
              <div
                slot="content"
                class="wracon"
              >
                <div class="hittitle">潜在学员报名并创建学员账户成为在读学员</div>
                <a href="https://saas.ishanshan.com/thinknode/web/offical/help/1169176066585989120" target="_blank" rel="noopener noreferrer">
                  <div class="hitword">查看教程</div>
                </a>
              </div>
              <div
                class="wordt hoverA"
                @click="CRMs"
              >潜在学员报名</div>
            </el-tooltip>
          </div>
          <div style="display:flex;align-items: center;margin-top:20px">
            <span class="yuan" />
            <el-tooltip
              :hide-after="4000"
              popper-class="teststle"
              placement="bottom-start"
              effect="light"
            >
              <div
                slot="content"
                class="wracon"
              >
                <div class="hittitle">在读学员报名续费课程</div>
                <a href="https://saas.ishanshan.com/thinknode/web/offical/help/1169176688207007744" target="_blank" rel="noopener noreferrer">
                  <div class="hitword">查看教程</div>
                </a>
              </div>
              <div
                class="wordt hoverA"
                @click="CRMzd"
              >在读学员报名</div>
            </el-tooltip>
          </div>
        </div>

        <img
          class="jian"
          src="http://img.ishanshan.com/gimg/user/n///265316694388375553.png"
          alt=""
        >
        <el-tooltip
          :hide-after="4000"
          popper-class="teststle"
          placement="bottom-start"
          effect="light"
        >
          <div
            slot="content"
            class="wracon"
          >
            <div class="hittitle">审核合同是否通过，并收款合同金额</div>
            <a href="https://saas.ishanshan.com/thinknode/web/offical/help/1169177843616124928" target="_blank" rel="noopener noreferrer">
              <div class="hitword">查看教程</div>
            </a>
          </div>
          <div
            class="wordt hoverA"
            @click="crmhtt"
          >合同审核并收款</div>
        </el-tooltip>
        <img
          class="jian"
          src="http://img.ishanshan.com/gimg/user/n///265316694388375553.png"
          alt=""
        >
        <el-tooltip
          :hide-after="4000"
          popper-class="teststle"
          placement="bottom-start"
          effect="light"
        >
          <div
            slot="content"
            class="wracon"
          >
            <div class="hittitle">机构财务审核合同收款金额是否到账</div>
            <a href="https://saas.ishanshan.com/thinknode/web/offical/help/1169180211560779776" target="_blank">
              <div class="hitword">查看教程</div>
            </a>
          </div>
          <div
            class="wordt hoverA"
            @click="crmhsk"
          >收款确认</div>
        </el-tooltip>
      </div>
      <img
        class="rightI"
        src="http://img.ishanshan.com/gimg/user/n///264843357736402945.png"
        width="170px"
        height="92px"
        alt=""
      >
    </div>
    <div
      v-show="isActive == 3"
      class="wrap"
    >
      <div class="word">迈出机构教务管理第一步</div>
      <div class="leftw">
        <span class="yuan" />
        <el-tooltip
          :hide-after="4000"
          popper-class="teststle"
          placement="bottom-start"
          effect="light"
        >
          <div
            slot="content"
            class="wracon"
          >
            <div class="hittitle">新建机构教室</div>
            <a href="https://saas.ishanshan.com/thinknode/web/offical/help/1169180518395088896" target="_blank">
              <div class="hitword">查看教程</div>
            </a>
          </div>
          <div
            class="wordt hoverA"
            @click="schoolS"
          >新建教室</div>
        </el-tooltip>
        <img
          class="jian"
          src="http://img.ishanshan.com/gimg/user/n///265316694388375553.png"
          alt=""
        >
        <el-tooltip
          :hide-after="4000"
          popper-class="teststle"
          placement="bottom-start"
          effect="light"
        >
          <div
            slot="content"
            class="wracon"
          >
            <div class="hittitle">新建机构课系</div>
            <a href="https://saas.ishanshan.com/thinknode/web/offical/help/1169181062417289216" target="_blank">
              <div class="hitword">查看教程</div>
            </a>
          </div>
          <div
            class="wordt hoverA"
            @click="schoolJW"
          >新建课系</div>
        </el-tooltip>
        <img
          class="jian"
          src="http://img.ishanshan.com/gimg/user/n///265316694388375553.png"
          alt=""
        >
        <el-tooltip
          :hide-after="4000"
          popper-class="teststle"
          placement="bottom-start"
          effect="light"
        >
          <div
            slot="content"
            class="wracon"
          >
            <div class="hittitle">新建机构课程</div>
            <a href="https://saas.ishanshan.com/thinknode/web/offical/help/1169181616216412160" target="_blank">
              <div class="hitword">查看教程</div>
            </a>
          </div>
          <div
            class="wordt hoverA"
            @click="schoolJW"
          >新建课程</div>
        </el-tooltip>
      </div>
      <img
        class="rightI"
        src="http://img.ishanshan.com/gimg/user/n///264843405870235649.png"
        width="174px"
        height="96px"
        alt=""
      >
    </div>
    <div
      v-show="isActive == 4"
      class="wrap"
    >
      <div class="word">精细化管理运营机构学员</div>
      <div class="leftw">
        <span class="yuan" />
        <div
          class="wordt"
          style="color:#666"
        >有班级的机构：</div>
        <el-tooltip
          :hide-after="4000"
          popper-class="teststle"
          placement="bottom-start"
          effect="light"
        >
          <div
            slot="content"
            class="wracon"
          >
            <div class="hittitle">有班级概念的机构可新建班级</div>
            <a href="https://saas.ishanshan.com/thinknode/web/offical/help/1169181990029561856" target="_blank" rel="noopener noreferrer">
              <div class="hitword">查看教程</div>
            </a>
          </div>
          <div
            class="wordt hoverA"
            @click="classB"
          >新建班级</div>
        </el-tooltip>
        <img
          class="jian"
          src="http://img.ishanshan.com/gimg/user/n///265316694388375553.png"
          alt=""
        >
        <el-tooltip
          :hide-after="4000"
          popper-class="teststle"
          placement="bottom-start"
          effect="light"
        >
          <div
            slot="content"
            class="wracon"
          >
            <div class="hittitle">为班级添加学员</div>
            <a href="https://saas.ishanshan.com/thinknode/web/offical/help/1169194895227686912" target="_blank" rel="noopener noreferrer">
              <div class="hitword">查看教程</div>
            </a>
          </div>
          <div
            class="wordt hoverA"
            @click="classB"
          >添加学员</div>
        </el-tooltip>
        <img
          class="jian"
          src="http://img.ishanshan.com/gimg/user/n///265316694388375553.png"
          alt=""
        >
        <el-tooltip
          :hide-after="4000"
          popper-class="teststle"
          placement="bottom-start"
          effect="light"
        >
          <div
            slot="content"
            class="wracon"
          >
            <div class="hittitle">为班级排课</div>
            <a href="https://saas.ishanshan.com/thinknode/web/offical/help/1169195850434285568" target="_blank" rel="noopener noreferrer">
              <div class="hitword">查看教程</div>
            </a>
          </div>
          <div
            class="wordt hoverA"
            @click="classSchedule"
          >班级排课</div>
        </el-tooltip>
      </div>
      <div
        class="leftw"
        style="margin-top:20px"
      >
        <span class="yuan" />
        <div
          class="wordt"
          style="color:#666"
        >无班级的机构：</div>
        <el-tooltip
          :hide-after="4000"
          popper-class="teststle"
          placement="bottom-start"
          effect="light"
        >
          <div
            slot="content"
            class="wracon"
          >
            <div class="hittitle">没有班级概念的机构可直接排课</div>
            <a href="https://saas.ishanshan.com/thinknode/web/offical/help/1169196441562714112" target="_blank" rel="noopener noreferrer">
              <div class="hitword">查看教程</div>
            </a>
          </div>
          <div
            class="wordt hoverA"
            @click="classSchedule"
          >新建排课</div>
        </el-tooltip>
        <img
          class="jian"
          src="http://img.ishanshan.com/gimg/user/n///265316694388375553.png"
          alt=""
        >
        <el-tooltip
          :hide-after="4000"
          popper-class="teststle"
          placement="bottom-start"
          effect="light"
        >
          <div
            slot="content"
            class="wracon"
          >
            <div class="hittitle">为排完的班级约上上课学员</div>
            <a href="https://saas.ishanshan.com/thinknode/web/offical/help/1169197021639151616" target="_blank" rel="noopener noreferrer">
              <div class="hitword">查看教程</div>
            </a>
          </div>
          <div
            class="wordt hoverA"
            @click="classSyueke"
          >老师约课</div>
        </el-tooltip>
      </div>
      <img
        class="rightI"
        src="http://img.ishanshan.com/gimg/user/n///264843459037233153.png"
        width="222px"
        height="110px"
        alt=""
      >
    </div>
    <div
      v-show="isActive == 5"
      class="wrap"
    >
      <div class="word">迅速反馈学员的出勤和课堂表现</div>
      <div class="leftw">
        <span class="yuan" />
        <el-tooltip
          :hide-after="4000"
          popper-class="teststle"
          placement="bottom-start"
          effect="light"
        >
          <div
            slot="content"
            class="wracon"
          >
            <div class="hittitle">记录学员考勤情况并点评学员表现</div>
            <a href="https://saas.ishanshan.com/thinknode/web/offical/help/1169199003280019456" target="_blank" rel="noopener noreferrer">
              <div class="hitword">查看教程</div>
            </a>
          </div>
          <div
            class="wordt hoverA"
            @click="teachAtt"
          >考勤点评</div>
        </el-tooltip>
      </div>
      <img
        class="rightI"
        src="http://img.ishanshan.com/gimg/user/n///264843566327529473.png"
        width="159px"
        height="102px"
        alt=""
      >
    </div>
    <div
      v-show="isActive == 6"
      class="wrap"
    >
      <div class="word">成为进阶者玩转机构运营</div>
      <div class="leftnew">
        <div>
          <span class="yuan" />
          <a href="https://saas.ishanshan.com/thinknode/web/offical/help/1169205813458178048" target="_blank" rel="noopener noreferrer">
            <span class="wordt hoverA">家校通讲解</span>
          </a>
        </div>
        <div>
          <span class="yuan" />
          <a href="https://saas.ishanshan.com/thinknode/web/offical/help/1169210098602414080" target="_blank" rel="noopener noreferrer">
            <span class="wordt hoverA">学员跟进讲解</span>
          </a>
        </div>
      </div>
      <div
        class="leftnew"
        style="margin-top:20px"
      >
        <div>
          <span class="yuan" />
          <a href="https://saas.ishanshan.com/thinknode/web/offical/help/1169214183909036032" target="_blank" rel="noopener noreferrer">
            <span class="wordt hoverA">托班教务讲解</span>
          </a>
        </div>
        <div>
          <span class="yuan" />
          <a href="https://saas.ishanshan.com/thinknode/web/offical/help/1169214785347063808" target="_blank" rel="noopener noreferrer">
            <span class="wordt hoverA">在线收款讲解</span>
          </a>
        </div>
      </div>
      <img
        class="rightI"
        src="http://img.ishanshan.com/gimg/user/n///264843607381377025.png"
        width="228px"
        height="108px"
        alt=""
      >
    </div>
    <!-- 跳转错误提示 -->
    <el-dialog
      :visible.sync="centerDialogVisible"
      title="提示"
      width="340px"
      center
    >
      <div style="display:flex;align-items:center;">
        <img src="http://img.ishanshan.com/gimg/user/n///265276408266227713.png" width="25px" height="25px" alt="">
        <div style="margin-left:5px">您没有菜单访问权限或未订购相应套餐</div>
      </div>
      <span slot="footer" class="dialog-footer" style="border:none">
        <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      centerDialogVisible: false,
      isActive: 0,
      url: '',
      dataName: [
        '1 初始化',
        '2 导入学员',
        '3 学员报名',
        '4 教务设置',
        '5 排课约课',
        '6 考勤点评',
        '7 其他功能'
      ]
    }
  },
  mounted() {
    this.url = window.location.href.split('#')[0]
  },
  methods: {
    enter(index) {
      this.isActive = index
    },
    orgSet(index) {
      const coruG = this.hasMenu('9010200')
      if (coruG === true) {
        const newyrl = this.url + '#/org_settings/staff_mgr?roleMgr'
        window.open(newyrl)
      } else {
        this.centerDialogVisible = true
      }
    },
    orgSetnext() {
      const coruG = this.hasMenu('9010100')
      if (coruG === true) {
        const newyrl = this.url + '#/org_settings/staff_mgr'
        window.open(newyrl)
      } else {
        this.centerDialogVisible = true
      }
    },
    // 导入学员
    CRMs() {
      const coruG = this.hasMenu('4020100')
      if (coruG === true) {
        const newyrl = this.url + '#/crm/studentMgr'
        window.open(newyrl)
      } else {
        this.centerDialogVisible = true
      }
    },
    // 合同套餐
    CRMht() {
      const coruG = this.hasMenu('4060200')
      if (coruG === true) {
        const newyrl = this.url + '#/crm/contractMgr?contractSetmeal'
        window.open(newyrl)
      } else {
        this.centerDialogVisible = true
      }
    },
    // 导入在读
    CRMzd() {
      const coruG = this.hasMenu('4020200')
      if (coruG === true) {
        const newyrl = this.url + '#/crm/studentMgr?readingStu'
        window.open(newyrl)
      } else {
        this.centerDialogVisible = true
      }
    },
    // 合同审核收款
    crmhtt() {
      const coruG = this.hasMenu('4060100')
      if (coruG === true) {
        const newyrl = this.url + '#/crm/contractMgr'
        window.open(newyrl)
      } else {
        this.centerDialogVisible = true
      }
    },
    // 收款确认
    crmhsk() {
      const coruG = this.hasMenu('4070200')
      if (coruG === true) {
        const newyrl = this.url + '#/crm/financeMgr'
        window.open(newyrl)
      } else {
        this.centerDialogVisible = true
      }
    },
    // 校区配置
    schoolS() {
      const coruG = this.hasMenu('9030200')
      if (coruG === true) {
        const newyrl = this.url + '#/org_settings/base_set'
        window.open(newyrl)
      } else {
        this.centerDialogVisible = true
      }
    },
    // 新建课系
    schoolJW() {
      const coruG = this.hasMenu('5020000')
      if (coruG === true) {
        const newyrl = this.url + '#/teach/course'
        window.open(newyrl)
      } else {
        this.centerDialogVisible = true
      }
    },
    // 排课约课
    classB() {
      const coruG = this.hasMenu('5030000')
      if (coruG === true) {
        const newyrl = this.url + '#/teach/grade'
        window.open(newyrl)
      } else {
        this.centerDialogVisible = true
      }
    },
    // 班级排课
    classSchedule() {
      const coruG = this.hasMenu('5040100')
      if (coruG === true) {
        const newyrl = this.url + '#/teach/courseSchedule'
        window.open(newyrl)
      } else {
        this.centerDialogVisible = true
      }
    },
    // 约课
    classSyueke() {
      const coruG = this.hasMenu('5050100')
      if (coruG === true) {
        const newyrl = this.url + '#/teach/orderCourse'
        window.open(newyrl)
      } else {
        this.centerDialogVisible = true
      }
    },
    // 学员考勤
    teachAtt() {
      const coruG = this.hasMenu('5060100')
      if (coruG === true) {
        const newyrl = this.url + '#/teach/attendance'
        window.open(newyrl)
      } else {
        this.centerDialogVisible = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
// 新手指导(๑′ᴗ‵๑)Ｉ Lᵒᵛᵉᵧₒᵤ❤
.wrapWall {
  /deep/ .el-dialog--center .el-dialog__footer{
    border: none
  }
  box-sizing: border-box;
  height: 291px;
  background: rgba(255, 255, 255, 1);
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 20px;
  .titltop {
    font-size: 16px;
    font-family: PingFangSC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    margin-bottom: 20px;
  }
  .title {
    position: relative;
    display: inline-block;
    width: 20%;
    height: 35px;
    line-height: 35px;
    text-align: center;
    font-size: 14px;
    color: #999999;
    z-index: 1;
    &::before {
      content: "";
      position: absolute;
      top: -7px;
      left: 0px;
      right: 0px;
      bottom: 0;
      z-index: -1;
      transform: perspective(0.9em) rotateX(2.5deg);
      transform-origin: bottom left;
      background: rgba(255, 255, 255, 1);
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      border: 1px solid #dddddd;
    }
    &:hover {
       color: #1d9df2;
    }
    &:hover::before{
      border-bottom: 1px solid #ffffff;
      border-top: 3px solid #46b6ee;
    }
  }
  .wrap {
    position: relative;
    height: 180px;
    padding: 30px 20px 20px 20px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border-left: 1px solid #dddddd;
    border-right: 1px solid #dddddd;
    border-bottom: 1px solid #dddddd;
    .word {
      font-size: 14px;
      color: #333;
      font-weight: 550;
      margin-bottom: 30px;
    }
    .leftw {
      display: flex;
      align-items: center;
      margin-left: 3px;
      .jian {
        width: 18px;
        height: 18px;
        margin: 0 8px;
      }
      .wordt {
        font-size: 14px;
        color: #333;
      }
      .hoverA:hover {
        color: #1d9df2;
        cursor: pointer;
      }
      .yuan {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #666;
        margin-right: 4px;
      }
    }
    .leftnew {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 210px;
      .wordt {
        font-size: 14px;
        color: #333;
      }
      .hoverA:hover {
        color: #1d9df2;
        cursor: pointer;
      }
      .yuan {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #666;
        margin-right: 4px;
      }
      div {
        display: flex;
        align-items: center;
      }
    }
    .rightI {
      position: absolute;
      right: 20px;
      bottom: 20px;
    }
  }
  .active {
    color: #1d9df2;
  }
  .active::before {
    border-bottom: 1px solid #ffffff;
    border-top: 3px solid #46b6ee;
  }
}
</style>
