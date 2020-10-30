import PolykeyClient from '@/store/PolykeyClient'

export default {
  namespaced: true,
  state: {
    publicKey: '',
    privateKey: '',
    keyNames: [],
    selectedKeyName: '',
    selectedKeyContent: ''
  },
  actions: {
    loadKeyNames: async function({ commit }) {
      const keyNames = await PolykeyClient.ListKeys()
      commit('loadKeyNames', keyNames)
    },
    deleteKey: async function({ commit, state }, keyName) {
      const successful = await PolykeyClient.DeleteKey(keyName)
      if (successful) {
        const keyNames = await PolykeyClient.ListKeys()
        return commit('loadKeyNames', keyNames)
      } else {
        return commit('loadKeyNames', state.keyNames)
      }
    },
    loadKeyPair: async function({ commit }) {
      const keyPair = await PolykeyClient.GetPrimaryKeyPair(true)
      console.log('keyPair', keyPair)
      // commit('loadKeyPair', { publicKey: keyPair.public, privateKey: keyPair.private })
    },
    selectKey: async function({ commit }, keyName: string) {
      const keyContent = await PolykeyClient.GetKey(keyName)
      commit('selectKey', { selectedKeyName: keyName, selectedKeyContent: keyContent })
    }
  },
  mutations: {
    loadKeyNames: function(state, keyNames) {
      state.keyNames = keyNames
    },
    loadKeyPair: function(state, { publicKey, privateKey }: { publicKey: string; privateKey: string }) {
      state.publicKey = publicKey
      state.privateKey = privateKey
    },
    selectKey: function(state, { selectedKeyName, selectedKeyContent }) {
      state.selectedKeyName = selectedKeyName
      state.selectedKeyContent = selectedKeyContent
    }
  },
  getters: {}
}
// import { polykeyClient } from '@/store'
// import { getConfiguration } from '@/store/modules/Configuration'
// import { VuexModule, Module, Mutation, MutationAction } from 'vuex-module-decorators'

// @Module({ namespaced: true })
// class Keys extends VuexModule {
//   public publicKey: string = ''
//   public privateKey: string = ''
//   public keyNames: string[] = []
//   public selectedKeyName: string = ''
//   public selectedKeyContent: string = ''

//   @MutationAction({ rawError: true, mutate: ['keyNames'] })
//   public async loadKeyNames() {
//     const keyNames = await polykeyClient.listKeys()
//     return { keyNames }
//   }
//   @MutationAction({ rawError: true, mutate: ['keyNames'] })
//   public async deleteKey(keyName: string) {
//     const successful = await polykeyClient.deleteKey(keyName)
//     if (successful) {
//       const keyNames = await polykeyClient.listKeys()
//       return { keyNames }
//     } else {
//       return { keyNames: this.keyNames }
//     }
//   }
//   @Mutation
//   public setKeyPair(keyPair: { public: string, private: string }): void {
//     this.publicKey = keyPair.public
//     this.privateKey = keyPair.private
//   }
//   @MutationAction({ rawError: true, mutate: ['publicKey', 'privateKey'] })
//   public async loadKeyPair() {
//     const keyPair = await polykeyClient.getPrimaryKeyPair(true)
//     return { publicKey: keyPair.public, privateKey: keyPair.private }
//   }
//   @MutationAction({ rawError: true, mutate: ['selectedKeyName', 'selectedKeyContent'] })
//   public async selectKey(keyName: string) {
//     const keyContent = await polykeyClient.getKey(keyName)
//     return { selectedKeyName: keyName, selectedKeyContent: keyContent }
//   }
// }
// export default Keys
