<template>
  <div class="pr-2"><Input v-model="vaultName" /></div>
  <div><PrimaryButton @click="save">+ CREATE VAULT</PrimaryButton></div>
</template>
<script>
/** Libs */
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';

/** Components */
import Input from '@renderer/atoms/input/Input.vue';
import PrimaryButton from '@renderer/atoms/button/PrimaryButton.vue';

/** Store */
import { actions } from '@renderer/store/modules/Vaults';

export default defineComponent({
  components: {
    Input,
    PrimaryButton
  },
  setup() {
    const store = useStore();

    const vaultName = ref('');

    return {
      vaultName,
      // Save Vault
      save() {
        store.dispatch(actions.NewVault, vaultName.value);
      }
    };
  }
});
</script>
