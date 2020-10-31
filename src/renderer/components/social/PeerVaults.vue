<template>
  <div>
    <h4>Peer Vaults</h4>
    <ui-list v-if="scannedVaultNames.length > 0" :type="2" avatar>
      <template v-for="item in scannedVaultNames">
        <ui-item>
          <ui-icon :class="iconClass">admin_panel_settings</ui-icon>
          <ui-item-text-content>
            <ui-item-text1>{{ item }}</ui-item-text1>
            <ui-item-text2>Vault</ui-item-text2>
          </ui-item-text-content>
          <ui-item-last-content>
            <ui-button raised @click="pullVault(item)">
              <ui-icon>system_update_alt</ui-icon>
            </ui-button>
          </ui-item-last-content>
        </ui-item>
      </template>
    </ui-list>
    <p v-else>Either no vaults found or still loading</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, watchEffect, ref } from 'vue'
import { useRouter } from 'vue-router'
import useModule from '@/store/useModule'

export default defineComponent({
  setup() {
    const peerStore = useModule('Peers')
    const vaultsStore = useModule('Vaults')
    const router = useRouter()
    const scannedVaultNames = ref([])

    watchEffect(() => {
      scannedVaultNames.value = peerStore.state.scannedVaultNames
    })

    const pullVault = vaultName => {
      console.log(vaultName)
      peerStore.dispatch('pullVault', {peerId: peerStore.state.selectedPeerId, vaultName})
    }

    return {
      scannedVaultNames,
      pullVault
    }
  }
})
</script>

<style scoped></style>
