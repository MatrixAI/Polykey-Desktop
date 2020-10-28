export default {
  namespaced: true,
  state: {},
  actions: {},
  mutations: {},
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
