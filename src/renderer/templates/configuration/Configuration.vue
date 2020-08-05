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
