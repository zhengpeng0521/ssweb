import request from '@/utils/request'

// 获取户外地推表
export async function getOfflineExtend(params) {
  return request({
    url: `${window.REPORT_URL}/stat/tmk/report/outpromote/query`,
    method: 'post',
    data: params
  })
}
