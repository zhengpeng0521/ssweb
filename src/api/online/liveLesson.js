import request from '@/utils/request'

// 查询直播列表
export function query(data) {
  return request({
    url: `${window.SS_CRM}/cerp/live/class/query`,
    method: 'post',
    data
  })
}

// 获取appid
export function queryAppInfo(data) {
  return request({
    url: `${window.SS_CRM}/cerp/live/teacher/userSig`,
    method: 'post',
    data
  })
}

// 新增直播间
export function addLiveRoom(data) {
  return request({
    url: `${window.SS_CRM}/cerp/live/class/add`,
    method: 'post',
    data
  })
}

// 直播间编辑 -删除
export function updateLiveRoom(data) {
  return request({
    url: `${window.SS_CRM}/cerp/live/class/update`,
    method: 'post',
    data
  })
}

// 获取历史消息
export function getMsgList(data) {
  return request({
    url: `${window.SS_CRM}/cerp/live/class/teacher/getGroupMsgGetSimple`,
    method: 'post',
    data
  })
}

// 直播老师列表查询
export function queryTeacher(data) {
  return request({
    url: `${window.SS_CRM}/cerp/live/teacher/query`,
    method: 'post',
    data
  })
}
// 直播列表查看详情
export function queryDetail(data) {
  return request({
    url: `${window.SS_CRM}/cerp/live/class/queryDetail`,
    method: 'post',
    data
  })
}

// 老师操作接口
export function operateTeacher(data) {
  return request({
    url: `${window.SS_CRM}/cerp/live/teacher/operate`,
    method: 'post',
    data
  })
}

// 获取群成员
export function getMembers(data) {
  return request({
    url: `${window.SS_CRM}/cerp/live/class/h5/getGroupMemberList`,
    method: 'post',
    data
  })
}

// 老师冲突列表
export function checkTime(data) {
  return request({
    url: `${window.SS_CRM}/cerp/live/teacher/checkTime`,
    method: 'post',
    data
  })
}

// 直播间人数保存
export function saveLiveNum(data) {
  return request({
    url: `${window.SS_CRM}/cerp/live/class/h5/liveWatchNumSave`,
    method: 'post',
    data
  })
}

// 租户账户查询
export function queryAccount(data) {
  return request({
    url: `${window.SS_CRM}/cerp/live/duration/queryAccount`,
    method: 'post',
    data
  })
}

// 时长消耗明细列表
export function expendRecordList(data) {
  return request({
    url: `${window.SS_CRM}/cerp/live/class/expendRecordList`,
    method: 'post',
    data
  })
}

// 时长充值流水列表
export function durationFlowList(data) {
  return request({
    url: `${window.SS_CRM}/cerp/live/class/durationFlowList`,
    method: 'post',
    data
  })
}

// 结束直播结算
export function heartbeatCheck(data) {
  return request({
    url: `${window.SS_CRM}/cerp/live/class/h5/heartbeatCheck`,
    method: 'post',
    data
  })
}

// 时长消耗明细列表
export function expendRecordInfoList(data) {
  return request({
    url: `${window.SS_CRM}/cerp/live/class/expendRecordInfoList`,
    method: 'post',
    data
  })
}

// 学员时长操作明细
export function operRecord(data) {
  return request({
    url: `${window.SS_CRM}/cerp/live/class/operRecord`,
    method: 'post',
    data
  })
}

// 心跳检测
export function setHeartbeat(data) {
  return request({
    url: `${window.SS_CRM}/cerp/live/class/h5/saveHeartbeat`,
    method: 'post',
    data
  })
}
