<template>
  <div class="vaults-container">
    <div class="side-panel">
      <h2 style="text-align: center;">Vaults</h2>
      <ui-button raised @click="newVault()">New Vault</ui-button>
      <ui-list :type="2" avatar>
        <template v-for="item in vaultNames">
          <ui-item @click="selectVault(item)">
            <ui-icon :class="iconClass">folder</ui-icon>
            <ui-item-text-content>
              <ui-item-text1>{{ item }}</ui-item-text1>
              <ui-item-text2>Vault</ui-item-text2>
            </ui-item-text-content>
            <ui-item-last-content>
              <ui-button raised @click="deleteVault(item)">
                <ui-icon>delete</ui-icon>
              </ui-button>
            </ui-item-last-content>
          </ui-item>
        </template>
      </ui-list>
    </div>
    <div class="main-panel">

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watchEffect, ref } from 'vue'
import { useRouter } from 'vue-router'
import useModule from '@/store/useModule'

export default defineComponent({
  setup() {
    const vaultsStore = useModule('Vaults')
    const router = useRouter()
    const vaultNames = ref([])

    watchEffect(() => {
      vaultNames.value = vaultsStore.state.vaultNames
      console.log('vaults', vaultsStore.state.vaultNames)
    })

    const newVault = () => {
      router.push('/Vaults/NewVault')
    }
    const newSecret = () => {
      router.push('/Vaults/NewSecret')
    }
    const deleteVault = (vaultName: string) => {
      vaultsStore.dispatch('deleteVault', vaultName)
    }
    const deleteSecret = (secretName: string) => {
      console.log(secretName)
    }
    const selectVault = (vault) => {
      console.log(vault)
    }

    /** Load vaults */
    vaultsStore.dispatch('loadVaultNames')

    return {
      newVault,
      newSecret,
      selectVault,
      deleteVault,
      deleteSecret,
      vaultNames
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
  background: white;
  float: left;
  height: 100vh;
  width: calc(100% - 300px);
}

.side-panel {
  float: left;
  background-color: rgb(184, 184, 184);
  overflow-y: scroll;
  width: 300px;
  height: 100vh;
}
</style>
