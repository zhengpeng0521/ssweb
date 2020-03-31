import request from '@/utils/request'

/** 财务对账 */
export async function getCheckMoney(params) {
  return request({
    url: `${window.REPORT_URL}/stat/tmk/report/financialCounting/query`,
    method: 'post',
    data: params
  })
}
