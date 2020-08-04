<template>
  <v-layout style="padding: 10px;">
    <v-flex>
        <v-form v-model="valid" ref="newVaultForm">
          <v-container>
            <v-row>
              <v-col>
                <v-list outlined>
                  <v-text-field
                    v-model="selectedSecretName"
                    :rules="secretNameRules"
                    label="Secret Name"
                    counter="100"
                    required
                    :disabled="!edit"
                    outlined
                    style="padding-left: 10px; padding-right: 10px"
                    placeholder="Enter a new secret name"
                  ></v-text-field>

                  <v-textarea
                    v-model="selectedSecretContent"
                    label="Secret Content"
                    required
                    :disabled="!edit"
                    outlined
                    style="padding-left: 10px; padding-right: 10px"
                    placeholder="Enter the content of the secret"
                  ></v-textarea>
                </v-list>
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
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { polykeyClient } from "@/store";

const secrets = namespace("Secrets");

const namingRule = name =>
  /^\b[\w]+(?:['-]?[\w]+)*\b$/.test(name) ||
  !name ||
  "Name must only contain letters, numbers and hyphens";

@Component({
})
export default class KeyPairInformation extends Vue {
  @secrets.State
  public selectedVaultName!: string;

  @secrets.State
  public selectedSecretName!: string;
  updatedSecretName: string = this.selectedSecretName
  get secretName() {
    return this.selectedSecretName
  }
  set secretName(value: string) {
    this.updatedSecretName = value
  }

  @secrets.Action
  public selectSecret!: (secretName: string) => void;

  @secrets.State
  public selectedSecretContent!: string;
  updatedSecretContent: string = this.selectedSecretContent
  get secretContent() {
    if (this.edit) {
      return this.selectedSecretContent
    } else {
      return this.updatedSecretContent
    }
  }
  set secretContent(value: string) {
    this.updatedSecretContent = value
  }

  edit: boolean = false
  editSecret() {
    this.edit = true
  }
  saveSecret() {
    this.edit = false
  }
  cancel() {
    this.edit = false
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
    this.selectSecret('')
  }
}
</script>
