<template>
  <v-layout style="padding: 10px;">
    <v-flex>
      <v-container>
        <v-row>
          <v-col>
            <v-list outlined>
              <v-textarea
                v-model="publicKey"
                label="Public Key"
                readonly
                outlined
                style="padding-left: 10px; padding-right: 10px"
              />
              <v-textarea
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
import { Component, Vue, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { polykeyClient } from '@/store';

const keys = namespace('Keys');

@Component({})
export default class KeyInformation extends Vue {
  @keys.State
  public publicKey!: string;

  @keys.State
  public privateKey!: string;

  edit: boolean = false;
  editSecret() {
    this.edit = true;
  }
  saveSecret() {
    this.edit = false;
  }
  cancel() {
    this.edit = false;
  }
}
</script>
