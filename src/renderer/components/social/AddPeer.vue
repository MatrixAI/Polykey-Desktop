<template>
  <ui-form v-if="!b64Input">
    <h2>Add Peer</h2>
    <h4>Peer Public Key</h4>
    <ui-textfield
      input-type="textarea"
      outlined
      rows="10"
      cols="100"
      class="white-background"
      v-model="publicKey"
    ></ui-textfield>
    <h4>Peer Root Certificate</h4>
    <ui-textfield
      input-type="textarea"
      outlined
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
  </ui-form>
  <ui-form v-else>
    <h4>Base 64 Input</h4>
    <ui-textfield
      input-type="textarea"
      outlined
      rows="10"
      cols="100"
      class="white-background"
      v-model="b64String"
    ></ui-textfield>
  </ui-form>
  <ui-form nowrap>
    <br />
    <ui-button @click="back" raised>Back</ui-button>
    <ui-button @click="toggleB64Input" raised>Toggle Base64</ui-button>
    <ui-button @click="addPeer" raised>Add</ui-button>
  </ui-form>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive } from 'vue'
import { useRouter } from 'vue-router'
import PolykeyClient from '@/store/PolykeyClient'
import useModule from '@/store/useModule'

export default defineComponent({
  setup() {
    const router = useRouter()
    const peerStore = useModule('Peers')
    const data = reactive({
      b64Input: false,
      b64String: '',
      publicKey: '',
      rootCertificate: '',
      peerAddress: '',
      apiAddress: ''
    })
    const addPeer = async () => {
      let successful: boolean
      if (data.b64Input) {
        successful = await PolykeyClient.AddPeerB64(data.b64String)
      } else {
        successful = await PolykeyClient.AddPeer({
          publicKey: data.publicKey,
          rootCertificate: data.rootCertificate,
          peerAddress: data.peerAddress,
          apiAddress: data.apiAddress
        })
      }

      if (successful) {
        // Load peers
        peerStore.dispatch('loadPeerIds')
        router.back()
      }
    }

    const toggleB64Input = () => {
      data.b64Input = !data.b64Input
    }

    const back = () => {
      router.back()
    }

    return {
      ...toRefs(data),
      addPeer,
      toggleB64Input,
      back
    }
  }
})
</script>

<style scoped>
.white-background {
  background: white;
}
</style>
