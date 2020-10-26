import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

@Module({ namespaced: true })
class ConfirmationDialog extends VuexModule {
  public isOpen: boolean = false
  public confirmed: boolean = false
  @Mutation
  public setOpen(open: boolean): void {
    this.isOpen = open
  }
  @Mutation
  public setConfirmed(confirmed: boolean): void {
    this.confirmed = confirmed
    this.isOpen = false
  }
  @Action({ rawError: true })
  public toggleOpen(isOpen?: boolean) {
    this.context.commit('setOpen', isOpen ?? !this.isOpen)
  }
  @Action({ rawError: true })
  public confirm() {
    this.context.commit('setConfirmed', !this.confirm)
  }
}

export default ConfirmationDialog
