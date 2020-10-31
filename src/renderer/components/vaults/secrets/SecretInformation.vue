<template>
  <h2>Secret Information - {{ selectedSecretName }}</h2>
  <ui-textfield class="white-background" :disabled="!isEditing" v-model="selectedSecretContent"></ui-textfield>
  <br />
  <ui-form-field>
    <ui-button @click="navigateBack" raised>Back</ui-button>
    <ui-button @click="toggleIsEdting" :disabled="isEditing" raised>Edit</ui-button>
    <ui-button @click="updateSecret" :disabled="!isEditing" raised>Save</ui-button>
    <ui-icon-button @click="copySecret" icon="file_copy"></ui-icon-button>
  </ui-form-field>
</template>

<script lang="ts">
import { defineComponent, watchEffect, ref } from 'vue'
import { useRouter } from 'vue-router'
import useModule from '@/store/useModule'
import PolykeyClient from '@/store/PolykeyClient'

export default defineComponent({
  setup() {
    const vaultsStore = useModule('Vaults')
    const secretsStore = useModule('Secrets')
    const router = useRouter()
    const selectedSecretName = ref('')
    const selectedSecretContent = ref('')
    const isEditing = ref(false)

    watchEffect(() => {
      selectedSecretName.value = secretsStore.state.selectedSecretName
      selectedSecretContent.value = secretsStore.state.selectedSecretContent
    })

    const toggleIsEdting = () => {
      isEditing.value = !isEditing.value
    }

    const updateSecret = async () => {
      const successful = await PolykeyClient.UpdateSecret({
        secretPath: {
          vaultName: vaultsStore.state.selectedVaultName,
          secretName: selectedSecretName.value
        },
        secretContent: selectedSecretContent.value,
        secretFilePath: ''
      })
      router.back()
    }

    const navigateBack = () => {
      router.back()
    }

    const copySecret = () => {
      PolykeyClient.ClipboardCopy(selectedSecretContent.value)
    }

    return {
      selectedSecretName,
      selectedSecretContent,
      isEditing,
      toggleIsEdting,
      updateSecret,
      copySecret,
      navigateBack,
    }
  }
})
</script>

<style scoped>
.white-background {
  background: white;
}
</style>
