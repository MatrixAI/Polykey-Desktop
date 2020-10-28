import { useStore } from 'vuex'

export default module => {
  const store = useStore()

  return {
    state: store.state[module],
    dispatch: (action, params = null) => {
      store.dispatch(`${module}/${action}`, params)
    }
  }
}
