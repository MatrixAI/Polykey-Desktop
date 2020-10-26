import Vue from "vue";
import Vuex from 'vuex'
import App from "@/App.vue";
import router from "renderer-vue2/router";
import store from "renderer-vue2/store";
import vuetify from "renderer-vue2/plugins/vuetify";

Vue.config.productionTip = false;
Vue.use(Vuex)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
