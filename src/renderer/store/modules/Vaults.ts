import PolykeyClient from '@renderer/resources/PolykeyClient'

export default {
  namespaced: true,
  state: {
    vaultNames: [],
    selectedVaultName: ''
  },
  actions: {
    loadVaultNames: async function({ commit }, selectFirstVault = false) {
      const vaultNames = await PolykeyClient.ListVaults()
      commit('setVaultNames', vaultNames)
      console.log(selectFirstVault)

      if (selectFirstVault && vaultNames.length !== 0) {
        console.log(vaultNames[0])
        commit('setSelectedVault', vaultNames[0])
      }
    },
    selectVault: async function({ commit }, vaultName) {
      commit('setSelectedVault', vaultName)
    },
    deleteVault: async function({ commit }, vaultName) {
      await PolykeyClient.DeleteVault(vaultName)
      const vaultNames = await PolykeyClient.ListVaults()
      commit('setVaultNames', vaultNames)
    }
  },
  mutations: {
    setVaultNames: function(state, vaultNames) {
      state.vaultNames = vaultNames
    },
    setSelectedVault: function(state, vaultName) {
      state.selectedVaultName = vaultName
    }
  },
  getters: {}
}
