<template>
  <v-navigation-drawer
    v-model="toggleDrawerVModel"
    mobile-breakpoint="0"
    app
    clipped
    mini-variant
    color="primary"
  >
    <NavigationButton faIcon="fas fa-lock" route="Vaults" />
    <NavigationButton faIcon="fas fa-users" route="Social" />
    <NavigationButton faIcon="fas fa-key" route="Keys" />
    <NavigationButton faIcon="fas fa-share-alt-square" route="Sharing" />
    <template v-slot:append>
      <NavigationButton faIcon="fas fa-cogs" route="Configuration" />
    </template>
  </v-navigation-drawer>
</template>
<script lang="ts">
import NavigationButton from "./NavigationButton.vue";
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";

const drawer = namespace("Drawer");

@Component({
  name: "Drawer",
  components: {
    NavigationButton
  }
})
export default class Drawer extends Vue {
  @drawer.State
  private isOpen!: boolean;

  @drawer.Action
  private toggleDrawer!: (isOpen?: boolean) => void;
  public set toggleDrawerVModel(isOpen: boolean) {
    this.toggleDrawer(isOpen);
  }
  public get toggleDrawerVModel(): boolean {
    return this.isOpen;
  }

  public isSelected(route: string): boolean {
    return this.$router.currentRoute.name == route;
  }

  created() {
    this.$vuetify.theme.dark = false;
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
