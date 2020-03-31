<template>
  <full-Screen :type="type" :study="study" :visible.sync="sideDialogShows" class="container">
    <div class="wrapAll">

      <div class="wrapS">
        <div
          v-loading="treeLoading"
          class="wrapleft"
          element-loading-text="拼命加载中"
        >
          <div v-for="(item, index) in detailList" :key="index" style="padding-bottom:20px">
            <div class="title" @click="hitmeun(index,item)">
              <i v-if="item.showcont" class="el-icon-arrow-up" />
              <i v-else class="el-icon-arrow-down" />
              <span style="margin-left:10px">{{ item.name }}</span>
            </div>

            <div v-show="item.showcont">
              <ul v-if="item.videoList && item.videoList.length > 0" class="content">
                <li
                  v-for="(child, nums) in item.videoList"
                  :key="nums"
                  :class="nums !== item.videoList.length-1 ? 'text' : '' "
                  :style="selectInfo.indexOf(item.id) > -1 && selectInfo.indexOf(child.id) > -1 ? {color: '#46B6EE'} : {}"
                  @click="activehit(child, item)"
                >
                  <span>{{ child.name }}</span>
                </li>
              </ul>

              <p v-else class="content" style="color:#333;">该章节下暂无视频</p>
            </div>

          </div>
        </div>
        <!-- 内容 -->
        <div class="content">
          <el-tabs v-model="activeName" type="card" @tab-click="changeTab">
            <el-tab-pane label="课程详情" name="info">
              <div
                v-loading="videoLoading"
                class="wrapright"
                element-loading-text="拼命加载中"
              >
                <div class="rightAll">
                  <span class="line" />
                  <span class="con">课程详情</span>
                </div>
                <div class="rightcont">
                  <div class="tiel detail">基本信息</div>
                  <div class="colo">课件名称：<span>{{ detailCourse.coursewareName }}</span></div>
                  <div class="colo linh">课件描述：<span>{{ detailCourse.coursewareDesc || '--' }}</span></div>
                  <div class="styeAll">
                    <span class="colo">课件封面：</span>
                    <img v-if="detailCourse.cwHomePageUrl" :src="detailCourse.cwHomePageUrl" alt="封面" style="height:90px;" >
                  </div>
                  <div class="tiel detail">视频信息</div>
                  <div class="colo">{{ selectChapter.name }}：<span>{{ detailItem.name }}</span></div>
                  <div class="colo linh">视频描述：<span>{{ detailItem.desc || '--' }}</span></div>
                  <div class="styeAll">
                    <span class="colo">查看视频：</span>
                    <video v-if="detailItem.url" :src="detailItem.url" controls controlslist="nodownload" width="345px" height="194px" class="detail_video" />
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="课程评论" name="commit">
              <div class="commitBox">
                <div class="rightAll">
                  <span class="line" />
                  <div class="con">{{ chapter }} <span style="color:#666666;font-size:14px;">{{ mulu }}</span></div>
                </div>
                <CommonSearch
                  :is-inline="true"
                  :params="formInline"
                  :forms="formInline"
                  @toParent="resetFieldHanle"
                />
                <div class="common_table">
                  <div v-if="commitLists && commitLists.length >0" class="commitList">
                    <div v-for="(item,index) in commitLists" :key="'commit'+ index" class="commit">
                      <div class="commit_title">
                        {{ item.custName }}
                      </div>
                      <div class="commit_content">
                        {{ item.comment }}
                      </div>
                      <div class="footer">
                        <div class="commit_time">
                          {{ item.feedbackTime }}
                        </div>
                        <div v-if="item.replyType === 0" class="operate">
                          <span :class="index === indexnum ? 'hasAnwser' : ''" style="margin-right:10px;" @click="answer(index,item)">回复</span>
                          <Popover
                            style="display:initial"
                            placement="top"
                            popper-class="myPopover"
                            trigger="click"
                            @method="deleteCommit(index, item)"
                          >
                            <div>
                              <i class="el-icon-warning" style="color:#fa0;font-size:16px;"/>
                              <div style="display:inline-block;color:#666;font-size:12px;margin:4px 4px 16px;text-align:left;">确定删除吗？</div>
                            </div>
                            <a slot="reference" >删除评论</a>
                          </Popover>

                        </div>
                        <div v-if="item.replyType === 1" class="operate">
                          <Popover
                            style="display:initial"
                            placement="top"
                            popper-class="myPopover"
                            trigger="click"
                            @method="deleteAnswer(index, item)"
                          >
                            <div>
                              <i class="el-icon-warning" style="color:#fa0;font-size:16px;"/>
                              <div style="display:inline-block;color:#666;font-size:12px;margin:4px 4px 16px;text-align:left;">确定删除吗？</div>
                            </div>
                            <a slot="reference" style="margin-right:10px;">删除回复</a>
                          </Popover>
                          <Popover
                            style="display:initial"
                            placement="top"
                            popper-class="myPopover"
                            trigger="click"
                            @method="deleteCommit(index, item)"
                          >
                            <div>
                              <i class="el-icon-warning" style="color:#fa0;font-size:16px;"/>
                              <div style="display:inline-block;color:#666;font-size:12px;margin:4px 4px 16px;text-align:left;">确定删除吗？</div>
                            </div>
                            <a slot="reference" >删除评论</a>
                          </Popover>
                        </div>
                      </div>
                      <div v-if="item.replyType === 1" class="answerBox">
                        回复：{{ item.replyCommnet }}
                      </div>
                      <div v-if="index === indexnum " style="height:140px;position:relative;">
                        <el-input
                          v-model="message"
                          type="textarea"
                          placeholder="请输入回复内容"
                          style="width:100%;margin-top:20px;max-height:80px;min-height: 80px;"
                          maxlength="200"
                          show-word-limit
                        />
                        <span style="position:absolute;top: 80px;right: 10px;color:#333333;">{{ textLength || 0 }}/200</span>
                        <div class="btn" style="margin-top:20px;float:right;">
                          <el-button @click="cancle">取 消</el-button>
                          <el-button type="primary" @click="submit">确 定</el-button>
                        </div>

                      </div>
                    </div>
                  </div>
                  <div v-else class="null_data">
                    <img src="https://img.ishanshan.com/gimg/user/n///1550211410.png" >
                    <div>暂无评论</div>
                  </div>
                  <!-- 分页-->
                  <el-pagination
                    v-if="commitLists && commitLists.length >0"
                    :page-size="paging.pageSize"
                    :page-sizes="[10, 20, 30, 40]"
                    :current-page="paging.pageIndex"
                    :total="paging.resultCount"
                    layout=" total, prev, pager, next, sizes"
                    @size-change="handleSizeChange"
                    @current-change="handleIndexChange"
                  />
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>

        </div>
      </div>
    </div>
  </full-Screen>
