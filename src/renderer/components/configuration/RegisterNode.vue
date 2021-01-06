<template>
  <ui-form nowrap className="center">
    <h2>Unlock Node</h2>
    <ui-form-field>
      <ui-textfield inputType="password" v-model="passphrase" placeholder="Passphrase">Passphrase</ui-textfield>
    </ui-form-field>
    <br />
    <ui-form-field>
      <ui-button @click="registerNode" raised>Unlock</ui-button>
    </ui-form-field>
  </ui-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import PolykeyClient from '@renderer/resources/PolykeyClient'
import useModule from '@renderer/store/useModule'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const router = useRouter()
    const userStore = useModule('User')
    const passphrase = ref('')
    const registerNode = async () => {
      try {
        /** this seems to be funky how will I know that this user has already registered a node */
        await PolykeyClient.UnlockNode({ passphrase: passphrase.value, timeout: 0 })
        userStore.dispatch('setIsUnlocked', true)
        userStore.dispatch('setIsInitialized', true)
        /** Reroute on vaults by default */
        router.push('/Vaults')
      } catch (error) {
        if (error.message.includes('node is already unlocked')) {
          /** There should be a way to know if done registration on node */
          userStore.dispatch('setIsUnlocked', true)
          userStore.dispatch('setIsInitialized', true)
          /** Reroute on vaults by default */
          router.push('/Vaults')
        }
      }
    }
    return {
      passphrase,
      registerNode
    }
  }
})
</script>

<style scoped>
.center {
  margin-top: 3px;
}
</style>
