import { Message } from 'element-ui'
import {
  queryAppInfo,
  updateLiveRoom,
  getMsgList,
  getMembers,
  addLiveRoom,
  query,
  saveLiveNum,
  heartbeatCheck,
  setHeartbeat
} from '@/api/online/liveLesson'
import { SHOW_LOADING, HIDE_LOADING, UPDATE_STATE } from '../../types'

const liveLesson = {
  namespaced: true,

  state: {
    loading: false,
    currentRow: {}, // 当前直播信息
    sdkAppId: '', // appid
    userToken: '', // app签名
    theadImg: '', // 头像
    startLoading: false, // 开始直播loading
    liveStatus: 0, // 0未直播，1开始直播，2结束
    // qrLink: 'https://livetest.ishanshan.com/mobile.html', // 直播二维码52
    qrLink: 'https://ed.ishanshan.com/liveweb/mobile.html', // 直播二维码线上

    cemeraDisabled: false, // 没有摄像头
    micDisabled: false, // 没有麦克风

    liveListData: [],

    uploadLoading: false, // 上传转码loading
    addInfo: {}, // 上传文件信息
    showFileId: '', // 当前展示文件id，做储存用

    reqMsgSeq: undefined, // 上次漫游最小seq
    msgLoading: false, // 拉取漫游loading
    hasMore: true, // 表示是否已经拉完所有消息。

    memberNum: 0, // 群组成员数量
    memberList: [] // 群组成员
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
    /** 获取appid和签名 */
    async getAppInfo({ commit, state }, payload) {
      commit(SHOW_LOADING)

      const params = {
        tid: state.currentRow.uid,
        classId: state.currentRow.id
      }
      const { data } = await queryAppInfo(params)
      if (data && data.errorCode === 0) {
        state.sdkAppId = data.videoSdkAppId
        state.userToken = data.videoUserSig
        state.theadImg = data.theadImg
        payload.init && payload.init()
      } else if (data && data.errorCode === 10098) {
        // 直播已结束但是列表未刷新
        Message.error({
          duration: 5000,
          message: data && data.errorMessage,
          onClose: () => { payload.autoOut && payload.autoOut() }
        })
      } else {
        Message.error((data && data.errorMessage) || '获取sdkAppId失败')
      }
    },

    /** 直播开始结束 */
    async changeRTC({ commit, state }, { params, callback }) {
      commit(UPDATE_STATE, { startLoading: true })

      const { data } = await updateLiveRoom(params)
      if (data && data.errorCode === 0) {
        if (params.status === '2') {
          state.liveStatus = 1
          const liveRoomInfo = {
            ...state.currentRow,
            status: '2'
          }
          sessionStorage.setItem('liveRoomInfo', JSON.stringify(liveRoomInfo))
        } else {
          state.liveStatus = 2
          const liveRoomInfo = {
            ...state.currentRow,
            status: '3'
          }
          Message.success('直播已结束')
          sessionStorage.setItem('liveRoomInfo', JSON.stringify(liveRoomInfo))
        }

        callback && callback()
      } else {
        Message.error((data && data.errorMessage) || '直播状态改变失败')
      }

      commit(UPDATE_STATE, { startLoading: false })
    },

    /** 获取漫游消息 */
    async getMsgs({ commit, state }, { params, cb }) {
      commit(UPDATE_STATE, { msgLoading: true })

      const payload = state.reqMsgSeq ? {
        ...params,
        reqMsgSeq: state.reqMsgSeq
      } : params
      const { data } = await getMsgList(payload)
      if (data && data.errorCode === 0) {
        console.log('漫游信息=======', data)
        cb && cb(data.rspMsgList || [])
      } else {
        Message.error((data && data.errorMessage) || '获取漫游消息失败')
      }

      commit(UPDATE_STATE, { msgLoading: false })
    },

    /** 修改直播间信息 */
    async updateLiveRoom({ commit }, { params, text, refresh }) {
      commit(SHOW_LOADING)
      console.log('params', params)
      const { data } = await updateLiveRoom(params)
      console.log('data', data)
      if (data && data.errorCode === 0) {
        Message.success(`${text.text}成功`)
        refresh && refresh()
      } else {
        Message.error((data && data.errorMessage))
      }
      commit(HIDE_LOADING)
    },
    /** 查询列表 */
    async query({ state, commit }, payload) {
      commit(SHOW_LOADING)
      console.log(payload)
      // const params = {
      //   type: payload.type,
      //   menuIds: payload.menuIds
      // }
      const { data } = await query(payload)
      if (data && data.errorCode === 0) {
        state.liveListData = data.results
      } else {
        Message.error(data && data.errorMessage)
      }

      commit(HIDE_LOADING)
    },
    /** 新增直播间 */
    async addLiveRoom({ commit }, { params, refresh }) {
      commit(SHOW_LOADING)
      console.log('paload', params)
      const { data } = await addLiveRoom(params)
      if (data && data.errorCode === 0) {
        Message.success('新增成功')
        // payload.close && payload.close('materialForm')
        refresh && refresh()
      } else {
        Message.error((data && data.errorMessage) || '新增失败')
      }
    },

    /** 获取群组成员*/
    async getMemberList({ state }, payload) {
      const { data } = await getMembers(payload)
      if (data && data.errorCode === 0) {
        state.memberNum = data.memberNum
        state.memberList = data.memberList
        console.log('群组--------', data)
      } else {
        Message.error((data && data.errorMessage) || '获取群组成员失败')
      }
    },

    /** 直播间人数保存*/
    async saveLivePeople({ state }) {
      const params = {
        liveClassId: state.currentRow.id,
        watchNum: state.memberNum
      }
      const { data } = await saveLiveNum(params)
      if (data && data.errorCode === 0) {
        console.log('人数保存成功')
      } else {
        Message.error((data && data.errorMessage) || '人数保存失败')
      }
    },

    /** 校验直播间有效心跳并持久化 */
    async setHeartbeat({ state }) {
      const params = {
        liveClassId: state.currentRow.id
      }
      const { data } = await heartbeatCheck(params)
      if (data && data.errorCode === 0) {
        console.log('心跳结算成功')
      } else {
        Message.error((data && data.errorMessage) || '心跳结算失败')
      }
    },

    /** 心跳检测 */
    async saveHeartbeat({ state }) {
      const params = {
        timestamp: Math.round(new Date().getTime() / 1000),
        openId: state.currentRow.uid,
        liveClassId: state.currentRow.id
      }
      const { data } = await setHeartbeat(params)
      if (data && data.errorCode === 0) {
        console.log('心跳检测成功')
      } else {
        Message.error((data && data.errorMessage) || '心跳检测失败')
      }
    }
  }
}

export default liveLesson
