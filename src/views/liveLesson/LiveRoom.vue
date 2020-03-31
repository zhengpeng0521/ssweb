
/**
 * 直播间页面
 * 要使用直播的摄像头功能，必须使用https或者localhost访问
 */
<template>
  <div
    v-loading="loading"
    class="live_box"
    element-loading-text="页面加载中"
  >
    <!-- 头部 -->
    <div class="live_header">
      <span>{{ currentRow.liveName || '--' }}</span>
      <div class="live_header_right">
        <el-popover
          placement="bottom-end"
          width="230"
          trigger="hover">
          <div>
            <qrcode
              id="qrCode"
              ref="qrCode"
              :value="link"
              :options="{ width: 200 }"
            />
          </div>
          <a slot="reference">学员端直播入口</a>
        </el-popover>
        <img :src="theadImg && theadImg !== '' ? theadImg : 'https://img.ishanshan.com/gimg/n/20200218/68ca9cef3cba19a26672aabd233ee544'">
        <span>{{ currentRow.tname }}</span>
        <span class="header_line">|</span>
        <el-button class="header_btn" @click="openQuit"><i class="iconfont icontuichu" />退出直播间</el-button>
      </div>
    </div>

    <div class="live_content">
      <!-- 左侧 -->
      <div class="live_left">
        <Camera
          ref="liveCemera"
          :local-stream="localStream"
          :enable-camera="enableCamera"
          :enable-mic="enableMic"
          @toggleCamera="toggleCamera"
          @toggleMic="toggleMic"
          @leaveRoom="leaveRoom" />
        <CourseWare
          ref="courseWare"
          :tedu-board="teduBoard"
          :ware-loading="wareLoading"
          :file-info-list="fileInfoList"
          :current-file-id="currentFileId" />
      </div>

      <!-- 中间 展示 -->
      <div class="live_center">
        <LiveContent
          :thumb-urls="thumbUrls"
          :tedu-board="teduBoard"
          :board-data="boardData"
          :file-info-list="fileInfoList" />
      </div>

      <!-- 右侧 聊天 -->
      <div class="live_right">
        <ChatArea :tic="tic" :msgs="msgs" :current-row="currentRow" @loadMore="loadMore" />
      </div>
    </div>

    <!-- 退出直播间确认弹窗 -->
    <QuitDialog ref="quitDialog" :local-stream="localStream" @leaveRoom="logout" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import moment from 'moment'
import Camera from './components/Camera'
import CourseWare from './components/CourseWare'
import LiveContent from './components/LiveContent'
import ChatArea from './components/ChatArea'
import QuitDialog from './components/QuitDialog'

import Vue from 'vue'
import qrcode from '@chenfengyuan/vue-qrcode'
Vue.component(qrcode.name, qrcode)

