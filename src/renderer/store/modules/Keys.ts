import PolykeyClient from '@renderer/resources/client';

export default {
  namespaced: true,
  state: {
    publicKey: '',
    privateKey: '',
    keyNames: [],
    selectedKeyName: '',
    selectedKeyContent: ''
  },
  actions: {
    loadKeyNames: async function({ commit }) {
      const keyNames = await PolykeyClient.ListKeys();
      commit('loadKeyNames', keyNames);
    },
    deleteKey: async function({ commit, state }, keyName) {
      const successful = await PolykeyClient.DeleteKey(keyName);
      if (successful) {
        const keyNames = await PolykeyClient.ListKeys();
        return commit('loadKeyNames', keyNames);
      } else {
        return commit('loadKeyNames', state.keyNames);
      }
    },
    loadKeyPair: async function({ commit }) {
      const keyPair = await PolykeyClient.GetPrimaryKeyPair(true);
      console.log('keyPair', keyPair);
      // commit('loadKeyPair', { publicKey: keyPair.public, privateKey: keyPair.private })
    },
    selectKey: async function({ commit }, keyName: string) {
      const keyContent = await PolykeyClient.GetKey(keyName);
      commit('selectKey', { selectedKeyName: keyName, selectedKeyContent: keyContent });
    }
  },
  mutations: {
    loadKeyNames: function(state, keyNames) {
      state.keyNames = keyNames;
    },
    loadKeyPair: function(state, { publicKey, privateKey }: { publicKey: string; privateKey: string }) {
      state.publicKey = publicKey;
      state.privateKey = privateKey;
    },
    selectKey: function(state, { selectedKeyName, selectedKeyContent }) {
      state.selectedKeyName = selectedKeyName;
      state.selectedKeyContent = selectedKeyContent;
    }
  },
  getters: {}
};
