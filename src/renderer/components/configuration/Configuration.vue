<template>
  <v-container fluid pa-0 class="d-flex flex-column flex-grow-1 fill-parent-height">
    <v-row no-gutters class="top-row flex-grow-1 flex-shrink-1">
      <v-col class="side-panel fill-parent-height">
        <h2 style="text-align: center;">Configuration</h2>

        <v-subheader>Active Key Node</v-subheader>
        <v-select value="~/.polykey" :items="nodePathList" label="Active Key Node" solo style="margin: 10px;" />

        <v-subheader>Key Node List</v-subheader>
        <v-list-item>
          <v-list-item-content>
            <v-btn color="success" rounded small @click="newKeyNode()">New KeyNode</v-btn>
          </v-list-item-content>
        </v-list-item>

        <v-list :item-height="50" color="transparent">
          <v-list-item-group v-model="selectedVaultIndex" color="primary" mandatory>
            <v-list-item v-for="item in nodePathList" :key="item" color="primary" link :ripple="false">
              <v-list-item-icon>
                <v-icon>fas fa-file</v-icon>
              </v-list-item-icon>

              <v-list-item-title>{{ item }}</v-list-item-title>

              <v-spacer></v-spacer>
              <v-btn link icon x-small color="warning" @click="deleteVault(item)">
                <v-icon>fas fa-trash</v-icon>
              </v-btn>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PolykeyClient from '@/store/PolykeyClient'

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
// import { polykeyClient } from '@/store';
// import { getConfiguration } from '@/store/modules/Configuration';

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
