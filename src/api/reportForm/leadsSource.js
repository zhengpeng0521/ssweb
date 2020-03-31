import request from '@/utils/request'

export async function getLeadsData(params) {
  return request({
    url: `${window.REPORT_URL}/crm/statistics/leadsSourceQuery`,
    method: 'post',
    data: params
  })
}
export async function getLastTime(params) {
  return request({
    url: `${window.REPORT_URL}/crm/stats/xxl/info`,
    method: 'post',
    data: params
  })
}
export async function getUpdataData(params) {
  return request({
    url: `${window.REPORT_URL}/crm/stats/xxl/call`,
    method: 'post',
    data: params
  })
}
export async function getUpdatingData(params) {
  return request({
    url: `${window.REPORT_URL}/crm/stats/xxl/call/check`,
    method: 'post',
    data: params
  })
}
