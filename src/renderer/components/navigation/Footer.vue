<template>
  <v-footer color="primary" dark class="justify-center pl-0" inset app>
    <v-spacer></v-spacer>
    <span>
      ©
      <a style="color: inherit;" href="https://matrix.ai" target="_blank">MatrixAI</a>
      2020 - Version 0.0.1
    </span>
  </v-footer>
</template>

<script lang="ts">
import { namespace } from 'vuex-class';
import { Component, Vue, Prop } from 'vue-property-decorator';

const drawer = namespace('Drawer');

@Component({
  name: 'NavigationButton',
})
export default class NavigationButton extends Vue {
  @drawer.Action
  public toggleDrawer!: () => void;
}
</script>

<style>
</style>
