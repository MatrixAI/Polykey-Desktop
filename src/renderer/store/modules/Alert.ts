export default {
  namespaced: true,
  state: {
    visible: false,
    color: 'success'
  },
  actions: {
    toggleAlert: function(
      context,
      props: { visible: boolean; type: 'success' | 'warning' | 'error' | 'info'; message?: string }
    ) {
      context.commit('setVisible', props)
    }
  },
  mutations: {
    setVisible: function(
      state,
      { visible, type, message }: { visible: boolean; type: 'success' | 'warning' | 'error' | 'info'; message?: string }
    ): void {
      state.visible = visible
      state.color = type
      state.message = message ?? ''
    }
  }
}
// import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

// @Module({ namespaced: true })
// class Alert extends VuexModule {
//   public visible: boolean = false
//   public color: 'success' | 'warning' | 'error'| 'info' = 'success'
//   public message: string = ''
//   @Mutation
//   public setVisible(props: { visible: boolean, type: 'success' | 'warning' | 'error'| 'info', message?: string }): void {
//     this.visible = props.visible
//     this.color = props.type
//     this.message = props.message ?? ''
//   }
//   @Action({ rawError: true })
//   public toggleAlert(props: {visible: boolean, type: 'success' | 'warning' | 'error'| 'info' , message?: string}) {
//     this.context.commit('setVisible', props)
//   }
// }

// export default Alert
