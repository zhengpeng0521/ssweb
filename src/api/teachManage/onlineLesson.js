import request from '@/utils/request'

// 查询课件列表
export function queryCourseWare(data) {
  return request({
    url: `${window.SS_CRM}/cerp/sgb/courseware/queryList`,
    method: 'post',
    data
  })
}

// 课件信息修改
export function updateCourse(data) {
  return request({
    url: `${window.SS_CRM}/cerp/sgb/courseware/update`,
    method: 'post',
    data
  })
}

// 课件基本信息保存
export function saveCourseBase(data) {
  return request({
    url: `${window.SS_CRM}/cerp/sgb/courseware/add`,
    method: 'post',
    data
  })
}

// 章节列表和基础信息查询
export function getCourseVideo(data) {
  return request({
    url: `${window.SS_CRM}/cerp/sgb/courseware/queryDetail`,
    method: 'post',
    data
  })
}

// 视频列表查询
export function getVideoList(data) {
  return request({
    url: `${window.SS_CRM}/cerp/sgb/courseware/video/queryList`,
    method: 'post',
    data
  })
}

// 新增章节
export function addChapterItem(data) {
  return request({
    url: `${window.SS_CRM}/cerp/sgb/courwareItem/add`,
    method: 'post',
    data
  })
}

// 编辑/删除章节
export function updateChapterItem(data) {
  return request({
    url: `${window.SS_CRM}/cerp/sgb/courseware/update/item`,
    method: 'post',
    data
  })
}

// 章节排序
export function sortChapterItem(data) {
  return request({
    url: `${window.SS_CRM}/cerp/sgb/courseware/item/sort`,
    method: 'post',
    data
  })
}

// 视频排序
export function sortVideoItem(data) {
  return request({
    url: `${window.SS_CRM}/cerp/sgb/courseware/video/sort`,
    method: 'post',
    data
  })
}

// 视频修改
export function updateVideoItem(data) {
  return request({
    url: `${window.SS_CRM}/cerp/sgb/courseware/update/video`,
    method: 'post',
    data
  })
}

// 视频新增
export function addVideoItem(data) {
  return request({
    url: `${window.SS_CRM}/cerp/sgb/courseware/video/add`,
    method: 'post',
    data
  })
}

// 课件详情-左侧查询
export function queryCourseTree(data) {
  return request({
    url: `${window.SS_CRM}/cerp/sgb/courseware/detail/queryTree`,
    method: 'post',
    data
  })
}

// 课件详情-右侧查询
export function queryVideoDetail(data) {
  return request({
    url: `${window.SS_CRM}/cerp/sgb/courseware/video/queryDetail`,
    method: 'post',
    data
  })
}

// 观看学员列表查询 /cerp/sgb/courseware/coursewareStuQuery
export function coursewareStuQuery(data) {
  return request({
    url: `${window.SS_CRM}/cerp/sgb/courseware/coursewareStuQuery`,
    method: 'post',
    data
  })
}

// 课件会员学员添加
export function stuAdd(data) {
  return request({
    url: `${window.SS_CRM}/cerp/sgb/courseware/stu/stuAdd`,
    method: 'post',
    data
  })
}

// 修改会员有效期
export function updateStuTime(data) {
  return request({
    url: `${window.SS_CRM}/cerp/sgb/courseware/stu/updateStuTime`,
    method: 'post',
    data
  })
}

// 班级列表

export function clsList(data) {
  return request({
    url: `${window.SS_CRM}/cerp/sgb/courseware/clsList`,
    method: 'post',
    data
  })
}

// 班级学员列表
export function clsStuList(data) {
  return request({
    url: `${window.SS_CRM}/cerp/sgb/courseware/clsStuList`,
    method: 'post',
    data
  })
}

// 移除会员
export function deleteStu(data) {
  return request({
    url: `${window.SS_CRM}/cerp/sgb/courseware/stu/deleteStu`,
    method: 'post',
    data
  })
}

// 老师发表回复
export function addFeedback(data) {
  return request({
    url: `${window.SS_CRM}/cerp/sgb/courseware/stu/addFeedback`,
    method: 'post',
    data
  })
}

// 评论回复列表
export function feedbackList(data) {
  return request({
    url: `${window.SS_CRM}/cerp/sgb/courseware/feedbackList`,
    method: 'post',
    data
  })
}

// 老师删除评论或回复
export function deleteFeedback(data) {
  return request({
    url: `${window.SS_CRM}/cerp/sgb/courseware/stu/deleteFeedback`,
    method: 'post',
    data
  })
}
