<template>
  <v-layout style="padding: 10px;">
    <v-flex>
        <v-form v-model="valid" ref="newVaultForm">
          <v-container>
            <v-row>
              <v-col>
                <v-list outlined>
                  <ui-textfield
                    v-model="selectedKeyContent"
                    label="Secret Content"
                    required
                    :disabled="!edit"
                    outlined
                    style="padding-left: 10px; padding-right: 10px"
                    placeholder="Enter the content of the secret"
                  ></ui-textfield>
                </v-list>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
// import { Component, Vue, Prop } from "vue-property-decorator";
// import { namespace } from "vuex-class";
// import { polykeyClient } from "@/store";

// const keys = namespace('Keys');

// const namingRule = name =>
//   /^\b[\w]+(?:['-]?[\w]+)*\b$/.test(name) ||
//   !name ||
//   "Name must only contain letters, numbers and hyphens";

// @Component({
// })
// export default class KeyInformation extends Vue {
//   @keys.State
//   public selectedKeyName!: string;

//   @keys.State
//   public selectedKeyContent!: string;

//   edit: boolean = false
//   editSecret() {
//     this.edit = true
//   }
//   saveSecret() {
//     this.edit = false
//   }
//   cancel() {
//     this.edit = false
//   }

//   valid: boolean = false;
//   secretNameRules = [namingRule];

//   validate(): boolean {
//     return (<any>this.$refs.newVaultForm).validate();
//   }
//   reset() {
//     (<any>this.$refs.newVaultForm).reset();
//   }
//   resetValidation() {
//     this.reset();
//   }

//   back() {
//   }
// }
</script>
