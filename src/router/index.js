import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
import tableRouter from "./modules/table" //eslint-disable-line
// 学员CRM
import crmRouter from './modules/crm'
// 增值服务
import addServiceRouter from './modules/addService'
// 教务管理
import teachRouter from './modules/teach'
// 托班教务
import classAffairsRouter from './modules/classAffairs'

import sampleStyle from "./modules/elementUI" //eslint-disable-line
// 招生宝
import marketingRouter from './modules/marketing'
// 微官网
import microWebRouter from './modules/microWeb'
//  机构设置
import orgSettings from './modules/orgSet'
// 数据中心
import reportForm from './modules/reportForm'
/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/forgetpassword',
    component: () => import('@/views/login/forgetpassword'),
    hidden: true
  },
  {
    path: '/newGame',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'ifr',
        component: () => import('@/components/IframeCom/iframeCom'),
        name: 'ifr',
        meta: {
          title: '新版本游戏',
          icon: 'icon_gb_sy',
          noCache: true
          // meunId: '1000000'暂时去掉首页的权限控制
        }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '',
    component: Layout,
    redirect: 'home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/home/index'),
        name: 'home',
        meta: {
          title: '首页',
          icon: 'icon_gb_sy',
          noCache: true
          // meunId: '1000000'// 暂时去掉首页的权限控制
        }
      }
    ]
  },
  /** When your routing table is too long, you can split it into small modules**/
  // tableRouter,
  marketingRouter,
  microWebRouter,
  crmRouter,
  teachRouter,
  classAffairsRouter,
  {
    path: '/onlineLesson',
    component: Layout,
    name: 'onlineLesson',
    redirect: '/onlineLesson/recorded',
    meta: {
      meunId: '5090000'
    },
    children: [
      {
        path: 'recorded',
        component: () => import('@/views/teachManage/onlineLesson/recorded/index'),
        name: 'recorded',
        meta: { title: '录播课程', icon: 'lubo', meunId: '5090000', noCache: true }
      },
      {
        path: '/addCourseWare',
        name: 'addCourseWare',
        component: () =>
          import('@/views/teachManage/onlineLesson/recorded/AddCourseWare'), // 新增课件
        hidden: true
      },
      {
        path: '/editCourseWare',
        name: 'editCourseWare',
        component: () =>
          import('@/views/teachManage/onlineLesson/recorded/EditCourseWare'), // 编辑课件
        hidden: true
      }
    ]
  },
  {
    path: '/online',
    component: Layout,
    name: 'online',
    redirect: '/online/liveLesson',
    meta: {
      meunId: '5100000'
    },
    children: [
      {
        path: 'liveLesson',
        component: () => import('@/views/liveLesson/index'),
        name: 'liveLesson',
        meta: { title: '直播课程', icon: 'zhibo', meunId: '5100000', noCache: true }
      }
    ]
  },
  {
    path: '/liveRoom',
    component: () => import('@/views/liveLesson/LiveRoom'),
    hidden: true
  },
  reportForm,
  addServiceRouter,
  orgSettings,
  // sampleStyle,
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
