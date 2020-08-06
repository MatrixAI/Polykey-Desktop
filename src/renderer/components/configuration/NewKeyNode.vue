<template>
  <v-card color="FloralWhite" style="margin: 10px;">
    <v-form width="100%" v-model="valid" ref="newKeyNodeForm">
      <v-container fluid width="100%">
        <h2>New KeyNode</h2>
        <span>Use this form to initialize a new keynode state</span>
        <v-row>
          <v-col>
            <v-list outlined>
              <v-text-field
                v-model="fullName"
                :rules="nameRules"
                label="Full Name"
                counter="100"
                required
                outlined
                style="padding-left: 10px; padding-right: 10px"
                placeholder="Enter your full name"
              />

              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Email"
                counter="100"
                required
                outlined
                style="padding-left: 10px; padding-right: 10px"
                placeholder="Enter your email"
              />

              <v-text-field
                v-model="passphrase"
                :rules="passphraseRules"
                label="Passphrase"
                counter="100"
                required
                type="password"
                outlined
                style="padding-left: 10px; padding-right: 10px"
                placeholder="Enter a passphrase to secure your private key"
              />

              <v-text-field
                v-model="nodePath"
                :rules="nodePathRules"
                label="New Key Node Path"
                required
                outlined
                style="padding-left: 10px; padding-right: 10px"
                placeholder="Provide the path to the new key node directory"
              >
                <template v-slot:append>
                  <v-btn icon small @click.native="openFileDialog()">
                    <v-icon>fas fa-folder-open</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </v-list>
          </v-col>
        </v-row>
      </v-container>

      <v-card-actions>
        <v-btn @click="cancel">Cancel</v-btn>
        <v-btn color="warning" @click="resetValidation">Clear</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="success" @click="newKeyNode">Create</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import path from 'path';
import { namespace } from 'vuex-class';
import { polykeyClient } from '@/store';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { getConfiguration } from '@/store/modules/Configuration';
const remote = window.require('electron').remote;
const { app, dialog, getCurrentWindow } = remote;
const fs = remote.require('fs');

const alert = namespace('Alert');

const namingRule = name =>
  /^\b[\w]+(?:['-]?[\w]+)*\b$/.test(name) || !name || 'Name must only contain letters, numbers and hyphens';
const emailRule = email =>
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
    email,
  ) ||
  !email ||
  'Email is invalid';

@Component({})
export default class NewSecret extends Vue {
  @alert.Action
  public toggleAlert!: (props: { visible: boolean; message?: string }) => void;

  valid = false;
  fullName = '';
  nameRules = [namingRule];
  email = '';
  emailRules = [emailRule];
  passphrase = '';
  passphraseRules = [passphrase => !passphrase || 'Passphrase is required'];

  nodePath: string = path.join(app.getPath('home'), '.polykey');
  nodePathRules = [
    path => !fs.existsSync(path) || fs.readdirSync(path).length == 0 || 'Path already exists and is not empty',
  ];

  validate(): boolean {
    return (<any>this.$refs.newKeyNodeForm).validate();
  }
  reset() {
    (<any>this.$refs.newKeyNodeForm).reset();
  }
  resetValidation() {
    this.reset();
  }
  async newKeyNode() {
    if (this.validate()) {
      const successful = await polykeyClient.newNode(this.nodePath, this.fullName, this.email, this.passphrase);
      if (successful) {
        this.$router.back();
      }
    } else {
      this.toggleAlert({
        visible: true,
        message: 'Please check form errors',
      });
    }
  }

  cancel() {
    this.$router.back();
  }

  async openFileDialog() {
    //Synchronous
    const result = await dialog.showOpenDialog(getCurrentWindow(), {
      title: 'Select New Key Node Location',
      defaultPath: this.nodePath,
      buttonLabel: 'Select',
      properties: ['openDirectory', 'createDirectory', 'showHiddenFiles', 'promptToCreate'],
    });
    if (!result.canceled) {
      this.nodePath = result.filePaths[0];
    }
    console.log(result.bookmarks);
    console.log(result.filePaths);
  }
}
</script>

<style scoped>
</style>
