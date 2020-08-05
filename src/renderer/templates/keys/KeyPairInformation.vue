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
