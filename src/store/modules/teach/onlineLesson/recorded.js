import { Message } from 'element-ui'
import {
  updateCourse,
  saveCourseBase,
  getCourseVideo,
  addChapterItem,
  updateChapterItem,
  sortChapterItem,

  sortVideoItem,
  updateVideoItem,
  addVideoItem,

  queryCourseTree,
  queryVideoDetail,

  stuAdd,
  deleteStu,
  updateStuTime,
  feedbackList,
  addFeedback,
  deleteFeedback
} from '@/api/teachManage/onlineLesson'
import { SHOW_LOADING, HIDE_LOADING, UPDATE_STATE } from '../../../types'

const recorded = {
  namespaced: true,

  state: {
    loading: false,
    currentStep: 0, // 当前步骤
    courseId: '', // 课程id
    courseName: '', // 课程名称
    courseType: '', // 课程类型
    editItem: {}, // 课件编辑信息

    chapters: [], // 章节列表
    currentKey: 0, // 当前选中章节index
    currentItem: {}, // 当前选中章节信息
    addLoading: false, // 新增加载状态
    chapterName: '', // 章节名

    editLoading: false,
    uploadLoading: false, // 视频新增loading
    wareInfo: {}, // 课件信息

    // 详情
    treeLoading: false,
    detailList: [], // 详情列表
    selectInfo: [], // 选中视频
    selectChapter: {},
    videoId: '', // 视频id
    videoLoading: false,
    detailItem: {}, // 视频信息
    detailCourse: {}, // 课件信息

    // 评论列表
    commitLists: [],
    paging: {}
  },

  mutations: {
    /** 显示loading */
    [SHOW_LOADING](state) {
      state.loading = true
    },
    /** 隐藏loading */
    [HIDE_LOADING](state) {
      state.loading = false
    },
    [UPDATE_STATE](state, payload) {
      for (const i in payload) {
        state[i] = payload[i]
      }
    }
  },

  actions: {
    /** 修改课件信息 */
    async updateCourseWare({ commit }, { params, refresh, isEdit }) {
      commit(SHOW_LOADING)

      const { data } = await updateCourse(params)
      const text = isEdit ? '编辑' : params.status === '0' ? '删除' : params.status === '1' ? '上架' : '下架'
      if (data && data.errorCode === 0) {
        Message.success(`${text}成功！`)
        refresh && refresh()
      } else {
        Message.error((data && data.errorMessage) || `${text}失败！`)
      }

      commit(HIDE_LOADING)
    },

    /** 保存基本信息 */
    async saveBaseInfo({ commit, state }, { values, callback }) {
      commit(SHOW_LOADING)
      state.courseName = values.name
      state.courseType = values.type
      const { data } = await saveCourseBase(values)
      if (data && data.errorCode === 0) {
        state.courseId = data.id
        Message.success('保存成功！')
        callback && callback()
      } else if (data && data.errorCode === 110000) {
        Message.error((data && data.data.message) || '保存失败！')
      } else {
        Message.error((data && data.errorMessage) || '保存失败！')
      }

      commit(HIDE_LOADING)
    },

    /** 章节查询 */
    async getCourseInfo({ commit, state }, { params, refresh, isChange, mapForm, mark }) {
      commit(SHOW_LOADING)
      const { data } = await getCourseVideo(params)
      if (data && data.errorCode === 0) {
        // 编辑时
        mapForm && mapForm(data)
        state.editItem = data
        console.log('getCourseInfo', data)
        // index变动时
        if (isChange) {
          data.coursewareItemList.forEach((item, index) => {
            if (state.currentItem.id === item.id) {
              state.currentKey = index
            }
          })
        }

        state.chapters = data.coursewareItemList || []
        state.chapterName = data.coursewareItemList[state.currentKey].name
        state.currentItem = data.coursewareItemList[state.currentKey]
        state.wareInfo = data
        if (mark) {
          refresh && refresh()
        } else {
          refresh && refresh({ itemId: data.coursewareItemList[state.currentKey].id })
        }
      } else {
        Message.error((data && data.errorMessage) || '获取详情失败！')
      }

      commit(HIDE_LOADING)
    },

    // /** 章节查询 */
    // async coursewareStuQuery({ commit, state }, { params, refresh, isChange, mapForm }) {
    //   commit(SHOW_LOADING)

    //   const { data } = await coursewareStuQuery(params)
    //   if (data && data.errorCode === 0) {
    //     // 编辑时
    //     // mapForm && mapForm(data)
    //     // console.log('getCourseInfo', data)
    //     // // index变动时
    //     // if (isChange) {
    //     //   data.coursewareItemList.forEach((item, index) => {
    //     //     if (state.currentItem.id === item.id) {
    //     //       state.currentKey = index
    //     //     }
    //     //   })
    //     // }

    //     // state.chapters = data.coursewareItemList || []
    //     // state.chapterName = data.coursewareItemList[state.currentKey].name
    //     // state.currentItem = data.coursewareItemList[state.currentKey]
    //     // state.wareInfo = data
    //     // refresh && refresh({ itemId: data.coursewareItemList[state.currentKey].id })
    //   } else {
    //     Message.error((data && data.errorMessage) || '获取详情失败！')
    //   }

    //   commit(HIDE_LOADING)
    // },

    /** 新增章节 */
    async addChapter({ commit, state, dispatch }, { params, close }) {
      commit(UPDATE_STATE, { addLoading: true })

      const { data } = await addChapterItem(params)
      if (data && data.errorCode === 0) {
        Message.success('保存成功！')
        close && close()
        dispatch('getCourseInfo', { params: { id: state.courseId }})
      } else {
        Message.error((data && data.errorMessage) || '保存失败！')
      }

      commit(UPDATE_STATE, { addLoading: false })
    },

    /**
     * 编辑/删除章节
     * 删除status: '0'
     * */
    async updateChapter({ commit, state, dispatch }, { params, close }) {
      commit(UPDATE_STATE, { addLoading: true })

      const text = params.status === '0' ? '删除' : '编辑'
      const { data } = await updateChapterItem(params)
      if (data && data.errorCode === 0) {
        Message.success(`${text}成功！`)
        close && close()
        dispatch('getCourseInfo', { params: { id: state.courseId }, isChange: true })
      } else {
        Message.error((data && data.errorMessage) || `${text}失败`)
      }

      commit(UPDATE_STATE, { addLoading: false })
    },

    /**
     * 章节排序
     * 1上移，2下移
     * */
    async sortChapter({ commit, state, dispatch }, payload) {
      commit(SHOW_LOADING)

      const { data } = await sortChapterItem(payload)
      if (data && data.errorCode === 0) {
        Message.success('排序成功')
        dispatch('getCourseInfo', { params: { id: state.courseId }, isChange: true })
      } else {
        Message.error((data && data.errorMessage) || '排序失败')
      }

      commit(HIDE_LOADING)
    },

    /**
     * 视频排序
     * 1上移，2下移
     * */
    async sortVideo({ state }, { params, refresh }) {
      const { data } = await sortVideoItem(params)
      if (data && data.errorCode === 0) {
        Message.success('排序成功！')
        refresh && refresh()
      } else {
        Message.error((data && data.errorMessage) || '排序失败！')
      }
    },

    // 移除会员
    async deleteStu({ state }, { params, refresh }) {
      const { data } = await deleteStu(params)
      if (data && data.errorCode === 0) {
        Message.success('移除成功')
        refresh && refresh()
      } else {
        Message.error((data && data.errorMessage) || '移除失败')
      }
    },
    // 修改会员日期
    async updateStuTime({ state }, { params, refresh }) {
      const { data } = await updateStuTime(params)
      if (data && data.errorCode === 0) {
        Message.success('修改成功')
        refresh && refresh()
      } else {
        Message.error((data && data.errorMessage) || '修改失败')
      }
    },

    /** 修改视频信息 */
    async updateVideo({ commit }, { params, refresh }) {
      commit(UPDATE_STATE, { editLoading: true })

      const { data } = await updateVideoItem(params)
      const text = params.status === '0' ? '删除' : params.status === '1' ? '上架' : '下架'
      if (data && data.errorCode === 0) {
        Message.success(`${text}成功！`)
        refresh && refresh()
      } else {
        Message.error((data && data.errorMessage) || `${text}失败`)
      }

      commit(UPDATE_STATE, { editLoading: false })
    },

    /** 新增视频信息 */
    async addVideo({ commit }, { params, refresh }) {
      commit(UPDATE_STATE, { uploadLoading: true })
      const { data } = await addVideoItem(params)
      if (data && data.errorCode === 0) {
        Message.success(`新增成功`)
        refresh && refresh()
      } else {
        Message.error((data && data.errorMessage) || `新增失败`)
      }

      commit(UPDATE_STATE, { uploadLoading: false })
    },
    /** 会员课新增学员信息 */
    async stuAdd({ commit }, { params, refresh }) {
      commit(UPDATE_STATE, { uploadLoading: true })

      const { data } = await stuAdd(params)
      if (data && data.errorCode === 0) {
        Message.success(`新增成功`)
        refresh && refresh()
      } else {
        Message.error((data && data.errorMessage) || `新增失败`)
      }

      commit(UPDATE_STATE, { uploadLoading: false })
    },

    /** 课件详情-左侧 */
    async getCourseTree({ commit, state, dispatch }, payload) {
      commit(UPDATE_STATE, { treeLoading: true })

      const { data } = await queryCourseTree(payload)
      if (data && data.errorCode === 0) {
        const detailList = []
        let id
        let hasFirst = false // 是否已有默认展示视频
        let hasUnfold = false // 是否有默认展开章节

        data.results.forEach(item => {
          // 默认展示
          if (!hasFirst && item.videoList && item.videoList.length > 0) {
            state.selectInfo = [item.id, item.videoList[0].id]
            state.selectChapter = item
            id = item.videoList[0].id
            hasFirst = true
          }

          // 设置展开属性
          if (!hasUnfold && item.videoList && item.videoList.length > 0) {
            detailList.push({
              ...item,
              showcont: true
            })
            hasUnfold = true
          } else {
            detailList.push({
              ...item,
              showcont: false
            })
          }
        })
        state.detailCourse = data
        state.detailList = detailList
        const videoId = state.videoId
        id && dispatch('getCourseDetail', { id })
        videoId && dispatch('feedbackList', { videoId })
      } else {
        Message.error((data && data.errorMessage) || `获取失败`)
      }

      commit(UPDATE_STATE, { treeLoading: false })
    },

    /** 课件详情-右侧 */
    async getCourseDetail({ commit, state }, payload) {
      commit(UPDATE_STATE, { videoLoading: true })
      console.log('payload', payload)
      state.videoId = payload.id
      const { data } = await queryVideoDetail(payload)
      if (data && data.errorCode === 0) {
        state.detailItem = data
      } else {
        Message.error((data && data.errorMessage) || `获取失败`)
      }

      commit(UPDATE_STATE, { videoLoading: false })
    },

    /** 评论列表-右侧 */
    async feedbackList({ commit, state }, { payload, getPaging }) {
      console.log('payload', payload)
      commit(UPDATE_STATE, { videoLoading: true })
      const { data } = await feedbackList(payload)
      console.log('data', data.results)
      getPaging && getPaging(data.data)
      if (data && data.errorCode === 0) {
        // state.detailItem = data
        state.commitLists = data.results
        // state.paging = data.data
      } else {
        Message.error((data && data.errorMessage) || `获取失败`)
      }

      commit(UPDATE_STATE, { videoLoading: false })
    },
    /** 老师回复 */
    async addFeedback({ commit, state, dispatch }, { params, close }) {
      commit(UPDATE_STATE, { addLoading: true })

      // const text = params.status === '0' ? '删除' : '编辑'
      const { data } = await addFeedback(params)
      if (data && data.errorCode === 0) {
        Message.success(`回复成功`)
        const videoId = state.videoId
        console.log('videoId', videoId)
        const payload = {
          videoId: videoId
        }
        dispatch('feedbackList', { payload })
      } else {
        Message.error((data && data.errorMessage) || `回复失败`)
      }

      commit(UPDATE_STATE, { addLoading: false })
    },
    /** 删除回复或者评论 */
    async deleteFeedback({ commit, state, dispatch }, { params, close, text }) {
      commit(UPDATE_STATE, { addLoading: true })

      // const text = params.status === '0' ? '删除' : '编辑'
      const { data } = await deleteFeedback(params)
      if (data && data.errorCode === 0) {
        Message.success(`删除成功`)
        const videoId = state.videoId
        console.log('videoId', videoId)
        const payload = {
          videoId: videoId
        }
        dispatch('feedbackList', { payload })
      } else {
        Message.error((data && data.errorMessage) || `删除失败`)
      }

      commit(UPDATE_STATE, { addLoading: false })
    }

  }
}
export default recorded
