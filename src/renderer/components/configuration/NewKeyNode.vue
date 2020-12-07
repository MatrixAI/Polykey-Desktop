<template>
  <ui-form nowrap className="center">
    <h2>New Keynode</h2>
    <ui-form-field>
      <ui-textfield v-model="userId" placeholder="UserId">UserId</ui-textfield>
    </ui-form-field>
    <ui-form-field>
      <ui-textfield inputType="password" v-model="passphrase" placeholder="Passphrase">Passphrase</ui-textfield>
    </ui-form-field>
    <br />
    <ui-form-field>
      <ui-button @click="createKeyNode" raised>Create</ui-button>
    </ui-form-field>
  </ui-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import PolykeyClient from '@renderer/store/PolykeyClient'
import useModule from '@renderer/store/useModule'

export default defineComponent({
  setup() {
    const userStore = useModule('User')
    const userId = ref('')
    const passphrase = ref('')
    const createKeyNode = async () => {
      const result = await PolykeyClient.NewNode({
        userid: userId.value,
        passphrase: passphrase.value
      })
      if (result) {
        userStore.dispatch('setIsUnlocked', true)
        userStore.dispatch('setIsInitialized', true)
      }
    }
    return {
      userId,
      passphrase,
      createKeyNode
    }
  }
})
</script>

<style scoped>
.center {
  margin-top: 3px;
}
</style>
