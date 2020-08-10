<template>
  <v-row justify="center">
    <v-dialog v-model="isOpen" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Delete this secret?</v-card-title>
        <v-card-text>Are you sure you wan to delete this secret?</v-card-text>
        <v-card-actions>
          <v-btn text @click="toggleOpen(false)">Cancel</v-btn>
          <v-spacer />
          <v-btn color="red" text @click="confirm">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import {namespace} from 'vuex-class'

const confirmationDialog = namespace("ConfirmationDialog")

@Component({
  name: "ConfirmationDialog",
})
export default class ConfirmationDialog extends Vue {
  @confirmationDialog.State
  public isOpen!: boolean

  @confirmationDialog.Action
  public confirm!: () => void

  @confirmationDialog.Action
  public toggleOpen!: () => void
}
</script>
