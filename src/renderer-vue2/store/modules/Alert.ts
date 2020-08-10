import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

@Module({ namespaced: true })
class Alert extends VuexModule {
  public visible: boolean = false
  public color: 'success' | 'warning' | 'error'| 'info' = 'success'
  public message: string = ''
  @Mutation
  public setVisible(props: { visible: boolean, type: 'success' | 'warning' | 'error'| 'info', message?: string }): void {
    this.visible = props.visible
    this.color = props.type
    this.message = props.message ?? ''
  }
  @Action({ rawError: true })
  public toggleAlert(props: {visible: boolean, type: 'success' | 'warning' | 'error'| 'info' , message?: string}) {
    this.context.commit('setVisible', props)
  }
}

export default Alert
