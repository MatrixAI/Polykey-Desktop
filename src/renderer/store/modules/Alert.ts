import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

@Module({ namespaced: true })
class Alert extends VuexModule {
  public visible: boolean = false
  public message: string = ''
  @Mutation
  public setVisible(props: { visible: boolean, message?: string }): void {
    this.visible = props.visible
    this.message = props.message ?? ''
  }
  @Action
  public toggleAlert(props: {visible: boolean, message?: string}) {
    this.context.commit('setVisible', props)
  }
}

export default Alert
