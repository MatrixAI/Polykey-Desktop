import store, { polykeyClient } from '@/store'
import { VuexModule, Module, MutationAction, getModule } from 'vuex-module-decorators'

@Module({ name: 'Configuration', namespaced: true })
class Configuration extends VuexModule {
  public activeNodePath: string = '/home/robbie/.polykey'
  public nodePathList: string[] = []

  @MutationAction({ rawError: true, mutate: ['activeNodePath'] })
  public async selectNodePath(nodePath: string) {
    return { activeNodePath: nodePath }
  }

  @MutationAction({ rawError: true, mutate: ['nodePathList'] })
  public async loadNodePathList() {
    const nodePathList = await polykeyClient.listNodes()
    console.log(nodePathList);

    return { nodePathList }
  }
}

function getConfiguration() {
  return getModule(Configuration, store)
}

export default Configuration
export { getConfiguration }
