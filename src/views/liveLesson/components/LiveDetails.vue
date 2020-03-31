<template>
  <div class="liveDetails">
    <div class="details_title">
      <div class="timer_title">
        <span class="timer_span">剩余直播时长</span>
        <span class="rule" @click="ruleDialogVisible = true">时长计算规则</span>
      </div>
      <div class="timerNum">
        <span class="timer_wrap">
          <span :class="{immediately: duration < 500 && duration > 0, none: duration <= 0}" class="timeNum">
            {{ duration }}
          </span>
          <span>分钟</span>
        </span>
        <el-popover
          placement="bottom"
          width="222"
          trigger="hover"
        >
          <div class="service_content">
            <img src="https://img.ishanshan.com/gimg/n/20190711/dc58ce8b397a0b39f3349b16f6f4db3c">
            <div>请联系客服人员为您充值</div>
          </div>
          <el-button slot="reference" type="primary" size="mini">充值</el-button>
        </el-popover>
      </div>
      <div v-if="duration < 500" class="residue_tips">
        <i class="el-icon-warning residue_tips_icon"/>
        <span v-if="duration < 500 && duration > 0">您的剩余时长即将用完，为保证您正常使用，请及时充值</span>
        <span v-if="duration === 0">无可用剩余时长，完成充值后可正常使用直播功能</span>
        <span v-if="duration < 0">您已产生欠费，请及时充值，充值时将优先补足已欠时长</span>
      </div>
    </div>
    <el-tabs v-model="activeName2" class="table_wrap" type="card" @tab-click="handleClick">
      <el-tab-pane label="时长消耗明细" name="first">
        <div v-if="consumeListData.length !== 0" class="rubbish_table">
          <el-table
            ref="rabTable"
            :data="consumeListData"
            height="calc(100vh - 420px)"
            size="medium"
            stripe
          >
            <el-table-column
              label="结算时间"
              prop="recordTime"
              fixed
            />
            <el-table-column
              label="时长消耗"
              fixed
            >
              <template slot-scope="scope">
                <template>
                  <div>{{ scope.row.debit }}分钟</div>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              label="直播时间"
              prop="classTime"
              fixed
            />
            <el-table-column
              :show-overflow-tooltip="true"
              label="直播名称"
              prop="classInfo"
              fixed
            />
            <el-table-column
              label="操作"
              fixed="right"
            >
              <template slot-scope="scope">
                <template>
                  <a @click="getDetails(scope.row.sourceId)">查看详情</a>
                </template>
              </template>
            </el-table-column>
          </el-table>
          <div class="fenye">
            <el-pagination
              v-if="consumePaging.resultCount !== 0"
              :total="consumePaging.resultCount"
              :current-page="consumePaging.pageIndex"
              :page-size="consumePaging.pageSize"
              :small="true"
              layout="total,prev, pager, next, sizes"
              @current-change="pageIndexChange($event - 1, 'consume')"
              @size-change="pageSizeChange($event, 'consume')"
            />
          </div>
        </div>
        <NullData
          v-else
          text="暂无数据"
          style="height:300px"
        />
      </el-tab-pane>
      <el-tab-pane label="充值记录" name="second">
        <div v-if="flowListData.length !== 0" class="rubbish_table">
          <el-table
            ref="rabTable"
            :data="flowListData"
            height="calc(100vh - 420px)"
            size="medium"
            stripe
          >
            <el-table-column
              label="充值时间"
              prop="flowTime"
              fixed
            />
            <el-table-column
              label="充值时长"
              fixed
            >
              <template slot-scope="scope">
                <template>
                  <div v-if="scope.row.type === 1">{{ scope.row.credit }}分钟</div>
                  <div v-else>{{ scope.row.debit }}分钟</div>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              label="充值金额"
              fixed
            >
              <template slot-scope="scope">
                <template>
                  <div v-if="scope.row.price">{{ scope.row.price }}元</div>
                  <div v-else>0元</div>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              label="充值类型"
              fixed
            >
              <template slot-scope="scope">
                <template>
                  <div v-if="scope.row.type === 1">后台充值</div>
                  <div v-else>充值作废</div>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              label="订单编号"
              prop="flowNo"
              fixed
            />
          </el-table>
          <div class="fenye">
            <el-pagination
              v-if="flowPaging.resultCount !== 0"
              :total="flowPaging.resultCount"
              :current-page="flowPaging.pageIndex"
              :page-size="flowPaging.pageSize"
              :small="true"
              layout="total,prev, pager, next, sizes"
              @current-change="pageIndexChange($event - 1, 'flow')"
              @size-change="pageSizeChange($event, 'flow')"
            />
          </div>
        </div>
        <NullData
          v-else
          text="暂无数据"
          style="height:300px"
        />
      </el-tab-pane>
    </el-tabs>

    <!-- 计算规则弹窗 -->
    <el-dialog
      :visible.sync="ruleDialogVisible"
      class="ruleDialog"
      width="650px"
      title="直播时长计算规则"
    >
      <div class="section">
        <h3 class="ruleDialogTitle">单个学员观看直播时长计算方式：</h3>
        <p class="ruleDialogTexe first_text">以学员在直播间内实际观看时间计算。学员进入直播间并有直播推流时（即老师已开始直播）开始计时，若学员直播中途退出，退出时计时停止，若中途有多次进入退出，每次进入退出时间段累加</p>
        <p class="ruleDialogTexe">举例：老师在7:00开始直播，8:00结束直播，学员A在7:10进入直播间，在7:30退出直播间，在7:50再次进入直播间，直至8:00结束直播，则该学员在本次直播中累计观看直播时长=20（7:10~7:30) + 10（7:50~8:00）=30分钟。</p>
      </div>
      <div class="section">
        <h3 class="ruleDialogTitle first_text">老师直播时长消耗计算方式：</h3>
        <p class="ruleDialogTexe">按老师实际直播开始至直播结束期间（非设置的开始/结束时间)</p>
      </div>
      <div class="section">
        <h3 class="ruleDialogTitle">单次直播总时长计算方式：</h3>
        <p class="ruleDialogTexe first_text">老师直播时长消耗+所有学员观看直播时长</p>
        <p class="ruleDialogTexe">举例：老师上一节直播课从开始直播至结束直播共60分钟，直播期间内共有2位学员观看直播，学员A直播期间累计观看30分钟，学员B全程看完60分钟直播，本次直播共消耗直播时长：60（老师耗时）+ 30+60 = 150分钟</p>
      </div>
      <div class="section last_section">
        <h3 class="ruleDialogTitle">直播时长结算时机：</h3>
        <p class="ruleDialogTexe first_text">当直播结束时，根据老师直播时长及所有学员在本次直播间观看时长累计总和扣除对应直播时长数</p>
        <p class="ruleDialogTexe">若扣除后账户剩余直播时长&lt;=0，无法开始其他直播</p>
      </div>

      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="ruleDialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="ruleDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 直播时长消耗明细弹窗 -->
    <el-dialog
      :visible.sync="particularDialogVisible"
      class="particularDialog"
      width="420px"
      title="直播时长消耗明细"
    >
      <div class="particularDialogTitle">
        <div class="particular_item">
          <span class="particular_item_name">直播名称:</span>
          <span>{{ liveTimerInfo.liveName }}</span>
        </div>
        <div class="particular_item">
          <span class="particular_item_name">实际开始时间:</span>
          <span>{{ liveTimerInfo.liveStartTime }}</span>
        </div>
        <div class="particular_item">
          <span class="particular_item_name">实际结束时间:</span>
          <span>{{ liveTimerInfo.liveEndTime }}</span>
        </div>
      </div>
      <div class="particularTime">
        <span>总消耗时长: </span>
        <span class="particularTimeNum">{{ liveTimerInfo.totalDuration }}分钟</span>
      </div>
      <div class="tableParticular">
        <div class="tableTitle">
          <span>老师消耗时长</span>
          <el-tooltip placement="bottom">
            <div slot="content">
              <span>老师消耗时长计算方式:</span>
              <br>
              <span>老师实际开始直播至实际结束直播的时间间隔</span>
            </div>
            <i class="el-icon-question" />
          </el-tooltip>
        </div>
        <div class="rubbish_table particular_table">
          <el-table
            ref="rabTable"
            :data="teacherTimerData"
            size="medium"
            stripe
          >
            <el-table-column
              label="姓名"
              prop="teacherName"
              fixed
            />
            <el-table-column
              label="消耗时长"
              fixed
            >
              <template slot-scope="scope">
                <template>
                  <div>{{ scope.row.teacherDuration }}分钟</div>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="tableParticular">
        <div class="tableTitle">
          <span>学员消耗时长</span>
          <el-tooltip placement="bottom">
            <div slot="content">
              <span>学员消耗时长计算方式:</span>
              <br>
              <span>直播期间学员在直播间内观看时长累计</span>
            </div>
            <i class="el-icon-question" />
          </el-tooltip>
        </div>
        <div class="rubbish_table particular_table">
          <el-table
            ref="rabTable"
            :data="stuTimerData"
            size="medium"
            stripe
          >
            <el-table-column
              label="姓名"
              prop="name"
              fixed
            />
            <el-table-column
              label="消耗时长"
              fixed
            >
              <template slot-scope="scope">
                <template>
                  <a @click="getTimer(scope.row)">{{ scope.row.duration }}分钟</a>
                </template>
              </template>
            </el-table-column>
          </el-table>
          <div class="fenye">
            <el-pagination
              v-if="stuTimerPaging.resultCount !== 0"
              :total="stuTimerPaging.resultCount"
              :current-page="stuTimerPaging.pageIndex"
              :page-size="stuTimerPaging.pageSize"
              :small="true"
              layout="total,prev, pager, next, sizes"
              @current-change="pageIndexChange($event - 1, 'stuTimer')"
              @size-change="pageSizeChange($event, 'stuTimer')"
            />
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="particularDialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="particularDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 学员时长消耗明细 -->
    <el-dialog
      :visible.sync="stuDialogVisible"
      title="学员时长消耗明细"
      width="400px"
    >
      <div class="particularDialogTitle">
        <div class="particular_item">
          <span class="particular_item_name">学员姓名:</span>
          <span>{{ stuDialogData.name }}</span>
        </div>
        <div class="particular_item">
          <span class="particular_item_name">消耗时长:</span>
          <span>{{ stuDialogData.duration }}分钟</span>
        </div>
      </div>
      <div class="step_wrap">
        <div class="step">
          <el-steps direction="vertical">
            <el-step v-for="(item, index) in stuDialogData.operRecordList" :key="index">
              <template v-slot:title>
                <div v-if="item.type === 'in'" class="joinLiveRoom">进入直播间</div>
                <div v-else class="joinLiveRoom">退出直播间</div>
                <div v-if="item.interval" class="step_time_num">{{ item.interval }}分钟</div>
              </template>
              <template v-slot:description>
                <div v-if="item.loginTime" class="step_time">{{ item.loginTime }}</div>
                <div class="step_time">{{ item.logoutTime }}</div>
              </template>
            </el-step>
          </el-steps>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="stuDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { expendRecordList, durationFlowList, expendRecordInfoList, operRecord, queryAccount } from '../../../api/online/liveLesson'
