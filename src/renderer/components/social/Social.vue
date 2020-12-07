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
      <ui-tabs v-model="active">
        <ui-tab>Peer Info</ui-tab>
        <ui-tab>Peer Vaults</ui-tab>
      </ui-tabs>

      <ui-panels v-model="active">
        <ui-panel>
          <PeerInfo />
        </ui-panel>
        <ui-panel>
          <PeerVaults />
        </ui-panel>
      </ui-panels>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watchEffect, ref } from 'vue'
import { useRouter } from 'vue-router'
import useModule from '@renderer/store/useModule'
import PeerInfo from '@renderer/components/social/PeerInfo.vue'
import PeerVaults from '@renderer/components/social/PeerVaults.vue'

export default defineComponent({
  components: {
    PeerInfo,
    PeerVaults
  },
  setup() {
    const peerStore = useModule('Peers')
    const router = useRouter()
    const peerIds = ref([])
    const selectedPeerId = ref('')
    const active = ref(0)
    const tabs = ref(['PeerInfo', 'PeerVaults'])

    watchEffect(() => {
      peerIds.value = peerStore.state.peerIds
      selectedPeerId.value = peerStore.state.selectedPeerId
    })

    const addPeer = () => {
      router.push('/Social/AddPeer')
    }
    const deletePeer = (peerId: string) => {
      peerStore.dispatch('deletePeer', peerId)
    }
    const selectPeer = peerId => {
      selectedPeerId.value = peerId
      peerStore.dispatch('selectPeerId', peerId)
    }

    // Load peers
    peerStore.dispatch('loadPeerIds')

    return {
      peerIds,
      selectedPeerId,
      active,
      tabs,
      addPeer,
      deletePeer,
      selectPeer,
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
