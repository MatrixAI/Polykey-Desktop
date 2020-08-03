<template>
  <v-snackbar timeout="2000" v-model="snackbar" color="success">
    {{ message }}
    <template v-slot:action="{ attrs }">
      <v-btn color="black" icon v-bind="attrs" @click="snackbar = false">
        <v-icon>fas fa-times</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { namespace } from "vuex-class";
import { Component, Vue, Prop } from "vue-property-decorator";

const alert = namespace("Alert");

@Component({
  name: "Alert"
})
export default class Alert extends Vue {
  @alert.State
  public visible!: boolean;

  @alert.State
  public message!: string;

  @alert.Action
  public toggleAlert!: (props: {visible: boolean, message?: string}) => void;

  public get snackbar(): boolean {
    return this.visible;
  }
  public set snackbar(value: boolean) {
    this.toggleAlert({visible: true});
  }
}
</script>

<style scoped>
</style>
