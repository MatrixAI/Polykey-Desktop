export default {
  namespaced: true,
  state: {
    visible: false,
    color: 'success',
  },
  actions: {
    toggleAlert: function (
      context,
      props: {
        visible: boolean;
        type: 'success' | 'warning' | 'error' | 'info';
        message?: string;
      },
    ) {
      context.commit('setVisible', props);
    },
  },
  mutations: {
    setVisible: function (
      state,
      {
        visible,
        type,
        message,
      }: {
        visible: boolean;
        type: 'success' | 'warning' | 'error' | 'info';
        message?: string;
      },
    ): void {
      state.visible = visible;
      state.color = type;
      state.message = message ?? '';
    },
  },
};
