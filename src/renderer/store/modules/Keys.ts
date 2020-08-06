import { polykeyClient } from '@/store'
import { getConfiguration } from '@/store/modules/Configuration'
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
    const keyNames = await polykeyClient.listKeys(getConfiguration().activeNodePath)
    return { keyNames }
  }
  @MutationAction({ rawError: true, mutate: ['keyNames'] })
  public async deleteKey(keyName: string) {
    const successful = await polykeyClient.deleteKey(getConfiguration().activeNodePath, keyName)
    if (successful) {
      const keyNames = await polykeyClient.listKeys(getConfiguration().activeNodePath)
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
    const keyPair = await polykeyClient.getPrimaryKeyPair(getConfiguration().activeNodePath, true)
    return { publicKey: keyPair.publicKey, privateKey: keyPair.privateKey }
  }
  @MutationAction({ rawError: true, mutate: ['selectedKeyName', 'selectedKeyContent'] })
  public async selectKey(keyName: string) {
    const keyContent = await polykeyClient.getKey(getConfiguration().activeNodePath, keyName)
    return { selectedKeyName: keyName, selectedKeyContent: keyContent }
  }
}
export default Keys
