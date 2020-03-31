import request from '@/utils/request'

// 来源类别转化率
export async function getSourceType(params) {
  return request({
    url: `${window.REPORT_URL}/erp/stats/tmk/sourceQuery`,
    method: 'post',
    data: params
  })
}
