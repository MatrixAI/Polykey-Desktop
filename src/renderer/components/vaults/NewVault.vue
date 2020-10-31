<template>
  <ui-form nowrap>
    <h2>New Vault</h2>
    <ui-form-field>
      <ui-textfield v-model="vaultName" placeholder="Vault Name"></ui-textfield>
    </ui-form-field>
    <ui-form-field>
      <ui-textfield v-model="initialSecretName" placeholder="Initial Secret Name (Optional)"></ui-textfield>
    </ui-form-field>
    <ui-form-field>
      <ui-textfield
        input-type="textarea"
        outlined
        rows="8"
        cols="40"
        class="white-background"
        v-model="initialSecretContent"
        placeholder="Initial Secret Content (Optional)"
      ></ui-textfield>
    </ui-form-field>
    <br />
    <ui-form-field>
      <ui-button @click="createVault" raised>Create</ui-button>
      <ui-button @click="cancel">Cancel</ui-button>
    </ui-form-field>
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
    const vaultsStore = useModule('Vaults')
    const secretsStore = useModule('Secrets')
    const data = reactive({
      vaultName: '',
      initialSecretName: '',
      initialSecretContent: ''
    })
    const createVault = async () => {
      const successful = await PolykeyClient.NewVault(data.vaultName)
      if (data.initialSecretName) {
        const successful = await PolykeyClient.NewSecret({
          secretPath: {
            vaultName: data.vaultName,
            secretName: data.initialSecretName
          },
          secretContent: data.initialSecretContent,
          secretFilePath: ''
        })
      }
      vaultsStore.dispatch('loadVaultNames')
      secretsStore.dispatch('loadSecretNames', data.vaultName)

      console.log(successful)
      router.back()
    }
    const cancel = () => {
      router.back()
    }
    return {
      ...toRefs(data),
      createVault,
      cancel
    }
  }
})
</script>

<style scoped>
.white-background {
  background: white;
}
</style>
