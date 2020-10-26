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
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    faIcon: String,
    route: String,
  },
  setup() {
    const goToRoute = () => {
      console.log('hello');
    };
    return {
      color: 'secondary',
      goToRoute,
    };
  },
});

// export default class NavigationButton extends Vue {
//   @Prop(String) faIcon!: string;

//   @Prop(String) route!: string;
//   private get color(): string {
//     if (this.$route.fullPath?.split('/')[1] == this.route) {
//       return "secondary"
//       } else {
//       return "primary"
//     }
//   }

//   private goToRoute() {
//     if (this.$route.fullPath != `/${this.route}`) {
//       this.$router.replace('/');
//       this.$router.replace(this.route);
//     }
//   }
// }
</script>

<style>
</style>
