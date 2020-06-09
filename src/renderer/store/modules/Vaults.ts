import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { polykeyClient } from '@/store'

@Module({ namespaced: true })
class Vaults extends VuexModule {
  public vaultNames: string[] = []
  public selectedVaultName: string = ''
  @Mutation
  public setVaultNames(vaultNames: string[]): void {
    this.vaultNames = vaultNames
  }
  @Mutation
  public setSelectedVault(vaultName: string): void {
    this.selectedVaultName = vaultName
  }
  @Action({ rawError: true })
  public async loadVaultNames(): Promise<void> {
    const vaultNames = await polykeyClient.listVaults('/home/robbie/.polykey')
    this.context.commit('setVaultNames', vaultNames)
  }
  @Action({ rawError: true })
  public selectVault(vaultName: string): void {
    this.context.commit('setSelectedVault', vaultName)
  }
}
export default Vaults
