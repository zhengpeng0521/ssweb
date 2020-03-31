import { Message } from 'element-ui'
import { getMarketSource } from '@/api/reportForm/marketForm/marketSource'
import { SHOW_LOADING, HIDE_LOADING, UPDATE_STATE } from '../../../types'

const marketSource = {
  namespaced: true,

  state: {
    loading: false,
    searchValue: {}, // 搜索内容

    total: [], // 总计
    sourceList: [] // 列表
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
    /** 获取市场渠道转化表 */
    async getMarketSource({ state, commit }, payload) {
      commit(SHOW_LOADING)

      // 列表
      const listData = await getMarketSource(payload)
      if (listData && listData.data && listData.data.errorCode === 0) {
        const total = []
        total.push({ ...listData.data.countItem, countType: '合计' })
        state.sourceList = listData.data.results
        state.total = total
        state.searchValue = payload
      } else {
        Message.error(
          (listData && listData.data && listData.data.errorMessage) ||
            '市场渠道转化表列表获取失败！'
        )
      }

      commit(HIDE_LOADING)
    }
  }
}
export default marketSource
