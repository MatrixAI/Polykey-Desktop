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
    const peerNames = await polykeyClient.listPeers()
    this.context.commit('setPeerNames', peerNames)
  }
}
export default Peers
