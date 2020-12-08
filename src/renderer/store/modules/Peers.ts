import PolykeyClient from '@renderer/resources/PolykeyClient'
import * as pb from '@matrixai/polykey/proto/compiled/Agent_pb';
import useModule from '@renderer/store/useModule'
import router from '@renderer/router';

export default {
  namespaced: true,
  state: {
    peerIds: [],
    selectedPeerId: '',
    publicKey: '',
    rootCertificate: '',
    peerAddress: '',
    apiAddress: '',
    scannedVaultNames: []
  },
  actions: {
    loadPeerIds: async function ({ commit }) {
      const peerIds = await PolykeyClient.ListPeers()
      commit('setPeerNames', peerIds)
    },
    selectPeerId: async function ({ commit }, peerId: string) {
      const peerInfo = await PolykeyClient.GetPeerInfo(peerId)
      commit('setSelectedPeer', { peerId, peerInfo })

      PolykeyClient.ScanVaultNames(peerId)
        .then((scannedVaultNames: string[]) => {
          commit('setScannedVaultNames', scannedVaultNames)
        }).catch((e) => console.log(`error scanning vault names: ${e.message}`))
    },
    pullVault: async ({ commit }, { peerId, vaultName }: { peerId: string, vaultName: string }) => {
      try {
        const successful = await PolykeyClient.PullVault({
          publicKey: peerId,
          vaultName: vaultName
        })
      } catch (error) {
        console.log(error)
      }
    }
  },
  mutations: {
    setPeerNames: (state, peerIds: string[]) => {
      state.peerIds = peerIds
    },
    setSelectedPeer: (
      state,
      { peerId, peerInfo }: { peerId: string; peerInfo: pb.PeerInfoMessage.AsObject }
    ) => {
      state.selectedPeerId = peerId
      state.publicKey = peerInfo.publicKey ?? ''
      state.rootCertificate = peerInfo.rootCertificate ?? ''
      state.peerAddress = peerInfo.peerAddress ?? ''
      state.apiAddress = peerInfo.apiAddress ?? ''
      state.scannedVaultNames = []
    },
    setScannedVaultNames: (state, scannedVaultNames: string[]) => {
      state.scannedVaultNames = scannedVaultNames
    },
  },
  getters: {}
}
