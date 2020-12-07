<template>
  <v-layout style="padding: 10px;">
    <v-flex>
      <v-container>
        <v-row>
          <v-col>
            <v-list outlined>
              <ui-textfield
                v-model="publicKey"
                label="Public Key"
                readonly
                outlined
                style="padding-left: 10px; padding-right: 10px"
              />
              <ui-textfield
                v-model="privateKey"
                label="Private Key"
                readonly
                outlined
                style="padding-left: 10px; padding-right: 10px"
              />
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
// import { Component, Vue, Prop } from 'vue-property-decorator';
// import { namespace } from 'vuex-class';
// import { polykeyClient } from '@renderer/store';

// const keys = namespace('Keys');

// @Component({})
// export default class KeyInformation extends Vue {
//   @keys.State
//   public publicKey!: string;

//   @keys.State
//   public privateKey!: string;

//   edit = false;

//   editSecret() {
//     this.edit = true;
//   }

//   saveSecret() {
//     this.edit = false;
//   }

//   cancel() {
//     this.edit = false;
//   }
// }
</script>
