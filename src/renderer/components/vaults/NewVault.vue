<template>
  <ui-form nowrap>
    <h2>New Vault</h2>
    <ui-form-field>
      <ui-textfield v-model="vaultName" placeholder="Vault Name"></ui-textfield>
    </ui-form-field>
    <ui-form-field>
      <ui-textfield v-model="initialSecretName" placeholder="Initial Secret Name"></ui-textfield>
    </ui-form-field>
    <ui-form-field>
      <ui-textfield v-model="initialSecretContent" placeholder="Initial Secret Content"></ui-textfield>
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
    const data = reactive({
      vaultName: '',
      initialSecretName: '',
      initialSecretContent: ''
    })
    const createVault = async () => {
      const successful = await PolykeyClient.NewVault(data.vaultName)
      vaultsStore.dispatch('loadVaultNames')
      // if (data.initialSecretName) {
      //   const successful = await PolykeyClient.CreateSecret(
      //     data.vaultName,
      //     data.initialSecretName,
      //     Buffer.from(data.initialSecretContent)
      //   )
      // }

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

// import { Component, Vue, Prop } from 'vue-property-decorator';
// import { namespace } from 'vuex-class';
// import { polykeyClient } from '@/store';
// import { getConfiguration } from '@/store/modules/Configuration';

// const vaults = namespace('Vaults');
// const alert = namespace('Alert');

// const namingRule = name =>
//   /^\b[\w]+(?:['-]?[\w]+)*\b$/.test(name) || !name || 'Name must only contain letters, numbers and hyphens';

// @Component({
//   name: 'NewVault',
// })
// export default class NewVault extends Vue {
//   @vaults.Action
//   public loadVaultNames!: () => void;

//   @alert.Action
//   public toggleAlert!: (props: { visible: boolean; message?: string }) => void;

//   public valid: boolean = false;
//   public vaultName = '';
//   public vaultNameRules = [name => !!name || 'Vault name is required', namingRule];
//   public peerNames = ['@github/morty-smith', '@github/jerry-smith'];
//   public selectedPeers = [''];
//   public initialSecretName = '';
//   public initialSecretNameRules = [namingRule];
//   public initialSecretContent = '';

//   validate(): boolean {
//     return (<any>this.$refs.newVaultForm).validate();
//   }
//   reset() {
//     (<any>this.$refs.newVaultForm).reset();
//   }
//   resetValidation() {
//     this.reset();
//   }
//   cancel() {
//     this.$router.back();
//   }
//   async newVault() {
//     if (this.validate()) {
//       const successful = await polykeyClient.newVault(this.vaultName);

//       this.loadVaultNames();
//       // Add a new secret if one was provided
//       if (this.initialSecretName) {
//         const successful = await polykeyClient.createSecret(
//           this.vaultName,
//           this.initialSecretName,
//           Buffer.from(this.initialSecretContent),
//         );
//       }

//       // Go back
//       this.toggleAlert({
//         visible: true,
//         message: `New Vault created at ${'/home/robbie/.polykey/' + this.vaultName}`,
//       });
//       this.$router.back();
//     } else {
//       this.toggleAlert({
//         visible: true,
//         message: "Please check form errors"
//       });
//     }
//   }
// }
</script>
