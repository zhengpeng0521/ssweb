<template>
  <div>
    <div :style="{height: `calc(100vh - ${boxHeight})`}" class="video_box">
      <BlockTitle>课程章节视频</BlockTitle>
      <div class="video_content">
        <!-- 左侧章节 -->
        <div
          v-loading="loading"
          class="video_chapters"
          element-loading-text="拼命加载中">
          <el-button @click="() => openAdd()"><i class="el-icon-plus btn_icon" />新增章节</el-button>
          <ul class="chapter_list">
            <li v-for="(item, index) in chapters" :key="'chapter' + index" class="chapter_item">
              <div class="chapter_sort">
                <i
                  :style="index === chapters.length-1 ? {color: '#ccc', cursor: 'default'} : {}"
                  class="iconfont xiayi"
                  @click="() => {index === chapters.length-1 ? null : chapterSort(item.id, '2')}" />
                <i
                  :style="index === 0 ? {color: '#ccc', cursor: 'default'} : {}"
                  class="iconfont shangyi"
                  @click="() => {index === 0 ? null : chapterSort(item.id, '1')}" />
              </div>
              <span
                :style="currentKey === index ? { color: '#46B6EE' } : {}"
                @click="() => selectChapter(index, item)"
              >{{ item.name }}</span>
              <div class="chapter_action">
                <i class="iconfont bianji" @click="() => openAdd({name: item.name, id: item.id})" />

                <i
                  v-if="onlyOne"
                  :style="onlyOne ? { color: '#ccc', cursor: 'default' } : {}"
                  class="iconfont shanchu"
                />
                <Confirm v-else :confirm="() => removeChapter({name: item.name, id: item.id}, index)" has-slot>
                  <i
                    :style="onlyOne ? { color: '#ccc', cursor: 'default' } : {}"
                    class="iconfont shanchu"
                    @click="removeVisible = true"
                  />
                </Confirm>

              </div>
            </li>
          </ul>
        </div>

        <!-- 右侧视频上传 -->
        <div class="video_table">
          <el-button @click="uploadv"><i class="el-icon-plus btn_icon"/>上传视频</el-button>
          <div class="boxSearch">
            <h3 class="table_title">{{ chapterName }}视频内容</h3>
            <CommonSearch
              :is-inline="true"
              :params="formInline"
              :forms="formInline"
              @toParent="resetFieldHanle"
            />
          </div>
          <common-table
            ref="tableCommon"
            :columns="columns"
            :table-height="tableHeight"
            :pagination="pagination"
            :options="options"
            :operation="operates"
          />
        </div>
      </div>
    </div>
    <div class="video_btns">
      <!-- <el-button v-if="type === 'edit'" :loading="loading" @click="goBackEdit">取消</el-button> -->
      <el-button v-if="type === 'edit'" :loading="loading" type="primary" @click="editSave">确定并退出</el-button>
      <el-button v-if="type === 'add'" type="primary" @click="goBack">确定并退出</el-button>
      <el-button v-if="type === 'add'" type="primary" @click="goNext">确定并继续</el-button>
    </div>

    <AddChapter ref="addChapter" />
    <VideoPlay ref="videoPlay" />
    <EditVideo ref="editVideo" :refresh="() => getTable({ itemId: currentItem.id })" />
    <Uploadv ref="uploadv" :get-table="() => getTable({ itemId: currentItem.id })" />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import BlockTitle from '@/components/MiniCommon/BlockTitle'
import Confirm from '@/components/MiniCommon/Confirm'