</template>

<script>
import FullScreen from '@/components/messageNotice/fullScreen' // 右侧弹出框样式
import { mapState, mapActions, mapMutations } from 'vuex'
import CommonSearch from '@/components/CommonSearch/CommonSearch'
import Popover from '@/components/CommonTable/popover'
import { feedbackList } from '@/api/teachManage/onlineLesson'
export default {
  components: {
    FullScreen,
    CommonSearch,
    Popover
  },
  data() {
    return {
      idx: '',
      type: '课件详情',
      study: '新增课件',
      sideDialogShows: false,
      chapter: '',
      mulu: '',
      textLength: '',
      activeName: 'info',
      message: '',
      currentRow: {},
      indexnum: '',
      replyId: '',
      paging: {
        pageSize: 10,
        pageIndex: 0,
        resultCount: 0
      },
      // commitLists: [
      //   {
      //     name: '小明',
      //     content: '老师很幽默风趣！很幸运能跟老师学习。课程看似长长的三个月，其实很短，后悔落下了作业！紧跟着老师学习才是最好的！老师手把手教学，告诉我们没有什么不可能，学习的技巧就这些，差别就在努力的程度！',
      //     time: '2019.12.12'
      //   },
      //   {
      //     name: '小明',
      //     content: '老师很幽默风趣！很幸运能跟老师学习。课程看似长长的三个月，其实很短，后悔落下了作业！紧跟着老师学习才是最好的！老师手把手教学，告诉我们没有什么不可能，学习的技巧就这些，差别就在努力的程度！',
      //     time: '2019.12.12',
      //     ishas: true,
      //     answer: '老师回复：这个应该这么理解。。。华夏齐心，荆楚复安宁！战国错金杜虎符是秦国杜县将领的左半符，它是秦汉雄风的写照，承载了秦人和当时华夏文明独步天下的军事智慧和缜密周详的国家动员机制，它们铸造了秦汉时阳刚威武、厚重深沉的民族品格，预示了伟大民族的昭昭天命'
      //   }
      // ],
      // pageSize: 10,
      // pageIndex: 1,
      // totalCount: 0, // 总条数
      formInline: {
        searchMethod: formValue => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'select',
            placeholder: '请选择评论时间',
            modelValue: 'commentTime',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              { value: '1', label: '今天' },
              { value: '2', label: '昨日' },
              { value: '3', label: '近一周' },
              { value: '4', label: '近1个月' }
            ]
          },
          {
            itemType: 'select',
            placeholder: '请选择回复状态',
            modelValue: 'commentType',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              // { value: , label: '全部' },
              { value: '1', label: '已回复' },
              { value: '0', label: '未回复' }
            ]
          },
          {
            itemType: 'input',
            placeholder: '请输入学员姓名',
            modelValue: 'custName',
            isClearable: true,
            itemStyle: 'width:140px'
          }
        ]
      },
      formValue: {} // 搜索栏的数据

    }
  },

  computed: {
    ...mapState('recorded', [
      'treeLoading',
      'detailList',
      'selectInfo',
      'detailItem',
      'selectChapter',
      'videoLoading',
      'detailCourse',
      'videoId',
      'commitLists'
    ])
  },

  watch: {
    // 关闭后数据清空重置
    sideDialogShows(val) {
      if (!val) {
        this.UPDATE_STATE({ selectInfo: [], selectChapter: {}, detailItem: {}, detailCourse: {}})
      }
    },
    activeName(val) {
      if (val === 'commit') {
        this.getList()
      }
    },
    message(val) {
      this.textLength = val.length
    }
  },
  mounted() {
    // console.log('selectInfo', this.selectInfo)
  },

  methods: {
    ...mapMutations('recorded', [
      'UPDATE_STATE'
    ]),
    ...mapActions('recorded', [
      'getCourseTree',
      'getCourseDetail',
      'feedbackList',
      'addFeedback',
      'deleteFeedback'
    ]),

    showDialog(row) {
      this.sideDialogShows = true
      this.activeName = 'info'
      this.indexnum = ''
      this.currentRow = row
      console.log('this.sas', this.detailItem)
      this.getCourseTree({ cwId: row.id })
      setTimeout(() => {
        // console.log('selectInfo', this.selectInfo, this.detailList, this.selectChapter, this.detailCourse)
        if (this.detailList.length > 0) {
          this.chapter = this.detailList[0].name
          if (this.detailList[0].videoList !== null && this.detailList[0].videoList.length > 0) {
            this.mulu = this.detailList[0].videoList[0].name
          } else {
            // this.chapter = ''
            this.mulu = ''
          }
        }
      }, 500)
    },
    // 切换tab
    changeTab() {
    },
    // 回复评论
    answer(index, item) {
      console.log('index', index, this.message)
      this.indexnum = index
      this.replyId = item.id
    },
    submit() {
      if ((/^[\s]{1,200}$/.test(this.message))) {
        this.$message.error('回复内容不能为全空格')
        return
      }
      const params = {
        replyId: this.replyId,
        videoId: this.videoId,
        comment: this.message,
        uid: this.$store.getters.id
      }
      if (this.message !== '' && !(/^[\s]{1,200}$/.test(this.message))) {
        this.addFeedback({ params })
        this.indexnum = ''
        this.message = ''
      } else if (this.message === '') {
        this.$message.error('回复内容不能为空')
      }
    },
    cancle() {
      this.indexnum = ''
      this.message = ''
    },
    // 删除评论
    deleteCommit(index, item) {
      // this.indexnum = index
      this.commitLists.splice(index, 1)
      const params = {
        feedbackId: item.id
      }
      this.deleteFeedback({ params })
    },
    // 删除回复
    deleteAnswer(index, item) {
      const params = {
        feedbackId: item.replyCommentId
      }
      this.deleteFeedback({ params })
    },
    resetFieldHanle() {
      // 重置的入参
      this.formValue = {}
      this.getList({ videoId: this.videoId })
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      const payload = {
        ...this.formValue,
        pageSize: 10,
        pageIndex: 0,
        videoId: this.videoId
      }
      console.log('this.formValue', payload)
      this.feedbackList({ payload })
      // this.getList(params)
    },
    handleSizeChange(size) {
      // 存储每页条数
      console.log('size', size)
      // localStorage.setItem(`org_common_pageSize`, size)
      this.paging.pageSize = size
      this.paging.pageIndex = 0
      this.getList()
    },
    handleIndexChange(current) {
      console.log('current', current)
      this.paging.pageIndex = current - 1
      this.getList()
    },
    getList() {
      const payload = {
        ...this.formValue,
        pageIndex: this.paging.pageIndex,
        pageSize: this.paging.pageSize,
        videoId: this.videoId
      }

      this.feedbackList({ payload, getPaging: this.getPaging })
    },
    getPaging(data) {
      console.log('data-----', data)
      this.paging = {
        pageSize: data.pageSize,
        pageIndex: data.pageIndex,
        resultCount: data.resultCount
      }
    },
    // 折叠面板
    hitmeun(index, item) {
      this.chapter = item.name
      // this.mulu = ''
      const temp = []
      this.detailList.forEach((item, key) => {
        if (index === key) {
          temp.push({
            ...item,
            showcont: !item.showcont
          })
        } else {
          temp.push({
            ...item
          })
        }
      })
      this.UPDATE_STATE({ detailList: temp })
    },

    // 切换课程
    activehit(child, item) {
      console.log('item', item, child)
      this.chapter = item.name
      this.mulu = child.name
      this.UPDATE_STATE({ selectInfo: [item.id, child.id], selectChapter: item })
      this.getCourseDetail({ id: child.id })
      const payload = {
        pageIndex: this.paging.pageIndex,
        pageSize: this.paging.pageSize,
        videoId: this.videoId
      }
      this.feedbackList({ payload })
    }
  }
}
</script>
<style scoped>
/*分页 start*/
.common_table >>> .el-pagination {
  text-align: end;
  padding: 7px 5px;
  color: #666;
  font-weight: normal;
  border-top: 1px solid #eee;
}
.common_table >>> .el-pager {
  padding: 5px 0 !important;
}
.common_table >>> .el-pager li.active {
  color: #fff;
  background: #46b6ee;
  border-radius: 4px;
  /*		width:30px;*/
  height: 18px;
  min-width: 18px;
  line-height: 18px;
  font-size: 12px;
}
.common_table >>> .el-pager li.active:hover {
  color: #fff !important;
}
.common_table >>> .el-pager li {
  height: 18px;
  font-size: 12px;
  /*		width: 30px;*/
  min-width: 18px;
  line-height: 18px;
}
.common_table >>> .el-pagination__sizes {
  height: 22px;
  line-height: 28px;
  margin: 0 10px;
}
.common_table >>> .el-pagination .el-select .el-input {
  width: 82px;
}
.common_table >>> .el-pagination__jump {
  margin-left: 10px;
  font-size: 12px;
  color: #666;
}
.common_table >>> .el-pagination__editor.el-input .el-input__inner {
  height: 22px;
  width: 36px;
}
.common_table >>> .el-pager li:hover {
  color: #46b6ee !important;
}
.common_table >>> .el-pagination button,
.el-pagination span:not([class*="suffix"]) {
  font-size: 12px;
}
.common_table >>> .el-input--mini .el-input__inner {
  height: 22px;
  line-height: 22px;
  font-size: 12px;
  color: #666;
}
.el-select-dropdown__item.selected {
  color: #46b6ee !important;
}
.common_table >>> .el-select .el-input.is-focus .el-input__inner {
  border-color: #46b6ee;
}
.common_table >>> .el-pagination__sizes .el-input .el-input__inner:hover {
  border-color: #46b6ee;
}
.common_table >>> .el-pagination__jump .el-input .el-input__inner:focus {
  border-color: #46b6ee;
}
.common_table >>> .el-select .el-input__inner:focus {
  border-color: #ddd;
}
/*end*/
</style>
<style lang="scss" scoped>
  .null_data {
    min-height: 200px;
    text-align: center;
     height: calc(100vh - 412px);
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
.content /deep/{
      width: 100%;
      // min-height: calc(100vh - 190px);
      background-color: #ffffff;
      padding: 20px 0 20px 0px;
      margin-left: 12px;
      margin-right: 20px;
        .el-tabs__nav-scroll{
        padding-left: 20px;
      }
      .commonSearch{
        margin-left: 20px;
      }
      .commitBox{
        height: calc(100vh - 291px);
      }
      .common_table{
        .commitList{
          padding: 0px 20px;
          height: calc(100vh - 412px);
          overflow-y: auto;
           .commit:first-child{
             padding-top: 0px;
            }
          .commit{
            width: 100%;
            height: auto;
            padding-bottom: 20px;
            padding-top: 20px;
            border-bottom: 1px solid #eeeeee;
            .answerBox{
              padding:15px;
              margin-top: 20px;
              width: 100%;
              min-height:116px;
              max-height: auto;
              color: #666666;
              font-size: 14px;
              background:rgba(240,242,245,0.4);
            }
          }
          .commit_title{
            color: #999999;
            font-size: 14px;
            margin-bottom: 10px;
          }
          .commit_content{
             color: #333333;
            font-size: 14px;
            margin-bottom: 10px;
          }
           textarea{
              max-height: 80px;
              min-height: 80px !important;
              background-color:rgba(238, 238, 238, 0.4) !important;
              border:1px solid rgba(238,238,238,1) !important;
            }
          .footer{
            display: flex;
            align-items: center;
            justify-content: space-between;
            .commit_time{
              font-size: 12px;
              color: #999999;
            }

            .operate{
              cursor: pointer;
              display: flex;
              font-size: 14px;
              color: #1D9DF2;
              .hasAnwser{
                color: #CCCCCC;
              }
            }
          }

        }
      }
   .rightAll {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 0px 0px 20px 20px;
        .line {
          width: 6px;
          height: 14px;
          background: rgba(70, 182, 238, 1);
          border-radius: 4px;
        }
        .con {
          font-size: 16px;
          color: #333333;
          margin-left: 7px;
        }
      }

  .el-tabs__item{
     padding: 0px 20px;
  }
  .el-tabs__content{
    padding: 0;
    // height: calc(100vh - 293px);
    // overflow-y: auto;
  }
  .el-tabs__item{
    background: #F7F7F7;
    color: #666;
  }
  .el-tabs__item.is-active{
    background: #fff;
  }
 .el-tabs--bottom .el-tabs__item.is-bottom:last-child, .el-tabs--bottom .el-tabs__item.is-top:last-child, .el-tabs--top .el-tabs__item.is-bottom:last-child, .el-tabs--top .el-tabs__item.is-top:last-child{
    padding-left:19px;
    padding-right:20px;
  }
}
.container {
  overflow: hidden;
  .wrapAll {
    padding: 16px 20px 0 20px;
    width: 100%;

    .wrapS {
      display: flex;
      background: rgba(240, 242, 245, 0.6);
      padding: 16px 0 0 16px;

      // min-height: calc(100vh - 190px);
    }
    .wrapleft {
      background: #fff;
      padding: 24px 20px;
      width: 22%;
      height: calc(100vh - 190px);
      overflow-y: auto;
      .title {
        line-height: 20px;
        background: rgba(240, 242, 245, 0.2);
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        padding: 15px 0 15px 14px;
        display: flex;
        align-items: center;
        cursor: pointer;
      }
      .content {
        padding: 14px 0 0 40px;
        li {
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
        }
        .text {
          padding-bottom: 14px;
        }
        span:hover {
          color: #46b6ee;
          cursor: pointer;
        }
        .active {
          color: #46b6ee;
        }
      }
    }
    .wrapright {
      padding-left: 26px;
      padding-top: 20px;
      width: 100%;
      height: calc(100vh - 293px);
      overflow-y: auto;
      .rightAll {
        display: flex;
        align-items: center;
        width: 100%;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
        .line {
          width: 6px;
          height: 14px;
          background: rgba(70, 182, 238, 1);
          border-radius: 4px;
        }
        .con {
          font-size: 16px;
          color: #666;
          margin-left: 7px;
        }
      }
      .rightcont {
        padding: 20px 0 0 36px;
        .tiel {
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
          padding-bottom: 16px;
          border-bottom: 1px solid #eee;
        }
        .colo {
          color: #333;
          span{
            color: #999;
          }
        }
        .linh {
          padding: 14px 0;
        }
        .detail {
          margin-bottom: 20px;
        }
        .styeAll {
          display: flex;
          padding-bottom: 20px;
        }
      }
    }
  }
}
.detail_video{
  border: 1px solid #ccc;
}
</style>

