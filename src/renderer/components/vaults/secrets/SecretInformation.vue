<template>
  <v-layout style="padding: 10px;">
    <v-flex>
      <v-form v-model="valid" ref="newVaultForm">
        <v-container>
          <v-row>
            <v-col>
              <h4>{{selectedSecretName}}</h4>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea
                v-model="secretContent"
                label="Secret Content"
                required
                :disabled="!edit"
                outlined
                placeholder="Enter the content of the secret"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>

        <v-card-actions>
          <v-btn @click="back" v-if="!edit">Back</v-btn>
          <v-btn @click="cancel" v-else>Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="warning" @click="editSecret" v-if="!edit">Edit</v-btn>
          <v-btn color="success" @click="saveSecret" v-else>Save</v-btn>
        </v-card-actions>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { polykeyClient } from '@/store';

const secrets = namespace('Secrets');

const namingRule = name =>
  /^\b[\w]+(?:['-]?[\w]+)*\b$/.test(name) || !name || 'Name must only contain letters, numbers and hyphens';

@Component({
  name: 'SecretInformation',
})
export default class SecretInformation extends Vue {
  @secrets.State
  public selectedVaultName!: string;

  @secrets.State
  public selectedSecretName!: string;

  @secrets.Action
  public selectSecret!: (secretName: string) => void;

  @secrets.Action
  public updateSecret!: (props: { secretName: string; secretContent: string }) => void;

  @secrets.State
  public selectedSecretContent!: string;
  updatedSecretContent: string = '';
  get secretContent() {
    if (this.edit) {
      return this.updatedSecretContent;
    } else {
      return this.selectedSecretContent;
    }
  }
  set secretContent(value: string) {
    this.updatedSecretContent = value;
  }

  edit: boolean = false;
  editSecret() {
    this.updatedSecretContent = this.selectedSecretContent;
    this.edit = true;
  }
  saveSecret() {
    const x = this.updatedSecretContent;
    console.log(x);

    this.updateSecret({ secretName: this.selectedSecretName, secretContent: this.updatedSecretContent });
    this.edit = false;
  }
  cancel() {
    this.selectSecret(this.selectedSecretName);
    this.edit = false;
  }

  valid: boolean = false;
  secretNameRules = [namingRule];

  validate(): boolean {
    return (<any>this.$refs.newVaultForm).validate();
  }
  reset() {
    (<any>this.$refs.newVaultForm).reset();
  }
  resetValidation() {
    this.reset();
  }

  back() {
    this.selectSecret('');
  }
}
</script>
