<template>
  <div>
    <div class="classRecord">
      <CommonSearch
        ref="search"
        :is-inline="true"
        :params="formInline"
        :forms="formInline"
        @toParent="resetFieldHanle"
      />
      <advanced-search v-bind="superSearch" />
      <div class="add">
        <el-button
          v-if="hasBtn('504000001')"
          type="primary"
          @click="arrangeCourse"
        >排课</el-button>
      </div>
      <div class="middle_all">
        <div class="operation">
          <span style="margin-right:10px">
            已选
            <span style="color:#46B6EE">{{ checkNum || '0' }}</span> 条数据
          </span>
          <el-button
            v-if="hasBtn('504000002')"
            class="cancel_btn edit_btn"
            @click="delCheckData"
          >删除</el-button>
        </div>
        <div
          v-if="tabKey == 1"
          class="chooseItem"
        >
          <a @click="OperationQuery('yesterday')">上一天</a>
          <div>
            <span
              v-if="start == end"
              style="font-size:20px;color:rgba(0,0,0,.65)"
            >{{ start }}</span>
            <span
              v-else
              style="font-size:20px;color:rgba(0,0,0,.65)"
            >{{ start }} ~ {{ end }}</span>
            <span
              v-if="isBackDay"
              class="go_back"
              @click="OperationQuery('today')"
            >（返回今天）</span>
            <span
              v-else
              style="color:rgb(221, 221, 221);cursor:default"
            >（返回今天）</span>
          </div>
          <a @click="OperationQuery('tomorrow')">下一天</a>
        </div>
        <div
          v-if="tabKey == 2"
          class="chooseItem"
        >
          <a @click="OperationQuery('lastWeek')">上一周</a>
          <div>
            <span
              v-if="start == end"
              style="font-size:20px;color:rgba(0,0,0,.65)"
            >{{ start }}</span>
            <span
              v-else
              style="font-size:20px;color:rgba(0,0,0,.65)"
            >{{ start }} ~ {{ end }}</span>
            <span
              v-if="isBackWeek"
              class="go_back"
              @click="OperationQuery('backToWeek')"
            >（返回本周）</span>
            <span
              v-else
              style="color:rgb(221, 221, 221);cursor:default"
            >（返回本周）</span>
          </div>
          <a @click="OperationQuery('nextWeek')">下一周</a>
        </div>
        <div class="timeRadio">
          <div class="radioGroup">
            <el-radio-group
              v-model="tabKey"
              @change="tabChange"
            >
              <el-radio-button label="1">按天</el-radio-button>
              <el-radio-button label="2">按周</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
      <CommonTable
        ref="tableCommon"
        :columns="columns"
        :table-height="tableHeight"
        :pagination="listQuery"
        :options="options"
        :operation="operates"
        :table-key="'teachManage_courseSchedule_classRecords_classRecordsTable'"
        @handleSelectionChange="selectionChange"
      />
      <DelArrange
        ref="arrageCourse"
        @toUpdateTable="getUpdateTableData"
      />
      <EditArrange
        v-if="isEditShow"
        ref="editCourse"
        @toUpdateTable="getUpdateTableData"
        @toCloseEdit="getCloseEditArrange"
      />
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
    </div>
  </div>
</template>
<script src="./classRecordsTable.js"></script>
<style lang="scss" scoped>
.classRecord {
  a {
    color: #46b6ee;
  }
  .add {
    float: right;
  }
  .middle_all {
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    flex-direction: row;
    flex-wrap: nowrap;
    -webkit-box-pack: justify;
    justify-content: space-between;
    margin-bottom: 16px;
    .operation {
      line-height: 28px;
      width: 25%;
      span {
        color: #666;
      }
    }
    .chooseItem {
      line-height: 28px;
      width: 50%;
      display: flex;
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-evenly;
      -webkit-box-align: baseline;
      user-select: none;
      cursor: default;
      a {
        color: #1d9df2;
        &:hover {
          color: #56c0f5;
        }
      }
      .go_back {
        color: #1d9df2;
        cursor: pointer;
        &:hover {
          color: #56c0f5;
        }
      }
    }
    .timeRadio {
      line-height: 28px;
      width: 25%;
      overflow: hidden;
      .radioGroup {
        float: right;
      }
    }
  }
}
</style>
<style lang="scss">
.classRecord {
  .studyDate {
    color: #1d9df2;
    cursor: pointer;
    &:hover {
      color: #56c0f5;
    }
  }
}
</style>
