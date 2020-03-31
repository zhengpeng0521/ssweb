import request from '@/utils/request'

// 签单类型统计
export async function getSignType(params) {
  return request({
    url: `${window.REPORT_URL}/erp/stats/tmk/signTypeQuery`,
    method: 'post',
    data: params
  })
}
