<template>
  <div class="visitRecordCon_container">
    <div class="visitCon_left">
      <div class="visitCon_left_wrap">
        <div v-if="listData && listData.length > 0">
          <template v-for="(item,index) in listData">
            <div
              :key="index + 'visitList'"
              :class="[{active:selectIndex === index},'content_left_item']"
              @click="recordSelect(item, index)"
            >
              <div class="con_left_item_img">
                <div v-if="item.sex === '1'">
                  <img
                    v-if="item.headimgurl"
                    :src="item.headimgurl"
                  >
                  <img
                    v-else
                    src="https://img.ishanshan.com/gimg/img/d75fdb312bbaca043a97d24c5453a337"
                  >
                </div>

                <div v-else-if="item.sex === '2'">
                  <img
                    v-if="item.headimgurl"
                    :src="item.headimgurl"
                  >
                  <img
                    v-else
                    src="https://img.ishanshan.com/gimg/img/ad8cc625441146bdf8e373dec1cd600f"
                  >
                </div>

                <div v-else>
                  <img
                    v-if="item.headimgurl"
                    :src="item.headimgurl"
                  >
                  <img
                    v-else
                    src="https://img.ishanshan.com/gimg/n/20190413/4f27b672aa2dde5186327f00a1f4a37b"
                    alt
                  >
                </div>
                <span v-if="item.sourceType === 0" :class="[{isactive:selectIndex === index},'typeSpan']" >潜在学员</span>
                <span v-else-if="item.sourceType === 1" :class="[{isactive:selectIndex === index},'typeSpan']" >在读学员</span>
                <span v-else-if="item.sourceType === 2" :class="[{isactive:selectIndex === index},'typeSpan']" >往期学员</span>
              </div>
              <div class="con_left_item_text">
                <p>
                  <span class="item_name_text">{{ item.stuName || '--' }}</span>
                  <span class="item_right_text">跟进人:
                    <i>{{ item.sellerName }}</i>
                  </span>
                </p>
                <p>
                  <i>{{ item.visitTime }}</i>
                </p>
                <p>
                  <span class="item_left_content">到访内容:
                    <i style="">{{ item.content }}</i>
                  </span>
                </p>
              </div>
            </div>
          </template>
        </div>
        <div
          v-else
          class="null_data"
        >
          <img src="https://img.ishanshan.com/gimg/user/n///1550211410.png">
          <div>暂时没有数据</div>
        </div>
      </div>
      <div
        v-if="listData && listData.length > 0"
        class="content_left_pageSize"
      >
        <el-pagination
          :page-size="pageSize"
          :total="resultCount"
          :current-page="pageIndex"
          layout="total,prev, pager, next"
          @current-change="pageChange"
        />
      </div>
    </div>
    <div>
      <img src="https://img.ishanshan.com/gimg/img/0f4b3e548fb0edce54c578866babc7af">
    </div>
    <div
      v-if="selectItem && selectItem.id"
      class="visitCon_right"
    >
      <div>
        <div class="content_right_item">
          <div class="con_right_item_img">

            <div v-if="selectItem.sex === '1'">
              <img
                v-if="selectItem.headimgurl"
                :src="selectItem.headimgurl"
              >
              <img
                v-else
                src="https://img.ishanshan.com/gimg/img/d75fdb312bbaca043a97d24c5453a337"
                alt
              >
            </div>

            <div v-else-if="selectItem.sex === '2'">
              <img
                v-if="selectItem.headimgurl"
                :src="selectItem.headimgurl"
              >
              <img
                v-else
                src="https://img.ishanshan.com/gimg/img/ad8cc625441146bdf8e373dec1cd600f"
                alt
              >
            </div>

            <div v-else>
              <img
                v-if="selectItem.headimgurl"
                :src="selectItem.headimgurl"
              >
              <img
                v-else
                src="https://img.ishanshan.com/gimg/n/20190413/4f27b672aa2dde5186327f00a1f4a37b"
                alt
              >
            </div>

          </div>
          <div class="con_right_item_text">
            <span
              class="item_right_item_stuname"
              @click="openSideDetail(selectItem)"
            >
              {{ selectItem.stuName || '--' }}
            </span>
            <div class="item_right_item_info">
              <span class="item_right_text">到访时间:
                <i>{{ selectItem.visitTime }}</i>
              </span>
              <span class="item_right_text">到访状态:
                <i>{{ selectItem.status == '1' ? '已到访' : selectItem.status == '2' ? '待跟进' : '已关闭' }}</i>
              </span>
              <span class="item_right_text">跟进人:
                <i>{{ selectItem.sellerName }}</i>
              </span>
              <span v-if="isDsf" class="item_right_text">收集人:
                <i>{{ selectItem.collectName || '--' }}</i>
              </span>
              <span v-if="isDsf" class="item_right_text">来源类别:
                <i>{{ selectItem.channel || '--' }}</i>
              </span>
              <span v-if="isDsf" class="item_right_text">市场渠道:
                <i>{{ selectItem.secondChannel || '--' }}</i>
              </span>
              <span v-if="isDsf" class="item_right_text">二级渠道:
                <i>{{ selectItem.subSecondChannel || '--' }}</i>
              </span>
            </div>
          </div>
        </div>
        <div class="con_right_item_content">
          <span>{{ selectItem.content }}
          </span>
          <div v-if="selectItem">
            <!-- <Confirm
              :text="'确认到访'"
              :placement="'top'"
              :content="'确认到访么?'"
              :confirm="()=>{confirmVisited(selectItem)}"
              :is-button="true"
              :btn-type="'primary'"
              :btn-disabled="selectItem.status == '1' || selectItem.status == '0' || listData.length == 0 ? true : false"
            /> -->
            <el-button
              v-if="hasBtn('404000002')"
              :disabled="selectItem.status == '1' || selectItem.status == '0' || listData.length == 0 ? true : false"
              :loading="visitedLoading"
              style="margin:0px 10px 0 0"
              type="primary"
              @click="openVisited(selectItem)"
            >确认到访</el-button>
            <el-button
              v-if="hasBtn('404000003')"
              :disabled="selectItem.status == '1' || selectItem.status == '0' || listData.length == 0 ? true : false"
              style="margin:0px 10px 0 5px"
              type="primary"
              @click="edit"
            >编辑</el-button>
            <Confirm
              v-if="hasBtn('404000004')"
              :text="'取消'"
              :placement="'top'"
              :content="'确认取消么?'"
              :confirm="()=>{cancelVisitRecord(selectItem)}"
              :is-button="true"
              :btn-class="'cancel_btn'"
              :btn-disabled="selectItem.status == '1' || selectItem.status == '0' || listData.length == 0 ? true : false"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 侧边详情 -->
    <CrmDetailModal
      ref="crmDetailModal"
      v-bind="detailProps"
      :name="studentName"
      :header-data="headerData"
      :base-data="baseData"
      :params="idObj"
      class="side_follow_dialog"
      @toUpdateVisitTable="getUpdateTable"
    />
    <AddVisitDialog
      ref="addVisitDialog"
      @toUpdateTable="getUpdateTable"
    />

    <!-- 确认到访 -->
    <el-dialog
      :visible.sync="visitedVisible"
      :close-on-click-modal="false"
      title="确认到访"
      width="500px"
    >
      <el-form
        ref="visitedForm"
        :model="visitedForm"
        label-width="80px"
      >
        <el-form-item
          :rules="[
            { required: true, message: '请选择销售'}
          ]"
          label="分配销售"
        >
          <el-select
            v-model="visitedForm.sellerId"
            :style="{width: '100%'}"
            placeholder="请选择销售"
          >
            <el-option
              v-for="(item, index) in sallerList"
              :key="'saller'+index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button
          :loading="visitedLoading"
          @click="visitedClose"
        >取 消</el-button>
        <el-button
          :loading="visitedLoading"
          type="primary"
          @click="confirmVisited"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CrmDetailModal from '@/components/CrmDetailModal'
