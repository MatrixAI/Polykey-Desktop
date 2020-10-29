<template>
  <div color="FloralWhite" style="margin: 10px;">
    <v-container fluid pa-0 class="d-flex flex-column flex-grow-1 fill-parent-height">
      <v-row no-gutters class="top-row flex-grow-1 flex-shrink-1">
        <v-col class="side-panel fill-parent-height">
          <h2 style="text-align: center;">Vaults</h2>
          <v-list-item>
            <v-list-item-content>
              <ui-button raised @click="newVault()">New Vault</ui-button>
            </v-list-item-content>
          </v-list-item>
          <v-list :item-height="50" color="transparent">
            <v-list-item-group v-model="selectedVaultIndex" color="primary" mandatory>
              <v-list-item v-for="item in vaultNames" :key="item" color="primary" link :ripple="false">
                <v-list-item-icon>
                  <v-icon>fas fa-shield-alt</v-icon>
                </v-list-item-icon>

                <v-list-item-title>{{ item }}</v-list-item-title>

                <v-spacer></v-spacer>
                <ui-button raised @click="deleteVault(item)">
                  <ui-icon>delete</ui-icon>
                </ui-button>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
        <v-col class="main-panel fill-parent-height">
          <v-card v-if="vaultNames.length != 0">
            <v-banner single-line>
              <v-layout>
                <v-flex>
                  <ui-button-toggle rounded style="background-color: transparent;">
                    <v-list v-for="item in pathList" :key="item.name" style="background-color: transparent;">
                      <ui-button small @click="changeView(item)">
                        <v-icon x-small v-if="item.type == 'vault'">fas fa-shield-alt</v-icon>
                        <v-icon x-small v-else-if="item.type == 'secret'">fas fa-file</v-icon>
                        <v-icon x-small v-else></v-icon>

                        <span style="padding-left: 5px;">{{ item.name }}</span>
                      </ui-button>
                    </v-list>
                  </ui-button-toggle>
                </v-flex>
                <v-spacer></v-spacer>
                <ui-button raised @click="newSecret"> <v-icon small>fas fa-plus</v-icon>Add Secret </ui-button>
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
                <ui-button raised @click="selectSecret(item)">
                  <v-icon>fas fa-edit</v-icon>
                </ui-button>
                <ui-button raised @click="deleteSecret(item)">
                  <v-icon>fas fa-trash</v-icon>
                </ui-button>
              </v-list-item>
            </v-list>
            <h4 style="text-align: center;" v-else>No secrets found</h4>
          </v-card>
          <div v-else>
            <h3 style="text-align: center;">No Vault Found</h3>
            <h5 style="text-align: center; color: grey;">Please create one</h5>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const router = useRouter();
    const vaultNames = reactive([]);
    const newVault = () => {
      router.push('/Vaults/NewVault');
    };
    const newSecret = () => {
      router.push('/Vaults/NewSecret');
    };
    const deleteVault = (vaultName: string) => {
      console.log(vaultName);
    };
    const deleteSecret = (secretName: string) => {
      console.log(secretName);
    };
    return {
      newVault,
      newSecret,
      deleteVault,
      deleteSecret,
      vaultNames,
    };
  },
});
// import { namespace } from 'vuex-class';
// import { polykeyClient } from '@/store';
// import { Component, Vue, Prop } from 'vue-property-decorator';
// import SecretInformation from '@/components/vaults/secrets/SecretInformation.vue';
// import { getConfiguration } from '@/store/modules/Configuration';

// const vaults = namespace('Vaults');
// const secrets = namespace('Secrets');

// @Component({
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
