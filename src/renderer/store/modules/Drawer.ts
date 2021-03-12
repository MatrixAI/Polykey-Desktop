export default {
  namespaced: true,
  state: {
    isOpen: false,
    selectedRoute: '/',
  },
  actions: {
    toggleDrawer: function ({ commit, state }, isOpen?: boolean) {
      commit('setDrawer', isOpen ?? !state.isOpen)
    },
    selectRoute: function ({ commit }, route: string) {
      commit('setSelectedRoute', route)
    },
  },
  mutations: {
    setDrawer: function (state, open) {
      state.open = open
    },
    setSelectedRoute: function (state, route) {
      state.selectedRoute = route
    },
  },
  getters: {},
}
