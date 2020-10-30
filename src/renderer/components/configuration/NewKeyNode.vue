<template>
  <ui-form nowrap>
    <h2>New Keynode</h2>
    <ui-form-field>
      <ui-textfield v-model="userId" placeholder="UserId">UserId</ui-textfield>
    </ui-form-field>
    <ui-form-field>
      <ui-textfield v-model="passphrase" placeholder="Passphrase">Passphrase</ui-textfield>
    </ui-form-field>
    <ui-form-field>
      <ui-textfield v-model="nbits" placeholder="Nbits">nbits</ui-textfield>
    </ui-form-field>
    <br />
    <ui-form-field>
      <ui-button @click="createKeyNode" raised>Create</ui-button>
    </ui-form-field>
  </ui-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import PolykeyClient from '@/store/PolykeyClient'
import useModule from '@/store/useModule'

export default defineComponent({
  setup() {
    const userStore = useModule('User')
    const userId = ref('')
    const passphrase = ref('')
    const nbits = ref(1024)
    const createKeyNode = async () => {
      const result = await PolykeyClient.NewNode({
        userid: userId.value,
        passphrase: passphrase.value,
        nbits: nbits.value
      })
      if (result) {
        userStore.dispatch('userIsUnlocked')
      }
    }
    return {
      userId,
      passphrase,
      nbits,
      createKeyNode
    }
  }
})
// import path from 'path';
// import { namespace } from 'vuex-class';
// import { polykeyClient } from '@/store';
// import { Component, Vue, Prop } from 'vue-property-decorator';
// import { getConfiguration } from '@/store/modules/Configuration';
// // const remote = window.require('electron').remote;
// // const { app, dialog, getCurrentWindow } = remote;
// // const fs = remote.require('fs');

// const alert = namespace('Alert');

// // const namingRule = name =>
// //   /^\b[\w]+(?:['-]?[\w]+)*\b$/.test(name) || !name || 'Name must only contain letters, numbers and hyphens';
// const emailRule = email =>
//   /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
//     email,
//   ) ||
//   !email ||
//   'Email is invalid';

// @Component({})
// export default class NewSecret extends Vue {
//   @alert.Action
//   public toggleAlert!: (props: { visible: boolean; message?: string }) => void;

//   valid = false;
//   fullName = '';
//   nameRules = [];
//   email = '';
//   emailRules = [emailRule];
//   passphrase = '';
//   // passphraseRules = [passphrase => passphrase || 'Passphrase is required'];
//   passphraseRules = [];

//   // nodePath: string = path.join(app.getPath('home'), '.polykey');
//   // nodePathRules = [
//   //   path => !fs.existsSync(path) || fs.readdirSync(path).length == 0 || 'Path already exists and is not empty',
//   // ];

//   validate(): boolean {
//     return (<any>this.$refs.newKeyNodeForm).validate();
//   }
//   reset() {
//     (<any>this.$refs.newKeyNodeForm).reset();
//   }
//   resetValidation() {
//     this.reset();
//   }
//   async newKeyNode() {
//     // TODO: remove this as you no longer have to create a node
//   }

//   cancel() {
//     this.$router.back();
//   }

//   async openFileDialog() {
//     //Synchronous
//     // const result = await dialog.showOpenDialog(getCurrentWindow(), {
//     //   title: 'Select New Key Node Location',
//     //   defaultPath: this.nodePath,
//     //   buttonLabel: 'Select',
//     //   properties: ['openDirectory', 'createDirectory', 'showHiddenFiles', 'promptToCreate'],
//     // });
//     // if (!result.canceled) {
//     //   this.nodePath = result.filePaths[0];
//     // }
//     // console.log(result.bookmarks);
//     // console.log(result.filePaths);
//   }
// }
</script>

<style scoped></style>
