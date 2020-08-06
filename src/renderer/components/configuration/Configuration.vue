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

              <v-list-item-title>{{item}}</v-list-item-title>

              <v-spacer></v-spacer>
              <v-btn link icon x-small color="warning" @click="destroyVault(item)">
                <v-icon>fas fa-trash</v-icon>
              </v-btn>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
      <v-col class="main-panel fill-parent-height">
        <!-- <v-card color="FloralWhite" style="position: relative" width="100%">
          <v-form v-model="valid" ref="newVaultForm">
            <v-container>
              <h2>New KeyNode</h2>
              <span>Use this form to initialize a new keynode state</span>
              <v-row>
                <v-col>
                  <v-list outlined>
                    <v-text-field
                      v-model="secretName"
                      :rules="secretNameRules"
                      label="Full Name"
                      counter="100"
                      required
                      outlined
                      style="padding-left: 10px; padding-right: 10px"
                      placeholder="Enter your full name"
                    />

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
        </v-card> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { polykeyClient } from '@/store';
import { getConfiguration } from '@/store/modules/Configuration';

const configuration = namespace('Configuration');

const namingRule = name =>
  /^\b[\w]+(?:['-]?[\w]+)*\b$/.test(name) || !name || 'Name must only contain letters, numbers and hyphens';

@Component({})
export default class Configuration extends Vue {
  @configuration.State
  public activeNodePath!: string;

  @configuration.State
  public nodePathList!: string[];

  @configuration.Action
  public loadNodePathList!: () => Promise<void>;

  public valid: boolean = false;
  public secretName = '';
  public secretNameRules = [namingRule];
  public secretContent = '';
  selectedVaultIndex = 0

  newKeyNode() {
    this.$router.push('Configuration/NewKeyNode')
  }

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
      // const successful = await polykeyClient.createSecret(
      //   getConfiguration().activeNodePath,
      //   this.selectedVaultName,
      //   this.secretName,
      //   Buffer.from(this.secretContent),
      // );
      // console.log(successful);
      // if (successful) {
      //   this.$router.back();
      // }
    } else {
      alert('Please address errors');
    }
  }

  cancel() {
    this.$router.back();
  }

  constructor() {
    super()
    this.loadNodePathList().then(() => {
      console.log(this.nodePathList);

    })
  }
}
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
