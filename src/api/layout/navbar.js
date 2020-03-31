import request from '@/utils/request'

// 修改密码
export async function changePwd(params) {
  return request({
    url: `${window.SYS_URL}/sysBase/tenantUser/changePassword`,
    method: 'post',
    data: params
  })
}
// 获取校区
export async function queryOrgListBySysUid(params) {
  return request({
    url: `${window.SYS_URL}/sysBase/org/queryOrgListBySysUid`,
    method: 'post',
    data: params
  })
}

// 切换校区
export async function queryYqCode(params) {
  return request({
    url: `${window.SYS_URL}/sysBase/tenantUser/getToken`,
    method: 'post',
    data: params
  })
}
// 默认校区
export async function setDefaultLoginOrg(params) {
  return request({
    url: `${window.SYS_URL}/sysBase/tenantUser/setDefaultLoginOrg`,
    method: 'post',
    data: params
  })
}
