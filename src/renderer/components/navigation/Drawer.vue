<template>
  <div>
  <ui-drawer type="modal" nav-id="menu">
    <ui-drawer-header>
      <ui-drawer-title>PolyKey</ui-drawer-title>
      <ui-drawer-subtitle>A peer-to-peer secret sharing and management application</ui-drawer-subtitle>
    </ui-drawer-header>
    <ui-drawer-content>
      <ui-nav>
        <NavigationButton faIcon="lock" route="/Vaults" />
        <NavigationButton faIcon="users" route="/Social" />
        <NavigationButton faIcon="key" route="/Keys" />
        <NavigationButton faIcon="share-alt-square" route="/Sharing" />
      </ui-nav>
    </ui-drawer-content>
  </ui-drawer>
  <ui-drawer-backdrop></ui-drawer-backdrop>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import NavigationButton from './NavigationButton.vue'

export default defineComponent({
  components: {
    NavigationButton
  }
})

// @Options({
//   name: "Drawer",
//   components: {
//     NavigationButton
//   }
// })
// export default class Drawer extends Vue {
//   @drawer.State
//   private isOpen!: boolean;

//   @drawer.Action
//   private toggleDrawer!: (isOpen?: boolean) => void;
//   public set toggleDrawerVModel(isOpen: boolean) {
//     this.toggleDrawer(isOpen);
//   }
//   public get toggleDrawerVModel(): boolean {
//     return this.isOpen;
//   }

//   public isSelected(route: string): boolean {
//     return this.$router.currentRoute.name == route;
//   }

//   created() {
//     this.$vuetify.theme.dark = false;
//   }
// }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