import { queryVisitRecord, updateVisitStatus, getSingleClueStu,getStuMsg,leadsSummary,stusOfUser } from '@/api/crm/visitMgr/visitMgr' //eslint-disable-line
import { tenantUserSummaryQuery } from '@/api/crm/studentInfo/lantentStu'
import Confirm from '@/components/MiniCommon/Confirm'
import AddVisitDialog from '../components/addVisitRecord'

export default {
  components: {
    CrmDetailModal,
    Confirm,
    AddVisitDialog
  },
  props: {
    source: {
      type: String,
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      selectIndex: 0,
      selectItem: {},
      resultCount: 0,
      listData: [],
      pageSize: 10,
      pageIndex: 1,
      // 详情
      detailProps: {
        source: '2',
        btns: [],
        headerInfo: [
          { label: '负责销售', key: 'saler' },
          { label: '负责老师', key: 'counselorName' }
        ],
        baseInfo: [],
        defaultTab: 'visiteRecord',
        tabs: ['visiteRecord', 'parent']
      },
      // 头部数据
      headerData: {},
      // 基础信息数据
      baseData: {},
      studentName: '',
      stuList: [], // 学员总的列表
      idObj: {},
      // 确认到访
      visitedVisible: false,
      visitedLoading: false,
      currentRow: {}, // 当前选中
      sallerList: [], // 负责销售下拉
      visitedForm: {
        sellerId: ''
      }
    }
  },
  computed: {
    isDsf() {
      return window.language === 'dsf'
    }
  },
  mounted() {
    this.queryVisitRecord()
    // 获取负责销售
    this.getSaller()
  },
  methods: {
    queryVisitRecord(val) {
      let params
      if (val) {
        params = {
          pageSize: this.pageSize,
          pageIndex: 0,
          // source: '2',
          queryType: 'org'
          // sourceType: '0'
        }
        Object.assign(params, val)
        this.pageIndex = 1
      } else {
        // console.log('999999999-======================')
        params = {
          ...this.searchValue,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex - 1,
          queryType: 'org',
          // source: '2',
          sourceType: '0'
        }
      }
      // console.log('params----到访管理', params)
      queryVisitRecord(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.listData = data.results
          this.resultCount = data.data && data.data.resultCount
          this.recordSelect(this.listData[0], 0)
          this.searchValue = params
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },

    /** 获取负责销售 */
    getSaller() {
      tenantUserSummaryQuery().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.sallerList = data.results || []
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },

    /** 打开到访确认 */
    openVisited(row) {
      if (row.sellerId) {
        const params = {
          ids: row.id,
          status: '1',
          sellerId: row.sellerId
        }
        this.visitedLoading = true
        updateVisitStatus(params).then(res => {
          const data = res.data
          if (data.errorCode === 0) {
            this.$message.success(data.errorMessage)
            this.queryVisitRecord()
          } else {
            this.$message.error(data.errorMessage)
          }
          this.visitedLoading = false
        })
      } else {
        this.currentRow = row
        this.visitedVisible = true
      }
    },

    /** 关闭到访确认 */
    visitedClose() {
      this.visitedForm.sellerId = ''
      this.visitedVisible = false
    },

    /* 到访确认 */
    confirmVisited() {
      this.$refs.visitedForm.validate((valid) => {
        if (valid) {
          const params = {
            ids: this.currentRow.id,
            status: '1',
            sellerId: this.visitedForm.sellerId
          }
          this.visitedLoading = true
          updateVisitStatus(params).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.$message.success(data.errorMessage)
              this.visitedClose()
              this.queryVisitRecord()
            } else {
              this.$message.error(data.errorMessage)
            }
            this.visitedLoading = false
          })
        } else {
          return false
        }
      })
    },
    /* 取消到访 */
    cancelVisitRecord(selectItem) {
      const params = {
        ids: selectItem.id,
        status: '0'
      }
      updateVisitStatus(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.$message.success(data.errorMessage)
          this.queryVisitRecord()
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 侧边详情弹框 */
    openSideDetail(selectItem) {
      this.studentName = ''
      const params = {
        stuId: selectItem.stuId
      }
      this.idObj = {
        ...selectItem
      }
      let ageMonth = ''
      this.stuList = []
      if (selectItem.source == '2') { //eslint-disable-line
        getSingleClueStu(params).then(res => {
          const data = res.data
          if (data.errorCode === 0) {
            this.detailProps.baseInfo = [
              { label: '姓名', key: 'name' },
              { label: '昵称', key: 'nickName' },
              { label: '性别', key: 'sex' },
              { label: '生日', key: 'birthday' },
              { label: '年龄(月龄)', key: 'month' },
              { label: '民族', key: 'nation' },
              { label: '爱好', key: 'hobby' },
              { label: '年级', key: 'grade' },
              { label: '特长', key: 'speciality' },
              { label: '血型', key: 'bloodType' },
              { label: '学校', key: 'schaddress' },
              { label: '社保号码', key: 'socialSecurityNum' },
              { label: '备注', key: 'remark' },
              { label: '联系地址', key: 'conaddress' },
              { label: '家长姓名', key: 'parentName' },
              { label: '家长手机号', key: 'parentMobile' },
              { label: '家长关系', key: 'relationName' },
              { label: '家长QQ', key: 'qqNumber' },
              { label: '家长行业', key: 'trade' },
              { label: '家长邮箱', key: 'email' },
              { label: '固定电话', key: 'tel' },
              { label: this.$t('firstChannel.label'), key: 'first' },
              { label: this.$t('secondChannel.label'), key: 'second' },
              { label: '校区名称', key: 'orgName' },
              { label: '其他来源', key: 'otherChannel' }
            ]
            this.headerData = {
              last: data.followRecordTime,
              next: data.nextFollowTime,
              saler: data.sellerName,
              status: data.studentFollowStateName
            }
            if (data.age || data.month) {
              ageMonth = data.age + '(' + data.month + ')'
            }
            this.studentName = data.name
            this.baseData = {
              name: data.name,
              nickName: data.nickName,
              sex: data.sex == '1' ? '男' : data.sex =='2' ?'女': '--', //eslint-disable-line
              birthday: data.birthday,
              month: ageMonth,
              nation: data.nation,
              hobby: data.hobby,
              grade: data.grade,
              speciality: data.speciality,
              bloodType: data.bloodType,
              schaddress: data.schaddress,
              socialSecurityNum: data.socialSecurityNum,
              remark: data.remark,
              conaddress: data.conaddress,
              parentName: data.parentName,
              parentMobile: data.parentMobile,
              relationName: data.relationName,
              qqNumber: data.qqNumber,
              trade: data.trade,
              email: data.email,
              tel: data.tel,
              first: data.channelName,
              second: data.secondChannelName,
              orgName: data.orgName,
              otherChannel: data.otherChannel
            }
            this.$refs.crmDetailModal.visible = true
          } else {
            this.$message.error(data.errorMessage)
          }
        })
      } else {
        this.detailProps.baseInfo = [
          { label: '姓名', key: 'name' },
          { label: '性别', key: 'sex' },
          { label: '生日', key: 'birthday' },
          { label: '年龄(月龄)', key: 'month' },
          { label: '年级', key: 'grade' },
          { label: '星座', key: 'constellation' },
          { label: '民族', key: 'nation' },
          { label: '爱好', key: 'hobby' },
          { label: '特长', key: 'speciality' },
          { label: '血型', key: 'bloodType' },
          { label: '学校', key: 'schaddress' },
          { label: '社保号码', key: 'socialSecurityNum' },
          { label: '手机号', key: 'mobile', popover: 'true' },
          { label: '学员类型', key: 'intentionName' },
          { label: '地址', key: 'conaddress' },
          { label: this.$t('firstChannel.label'), key: 'first' },
          { label: this.$t('secondChannel.label'), key: 'second' },
          { label: '备注', key: 'remark' },
          { label: '其他来源', key: 'otherChannel' }
        ]
        getStuMsg(params).then(res => {
          const data = res.data
          if (data.errorCode === 0) {
            const result = data.data
            this.headerData = {
              saler: result.sellerName,
              counselorName: result.counselorName
            }
            if (result.age || result.month) {
              ageMonth = result.age + '(' + result.month + ')'
            }
            this.studentName = result.name
            this.baseData = {
              name: result.name,
              sex: result.sex == '1' ? '男' : result.sex =='2' ?'女': '--', //eslint-disable-line
              birthday: result.birthday,
              month: result.age + '(' + result.month + ')',
              grade: result.grade,
              constellation: result.constellation,
              nation: result.nation,
              hobby: result.hobby,
              speciality: result.speciality,
              bloodType: result.bloodType,
              schaddress: result.schaddress,
              socialSecurityNum: result.socialSecurityNum,
              mobile: result.mobile,
              intentionName: result.intentionName,
              conaddress: result.conaddress,
              first: result.channelName,
              second: result.secondChannelName,
              remark: result.remark,
              otherChannel: result.otherChannel
            }
            this.$refs.crmDetailModal.visible = true
          } else {
            this.$message.error(data.errorMessage)
          }
        })
      }
      // leadsSummary().then(res => {
      //   const data = res.data
      //   if (data.errorCode === 0) {
      //     this.stuList = data.results
      //     stusOfUser().then(res => {
      //       const data = res.data
      //       if (data.errorCode === 0) {
      //         this.stuList = this.stuList.concat(data.results)
      //         this.stuList && this.stuList.map(item => {
      //           if (item.stuId == selectItem.id) { //eslint-disable-line
      //             const obj = item
      //             console.info('obj', obj)
      //           }
      //         })
      //       } else {
      //         this.$message.error(data.errorMessage)
      //       }
      //     })
      //   } else {
      //     this.$message.error(data.errorMessage)
      //   }
      // })

      // const params = {
      //   stuId: selectItem.id
      // }
      // getSingleClueStu(params).then(res => {
      //   const data = res.data
      //   if (data.errorCode === 0) {
      //     console.log('res--->', res)
      //   } else {
      //     this.$message.error(data.errorMessage)
      //   }
      // })
    },
    /* 详情按钮 */
    clickOne(type) {
      console.log('报名', type)
    },
    recordSelect(item, index) {
      this.selectIndex = index
      this.selectItem = item
    },
    pageChange(index) {
      this.pageIndex = index
      this.queryVisitRecord()
    },
    /* 编辑 */
    edit() {
      this.$refs.addVisitDialog.showDialog(this.selectItem)
    },
    getUpdateTable() {
      this.queryVisitRecord()
    }
  }
}
</script>
<style lang="scss" scoped>
.visitRecordCon_container /deep/ {
  .side_follow_dialog {
    .el-tabs__content {
      height: calc(100vh - 445px);
      // overflow-y: auto;
    }
    .leads-content {
      height: 100%;
    }
  }
  .isactive{
    color: #ffffff;
    .typeSpan{
       display: inline-block;
       margin-top: 5px;
       color: #333333;
    }
  }
  .active {
    background: #46b6ee !important;
    .con_left_item_text {
      i {
        font-style: normal;
        color: #fff !important;
      }
      span {
        color: #fff !important;
      }
      .item_name_text {
        background: #fff !important;
        color: #46b6ee !important;
      }
    }
  }
  position: relative;
  width: 100%;
  height: 100%;
  .visitCon_left {
    position: relative;
    width: 440px;
    height: 100%;
    overflow: hidden;
    overflow-x: hidden;
    .null_data {
      width: 100%;
      height: inherit;
      display: flex;
      -moz-box-orient: vertical;
      -webkit-box-direction: normal;
      flex-direction: column;
      -webkit-box-pack: center;
      justify-content: center;
      -webkit-box-align: center;
      align-items: center;
      min-height: 100px;
      img {
        margin-bottom: 10px;
      }
      div {
        color: #999;
        cursor: default;
      }
    }
    .visitCon_left_wrap {
      padding: 20px;
      overflow-y: auto;
      overflow-x: hidden;
      height: calc(100% - 50px);
      max-height: calc(100% - 50px);
      background: rgba(240, 242, 245, 1);
      .content_left_item:last-child {
        margin-bottom: 0;
      }
      .content_left_item {
        position: relative;
        width: 400px;
        height: 112px;
        background: #fff;
        border-radius: 5px;
        margin-bottom: 20px;
        cursor: pointer;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
        background: #fff;
        &:hover {
          background: rgba(255, 255, 255, 1);
          box-shadow: 0px 0px 4px 0px rgba(70, 182, 238, 1);
          border: 1px solid rgba(70, 182, 238, 1);
        }
        .con_left_item_img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          position: absolute;
          top: 10px;
          left: 10px;
          img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
          }
        }
        .con_left_item_text {
          position: absolute;
          left: 80px;
          top: 15px;
          width: calc(100% - 80px);
          p {
            width: 100%;
            height: 27px;
            line-height: 27px;
            position: relative;
          }
          i {
            font-style: normal;
            color: rgba(51, 51, 51, 1);
          }
          span {
            color: rgba(153, 153, 153, 1);
          }
          .item_left_content {
            color: rgba(153, 153, 153, 1);
            i {
              overflow: hidden;
              white-space: nowrap;
              display: inline-block;
              width: 230px;
              text-overflow: ellipsis;
              line-height: 14px;
            }
          }
          .item_name_text {
            background: rgba(70, 182, 238, 0.1);
            color: rgba(70, 182, 238, 1);
            padding: 3px 8px;
            box-sizing: border-box;
            border: 1px solid rgba(70, 182, 238, 1);
            border-radius: 4px;
            line-height: 14px;
          }
          .item_right_text {
            position: absolute;
            right: 80px;
          }
        }
      }
    }
    .content_left_pageSize {
      width: 100%;
      height: 50px;
    }
  }
  .visitCon_right {
    position: absolute;
    right: 0;
    top: 0;
    width: calc(100% - 440px);
    height: 100%;
    padding: 20px 0 20px 20px;
    box-sizing: border-box;
    .content_right_item {
      display: flex;
      .con_right_item_img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        flex: none;
        img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
      }
      .con_right_item_text {
        padding-left: 30px;
        padding-top: 20px;
        display: flex;
        flex-direction: column;
        .item_right_item_stuname {
          color: #1d9df2;
          font-size: 16px;
          cursor: pointer;
          line-height: 16px;
          font-weight: 500;
          &:hover {
            color: #56c0f5;
          }
        }
        .item_right_item_info {
          margin-top: 18px;
          .item_right_text {
            color: #999999;
            margin-right: 70px;
            line-height: 20px;
            display: inline-block;
            i {
              color: #333333;
              font-style: normal;
            }
          }
        }
      }
    }
    .con_right_item_content {
      margin-left: 110px;
      margin-top: 16px;
      border-top: 1px solid #eeeeee;
      height: 400px;
      padding-top: 30px;
      div {
        margin-top: 30px;
      }
    }
  }
}
</style>

