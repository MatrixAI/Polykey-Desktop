<template>
  <v-card color="FloralWhite" style="margin: 10px;">
    <v-form width="100%" v-model="valid" ref="newVaultForm">
      <v-container fluid width="100%">
        <h2>New Vault - Vault Information</h2>
        <v-row>
          <v-col cols="12" md="12">
            <ui-textfield
              v-model="vaultName"
              :rules="vaultNameRules"
              label="Vault Name"
              counter="100"
              required
              outlined
              placeholder="Enter a unique vault Name"
            ></ui-textfield>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="12">
            <v-list subheader two-line flat outlined>
              <v-subheader>Share with Peers (optional)</v-subheader>
              <v-container fluid>
                <v-list-item-group multiple style="max-height: 300px" class="overflow-y-auto">
                  <v-list-item v-for="item in peerNames" :key="item" flat>
                    <v-checkbox v-model="selectedPeers" :label="item" :value="item"></v-checkbox>
                  </v-list-item>
                </v-list-item-group>
              </v-container>
            </v-list>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-list outlined>
              <v-subheader>Initial Secret (optional)</v-subheader>

              <ui-textfield
                v-model="initialSecretName"
                :rules="initialSecretNameRules"
                label="Secret Name"
                counter="100"
                required
                outlined
                style="padding-left: 10px; padding-right: 10px"
                placeholder="Enter a new secret name"
              ></ui-textfield>

              <ui-textfield
                v-model="initialSecretContent"
                label="Secret Content"
                required
                outlined
                style="padding-left: 10px; padding-right: 10px"
                placeholder="Enter the content of the secret"
              ></ui-textfield>
            </v-list>
          </v-col>
        </v-row>
      </v-container>

      <v-card-actions>
        <v-btn @click="cancel">Cancel</v-btn>
        <v-btn color="warning" @click="resetValidation">Clear</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="success" @click="newVault">Create</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    return {
      cancel: () => {},
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
