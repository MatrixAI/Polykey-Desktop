<template>
  <v-container fluid pa-0 class="d-flex flex-column flex-grow-1 fill-parent-height">
    <v-row no-gutters class="top-row flex-grow-1 flex-shrink-1">
      <v-col class="side-panel fill-parent-height">
        <h2 style="text-align: center;">Keys</h2>
        <v-list :item-height="50" color="transparent">
          <v-subheader>Primary KeyPair</v-subheader>
          <v-list-item-group v-model="selectedKeyIndex" color="primary" mandatory>
            <v-list-item color="primary" link :ripple="false">
              <v-list-item-icon>
                <v-icon>fas fa-key</v-icon>
              </v-list-item-icon>

              <v-list-item-title>Primary</v-list-item-title>

              <v-spacer></v-spacer>
              <v-btn link icon x-small color="warning" disabled>
                <v-icon>fas fa-trash</v-icon>
              </v-btn>
            </v-list-item>
            <v-subheader>
              Keys
              <v-spacer></v-spacer>
              <v-btn color="success" rounded small @click="newKey()">New Key</v-btn>
            </v-subheader>
            <v-list-item v-for="item in keyNames" :key="item" color="primary" link :ripple="false">
              <v-list-item-icon>
                <v-icon>fas fa-key</v-icon>
              </v-list-item-icon>

              <v-list-item-title>{{item}}</v-list-item-title>

              <v-spacer></v-spacer>
              <v-btn link icon x-small color="warning" @click="deleteVault(item)">
                <v-icon>fas fa-trash</v-icon>
              </v-btn>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
      <v-col class="main-panel fill-parent-height">
        <v-card>
          <v-banner single-line>
            <v-layout>
              <v-flex>
                <h3 v-if="selectedKeyIndex == 0">Key Pair - Primary</h3>
                <h3 v-else>Key - {{selectedKeyName}}</h3>
              </v-flex>
            </v-layout>
          </v-banner>
          <KeyPairInformation v-if="selectedKeyIndex == 0" />
          <KeyInformation v-else />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import KeyInformation from '@/components/keys/KeyInformation.vue'
import KeyPairInformation from '@/components/keys/KeyPairInformation.vue'

export default defineComponent({
  components: {
    KeyInformation,
    KeyPairInformation
  },
  setup () {
    const router = useRouter()
    return {
      newKey: () => {
        router.push('/Keys/NewKey')
      },
      deleteVault: () => {}
    }
  }
})

// import { namespace } from 'vuex-class';
// import { polykeyClient } from '@/store';
// import { Component, Vue, Prop } from 'vue-property-decorator';
// import KeyInformation from '@/components/keys/KeyInformation.vue';
// import KeyPairInformation from '@/components/keys/KeyPairInformation.vue';

// const keys = namespace('Keys');

// @Component({
//   components: {
//     KeyInformation,
//     KeyPairInformation,
//   },
// })
// export default class Vaults extends Vue {
//   newKey() {
//     this.$router.push('Keys/NewKey');
//   }

//   deleteKey() {}

//   @keys.Action
//   public loadKeyNames!: () => void;

//   @keys.Action
//   public loadKeyPair!: () => void;

//   @keys.Action
//   public selectKey!: (keyName: string) => void;

//   @keys.State
//   public keyNames!: string[];

//   @keys.State
//   public selectedKeyName!: string;

//   private selectedKeyIndexStore = 0;

//   public get selectedKeyIndex() {
//     console.log(this.selectedKeyIndexStore);

//     if (this.selectedKeyIndexStore == 0) {
//       return 0;
//     }
//     return this.keyNames.indexOf(this.selectedKeyName);
//   }

//   public set selectedKeyIndex(value: number) {
//     this.selectedKeyIndexStore = value;
//     const keyName = this.keyNames[value];
//     this.selectKey(keyName);
//   }

//   @keys.State
//   public publicKey!: string;

//   @keys.State
//   public privateKey!: string;

//   constructor() {
//     super();
//     this.loadKeyNames();
//     this.loadKeyPair();
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
