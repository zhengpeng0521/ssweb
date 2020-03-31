import { Message } from 'element-ui'
import { getTeacherClass } from '@/api/reportForm/teacherClass'
import { SHOW_LOADING, HIDE_LOADING, UPDATE_STATE } from '../../types'

const teacherClass = {
  namespaced: true,

  state: {
    loading: false,
    searchValue: {}, // 搜索内容

    total: [], // 总计
    monthList: [] // 列表
  },

  mutations: {
    /** 显示loading */
    [SHOW_LOADING](state) {
      state.loading = true
    },
    /** 隐藏loading */
    [HIDE_LOADING](state) {
      state.loading = false
    },
    [UPDATE_STATE](state, payload) {
      for (const i in payload) {
        state[i] = payload[i]
      }
    }
  },

  actions: {
    /** 获取教师带班列表 */
    async getTeacherClassList({ state, commit }, payload) {
      commit(SHOW_LOADING)

      const listData = await getTeacherClass(payload)
      if (listData && listData.data && listData.data.errorCode === 0) {
        const monthList = [...listData.data.results]
        monthList.forEach(item => {
          item.teacherItems &&
            item.teacherItems.forEach(child => {
              if (child.userId + '' === '0' && child.username === '总计') {
                child.courseName = '合计'
              } else {
                child.courseName = item.courseName
              }
            })
        })
        state.monthList = monthList
        const total = []
        total.push({ ...listData.data, countType: '全科合计' })
        state.total = total

        state.searchValue = payload
      } else {
        Message.error(
          (listData && listData.data && listData.data.errorMessage) ||
            '教师带班列表获取失败！'
        )
      }

      commit(HIDE_LOADING)
    }
  }
}
export default teacherClass
