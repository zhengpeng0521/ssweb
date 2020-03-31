import request from '@/utils/request'

// 获取市场渠道转化表
export async function getMarketSource(params) {
  return request({
    url: `${window.REPORT_URL}/stat/tmk/report/channelData/query`,
    method: 'post',
    data: params
  })
}
