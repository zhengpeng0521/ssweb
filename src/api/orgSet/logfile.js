import request from '@/utils/request'
// 日志
export function logfilequery(data) {
  return request({
    url: '/ss-es/es/business/logs/query',
    method: 'post',
    data
  })
}
