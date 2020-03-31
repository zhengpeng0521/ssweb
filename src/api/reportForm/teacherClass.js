import request from '@/utils/request'

/** 教师带班 */
export async function getTeacherClass(params) {
  return request({
    url: `${window.REPORT_URL}/erp/stats/tmk/clsTeacherQuery`,
    method: 'post',
    data: params
  })
}
