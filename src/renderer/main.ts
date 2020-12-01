import devtools from '@vue/devtools'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import '@/assets/index.css'

console.log('connecting')
devtools.connect('http://localhost', 8098)

createApp(App)
  .use(Antd)
  .use(store)
  .use(router)
  .mount('#app')
