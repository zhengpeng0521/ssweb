<template>
  <div>
    <el-dialog
      :visible.sync="lessonVisibleTow"
      :close-on-click-modal="false"
      title="课系删除失败"
      width="600px"
      class="themeManage"
    >
      <div>该课系已关联课程，请先将将相关课程调整至其他课系</div>
      <div class="textbox">
        已关联课程：
        <span
          v-for="(item, index) of lessonListcourse"
          :key="index"
        >{{ item.courseName }}, </span>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          class="edit_btng"
          @click="compact"
        >确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="lessonVisible"
      :close-on-click-modal="false"
      title="课系管理"
      width="600px"
      class="themeManage"
    >
      <div
        v-loading="loading"
        class="theme_content"
      >
        <div class="line" />
        <div class="theme_head">
          <div class="head_item">课系名称</div>
          <div class="head_item">操作</div>
        </div>
        <div style="height:calc(100% - 44px);overflow:auto;width:560px">
          <div class="theme_row">
            <div
              v-for="(item, index) of lessonList"
              :key="index"
              class="row_item"
            >
              <div
                class="tr_item"
                style="text-align: left;width: 380px;"
              >
                <el-popover
                  placement="top"
                  trigger="hover"
                >
                  <div style="text-align:center">{{ item.name }}</div>
                  <div
                    slot="reference"
                    style="float: left;"
                    class="theme_title"
                  >{{ item.name }}</div>
                </el-popover>
              </div>
              <div class="tr_item">
                <a
                  v-if="hasBtn('502000002')"
                  style="margin-right:20px"
                  @click="editTheme(item)"
                >编辑</a>
                <el-popover
                  v-model="item.deleteLessonVisible"
                  placement="top"
                  trigger="click"
                >
                  <div>
                    <i class="el-icon-warning confirm-icon" />
                    <div style="margin:4px 4px 16px 0;display:inline-block">
                      确定删除
                      <span style="color:red">{{ item.name }}</span> ?
                    </div>
                    <div>(注：若该课系有关联课程，则不可删除)</div>
                  </div>
                  <div style="float:right;margin:0px 4px 4px 0">
                    <el-button
                      class="delete_btn"
                      @click="item.deleteLessonVisible = false"
                    >取消</el-button>
                    <el-button
                      type="primary"
                      class="edit_btn"
                      @click="deleteGroupCourse(item)"
                    >确定</el-button>
                  </div>
                  <a
                    v-if="hasBtn('502000003')"
                    slot="reference"
                  >删除</a>
                </el-popover>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <el-pagination
          :page-size="pageSize"
          :total="pageTotal"
          :page-sizes="[10, 20, 30, 40, 50, 100, 200]"
          layout="total, prev, pager, next, sizes"
          @size-change="sizeChange"
          @current-change="indexChange"
        />
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="lessonVisible = false"
        >关闭</el-button>
        <el-button
          v-if="hasBtn('502000001')"
          type="primary"
          @click="addThemeFunc"
        >新增课系</el-button>
      </span>
    </el-dialog>
    <AddDept
      ref="addDept"
      @toParent="getData"
    />
  </div>
</template>
<script>
import AddDept from './addNewDept'
import { queryCoursegroup, deleteCoursegroup } from '@/api/teachManage/course' //eslint-disable-line
export default {
  components: {
    AddDept
  },
  data() {
    return {
      loading: false,
      pageTotal: 0,
      pageIndex: 1,
      pageSize: 20,
      lessonVisibleTow: false,
      lessonVisible: false, // 弹窗显示
      lessonList: [], // 课系列表
      lessonListcourse: []
    }
  },

  methods: {
    /* 确定*/
    compact() {
      this.lessonVisibleTow = false
    },
    show() {
      this.lessonVisible = true
      this.getGroupList(this.pageSize, this.pageIndex)
    },
    /* 获取课系列表 */
    getGroupList(pageSize, pageIndex) {
      this.loading = true
      const params = {
        pageSize: pageSize,
        pageIndex: pageIndex - 1
      }
      queryCoursegroup(params).then(res => {
        const data = res.data
        if (data && data.errorCode === 0) {
          this.pageTotal = res.data.data.resultCount
          this.lessonList = res.data.results
          this.loading = false
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.getGroupList(pageSize, this.pageIndex)
    },
    indexChange(pageIndex) {
      this.pageIndex = pageIndex
      this.getGroupList(this.pageSize, pageIndex)
    },
    /* 新增课系 */
    addThemeFunc() {
      this.$refs.addDept.show()
    },
    /* 编辑课系 */
    editTheme(item) {
      this.$refs.addDept.show(item)
    },
    /* 删除课系 */
    deleteGroupCourse(item) {
      const params = {
        id: item.id
      }
      deleteCoursegroup(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          item.deleteLessonVisible = false
          this.getGroupList()
          this.$message.success(data.errorMessage)
        } else if (data.courseErrorMsgs) {
          this.lessonListcourse = data.courseErrorMsgs
          this.lessonVisibleTow = true
        } else {
          this.lessonVisibleTow = false
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 获取新增/编辑的数据 */
    getData() {
      this.getGroupList()
    }
  }
}
</script>
<style lang="scss" scoped>
.themeManage /deep/ {
  .theme_content {
    height: 400px;
    margin-bottom: 14px;
    border: 1px solid #ddd;
    position: relative;
    .line {
      width: 1px;
      height: 400px;
      background: #ddd;
      position: absolute;
      right: 178px;
    }
    .theme_head {
      display: flex;
      flex-wrap: nowrap;
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      flex-direction: row;
      width: 560px;
      background: rgba(240, 242, 245, 0.6);
      .head_item {
        height: 44px;
        line-height: 44px;
        padding: 0 20px;
      }
    }
    .theme_head .head_item:first-child {
      text-align: left;
      width: 380px;
      border-right: 1px solid #ddd;
    }
    .theme_head .head_item:last-child {
      text-align: right;
      width: 180px;
    }
    .theme_row .row_item:nth-child(2n) {
      background: rgba(240, 242, 245, 0.2);
    }
    .theme_row {
      // height: calc(100% - 44px);
      // overflow: auto;
      .row_item {
        display: flex;
        flex-wrap: nowrap;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        flex-direction: row;
        height: 44px;
        line-height: 44px;
        text-align: center;
        .tr_item {
          padding: 0 20px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 180px;
          a {
            color: #46b6ee;
          }
        }
      }
    }
    .row_item .tr_item:last-child {
      text-align: right;
      width: calc(100% - 380px);
    }
    .row_item .tr_item:first-child {
      border-right: 1px solid #ddd;
    }
    .theme_title {
      text-align: left;
      text-overflow: ellipsis;
      white-space: normal;
      -webkit-box-orient: vertical;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      word-break: break-all;
    }
  }
}
.confirm-icon {
  font-size: 16px;
  color: #ffaa00;
}
.edit_btng {
  margin: 0 auto;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 5px;
}
.textbox {
  margin: 20px 0;
}
</style>
