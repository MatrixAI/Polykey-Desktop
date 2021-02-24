<template>
  <div class="pr-2 relative">
    <Input v-model="vaultName" />
    <div v-if="error" class="absolute text-xs text-red-400 mt-1">{{ error }}</div>
  </div>
  <div><PrimaryButton @click="save">+ CREATE VAULT</PrimaryButton></div>
</template>
<script>
/** Libs */
import PolykeyClient from '@renderer/resources/client';
import { defineComponent, ref, onMounted } from 'vue';
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
    const error = ref('');
    const vaultName = ref('');

    onMounted(() => {
      console.log(this);
    });

    return {
      error,
      vaultName,
      // Save Vault
      save : async () => {
        if(!vaultName.value) {
          error.value = 'Enter a valid vault name.';
          return;
        }
        try {
          const results = await PolykeyClient.NewVault(vaultName.value);
          console.log(results)
          store.dispatch(actions.LoadVaultNames);
        } catch (e) {
          error.value = e;
        }
      }
    };
  }
});
</script>
