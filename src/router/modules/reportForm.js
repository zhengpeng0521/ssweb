import Layout from '@/views/layout/Layout'

import ThirdMain from '@/views/layout/components/ThirdMain'

const reportForm = {
  path: '/report',
  component: Layout,
  redirect: 'noredirect',
  name: 'report',
  alwaysShow: true,
  meta: {
    title: '数据中心',
    icon: 'icon_gb_sjzx',
    meunId: '7000000'
  },
  children: [
    {
      path: 'crm_form',
      // component: () => import('@/views/orgSet/staffSet/staffSet'),
      name: 'crmForm',
      component: ThirdMain,
      meta: {
        title: '销售报表',
        noCache: true,
        meunId: '7010000',
        // icon: 'user',
        // mKey:00002,
        cn: [
          {
            component: () =>
              import('@/views/reportForm/crmForm/leadsSource/LeadsSource'),
            name: 'leadsSourse',
            meta: { title: '名单来源表', meunId: '7010100' }
          },
          {
            component: () =>
              import('@/views/reportForm/crmForm/saleWork/SaleWork'),
            name: 'saleWork',
            meta: { title: '销售工作表', meunId: '7010200' }
          },
          {
            component: () =>
              import(
                '@/views/reportForm/crmForm/saleAchivement/SaleAchivement'
              ),
            name: 'saleAchivement',
            meta: { title: '销售业绩表', meunId: '7010500' }
          },
          {
            component: () =>
              import(
                '@/views/reportForm/crmForm/contractIncome/ContractIncome'
              ),
            name: 'contractIncome',
            meta: { title: '合同收入表', meunId: '7010300' }
          },
          {
            component: () =>
              import('@/views/reportForm/crmForm/courseSale/CourseSale'),
            name: 'courseSale',
            meta: { title: '课程售卖表', meunId: '7010600' }
          },
          {
            component: () =>
              import('@/views/reportForm/crmForm/giveRecord/GiveRecord'),
            name: 'giveRecord',
            meta: { title: '赠课记录表', meunId: '7010400' }
          }
        ]
      }
    },
    {
      path: 'erp_form',
      // component: () => import('@/views/orgSet/campusSet/campusSet'),
      name: 'erpFrom',
      component: ThirdMain,
      meta: {
        title: '教学报表',
        noCache: true,
        meunId: '7020000',
        // icon: 'qq',
        cn: [
          {
            component: () =>
              import('@/views/reportForm/erpForm/useClass/UseClass'),
            name: 'useClass',
            meta: { title: '学员消课表', meunId: '7020100' }
          },
          {
            component: () =>
              import('@/views/reportForm/erpForm/silentStu/SilentStu'),
            name: 'silentStu',
            meta: { title: '沉默学员表', meunId: '7020200' }
          },
          {
            component: () =>
              import('@/views/reportForm/erpForm/stuAttence/StuAttence'),
            name: 'stuAttence',
            meta: { title: '学员考勤表', meunId: '7020300' }
          },
          {
            component: () =>
              import('@/views/reportForm/erpForm/teaching/Teaching'),
            name: 'teaching',
            meta: { title: '老师授课表', meunId: '7020400' }
          },
          {
            component: () =>
              import('@/views/reportForm/erpForm/classroomUse/ClassroomUse'),
            name: 'classroomUse',
            meta: { title: '教室利用表', meunId: '7020500' }
          },
          {
            component: () =>
              import(
                '@/views/reportForm/erpForm/classTimeDetail/ClassTimeDetail'
              ),
            name: 'classTimeDetail',
            meta: { title: '课时详情表', meunId: '7020600' }
          },
          {
            component: () =>
              import('@/views/reportForm/erpForm/teacherSalary/TeacherSalary'),
            name: 'teacherSalary',
            meta: { title: '老师工资表', meunId: '7020700' }
          },
          {
            component: () =>
              import('@/views/reportForm/erpForm/classMonth/ClassMonth'),
            name: 'classMonth',
            meta: { title: '课时月结表', meunId: '7020800' }
          },
          {
            component: () =>
              import('@/views/reportForm/erpForm/timeMonth/TimeMonth'),
            name: 'timeMonth',
            meta: { title: '时长月结表', meunId: '7020900' }
          },
          {
            component: () =>
              import('@/views/reportForm/erpForm/teacherClass/TeacherClass'),
            name: 'teacherClass',
            meta: { title: '教师带班表', meunId: '7021000' }
          }
        ]
      }
    },
    {
      path: 'marketing_form',
      name: 'marketingForm',
      component: ThirdMain,
      meta: {
        title: '运营报表',
        noCache: true,
        meunId: '7030000',
        cn: [
          {
            component: () =>
              import(
                '@/views/reportForm/marketingForm/signTypeForm/SignTypeForm'
              ),
            name: 'signType',
            meta: { title: '签单类型统计表', meunId: '70300100' }
          },
          {
            component: () =>
              import(
                '@/views/reportForm/marketingForm/sourceTypeForm/SourceTypeForm'
              ),
            name: 'sourceType',
            meta: { title: '来源类别转化表', meunId: '70300200' }
          }
        ]
      }
    },
    {
      path: 'money_form',
      name: 'moneyForm',
      component: ThirdMain,
      meta: {
        title: '财务报表',
        noCache: true,
        meunId: '7040000',
        cn: [
          {
            component: () =>
              import('@/views/reportForm/moneyForm/checkMoney/CheckMoney'),
            name: 'checkMoney',
            meta: { title: '财务对账表', meunId: '7040010' }
          }
        ]
      }
    },
    {
      path: 'market_form',
      name: 'marketForm',
      component: ThirdMain,
      meta: {
        title: '市场报表',
        noCache: true,
        meunId: '7050000',
        cn: [
          {
            component: () =>
              import('@/views/reportForm/marketForm/marketSource/MarketSource'),
            name: 'marketSource',
            meta: { title: '市场渠道转化表', meunId: '7050010' }
          },
          {
            component: () =>
              import(
                '@/views/reportForm/marketForm/offlineExtend/OfflineExtend'
              ),
            name: 'offlineExtend',
            meta: { title: '户外地推产出表', meunId: '7050020' }
          }
        ]
      }
    }
  ]
}
export default reportForm
