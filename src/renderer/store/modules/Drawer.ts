import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

@Module({ namespaced: true })
class Drawer extends VuexModule {
  public isOpen: boolean = false
  public selectedRoute: string = '/'
  @Mutation
  public setDrawer(open: boolean): void {
    this.isOpen = open
  }
  @Action
  public toggleDrawer(isOpen?: boolean) {
    this.context.commit('setDrawer', isOpen ?? !this.isOpen)
  }

  @Mutation
  public setSelectedRoute(route: string): void {
    this.selectedRoute = route
  }
  @Action
  public selectRoute(route: string) {
    this.context.commit('setSelectedRoute', route)
  }
}

export default Drawer
