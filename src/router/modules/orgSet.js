import Layout from '@/views/layout/Layout'

import ThirdMain from '@/views/layout/components/ThirdMain'

const orgSettings = {
  path: '/org_settings',
  component: Layout,
  redirect: 'noredirect',
  name: 'orgSettings',
  alwaysShow: true,
  meta: {
    title: '机构设置',
    icon: 'icon_gb_jgsz',
    meunId: '9000000'
  },
  children: [
    {
      path: 'staff_mgr',
      // component: () => import('@/views/orgSet/staffSet/staffSet'),
      name: 'staffMgr',
      component: ThirdMain,
      meta: {
        title: '账号管理',
        noCache: true,
        meunId: '9010000',
        // mKey:00002,
        cn: [
          {
            component: () =>
              import('@/views/orgSet/staffSet/staffMgr/staffMgr'),
            name: 'staffMgr',
            meta: { title: '员工管理', meunId: '9010100' }
          },
          {
            component: () => import('@/views/orgSet/staffSet/roleMgr/roleMgr'),
            name: 'roleMgr',
            meta: { title: '角色管理', meunId: '9010200' }
          },
          {
            component: () => import('@/views/orgSet/staffSet/wageSet/wageSet'),
            name: 'wageMgr',
            meta: { title: '工资设置', meunId: '9010300' }
          }
        ]
      }
    },
    {
      path: 'edu_set',
      component: () => import('@/views/orgSet/campusSet/campusSet'),
      name: 'eduSet',
      meta: { title: '校区信息', noCache: true, meunId: '9020000' }
    },
    {
      path: 'base_set',
      component: ThirdMain,
      name: 'baseSet',

      meta: {
        title: '校区配置',
        noCache: true,
        meunId: '9030000',
        cn: [
          {
            component: () =>
              import('@/views/orgSet/baseSet/classRoomMgr/classRoomMgr'),
            name: 'classRoomMgr',
            meta: { title: '教室管理', meunId: '9030200' }
          },
          {
            component: () =>
              import('@/views/orgSet/weChatAccounts/accountsMgr/accountsMgr'),
            name: 'wxOpen',
            meta: { title: '公众号管理', meunId: '9030600' }
          },
          {
            component: () => import('@/views/orgSet/dnsMgr/dnsMgr'),
            name: 'dnsMgr',
            meta: { title: '域名管理', meunId: '9030500' }
          },
          {
            component: () => import('@/views/orgSet/baseSet/printSet/printSet'),
            name: 'printSet',
            meta: { title: '打印设置', meunId: '9030100' }
          }
        ]
      }
    },
    {
      path: 'rule_set',

      name: 'ruleSet',
      component: ThirdMain,
      meta: {
        title: '规则设置',
        noCache: true,
        meunId: '9040000',
        cn: [
          {
            component: () =>
              import('@/views/orgSet/messageNotice/messageNotice'),
            name: 'messageNotice',
            meta: { title: '消息通知', meunId: '9040400' }
          },
          {
            component: () => import('@/views/orgSet/tcrComm/index'),
            name: 'tcrComm',
            meta: { title: '家校通设置', meunId: '9040200' }
          },
          {
            component: () =>
              import('@/views/orgSet/systemSet/followRule/FollowRule'),
            name: 'followRule',
            meta: { title: '跟进规则', meunId: '9040500' }
          },
          {
            component: () =>
              import('@/views/orgSet/systemSet/attendanceRule/attendanceRule'),
            name: 'attendanceRule',
            meta: { title: '签到考勤', meunId: '9040700' }
          },
          {
            component: () =>
              import('@/views/orgSet/systemSet/contractRule/ContractRule'),
            name: 'ContractRule',
            meta: { title: '合同规则', meunId: '9040300' }
          },
          {
            component: () => import('@/views/orgSet/baseSet/bizParam/bizParam'),
            name: 'bizParamSet',
            meta: { title: '业务参数', meunId: '9040100' }
          },
          {
            component: () =>
              import('@/views/orgSet/baseSet/holidaySet/holidaySet'),
            name: 'holidaySet',
            meta: { title: '节日设置', meunId: '9040600' }
          }
        ]
      }
    },
    {
      path: 'log_file',
      component: () => import('@/views/orgSet/logFile/logFile'),
      name: 'logfile',
      meta: { title: '操作日志', noCache: true, meunId: '9100000' }
    },
    // {
    //   path: 'tcr_comm',

    //   name: 'tcrComm',
    //   component: ThirdMain,
    //   meta: {
    //     title: '家校通设置',
    //     noCache: true,
    //     meunId: '9040000',
    //     cn: [
    //       {
    //         component: () =>
    //           import('@/views/orgSet/tcrComm/displayItem/displayItem'),
    //         name: 'displayItem',
    //         meta: { title: '显示项设置', meunId: '9040100' }
    //       },
    //       {
    //         component: () =>
    //           import('@/views/orgSet/tcrComm/bookCourse/bookCourse'),
    //         name: 'bookCourse',
    //         meta: { title: '自主约课', meunId: '9040200' }
    //       }
    //     ]
    //   }
    // },
    // {
    //   path: 'message_notice_set',
    //   component: () => import('@/views/orgSet/messageNotice/messageNotice'),
    //   name: 'messageNotice',

    //   meta: { title: '消息通知', noCache: true, meunId: '9050000' }
    // },
    {
      path: 'combo_mgr',
      component: () => import('@/views/orgSet/comboMgr/comboMgr'),
      name: 'comboMgr',

      meta: { title: '系统续费', noCache: true, meunId: '9090000' }
    },
    {
      path: 'pay_account',
      component: ThirdMain,
      name: 'payAccount',

      meta: {
        title: '支付中心',
        noCache: true,
        meunId: '9060000',
        cn: [
          {
            component: () => import('@/views/orgSet/payAccount/payRec/payRec'),
            name: 'payRec',
            meta: { title: '收付款账号', meunId: '9060100' }
          },
          {
            component: () =>
              import('@/views/orgSet/payAccount/accountDetail/accountDetail'),
            name: 'accountDetail',
            meta: { title: '账号明细', meunId: '9060200' }
          }
        ]
      }
    }
    // {
    //   path: 'dns_mgr',
    //   component: () => import('@/views/orgSet/dnsMgr/dnsMgr'),
    //   name: 'dnsMgr',

    //   meta: { title: '域名管理', noCache: true, meunId: '9070000' }
    // },
    // {
    //   path: 'wx_open',
    //   component: () =>
    //     import('@/views/orgSet/weChatAccounts/accountsMgr/accountsMgr'),
    //   name: 'wxOpen',

    //   meta: { title: '公众号管理', noCache: true, meunId: '9080000' }
    // },
    // {
    //   path: 'sms_log',
    //   component: () => import('@/views/orgSet/smsLog/smsLog'),
    //   name: 'smsLog',

    //   meta: { title: '短信记录', noCache: true, meunId: '9100000' }
    // },
    // {
    //   path: 'system_set',
    //   component: ThirdMain,
    //   name: 'systemSet',

    //   meta: {
    //     title: '系统设置',
    //     noCache: true,
    //     meunId: '9120000',
    //     cn: [
    //       {
    //         component: () =>
    //           import('@/views/orgSet/systemSet/systemRule/systemRule'),
    //         name: 'systemRule',
    //         meta: { title: '系统规则', meunId: '9120100' }
    //       },
    //       {
    //         component: () =>
    //           import('@/views/orgSet/systemSet/dupCheckRule/dupCheckRule'),
    //         name: 'dupCheckRule',
    //         meta: { title: '查重规则', meunId: '9120400' }
    //       },
    //       {
    //         component: () =>
    //           import('@/views/orgSet/systemSet/attendanceRule/attendanceRule'),
    //         name: 'attendanceRule',
    //         meta: { title: '考勤规则', meunId: '9120500' }
    //       },
    //       {
    //         component: () =>
    //           import('@/views/orgSet/systemSet/integralRule/integralRule'),
    //         name: 'integralRule',
    //         meta: { title: '积分规则', meunId: '9120600' }
    //       }
    //     ]
    //   }
    // }
  ]
}
export default orgSettings
