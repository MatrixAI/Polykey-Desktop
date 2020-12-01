import PolykeyClient from '@/store/PolykeyClient'

export default {
  namespaced: true,
  state: {
    isUnlocked: false,
    isInitialized: false,
    step: 2
  },
  actions: {
    checkUserStatus: async function ({ commit }) {
      // first set both initialized and unlocked to false, they will be changed in the process
      commit('setIsUnlocked', false)
      commit('setIsInitialized', false)
      try {
        const pid: number = await PolykeyClient.StartAgent()
        console.log(`Agent has been started with a pid of: ${pid}`)
        // try to list some vaults as a proxy for an unlocked node
        const vaultsList = await PolykeyClient.ListVaults()
        console.log(vaultsList)
        commit('setIsUnlocked', true)
        commit('setIsInitialized', true)
      } catch (error) {
        console.log(error)
        if (error.message.includes('not been initialized')) {
          commit('setIsUnlocked', false)
          commit('setIsInitialized', false)
        } else if (error.message.includes('already running')) {
          // try to list some vaults as a proxy for an unlocked node
          try {
            const vaultsList = await PolykeyClient.ListVaults()
            console.log(vaultsList)
            commit('setIsUnlocked', true)
            commit('setIsInitialized', true)
          } catch (error) {
            commit('setIsUnlocked', false)
            commit('setIsInitialized', false)
          }
        } else if (error.message.includes('locked')) {
          commit('setIsUnlocked', false)
          commit('setIsInitialized', true)
        } else {
          // some other error
          commit('setIsUnlocked', false)
          commit('setIsInitialized', false)
          throw Error(`something else went wrong: ${error.message}`)
        }
      }
    },
    setIsUnlocked: async function ({ commit }, isUnlocked: boolean) {
      commit('setIsUnlocked', isUnlocked)
    },
    setIsInitialized: async function ({ commit }, isInitialized: boolean) {
      commit('setIsInitialized', isInitialized)
    }
  },
  mutations: {
    setIsUnlocked: function (state, isUnlocked) {
      state.isUnlocked = isUnlocked
    },
    setIsInitialized: function (state, isInitialized) {
      state.isInitialized = isInitialized
    }
  },
  getters: {}
}
