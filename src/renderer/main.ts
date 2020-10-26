import { defineComponent } from 'vue';
import { h, ref, reactive, createApp } from 'vue'
// import App from './App.vue';
// import router from './router';
// import store from './store';

// createApp(App).use(store).use(router).mount('#app');

const App = {
    setup() {
      const count = ref(0)
      const object = reactive({ foo: 'Hello World' })
  
      return () => h('div', [count.value, object.foo])
    }
  }

createApp(App).mount('#app');