import CommonTable from '@/components/CommonTable/CommonTable'
import CommonSearch from '@/components/CommonSearch/CommonSearch'
import AddChapter from './AddChapter'
import VideoPlay from './VideoPlay'
import EditVideo from './EditVideo'
import Uploadv from './Uploadv' // 上传视频
import { getVideoList } from '@/api/teachManage/onlineLesson'
export default {
  components: {
    BlockTitle,
    Confirm,
    CommonTable,
    AddChapter,
    VideoPlay,
    EditVideo,
    Uploadv,
    CommonSearch
  },
  props: {
    type: {
      type: String,
      default: 'add'
    }
  },

  data() {
    return {
      removeVisible: false,
      formInline: {
        searchMethod: formValue => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '请输入视频名称',
            modelValue: 'videoName',
            isClearable: true,
            itemStyle: 'width:140px'
          }
        ]
      },
      columns: [
        {
          label: '视频顺序',
          prop: 'sortable',
          width: '160px',
          render: (h, params) => {
            let show = 'none'
            let text = ''
            if (params.row.jobState === 'Transcoding') {
              show = 'inline'
              text = `(转码中${params.row.percent}%)`
            } else if (params.row.jobState === 'TranscodeFail') {
              show = 'inline'
              text = '(转码失败)'
            }
            return h('span', {}, [
              h('i', {
                'class': 'iconfont xiayi icon_video_sort',
                on: {
                  click: () => this.videoSort(params.row.id, '2')
                }
              }),
              h('i', {
                'class': 'iconfont shangyi icon_video_sort',
                style: { marginLeft: '4px' },
                on: {
                  click: () => this.videoSort(params.row.id, '1')
                }
              }),
              h('span', {
                style: { marginLeft: '4px', display: show }
              }, text)
            ])
          }
        },
        {
          label: '视频名称',
          prop: 'name',
          renderHeader: (h, { columns, $index }) => {
            return h('div', { style: { padding: '0' }}, [
              h('span', '视频名称'),
              h('el-tooltip', { props: { effect: 'dark', content: '视频需转码完成后学员端方可显示', placement: 'top' }}, [
                h('i', { class: 'el-icon-warning', style: { marginLeft: '5px' }})
              ])
            ])
          },
          formatter: (row) => {
            return `<div style="color:#1D9DF2;text-overflow:ellipsis;overflow:hidden">${row.name}</div>`
          },
          methods: this.showVideo,
          isShowTooltip: true,
          width: '180px'
        },
        {
          label: '视频描述',
          prop: 'desc',
          isShowTooltip: true,
          width: '160px'
        },
        {
          label: '视频时长',
          prop: 'timeLength',
          isShowTooltip: true
        },
        {
          label: '上架状态',
          prop: 'status',
          isShowTooltip: true,
          formatter: (row) => {
            if (row.status === '1') {
              return `<div>上架</div>`
            } else {
              return `<div>下架</div>`
            }
          }
        },
        {
          label: '上传人',
          prop: 'uname',
          isShowTooltip: true
        },
        {
          label: '上传完成时间',
          prop: 'uploadTime',
          isShowTooltip: true,
          width: '180px'
        }
      ], // 表格列
      tableHeight: 'calc(100vh - 235px)', // 表格高度
      pagination: {
        show: true,
        sizes: true
      },
      operates: {
        width: '180',
        fixed: 'right',
        list: [
          {
            label: '编辑',
            type: 'normal',
            method: this.showVideoEdit
          },
          {
            label_1: '上架',
            label_2: '下架',
            type: 'unnormal',
            conProp: 'title',
            method: this.showOrHide,
            popoverCon: [
              {
                contentText: `确认要上架`,
                status: '2'
              },
              {
                contentText: '确认要下架',
                status: '1'
              }
            ],
            isDyData: true
          },
          {
            label: '删除',
            type: 'normal',
            class: 'styleDelete',
            method: this.onRemove,
            popoverCon: [
              {
                contentText: '确定要删除？'
              }
            ]
          }
        ]
      },
      options: {
        noMount: true,
        apiService: getVideoList
      },

      requiredParams: {}, // 必传参数
      timer: null

    }
  },

  computed: {
    ...mapState('recorded', [
      'chapters',
      'courseId',
      'chapterName',
      'editItem',
      'currentItem',
      'currentKey',
      'loading'
    ]),

    // 只有一章不可删除
    onlyOne() {
      if (this.chapters.length === 1) {
        return true
      } else {
        return false
      }
    },

    boxHeight() {
      if (this.type === 'edit') {
        return '246px'
      } else {
        return '270px'
      }
    }
  },

  mounted() {
    console.log('type', this.type)
    const params = {
      id: this.courseId
    }
    this.getCourseInfo({ params, refresh: this.getTable })
  },

  beforeDestroy() {
    clearInterval(this.timer)
  },

  methods: {
    ...mapMutations('recorded', [
      'UPDATE_STATE'
    ]),
    ...mapActions('recorded', [
      'getCourseInfo',
      'updateChapter',
      'sortChapter',

      'sortVideo',
      'updateVideo',
      'updateCourseWare'
    ]),
    /** 上传视频 */
    uploadv() {
      this.$refs.uploadv.showDialog()
    },
    // 取消编辑
    goBackEdit() {
      this.$router.push({ name: 'recorded' })
    },
    // 编辑保存
    editSave() {
      // if (this.editItem.type === 1) {
      //   this.$router.push({ name: 'recorded' })
      // } else {
      //   this.$message.success('编辑成功')
      // }
      this.$router.push({ name: 'recorded' })
    },
    // 确认并退出
    goBack() {
      this.UPDATE_STATE({ courseId: '', currentStep: 0 })
      this.$router.push({ name: 'recorded' })
    },
    /** 确认并继续 */
    goNext() {
      this.UPDATE_STATE({ currentStep: 2 })
    },

    /** 获取视频表格 */
    getTable(params) {
      if (this.timer) {
        clearInterval(this.timer)
      }

      const search = {
        ...params,
        cwId: this.courseId
      }
      this.requiredParams = {
        itemId: search.itemId,
        cwId: search.cwId
      }
      this.$refs.tableCommon.getList(search)

      const table = this.$refs.tableCommon
      this.timer = setInterval(() => {
        table.getList(search)
      }, 30000)
    },

    /** 打开新增 */
    openAdd(info) {
      this.$refs.addChapter.show(info)
    },

    /** 选择章节 */
    selectChapter(index, item) {
      if (index === this.currentKey) {
        return
      }

      this.UPDATE_STATE({
        currentKey: index,
        currentItem: item,
        chapterName: item.name
      })
      this.getTable({ itemId: item.id })
    },

    /** 删除章节 */
    removeChapter(info, index) {
      this.removeVisible = false
      // 删除当前选中章节时跳回第一章
      if (index === this.currentKey) {
        this.UPDATE_STATE({ currentKey: 0 })
      }
      const params = {
        ...info,
        status: '0'
      }
      this.updateChapter({ params })
    },

    /** 章节排序 */
    chapterSort(id, sortType) {
      const payload = {
        id,
        sortType,
        cwId: this.courseId
      }
      this.sortChapter(payload)
    },

    /** 视频排序 */
    videoSort(id, sortType) {
      const params = {
        id,
        sortType,
        cwId: this.courseId,
        itemId: this.currentItem.id
      }

      const search = {
        itemId: this.currentItem.id,
        ...this.formValue
      }

      this.sortVideo({ params, refresh: () => this.getTable(search) })
    },

    /** 打开视频 */
    showVideo(row) {
      this.$refs.videoPlay.show(row.url)
    },
    // 搜索
    searchHandle(formValue) {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.formValue = formValue
      // console.log('formValue', formValue)
      // 搜索的入参
      const params = {
        videoName: this.formValue.videoName,
        ...this.requiredParams
      }
      this.$refs.tableCommon.getList(params)

      const table = this.$refs.tableCommon
      this.timer = setInterval(() => {
        table.getList(params)
      }, 30000)
    },
    resetFieldHanle() {
      if (this.timer) {
        clearInterval(this.timer)
      }
      // 重置的入参
      const params = {
        pageIndex: 0,
        ...this.requiredParams
      }
      this.formValue = {}
      this.$refs.tableCommon.getList(params)

      const table = this.$refs.tableCommon
      this.timer = setInterval(() => {
        table.getList(params)
      }, 30000)
    },

    /** 上下架 */
    showOrHide(row) {
      const status = row.status === '1' ? '2' : '1'
      const params = {
        id: row.id,
        name: row.name,
        desc: row.desc,
        status
      }

      const search = {
        itemId: this.currentItem.id,
        ...this.formValue
      }

      this.updateVideo({ params, refresh: () => this.getTable(search) })
    },

    /** 删除视频 */
    onRemove(row) {
      const params = {
        id: row.id,
        name: row.name,
        desc: row.desc,
        status: '0'
      }

      const search = {
        itemId: this.currentItem.id,
        ...this.formValue
      }

      this.updateVideo({ params, refresh: () => this.getTable(search) })
    },

    /** 打开视频编辑 */
    showVideoEdit(row) {
      this.$refs.editVideo.show(row)
    }
  }
}
</script>

