import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

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
  public updateKeyNames(keyNames: string[]): void {
    this.context.commit('setKeyNames', keyNames)
  }
}
export default Keys
