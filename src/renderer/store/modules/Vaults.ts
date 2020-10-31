import PolykeyClient from '@/store/PolykeyClient'

export default {
  namespaced: true,
  state: {
    vaultNames: [],
    selectedVaultName: ''
  },
  actions: {
    loadVaultNames: async function ({ commit }, selectFirstVault: boolean = false) {
      const vaultNames = await PolykeyClient.ListVaults()
      commit('setVaultNames', vaultNames)
      console.log(selectFirstVault);

      if (selectFirstVault && vaultNames.length != 0) {
        console.log(vaultNames[0]);
        commit('setSelectedVault', vaultNames[0])
      }
    },
    selectVault: async function ({ commit }, vaultName) {
      commit('setSelectedVault', vaultName)
    },
    deleteVault: async function ({ commit }, vaultName) {
      await PolykeyClient.DeleteVault(vaultName)
      const vaultNames = await PolykeyClient.ListVaults()
      commit('setVaultNames', vaultNames)
    }
  },
  mutations: {
    setVaultNames: function (state, vaultNames) {
      state.vaultNames = vaultNames
    },
    setSelectedVault: function (state, vaultName) {
      state.selectedVaultName = vaultName
    }
  },
  getters: {}
}
// import { polykeyClient } from '@/store'
// import { getConfiguration } from '@/store/modules/Configuration'
// import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

// @Module({ namespaced: true })
// class Vaults extends VuexModule {
//   public vaultNames: string[] = []
//   public selectedVaultName: string = ''
//   @Mutation
//   public setVaultNames(vaultNames: string[]): void {
//     this.vaultNames = vaultNames
//   }
//   @Mutation
//   public setSelectedVault(vaultName: string): void {
//     this.selectedVaultName = vaultName
//   }
//   @Action({ rawError: true })
//   public async loadVaultNames(): Promise<void> {
//     const vaultNames = await polykeyClient.listVaults()
//     this.context.commit('setVaultNames', vaultNames)
//   }
//   @Action({ rawError: true })
//   public selectVault(vaultName: string): void {
//     this.context.commit('setSelectedVault', vaultName)
//   }
// }
// export default Vaults
