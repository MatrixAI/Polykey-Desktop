<template>
  <v-card color="FloralWhite" style="margin: 10px;">
    <v-form width="100%" v-model="valid" ref="newVaultForm">
      <v-container fluid width="100%">
        <h2>New Vault - Vault Information</h2>
        <v-row>
          <v-col cols="12" md="12">
            <v-text-field
              v-model="vaultName"
              :rules="vaultNameRules"
              label="Vault Name"
              counter="100"
              required
              outlined
              placeholder="Enter a unique vault Name"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="12">
            <v-list subheader two-line flat outlined>
              <v-subheader>Share with Peers (optional)</v-subheader>
              <v-container fluid>
                <v-list-item-group multiple style="max-height: 300px" class="overflow-y-auto">
                  <v-list-item v-for="item in peerNames" :key="item" flat>
                    <v-checkbox v-model="selectedPeers" :label="item" :value="item"></v-checkbox>
                  </v-list-item>
                </v-list-item-group>
              </v-container>
            </v-list>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-list outlined>
              <v-subheader>Initial Secret (optional)</v-subheader>

              <v-text-field
                v-model="initialSecretName"
                :rules="initialSecretNameRules"
                label="Secret Name"
                counter="100"
                required
                outlined
                style="padding-left: 10px; padding-right: 10px"
                placeholder="Enter a new secret name"
              ></v-text-field>

              <v-textarea
                v-model="initialSecretContent"
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
        <v-btn color="success" @click="newVault">Create</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
