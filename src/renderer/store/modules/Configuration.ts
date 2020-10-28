export default {
  namespaced: true,
  state: {},
  actions: {},
  mutations: {},
  getters: {}
}
// import store from '@/store'
// import { getModule, Module, MutationAction, VuexModule } from 'vuex-module-decorators'

// @Module({ name: 'Configuration', namespaced: true })
// class Configuration extends VuexModule {
//   public activeNodePath: string = '~/.polykey'
//   public nodePathList: string[] = []

//   @MutationAction({ rawError: true, mutate: ['activeNodePath'] })
//   public async selectNodePath(nodePath: string) {
//     return { activeNodePath: nodePath }
//   }

//   @MutationAction({ rawError: true, mutate: ['nodePathList'] })
//   public async loadNodePathList() {
//     const nodePathList = [this.activeNodePath]
//     return { nodePathList }
//   }
// }

// function getConfiguration() {
//   return getModule(Configuration, store)
// }

// export default Configuration
// export { getConfiguration }

