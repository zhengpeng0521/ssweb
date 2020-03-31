import request from '@/utils/request'

// 查询短信记录
export function getSendHistory(query) {
  return request({
    url: '/ss-sys-provider/sysServer/sms/getSendHistory',
    method: 'post',
    params: query
  })
}

// 查询短信条数和电话
export function getRemaining(query) {
  return request({
    url: '/ss-sys-provider/sysServer/sms/getRemaining',
    method: 'post',
    params: query
  })
}

// 查短信条数不足提醒添加
export function smsRemind(query) {
  return request({
    url: '/ss-sys-provider/sysServer/sms/smsRemind',
    method: 'post',
    params: query
  })
}