export default {
  components: {
    Camera,
    CourseWare,
    LiveContent,
    ChatArea,
    QuitDialog
  },

  data() {
    return {
      // 当前用户状态：0未初始化，1未登录，2登录成功，3在房间中
      status: 0,

      // SDK实例
      tic: null,
      trtcClient: null,
      localStream: null,
      teduBoard: null,
      webim: null,

      // 音视频及设备
      enableCamera: true,
      enableMic: true,

      // board(文件操作)
      wareLoading: false,
      currentFileId: null, // 当前文件Id
      fileInfoList: [], // 所有文件信息
      thumbUrls: [], // 缩略图

      // board(白板操作)
      boardData: {
        currentBoardId: null, // 当前白板ID
        boardIdlist: [], // 白板ID列表
        current: 0, // 当前白板index
        total: 0 // 总页数
      },

      // 消息
      msgs: [],
      countDown: 5,
      timer: null,

      // 推流
      isPushing: 0, // 是否正在推流
      isPushCamera: 0 // 是否推摄像头流
    }
  },

  computed: {
    ...mapState('liveLesson', [
      'loading',
      'currentRow',
      'addInfo',
      'showFileId',
      'sdkAppId',
      'userToken',
      'theadImg',
      'qrLink',
      'liveStatus'
    ]),

    link() {
      const url = `${this.qrLink}?id=${this.currentRow.id}`
      return url
    }
  },

  mounted() {
    const liveRoomInfo = JSON.parse(sessionStorage.getItem('liveRoomInfo'))
    let liveStatus = 0
    // 结束直播刷新页面数据已经清空
    if (!liveRoomInfo) {
      this.$router.push('/online/liveLesson')
    }

    if (liveRoomInfo.status === '2') {
      liveStatus = 1
    } else if (liveRoomInfo.status === '3') {
      liveStatus = 2
      this.$router.push('/online/liveLesson')
    }

    this.UPDATE_STATE({ currentRow: liveRoomInfo, liveStatus })
    this.getAppInfo({ init: this.init, autoOut: this.autoOut })
  },

  methods: {
    ...mapMutations('liveLesson', [
      'UPDATE_STATE',
      'HIDE_LOADING'
    ]),
    ...mapActions('liveLesson', [
      'getAppInfo',
      'getMsgs',
      'getMemberList'
    ]),

    autoOut() {
      this.UPDATE_STATE({ currentRow: {}, liveStatus: 0 })
      this.$router.push('/online/liveLesson')
    },

    /** 打开确认退出弹窗 */
    openQuit() {
      this.$refs.quitDialog.show()
    },

    /** 清除课堂信息 */
    clearClassInfo() {
      // 设备信息
      this.remoteVideos = {}
      this.enableCamera = true
      this.enableMic = true
      this.isPushing = 0
      this.isPushCamera = 0

      // 白板信息
      this.boardData.currentBoardId = null
      this.boardData.boardIdlist = []
      this.boardData.current = 0
      this.boardData.total = 0

      document.getElementById('paint_box').innerHTML = ''

      const divvideo = document.querySelector('#video_wrap')
      while (divvideo.hasChildNodes()) { divvideo.removeChild(divvideo.firstChild) }

      this.fileInfoList = []
      this.currentFileId = null
    },

    /** 初始化业务数据 */
    initData() {

    },

    /** 初始化SDK */
    init() {
      this.wareLoading = true
      if (this.status === 0) {
        this.initData()
        // eslint-disable-next-line no-undef
        this.tic = new TIC({})
        this.tic.init(this.sdkAppId, res => {
          if (res.code) {
            this.$message.error('初始化失败，code:' + res.code + ' msg:' + res.desc)
          } else {
            console.log('tic初始化成功')
            this.status = 1
            this.login()
          }
        })
      } else {
        this.login()
      }
    },

    /** 登录 */
    login() {
      this.tic.login({
        userId: this.currentRow.uid,
        userSig: this.userToken
      }, (res) => {
        if (res.code) {
          this.$message.error('登录失败')
        } else {
          this.status = 2
          console.log('登录成功')

          // 增加事件监听
          this.addTICMessageListener()
          this.addTICEventListener()
          this.addTICStatusListener()

          // 创建房间
          this.createClassroom()
        }
      })
    },

    // 登出
    logout() {
      if (this.status === 3) {
        this.leaveRoom(this.logout_internal)

        return
      }

      this.logout_internal()
    },

    logout_internal(isMax) {
      this.tic.logout((res) => {
        if (res.code) {
          this.$message.error('退出直播间失败')
          console.log('登出失败>>>>', res)
        } else {
          this.initData()
          this.status = 1

          this.$message.success('退出直播间成功')
          console.log('登出成功>>>>', res)
          // 删除事件监听
          this.tic.removeTICMessageListener()
          this.tic.removeTICEventListener()
          this.tic.removeTICStatusListener()
          // 满房自动退出
          if (isMax) {
            this.$router.push('/online/liveLesson')
          }
        }
      })
    },

    // 创建房间
    createClassroom() {
      this.tic.createClassroom({
        classId: this.currentRow.roomId,
        // eslint-disable-next-line no-undef
        classScene: TIC.CONSTANT.TICClassScene.TIC_CLASS_SCENE_LIVE
      }, (res) => {
        if (res.code) {
          if (res.code === 10021) {
            console.log('该课堂已被他人创建，请直接加入')
            this.joinRoom()
          } else if (res.code === 10025) {
            console.log('您已经创建过这个课堂，请直接加入')
            this.joinRoom()
          } else if (res.code === 10036) {
            console.log('无法创建------', res)
            this.$message.error('房间数已满')
            this.logout_internal(true)
          } else {
            this.$message.error('创建课堂失败')
            console.error(res)
          }
        } else {
          console.log('创建课堂成功', res)
          this.joinRoom()
        }
      })
    },

    // 进入房间
    joinRoom() {
      this.tic.joinClassroom({
        classId: this.currentRow.roomId
      }, {
        // eslint-disable-next-line no-undef
        mode: TIC.CONSTANT.TICClassScene.TIC_CLASS_SCENE_LIVE, // 直播模式，支持1000人以上场景
        // eslint-disable-next-line no-undef
        // mode: TIC.CONSTANT.TICClassScene.TIC_CLASS_SCENE_VIDEO_CALL // //实时通话模式，支持1000人以下场景，低延时
        // eslint-disable-next-line no-undef
        role: TIC.CONSTANT.TICRoleType.TIC_ROLE_TYPE_ANCHOR // 主播，只在TIC.CONSTANT.TICClassScene.TIC_CLASS_SCENE_LIVE模式下有效
      }, {
        id: 'paint_box',
        ratio: '16:9',
        smoothLevel: 0,
        boardContentFitMode: 1,
        toolType: 0
      }, res => {
        if (res.code) {
          this.$message.error('加入课堂失败')
          console.log(res)
        } else {
          this.status = 3
          console.log('加入课堂成功')
          // 发送进入消息
          const now = moment().format('HH:mm')
          const data = {
            time: now,
            name: this.currentRow.tname,
            isSystem: true,
            text: '进入直播间'
          }
          this.tic.sendGroupCustomMessage(JSON.stringify(data), (res) => {
            if (res.code !== 0) {
              this.$message.error('消息发送失败')
            }
          })

          // 白板实例
          window.teduBoard = this.teduBoard = this.tic.getBoardInstance()
          console.log('白板实例--------------', this.teduBoard)
          this.initBoardEvent()

          // im实例
          this.webim = this.tic.getImInstance()
          console.log('im实例---------------', this.webim)

          const userOpt = {
            ProfileItem: [
              {
                'Tag': 'Tag_Profile_IM_Nick',
                'Value': this.currentRow.tname
              }
            ]
          }
          this.webim.setProfilePortrait(userOpt, (response) => {
            console.log('设置用户', response)
            // 群组成员信息
            this.getGroupMember(this.webim)
          }, (rej) => {
            console.log('设置用户失败', rej)
          })

          // //漫游信息
          // this.loadMore()

          // 默认打开摄像头
          this.openCemera()
          console.log('tic实例===========', this.tic)
        }
      })
    },

    /** 获取成员列表 */
    getGroupMember(webim) {
      const options = {
        'GroupId': this.currentRow.roomId,
        'Offset': 0, // 必须从 0 开始
        'Limit': 50,
        'MemberInfoFilter': [
          'Member_Account',
          'Role',
          'JoinTime',
          'LastSendMsgTime',
          'ShutUpUntil'
        ]
      }
      webim.getGroupMemberInfo(options, (resp) => {
        console.log('群组??????????????????', resp)
        const ids = []
        resp.MemberList.forEach(item => {
          if (item.Role === 'Member') {
            ids.push(item.Member_Account)
          }
        })

        // 只有老师时无需获取资料
        if (ids.length <= 0) {
          this.UPDATE_STATE({
            memberNum: 0,
            memberList: []
          })
          return
        }

        const opts = {
          'To_Account': ids,
          'TagList': [
            'Tag_Profile_IM_Nick'
          ]
        }
        webim.getProfilePortrait(opts, (res) => {
          console.log('用户资料--------', res)
          const num = res.UserProfileItem ? res.UserProfileItem.length : 0
          const userList = []
          res.UserProfileItem && res.UserProfileItem.forEach(item => {
            userList.push({
              id: item.To_Account,
              nickName: item.ProfileItem[0].Value
            })
          })
          this.UPDATE_STATE({
            memberNum: num,
            memberList: userList
          })
        }, (error) => {
          console.log('用户资料失败--------', error)
          this.$message.error('获取群组成员失败')
        })
      }, (err) => {
        console.log('群组失败????????????', err)
        this.$message.error('获取群组成员失败')
      })
    },

    // 加载更多
    loadMore() {
      const params = {
        liveClassId: this.currentRow.roomId
      }
      this.getMsgs({ params, cb: this.unshiftOldMsg })
    },

    /** 加载漫游消息 */
    unshiftOldMsg(msgList) {
      const newList = []
      const list = [...msgList]
      list && list.reverse()
      list && list.forEach((item, index) => {
        if (index === 0) {
          if (item.msgSeq === 1) {
            this.UPDATE_STATE({ hasMore: false })
          } else {
            this.UPDATE_STATE({ hasMore: true })
          }
          this.UPDATE_STATE({ reqMsgSeq: item.msgSeq })
        }
        if (item.from_Account !== '@TIM#SYSTEM' && item.msgBody && item.msgBody.length > 0) {
          const data = JSON.parse(item.msgBody[0].MsgContent.Data)
          newList.push({
            ...data,
            uid: item.from_Account
          })
        }
      })

      this.msgs.unshift(...newList)
    },

    /** 退出房间 */
    leaveRoom(logout) {
      this.tic.quitClassroom(res => {
        if (res.code) {
          this.$message.error('退出房间失败')
          console.log('退出失败' + res)
        } else {
          this.initData()

          this.status = 2
          // this.$message.success('退出房间成功')
          console.log('退出房间>>>>', res)
          // 发送退出消息
          const now = moment().format('HH:mm')
          const data = {
            time: now,
            name: this.currentRow.tname,
            isSystem: true,
            text: '退出直播间'
          }
          this.tic.sendGroupCustomMessage(JSON.stringify(data), (res) => {
            if (res.code !== 0) {
              this.$message.error('消息发送失败')
            } else {
              // 登出
              logout && logout()
            }
          })
        }
      })

      sessionStorage.removeItem('liveRoomInfo')
      this.clearClassInfo()
    },

    // 监听白板事件（按需监听）
    initBoardEvent() {
      var teduBoard = this.teduBoard
      // 撤销状态改变
      // eslint-disable-next-line no-undef
      teduBoard.on(TEduBoard.EVENT.TEB_OPERATE_CANUNDO_STATUS_CHANGED, (enable) => {
        console.log('======================:  ', 'TEB_OPERATE_CANUNDO_STATUS_CHANGED', enable ? '可撤销' : '不可撤销')
      })

      // 重做状态改变
      // eslint-disable-next-line no-undef
      teduBoard.on(TEduBoard.EVENT.TEB_OPERATE_CANREDO_STATUS_CHANGED, (enable) => {
        console.log('======================:  ', 'TEB_OPERATE_CANREDO_STATUS_CHANGED', enable ? '可恢复' : '不可恢复')
      })

      // 新增白板
      // eslint-disable-next-line no-undef
      teduBoard.on(TEduBoard.EVENT.TEB_ADDBOARD, (boardIds, fid) => {
        console.log('======================:  ', '新增白板', ' boardIds:', boardIds, ' fid:', fid)
        this.proBoardData()
      })

      // 白板同步数据回调(收到该回调时需要将回调数据通过信令通道发送给房间内其他人，接受者收到后调用AddSyncData接口将数据添加到白板以实现数据同步)
      // TIC已经处理好了，可忽略该事件
      // eslint-disable-next-line no-undef
      teduBoard.on(TEduBoard.EVENT.TEB_SYNCDATA, (data) => {
        console.log('数据同步 ', data)
      })

      // 收到白板初始化完成事件后，表示白板已处于正常工作状态（此时白板为空白白板，历史数据尚未拉取完成）
      // eslint-disable-next-line no-undef
      teduBoard.on(TEduBoard.EVENT.TEB_INIT, () => {
        console.log('======================:  ', '白板初始化完成')
      })

      // eslint-disable-next-line no-undef
      teduBoard.on(TEduBoard.EVENT.TEB_HISTROYDATA_SYNCCOMPLETED, () => {
        console.log('======================:  ', '白板历史数据同步完成')
        this.$message.success('白板历史数据同步完成')
        this.wareLoading = false

        const currentFileId = this.teduBoard.getCurrentFile()
        console.log('currentFileId++++++++++++', currentFileId)
        this.teduBoard.switchFile('#DEFAULT')
        setTimeout(() => {
          this.teduBoard.switchFile(currentFileId)
        }, 1000)
        // this.proBoardData({ switchFile: true })

        // setTimeout(() => {
        //   teduBoard.addImage('https://main.qcloudimg.com/raw/5c11f1a14f74b00988c5c43dddff2d41.png');
        //   // teduBoard.addImage('https://main.qcloudimg.com/raw/ea3692fd322dbcc7d86c3fc3cc6d3c59.jpg');
        // }, 2000);
      })

      // 白板错误回调
      // eslint-disable-next-line no-undef
      teduBoard.on(TEduBoard.EVENT.TEB_ERROR, (code, msg) => {
        console.error('======================:  ', '白板错误', ' code:', code, ' msg:', msg)
        this.$message.error('TIC', 'onTEBError code=' + code + ' msg:' + msg)
      })

      // 白板警告回调
      // eslint-disable-next-line no-undef
      teduBoard.on(TEduBoard.EVENT.TEB_WARNING, (code, msg) => {
        console.error('======================:  ', '白板警告', ' code:', code, ' msg:', msg)
        this.$message.error('TIC', 'onTEBWarning code=' + code + ' msg:' + msg)
      })

      // 图片状态加载回调
      // eslint-disable-next-line no-undef
      teduBoard.on(TEduBoard.EVENT.TEB_IMAGE_STATUS_CHANGED, (status, data) => {
        console.log('======================:  ', '白板图片状态', ' status:', status, ' data:', data)
      })

      // 删除白板页回调
      // eslint-disable-next-line no-undef
      teduBoard.on(TEduBoard.EVENT.TEB_DELETEBOARD, (boardIds, fid) => {
        console.log('======================:  ', '删除白板', ' boardIds:', boardIds, ' fid:', fid)
        this.proBoardData()
      })

      // 跳转白板页回调
      // eslint-disable-next-line no-undef
      teduBoard.on(TEduBoard.EVENT.TEB_GOTOBOARD, (boardId, fid) => {
        console.log('======================:  ', '跳转白板', ' boardId:', boardId, ' fid:', fid)
        this.proBoardData()
        const fileInfo = this.teduBoard.getFileInfo(this.currentFileId)
        if (fileInfo && document.getElementById('scroll_move')) {
          const width = 145 + 8
          document.getElementById('scroll_move').scrollLeft = width * fileInfo.currentPageIndex
        }
      })

      // ppt动画步数改变回调
      // eslint-disable-next-line no-undef
      teduBoard.on(TEduBoard.EVENT.TEB_GOTOSTEP, (step, count) => {
        console.log('======================:  ', 'ppt动画步数改变', ' step:', step, ' count:', count)
      })

      // 增加H5动画PPT文件回调
      // eslint-disable-next-line no-undef
      teduBoard.on(TEduBoard.EVENT.TEB_ADDH5PPTFILE, (fid) => {
        console.log('======================:  ', '增加H5动画PPT', ' fid:', fid)
        this.proBoardData()
      })

      // 增加文件回调
      // eslint-disable-next-line no-undef
      teduBoard.on(TEduBoard.EVENT.TEB_ADDFILE, (fid) => {
        console.log('======================:  ', '增加文件', ' fid:', fid)
        this.proBoardData()
      })

      // 增加转码文件回调
      // eslint-disable-next-line no-undef
      teduBoard.on(TEduBoard.EVENT.TEB_ADDTRANSCODEFILE, (fid) => {
        console.log('======================:  ', '增加转码', ' fid:', fid)
        this.proBoardData()
      })

      // 删除文件回调
      // eslint-disable-next-line no-undef
      teduBoard.on(TEduBoard.EVENT.TEB_DELETEFILE, (fid) => {
        console.log('======================:  ', '删除文件', ' fid:', fid)
        this.proBoardData()
        // this.teduBoard.switchFile(this.showFileId)
      })

      // 文件上传状态
      // eslint-disable-next-line no-undef
      teduBoard.on(TEduBoard.EVENT.TEB_FILEUPLOADSTATUS, (status, data) => {
        console.log('======================:  ', '文件上传状态', status, data)
        if (status === 1) {
          this.$message.success('上传成功')
        } else {
          this.$message.error('上传失败')
        }
      })

      // 切换文件回调
      // eslint-disable-next-line no-undef
      teduBoard.on(TEduBoard.EVENT.TEB_SWITCHFILE, (fid) => {
        console.log('======================:  ', '切换文件', ' fid:', fid)
        this.proBoardData()
      })

      // 上传背景图片的回调
      // eslint-disable-next-line no-undef
      teduBoard.on(TEduBoard.EVENT.TEB_SETBACKGROUNDIMAGE, (fileName, fileUrl, userData) => {
        console.log('======================:  ', '上传背景图片', '  fileName:', fileName, '  fileUrl:', fileUrl, ' userData:', userData)
      })

      // 文件上传进度
      // eslint-disable-next-line no-undef
      teduBoard.on(TEduBoard.EVENT.TEB_FILEUPLOADPROGRESS, (data) => {
        console.log('======================:  ', '文件上传进度:: ', data)
      })

      // H5背景加载状态
      // eslint-disable-next-line no-undef
      teduBoard.on(TEduBoard.EVENT.TEB_H5BACKGROUND_STATUS_CHANGED, (status, data) => {
        console.log('======================:  ', 'H5背景加载状态:', status, '  data:', data)
      })

      // 转码进度
      // eslint-disable-next-line no-undef
      teduBoard.on(TEduBoard.EVENT.TEB_TRANSCODEPROGRESS, res => {
        console.log('=======  转码进度：', JSON.stringify(res))
        if (res.code) {
          console.log('转码失败code', res)
          this.$message.error('转码失败code:' + res.code + ' message:' + res.message)
        } else {
          // eslint-disable-next-line prefer-const
          let status = res.status
          if (status === 'ERROR') {
            console.log('转码失败')
            this.$message.error('转码失败')
            this.UPDATE_STATE({ addInfo: {}})
          } else if (status === 'UPLOADING') {
            if (res.progress === 100) {
              clearInterval(this.$refs.courseWare.pTime)
            }
            this.UPDATE_STATE({ addInfo: { ...this.addInfo, progress: res.progress }})
            console.log('上传中，当前进度:' + parseInt(res.progress) + '%')
          } else if (status === 'CREATED') {
            this.UPDATE_STATE({ addInfo: { ...this.addInfo, progress: 0, status: 'trans', taskId: res.taskId }})
            console.log('创建转码任务', res)
          } else if (status === 'QUEUED') {
            console.log('正在排队等待转码', res)
          } else if (status === 'PROCESSING') {
            this.UPDATE_STATE({ addInfo: { ...this.addInfo, progress: res.progress, status: 'trans' }})
            console.log('转码中，当前进度:' + res.progress + '%')
          } else if (status === 'FINISHED') {
            console.log('转码完成', res)
            this.UPDATE_STATE({ uploadLoading: false, addInfo: {}})

            this.teduBoard.addTranscodeFile({
              url: res.resultUrl,
              title: res.title,
              pages: res.pages,
              resolution: res.resolution
            })
          }
        }
      })
    },

    // TRTC事件
    initTRTCEvent() {
      this.trtcClient.on('stream-added', event => {
        const remoteStream = event.stream
        const remoteUserId = remoteStream.getUserId()
        console.log('received a remoteStream ID: ' + remoteStream.getId() + ' from user: ' + remoteUserId)
        // 若需要观看该远端流，则需要订阅它，默认会自动订阅
        this.trtcClient.subscribe(remoteStream)
      })

      // 监听‘stream-removed’事件
      this.trtcClient.on('stream-removed', event => {
        const remoteStream = event.stream
        console.log('remoteStream ID: ' + remoteStream.getId() + ' has been removed')
        // 停止播放并删除相应<video>标签
        remoteStream.stop()
        document.getElementById(remoteStream.getId()).remove()
      })

      // 监听‘stream-updated’事件
      this.trtcClient.on('stream-updated', event => {
        console.log('视频变化-------', event)
        const remoteStream = event.stream
        console.log('remoteStream ID: ' + remoteStream.getId() + ' was updated hasAudio: ' +
          remoteStream.hasAudio() + ' hasVideo: ' + remoteStream.hasVideo())
      })

      // 监听‘stream-subscribed’事件
      this.trtcClient.on('stream-subscribed', event => {
        const remoteStream = event.stream
        // 远端流订阅成功，在HTML页面中创建一个<video>标签，假设该标签ID为‘remote-video-view’
        // 播放该远端流
        const remoteVideoWrapEl = document.createElement('div')
        remoteVideoWrapEl.id = remoteStream.getId()
        document.querySelector('#video_wrap').insertBefore(remoteVideoWrapEl, null)
        remoteStream.play(remoteVideoWrapEl)
      })

      this.trtcClient.on('connection-state-changed', event => {
        console.log('connection-state-changed:', event.state)
      })

      this.trtcClient.on('peer-join', event => {
        console.log('peer-join', event)
        const userId = event.userId
      })

      this.trtcClient.on('peer-leave', event => {
        console.log('peer-leave', event)
        const userId = event.userId
      })

      this.trtcClient.on('mute-audio', event => {
        console.log('mute-audio', event)
        // const userId = event.userId
        this.$message.error('麦克风已关闭，观看者无法听到声音')
      })

      this.trtcClient.on('mute-video', event => {
        console.log('mute-video', event)
        // const userId = event.userId
        this.$message.error(`摄像头已关闭`)
      })

      this.trtcClient.on('unmute-audio', event => {
        console.log('unmute-audio', event)
        // const userId = event.userId
        this.$message.success(`麦克风已开启`)
      })

      this.trtcClient.on('unmute-video', event => {
        console.log('unmute-video', event)
        // const userId = event.userId
        this.$message.success(`摄像头已开启`)
      })

      this.trtcClient.on('error', error => {
        console.error('client error observed: ' + error)
        const errorCode = error.getCode()
        // 根据ErrorCode列表查看详细错误原因。
      })
    },

    /**
     * 增加IM消息监听回调
     */
    addTICMessageListener() {
      this.tic.addTICMessageListener({

        /**
         * 收到C2C文本消息
         * @param fromUserId		发送此消息的用户id
         * @param text				收到消息的内容
         * @param textLen			收到消息的长度
         */
        onTICRecvTextMessage: (fromUserId, text, textLen) => {
          console.log(fromUserId, text)
        },

        /**
         * 收到C2C自定义消息
         * @param fromUserId		发送此消息的用户id
         * @param data				收到消息的内容
         * @param dataLen			收到消息的长度
         */
        onTICRecvCustomMessage: (fromUserId, data, textLen) => {
          console.log(fromUserId, data)
        },

        /**
         * 收到群文本消息
         * @param fromUserId		发送此消息的用户id
         * @param text				收到消息的内容
         * @param textLen			收到消息的长度
         */
        onTICRecvGroupTextMessage: (fromUserId, text, textLen) => {
          console.log(fromUserId, text)
          this.showMessageInBox(fromUserId, text)
        },

        /**
         * 收到群自定义消息
         * @param fromUserId		发送此消息的用户id
         * @param data				收到消息的内容
         * @param dataLen			收到消息的长度
         */
        onTICRecvGroupCustomMessage: (fromUserId, data, textLen) => {
          console.log(fromUserId, data)
          this.showMessageInBox(fromUserId, data)
        },

        /**
         * 所有消息
         * @param msg	IM消息体
         * @note 所有收到的消息都会在此回调进行通知，包括前面已经封装的文本和自定义消息（白板信令消息除外）
         */
        onTICRecvMessage(msg) {
          console.log('all', msg)
        }
      })
    },

    // 事件监听回调
    addTICEventListener() {
      this.tic.addTICEventListener({
        onTICMemberJoin: (members) => {
          console.log('群消息', members.join(',') + '进入课堂')
          // 群组成员信息
          const webim = this.tic.getImInstance()
          this.getGroupMember(webim)
          // 设备消息
          this.cemeraMsg(this.enableCamera)
          this.micMsg(this.enableMic)

          // this.getMemberList({ groupId: this.currentRow.roomId })
        },

        onTICMemberQuit: (members) => {
          console.log('群消息', members.join(',') + '退出课堂')
          // 群组成员信息
          const webim = this.tic.getImInstance()
          this.getGroupMember(webim)

          // this.getMemberList({ groupId: this.currentRow.roomId })
        },

        onTICClassroomDestroy: () => {
          this.quitClassroom()
          this.$message('老师解散了课堂')
        },

        onTICTrtcClientCreated: () => {
          console.log(`trtcclient创建成功`)
          window.trtcClient = this.trtcClient = this.tic.getTrtcClient()
          console.log('trtc>>>>>>>>>>>>>>>>>', this.trtcClient)
          this.initTRTCEvent()
        }
      })
    },

    // IM状态监听回调
    addTICStatusListener() {
      this.tic.addTICStatusListener({
        onTICForceOffline: () => {
          this.status = 1
          this.clearClassInfo()
          console.log('被T出课堂', '课堂id ' + this.roomID)

          this.$message.error({
            duration: 5000,
            message: `您已在其他地方登录，${this.countDown}秒后自动退出直播间`,
            onClose: () => { this.$router.push('/online/liveLesson') }
          })
        }
      })
    },

    /**
     * 结束推流
     */
    stopPush(callback) {
      if (this.localStream && this.isPushing) {
        this.trtcClient.unpublish(this.localStream).then(() => {
          this.isPushing = 0
          document.getElementById('local_video').remove()
          this.localStream.stop()
          this.localStream = null
          if (Object.prototype.toString.call(callback) === '[object Function]') {
            callback()
          }
        })
      }
    },

    // 开启摄像头
    openCemera() {
      // 从麦克风和摄像头采集本地音视频流
      // eslint-disable-next-line no-undef
      const cameraStream = TRTC.createStream({
        audio: true,
        video: true
      })
      // 设置视频分辨率等参数
      cameraStream.setVideoProfile('720p')
      if (this.localStream && this.isPushing) { // 如果正在推流, 先停止发布流
        this.stopPush(() => {
          this.initLocalStream(cameraStream)
        })
      } else {
        this.initLocalStream(cameraStream)
      }
    },

    // 初始化推流
    initLocalStream(localStream) {
      window.localStream = localStream
      localStream.initialize().catch(error => {
        console.error('推流初始化失败 ' + error)
      }).then(() => {
        console.log('推流初始化成功', localStream)

        // eslint-disable-next-line no-undef
        TRTC.getCameras().then(devices => {
          console.log('摄像头列表=========', devices)
          if (devices && devices.length > 0) {
            this.$refs.liveCemera.cemeraList = [...devices]
            this.$refs.liveCemera.cemeraId = devices[0].deviceId
            this.$refs.liveCemera.hasCemera = true
            this.UPDATE_STATE({ cemeraDisabled: false })
          } else {
            this.$message.error('未检测到摄像头设备')
            this.$refs.liveCemera.hasCemera = false
            this.UPDATE_STATE({ cemeraDisabled: true })
          }
        })
        // eslint-disable-next-line no-undef
        TRTC.getMicrophones().then(devices => {
          console.log('麦克风列表=========', devices)
          if (devices && devices.length > 0) {
            this.$refs.liveCemera.micList = [...devices]
            this.$refs.liveCemera.micId = devices[0].deviceId
            this.UPDATE_STATE({ micDisabled: false })
          } else {
            this.$message.error('未检测到麦克风设备，请至少保证麦克风设备可用后开始直播')
            this.UPDATE_STATE({ micDisabled: true })
          }
        })

        this.enableCamera = true
        let localVideoWrapEl = document.getElementById('local_video')
        if (!localVideoWrapEl) {
          localVideoWrapEl = document.createElement('div')
          localVideoWrapEl.id = 'local_video'
          document.querySelector('#video_wrap').insertBefore(localVideoWrapEl, null)
        }
        // 本地流播放
        localStream.play(localVideoWrapEl, {
          muted: true
        })
        this.localStream = localStream

        // 发布本地流（远端可收到）
        this.trtcClient && this.trtcClient.publish(localStream).then(() => {
          // 本地流发布成功
          this.isPushing = 1 // 正在推流
          this.isPushCamera = true // 正在推摄像头
          console.log('推流成功')
          // 结束loading
          this.HIDE_LOADING()

          // 未开课默认弹设置
          if (this.currentRow.status === '1') {
            this.$refs.liveCemera.openSet()
          }
        }).catch(error => {
          console.log(error)
          this.HIDE_LOADING()
        })
      })
    },

    /**
     * 摄像头消息
     */
    cemeraMsg(openCemera) {
      let cemera = 'open'
      let text = '开启摄像头'
      if (!openCemera) {
        cemera = 'close'
        text = '关闭摄像头'
      }
      // 发送消息
      const now = moment().format('HH:mm')
      const data = {
        time: now,
        name: this.currentRow.tname,
        isSystem: true,
        text,
        cemera
      }
      this.tic.sendGroupCustomMessage(JSON.stringify(data), (res) => {
        if (res.code !== 0) {
          this.$message.error('消息发送失败')
        }
      })
    },

    /**
     * 麦克风消息
     */
    micMsg(openMic) {
      let microphone = 'open'
      let text = '开启麦克风'
      if (!openMic) {
        microphone = 'close'
        text = '关闭麦克风'
      }
      // 发送消息
      const now = moment().format('HH:mm')
      const data = {
        time: now,
        name: this.currentRow.tname,
        isSystem: true,
        text,
        microphone
      }
      this.tic.sendGroupCustomMessage(JSON.stringify(data), (res) => {
        if (res.code !== 0) {
          this.$message.error('消息发送失败')
        }
      })
    },

    /**
     * 摄像头开关
     */
    toggleCamera() {
      this.enableCamera = !this.enableCamera
      this.cemeraMsg(this.enableCamera)
      if (this.localStream) {
        this.enableCamera ? this.localStream.unmuteVideo() : this.localStream.muteVideo()
      }

      const videoEl = document.getElementById('local_video')
      if (!this.enableCamera) {
        // 关闭视频通话
        videoEl.style.display = 'none'
        const videoTrack = this.localStream.getVideoTrack()
        if (videoTrack) {
          this.localStream.removeTrack(videoTrack).then(() => {
            console.log('关闭视频')
            // 关闭摄像头
            videoTrack.stop()
          })
        }
      } else {
        this.localStream.stop()
        videoEl.style.display = 'block'
        // 打开摄像头，增加视频通话
        // eslint-disable-next-line no-undef
        const videoStream = TRTC.createStream({
          audio: false,
          video: true
        })
        // 设置视频分辨率等参数
        videoStream.setVideoProfile('720p')
        videoStream.initialize().then(() => {
          // 增加视频通话
          this.localStream.addTrack(videoStream.getVideoTrack()).then(() => {
            console.log('增加一个视频')
            let localVideoWrapEl = document.getElementById('local_video')
            if (!localVideoWrapEl) {
              localVideoWrapEl = document.createElement('div')
              localVideoWrapEl.id = 'local_video'
              document.querySelector('#video_wrap').insertBefore(localVideoWrapEl, null)
            }
            // 本地流播放
            this.localStream.play(localVideoWrapEl, {
              muted: true
            })
          })
        })
      }
    },

    /**
     * 麦克风开关
     */
    toggleMic() {
      this.enableMic = !this.enableMic
      this.micMsg(this.enableMic)
      if (this.localStream) {
        this.enableMic ? this.localStream.unmuteAudio() : this.localStream.muteAudio()
      }
      if (!this.enableMic && this.liveStatus === 1) {
        this.$message.error('麦克风已关闭，观看者无法听到声音')
      }
    },

    /**
     * 白板事件回调处理
     * @param {*} data
     */
    proBoardData(data) {
      this.fileInfoList = this.teduBoard.getFileInfoList()
      this.currentFileId = this.teduBoard.getCurrentFile()
      console.log('this.currentFileId', this.currentFileId)
      this.thumbUrls = this.teduBoard.getThumbnailImages(this.currentFileId)
      const fileInfo = this.teduBoard.getFileInfo(this.currentFileId)
      console.log('fileInfo', fileInfo)
      if (fileInfo) {
        this.boardData = {
          currentBoardId: this.currentFileId,
          boardIdlist: this.teduBoard.getFileBoardList(this.currentFileId),
          current: fileInfo.currentPageIndex + 1,
          total: fileInfo.pageCount
        }
        // this.$nextTick(() => {
        // 同步完成切换到历史课件
        console.log('同步完成切换到历史课件', data)
        if (data && data.switchFile) {
          this.wareLoading = true
          console.log('???????????切换', this.currentFileId)
          this.teduBoard.switchFile(this.currentFileId)

          this.UPDATE_STATE({ showFileId: this.currentFileId })
        }
        if (document.getElementById('scroll_move')) {
          const width = 145 + 8
          document.getElementById('scroll_move').scrollLeft = width * fileInfo.currentPageIndex
        }
        // })
      }
    },

    /** 消息展示到讨论区 */
    showMessageInBox(uid, data) {
      const info = JSON.parse(data)
      // 设备消息不展示讨论区
      if (!!info.cemera || !!info.microphone) {
        return
      }
      this.msgs.push({
        time: info.time,
        uid,
        text: info.text,
        name: info.name,
        isSystem: info.isSystem
      })

      this.$nextTick(() => {
        var msgbox = document.querySelector('#msg_box')
        msgbox.scrollTop = msgbox.scrollHeight
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.live_box /deep/{
  .el-button--mini i{
    margin-right: 4px;
  }
  .el-button--text{
    padding: 0;
    height: auto;
    border: none;
  }
}

.live_header{
  height: 50px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 99;
  img{
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-left: 40px;
    margin-right: 10px;
  }
  span{
    color: #333;
  }
  .header_line{
    color: #ddd;
    margin: 0 28px;
    font-size: 18px;
  }
  .header_btn{
    height: 32px;
  }
  &_right{
    display: flex;
    align-items: center;
  }
}

.live_content{
  display: flex;
}

.live_left{
  width: 269px;
  border-right: 1px solid #eee;
}

.live_center{
  width: calc(100vw - 549px);
}

.live_right{
  width: 280px;
  border-left: 1px solid #eee;
}
</style>
