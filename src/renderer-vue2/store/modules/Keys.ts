import { polykeyClient } from 'renderer-vue2/store'
import { getConfiguration } from 'renderer-vue2/store/modules/Configuration'
import { VuexModule, Module, Mutation, MutationAction } from 'vuex-module-decorators'


@Module({ namespaced: true })
class Keys extends VuexModule {
  public publicKey: string = ''
  public privateKey: string = ''
  public keyNames: string[] = []
  public selectedKeyName: string = ''
  public selectedKeyContent: string = ''

  @MutationAction({ rawError: true, mutate: ['keyNames'] })
  public async loadKeyNames() {
    const keyNames = await polykeyClient.listKeys()
    return { keyNames }
  }
  @MutationAction({ rawError: true, mutate: ['keyNames'] })
  public async deleteKey(keyName: string) {
    const successful = await polykeyClient.deleteKey(keyName)
    if (successful) {
      const keyNames = await polykeyClient.listKeys()
      return { keyNames }
    } else {
      return { keyNames: this.keyNames }
    }
  }
  @Mutation
  public setKeyPair(keyPair: { public: string, private: string }): void {
    this.publicKey = keyPair.public
    this.privateKey = keyPair.private
  }
  @MutationAction({ rawError: true, mutate: ['publicKey', 'privateKey'] })
  public async loadKeyPair() {
    const keyPair = await polykeyClient.getPrimaryKeyPair(true)
    return { publicKey: keyPair.public, privateKey: keyPair.private }
  }
  @MutationAction({ rawError: true, mutate: ['selectedKeyName', 'selectedKeyContent'] })
  public async selectKey(keyName: string) {
    const keyContent = await polykeyClient.getKey(keyName)
    return { selectedKeyName: keyName, selectedKeyContent: keyContent }
  }
}
export default Keys
