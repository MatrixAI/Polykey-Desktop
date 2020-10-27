<template>
  <v-card color="FloralWhite" style="margin: 10px;">
    <v-form width="100%" v-model="valid" ref="newVaultForm">
      <v-container fluid width="100%">
          <h2>New Secret - {{selectedVaultName}}</h2>
        <v-row>
          <v-col>
            <v-list outlined>
              <ui-textfield
                v-model="secretName"
                :rules="secretNameRules"
                label="Secret Name"
                counter="100"
                required
                outlined
                style="padding-left: 10px; padding-right: 10px"
                placeholder="Enter a new secret name"
              />

              <ui-textfield
                v-model="secretContent"
                label="Secret Content"
                required
                outlined
                style="padding-left: 10px; padding-right: 10px"
                placeholder="Enter the content of the secret"
              />
            </v-list>
          </v-col>
        </v-row>
      </v-container>

      <v-card-actions>
        <v-btn @click="cancel">Cancel</v-btn>
        <v-btn color="warning" @click="resetValidation">Clear</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="success" @click="newSecret">Create</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup () {
    const router = useRouter()
    return {
      selectedVaultName: 'test',
      cancel: () => {
        router.back()
      },
      resetValidation: () => {},
      newVault: () => {}
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
