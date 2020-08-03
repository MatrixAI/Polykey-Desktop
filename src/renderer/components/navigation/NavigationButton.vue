<template>
  <v-container>
    <v-row>
      <v-btn class="mx-2" fab dark small :color="color" @click="goToRoute()">
        <v-icon dark>{{faIcon}}</v-icon>
      </v-btn>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { namespace } from "vuex-class";

const drawer = namespace("Drawer");

@Component({
  name: "NavigationButton"
})
export default class NavigationButton extends Vue {
  @Prop(String) faIcon!: string;

  @Prop(String) route!: string;
  private get color(): string {
    if (this.$route.fullPath?.split('/')[1] == this.route) {
      return "secondary"
      } else {
      return "primary"
    }
  }

  private goToRoute() {
    if (this.$route.fullPath != `/${this.route}`) {
      this.$router.replace('/');
      this.$router.replace(this.route);
    }
  }
}
</script>

<style>
</style>
