<template>
  <v-card color="FloralWhite" style="position: relative" width="100%">
    <ConfirmationDialog />
    <v-container>
      <h2>Vault Information - {{selectedVaultName}}</h2>
      <v-row>
        <v-col cols="12" md="12">
          <v-list subheader two-line flat outlined>
            <v-subheader>
              Secrets
              <v-spacer />
              <v-btn icon large color="success" @click="goToNewSecret">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-subheader>

            <v-list-item-group style="max-height: 300px" class="overflow-y-auto">
              <v-list-item v-for="secret in secretNames" :key="secret">
                <template>
                  <v-list-item-title>{{secret}}</v-list-item-title>
                  <v-list-item-subtitle>Type: text</v-list-item-subtitle>
                  <v-spacer />
                  <v-btn icon color="blue">
                    <v-icon>mdi-file-outline</v-icon>
                  </v-btn>
                  <v-btn icon color="red" @click="deleteSecret">
                    <v-icon>mdi-trash-can</v-icon>
                  </v-btn>
                </template>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
      </v-row>
    </v-container>

    <v-card-actions>
      <v-btn color="warning">Delete</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="success">Edit</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    return {
      selectedVaultName: 'vault',
      goToNewSecret: () => {},
      deleteSecret: () => {}
    }
  }
})

// import { Component, Vue, Prop } from 'vue-property-decorator';
// import { namespace } from 'vuex-class';
// import { polykeyClient } from '../../store';

// import ConfirmationDialog from './ConfirmationDialog.vue';

// const vaults = namespace('Vaults');
// const secrets = namespace('Secrets');
// const confirmationDialog = namespace('ConfirmationDialog');

// @Component({
//   name: 'VaultInformation',
//   components: {
//     ConfirmationDialog,
//   },
// })
// export default class VaultInformation extends Vue {
//   @vaults.State
//   public selectedVaultName!: string;

//   @secrets.State
//   public secretNames!: string[];

//   goToNewSecret() {
//     this.$router.push('/NewSecret');
//   }

//   @confirmationDialog.Action
//   public toggleOpen!: () => void;

//   @confirmationDialog.State
//   public confirmed!: boolean;

//   @confirmationDialog.State
//   public isOpen!: boolean;

//   async deleteSecret(secretName: string) {
//     this.toggleOpen();
//     while (this.isOpen) {
//       await new Promise((resolve, reject) => {
//         setTimeout(() => {
//           resolve();
//         }, 200);
//       });
//     }
//     console.log('heyyyy');
//     console.log(this.confirmed);
//   }

//   constructor() {
//     super();
//   }
// }
</script>
