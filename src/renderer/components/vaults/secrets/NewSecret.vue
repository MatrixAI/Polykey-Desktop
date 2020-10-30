<template>
  <ui-form nowrap>
    <h2>Create Secret</h2>
    <ui-form-field>
      <ui-textfield v-model="secretName" placeholder="Enter a new secret name"></ui-textfield>
    </ui-form-field>
    <ui-form-field>
      <ui-textfield v-model="secretContent" placeholder="Enter the content of the secret"></ui-textfield>
    </ui-form-field>
    <br />
    <ui-form-field>
      <ui-button @click="saveSecret" raised>Save</ui-button>
      <ui-button @click="cancel">Cancel</ui-button>
    </ui-form-field>
  </ui-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import PolykeyClient from '@/store/PolykeyClient'
import useModule from '@/store/useModule'

export default defineComponent({
  setup() {
    const router = useRouter()
    const vaultsStore = useModule('Vaults')
    const secretsStore = useModule('Secrets')
    const secretName = ref('')
    const secretContent = ref('')

    const saveSecret = async () => {
      const successful = await PolykeyClient.NewSecret({
        secretPath: {
          vaultName: vaultsStore.state.selectedVaultName,
          secretName: secretName.value
        },
        secretContent: secretContent.value,
        secretFilePath: ''
      })

      secretsStore.dispatch('loadSecretNames', vaultsStore.state.selectedVaultName)
      if (successful) {
        return router.back()
      }
    }
    const cancel = () => {
      router.back()
    }
    return {
      secretName,
      secretContent,
      saveSecret,
      cancel
    }
  }
})
// import { Component, Vue, Prop } from 'vue-property-decorator';
// import { namespace } from 'vuex-class';
// import { polykeyClient } from '@/store';
// import { getConfiguration } from '@/store/modules/Configuration';

// const vaults = namespace('Vaults');
// const secrets = namespace('Secrets');
// const alert = namespace('Alert');

// const namingRule = name =>
//   /^\b[\w]+(?:['-]?[\w]+)*\b$/.test(name) || !name || 'Name must only contain letters, numbers and hyphens';

// @Component({
//   name: 'NewSecret',
// })
// export default class NewSecret extends Vue {
//   @vaults.State
//   public selectedVaultName!: string;

//   @secrets.Action
//   loadSecretNames!: (vaultName: string) => void

//   @alert.Action
//   public toggleAlert!: (props: { visible: boolean; message?: string }) => void;

//   public valid: boolean = false;
//   public secretName = '';
//   public secretNameRules = [namingRule];
//   public secretContent = '';

//   validate(): boolean {
//     return (<any>this.$refs.newVaultForm).validate();
//   }
//   reset() {
//     (<any>this.$refs.newVaultForm).reset();
//   }
//   resetValidation() {
//     this.reset();
//   }
//   async newSecret() {
//     if (this.validate()) {
//       const successful = await polykeyClient.createSecret(
//         this.selectedVaultName,
//         this.secretName,
//         Buffer.from(this.secretContent),
//       );
//       if (successful) {
//         this.loadSecretNames(this.selectedVaultName)
//         this.$router.back();
//       }
//     } else {
//       this.toggleAlert({
//         visible: true,
//         message: 'Please check form errors',
//       });
//     }
//   }

//   cancel() {
//     this.$router.back();
//   }
// }
</script>