<style lang="scss" scoped>
.video_box /deep/{
  // height: calc(100vh - 270px);
  background: #F0F2F5;
  padding: 20px 20px 0;
  margin: 0 20px;

  .icon_video_sort{
    color: #999;
    &:hover{
      color: #46B6EE
    }
  }
}

.video_content{
  height: calc(100% - 38px);
  margin-top: 10px;
  display: flex;

  .video_chapters{
    flex: 0 0 413px;
    height: 100%;
    padding: 20px;
    margin: 0 30px 0 12px;
    background: #fff;
    overflow: auto;
  }

  .video_table{
    flex: 1;
    height: 100%;
    padding: 20px 0 0 20px;
    background: #fff;
    overflow: auto;
  border-bottom: 1px solid #eee;
   .boxSearch{
         display: flex;
         align-items: center;
         .commonSearch{
           margin-left: 20px;
           margin-top: 20px;
         }

   }
  }
}

// 左侧
.chapter_list{
  margin-top: 20px;

  li:first-child{
    margin: 0;
  }
}
.chapter_item{
  display: flex;
  align-items: center;
  background: rgba(240,242,245,0.2);
  margin-top: 10px;
  padding: 10px;
  i{
    color: #999;
  }
  i:hover{
    color: #46B6EE;
  }

  .chapter_sort{
    width: 36px;
    margin-right: 10px;
  }

  span{
    flex: 1;
    &:hover{
      color: #46B6EE;
      cursor: pointer;
    }
  }

  .chapter_action{
    width: 46px;
    display: flex;

    i:first-child{
      margin-right: 10px;
    }
  }
}
// 左侧end

// 右侧
.table_title{
  font-size: 14px;
  color: #333;
  padding: 20px 0 15px;
}
// 右侧end

.btn_icon{
  font-size: 12px;
}

.video_btns{
  height: 49px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
