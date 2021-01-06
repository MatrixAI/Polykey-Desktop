<template>
  <div>
    <div class="side-panel">
      <h2 style="text-align: center;">Configuration</h2>
      <ui-button raised @click="newNode()">New Node</ui-button>
      <ui-list :type="2" avatar>
        <template v-for="item in nodes">
          <ui-item @click="selectNode(item)">
            <ui-icon :class="iconClass">folder</ui-icon>
            <ui-item-text-content>
              <ui-item-text1>{{ item }}</ui-item-text1>
              <ui-item-text2>Node</ui-item-text2>
            </ui-item-text-content>
            <ui-item-last-content>
              <ui-button raised @click="deleteNode(item)">
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
import { defineComponent } from 'vue'
import PolykeyClient from '@renderer/resources/PolykeyClient'

export default defineComponent({
  setup() {
    // // try to start polykey
    // try {
    //   const pid: number = PolykeyClient.StartAgent()
    //   console.log(`Agent has been started with a pid of: ${pid}`)
    //   // prompt user to unlock polykey node

    //   /** Ask for passphrase or popup*/
    //   const { passphrase } = user.prompt()

    //   await PolykeyClient.RegisterNode(passphrase)

    //   console.log('new node is unlocked and ready to go')
    //   /** Then just close it and user can freely navigate */

    // } catch (error) {

    //   if (error.message.includes('not been initialized')) {
    //     // need to prompt user for new node details
    //     const { userId, passphrase, nbits } = user.prompt()
    //     /** By default 1024 nbits */
    //     /** So only ask for the userId and passphrase */
    //     await PolykeyClient.NewNode({ userId, passphrase, nbits })
    //     console.log('new node is unlocked and ready to go')

    //   } else if (error.message.includes('already running')) {
    //     // polykey agent is already running, prompt for passphrase to unlock
    //     const { passphrase } = user.prompt()
    //     /** popup also */
    //     await PolykeyClient.UnlockNode({ passphrase })
    //     console.log('new node is unlocked and ready to go')
    //   } else {
    //     // some other error
    //     throw Error(`something else went wrong: ${error.message}`)
    //   }
    // }
    return {
      newKeyNode: () => {},
      deleteVault: () => {}
    }
  }
})
// import { Component, Vue, Prop } from 'vue-property-decorator';
// import { namespace } from 'vuex-class';
// import { polykeyClient } from '@renderer/store';
// import { getConfiguration } from '@renderer/store/modules/Configuration';

// const configuration = namespace('Configuration');

// const namingRule = name =>
//   /^\b[\w]+(?:['-]?[\w]+)*\b$/.test(name) || !name || 'Name must only contain letters, numbers and hyphens';

// @Component({})
// export default class Configuration extends Vue {
//   @configuration.State
//   public activeNodePath!: string;

//   @configuration.State
//   public nodePathList!: string[];

//   @configuration.Action
//   public loadNodePathList!: () => Promise<void>;

//   public valid: boolean = false;
//   public secretName = '';
//   public secretNameRules = [namingRule];
//   public secretContent = '';
//   selectedVaultIndex = 0

//   newKeyNode() {
//     this.$router.push('Configuration/NewKeyNode')
//   }

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
//       // const successful = await polykeyClient.createSecret(
//       //   getConfiguration().activeNodePath,
//       //   this.selectedVaultName,
//       //   this.secretName,
//       //   Buffer.from(this.secretContent),
//       // );
//       // console.log(successful);
//       // if (successful) {
//       //   this.$router.back();
//       // }
//     } else {
//       alert('Please address errors');
//     }
//   }

//   cancel() {
//     this.$router.back();
//   }

//   constructor() {
//     super()
//     this.loadNodePathList().then(() => {
//       console.log(this.nodePathList);

//     })
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