import NullData from '@/components/MiniCommon/NullData'

export default {
  components: {
    NullData
  },
  data() {
    return {
      duration: 0,
      activeName2: 'first',
      ruleDialogVisible: false,
      particularDialogVisible: false,
      stuDialogVisible: false,
      tableHeight: 'calc(100vh - 420px)',
      getConsumeParams: {
        pageIndex: 0,
        pageSize: 10
        // tenantId: this.$store.getters.tenantId,
        // orgId: this.$store.getters.orgId
      },
      getTimerInfoListParams: {
        pageIndex: 0,
        pageSize: 50
        // tenantId: this.$store.getters.tenantId,
        // orgId: this.$store.getters.orgId
      },
      getFlowParams: {
        pageIndex: 0,
        pageSize: 10
        // tenantId: this.$store.getters.tenantId,
        // orgId: this.$store.getters.orgId
      },
      teacherTimerData: [],
      liveTimerInfo: {},
      consumePaging: {},
      flowPaging: {},
      stuTimerPaging: {},
      consumeListData: [],
      stuTimerData: [],
      flowListData: [],
      stuDialogData: {
        operRecordList: []
      }
    }
  },
  created() {
    this.loadThemeInstList()
    this.getQueryAccount()
  },
  methods: {
    async getQueryAccount() {
      const res = await queryAccount()
      const { errorCode, duration } = res.data
      if (errorCode === 0) {
        this.duration = duration
      } else {
        this.$message.error(res.data.errorMessage)
      }
    },
    // 课程时长消耗列表
    loadThemeInstList() {
      expendRecordList(this.getConsumeParams).then(res => {
        const { errorCode, results, data } = res.data
        if (errorCode === 0) {
          this.consumeListData = results
          this.consumePaging.resultCount = data.resultCount
          this.consumePaging.pageIndex = data.pageIndex + 1
          this.consumePaging.pageSize = data.pageSize
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    getDurationFlowList() {
      durationFlowList(this.getFlowParams).then(res => {
        const { errorCode, results, data } = res.data
        if (errorCode === 0) {
          this.flowListData = results
          this.flowPaging.resultCount = data.resultCount
          this.flowPaging.pageIndex = data.pageIndex + 1
          this.flowPaging.pageSize = data.pageSize
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    handleClick(tab) {
      if (tab.index === '0') {
        this.loadThemeInstList()
      } else {
        this.getDurationFlowList()
      }
    },
    getDetails(id) {
      this.particularDialogVisible = true
      this.getTimerInfoListParams.liveClassId = id
      this.getClassTimerInfoList()
    },
    // 直播时长消耗明细
    getClassTimerInfoList() {
      expendRecordInfoList(this.getTimerInfoListParams).then(res => {
        const { errorCode, teacherName, teacherDuration, results, data } = res.data
        if (errorCode === 0) {
          this.liveTimerInfo = res.data
          this.teacherTimerData = [{ teacherName, teacherDuration }]
          this.stuTimerData = results
          this.stuTimerPaging.resultCount = data.resultCount
          this.stuTimerPaging.pageIndex = data.pageIndex + 1
          this.stuTimerPaging.pageSize = data.pageSize
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    getTimer(row) {
      this.stuDialogData = row

      const data = {
        tenantId: this.$store.getters.tenantId,
        orgId: this.$store.getters.orgId,
        id: this.stuDialogData.id
      }
      operRecord(data).then(res => {
        const { errorCode, operRecordList } = res.data
        if (errorCode === 0) {
          this.stuDialogData.operRecordList = operRecordList
          this.stuDialogVisible = true
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    pageIndexChange(index, type) {
      if (type === 'flow') {
        this.getFlowParams.pageIndex = index
        this.getDurationFlowList()
      }
      if (type === 'consume') {
        this.getConsumeParams.pageIndex = index
        this.loadThemeInstList()
      }
      if (type === 'stuTimer') {
        this.getTimerInfoListParams.pageIndex = index
        this.getClassTimerInfoList()
      }
    },
    pageSizeChange(e, type) {
      if (type === 'flow') {
        this.getFlowParams.pageSize = e
        this.getDurationFlowList()
      }
      if (type === 'consume') {
        this.getConsumeParams.pageSize = e
        this.loadThemeInstList()
      }
      if (type === 'stuTimer') {
        this.getTimerInfoListParams.pageSize = e
        this.getClassTimerInfoList()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.service_content{
  text-align: center;
  color: #666;
  font-size: 14px;

  img{
    width: 100%;
    margin-bottom: 10px;
  }
}
.details_title{
  background-color: #F6F7F9;
  padding: 20px;

  .timer_title{
    margin-bottom: 20px;

    .timer_span{
      color: #333;
      font-size: 16px;
      margin-right: 10px;
    }
    .rule{
      color: #46B6EE;
      font-size: 14px;
      cursor: pointer;
    }
  }

  .timer_wrap{
    display: inline-block;
    font-size: 14px;
    color: #333;
    margin-right: 20px;
    margin-bottom: 17px;

    .timeNum{
      font-size: 26px;
    }
    .none{
      color: #F56C6C;
    }
    .immediately{
      color: #E6A23C !important;
    }
  }

  .residue_tips{
    color: #F56C6C;
    font-size: 14px;

    .residue_tips_icon{
      margin-right: 10px;
    }
  }
}
.table_wrap /deep/{
  margin-top: 30px;

  .el-tabs__content{
    padding-right: 0 !important;
  }
  .el-tabs__item.is-top{
    width: 140px;
    text-align: center;
  }
}

.ruleDialog {
  font-size: 14px;

  .section{
    margin-bottom: 30px;
  }
  .last_section{
    margin-bottom: 20px;
  }
  .ruleDialogTitle{
    color: #333;
    margin-bottom: 10px;
    font-weight: 500;
  }
  .ruleDialogTexe{
    color: #666;
  }
  .first_text{
    margin-bottom: 10px;
  }
}

.step_wrap{
  margin-top: 10px;

  .step /deep/ {
    margin-top: 20px;
    border-bottom: 1px solid #eee;

    .el-step__title.is-wait{
      overflow: hidden;
      padding-bottom: 5px;
    }

    .joinLiveRoom{
      float: left;
      color: #333;
      font-size: 14px;
    }
    .step_time_num{
      float: right;
    }
    .step_time_num,
    .step_time{
      color: #666;
      font-size: 12px;
    }
    .el-step__icon-inner{
      display: none;
    }
    .el-step__icon.is-text{
      width: 9px;
      height: 9px;
      border: 1px solid #ddd;
      margin-top: 6px;
    }
    .el-step__head.is-process .el-step__icon.is-text{
      background-color: #fff;
    }
    .el-step.is-vertical .el-step__line{
      width: 1px;
      left: 4px;
      top: 10px;
      bottom: -10px;
    }
    .el-step__title.is-finish{
      color: #333;
    }
    .el-step.is-vertical:nth-child(odd) {
      .el-step__main{
        margin-bottom: 30px;
      }
    }
    .el-step.is-vertical:nth-child(even) {
      .el-step__main{
        padding-bottom: 20px;
        margin-bottom: 20px;
        border-bottom: 1px solid #eee;
      }
      .el-step__line{
        display: none !important;
      }
    }
    .el-step.is-vertical:last-child {
      .el-step__main{
        margin-bottom: 0;
        border-bottom: none;
      }
    }
  }
  .step:last-child{
    border-bottom: none;
  }
}
.particularDialogTitle{
  background-color: #F6F7F9;
  padding: 10px;

  .particular_item{
    margin-bottom: 10px;
    color: #666;
    font-size: 14px;

    &:last-child{
      margin-bottom: 0;
    }

    .particular_item_name{
      font-weight: 400;
      color: #333;
    }
  }
}
.particularDialog{
  .particularTime{
    color: #666;
    font-size: 14px;
    padding: 20px 0 13px 0;
    border-bottom: 1px solid #eee;

    .particularTimeNum {
      color: #F56C6C;
      font-size: 16px;
      font-weight: 600;
    }
  }
  .tableParticular{
    margin-top: 20px;

    .tableTitle{
      margin-bottom: 14px;
      font-size: 16px;
      border-left: 6px solid #46B6EE;
      padding-left: 6px;

      i{
        font-size: 18px;
      }
    }
    .particular_table /deep/{
      border: 1px solid #ddd;

      .el-table__fixed::before{
        display: none;
      }
      .cell{
        cursor: pointer;
      }
    }
  }
}
</style>
