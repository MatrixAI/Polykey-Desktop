import PolykeyClient from '@/store/PolykeyClient'

export default {
  namespaced: true,
  state: {
    isUnlocked: false,
    userStatus: 'init'
  },
  actions: {
    checkUserStatus: async function({ commit }) {
      try {
        const pid: number = await PolykeyClient.StartAgent()
        console.log(`Agent has been started with a pid of: ${pid}`)

        commit('setUserStatus', 'RegisterNode')
      } catch (error) {
        if (error.message.includes('not been initialized')) {
          commit('setUserStatus', 'NewNode')
        } else if (error.message.includes('already running')) {
          commit('setUserStatus', 'UnlockNode')
        } else {
          // some other error
          throw Error(`something else went wrong: ${error.message}`)
        }
      }
    },
    setUserStatus: async function({ commit }, status) {
      commit('setUserStatus', status)
    },
    userIsUnlocked: async function({ commit }) {
      commit('setIsUnlocked', true)
    }
  },
  mutations: {
    setIsUnlocked: function(state, isUnlocked) {
      state.isUnlocked = isUnlocked
    },
    setUserStatus: function(state, userStatus) {
      state.userStatus = userStatus
    }
  },
  getters: {}
}
