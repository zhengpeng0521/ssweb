import { Message } from 'element-ui'
import {
  getUseClassAll,
  getUseClassCourse,
  getUseClassOrg,
  getUseClassTeacher,
  getUseClassSale,
  getUseClassCharge,
  getUseClassCustomer
} from '@/api/reportForm/useClass'
import { objListSortOfTime } from '@/utils/arrayUtils'
import { SHOW_LOADING, HIDE_LOADING } from '../../types'

const useClass = {
  namespaced: true,

  state: {
    loading: false,
    searchValue: {},

    allSource: [], // 消课统计
    allCols: [], // 消课统计全部图例
    showCols: [], // 消课统计显示图例

    courseSource: [], // 按课程
    courseCols: [], // 按课程全部图例
    courseShowCols: [], // 按课程显示图例
    courseStack: {}, // 课程堆叠

    orgSource: [], // 按机构

    teacherSource: [], // 按授课老师
    teacherCols: [], // 按授课老师全部图例
    teacherShowCols: [], // 按授课老师显示图例
    teacherStack: {}, // 按授课老师堆叠

    saleSource: [], // 按负责销售

    chargeSource: [], // 按负责老师

    customerSource: [] // 按负责客服
  },

  mutations: {
    /** 显示loading */
    [SHOW_LOADING](state) {
      state.loading = true
    },
    /** 隐藏loading */
    [HIDE_LOADING](state) {
      state.loading = false
    }
  },

  actions: {
    /** 获取图表数据 */
    async getUseClass({ state, commit }, payload) {
      commit(SHOW_LOADING)

      // 消课统计
      const allList = await getUseClassAll(payload)
      if (allList && allList.data && allList.data.errorCode === 0) {
        let mapOnce = false
        const allSource = []
        const allCols = []
        const showCols = ['date']
        for (const i in allList.data.data) {
          const obj = {
            date: i
          }
          allList.data.data[i] &&
            allList.data.data[i].forEach(item => {
              obj[item.courseId] = item.cost
              if (!mapOnce) {
                allCols.push({
                  key: item.courseId,
                  value: item.courseName
                })
                showCols.push(item.courseId)
              }
            })
          mapOnce = true
          allSource.push(obj)
        }

        state.allSource = objListSortOfTime(allSource, 'date', 'YYYY-MM-DD')
        state.allCols = allCols
        state.showCols = showCols
      } else {
        Message.error(
          (allList && allList.data && allList.data.errorMessage) ||
            '消课统计获取失败！'
        )
      }

      // 按课程
      const courseList = await getUseClassCourse(payload)
      console.log(courseList)
      if (courseList && courseList.data && courseList.data.errorCode === 0) {
        const courseSource = []
        const courseCols = []
        const courseShowCols = ['courseName']
        const courseStack = { users: [] }
        // const compare = []
        // courseList.data.results &&
        // 排序
        if (courseList.data.results.length > 0) {
          for (let i = 0; i < courseList.data.results.length - 1; i++) {
            for (let j = 0; j < courseList.data.results.length - 1 - i; j++) {
              if (courseList.data.results[j].cost < courseList.data.results[j + 1].cost) {
                [courseList.data.results[j], courseList.data.results[j + 1]] = [courseList.data.results[j + 1], courseList.data.results[j]]
              }
            }
          }
        }
        courseList.data.results &&
        courseList.data.results.forEach(course => {
          // console.log(course)
          courseList.data.results.splice(10)
          courseList.data.results.sort(function(a, b) {
            return b.cost - a.cost
          })
          const obj = {
            courseName: course.courseName,
            courseId: course.courseId
          }
          course.list &&
              course.list.forEach(item => {
                // state.searchValue = payload
                obj[item.uid] = item.costNum
                obj[item.uname] = item.costMoney
                if (courseShowCols.indexOf(item.uid) === -1) {
                  courseCols.push({
                    key: item.uid,
                    value: item.uname
                  })
                  courseShowCols.push(item.uid)
                  courseStack.users.push(item.uid)
                }
              })
          courseSource.push(obj)
        })
        // 处理undefinde
        courseSource &&
          courseSource.forEach(child => {
            courseCols &&
              courseCols.forEach(item => {
                child[item.key] = child[item.key] || '0.0'
                child[item.value] = child[item.value] || '0.0'
              })
          })
        state.courseSource = courseSource
        state.courseCols = courseCols
        state.courseShowCols = courseShowCols
        state.courseStack = courseStack
      } else {
        Message.error(
          (courseList && courseList.data && courseList.data.errorMessage) ||
            '课程统计获取失败！'
        )
      }

      // 按机构
      const orgList = await getUseClassOrg(payload)
      if (orgList && orgList.data && orgList.data.errorCode === 0) {
        state.orgSource = orgList.data.results
        orgList.data.results.splice(10)
      } else {
        Message.error(
          (orgList && orgList.data && orgList.data.errorMessage) ||
            '机构统计获取失败！'
        )
      }

      // 按授课老师
      const teacherList = await getUseClassTeacher(payload)
      if (teacherList && teacherList.data && teacherList.data.errorCode === 0) {
        const teacherSource = []
        const teacherCols = []
        const teacherShowCols = ['userName']
        const teacherStack = { courses: [] }
        // 排序
        // if (teacherList.data.results.length > 0) {
        //   for (let i = 0; i < teacherList.data.results.length - 1; i++) {
        //     for (let j = 0; j < teacherList.data.results.length - 1 - i; j++) {
        //       if (teacherList.data.results[j].cost < teacherList.data.results[j + 1].cost) {
        //         [teacherList.data.results[j], teacherList.data.results[j + 1]] = [teacherList.data.results[j + 1], teacherList.data.results[j]]
        //       }
        //     }
        //   }
        // }
        teacherList.data.results &&
          teacherList.data.results.forEach(teacher => {
            console.log(teacher)
            teacherList.data.results.splice(10)
            const obj = {
              userName: teacher.userName,
              userId: teacher.userId
            }
            teacher.list &&
              teacher.list.forEach(item => {
                obj[item.courseId] = item.cost || '0.0'
                obj[item.courseName] = item.money || '0.0'
                if (teacherShowCols.indexOf(item.courseId) === -1) {
                  teacherCols.push({
                    key: item.courseId,
                    value: item.courseName
                  })
                  teacherShowCols.push(item.courseId)
                  teacherStack.courses.push(item.courseId)
                }
              })
            teacherSource.push(obj)
          })
        // 处理undefinde
        teacherSource &&
          teacherSource.forEach(teacher => {
            teacherCols &&
              teacherCols.forEach(item => {
                teacher[item.key] = teacher[item.key] || '0.0'
                teacher[item.value] = teacher[item.value] || '0.0'
              })
          })
        // state.saleSource = teacherList.data.results
        state.teacherSource = teacherSource
        state.teacherCols = teacherCols
        state.teacherShowCols = teacherShowCols
        state.teacherStack = teacherStack
      } else {
        Message.error(
          (teacherList && teacherList.data && teacherList.data.errorMessage) ||
            '授课老师统计获取失败！'
        )
      }

      // 按负责销售
      const saleList = await getUseClassSale(payload)
      if (saleList && saleList.data && saleList.data.errorCode === 0) {
        state.saleSource = saleList.data.results
        saleList.data.results.splice(10)
        // console.log(saleList.data.results)
      } else {
        Message.error(
          (saleList && saleList.data && saleList.data.errorMessage) ||
            '负责销售统计获取失败！'
        )
      }

      // 按负责老师
      const chargeList = await getUseClassCharge(payload)
      // console.log(chargeList)
      if (chargeList && chargeList.data && chargeList.data.errorCode === 0) {
        state.chargeSource = chargeList.data.results
        // state.searchValue = payload
        chargeList.data.results.splice(10)
      } else {
        Message.error(
          (chargeList && chargeList.data && chargeList.data.errorMessage) ||
            '负责老师统计获取失败！'
        )
      }

      // 按负责客服
      const customerList = await getUseClassCustomer(payload)
      if (
        customerList &&
        customerList.data &&
        customerList.data.errorCode === 0
      ) {
        // console.log(customerList.data.results)
        // 排序
        customerList.data.results.sort(function(a, b) {
          return b.costNum - a.costNum
        })
        state.customerSource = customerList.data.results
        state.searchValue = payload
        customerList.data.results.splice(10)
      } else {
        Message.error(
          (customerList &&
            customerList.data &&
            customerList.data.errorMessage) ||
            '负责客服统计获取失败！'
        )
      }

      commit(HIDE_LOADING)
    }
  }
}
export default useClass
