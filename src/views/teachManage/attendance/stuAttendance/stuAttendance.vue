<template>
  <div class="stuAttendance">
    <div class="dayChooseome">
      <div class="dayChoose">
        <!-- <span>日期选择：</span> -->
        <el-date-picker
          v-model="studyDate"
          :picker-options="pickerOptions"
          :clearable="false"
          style="vertical-align:top"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
        />
        <el-button style="margin-left:15px;" type="primary" @click="OperationQuery('beforeDay')">上一天</el-button>
        <el-button :disabled="isCurrentDay" type="primary" @click="OperationQuery('nextDay')">下一天</el-button>
      </div>
      <!--筛选-->
      <div class="search">
        <!-- 搜索栏 -->
        <CommonSearch
          :is-inline="true"
          :params="formInline"
          :forms="formInline"
          @toParent="resetFieldHanle"
        />
        <advanced-search v-bind="superSearch" />
      </div>
    </div>
    <div class="stuAttendancecont">
      <div v-if="attendanceList && attendanceList.length>0" class="stuAttendanceconttest">
        <div v-for="(item,index) of attendanceList" :key="index" class="stuAttendance_item">
          <div class="stuAttendance_item_title">
            <div class="stuAttendance_item_title_left">
              <!-- <div class="stuAttendance_item_left_top"/> -->
              <ul>
                <li>课程名称：</li>
                <li>排课标题：</li>
                <li>消耗课时：</li>
                <li>班级名称：</li>
                <li>时间段：</li>
                <li>主教：</li>
                <li>助教：</li>
                <li>教室：</li>
                <li v-if="isCurrentDay">最大人数：</li>
              </ul>
              <ul class="stuAttendance_item_title_left_ul">
                <li>{{ item.courseName || '--' }}</li>
                <li>{{ item.title }}</li>
                <li>{{ item.cost || '--' }}</li>
                <li>{{ item.clsName || '--' }}</li>
                <li>{{ item.startTime + '-' + item.endTime }}</li>
                <li>{{ item.mtNames || '--' }}</li>
                <li>{{ item.atNames || '--' }}</li>
                <li>{{ item.roomName || '--' }}</li>
                <li v-if="isCurrentDay">{{ item.maxNum || '--' }}</li>
              </ul>
            </div>
          </div>
          <div class="stuAttendance_item_info">
            <div class="stuAttendance_item_info_tops">
              <div class="stuAttendance_item_lefts">
                <span class="stuAttendance_item_lefts_span">已考勤/总考勤人数</span>
                <!-- 判断是否考勤完成 -->
                <span>
                  <span v-if="item.yetCheckNum == 0 && item.totalCheckNum == 0">
                    <span
                      style="color:red;"
                    >{{ ( (item.yetCheckNum != null ? item.yetCheckNum : '0') + '/' + (item.totalCheckNum != null ? item.totalCheckNum : '0')) || '--' }}(未完成考勤)</span>
                  </span>
                  <span v-else-if="item.yetCheckNum == item.totalCheckNum">
                    <span
                      style="color:#4AB8EE;"
                    >{{ ( (item.yetCheckNum != null ? item.yetCheckNum : '0') + '/' + (item.totalCheckNum != null ? item.totalCheckNum : '0')) || '--' }}(已完成考勤)</span>
                  </span>
                  <span v-else>
                    <span
                      style="color:red;"
                    >{{ ( (item.yetCheckNum != null ? item.yetCheckNum : '0') + '/' + (item.totalCheckNum != null ? item.totalCheckNum : '0')) || '--' }}(未完成考勤)</span>
                  </span>
                </span>
              </div>
              <div class="stuAttendance_item_rights">
                <el-button v-if="!isCurrentDay" type="primary" @click="stuAttendanceDetail(item)">明细</el-button>
                <el-button v-else-if="hasBtn('506000001')" type="primary" @click="stuAttendanceChange(item)">考勤</el-button>
                <el-button class="cancel_btn" @click="reapplyTicket(item)">补打小票</el-button>
              </div>
            </div>
            <div class="stuAttendance_item_info_cont">
              <div class="stuAttendance_item_info_cont_top">
                <img
                  src="https://img.ishanshan.com/gimg/n/20190404/547e509d15bab9c5470d2947ccf08108"
                >
                <span>上课学员</span>
                <span
                  v-if="item.maxAttNum == '-1' "
                >{{ (item.num || 0) + '(' + (item.lineNum || 0) + ')' }}</span>
                <span
                  v-else
                >{{ (item.num || 0) + '/' + (item.maxAttNum || 0) + '(' + (item.lineNum || 0) + ')' }}</span>
              </div>
              <div v-if="!isCurrentDay" class="stuAttendance_item_info_cont_bottom">
                <span>{{ '出勤:' + (item .cq || 0) }}</span>
                <span>{{ '请假:' + (item .qj || 0) }}</span>
                <span>{{ '旷课:' +(item .kk || 0) }}</span>
                <span>{{ '取消:' + (item .qx || 0) }}</span>
              </div>
            </div>
            <div class="stuAttendance_item_info_cont">
              <div class="stuAttendance_item_info_cont_top">
                <img
                  src="https://img.ishanshan.com/gimg/n/20190404/35de416782a6e6ce3e2b003d43c618b6"
                >
                <span>补课学员</span>
                <span v-if="item.maxMulNum == '-1'">{{ (item.mulNum || 0) }}</span>
                <span v-else>{{ (item.mulNum || 0) + '/' + (item.maxMulNum || 0) }}</span>
              </div>
              <div v-if="!isCurrentDay" class="stuAttendance_item_info_cont_bottom">
                <span>{{ '出勤:' + (item .bkcq || 0) }}</span>
                <span>{{ '请假:' + (item .bkqj || 0) }}</span>
                <span>{{ '旷课:' +(item .bkkk || 0) }}</span>
                <span>{{ '取消:' + (item .bkqx || 0) }}</span>
              </div>
            </div>
            <div class="stuAttendance_item_info_cont">
              <div class="stuAttendance_item_info_cont_top">
                <img
                  src="https://img.ishanshan.com/gimg/n/20190404/b9becd5a65ffe36b893edb4a28a4848c"
                >
                <span>预约试听</span>
                <span v-if="item.maxTryNum == '-1'">{{ (item.tryNum || 0) }}</span>
                <span v-else>{{ (item.tryNum || 0) + '/' + (item.maxTryNum || 0) }}</span>
              </div>
              <div v-if="!isCurrentDay" class="stuAttendance_item_info_cont_bottom">
                <span>{{ '已试听:' + (item .st || 0) }}</span>
                <span>{{ '旷课:' + (item .stkk || 0) }}</span>
                <span>{{ '取消:' + (item .stqx || 0) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="null_data">
        <img src="https://img.ishanshan.com/gimg/user/n///1550211410.png" >
        <div>暂无数据</div>
      </div>
    </div>

    <!-- 分页-->
    <el-pagination
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      :current-page="pageIndex"
      :total="totalCount"
      layout=" total, prev, pager, next, sizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 考勤/明细 -->
    <EditAndAttendance
      ref="editAttendance"
      :teacher-list="teacherList"
      @toUpdateTable="getUpdateTable"
    />
    <!-- 补办考勤小票 -->
    <ReapplyAttendanceTicket ref="reapplySmallTicket" :teacher-list="teacherList" />
  </div>
</template>
<script src="./stuAttendance.js"></script>
<style lang="scss" scoped>
.stuAttendance {
  .dayChooseome{
    overflow: hidden;
  .dayChoose /deep/ {
    float: left;
    margin-bottom: 20px;
    .el-button.is-disabled,
    .el-button.is-disabled:focus,
    .el-button.is-disabled:hover {
      width: 74px;
    }
  }
     .search{
       float: left;
       margin-left: 15px;
   }
}

  .null_data {
    min-height: 200px;
    text-align: center;
    height: 100%;
    width: 100%;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    min-height: 100px;
    -webkit-box-pack: center;
    img {
      margin-top: -10px;
    }
    div {
      cursor: default;
      font-size: 12px;
      color: #999;
      margin-top: 10px;
    }
  }
  .stuAttendancecont {
    height: calc(100vh - 227px);
    overflow: auto;
    position: relative;
    .stuAttendanceconttest {
      width: 100%;
      min-width: 1250px;
      height: 100%;
      .stuAttendance_item {
        margin-bottom: 20px;
        width: 100%;
        height: 246px;
        border-radius: 0px;
        border: 1px solid #ddd;
        .stuAttendance_item_title {
          padding: 10px 20px;
          float: left;
          height: auto;
          width: 20%;
          height: 245px;
          background: #F6F7F9;
          border-bottom: 1px solid #ddd;
          display: flex;
          flex-wrap: nowrap;
          -webkit-box-pack: justify;
          justify-content: space-between;
          .stuAttendance_item_title_left {
            width: 100%;
             ul {
                width: 50%;
                float: left;
                li {
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  margin: 8px auto;
                    font-size: 14px;
                    color: #666666;
               }
              }
              .stuAttendance_item_title_left_ul {
                 width: 50%;
                float: left;
                 li {
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  margin: 8px auto;
                    font-size: 14px;
                    color: #333;
               }
              }
          }
        }
        .stuAttendance_item_info {
          width: 80%;
           height: 246px;
          float: right;
          overflow: hidden;
          .stuAttendance_item_info_tops{
                width: 100%;
                overflow: hidden;
                padding: 15px;
                border-bottom: 1px solid #DDDDDD;
            .stuAttendance_item_lefts{
              float: left;
             .stuAttendance_item_lefts_span{
                display: inline-block;
                padding: 10px;
                color: #666;
              }
            }
            .stuAttendance_item_rights {
                  float: right;
                  margin-top: 4px;
                }
          }
          .stuAttendance_item_info_cont:last-child {
            border: 0;
          }
          .stuAttendance_item_info_cont {
           float: left;
          //  height: 75px;
            border-right: 1px solid #ddd;
            width: 33.33%;
            margin-top:60px;
            .stuAttendance_item_info_cont_top {
              display: flex;
              flex-wrap: nowrap;
              -webkit-box-pack: center;
              -webkit-box-align: center;
              align-items: center;
              justify-content: center;
              img {
                height: 40px;
                margin-right: 20px;
                width: 40px;
              }
              span:nth-child(2) {
                margin-right: 40px;
              }
              span {
                color: #666;
                height: 20px;
                line-height: 20px;
              }
            }
            .stuAttendance_item_info_cont_bottom {
              margin-top: 18px;
              display: flex;
              flex-wrap: nowrap;
              -webkit-box-pack: center;
              -webkit-box-align: center;
              align-items: center;
              justify-content: center;
              span {
                color: #999;
                margin-top: -5px;
                margin-left: 30px;
              }
              span:first-child {
                margin-left: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>
