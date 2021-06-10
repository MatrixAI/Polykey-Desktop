import PolykeyClient from '@/renderer/resources/client';
import { makeIdentifiers } from '@/renderer/store/utils';

const [actionsInt, actionsExt] = makeIdentifiers('Peers', [
  'ListPeers',
  'ScanPeer',
  'PullVaults',
  'PingPeer',
]);

const enum mutations {
  SetListPeers = 'SetListPeers',
  SetPullVaults = 'SetPullVaults',
}

type State = {
  peers: string[];
};

const state: State = {
  peers: [],
};
export default {
  namespaced: true,
  state,
  actions: {
    async [actionsInt.ListPeers]({ commit }) {
      const peerIds = await PolykeyClient.ListPeers();
      console.log(peerIds);
      commit(mutations.SetListPeers);
    },
    async [actionsInt.PullVaults]({ commit }, peerId: string) {
      //commit(mutations.PullVaults, searchMode);
    },
    async [actionsInt.PingPeer]({ commit }, peerId: string) {
      //commit(mutations.PullVaults, searchMode);
    },
  },
  mutations: {
    [mutations.SetListPeers]: function (state: State, peers: string[]) {
      state.peers = peers;
    },
  },
  getters: {},
};
