<template>
  <div class="vaults-container">
    <div class="side-panel">
      <h2 style="text-align: center;">Keys</h2>
      <ui-button raised @click="newKey()">New Key</ui-button>
      <ui-list :type="2" avatar>
        <template v-for="item in keyNames">
          <ui-item @click="selectKey(item)">
            <ui-icon :class="iconClass">folder</ui-icon>
            <ui-item-text-content>
              <ui-item-text1>{{ item }}</ui-item-text1>
              <ui-item-text2>Key</ui-item-text2>
            </ui-item-text-content>
            <ui-item-last-content>
              <ui-button raised @click="deleteKey(item)">
                <ui-icon>delete</ui-icon>
              </ui-button>
            </ui-item-last-content>
          </ui-item>
        </template>
      </ui-list>
    </div>
    <div class="main-panel"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watchEffect, ref } from 'vue'
import { useRouter } from 'vue-router'
import useModule from '@/store/useModule'
import KeyInformation from '@/components/keys/KeyInformation.vue'
import KeyPairInformation from '@/components/keys/KeyPairInformation.vue'

export default defineComponent({
  components: {
    KeyInformation,
    KeyPairInformation
  },
  setup() {
    const router = useRouter()
    const keysStore = useModule('Keys')
    const keyNames = ref([])

    watchEffect(() => {
      keyNames.value = keysStore.state.keyNames
      console.log('keys', keysStore.state.keyNames)
    })

    const deleteKey = item => {
      keysStore.dispatch('deleteKey', item)
    }

    /** Load vaults */
    keysStore.dispatch('loadKeyNames')

    return {
      newKey: () => {
        router.push('/Keys/NewKey')
      },
      selectKey: () => {},
      deleteKey,
      keyNames
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
