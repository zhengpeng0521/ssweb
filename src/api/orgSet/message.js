import request from '@/utils/request'
// 获取支付二维码
export function addSmsPack(data) {
  return request({
    url: '/ss-sys-provider/sysPack/smsPackage/addSmsPack',
    method: 'post',
    data
  })
}

// 提交付款信息-汇款凭证
export function submitPayInfo(data) {
  return request({
    url: '/ss-sys-provider/sysPack/smsPackage/submitPayInfo',
    method: 'post',
    data
  })
}

// 支付-订单取消
export function smsPackCancel(data) {
  return request({
    url: '/ss-sys-provider/sysPack/smsPackage/smsPackCancel',
    method: 'post',
    data
  })
}
// 短信充值记录
export function queryRechargeLog(data) {
  return request({
    url: '/ss-sys-provider/sysPack/smsPackage/queryRechargeLog',
    method: 'post',
    data
  })
}
// 短信剩余条数查询
export function getMessagesLeft() {
  return request({
    url: '/ss-sys-provider/sysServer/sms/getMessagesLeft',
    method: 'get'
  })
}
// 短信套餐列表
export function querySmsPackage() {
  return request({
    url: '/ss-sys-provider/sysPack/mealSaaS/querySmsPackage',
    method: 'get'
  })
}
// sms套餐-支付成功通知
export function payNotice(data) {
  return request({
    url: '/ss-sys-provider/sysPack/smsPackage/payNotice',
    method: 'post',
    data
  })
}
