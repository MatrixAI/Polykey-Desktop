<template>
  <ui-form nowrap>
    <h2>Unlock Key Node</h2>
    <ui-form-field>
      <ui-textfield v-model="passphrase" placeholder="Passphrase">Passphrase</ui-textfield>
    </ui-form-field>
    <br />
    <ui-form-field>
      <ui-button @click="unlockKeyNode" raised>Unlock Key Node</ui-button>
    </ui-form-field>
  </ui-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const passphrase = ref('')
    const unlockKeyNode = () => {}
    return {
      passphrase,
      unlockKeyNode
    }
  }
})
</script>

<style scoped></style>
