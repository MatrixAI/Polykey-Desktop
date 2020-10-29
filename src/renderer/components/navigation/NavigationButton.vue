<template>
  <ui-nav-item href="javascript:void(0)" active @click="goToRoute(route)">{{name}}</ui-nav-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  props: {
    faIcon: String,
    route: String,
    name: String
  },
  setup ({ faIcon, route, name }) {
    const router = useRouter()
    return {
      goToRoute: route => {
        router.push(route)
      },
      faIcon,
      route,
      name
    }
  }
})

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

<style></style>
