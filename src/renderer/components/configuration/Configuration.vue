<template>
  <v-card color="FloralWhite" style="position: relative" width="100%">
    <v-form v-model="valid" ref="newVaultForm">
      <v-container>
        <h2>New Secret - {{selectedVaultName}}</h2>
        <v-row>
          <v-col>
            <v-list outlined>
              <v-text-field
                v-model="secretName"
                :rules="secretNameRules"
                label="Secret Name"
                counter="100"
                required
                outlined
                style="padding-left: 10px; padding-right: 10px"
                placeholder="Enter a new secret name"
              ></v-text-field>

              <v-textarea
                v-model="secretContent"
                label="Secret Content"
                required
                outlined
                style="padding-left: 10px; padding-right: 10px"
                placeholder="Enter the content of the secret"
              ></v-textarea>
            </v-list>
          </v-col>
        </v-row>
      </v-container>

      <v-card-actions>
        <v-btn @click="cancel">Cancel</v-btn>
        <v-btn color="warning" @click="resetValidation">Clear</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="success" @click="newSecret">Create</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { polykeyClient } from "../../store";

const vaults = namespace("Vaults");

const namingRule = name =>
  /^\b[\w]+(?:['-]?[\w]+)*\b$/.test(name) ||
  !name ||
  "Name must only contain letters, numbers and hyphens";

@Component({
  name: "NewSecret"
})
export default class NewSecret extends Vue {
  @vaults.State
  public selectedVaultName!: string;

  public valid: boolean = false;
  public secretName = "";
  public secretNameRules = [namingRule];
  public secretContent = "";

  validate(): boolean {
    return (<any>this.$refs.newVaultForm).validate();
  }
  reset() {
    (<any>this.$refs.newVaultForm).reset();
  }
  resetValidation() {
    this.reset();
  }
  async newSecret() {
    if (this.validate()) {
      const successful = await polykeyClient.createSecret(
        "/home/robbie/.polykey",
        this.selectedVaultName,
        this.secretName,
        Buffer.from(this.secretContent)
      );
      console.log(successful);
      if (successful) {
        this.$router.back();
      }
    } else {
      alert("Please address errors");
    }
  }

  cancel() {
    this.$router.back();
  }
}
</script>
