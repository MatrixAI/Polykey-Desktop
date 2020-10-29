export default {
  namespaced: true,
  state: {
    isOpen: false,
    selectedRoute: '/'
  },
  actions: {
    toggleDrawer: function({ commit, state }, isOpen?: boolean) {
      commit('setDrawer', isOpen ?? !state.isOpen)
    },
    selectRoute: function({ commit }, route: string) {
      commit('setSelectedRoute', route)
    }
  },
  mutations: {
    setDrawer: function(state, open) {
      state.open = open
    },
    setSelectedRoute: function(state, route) {
      state.selectedRoute = route
    }
  },
  getters: {}
}
// import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

// @Module({ namespaced: true })
// class Drawer extends VuexModule {
//   public isOpen: boolean = false
//   public selectedRoute: string = '/'
//   @Mutation
//   public setDrawer(open: boolean): void {
//     this.isOpen = open
//   }
//   @Action({ rawError: true })
//   public toggleDrawer(isOpen?: boolean) {
//     this.context.commit('setDrawer', isOpen ?? !this.isOpen)
//   }

//   @Mutation
//   public setSelectedRoute(route: string): void {
//     this.selectedRoute = route
//   }
//   @Action({ rawError: true })
//   public selectRoute(route: string) {
//     this.context.commit('setSelectedRoute', route)
//   }
// }

// export default Drawer
