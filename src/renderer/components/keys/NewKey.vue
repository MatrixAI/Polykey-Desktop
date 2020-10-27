<template>
  <v-card color="FloralWhite" style="margin: 10px;">
    <v-form width="100%" v-model="valid" ref="newKeyForm">
      <v-container fluid width="100%">
        <h2>New Key</h2>
        <v-row>
          <v-col>
            <v-list outlined>
              <ui-textfield
                v-model="keyName"
                :rules="keyNameRules"
                label="Key Name"
                counter="100"
                required
                outlined
                style="padding-left: 10px; padding-right: 10px"
                placeholder="Enter a new key name"
              ></ui-textfield>

              <ui-textfield
                v-model="keyPassphrase"
                label="Key Passphrase"
                counter="100"
                required
                outlined
                type="password"
                style="padding-left: 10px; padding-right: 10px"
                placeholder="Enter a passphrase to protect the key"
              ></ui-textfield>
            </v-list>
          </v-col>
        </v-row>
      </v-container>

      <v-card-actions>
        <v-btn @click="cancel">Cancel</v-btn>
        <v-btn color="warning" @click="resetValidation">Clear</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="success" @click="newKey">Create</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    return {
      resetValidation: () => {},
      newKey: () => {}
    }
  }
})
// import { Component, Vue, Prop } from 'vue-property-decorator';
// import { namespace } from 'vuex-class';
// import { polykeyClient } from '@/store';
// import { getConfiguration } from '@/store/modules/Configuration';

// const alert = namespace('Alert');

// const namingRule = name =>
//   /^\b[\w]+(?:['-]?[\w]+)*\b$/.test(name) || !name || 'Name must only contain letters, numbers and hyphens';

// @Component({
//   name: 'NewSecret',
// })
// export default class NewSecret extends Vue {
//   @alert.Action
//   public toggleAlert!: (props: { visible: boolean; message?: string }) => void;

//   public valid: boolean = false;
//   public keyName = '';
//   public keyNameRules = [namingRule];
//   public keyPassphrase = '';

//   validate(): boolean {
//     return (<any>this.$refs.newKeyForm).validate();
//   }
//   reset() {
//     (<any>this.$refs.newKeyForm).reset();
//   }
//   resetValidation() {
//     this.reset();
//   }
//   async newKey() {
//     if (this.validate()) {
//       const successful = await polykeyClient.deriveKey(
//         this.keyName,
//         this.keyPassphrase,
//       );
//       if (successful) {
//         this.$router.back();
//       }
//     } else {
//       this.toggleAlert({
//         visible: true,
//         message: 'Please check form errors',
//       });
//     }
//   }

//   cancel() {
//     this.$router.back();
//   }
// }
</script>
