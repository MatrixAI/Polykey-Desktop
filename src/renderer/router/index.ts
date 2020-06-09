import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Vaults from '@/components/vaults/Vaults.vue';
import NewVault from '@/components/vaults/NewVault.vue';
import NewSecret from '@/components/vaults/secrets/NewSecret.vue';
import VaultInformation from '@/components/vaults/VaultInformation.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/Vaults",
    component: Vaults,
  },
  {
    path: "/VaultInformation",
    name: "VaultInformation",
    component: VaultInformation
  },
  {
    path: "/Vaults/NewSecret",
    component: NewSecret
  },
  {
    path: "/Vaults/NewVault",
    component: NewVault
  },

];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

router.replace('Vaults')

export default router;
