import { createApp } from 'vue'
import App from './App.vue';
import router from './router';
import store from './store';

// // this fails because the router and store both use `createRouter/createStore` methods which seem not to work
// createApp(App).use(store).use(router).mount('#app');
createApp(App).mount('#app');
