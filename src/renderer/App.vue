<template>
  <v-app id="app" style="background: LightGrey;">
    <v-main style="height:100vh">
      <!-- <Login /> -->
      <Alert />
      <Drawer />
      <AppBar />

      <router-view />

      <Footer />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Alert from "./components/alerts/Alert.vue";
import Login from "./components/navigation/Login.vue";
import AppBar from "./components/navigation/AppBar.vue";
import Drawer from "./components/navigation/Drawer.vue";
import Footer from "./components/navigation/Footer.vue";

import NewVault from "./components/vaults/NewVault.vue";
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { polykeyClient } from "@/store";

const vaults = namespace("Vaults");

@Component({
  components: {
    Alert,
    Login,
    AppBar,
    Drawer,
    NewVault,
    Footer
  }
})
export default class App extends Vue {
  @vaults.Action
  public loadVaultNames!: () => Promise<void>;

  async asyncInit() {
    while ((await polykeyClient.getAgentStatus()) != "online") {
      await new Promise(resolve => setTimeout(() => resolve(), 2000));
    }
    // Load polykey
    const successful = await polykeyClient.registerNode(
      "/home/robbie/.polykey",
      "passphrase"
    );
    if (successful) {
      console.log(`if was successful: ${successful}`);
    }
    await this.loadVaultNames();
  }

  constructor() {
    super();

    this.asyncInit()
  }
}
</script>

<style scoped>
.v-list-item {
  padding-left: 30px;
}
</style>
