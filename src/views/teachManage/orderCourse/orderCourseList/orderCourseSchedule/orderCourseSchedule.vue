<template>
  <div class="schedule">
    <CommonSearch
      :is-inline="true"
      :params="formInline"
      :forms="formInline"
      @toParent="resetFieldHanle"
    />
    <advanced-search v-bind="superSearch" />

    <div class="add">
      <el-button
        type="primary"
        @click="schedulePrintByDay"
      ><span>按天打印课表</span></el-button>
    </div>

    <OrderCourseDetail
      ref="orderDetail"
      @toParent="getCancelData"
      @toLineStu="getLineCancelData"
      @toTryStu="getTryCancelData"
      @toOnceOrderCourse="getOnceOrderCourse"
      @toBatchOrderCourse="getBatchOrderCourse"
      @toOrderMissCourse="getOrderMissCourse"
      @toOrderTryCourse="getOrderTryCourse"
      @toCancelUpdate="getUpdateOnceOrder"
      @toInlineUpdate="getInlineUpdate"
      @toleaveUpdate="getUpdateOnceOrder"
      @toReturnUpdate="getUpdateOnceOrder"
    />

    <!-- 取消 -->
    <CancelOrderCourse
      ref="cancel"
      @toCancelUpdate="getUpdateOnceOrder"
    />
    <!-- 取消试听 -->
    <CancelTryStudent
      ref="cancelTry"
      @toCancelUpdate="getUpdateOnceOrder"
    />
    <!-- 单次约课 -->
    <OnceOrderCourse
      ref="onceOrderCourse"
      @toUpdateOnceOrder="getUpdateOnceOrder"
    />
    <!-- 批量约课 -->
    <BatchOrderCourse
      ref="batchOrderCourse"
      @toUpdateOnceOrder="getUpdateOnceOrder"
    />
    <!-- 预约补课 -->
    <OrderMissLesson
      ref="orderMissLesson"
      @toUpdateOnceOrder="getUpdateOnceOrder"
    />
    <!-- 预约试听 -->
    <OrderTryCourse
      ref="orderTryCourse"
      @toUpdateOnceOrder="getUpdateOnceOrder"
    />
    <div id="calendar">
      <el-button
        class="cancel_btn cancel_btn_tab"
        style="float:right"
        @click="toSchedule"
      >切换成列表</el-button>
      <div id="popover">
        <div class="marBot">时间 ： {{ startTime }} ~ {{ endTime }}</div>
        <div class="marBot">标题 ： {{ title }}</div>
        <div class="marBot">课程 ： {{ courseName }}</div>
        <div class="marBot">主题 ： {{ courseTheme || '--' }}</div>
        <div class="marBot">进度 ： {{ process || '--' }}</div>
        <div class="marBot">教室 ： {{ roomName }}</div>
        <div class="marBot">主教 ： {{ mtNames }}</div>
        <div>助教 ： {{ atNames || '--' }}</div>
      </div>
    </div>
  </div>
</template>
<script src="./orderCourseSchedule.js"></script>
<style lang="scss" scoped>
.schedule /deep/ {
  position: relative;
    .cancel_btn_tab{
      background-color: #46B6EE;
      color: #fff;
      border: 1px solid #46B6EE;
      // padding: 0.5px;
      padding-left: 20px;
      padding-right: 20px;
      height: 28px;
    position: absolute;
    top:0px;
    left: 130px;
  }
  .cancel_btn_tab:hover{
    background-color: #56C0F5;
     span{
        color: #fff;
     }

      // border: 1px solid #46B6EE;
  }
  #calendar {
    position:relative;
    #popover {
      display: none;
      position:absolute;
      z-index: 999999;
      background-color:#FFFFFF;
      border: 1px solid #DCDFE6;
      border-radius: 10px;
      padding: 15px;
      .marBot {
        margin-bottom: 8px;
      }
    }
  }
  .fc-left {
    display: none;
  }
  .fc-toolbar .fc-right {
    float: left;
  }
  .fc .fc-button-group > :first-child {
    width: 56px;
    height: 28px;
    background: #fff;
  }
  .fc .fc-button-group > :last-child {
    width: 56px;
    height: 28px;
  }
  .fc-button-group .fc-state-active {
    // background: #46b6ee !important;
    color: #46b6ee;
    box-shadow: none;
    background: #fff;
    border-color: #46b6ee;
  }
  .fc-toolbar button:focus {
    // background: #46b6ee;
    // color: #fff;
    background-image: none;
    border-color: #ddd;
    background-repeat: no-repeat;
    text-shadow: none;
    box-shadow: none;
  }
  .fc-button-group .fc-state-hover {
    background: #fff;
    color: #46b6ee;
  }
  .fc-state-default {
    background: #fff;
    background-image: none;
    border-color: #ddd;
    text-shadow: none;
    box-shadow: none;
  }
}
.add /deep/ {
  float: right;
  .el-button--primary.is-plain {
    color: #46b6ee;
    border-color: #46b6ee;
    background: #fff;
  }
  .el-button--primary.is-plain:focus,
  .el-button--primary.is-plain:hover {
    background: #fff;
    border-color: #46b6ee;
    color: #46b6ee;
  }
  .el-button--primary.is-plain:active {
    background: #fff;
    border-color: #46b6ee;
    color: #46b6ee;
  }

}
// .schedule{
//   position: relative;
//   .cancel_btn{
//     position: absolute;
//     top:50px;
//     left: 120px;
//   }
// }
</style>
