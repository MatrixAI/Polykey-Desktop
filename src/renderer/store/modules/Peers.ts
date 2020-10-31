import PolykeyClient from '@/store/PolykeyClient'
import * as pb from '@matrixai/polykey/proto/compiled/Agent_pb';

export default {
  namespaced: true,
  state: {
    peerIds: [],
    selectedPeerId: '',
    publicKey: '',
    rootCertificate: '',
    peerAddress: '',
    apiAddress: '',
  },
  actions: {
    loadPeerIds: async function ({ commit }) {
      const peerIds = await PolykeyClient.ListPeers()
      commit('setPeerNames', peerIds)
    },
    selectPeerId: async function ({ commit }, peerId: string) {
      const peerInfo = await PolykeyClient.GetPeerInfo(peerId)
      console.log(peerInfo);

      commit('setSelectedPeerId', {peerId, peerInfo})
    }
  },
  mutations: {
    setPeerNames: function (state, peerIds: string[]) {
      state.peerIds = peerIds
    },
    setSelectedPeerId: (
      state,
      { peerId, peerInfo }: { peerId: string; peerInfo: pb.PeerInfoMessage.AsObject }
    ) => {
      state.selectedPeerId = peerId
      state.publicKey = peerInfo.publicKey ?? ''
      state.rootCertificate = peerInfo.rootCertificate ?? ''
      state.peerAddress = peerInfo.peerAddress ?? ''
      state.apiAddress = peerInfo.apiAddress ?? ''
    }
  },
  getters: {}
}
