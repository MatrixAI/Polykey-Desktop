<template>
  <ui-form nowrap>
    <h2>Register Node</h2>
    <ui-form-field>
      <ui-textfield v-model="passphrase" placeholder="Passphrase">Passphrase</ui-textfield>
    </ui-form-field>
    <br />
    <ui-form-field>
      <ui-button @click="registerNode" raised>Register</ui-button>
    </ui-form-field>
  </ui-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import PolykeyClient from '@/store/PolykeyClient'
import useModule from '@/store/useModule'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const router = useRouter()
    const userStore = useModule('User')
    const passphrase = ref('')
    const registerNode = async () => {
      try {
        /** this seems to be funky how will I know that this user has already registered a node */
        await PolykeyClient.RegisterNode(passphrase.value)
        userStore.dispatch('userIsUnlocked')
        /** Reroute on vaults by default */
        router.push('/Vaults')
      } catch (error) {
        if (error.message.includes('not been initialized')) {
          userStore.dispatch('setUserStatus', 'NewNode')
        } else if (error.message.includes('already running')) {
          userStore.dispatch('setUserStatus', 'UnlockNode')
        } else if (error.message.includes('node is already unlocked')) {
          /** There should be a way to know if done registration on node */
          userStore.dispatch('userIsUnlocked')
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

<style scoped></style>
