import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'
import { polykeyClient } from '@/store'

@Module({ namespaced: true })
class Keys extends VuexModule {
  public keyNames: string[] = [
    "Primary Key",
    "Some-Symm-Key",
    "Another-Sym-Key"
  ]
  public primaryKeyName: string = 'Primary Key'
  @Mutation
  public setKeyNames(keyNames: string[]): void {
    this.keyNames = keyNames
  }
  @Action
  public async loadKeyNames(): Promise<void> {
    const keyNames = await polykeyClient.key
    this.context.commit('setKeyNames', keyNames)
  }
}
export default Keys
