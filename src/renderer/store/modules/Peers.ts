import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { polykeyClient } from '..'
import { getConfiguration } from './Configuration'

@Module({ namespaced: true })
class Peers extends VuexModule {
  public vaultNames: string[] = []
  @Mutation
  public setPeerNames(vaultNames: string[]): void {
    this.vaultNames = vaultNames
  }
  @Action({ rawError: true })
  public async loadPeerNames(): Promise<void> {
    const vaultNames = await polykeyClient.listVaults(getConfiguration().activeNodePath)
    this.context.commit('setVaultNames', vaultNames)
  }
}
export default Peers
