<template>
  <div class="vaults-container">
    <div class="side-panel">
      <h2 style="text-align: center;">Vaults</h2>
      <ui-button raised @click="newVault()">New Vault</ui-button>
      <ui-list :type="2" avatar>
        <template v-for="item in vaultNames">
          <ui-item @click="selectVault(item)">
            <ui-icon :class="iconClass">folder</ui-icon>
            <ui-item-text-content>
              <ui-item-text1>{{ item }}</ui-item-text1>
              <ui-item-text2>Vault</ui-item-text2>
            </ui-item-text-content>
            <ui-item-last-content>
              <ui-button raised @click="deleteVault(item)">
                <ui-icon>delete</ui-icon>
              </ui-button>
            </ui-item-last-content>
          </ui-item>
        </template>
      </ui-list>
    </div>
    <div class="main-panel">
      <h2>{{ selectedVault ?? 'Select Vault' }}</h2>
      <ui-button raised @click="newSecret()">New Secret</ui-button>
      <template v-for="item in secretNames">
        <ui-item>
          <ui-item-text-content>
            <ui-item-text1>{{ item }}</ui-item-text1>
            <ui-item-text2>Secret</ui-item-text2>
          </ui-item-text-content>
          <ui-item-last-content>
            <ui-button raised @click="selectSecret(item)">
              <ui-icon>open_in_new</ui-icon>
            </ui-button>
            <ui-button raised @click="deleteSecret(item)">
              <ui-icon>delete</ui-icon>
            </ui-button>
          </ui-item-last-content>
        </ui-item>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watchEffect, ref } from 'vue'
import { useRouter } from 'vue-router'
import useModule from '@renderer/store/useModule'

export default defineComponent({
  setup() {
    const vaultsStore = useModule('Vaults')
    const secretsStore = useModule('Secrets')
    const router = useRouter()
    const vaultNames = ref([])
    const secretNames = ref([])
    const selectedVault = ref('')

    watchEffect(() => {
      vaultNames.value = vaultsStore.state.vaultNames
      secretNames.value = secretsStore.state.secretNames
    })

    const newVault = () => {
      router.push('/Vaults/NewVault')
    }
    const newSecret = () => {
      if (selectedVault.value) {
        router.push('/Vaults/NewSecret')
      }
    }
    const deleteVault = (vaultName: string) => {
      vaultsStore.dispatch('deleteVault', vaultName)
    }
    const deleteSecret = (secretName: string) => {
      secretsStore.dispatch('deleteSecret', secretName)
      secretsStore.dispatch('loadSecretNames', selectedVault.value)
    }
    const selectVault = vault => {
      selectedVault.value = vault
      vaultsStore.dispatch('selectVault', vault)
      secretsStore.dispatch('loadSecretNames', vault)
    }
    const selectSecret = secret => {
      console.log(secret)
      secretsStore.dispatch('selectSecret', secret)
      router.push('/Vaults/SecretInformation')
    }

    // Load vaults
    vaultsStore.dispatch('loadVaultNames', true)

    return {
      newVault,
      newSecret,
      selectVault,
      selectSecret,
      deleteVault,
      deleteSecret,
      vaultNames,
      secretNames,
      selectedVault
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
