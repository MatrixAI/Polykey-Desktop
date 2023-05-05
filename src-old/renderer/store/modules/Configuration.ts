export default {
  namespaced: true,
  state: {
    activeNodePath: '~/.polykey',
    nodePathList: [],
  },
  actions: {
    selectNodePath: function (context, activeNodePath) {
      context.commit('selectNodePath', activeNodePath);
    },
    loadNodePathList: function (context) {
      context.commit('loadNodePathList');
    },
  },
  mutations: {
    selectNodePath: function (state, activeNodePath) {
      state.activeNodePath = activeNodePath;
    },
    loadNodePathList: function (state) {
      state.nodePathList = [state.activeNodePath];
    },
  },
};
