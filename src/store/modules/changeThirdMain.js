const changeThirdMain = {
  namespaced: true,
  state: {
    tabsName: '',
    isChange: false,
    cTabName: '' // tab里面的tab切换
  },

  mutations: {
    CHANGE_ACTIVE_NAME: (state, actives) => {
      const tabNames = actives.split('_')
      let activeName
      if (tabNames && tabNames.length > 0) {
        activeName = tabNames[0]
        if (activeName === 'myGame') { // 新版游戏tab切换
          state.tabsName = activeName
          state.cTabName = tabNames[1]
          state.isChange = true
        } else {
          state.tabsName = activeName
          state.isChange = true
        }
      }
      // state.tabsName = actives
      // state.isChange = true
    },

    CHANGE_SWITCH: (state, actives) => {
      state.isChange = false
      state.tabsName = ''
      state.cTabName = ''
    }
  },
  actions: {
    changeTabs({ commit }, actives) {
      commit('CHANGE_ACTIVE_NAME', actives)
    }
  }
}

export default changeThirdMain
