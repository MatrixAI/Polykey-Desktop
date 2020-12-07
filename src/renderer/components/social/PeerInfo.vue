<template>
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
  <ui-textfield :disabled="!isEditing" outlined class="white-background" v-model="peerAddress">Peer Address</ui-textfield>
  <ui-textfield :disabled="!isEditing" outlined class="white-background" v-model="apiAddress">API Address</ui-textfield>
  <br />
  <br />
  <ui-button :disabled="isEditing" @click="toggleEditing" raised>Edit</ui-button>
  <ui-button :disabled="!isEditing" @click="updatePeer" raised>Update</ui-button>
</template>

<script lang="ts">
import { useRouter } from 'vue-router'
import useModule from '@renderer/store/useModule'
import PolykeyClient from '@renderer/store/PolykeyClient'
import { defineComponent, watchEffect, ref } from 'vue'

export default defineComponent({
  setup() {
    const peerStore = useModule('Peers')
    const router = useRouter()
    const selectedPeerId = ref('')
    const publicKey = ref('')
    const rootCertificate = ref('')
    const peerAddress = ref('')
    const apiAddress = ref('')
    const isEditing = ref(false)

    watchEffect(() => {
      selectedPeerId.value = peerStore.state.selectedPeerId
      publicKey.value = peerStore.state.publicKey
      rootCertificate.value = peerStore.state.rootCertificate
      peerAddress.value = peerStore.state.peerAddress
      apiAddress.value = peerStore.state.apiAddress
    })

    const updatePeer = async () => {
      const successful = await PolykeyClient.UpdatePeerInfo({
        publicKey: selectedPeerId.value,
        rootCertificate: rootCertificate.value,
        peerAddress: peerAddress.value,
        apiAddress: apiAddress.value
      })
    }

    const toggleEditing = () => {
      isEditing.value = !isEditing.value
    }

    return {
      selectedPeerId,
      publicKey,
      rootCertificate,
      peerAddress,
      apiAddress,
      isEditing,
      updatePeer,
      toggleEditing
    }
  }
})
</script>

<style scoped></style>
