export default {
  namespaced: true,
  state: {
    isOpen: false,
    confirmed: false,
  },
  actions: {
    toggleOpen: function ({ commit, state }, isOpen) {
      commit('setOpen', isOpen ?? !state.isOpen)
    },
    confirm: function ({ commit, state }) {
      commit('setConfirmed', !state.confirm)
    },
  },
  mutations: {
    setOpen: function (state, open) {
      state.open = open
    },
    setConfirmed: function (state, confirmed) {
      state.confirmed = confirmed
      state.isOpen = false
    },
  },
}
