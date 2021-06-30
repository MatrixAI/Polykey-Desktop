import PolykeyClient from '@/renderer/resources/client';

export default {
  namespaced: true,
  state: {
    publicKey: '',
    privateKey: '',
    keyNames: [],
    selectedKeyName: '',
    selectedKeyContent: '',
  },
  actions: {
    loadKeyPair: async function ({ commit }) {
      const keyPair = await PolykeyClient.keysRootKeyPair();
      console.log('keyPair', keyPair);
      commit('loadKeyPair', { publicKey: keyPair.pb_public, privateKey: keyPair.pb_private })
    },
  },
  mutations: {
    loadKeyNames: function (state, keyNames) {
      state.keyNames = keyNames;
    },
    loadKeyPair: function (
      state,
      { publicKey, privateKey }: { publicKey: string; privateKey: string },
    ) {
      state.publicKey = publicKey;
      state.privateKey = privateKey;
    },
    selectKey: function (state, { selectedKeyName, selectedKeyContent }) {
      state.selectedKeyName = selectedKeyName;
      state.selectedKeyContent = selectedKeyContent;
    },
  },
  getters: {},
};
