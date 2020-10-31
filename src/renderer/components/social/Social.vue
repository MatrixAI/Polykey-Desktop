<template>
  <div class="social-container">
    <div class="side-panel">
      <h2 style="text-align: center;">Peers</h2>
      <ui-button raised @click="addPeer()">Add Peer</ui-button>
      <ui-list :type="2" avatar>
        <template v-for="item in peerIds">
          <ui-item @click="selectPeer(item)">
            <ui-icon :class="iconClass">folder</ui-icon>
            <ui-item-text-content>
              <ui-item-text1>{{ item }}</ui-item-text1>
              <ui-item-text2>Peer</ui-item-text2>
            </ui-item-text-content>
            <ui-item-last-content>
              <ui-button raised @click="deletePeer(item)">
                <ui-icon>delete</ui-icon>
              </ui-button>
            </ui-item-last-content>
          </ui-item>
        </template>
      </ui-list>
    </div>
    <div class="main-panel">
      <h2>{{ `Selected Peer ID - ${selectedPeerId}` }}</h2>
      <h4>Peer Public Key</h4>
      <ui-textfield
        input-type="textarea"
        outlined
        disabled
        rows="10"
        cols="100"
        class="white-background"
        v-model="publicKey"
      ></ui-textfield>
      <h4>Peer Root Certificate</h4>
      <ui-textfield
        input-type="textarea"
        outlined
        disabled
        rows="10"
        cols="100"
        class="white-background"
        v-model="rootCertificate"
      ></ui-textfield>
      <br />
      <h4>Contact Information</h4>
      <ui-textfield outlined class="white-background" v-model="peerAddress">Peer Address</ui-textfield>
      <ui-textfield outlined class="white-background" v-model="apiAddress">API Address</ui-textfield>
      <br />
      <br />
      <ui-button @click="createVault" raised>Edit</ui-button>
      <ui-button @click="updatePeer">Update</ui-button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watchEffect, ref } from 'vue'
import { useRouter } from 'vue-router'
import useModule from '@/store/useModule'

export default defineComponent({
  setup() {
    const peerStore = useModule('Peers')
    const router = useRouter()
    const peerIds = ref([])
    const selectedPeerId = ref('')
    const publicKey = ref('')
    const rootCertificate = ref('')
    const peerAddress = ref('')
    const apiAddress = ref('')

    watchEffect(() => {
      peerIds.value = peerStore.state.peerIds
      selectedPeerId.value = peerStore.state.selectedPeerId
      publicKey.value = peerStore.state.publicKey
      rootCertificate.value = peerStore.state.rootCertificate
      peerAddress.value = peerStore.state.peerAddress
      apiAddress.value = peerStore.state.apiAddress
    })

    const addPeer = () => {
      router.push('/Vaults/NewVault')
    }
    const deletePeer = (peerId: string) => {
      peerStore.dispatch('deletePeer', peerId)
    }
    const selectPeer = peerId => {
      selectedPeerId.value = peerId
      peerStore.dispatch('selectPeerId', peerId)
    }

    /** Load vaults */
    peerStore.dispatch('loadPeerIds')

    return {
      peerIds,
      selectedPeerId,
      publicKey,
      rootCertificate,
      peerAddress,
      apiAddress,
      addPeer,
      deletePeer,
      selectPeer
    }
  }
})
</script>

<style scoped>
.main-panel {
  background: white;
  float: left;
  height: 100vh;
  width: calc(100% - 300px);
}

.side-panel {
  float: left;
  background-color: rgb(184, 184, 184);
  overflow-y: scroll;
  width: 300px;
  height: 100vh;
}
</style>
