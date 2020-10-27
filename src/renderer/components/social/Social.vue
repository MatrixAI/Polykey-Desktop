<template>
  <ui-grid>
    <ui-grid-cell>
      <ui-grid-cell>
        <h2 style="text-align: center;">Users</h2>
        <ui-list>
          <ui-item-text-content>
            <ui-button color="success" rounded small @click="newVault()">Find</ui-button>
          </ui-item-text-content>
        </ui-list>

        <ui-list :item-height="50" color="transparent">
          <ui-list-group v-model="selectedVaultIndex" color="primary" mandatory>
            <ui-item v-for="item in vaultNames" :key="item" color="primary" link :ripple="false">
              <ui-item-first-content>
                <ui-icon>fas fa-shield-alt</ui-icon>
              </ui-item-first-content>

              <ui-item-text-content>{{ item }}</ui-item-text-content>

              <ui-item-last-content>
                <ui-button link icon x-small color="warning" @click="deleteVault(item)">
                  <ui-icon>fas fa-trash</ui-icon>
                </ui-button>
              </ui-item-last-content>
            </ui-item>
          </ui-list-group>
        </ui-list>
      </ui-grid-cell>

      <!-- <ui-grid-cell>
        <v-card>
          <v-banner single-line>
            <v-layout>
              <v-flex>
                <v-btn-toggle rounded style="background-color: transparent;">
                  <v-list v-for="item in pathList" :key="item.name" style="background-color: transparent;">
                    <v-btn small @click="changeView(item)">
                      <v-icon x-small v-if="item.type == 'vault'">fas fa-shield-alt</v-icon>
                      <v-icon x-small v-else-if="item.type == 'secret'">fas fa-file</v-icon>
                      <v-icon x-small v-else></v-icon>

                      <span style="padding-left: 5px;">{{ item.name }}</span>
                    </v-btn>
                  </v-list>
                </v-btn-toggle>
              </v-flex>
              <v-spacer></v-spacer>
              <v-btn icon small color="success" @click="newSecret">
                <v-icon small>fas fa-plus</v-icon>
              </v-btn>
            </v-layout>
          </v-banner>
          <SecretInformation v-if="pathList[pathList.length - 1].type == 'secret'" />
          <v-list v-else-if="secretNames.length != 0">
            <v-list-item v-for="item in secretNames" :key="item" :ripple="false">
              <v-list-item-icon>
                <v-icon>fas fa-key</v-icon>
              </v-list-item-icon>

              <v-list-item-title>{{ item }}</v-list-item-title>
              <v-spacer></v-spacer>
              <v-btn link icon small color="info" @click="selectSecret(item)">
                <v-icon>fas fa-edit</v-icon>
              </v-btn>
              <v-btn link icon small color="warning" @click="deleteSecret(item)">
                <v-icon>fas fa-trash</v-icon>
              </v-btn>
            </v-list-item>
          </v-list>
          <h4 style="text-align: center;" v-else>No secrets found</h4>
        </v-card>
      </ui-grid-cell>
       -->
    </ui-grid-cell>
  </ui-grid>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    return {
      newVault: () => {},
      deleteVault: () => {}
    }
  }
})

// import { namespace } from 'vuex-class';
// import { polykeyClient } from '@/store';
// import { Component, Vue, Prop } from 'vue-property-decorator';
// import SecretInformation from '@/components/vaults/secrets/SecretInformation.vue';
// import { getConfiguration } from '@/store/modules/Configuration';

// const vaults = namespace('Vaults');
// const secrets = namespace('Secrets');

// @Component({
//   name: 'NewVault',
//   components: {
//     SecretInformation,
//   },
// })
// export default class Vaults extends Vue {
//   newVault() {
//     this.$router.push('Vaults/NewVault');
//   }

//   newSecret() {
//     this.$router.push('Vaults/NewSecret');
//   }

//   async deleteVault(vaultName: string) {
//     await polykeyClient.deleteVault(vaultName);
//     this.loadVaultNames();
//   }

//   async deleteSecret(secretName: string) {
//     console.log(this.secretNames);
//     await polykeyClient.deleteSecret(this.selectedVaultName, secretName);
//     this.loadSecretNames(this.selectedVaultName);
//     console.log(this.secretNames);
//   }

//   public get pathList() {
//     const list = [{ type: 'vault', name: this.selectedVaultName }];
//     if (this.selectedSecretName) {
//       list.push({
//         type: 'secret',
//         name: this.selectedSecretName,
//       });
//     }
//     return list;
//   }

//   @vaults.Action
//   public loadVaultNames!: () => void;

//   @vaults.Action
//   public selectVault!: (vaultName: string) => void;

//   @vaults.State
//   public vaultNames!: string[];

//   @vaults.State
//   public selectedVaultName!: string;

//   public get selectedVaultIndex() {
//     return this.vaultNames.indexOf(this.selectedVaultName);
//   }

//   public set selectedVaultIndex(value: number) {
//     const vaultName = this.vaultNames[value];
//     this.selectVault(vaultName);
//     this.loadSecretNames(vaultName);
//   }

//   @secrets.State
//   public secretNames!: string[];

//   @secrets.Action
//   public loadSecretNames!: (vaultName: string) => void;

//   @secrets.State
//   public selectedSecretName!: string;

//   @secrets.Action
//   public selectSecret!: (secretName: string) => void;

//   constructor() {
//     super();
//     this.loadVaultNames();
//   }
// }
</script>

<style scoped>
.main-panel {
  margin: 10px;
  min-height: 0;
}

.side-panel {
  background-color: rgb(184, 184, 184);
  overflow-y: scroll;
  max-width: 300px;
  min-width: 150px;
}

.fill-parent-height {
  height: 100%;
}

.top-row {
  min-height: 0;
}
</style>
