import PolykeyClient from '@renderer/resources/PolykeyClient'

export default {
  namespaced: true,
  state: {
    selectedVaultName: '',
    selectedSecretName: '',
    selectedSecretContent: '',
    secretNames: []
  },
  actions: {
    loadSecretNames: async function({ commit }, vaultName: string) {
      const secretNames = await PolykeyClient.ListSecrets(vaultName)
      commit('setSecretNames', { vaultName, secretNames })
    },
    selectSecret: async function({ commit, state }, secretName?: string) {
      if (secretName) {
        const secretContent = await PolykeyClient.GetSecret({ vaultName: state.selectedVaultName, secretName })
        commit('setSelectedSecret', { secretName, secretContent })
      } else {
        commit('setSelectedSecret', { secretName: '', secretContent: '' })
      }
    },
    updateSecret: async function(
      { commit, state },
      { secretName, secretContent }: { secretName: string; secretContent: string }
    ) {
      const successful = await PolykeyClient.UpdateSecret({
        secretPath: {
          vaultName: state.selectedVaultName,
          secretName
        },
        secretContent: secretContent,
        secretFilePath: ''
      })
      if (successful) {
        commit('setSelectedSecret', { secretName: secretName, secretContent: secretContent })
      }
    },
    deleteSecret: async ({ commit, state }, secretName: string) => {
      await PolykeyClient.DeleteSecret({
        vaultName: state.selectedVaultName,
        secretName
      })
    }
  },
  mutations: {
    setSecretNames: function(state, { vaultName, secretNames }: { vaultName: string; secretNames: string[] }) {
      state.selectedVaultName = vaultName
      state.secretNames = secretNames
    },
    setSelectedSecret: function(state, { secretName, secretContent }: { secretName: string; secretContent: string }) {
      state.selectedSecretName = secretName
      state.selectedSecretContent = secretContent
    }
  },
  getters: {}
}
// import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
// import { polykeyClient } from '..'
// import { getConfiguration } from './Configuration'

// @Module({ namespaced: true })
// class Secrets extends VuexModule {
//   public selectedVaultName: string = ''
//   public secretNames: string[] = []
//   @Mutation
//   public setSecretNames(props: { vaultName: string, secretNames: string[] }): void {
//     this.selectedVaultName = props.vaultName
//     this.secretNames = props.secretNames
//   }
//   @Action({ rawError: true })
//   public async loadSecretNames(vaultName: string): Promise<void> {
//     const secretNames = await polykeyClient.listSecrets(vaultName)
//     this.context.commit('setSecretNames', { vaultName, secretNames })
//   }

//   public selectedSecretName: string = ''
//   public selectedSecretContent: string = ''
//   @Mutation
//   public setSelectedSecret(props: { secretName: string, secretContent: string }): void {
//     this.selectedSecretName = props.secretName
//     this.selectedSecretContent = props.secretContent
//   }
//   @Action({ rawError: true })
//   public async selectSecret(secretName?: string): Promise<void> {
//     if (secretName) {
//       const secretContent = await polykeyClient.getSecret(this.selectedVaultName, secretName)
//       this.context.commit('setSelectedSecret', { secretName, secretContent })
//     } else {
//       this.context.commit('setSelectedSecret', { secretName: '', secretContent: '' })
//     }
//   }
//   @Action({ rawError: true })
//   public async updateSecret(props: { secretName: string; secretContent: string }): Promise<void> {
//     const successful = await polykeyClient.updateSecret(this.selectedVaultName, props.secretName, Buffer.from(props.secretContent))
//     if (successful) {
//       this.context.commit('setSelectedSecret', { secretName: props.secretName, secretContent: props.secretContent })
//     }
//   }
// }
// export default Secrets
