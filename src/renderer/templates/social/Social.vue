<template>
  <v-container fluid pa-0 class="d-flex flex-column flex-grow-1 fill-parent-height">
    <v-row no-gutters class="top-row flex-grow-1 flex-shrink-1">
      <v-col class="side-panel fill-parent-height">
        <h2 style="text-align: center;">Users</h2>
        <v-list-item>
          <v-list-item-content>
            <v-btn color="success" rounded small @click="newVault()">Find</v-btn>
            <v-btn color="success" rounded small @click="newVault()">Find</v-btn>
          </v-list-item-content>
        </v-list-item>
        <v-list :item-height="50" color="transparent">
          <v-list-item-group v-model="selectedVaultIndex" color="primary" mandatory>
            <v-list-item
              v-for="item in vaultNames"
              :key="item"
              color="primary"
              link
              :ripple="false"
            >
              <v-list-item-icon>
                <v-icon>fas fa-shield-alt</v-icon>
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
        <v-card>
          <v-banner single-line>
            <v-layout>
              <v-flex>
                <v-btn-toggle rounded style="background-color: transparent;">
                  <v-list
                    v-for="item in pathList"
                    :key="item.name"
                    style="background-color: transparent;"
                  >
                    <v-btn small @click="changeView(item)">
                      <v-icon x-small v-if="item.type == 'vault'">fas fa-shield-alt</v-icon>
                      <v-icon x-small v-else-if="item.type == 'secret'">fas fa-file</v-icon>
                      <v-icon x-small v-else></v-icon>

                      <span style="padding-left: 5px;">{{item.name}}</span>
                    </v-btn>
                  </v-list>
                </v-btn-toggle>
              </v-flex>
              <v-spacer></v-spacer>
              <v-btn icon small color="success" @click="newSecret">
                <v-icon small>fas fa-plus</v-icon>
              </v-btn>
            </v-layout>
          </v-banner>
          <SecretInformation v-if="pathList[pathList.length-1].type == 'secret'" />
          <v-list v-else-if="secretNames.length != 0">
            <v-list-item
              v-for="item in secretNames"
              :key="item"
              :ripple="false"
            >
              <v-list-item-icon>
                <v-icon>fas fa-key</v-icon>
              </v-list-item-icon>

              <v-list-item-title>{{item}}</v-list-item-title>
              <v-spacer></v-spacer>
              <v-btn link icon small color="info" @click="selectSecret(item)">
                <v-icon>fas fa-edit</v-icon>
              </v-btn>
              <v-btn link icon small color="warning" @click="destroySecret(item)">
                <v-icon>fas fa-trash</v-icon>
              </v-btn>
            </v-list-item>
          </v-list>
          <h4 style="text-align: center;" v-else>No secrets found</h4>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
